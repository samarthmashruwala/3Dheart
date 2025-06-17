import React from 'react';
import ThreeScene from './components/ThreeScene';
import HeartInfo from './components/HeartInfo';

function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ThreeScene />
      <HeartInfo />
      
      {/* Gradient overlay for cinematic effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black/20 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black/20 to-transparent" />
      </div>

      {/* Floating UI elements */}
      <div className="absolute bottom-8 right-8 z-10">
       
      </div>
    </div>
  );
}

export default App;