import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Terminal, Copy, Check } from 'lucide-react';

const compileCommand = 'gcc main.c -o game -lraylib -lm';

export default function Download() {
  const [copied, setCopied] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(compileCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="download" ref={ref} className="relative bg-[var(--bg)] overflow-hidden">
      {/* Red Radial Glow Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(217, 119, 6, 0.15) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-5xl md:text-8xl text-[var(--white)] mb-4">
            SECURE THE INTEL
          </h2>
          <div className="w-24 h-1 bg-[var(--amber)] mx-auto mb-8" />
        </motion.div>

        {/* System Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-4 mb-12"
        >
          {[
            { label: 'OS', value: 'Ubuntu Linux 20.04+' },
            { label: 'Dependency', value: 'sudo apt install libraylib-dev' },
            { label: 'Compile', value: compileCommand },
            { label: 'Controls', value: 'WASD · Space · F · E' },
          ].map((req, i) => (
            <motion.div
              key={req.label}
              className="flex items-center gap-4 p-4 bg-[var(--surface)] border-l-2 border-[var(--amber)]/50"
              whileHover={{ borderLeftColor: 'var(--amber)', x: 8 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-heading text-xl text-[var(--amber)] min-w-[100px]">
                {req.label}
              </span>
              <span className="font-mono text-sm text-[var(--white)]/90">
                {req.value}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Terminal Code Block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-[#0d0d0d] border border-[#333] rounded-lg overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-[#333]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <span className="font-mono text-xs text-[var(--white)]/50 uppercase tracking-widest">Rebel Intel · Terminal</span>
            </div>

            {/* Terminal Content */}
            <div className="p-4 md:p-6 font-mono overflow-x-auto">
              <div className="flex items-start justify-between min-w-[300px]">
                <div className="flex-1">
                  <span className="text-green-400">$ </span>
                  <span className="text-[var(--green)]">{compileCommand}</span>
                  <span className="blinking-cursor inline-block w-2 h-5 bg-[var(--green)] ml-1 align-middle" />
                </div>
                <motion.button
                  onClick={handleCopy}
                  className="p-2 rounded hover:bg-[#1a1a1a] transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  {copied ? (
                    <Check size={18} className="text-[var(--green)]" />
                  ) : (
                    <Copy size={18} className="text-[var(--white)]/50" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Download Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-8"
        >
          <motion.a
            href="game.zip"
            className="inline-block px-12 py-5 bg-[var(--amber)] font-heading text-2xl tracking-wider text-white pulse-glow"
            whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(217, 119, 6, 1)' }}
            whileTap={{ scale: 0.97 }}
            // REPLACE WITH ACTUAL DOWNLOAD LINK
          >
            ⬇ DOWNLOAD v1.0 — UBUNTU 64-bit
          </motion.a>
        </motion.div>

        {/* GitHub Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <motion.a
            href="#"
            className="inline-flex items-center gap-2 font-body text-[var(--white)]/70 hover:text-[var(--amber)] transition-colors"
            whileHover={{ x: 4 }}
            // REPLACE WITH GITHUB REPO URL
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            <span className="underline decoration-transparent hover:decoration-[var(--amber)] underline-offset-4">
              View Source on GitHub
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
