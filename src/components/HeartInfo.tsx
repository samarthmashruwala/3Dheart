import React from 'react';
import { Heart, Sparkles, Zap, MousePointer } from 'lucide-react';

const HeartInfo: React.FC = () => {
  return (
    <div className="absolute top-8 left-8 z-10 max-w-md">
      <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/20 rounded-xl">
            <Heart className="w-6 h-6 text-red-400" fill="currentColor" />
          </div>
          {/* <h1 className="text-2xl font-bold text-white">Interactive Heart</h1> */}
        </div>
        
        {/* <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          A beautiful interactive 3D heart animation with full user controls. 
          Drag to rotate, scroll to zoom, and customize the animation.
        </p> */}
        
        {/* <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <MousePointer className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Fully interactive controls</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-gray-300">800+ animated particles</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300">Real-time dynamic lighting</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-gray-300">Smooth pulsing animation</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default HeartInfo;