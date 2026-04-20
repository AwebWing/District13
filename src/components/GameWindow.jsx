import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameWindow({ activeAction, setAction }) {
  const [charState, setCharState] = useState('idle');
  const [charX, setCharX] = useState(180);
  const [facing, setFacing] = useState(1);
  const [bullets, setBullets] = useState([]);
  const [showChoice, setShowChoice] = useState(false);
  const [selection, setSelection] = useState(null);
  const [doorOpen, setDoorOpen] = useState(false);

  // Handle movements and actions
  useEffect(() => {
    if (!activeAction) return;

    switch (activeAction) {
      case 'MOVE LEFT':
        setCharState('walking_left');
        setCharX(prev => Math.max(20, prev - 60));
        setFacing(-1);
        setTimeout(() => setCharState('idle'), 400);
        break;
      case 'MOVE RIGHT':
        setCharState('walking_right');
        setCharX(prev => Math.min(370, prev + 60));
        setFacing(1);
        setTimeout(() => setCharState('idle'), 400);
        break;
      case 'JUMP':
        if (charState !== 'jumping') {
          setCharState('jumping');
          setTimeout(() => setCharState('idle'), 500);
        }
        break;
      case 'SHOOT':
        const newBullet = { id: Date.now(), x: charX + (facing === 1 ? 30 : -10), y: 46 };
        setBullets(prev => [...prev, newBullet]);
        setTimeout(() => {
          setBullets(prev => prev.filter(b => b.id !== newBullet.id));
        }, 800);
        break;
      case 'INTERACT':
        // Move to door
        setCharState('interacting');
        setCharX(312); // Door position - 40 approx
        setFacing(1);
        setTimeout(() => {
          setDoorOpen(true);
          setShowChoice(true);
          setCharState('choosing');
        }, 600);
        break;
      case 'OPTION A':
        if (showChoice) {
          setSelection('A');
          handleSelection();
        }
        break;
      case 'OPTION B':
        if (showChoice) {
          setSelection('B');
          handleSelection();
        }
        break;
      default:
        break;
    }
  }, [activeAction]);

  const handleSelection = () => {
    setTimeout(() => {
      setShowChoice(false);
      setDoorOpen(false);
      setSelection(null);
      setCharX(180); // Head back to center
      setCharState('idle');
    }, 1200);
  };

  return (
    <div className="relative">
      <div 
        className="game-window-container"
        style={{
          perspective: '900px',
          width: '420px',
          height: '280px',
          margin: '0 auto'
        }}
      >
        <div 
          style={{
            width: '100%',
            height: '100%',
            background: '#0a0a0a',
            border: '2px solid #2a2a2a',
            borderRadius: '8px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)',
            transform: 'none',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Ground */}
          <div style={{ position: 'absolute', bottom: '40px', width: '100%', height: '2px', background: '#333' }} />

          {/* Door */}
          <motion.div 
            animate={{ 
              scaleX: doorOpen ? 1.4 : 1,
              filter: doorOpen ? 'brightness(1.5) drop-shadow(0 0 10px #7c3aed)' : 'brightness(1)'
            }}
            style={{ 
              position: 'absolute', 
              right: '40px', 
              bottom: '42px', 
              width: '28px', 
              height: '48px', 
              background: '#7c3aed',
              borderRadius: '2px 2px 0 0'
            }} 
          />

          {/* Character */}
          <motion.div
            animate={{
              x: charX,
              y: charState === 'jumping' ? [-2, -80, 0] : 0,
              scaleX: facing,
              scaleY: charState === 'jumping' ? [1, 0.8, 1.2, 1] : 1
            }}
            transition={{
              y: { duration: 0.5, times: [0, 0.5, 1] },
              scaleY: { duration: 0.5, times: [0, 0.3, 0.7, 1] },
              x: { duration: 0.4 }
            }}
            style={{
              position: 'absolute',
              bottom: '42px',
              width: '30px',
              height: '50px',
              background: '#3b82f6',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            <span style={{ color: 'white', fontSize: '8px', fontWeight: 'bold' }}>P1</span>
          </motion.div>

          {/* Bullets */}
          {bullets.map(bullet => (
            <motion.div
              key={bullet.id}
              initial={{ x: bullet.x, y: 0, opacity: 1 }}
              animate={{ x: bullet.x + (facing === 1 ? 300 : -300), opacity: 0 }}
              transition={{ duration: 0.8, ease: "linear" }}
              style={{
                position: 'absolute',
                bottom: '70px',
                width: '10px',
                height: '4px',
                background: '#22d3ee',
                borderRadius: '2px'
              }}
            />
          ))}

          {/* Choice Panel */}
          <AnimatePresence>
            {showChoice && (
              <motion.div
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                exit={{ y: 80 }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  height: '80px',
                  background: '#111',
                  borderTop: '1px solid #333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  zIndex: 20
                }}
              >
                <motion.div 
                  animate={{ 
                    scale: selection === 'A' ? 1.05 : 1,
                    borderColor: selection === 'A' ? '#eab308' : '#333',
                    background: selection === 'A' ? '#1c1700' : '#1a1a1a'
                  }}
                  style={{
                    width: '45%',
                    height: '50px',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ color: selection === 'A' ? '#eab308' : 'white', fontSize: '10px' }}>OPTION A</span>
                  <span style={{ color: '#666', fontSize: '8px' }}>Press X</span>
                </motion.div>

                <motion.div 
                  animate={{ 
                    scale: selection === 'B' ? 1.05 : 1,
                    borderColor: selection === 'B' ? '#22c55e' : '#333',
                    background: selection === 'B' ? '#001a09' : '#1a1a1a'
                  }}
                  style={{
                    width: '45%',
                    height: '50px',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ color: selection === 'B' ? '#22c55e' : 'white', fontSize: '10px' }}>OPTION B</span>
                  <span style={{ color: '#666', fontSize: '8px' }}>Press Y</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
