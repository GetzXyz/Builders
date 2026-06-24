'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BuildResponse } from '@/types/build';
import { FaDownload, FaPrint, FaTimes } from 'react-icons/fa';

interface InvoiceGeneratorProps {
  build: BuildResponse;
  onClose: () => void;
}

export default function InvoiceGenerator({ build, onClose }: InvoiceGeneratorProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (invoiceRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>FORGE PC Build Invoice</title>
              <style>
                body { 
                  font-family: 'Arial', sans-serif; 
                  padding: 40px; 
                  max-width: 800px; 
                  margin: 0 auto;
                  background: white;
                  color: #1a1a2e;
                }
                .invoice-header { 
                  text-align: center; 
                  border-bottom: 2px solid #1a1a2e; 
                  padding-bottom: 20px; 
                  margin-bottom: 30px;
                }
                .invoice-header h1 { 
                  font-size: 28px; 
                  color: #1a1a2e;
                  margin: 0;
                }
                .invoice-header .subtitle { 
                  color: #666; 
                  font-size: 14px;
                }
                .invoice-meta { 
                  display: flex; 
                  justify-content: space-between; 
                  margin-bottom: 30px;
                  background: #f8f9fa;
                  padding: 15px;
                  border-radius: 8px;
                }
                .invoice-meta div { font-size: 14px; }
                .invoice-meta .label { color: #666; }
                .invoice-table { 
                  width: 100%; 
                  border-collapse: collapse; 
                  margin: 20px 0;
                }
                .invoice-table th { 
                  background: #1a1a2e; 
                  color: white; 
                  padding: 12px; 
                  text-align: left;
                }
                .invoice-table td { 
                  padding: 12px; 
                  border-bottom: 1px solid #eee;
                }
                .invoice-table .category { 
                  color: #666; 
                  font-size: 12px; 
                  font-weight: 600;
                  text-transform: uppercase;
                }
                .invoice-table .price { 
                  font-weight: 600; 
                  text-align: right;
                }
                .invoice-total { 
                  margin-top: 30px; 
                  text-align: right; 
                  border-top: 2px solid #1a1a2e; 
                  padding-top: 20px;
                }
                .invoice-total .grand-total { 
                  font-size: 24px; 
                  font-weight: 700; 
                  color: #1a1a2e;
                }
                .invoice-footer { 
                  margin-top: 40px; 
                  text-align: center; 
                  color: #666; 
                  font-size: 12px;
                  border-top: 1px solid #eee;
                  padding-top: 20px;
                }
                .performance-summary {
                  background: #f8f9fa;
                  padding: 15px;
                  border-radius: 8px;
                  margin: 20px 0;
                }
                .performance-summary h3 {
                  margin-top: 0;
                  color: #1a1a2e;
                }
                .performance-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                  gap: 10px;
                }
                .performance-item {
                  background: white;
                  padding: 10px;
                  border-radius: 4px;
                  border: 1px solid #eee;
                }
                .performance-item .game { font-weight: 600; }
                .performance-item .fps { color: #1a1a2e; }
                @media print {
                  body { padding: 20px; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${invoiceRef.current.innerHTML}
              <script>
                window.onload = function() { window.print(); }
              <\/script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const componentCategories = [
    { key: 'cpu', label: 'CPU' },
    { key: 'gpu', label: 'GPU' },
    { key: 'motherboard', label: 'Motherboard' },
    { key: 'ram', label: 'RAM' },
    { key: 'storage', label: 'Storage' },
    { key: 'psu', label: 'PSU' },
    { key: 'cooler', label: 'Cooler' },
    { key: 'case', label: 'Case' },
    { key: 'monitor', label: 'Monitor' },
  ];

  const components = componentCategories
    .map(({ key, label }) => ({
      label,
      ...build.components[key as keyof typeof build.components],
    }))
    .filter(c => c && c.name);

  const totalPeripherals = build.peripherals?.reduce(
    (sum, p) => sum + p.price,
    0
  ) || 0;

  const grandTotal = build.totalPrice + totalPeripherals;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-forge-panel rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Invoice Content */}
          <div ref={invoiceRef} className="p-8 text-gray-900 dark:text-forge-text">
            {/* Header */}
            <div className="text-center border-b-2 border-forge-border dark:border-forge-border pb-6 mb-8">
              <h1 className="text-3xl font-orbitron text-forge-accent">
                FORGE PC BUILDER
              </h1>
              <p className="text-forge-text2 mt-1">Premium PC Build Invoice</p>
              <p className="text-sm text-forge-text2 mt-2">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-forge-card/50 rounded-lg">
              <div>
                <p className="text-xs text-forge-text2">Build Name</p>
                <p className="font-medium">{build.name}</p>
              </div>
              <div>
                <p className="text-xs text-forge-text2">Tier</p>
                <p className="font-medium">{build.tier.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-xs text-forge-text2">Currency</p>
                <p className="font-medium">{build.currency}</p>
              </div>
              <div>
                <p className="text-xs text-forge-text2">Region</p>
                <p className="font-medium">Pakistan</p>
              </div>
            </div>

            {/* Components Table */}
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-forge-accent/10">
                  <th className="text-left py-2 px-3 text-sm font-medium text-forge-text2">
                    Component
                  </th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-forge-text2">
                    Product
                  </th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-forge-text2">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {components.map((comp) => (
                  <tr key={comp.label} className="border-b border-forge-border/50">
                    <td className="py-2 px-3 text-sm text-forge-text2">
                      {comp.label}
                    </td>
                    <td className="py-2 px-3 text-sm text-forge-text">
                      {comp.name}
                    </td>
                    <td className="py-2 px-3 text-sm text-right font-medium text-forge-accent">
                      {comp.price.toLocaleString()} {comp.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-forge-border">
                  <td className="py-3 px-3 font-bold" colSpan={2}>
                    Hardware Total
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-forge-accent">
                    {build.totalPrice.toLocaleString()} {build.currency}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Peripherals */}
            {build.peripherals && build.peripherals.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-forge-text2 mb-2">
                  Peripherals
                </h3>
                <div className="space-y-1">
                  {build.peripherals.map((p) => (
                    <div key={p.category} className="flex justify-between text-sm">
                      <span className="text-forge-text2 capitalize">
                        {p.category}
                      </span>
                      <span>{p.name}</span>
                      <span className="font-medium text-forge-accent">
                        {p.price.toLocaleString()} {p.currency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Summary */}
            {build.performance && (
              <div className="mb-6 p-4 bg-forge-card/30 rounded-lg">
                <h3 className="text-sm font-medium text-forge-text2 mb-3">
                  Expected Gaming Performance
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {build.performance.games.slice(0, 6).map((game) => (
                    <div
                      key={game.name}
                      className="bg-forge-card p-2 rounded border border-forge-border/50"
                    >
                      <p className="text-xs font-medium text-forge-text">
                        {game.name}
                      </p>
                      <p className="text-sm text-forge-accent">
                        {game.avgFPS} FPS
                      </p>
                      <p className="text-xs text-forge-text2">
                        {game.resolution} · {game.preset}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grand Total */}
            <div className="text-right border-t-2 border-forge-border pt-4 mt-4">
              <p className="text-sm text-forge-text2">Grand Total</p>
              <p className="text-2xl font-bold text-forge-accent">
                {grandTotal.toLocaleString()} {build.currency}
              </p>
              <p className="text-xs text-forge-text2 mt-1">
                * Prices are estimates based on current market data
              </p>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-forge-text2 border-t border-forge-border/50 pt-4 mt-6">
              <p>Generated by FORGE AI PC Builder</p>
              <p className="mt-1">
                This is a recommendation. Verify all prices and compatibility before purchasing.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-forge-border flex justify-end gap-3 bg-forge-card/30 rounded-b-2xl no-print">
            <button
              onClick={onClose}
              className="px-4 py-2 text-forge-text2 hover:text-forge-text transition-colors"
            >
              <FaTimes />
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-forge-accent/20 text-forge-accent border border-forge-accent rounded-lg hover:bg-forge-accent/30 transition-colors flex items-center gap-2"
            >
              <FaPrint />
              Print / PDF
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}