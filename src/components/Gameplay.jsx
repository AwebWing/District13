import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Gameplay() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="gameplay" ref={ref} className="bg-[var(--bg)] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-6xl md:text-8xl text-[var(--white)] mb-4">
            TWO LEVELS. NO MERCY.
          </h2>
          <div className="w-24 h-1 bg-[var(--red)] mx-auto" />
        </motion.div>

        {/* Level Panels */}
        <div className="relative grid md:grid-cols-2 gap-0">
          {/* Diagonal Divider Effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--red)] to-transparent opacity-50" />
          </div>

          {/* Level 1 - The Gauntlet */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, x: -100 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative aspect-video bg-gradient-to-br from-[#1a0a0a] to-[#0d0505] border border-[var(--red)]/30 overflow-hidden">
              {/* Scanlines Overlay */}
              <div className="absolute inset-0 scanlines" />

              {/* Level Badge */}
              <div className="absolute top-4 left-4 z-10 bg-[var(--red)] px-4 py-2">
                <span className="font-heading text-xl text-white tracking-wider">LEVEL 1</span>
              </div>

              {/* Placeholder Screenshot Area */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    className="text-8xl md:text-9xl font-heading text-[var(--red)] opacity-30"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    I
                  </motion.div>
                  <p className="font-body text-[var(--white)]/60 mt-4 tracking-widest">THE GAUNTLET</p>
                </div>
              </div>

              {/* Red Tint Overlay */}
              <div className="absolute inset-0 bg-red-900/10 pointer-events-none" />
            </div>

            {/* Description */}
            <motion.div
              className="mt-6 p-6 bg-[var(--surface)] border-l-2 border-[var(--red)]"
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="font-heading text-2xl text-[var(--white)] mb-2">THE GAUNTLET</h3>
              <p className="font-body text-[var(--white)]/80 leading-relaxed">
                Horizontal scrolling through industrial wastelands. Lava pools. Moving platforms.
                Destructible cover. Survive 3 enemy waves before the gate opens.
              </p>
            </motion.div>
          </motion.div>

          {/* Level 2 - The Building */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, x: 100 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative aspect-video bg-gradient-to-br from-[#0a0f1a] to-[#05080d] border border-blue-500/30 overflow-hidden">
              {/* Scanlines Overlay */}
              <div className="absolute inset-0 scanlines" />

              {/* Level Badge */}
              <div className="absolute top-4 left-4 z-10 bg-blue-900 px-4 py-2 border border-blue-500/50">
                <span className="font-heading text-xl text-white tracking-wider">LEVEL 2</span>
              </div>

              {/* Placeholder Screenshot Area */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    className="text-8xl md:text-9xl font-heading text-blue-500 opacity-30"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    II
                  </motion.div>
                  <p className="font-body text-[var(--white)]/60 mt-4 tracking-widest">THE BUILDING</p>
                </div>
              </div>

              {/* Blue Tint Overlay */}
              <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />
            </div>

            {/* Description */}
            <motion.div
              className="mt-6 p-6 bg-[var(--surface)] border-l-2 border-blue-500/50"
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="font-heading text-2xl text-[var(--white)] mb-2">THE BUILDING</h3>
              <p className="font-body text-[var(--white)]/80 leading-relaxed">
                Multi-floor vertical combat. Boss fight at the penthouse. Environmental destruction.
                Every floor is a new battlefield. No checkpoints. No mercy.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
