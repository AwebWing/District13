import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import ControllerModel from './ControllerModel';
import GameWindow from './GameWindow';
import ButtonCard from './ButtonCard';

export default function InteractiveController() {
  const [activeAction, setActiveAction] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleAction = (action) => {
    setActiveAction(action);
    // Reset action after a short delay if it's a trigger action (like shoot/jump)
    if (['SHOOT', 'JUMP', 'MOVE LEFT', 'MOVE RIGHT'].includes(action)) {
      setTimeout(() => setActiveAction(null), 100);
    }
  };

  return (
    <section className="bg-[#0a0a0b] py-20 px-4 md:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading text-white mb-4 tracking-tighter">
            EXPLORE THE CONTROLS
          </h2>
          <p className="text-steel font-body text-lg max-w-2xl mx-auto">
            Click any button on the controller to see the character react in real-time. 
            The Arduino-powered deck gives you full command over the DISTRICT 13 environment.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
          {/* Controller Canvas */}
          <div className="w-full max-w-[480px] h-[300px] md:h-[380px] bg-black/20 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
             <Canvas shadows dpr={[1, 2]} style={{ pointerEvents: 'all' }}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
                <ambientLight intensity={0.5} />
                <pointLight position={[3, 3, 3]} intensity={1.5} color="#ffffff" castShadow />
                <pointLight position={[-3, 1, 2]} intensity={0.8} color="#aaccff" />
                <ControllerModel 
                  onAction={handleAction} 
                  onHover={setHoveredButton} 
                />
                <OrbitControls enableZoom={false} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/1.5} />
             </Canvas>
          </div>

          {/* Game Window & Info */}
          <div className="flex flex-col gap-6 w-full max-w-[420px]">
            <GameWindow activeAction={activeAction} setAction={setActiveAction} />
            <ButtonCard hoveredButton={hoveredButton} activeAction={activeAction} />
          </div>
        </div>
      </div>
    </section>
  );
}
