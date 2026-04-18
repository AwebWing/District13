import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Gameplay', href: '#gameplay' },
  { name: 'Download', href: '#download' },
  { name: 'Leaderboard', href: '#leaderboard' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [0, 1]);
  const borderTopOpacity = useTransform(scrollY, [50, 100], [0, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled ? 'bg-[#0d0d0d]' : 'bg-transparent'
        }`}
        style={{ borderBottom: '1px solid transparent' }}
      >
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--red)]"
          style={{ opacity: borderTopOpacity }}
        />

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            className="font-heading text-xl tracking-wider text-[var(--red)] hover:text-[var(--red-glow)] transition-colors"
            style={{ textShadow: '0 0 10px rgba(232, 28, 28, 0.5)' }}
          >
            WARZONE
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="font-body text-sm uppercase tracking-widest text-[var(--white)] hover:text-[var(--red)] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <motion.button
            className="md:hidden text-[var(--white)]"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        className="fixed inset-0 z-40 bg-[var(--bg)] md:hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: isMobileOpen ? 1 : 0,
          y: isMobileOpen ? 0 : -20,
          pointerEvents: isMobileOpen ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.href);
              }}
              className="font-heading text-3xl tracking-wider text-[var(--white)] hover:text-[var(--red)] transition-colors"
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: isMobileOpen ? 1 : 0,
                y: isMobileOpen ? 0 : -20
              }}
              transition={{ delay: index * 0.1 }}
            >
              {link.name}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </>
  );
}
