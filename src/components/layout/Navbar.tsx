'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const LINKS = [
  { href: '/#features', label: 'How It Works' },
  { href: '/builder', label: 'Builder' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-forge-bg/80 backdrop-blur-md border-b border-forge-border shadow-[0_4px_30px_rgba(0,240,255,0.06)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-forge-accent to-forge-accent2 group-hover:rotate-45 transition-transform duration-300" />
          <span className="font-orbitron font-bold tracking-[0.2em] text-forge-text">
            FORGE<span className="text-forge-accent">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-forge-text2 hover:text-forge-accent transition-colors tracking-wide"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/builder"
            className="font-orbitron text-xs tracking-widest px-5 py-2.5 rounded-lg bg-gradient-to-r from-forge-accent to-forge-accent2 text-forge-bg font-bold hover:shadow-[0_0_24px_rgba(0,240,255,0.45)] transition-shadow"
          >
            START BUILDING
          </Link>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`w-6 h-0.5 bg-forge-text transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-forge-text transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-forge-text transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-forge-panel/95 backdrop-blur-md border-b border-forge-border"
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-forge-text2 hover:text-forge-accent transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/builder"
              onClick={() => setOpen(false)}
              className="font-orbitron text-xs tracking-widest px-5 py-3 rounded-lg bg-gradient-to-r from-forge-accent to-forge-accent2 text-forge-bg font-bold text-center"
            >
              START BUILDING
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}