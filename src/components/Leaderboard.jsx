import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const leaderboardData = [
  { rank: 1, name: '░░░░░░░░', score: '????', mode: 'SINGLE', time: '--:--' },
  { rank: 2, name: '░░░░░░', score: '????', mode: 'COOP', time: '--:--' },
  { rank: 3, name: '░░░░░░░░', score: '????', mode: 'SINGLE', time: '--:--' },
  { rank: 4, name: '░░░░░░', score: '????', mode: 'SINGLE', time: '--:--' },
  { rank: 5, name: '░░░░░░░░', score: '????', mode: 'COOP', time: '--:--' },
];

export default function Leaderboard() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="leaderboard" ref={ref} className="bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-6xl md:text-8xl text-[var(--white)] mb-4">
            REBELLION ARCHIVES
          </h2>
          <div className="w-24 h-1 bg-[var(--gold)] mx-auto" />
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-x-auto rounded-lg border border-[var(--gray)]"
        >
          <div className="min-w-[600px]">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[var(--surface)] border-b border-[var(--gold)]/30 font-heading text-lg tracking-wider">
              <span className="col-span-1 text-[var(--gold)]">#</span>
              <span className="col-span-4 text-[var(--white)]">NAME</span>
              <span className="col-span-2 text-[var(--white)]">SCORE</span>
              <span className="col-span-3 text-[var(--white)]">MODE</span>
              <span className="col-span-2 text-[var(--white)]">TIME</span>
            </div>

            {/* Table Rows */}
            {leaderboardData.map((row, index) => (
              <motion.div
                key={row.rank}
                className={`grid grid-cols-12 gap-4 px-6 py-4 font-body ${
                  index % 2 === 0 ? 'bg-[#111]' : 'bg-[#0e0e0e]'
                } ${index === 0 ? 'border-l-2 border-[var(--gold)]' : ''}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ backgroundColor: 'rgba(201, 146, 42, 0.05)' }}
              >
                {/* Rank */}
                <span
                  className={`col-span-1 font-heading text-xl ${
                    index === 0 ? 'text-[var(--gold)]' : 'text-[var(--white)]/50'
                  }`}
                  style={{
                    textShadow: index === 0 ? '0 0 10px rgba(201, 146, 42, 0.5)' : 'none',
                  }}
                >
                  {row.rank}
                </span>

                {/* Name with Shimmer */}
                <div className="col-span-4">
                  <div
                    className={`h-6 shimmer rounded ${
                      index === 0 ? 'opacity-50' : 'opacity-30'
                    }`}
                    style={{
                      background: index === 0
                        ? 'linear-gradient(90deg, #111 0%, #c9922a 50%, #111 100%)'
                        : 'linear-gradient(90deg, #111 0%, #2a2a2a 50%, #111 100%)',
                      backgroundSize: '200% 100%',
                    }}
                  />
                </div>

                {/* Score */}
                <span className="col-span-2 font-mono text-[var(--white)]/70">
                  {row.score}
                </span>

                {/* Mode */}
                <span
                  className={`col-span-3 text-sm tracking-wider ${
                    row.mode === 'COOP' ? 'text-[var(--steel)]' : 'text-[var(--amber)]'
                  }`}
                >
                  {row.mode === 'COOP' ? 'SQUAD' : 'SOLO'}
                </span>

                {/* Time */}
                <span className="col-span-2 font-mono text-[var(--white)]/50">
                  {row.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          className="text-center mt-8 font-body text-[var(--white)]/50 italic"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Your name will be etched into the rebellion, if you survive.
        </motion.p>
      </div>
    </section>
  );
}
