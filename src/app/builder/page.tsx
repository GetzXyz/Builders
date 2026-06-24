'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBuildStore } from '@/lib/store/buildStore';
import { useAuthStore } from '@/lib/store/authStore';
import BudgetInput from '@/components/builder/BudgetInput';
import UsageSelector from '@/components/builder/UsageSelector';
import RegionSelector from '@/components/builder/RegionSelector';
import BuildResults from '@/components/builder/BuildResults';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { CURRENCIES, REGIONS } from '@/lib/constants';
import { UsageType } from '@/types/build';

const schema = z.object({
  budget: z.number().min(1000, 'Minimum budget is 1,000'),
  currency: z.string().min(1, 'Please select a currency'),
  region: z.string().min(1, 'Please select a region'),
  usage: z.string().min(1, 'Please select a use case'),
  includeMonitor: z.boolean().optional(),
  includePeripherals: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function BuilderPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const { build, setBuild, clearBuild } = useBuildStore();
  const { user, requiresConsent } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      currency: 'PKR',
      region: 'PK',
      usage: 'gaming',
    },
  });

  const budget = watch('budget');
  const currency = watch('currency');
  const region = watch('region');
  const usage = watch('usage');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (requiresConsent) {
      router.push('/privacy');
    }
  }, [user, requiresConsent, router]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsGenerating(true);
      setShowResults(false);

      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'recommend',
          budget: data.budget,
          currency: data.currency,
          region: data.region,
          usage: data.usage,
          preferences: {
            includeMonitor: data.includeMonitor,
            includePeripherals: data.includePeripherals,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate build');
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      setBuild(result.build);
      setShowResults(true);
      toast.success('Build generated successfully!');
    } catch (error) {
      console.error('Build generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate build');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    clearBuild();
    setShowResults(false);
    setStep(1);
  };

  const steps = [
    { id: 1, label: 'Budget & Currency' },
    { id: 2, label: 'Use Case & Region' },
    { id: 3, label: 'Preferences' },
  ];

  return (
    <div className="min-h-screen bg-forge-bg text-forge-text">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-cyber-grid bg-cyber-grid opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-radial from-forge-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold bg-gradient-to-r from-forge-accent to-forge-accent2 bg-clip-text text-transparent">
            PC BUILD GENERATOR
          </h1>
          <p className="text-forge-text2 mt-2 text-lg">
            Let AI find the perfect components for your needs
          </p>
        </motion.div>

        {!showResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-forge-panel/80 backdrop-blur-lg border border-forge-border rounded-2xl p-6 md:p-8">
              {/* Step Indicator */}
              <div className="flex justify-between mb-8">
                {steps.map((s) => (
                  <div key={s.id} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        step >= s.id
                          ? 'bg-forge-accent text-forge-bg'
                          : 'bg-forge-card text-forge-text2'
                      }`}
                    >
                      {s.id}
                    </div>
                    {s.id < steps.length && (
                      <div
                        className={`w-12 h-0.5 mx-2 ${
                          step > s.id ? 'bg-forge-accent' : 'bg-forge-border'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <BudgetInput
                        register={register}
                        errors={errors}
                        budget={budget}
                        currency={currency}
                        setValue={setValue}
                      />

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-forge-text2 mb-2">
                          Currency
                        </label>
                        <select
                          {...register('currency')}
                          className="w-full px-4 py-3 bg-forge-card border border-forge-border rounded-lg text-forge-text focus:border-forge-accent focus:ring-1 focus:ring-forge-accent outline-none transition-colors"
                        >
                          {Object.entries(CURRENCIES).map(([code, info]) => (
                            <option key={code} value={code}>
                              {info.symbol} {code} - {info.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full py-3 bg-gradient-to-r from-forge-accent to-forge-accent2 text-forge-bg font-bold rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Continue to Use Case →
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <UsageSelector
                        register={register}
                        errors={errors}
                        usage={usage}
                      />

                      <RegionSelector
                        register={register}
                        errors={errors}
                        region={region}
                      />

                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex-1 py-3 bg-forge-card border border-forge-border text-forge-text rounded-lg hover:bg-forge-card/80 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="flex-1 py-3 bg-gradient-to-r from-forge-accent to-forge-accent2 text-forge-bg font-bold rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Continue to Preferences →
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-forge-text">
                          Additional Preferences
                        </h3>

                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              {...register('includeMonitor')}
                              className="w-4 h-4 accent-forge-accent"
                            />
                            <span className="text-forge-text2">Include Monitor</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              {...register('includePeripherals')}
                              className="w-4 h-4 accent-forge-accent"
                            />
                            <span className="text-forge-text2">Include Peripherals</span>
                          </label>
                        </div>
                      </div>

                      <div className="bg-forge-card/50 p-4 rounded-lg border border-forge-border">
                        <h4 className="font-medium text-forge-text mb-2">Build Summary</h4>
                        <div className="space-y-1 text-sm text-forge-text2">
                          <p>Budget: {budget?.toLocaleString()} {currency}</p>
                          <p>Use Case: {usage}</p>
                          <p>Region: {REGIONS.find(r => r.code === region)?.name || region}</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="flex-1 py-3 bg-forge-card border border-forge-border text-forge-text rounded-lg hover:bg-forge-card/80 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isGenerating}
                          className="flex-1 py-3 bg-gradient-to-r from-forge-accent to-forge-accent2 text-forge-bg font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isGenerating ? (
                            <>
                              <LoadingSpinner size="sm" />
                              Generating...
                            </>
                          ) : (
                            'Generate Build 🚀'
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        ) : (
          <BuildResults build={build} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}