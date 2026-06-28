'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Zod schema
const schema = z.object({
  budget: z.number().min(1000, 'Minimum budget is 1,000'),
  currency: z.string().min(1, 'Please select a currency'),
  region: z.string().min(1, 'Please select a region'),
  usage: z.string().min(1, 'Please select a use case'),
});

type FormData = z.infer<typeof schema>;

// Loading Spinner Component
function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return <div className={`${sizes[size]} border-2 border-forge-border border-t-forge-accent rounded-full animate-spin`} />;
}

// Budget Input Component
function BudgetInput({ register, errors, budget, currency, setValue }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-forge-text2 mb-2">Enter Your Budget</label>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="number"
            {...register('budget', { valueAsNumber: true })}
            className="w-full px-4 py-3 bg-forge-card border border-forge-border rounded-lg text-forge-text focus:border-forge-accent focus:ring-1 focus:ring-forge-accent outline-none transition-colors"
            placeholder="e.g., 150000"
            min="1000"
            step="1000"
          />
          {errors.budget && <p className="text-sm text-forge-danger mt-1">{errors.budget.message as string}</p>}
        </div>
        <div className="text-forge-accent font-orbitron text-xl font-bold">{currency}</div>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {[50000, 100000, 200000, 500000].map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => setValue('budget', amount)}
            className="text-xs px-3 py-1 bg-forge-card border border-forge-border rounded text-forge-text2 hover:border-forge-accent transition-colors"
          >
            Rs {amount.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}

// Usage Selector Component
function UsageSelector({ register, errors, usage }: any) {
  const options = [
    { value: 'gaming', label: '🎮 Gaming' },
    { value: 'streaming', label: '📡 Streaming' },
    { value: 'editing', label: '🎬 Video Editing' },
    { value: 'programming', label: '💻 Programming' },
    { value: 'ai_ml', label: '🧠 AI/ML' },
    { value: 'productivity', label: '📊 Productivity' },
    { value: 'mixed', label: '⚖️ Mixed' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-forge-text2 mb-2">Primary Use Case</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`cursor-pointer p-3 rounded-lg border transition-all ${
              usage === option.value
                ? 'border-forge-accent bg-forge-accent/10 shadow-[0_0_20px_rgba(0,240,255,0.1)]'
                : 'border-forge-border bg-forge-card hover:border-forge-accent/50'
            }`}
          >
            <input type="radio" {...register('usage')} value={option.value} className="hidden" />
            <div className="text-center text-sm">{option.label}</div>
          </label>
        ))}
      </div>
      {errors.usage && <p className="text-sm text-forge-danger mt-1">{errors.usage.message as string}</p>}
    </div>
  );
}

// Region Selector Component
function RegionSelector({ register, errors, region }: any) {
  const regions = [
    { code: 'PK', name: '🇵🇰 Pakistan' },
    { code: 'US', name: '🇺🇸 United States' },
    { code: 'GB', name: '🇬🇧 United Kingdom' },
    { code: 'CA', name: '🇨🇦 Canada' },
    { code: 'AU', name: '🇦🇺 Australia' },
    { code: 'AE', name: '🇦🇪 UAE' },
    { code: 'SA', name: '🇸🇦 Saudi Arabia' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-forge-text2 mb-2">Region</label>
      <select
        {...register('region')}
        className="w-full px-4 py-3 bg-forge-card border border-forge-border rounded-lg text-forge-text focus:border-forge-accent focus:ring-1 focus:ring-forge-accent outline-none transition-colors"
      >
        {regions.map((r) => (
          <option key={r.code} value={r.code}>{r.name}</option>
        ))}
      </select>
      {errors.region && <p className="text-sm text-forge-danger mt-1">{errors.region.message as string}</p>}
    </div>
  );
}

// Build Results Component
function BuildResults({ build, onReset }: any) {
  if (!build) return null;

  const categories: Record<string, string> = {
    cpu: 'CPU',
    gpu: 'GPU',
    motherboard: 'Motherboard',
    ram: 'RAM',
    storage: 'Storage',
    psu: 'PSU',
    cooler: 'Cooler',
    case: 'Case',
    monitor: 'Monitor',
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-forge-panel/80 backdrop-blur-lg border border-forge-border rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-orbitron text-forge-accent">{build.name || 'Your Build'}</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="px-3 py-1 bg-forge-accent/20 text-forge-accent rounded-full text-sm font-medium">
                {build.tier || 'Custom'}
              </span>
              <span className="text-forge-text2">Total: {build.totalPrice?.toLocaleString() || 0} {build.currency || 'PKR'}</span>
            </div>
          </div>
          <button 
            onClick={onReset} 
            className="px-4 py-2 bg-forge-card border border-forge-border rounded-lg text-forge-text2 hover:text-forge-text hover:border-forge-accent transition-colors"
          >
            New Build
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {build.components && Object.entries(build.components).map(([key, comp]: [string, any]) => (
          <motion.div 
            key={key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-forge-card border border-forge-border rounded-xl p-4 hover:border-forge-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-forge-text2 font-medium">{categories[key as keyof typeof categories] || key}</p>
                <p className="text-sm font-semibold text-forge-text">{comp.name || 'Unknown'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-forge-accent">{comp.price?.toLocaleString() || 0} {comp.currency || 'PKR'}</p>
                <span className="text-xs text-forge-text2">{comp.brand || 'Generic'}</span>
              </div>
            </div>
            <p className="text-sm text-forge-text2 mt-2">{comp.reason || 'Recommended component'}</p>
          </motion.div>
        ))}
      </div>

      {build.performance?.games && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-forge-panel/80 backdrop-blur-lg border border-forge-border rounded-2xl p-6"
        >
          <h3 className="text-lg font-orbitron text-forge-accent mb-4">🎮 Expected Gaming Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-forge-border">
                  <th className="text-left py-2 text-sm text-forge-text2 font-medium">Game</th>
                  <th className="text-center py-2 text-sm text-forge-text2 font-medium">Resolution</th>
                  <th className="text-center py-2 text-sm text-forge-text2 font-medium">Preset</th>
                  <th className="text-center py-2 text-sm text-forge-text2 font-medium">Avg FPS</th>
                </tr>
              </thead>
              <tbody>
                {build.performance.games.map((game: any, index: number) => (
                  <tr key={game.name} className="border-b border-forge-border/50">
                    <td className="py-3 text-sm text-forge-text font-medium">{game.name}</td>
                    <td className="py-3 text-center text-sm text-forge-text2">{game.resolution}</td>
                    <td className="py-3 text-center text-sm text-forge-text2">{game.preset}</td>
                    <td className="py-3 text-center text-sm font-bold text-forge-accent">{game.avgFPS}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Main Page Component
export default function BuilderPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [build, setBuild] = useState<any>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currency: 'PKR', region: 'PK', usage: 'gaming' },
  });

  const budget = watch('budget');
  const currency = watch('currency');
  const usage = watch('usage');
  const region = watch('region');

  const onSubmit = async (data: FormData) => {
    try {
      setIsGenerating(true);
      setBuild(null);

      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'recommend',
          budget: data.budget,
          currency: data.currency,
          region: data.region,
          usage: data.usage,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate build');
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      
      setBuild(result.build);
      toast.success('Build generated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate build');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-forge-bg text-forge-text">
      <div className="fixed inset-0 bg-cyber-grid bg-cyber-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold bg-gradient-to-r from-forge-accent to-forge-accent2 bg-clip-text text-transparent">
            PC BUILD GENERATOR
          </h1>
          <p className="text-forge-text2 mt-2">Let AI find the perfect components for your needs</p>
        </motion.div>

        {!build ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <div className="bg-forge-panel/80 backdrop-blur-lg border border-forge-border rounded-2xl p-6 md:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <BudgetInput register={register} errors={errors} budget={budget} currency={currency} setValue={setValue} />
                <UsageSelector register={register} errors={errors} usage={usage} />
                <RegionSelector register={register} errors={errors} region={region} />

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-4 bg-gradient-to-r from-forge-accent to-forge-accent2 text-forge-bg font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? <><LoadingSpinner size="sm" /> Generating...</> : 'Generate Build 🚀'}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <BuildResults build={build} onReset={() => setBuild(null)} />
        )}
      </div>
    </div>
  );
}