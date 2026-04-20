import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Gameplay from './components/Gameplay';
import InteractiveController from './components/InteractiveController';
import Download from './components/Download';
import Leaderboard from './components/Leaderboard';
import Footer from './components/Footer';

function CustomCursor() {
  const cursorRef = useRef(null);
  const lagCursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const lagCursor = lagCursorRef.current;

    if (!cursor || !lagCursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let lagX = 0;
    let lagY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseOver = (e) => {
      if (e.target.matches('a, button, .interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const animate = () => {
      cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      lagX += (mouseX - lagX) * 0.15;
      lagY += (mouseY - lagY) * 0.15;
      lagCursor.style.transform = `translate(${lagX - 16}px, ${lagY - 16}px)`;
      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className={`custom-cursor ${isHovering ? 'hovered' : ''}`} />
      <div ref={lagCursorRef} className={`custom-cursor-lag ${isHovering ? 'hovered' : ''}`} />
    </>
  );
}

function PageLoader({ onComplete }) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      <motion.div
        className="page-loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{ pointerEvents: 'none' }}
      >
        <motion.div
          className="page-loader-top"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
        <motion.div
          className="page-loader-bottom"
          initial={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.1 }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="scroll-progress">
      <motion.div
        className="scroll-progress-bar"
        style={{ scaleX }}
      />
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <PageLoader key="loader" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <CustomCursor />
          <ScrollProgress />
          <Navbar />

          <main>
            <Hero />
            <Features />
            <Gameplay />
            <InteractiveController />
            <Download />
            <Leaderboard />
          </main>

          <Footer />

          <div className="grain-overlay" />
        </>
      )}
    </>
  );
}
