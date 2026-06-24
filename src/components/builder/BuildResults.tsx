'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BuildResponse } from '@/types/build';
import ComponentCard from './ComponentCard';
import PerformanceSection from './PerformanceSection';
import PeripheralRecommendations from './PeripheralRecommendations';
import InvoiceGenerator from '../invoice/InvoiceGenerator';
import { FaDownload, FaShare, FaPrint, FaCopy } from 'react-icons/fa';

interface BuildResultsProps {
  build: BuildResponse | null;
  onReset: () => void;
}

export default function BuildResults({ build, onReset }: BuildResultsProps) {
  const [showInvoice, setShowInvoice] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!build) {
    return (
      <div className="text-center py-12">
        <p className="text-forge-text2">No build found. Please try again.</p>
        <button
          onClick={onReset}
          className="mt-4 px-6 py-2 bg-forge-accent text-forge-bg rounded-lg hover:opacity-90"
        >
          Start Over
        </button>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My FORGE PC Build',
          text: `Check out my PC build: ${build.name} - ${build.totalPrice} ${build.currency}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share error:', error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(build, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forge-build-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const componentCategories = [
    'cpu',
    'gpu',
    'motherboard',
    'ram',
    'storage',
    'psu',
    'cooler',
    'case',
    'monitor',
  ] as const;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-forge-panel/80 backdrop-blur-lg border border-forge-border rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-orbitron text-forge-accent">
              {build.name}
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="px-3 py-1 bg-forge-accent/20 text-forge-accent rounded-full text-sm font-medium">
                {build.tier.replace('_', ' ')}
              </span>
              <span className="text-forge-text2">
                Total: {build.totalPrice.toLocaleString()} {build.currency}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-forge-card border border-forge-border rounded-lg text-forge-text2 hover:text-forge-text hover:border-forge-accent transition-colors flex items-center gap-2"
            >
              <FaShare />
              {copied ? 'Copied!' : 'Share'}
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-forge-card border border-forge-border rounded-lg text-forge-text2 hover:text-forge-text hover:border-forge-accent transition-colors flex items-center gap-2"
            >
              <FaDownload />
              Export
            </button>
            <button
              onClick={() => setShowInvoice(true)}
              className="px-4 py-2 bg-forge-accent/20 text-forge-accent border border-forge-accent rounded-lg hover:bg-forge-accent/30 transition-colors flex items-center gap-2"
            >
              <FaPrint />
              Invoice
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-forge-card border border-forge-border rounded-lg text-forge-text2 hover:text-forge-text hover:border-forge-accent transition-colors"
            >
              New Build
            </button>
          </div>
        </div>
      </motion.div>

      {/* Compatibility Status */}
      {build.compatibility && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            build.compatibility.overall
              ? 'bg-forge-success/10 border-forge-success/30'
              : 'bg-forge-danger/10 border-forge-danger/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {build.compatibility.overall ? '✅' : '⚠️'}
            </span>
            <div>
              <p className="font-medium">
                {build.compatibility.overall
                  ? 'All components are compatible!'
                  : 'Compatibility issues detected'}
              </p>
              {build.compatibility.warnings?.length > 0 && (
                <ul className="text-sm text-forge-text2 mt-1 list-disc list-inside">
                  {build.compatibility.warnings.map((warning, i) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Components Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {componentCategories.map((category) => {
          const component = build.components[category];
          if (!component) return null;
          return (
            <ComponentCard
              key={category}
              category={category}
              component={component}
            />
          );
        })}
      </div>

      {/* Performance Section */}
      {build.performance && (
        <PerformanceSection performance={build.performance} />
      )}

      {/* Peripherals */}
      {build.peripherals && build.peripherals.length > 0 && (
        <PeripheralRecommendations peripherals={build.peripherals} />
      )}

      {/* Summary & Upgrade Path */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-forge-panel/80 backdrop-blur-lg border border-forge-border rounded-2xl p-6"
      >
        <h3 className="text-lg font-orbitron text-forge-accent mb-4">
          Build Summary
        </h3>
        <p className="text-forge-text2 leading-relaxed">{build.summary}</p>

        {build.upgradePath && (
          <>
            <h4 className="text-sm font-medium text-forge-text mt-4 mb-2">
              🚀 Upgrade Path
            </h4>
            <p className="text-forge-text2 leading-relaxed">{build.upgradePath}</p>
          </>
        )}
      </motion.div>

      {/* Invoice Modal */}
      {showInvoice && (
        <InvoiceGenerator
          build={build}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
}