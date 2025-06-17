import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const heartRef = useRef<THREE.Mesh>();
  const particlesRef = useRef<THREE.Points>();
  const frameRef = useRef<number>();
  const raycasterRef = useRef<THREE.Raycaster>();
  
  // Mouse interaction state
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMouseDownRef = useRef(false);
  const rotationRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  
  // Animation controls
  const [isAnimating, setIsAnimating] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showApology, setShowApology] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 6);
    cameraRef.current = camera;

    // Raycaster for click detection
    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create heart shape using a more reliable method
    const createHeartGeometry = () => {
      const heartShape = new THREE.Shape();
      
      // Create heart shape with proper scaling
      const x = 0, y = 0;
      heartShape.moveTo(x + 5, y + 5);
      heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
      heartShape.bezierCurveTo(x - 6, y, x - 6, y + 3.5, x - 6, y + 3.5);
      heartShape.bezierCurveTo(x - 6, y + 5.5, x - 4, y + 7.7, x + 5, y + 9.5);
      heartShape.bezierCurveTo(x + 14, y + 7.7, x + 16, y + 5.5, x + 16, y + 3.5);
      heartShape.bezierCurveTo(x + 16, y + 3.5, x + 16, y, x + 10, y);
      heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

      const extrudeSettings = {
        depth: 2,
        bevelEnabled: true,
        bevelSegments: 8,
        steps: 2,
        bevelSize: 0.5,
        bevelThickness: 0.3
      };

      const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
      geometry.center();
      geometry.computeBoundingBox();
      
      return geometry;
    };

    // Create heart geometry and material
    const heartGeometry = createHeartGeometry();
    const heartMaterial = new THREE.MeshPhongMaterial({
      color: 0xff1744,
      emissive: 0x220011,
      emissiveIntensity: 0.2,
      shininess: 100,
      transparent: false,
      side: THREE.DoubleSide
    });

    // Create heart mesh
    const heart = new THREE.Mesh(heartGeometry, heartMaterial);
    heart.castShadow = true;
    heart.receiveShadow = true;
    heart.scale.set(0.3, 0.3, 0.3);
    scene.add(heart);
    heartRef.current = heart;

    // Create particle system
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Create particles in a sphere around the heart
      const radius = Math.random() * 12 + 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Varied colors from pink to red
      const colorVariation = Math.random();
      colors[i * 3] = 1;
      colors[i * 3 + 1] = colorVariation * 0.4;
      colors[i * 3 + 2] = colorVariation * 0.6;
      
      sizes[i] = Math.random() * 2 + 0.5;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xff6b9d, 1.2);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xff1744, 1.5, 15);
    pointLight1.position.set(3, 2, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4db6e6, 1, 12);
    pointLight2.position.set(-3, -2, 3);
    scene.add(pointLight2);

    // Mouse interaction handlers
    const handleMouseDown = (event: MouseEvent) => {
      isMouseDownRef.current = true;
      isDraggingRef.current = false;
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (isMouseDownRef.current && !isDraggingRef.current) {
        // This was a click, not a drag - check for heart intersection
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(heart);

        if (intersects.length > 0) {
          // Heart was clicked!
          setShowApology(true);
          
          // Add a little heart bounce effect
          const originalScale = heart.scale.clone();
          heart.scale.multiplyScalar(1.2);
          
          setTimeout(() => {
            if (heartRef.current) {
              heartRef.current.scale.copy(originalScale);
            }
          }, 200);
        }
      }
      
      isMouseDownRef.current = false;
      isDraggingRef.current = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDownRef.current) return;

      const deltaX = event.clientX - mouseRef.current.x;
      const deltaY = event.clientY - mouseRef.current.y;

      // If mouse moved significantly, it's a drag
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        isDraggingRef.current = true;
      }

      if (isDraggingRef.current) {
        targetRotationRef.current.y += deltaX * 0.01;
        targetRotationRef.current.x += deltaY * 0.01;
      }

      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const zoomSpeed = 0.1;
      camera.position.z += event.deltaY * zoomSpeed * 0.01;
      camera.position.z = Math.max(2, Math.min(15, camera.position.z));
    };

    // Add event listeners
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('wheel', handleWheel);

    // Animation loop
    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.016 * animationSpeed;

      if (heartRef.current) {
        // Smooth rotation interpolation
        rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.05;
        rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.05;

        if (isAnimating) {
          // Auto rotation when not being manually controlled
          if (!isMouseDownRef.current) {
            targetRotationRef.current.y += 0.005;
          }
          
          // Pulsing animation
          const pulse = 1 + Math.sin(time * 3) * 0.15;
          heartRef.current.scale.set(0.3 * pulse, 0.3 * pulse, 0.3 * pulse);
          
          // Color animation
          const hue = (Math.sin(time * 0.8) + 1) * 0.5;
          (heartRef.current.material as THREE.MeshPhongMaterial).color.setHSL(
            0.98 - hue * 0.08, 
            0.9, 
            0.5 + hue * 0.2
          );
        }

        heartRef.current.rotation.x = rotationRef.current.x;
        heartRef.current.rotation.y = rotationRef.current.y;
      }

      if (particlesRef.current && isAnimating) {
        // Rotate particles
        particlesRef.current.rotation.y = time * 0.1;
        particlesRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
        
        // Animate particle positions
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(time * 2 + i * 0.1) * 0.002;
          positions[i] += Math.cos(time * 1.5 + i * 0.1) * 0.001;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of resources
      heartGeometry.dispose();
      heartMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [isAnimating, animationSpeed]);

  return (
    <div className="relative w-full h-screen">
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ 
          background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' 
        }}
      />
      
      {/* Apology Modal */}
      {showApology && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-gradient-to-br from-red-900/90 to-pink-900/90 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 max-w-md mx-4 text-center transform animate-pulse">
      <div className="text-6xl mb-4">💔</div>
      <h2 className="text-2xl font-bold text-white mb-4">I'm Sorry...</h2>
      <p className="text-red-100 mb-6 leading-relaxed">
        I apologize for any pain I may have caused. Your heart deserves nothing but love and kindness. 
        Please forgive me, and know that you are valued and cherished.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => {
            // Replace with actual number, e.g., 919876543210
            const phoneNumber = "7990469514";
            const message = "Jaa maaf kiya tu bhi kya yaad rakhega 😏";
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappURL, "_blank");
            setShowApology(false); // close modal
          }}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105"
        >
          I Forgive You ❤️
        </button>

        <button
          onClick={() => setShowApology(false)}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      
      {/* Control Panel */}
      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10">
        <div className="space-y-3">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
              isAnimating 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-gray-200'
            }`}
          >
            {isAnimating ? 'Pause' : 'Play'}
          </button>
          
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Speed</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 max-w-sm">
        <h3 className="text-white font-semibold mb-2">Controls</h3>
        <div className="text-gray-300 text-sm space-y-1">
          <p>🖱️ <strong>Drag:</strong> Rotate the heart</p>
          <p>🔄 <strong>Scroll:</strong> Zoom in/out</p>
          <p>💔 <strong>Click Heart:</strong> Special message</p>
          <p>⏸️ <strong>Pause:</strong> Stop auto-rotation</p>
          <p>⚡ <strong>Speed:</strong> Control animation speed</p>
        </div>
      </div>
    </div>
  );
};

export default ThreeScene;