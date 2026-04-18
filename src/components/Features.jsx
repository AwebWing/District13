import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sword, Brain, Users, Trophy } from 'lucide-react';

const features = [
  {
    number: '01',
    icon: Sword,
    title: 'GUERRILLA TACTICS',
    description: '3 escalating waves per zone before the sector is liberated',
  },
  {
    number: '02',
    icon: Brain,
    title: 'INTEL DECRYPTION',
    description: 'Solve technical puzzles to unlock advanced weaponry',
  },
  {
    number: '03',
    icon: Users,
    title: 'RESISTANCE SQUAD',
    description: 'Split screen co-op. Fight together or fall alone.',
  },
  {
    number: '04',
    icon: Trophy,
    title: 'HALL OF HEROES',
    description: 'Your contribution to the cause, recorded in history.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export default function Features() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="features" ref={ref} className="bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-6xl md:text-8xl text-[var(--white)] mb-4">
            REBEL CAPABILITIES
          </h2>
          <div className="w-24 h-1 bg-[var(--amber)] mx-auto" />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.number}
              variants={cardVariants}
              className="group relative p-8 bg-[var(--surface)] border-l-2 border-[var(--amber)] hover:border-[var(--amber-glow)] transition-colors"
              whileHover={{
                y: -6,
                boxShadow: '0 10px 40px rgba(217, 119, 6, 0.3)',
              }}
            >
              {/* Watermark Number */}
              <span
                className="absolute top-4 right-4 font-heading text-9xl text-[var(--amber)] opacity-10 select-none"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {feature.number}
              </span>

              {/* Content */}
              <div className="relative z-10">
                <div className="w-14 h-14 mb-6 flex items-center justify-center border border-[var(--amber)] text-[var(--amber)] group-hover:text-[var(--amber-glow)] group-hover:border-[var(--amber-glow)] transition-colors">
                  <feature.icon size={32} strokeWidth={1.5} />
                </div>

                <h3 className="font-heading text-3xl text-[var(--white)] mb-3 tracking-wider">
                  {feature.title}
                </h3>

                <p className="font-body text-[var(--white)] text-lg leading-relaxed opacity-80">
                  {feature.description}
                </p>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--amber)]/10 to-transparent" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
