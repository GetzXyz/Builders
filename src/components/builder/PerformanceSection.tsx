'use client';

import { motion } from 'framer-motion';
import { PerformancePrediction } from '@/types/build';

interface PerformanceSectionProps {
  performance: PerformancePrediction;
}

export default function PerformanceSection({ performance }: PerformanceSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-forge-panel/80 backdrop-blur-lg border border-forge-border rounded-2xl overflow-hidden"
    >
      <div className="p-6">
        <h3 className="text-lg font-orbitron text-forge-accent mb-4">
          🎮 Expected Gaming Performance
        </h3>

        <p className="text-forge-text2 text-sm mb-6">{performance.summary}</p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-forge-border">
                <th className="text-left py-2 text-sm text-forge-text2 font-medium">
                  Game
                </th>
                <th className="text-center py-2 text-sm text-forge-text2 font-medium">
                  Resolution
                </th>
                <th className="text-center py-2 text-sm text-forge-text2 font-medium">
                  Preset
                </th>
                <th className="text-center py-2 text-sm text-forge-text2 font-medium">
                  Avg FPS
                </th>
                <th className="text-center py-2 text-sm text-forge-text2 font-medium">
                  1% Low
                </th>
              </tr>
            </thead>
            <tbody>
              {performance.games.map((game, index) => (
                <motion.tr
                  key={game.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-forge-border/50 hover:bg-forge-card/50 transition-colors"
                >
                  <td className="py-3 text-sm text-forge-text font-medium">
                    {game.name}
                  </td>
                  <td className="py-3 text-center text-sm text-forge-text2">
                    {game.resolution}
                  </td>
                  <td className="py-3 text-center text-sm text-forge-text2">
                    {game.preset}
                  </td>
                  <td className="py-3 text-center text-sm font-bold text-forge-accent">
                    {game.avgFPS}
                  </td>
                  <td className="py-3 text-center text-sm text-forge-text2">
                    {game.lowFPS}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-xs text-forge-text2">
          <span className="inline-block px-2 py-1 bg-forge-card rounded">
            Confidence: {performance.games[0]?.confidence || 0}%
          </span>
          <span className="ml-2">
            * Estimates based on benchmark data and hardware scaling
          </span>
        </div>
      </div>

      {/* Synthetic Benchmarks */}
      {performance.synthetic && (
        <div className="border-t border-forge-border p-6 bg-forge-card/30">
          <h4 className="text-sm font-medium text-forge-text2 mb-3">
            Synthetic Benchmarks
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(performance.synthetic).map(([key, value]) => (
              <div key={key} className="text-center">
                <p className="text-xs text-forge-text2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-lg font-bold text-forge-accent">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}   