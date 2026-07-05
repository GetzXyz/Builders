'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { BuildV2 } from '@/types/build';

const CURRENCIES = [
  { code: 'PKR', symbol: 'Rs', region: 'Pakistan' },
  { code: 'USD', symbol: '$', region: 'United States' },
  { code: 'EUR', symbol: 'EUR', region: 'Germany' },
  { code: 'GBP', symbol: 'GBP', region: 'United Kingdom' },
  { code: 'CAD', symbol: 'CA$', region: 'Canada' },
  { code: 'AUD', symbol: 'A$', region: 'Australia' },
  { code: 'SAR', symbol: 'SR', region: 'Saudi Arabia' },
  { code: 'AED', symbol: 'AED', region: 'UAE' },
  { code: 'INR', symbol: 'INR', region: 'India' },
];
const USAGES = ['Gaming', 'Streaming', 'Video Editing', 'AI Development', 'Productivity'];
const CATEGORY_LABELS: Record<string, string> = {
  cpu: 'Processor', gpu: 'Graphics Card', motherboard: 'Motherboard', ram: 'Memory',
  storage: 'Storage', psu: 'Power Supply', case: 'Case', cooler: 'Cooling',
};

export default function BuilderPage() {
  const router = useRouter();
  const [currency, setCurrency] = useState('PKR');
  const [region, setRegion] = useState('Pakistan');
  const [budget, setBudget] = useState('');
  const [usage, setUsage] = useState('Gaming');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [build, setBuild] = useState<BuildV2 | null>(null);

  const sym = CURRENCIES.find((c) => c.code === currency)?.symbol ?? '';

  const total = useMemo(() => {
    if (!build) return 0;
    return build.slots.reduce((sum, s) => sum + (s.options[s.selectedIndex]?.price ?? 0), 0);
  }, [build]);

  function onCurrencyChange(code: string) {
    setCurrency(code);
    const c = CURRENCIES.find((x) => x.code === code);
    if (c) setRegion(c.region);
  }

  async function generate() {
    setLoading(true);
    setError(null);
    setBuild(null);
    try {
      const res = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'recommend_v2', budget: Number(budget), currency, region, usage }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
      } else {
        setBuild(data.build);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  function selectOption(slotIdx: number, optIdx: number) {
    if (!build) return;
    const slots = build.slots.map((s, i) => (i === slotIdx ? { ...s, selectedIndex: optIdx } : s));
    setBuild({ ...build, slots });
  }

  function confirmBuild() {
    if (!build) return;
    const parts = build.slots.map((s) => {
      const o = s.options[s.selectedIndex];
      return { category: s.category, name: `${o.brand} ${o.name}` };
    });
    sessionStorage.setItem(
      'forge-build',
      JSON.stringify({ name: build.name, tier: build.tier, currency, total, parts, slots: build.slots })
    );
    router.push('/performance');
  }

  return (
    <main className="bg-lux-silver min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-lux-ink mb-3">
            Configure Your <span className="text-chrome">Build</span>
          </h1>
          <p className="text-lux-gray mb-10">
            Pick a currency, set your budget, and the AI proposes three vetted options for every component.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card-lux !rounded-2xl p-6 md:p-8 mb-10"
        >
          <div className="grid md:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-semibold tracking-wide text-lux-gray mb-2">CURRENCY</label>
              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-lux-border bg-white text-lux-ink focus:outline-none focus:border-lux-blue focus:shadow-[0_0_0_4px_rgba(0,102,255,0.08)] transition-shadow"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} - {c.region}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wide text-lux-gray mb-2">BUDGET ({currency})</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lux-gray text-sm">{sym}</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder={currency === 'PKR' ? '150000' : '1500'}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-lux-border bg-white text-lux-ink focus:outline-none focus:border-lux-blue focus:shadow-[0_0_0_4px_rgba(0,102,255,0.08)] transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wide text-lux-gray mb-2">PRIMARY USE</label>
              <select
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-lux-border bg-white text-lux-ink focus:outline-none focus:border-lux-blue focus:shadow-[0_0_0_4px_rgba(0,102,255,0.08)] transition-shadow"
              >
                {USAGES.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={generate}
                disabled={loading || !budget}
                className="btn-lux btn-primary w-full h-12 !py-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Forging...' : 'Generate Build'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 p-4 rounded-xl bg-[#FFF7ED] border border-[#FDBA74] text-sm text-[#9A3412] leading-relaxed"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* AI thinking skeleton */}
        {loading && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 rounded-full bg-lux-blue animate-ping" />
              <span className="text-sm font-medium text-lux-gray">AI is weighing hundreds of part combinations...</span>
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-lux !rounded-2xl p-6 animate-pulse">
                <div className="h-4 w-40 bg-lux-section rounded mb-5" />
                <div className="grid md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-36 bg-lux-silver rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Result */}
        {build && !loading && (
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-lux-ink">{build.name}</h2>
                <p className="text-sm text-lux-gray">{build.summary}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-lux-gray mb-1">SELECTED TOTAL</div>
                <div className="text-2xl font-bold text-lux-ink">{sym} {total.toLocaleString()}</div>
              </div>
            </motion.div>

            {build.slots.map((slot, si) => (
              <motion.div
                key={slot.category}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5 }}
                className="card-lux !rounded-2xl p-6"
              >
                <h3 className="text-sm font-semibold tracking-wide text-lux-gray mb-4 uppercase">
                  {CATEGORY_LABELS[slot.category] ?? slot.category}
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {slot.options.map((opt, oi) => {
                    const active = oi === slot.selectedIndex;
                    return (
                      <button
                        key={oi}
                        onClick={() => selectOption(si, oi)}
                        className={`text-left p-5 rounded-xl border transition-all duration-300 ${
                          active
                            ? 'border-lux-blue bg-[#F5F9FF] shadow-[0_0_0_4px_rgba(0,102,255,0.08),0_8px_24px_rgba(0,102,255,0.10)]'
                            : 'border-lux-border bg-white hover:border-lux-chrome hover:-translate-y-1 hover:shadow-lux'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full ${
                            opt.condition === 'new'
                              ? 'bg-[#EAF2FF] text-lux-blue'
                              : 'bg-[#FFF4E5] text-[#B45309]'
                          }`}>
                            {opt.condition.toUpperCase()}
                            {opt.condition === 'used' && opt.riskRating ? ` - ${opt.riskRating.toUpperCase()} RISK` : ''}
                          </span>
                          {active && <span className="text-lux-blue text-xs font-bold">SELECTED</span>}
                        </div>
                        <div className="font-semibold text-lux-ink text-sm mb-1">{opt.brand} {opt.name}</div>
                        <div className="text-lg font-bold text-lux-ink mb-2">{sym} {opt.price.toLocaleString()}</div>
                        <p className="text-xs leading-relaxed text-lux-gray">{opt.reason}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ))}

            {/* Compatibility */}
            {(build.compatibility.warnings.length > 0 || build.compatibility.issues.length > 0) && (
              <div className="card-lux !rounded-2xl p-6">
                <h3 className="text-sm font-semibold tracking-wide text-lux-gray mb-3 uppercase">Compatibility Notes</h3>
                {build.compatibility.issues.map((x, i) => (
                  <p key={`i${i}`} className="text-sm text-[#B42318] mb-1.5">! {x}</p>
                ))}
                {build.compatibility.warnings.map((x, i) => (
                  <p key={`w${i}`} className="text-sm text-[#B45309] mb-1.5">- {x}</p>
                ))}
              </div>
            )}

            {/* Confirm */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="sticky bottom-6 card-lux !rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 !shadow-lux-hover"
            >
              <div>
                <div className="text-xs text-lux-gray">FINAL TOTAL - {build.slots.length} COMPONENTS</div>
                <div className="text-2xl font-bold text-lux-ink">{sym} {total.toLocaleString()}</div>
              </div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <button onClick={confirmBuild} className="btn-lux btn-primary">
                  Confirm Build - See Performance &rarr;
                </button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}