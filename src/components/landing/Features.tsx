'use client';

import { motion, type Variants } from 'framer-motion';

const STEPS = [
  {
    num: '01',
    title: 'Set Your Budget',
    desc: 'Choose from 9 currencies with live exchange rates. From PKR 30,000 starters to no-limit dream machines.',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    num: '02',
    title: 'Tell Us Your Goal',
    desc: 'Gaming, streaming, editing, AI development - the engine weighs performance per dollar for your exact use case.',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
  {
    num: '03',
    title: 'AI Forges Options',
    desc: 'Three vetted options per component - new and used, across brands - every combination compatibility-checked.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    num: '04',
    title: 'Confirm & See Performance',
    desc: 'Lock your build and get real FPS estimates for 10 popular games plus ratings for 5 professional tools.',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
];

const FEATURES = [
  { title: 'Three Options Per Part', desc: 'Every slot offers three choices - new or used, different brands - each with a reason why it earned its place.' },
  { title: 'Used Market Intelligence', desc: 'Risk ratings, lifespan estimates and inspection checklists for every pre-owned component.' },
  { title: 'Compatibility Guaranteed', desc: 'Socket, clearance, wattage, BIOS - 20+ automated checks. Incompatible parts never reach you.' },
  { title: 'Real Performance Numbers', desc: 'FPS for 10 popular games and productivity scores for 5 professional tools - before you spend.' },
  { title: 'Live Currency Conversion', desc: 'PKR, USD, EUR, GBP, INR, SAR, AED, CAD, AUD - budgets converted with live exchange rates.' },
  { title: 'No Login Required', desc: 'Full experience, zero friction. Your builds persist - share or restore them anytime.' },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function Features() {
  return (
    <section id="features" className="bg-lux-silver py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="text-center mb-20"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-lux-blue mb-4">HOW IT WORKS</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-lux-ink">
            From Budget to Build in <span className="text-chrome">Four Steps</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          {STEPS.map((s) => (
            <motion.div
              key={s.num}
              variants={fadeUp}
              whileHover={{ y: -8, rotate: -1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="card-lux group p-7 !rounded-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-lux-silver border border-lux-border flex items-center justify-center group-hover:border-lux-blue/40 group-hover:shadow-[0_0_20px_rgba(0,102,255,0.12)] transition-all duration-300">
                  <svg
                    className="w-6 h-6 text-lux-ink group-hover:text-lux-blue group-hover:rotate-6 transition-all duration-300"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-lux-border group-hover:text-lux-chrome transition-colors">{s.num}</span>
              </div>
              <h3 className="font-semibold text-lux-ink mb-2.5">{s.title}</h3>
              <p className="text-sm leading-relaxed text-lux-gray">{s.desc}</p>
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
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-lux-ink">
            Engineered Like a <span className="text-chrome">Flagship</span>
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
            <motion.div key={f.title} variants={fadeUp} whileHover={{ y: -5 }} className="card-lux p-7 !rounded-2xl">
              <div className="w-8 h-1 rounded-full bg-gradient-to-r from-lux-blue to-lux-chrome mb-5" />
              <h3 className="font-semibold text-lux-ink mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed text-lux-gray">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}