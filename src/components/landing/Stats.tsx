'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, animate, type Variants } from 'framer-motion';

const STATS = [
  { value: 5000, suffix: '+', label: 'PC Builds', decimals: 0 },
  { value: 15000, suffix: '+', label: 'Components', decimals: 0 },
  { value: 99.9, suffix: '%', label: 'Compatibility', decimals: 1 },
  { value: 9, suffix: '', label: 'Currencies - Live Pricing', decimals: 0 },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function Counter({ value, suffix, decimals }: { value: number; suffix: string; decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current)
          ref.current.textContent = decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals]);
  return (
    <span>
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section id="stats" className="bg-white py-24 border-y border-lux-silver">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-10"
      >
        {STATS.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="text-center">
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-lux-ink mb-2">
              <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
            </div>
            <div className="text-sm text-lux-gray font-medium">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}