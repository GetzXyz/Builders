'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { PerformanceReport } from '@/types/build';

interface StoredBuild {
  name: string;
  tier: string;
  currency: string;
  total: number;
  parts: { category: string; name: string }[];
}

function fpsColor(fps: number) {
  if (fps >= 100) return '#16A34A';
  if (fps >= 60) return '#0066FF';
  return '#D97706';
}

export default function PerformancePage() {
  const [stored, setStored] = useState<StoredBuild | null>(null);
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = sessionStorage.getItem('forge-build');
    if (!raw) {
      setLoading(false);
      return;
    }
    const b = JSON.parse(raw) as StoredBuild;
    setStored(b);
    fetch('/api/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'performance', parts: b.parts, resolution: '1080p' }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Failed to analyze performance');
        setReport(data.report);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Something went wrong'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="bg-lux-silver min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-lux-ink mb-3">
            Performance <span className="text-chrome">Report</span>
          </h1>
          {stored && (
            <p className="text-lux-gray mb-10">
              {stored.name} - {stored.parts.length} components - total {stored.currency} {stored.total.toLocaleString()}
            </p>
          )}
        </motion.div>

        {!stored && !loading && (
          <div className="card-lux !rounded-2xl p-10 text-center">
            <p className="text-lux-gray mb-6">No confirmed build found. Configure one first.</p>
            <Link href="/builder" className="btn-lux btn-primary">Go to Builder</Link>
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 rounded-full bg-lux-blue animate-ping" />
              <span className="text-sm font-medium text-lux-gray">Benchmarking your configuration...</span>
            </div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-lux !rounded-xl p-5 animate-pulse">
                <div className="h-3 w-48 bg-lux-section rounded mb-3" />
                <div className="h-2.5 w-full bg-lux-silver rounded" />
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="card-lux !rounded-2xl p-6 border-[#FDBA74] text-sm text-[#9A3412]">{error}</div>
        )}

        {report && !loading && (
          <div className="space-y-12">
            {/* Games */}
            <section>
              <h2 className="text-lg font-bold text-lux-ink mb-6">Gaming - 1080p High ({report.games.length} titles)</h2>
              <div className="space-y-3">
                {report.games.map((g, i) => (
                  <motion.div
                    key={g.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    className="card-lux !rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="font-medium text-sm text-lux-ink">{g.name}</span>
                      <span className="text-sm font-bold" style={{ color: fpsColor(g.avgFPS) }}>
                        {Math.round(g.avgFPS)} FPS
                        <span className="text-lux-gray font-normal text-xs ml-2">1% low {Math.round(g.low1)}</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-lux-section overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(100, (g.avgFPS / 165) * 100)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                        className="h-full rounded-full"
                        style={{ background: fpsColor(g.avgFPS) }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Software */}
            <section>
              <h2 className="text-lg font-bold text-lux-ink mb-6">Professional Software ({report.software.length} tools)</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {report.software.map((s, i) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="card-lux !rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-sm text-lux-ink">{s.name}</span>
                      <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-lux-silver text-lux-gray">
                        {s.tier.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 h-2 rounded-full bg-lux-section overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                          className="h-full rounded-full bg-gradient-to-r from-lux-blue to-lux-chrome"
                        />
                      </div>
                      <span className="text-sm font-bold text-lux-ink w-10 text-right">{s.score}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-lux-gray">{s.note}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Verdict */}
            <section className="card-lux !rounded-2xl p-7">
              <h2 className="text-sm font-semibold tracking-wide text-lux-gray mb-3 uppercase">Verdict</h2>
              <p className="text-lux-ink leading-relaxed">{report.summary}</p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/builder" className="btn-lux btn-secondary">Modify Build</Link>
                <Link href="/builder" className="btn-lux btn-primary">Build Another</Link>
              </div>
            </section>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}