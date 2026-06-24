'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ComponentSelection, ComponentCategory } from '@/types/build';

interface ComponentCardProps {
  category: ComponentCategory;
  component: ComponentSelection;
}

const categoryIcons: Record<ComponentCategory, string> = {
  cpu: '🔲',
  gpu: '🎮',
  motherboard: '🧩',
  ram: '⚡',
  storage: '💾',
  psu: '🔌',
  cooler: '❄️',
  case: '📦',
  monitor: '🖥️',
};

const categoryLabels: Record<ComponentCategory, string> = {
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

export default function ComponentCard({ category, component }: ComponentCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className="bg-forge-card border border-forge-border rounded-xl overflow-hidden hover:border-forge-accent/50 transition-colors"
    >
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{categoryIcons[category]}</span>
            <div>
              <p className="text-xs text-forge-text2 font-medium">
                {categoryLabels[category]}
              </p>
              <p className="text-sm font-semibold text-forge-text">
                {component.name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-forge-accent">
              {component.price.toLocaleString()} {component.currency}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  component.compatibility.compatible
                    ? 'bg-forge-success'
                    : 'bg-forge-danger'
                }`}
              />
              <span className="text-xs text-forge-text2">
                {component.compatibility.compatible ? 'Compatible' : 'Issues'}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-forge-text2 mt-2 line-clamp-2">
          {component.reason}
        </p>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs px-2 py-1 bg-forge-panel rounded text-forge-text2">
            {component.brand}
          </span>
          <span className="text-xs px-2 py-1 bg-forge-panel rounded text-forge-text2">
            {component.model}
          </span>
        </div>
      </div>

      {expanded && component.specs && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-4 border-t border-forge-border pt-3"
        >
          <p className="text-xs font-medium text-forge-text2 mb-2">Specifications</p>
          <div className="grid grid-cols-2 gap-1 text-sm">
            {Object.entries(component.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-forge-text2 capitalize">
                  {key.replace(/_/g, ' ')}:
                </span>
                <span className="text-forge-text">{String(value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}