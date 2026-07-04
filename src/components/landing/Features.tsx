'use client';

import { motion } from 'framer-motion';

const STEPS = [
  {
    num: '01',
    title: 'Set Your Budget',
    desc: 'Pick your currency and budget. From PKR 30,000 starter rigs to no-limit dream machines - the engine adapts to what you have.',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    num: '02',
    title: 'Tell Us Your Goal',
    desc: 'Gaming, streaming, editing, AI development - or just "run GTA VI". The AI weighs performance per dollar for YOUR use case.',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
  {
    num: '03',
    title: 'AI Forges Your Build',
    desc: 'Multiple build styles generated - performance, balanced, RGB aesthetic, quiet, future-proof. Every part compatibility-checked with a reason why.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    num: '04',
    title: 'Tune & Export',
    desc: 'Swap any part with live price, wattage and FPS updates. Happy? Export a professional invoice with vendor list and QR code.',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
];

const FEATURES = [
  { title: 'Live FPS Estimates', desc: '17 games incl. Cyberpunk 2077 and projected GTA VI - avg, 1% and 0.1% lows at 1080p to 4K.' },
  { title: 'Used Market Intelligence', desc: 'Smart new/used mixing with risk ratings, lifespan estimates and inspection checklists.' },
  { title: 'Compatibility Guaranteed', desc: 'Socket, clearance, wattage, BIOS - 20+ checks so no incompatible part is ever recommended.' },
  { title: '9 Currencies', desc: 'PKR, USD, EUR, GBP, INR and more - converted with live exchange rates.' },
  { title: 'Build Health Meters', desc: 'Power draw, thermals, noise, upgrade headroom and value - visualized in real time.' },
  { title: 'No Login Required', desc: 'Full experience, zero friction. Your builds live in the URL - share or restore anytime.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Features() {
  return (
    <section id="features" className="relative bg-forge-bg py-28 overflow-hidden">
      <div
        aria-hidden
        className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(123,47,255,.10), transparent 65%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="text-center mb-20"
        >
          <p className="font-orbitron text-xs tracking-[0.35em] text-forge-accent mb-4">HOW IT WORKS</p>
          <h2 className="font-orbitron text-3xl md:text-5xl font-bold text-forge-text">
            From Budget to Build in <span className="text-gradient-shimmer">Four Steps</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-28"
        >
          {STEPS.map((s) => (
            <motion.div
              key={s.num}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group relative p-6 rounded-xl border border-forge-border bg-forge-card/60 backdrop-blur-sm hover:border-forge-accent/50 transition-colors"
            >
              <div className="absolute top-4 right-5 font-orbitron text-4xl font-bold text-forge-border group-hover:text-forge-accent/25 transition-colors">
                {s.num}
              </div>
              <svg
                className="w-8 h-8 mb-5 text-forge-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.6}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
              </svg>
              <h3 className="font-orbitron text-base font-bold text-forge-text mb-3">{s.title}</h3>
              <p className="text-sm leading-relaxed text-forge-text2">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <h2 className="font-orbitron text-2xl md:text-4xl font-bold text-forge-text">
            Built Like the <span className="text-gradient-shimmer">Pros Build</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl border border-forge-border bg-forge-panel/50 hover:border-forge-accent2/50 transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-forge-accent animate-ping-dot mb-4" />
              <h3 className="font-orbitron text-sm font-bold text-forge-text mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed text-forge-text2">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}