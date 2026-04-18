import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronDown } from 'lucide-react';

function FloatingShard({ position, rotation, scale }) {
  const meshRef = useRef();

  const speed = useMemo(() => ({
    x: Math.random() * 0.2 - 0.1,
    y: Math.random() * 0.2 - 0.1,
    z: Math.random() * 0.2 - 0.1,
  }), []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.x += speed.x * delta;
      meshRef.current.position.y += speed.y * delta;
      meshRef.current.position.z += speed.z * delta;

      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;

      // Bounds checking
      if (meshRef.current.position.x > 15) meshRef.current.position.x = -15;
      if (meshRef.current.position.x < -15) meshRef.current.position.x = 15;
      if (meshRef.current.position.y > 10) meshRef.current.position.y = -10;
      if (meshRef.current.position.y < -10) meshRef.current.position.y = 10;
      if (meshRef.current.position.z > 10) meshRef.current.position.z = -10;
      if (meshRef.current.position.z < -10) meshRef.current.position.z = 10;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#e81c1c"
        emissive="#ff0000"
        emissiveIntensity={0.5}
        roughness={0.3}
        metalness={0.8}
      />
    </mesh>
  );
}

function Scene() {
  const shards = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20 - 10,
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      scale: [Math.random() * 0.4 + 0.1, Math.random() * 0.4 + 0.1, Math.random() * 0.4 + 0.1],
    }));
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 10, 5]} intensity={1} color="#ff0000" />
      <pointLight position={[-10, -5, -5]} intensity={0.5} color="#ff0000" />
      <fog attach="fog" args={['#080808', 10, 50]} />

      {shards.map((shard, i) => (
        <FloatingShard key={i} {...shard} />
      ))}
    </>
  );
}

export default function Hero() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Three.js Canvas Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Canvas
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Red Radial Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(8,8,8,0.8) 100%)',
        }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
          {/* Title */}
          <motion.h1
            className="font-heading text-8xl md:text-[12rem] leading-none tracking-wider text-[var(--white)] mb-4"
            style={{ textShadow: '0 0 30px rgba(232, 28, 28, 0.8), 0 0 60px rgba(232, 28, 28, 0.4)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            WARZONE
          </motion.h1>

          <motion.h1
            className="font-heading text-6xl md:text-8xl leading-none tracking-wider text-[var(--red)] mb-6"
            style={{ textShadow: '0 0 20px rgba(232, 28, 28, 1), 0 0 40px rgba(232, 28, 28, 0.5)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          >
            PLATFORMER
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="font-body text-xl md:text-2xl tracking-[0.5em] uppercase text-[var(--white)] mb-12"
            style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}
            initial={{ opacity: 0, letterSpacing: '0em' }}
            animate={inView ? { opacity: 1, letterSpacing: '0.5em' } : {}}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Survive. Solve. Dominate.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.a
              href="#download"
              className="group relative px-10 py-4 bg-[var(--red)] font-heading text-xl tracking-wider text-white overflow-hidden"
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(232, 28, 28, 0.8)' }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>⬇</span> DOWNLOAD FOR UBUNTU
              </span>
              <div className="absolute inset-0 bg-[var(--red-glow)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>

            <motion.a
              href="#gameplay"
              className="group px-10 py-4 border-2 border-[var(--red)] font-heading text-xl tracking-wider text-[var(--red)] hover:bg-[var(--red)] hover:text-white transition-all"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(232, 28, 28, 0.5)' }}
              whileTap={{ scale: 0.97 }}
            >
              HOW TO PLAY
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ChevronDown size={40} className="text-[var(--red)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
