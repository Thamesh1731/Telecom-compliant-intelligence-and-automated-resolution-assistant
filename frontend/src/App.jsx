import React from 'react';
import Particles from './components/Particles';
import ComplaintForm from './features/complaints/components/ComplaintForm';

export default function App() {
  return (
    <div className="relative w-full min-h-screen bg-slate-950 overflow-hidden flex items-center justify-center">

      {/* Background Interactive Particles Layer */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={['#38bdf8', '#818cf8', '#ffffff']}
          particleCount={180}
          particleSpread={12}
          speed={0.12}
          particleBaseSize={90}
          moveParticlesOnHover={true}
          particleHoverFactor={1.5}
          alphaParticles={true}
          disableRotation={false}
          pixelRatio={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
        />
      </div>

      {/* Foreground Form Interface */}
      <div className="relative z-10 w-full py-10">
        <ComplaintForm />
      </div>

    </div>
  );
}