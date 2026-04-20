import { motion, AnimatePresence } from 'framer-motion';

const BUTTON_DESCRIPTIONS = {
  'DPAD_UP': { name: 'D-Up', action: 'JUMP', desc: 'Character jumps over obstacles', color: '#e81c1c' },
  'DPAD_LEFT': { name: 'D-Left', action: 'MOVE LEFT', desc: 'Walk the character to the left', color: '#e81c1c' },
  'DPAD_RIGHT': { name: 'D-Right', action: 'MOVE RIGHT', desc: 'Walk the character to the right', color: '#e81c1c' },
  'A': { name: 'Button A', action: 'SHOOT', desc: 'Fire a projectile forward', color: '#cc0000' },
  'B': { name: 'Button B', action: 'INTERACT', desc: 'Approach the door and open the choice menu', color: '#0044cc' },
  'X': { name: 'Button X', action: 'OPTION A', desc: 'Select the left option — only after pressing B', color: '#cc9900' },
  'Y': { name: 'Button Y', action: 'OPTION B', desc: 'Select the right option — only after pressing B', color: '#00aa44' },
  'DPAD_DOWN': { name: 'D-Down', action: 'UNUSED', desc: 'This button is currently not mapped to any action', color: '#333333' },
  'L': { name: 'L Shoulder', action: 'UNUSED', desc: 'This button is currently not mapped to any action', color: '#222222' },
  'R': { name: 'R Shoulder', action: 'UNUSED', desc: 'This button is currently not mapped to any action', color: '#222222' },
};

export default function ButtonCard({ hoveredButton, activeAction }) {
  // Determine which button to show description for
  // prioritize hovered button
  const displayData = hoveredButton || (activeAction ? getButtonFromAction(activeAction) : null);

  function getButtonFromAction(action) {
    const entry = Object.entries(BUTTON_DESCRIPTIONS).find(([k, v]) => v.action === action);
    return entry ? { type: entry[0], ...entry[1] } : null;
  }

  return (
    <div className="w-full h-[120px] bg-[#111111] border border-white/5 rounded-lg p-4 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {displayData ? (
          <motion.div
            key={displayData.type || displayData.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: displayData.color || '#333', boxShadow: `0 0 10px ${displayData.color || '#333'}` }} 
              />
              <span className="font-heading text-white text-lg tracking-wider">
                {displayData.name || displayData.label}
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-steel uppercase tracking-widest font-mono">
                Action: <span className="text-white">{displayData.action || 'INTERACT'}</span>
              </div>
              <p className="text-steel font-body text-sm leading-tight">
                {displayData.desc || 'Interact with the virtual console below.'}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-full"
          >
             <p className="text-steel/40 font-body italic text-sm text-center">
               Hover over or click a button to see details
             </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
