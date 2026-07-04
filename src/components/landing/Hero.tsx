'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  animate,
} from 'framer-motion';

const CHIPS = [
  { label: 'CPU', x: '12%', y: '24%', delay: 0 },
  { label: 'GPU', x: '80%', y: '18%', delay: 0.9 },
  { label: 'RAM', x: '86%', y: '58%', delay: 1.7 },
  { label: 'SSD', x: '8%', y: '62%', delay: 2.5 },
  { label: 'PSU', x: '72%', y: '82%', delay: 3.3 },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [inView, value]);
  return (
    <div className="text-center">
      <div className="font-orbitron text-2xl md:text-3xl font-bold text-forge-accent">
        <span ref={ref}>0</span>
        {suffix}
      </div>
      <div className="text-[10px] md:text-xs tracking-[0.25em] text-forge-text2 uppercase mt-1">
        {label}
      </div>
    </div>
  );
}

export default function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const chipX = useSpring(useTransform(mx, [-0.5, 0.5], [-26, 26]), { stiffness: 50, damping: 18 });
  const chipY = useSpring(useTransform(my, [-0.5, 0.5], [-18, 18]), { stiffness: 50, damping: 18 });
  const coreX = useSpring(useTransform(mx, [-0.5, 0.5], [16, -16]), { stiffness: 40, damping: 20 });
  const coreY = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 40, damping: 20 });

  function onMove(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <section
      onMouseMove={onMove}
      className="relative min-h-screen overflow-hidden bg-forge-bg flex items-center justify-center"
    >
      {/* Aurora nebulas */}
      <div
        aria-hidden
        className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-[110px] animate-aurora-a"
        style={{ background: 'radial-gradient(circle, rgba(0,240,255,.16), transparent 65%)' }}
      />
      <div
        aria-hidden
        className="absolute -bottom-52 -right-40 w-[800px] h-[800px] rounded-full blur-[120px] animate-aurora-b"
        style={{ background: 'radial-gradient(circle, rgba(123,47,255,.18), transparent 65%)' }}
      />

      {/* Moving grid + scanline */}
      <div aria-hidden className="absolute inset-0 bg-cyber-grid-bright animate-grid-pan" />
      <div
        aria-hidden
        className="absolute left-0 w-full h-px animate-scanline"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(0,240,255,.5), transparent)',
        }}
      />

      {/* Orbital rings (wrapper centers, inner spins) */}
      <div aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] hidden md:block">
        <div
          className="w-full h-full rounded-full border border-forge-accent/10 animate-spin-slow"
          style={{ borderTopColor: 'rgba(0,240,255,.5)' }}
        />
      </div>
      <div aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] hidden md:block">
        <div
          className="w-full h-full rounded-full border border-forge-accent2/10 animate-spin-rev"
          style={{ borderBottomColor: 'rgba(123,47,255,.45)' }}
        />
      </div>

      {/* Pulsing core (parallax wrapper + pulsing inner) */}
      <motion.div
        aria-hidden
        style={{ x: coreX, y: coreY }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px]"
      >
        <div
          className="w-full h-full rounded-full animate-forge-pulse"
          style={{
            background:
              'radial-gradient(circle, rgba(0,240,255,.16) 0%, rgba(123,47,255,.12) 40%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Floating chips with mouse parallax */}
      <motion.div aria-hidden style={{ x: chipX, y: chipY }} className="absolute inset-0 hidden md:block">
        {CHIPS.map((chip) => (
          <motion.div
            key={chip.label}
            className="absolute flex items-center gap-2 px-4 py-2 rounded-lg border border-forge-border bg-forge-card/80 backdrop-blur-sm animate-forge-float"
            style={{ left: chip.x, top: chip.y, animationDelay: `${chip.delay}s` }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + chip.delay * 0.18, duration: 0.5 }}
          >
            <span className="w-2 h-2 rounded-full bg-forge-accent animate-ping-dot" />
            <span className="font-orbitron text-xs tracking-widest text-forge-text2">{chip.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-forge-border bg-forge-panel/70 backdrop-blur-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-forge-success animate-ping-dot" />
          <span className="font-orbitron text-[10px] tracking-[0.3em] text-forge-text2">
            FORGE ENGINE ONLINE
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="font-orbitron text-5xl md:text-7xl font-bold leading-tight mb-6"
        >
          Forge Your <span className="text-gradient-shimmer">Dream Machine</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-lg md:text-xl text-forge-text2 max-w-2xl mx-auto mb-10"
        >
          Tell us your budget and what you play. Our AI assembles the perfect
          part list — prices, compatibility, and FPS predictions included.
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/builder"
              className="glow-cta inline-block font-orbitron tracking-widest text-sm px-10 py-4 rounded-lg bg-gradient-to-r from-forge-accent to-forge-accent2 text-forge-bg font-bold"
            >
              START BUILDING →
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            
              href="#features"
              className="inline-block font-orbitron tracking-widest text-sm px-10 py-4 rounded-lg border border-forge-border text-forge-text hover:border-forge-accent/60 hover:text-forge-accent transition-colors"
            >
              HOW IT WORKS
            </a>
          </motion.div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-3 gap-8 max-w-md mx-auto">
          <Stat value={13} suffix="" label="Build Styles" />
          <Stat value={9} suffix="" label="Currencies" />
          <Stat value={17} suffix="" label="Games Tested" />
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-forge-accent/70"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        ▾
      </motion.div>

      <div aria-hidden className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-forge-bg to-transparent" />
    </section>
  );
}