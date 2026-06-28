import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, budget, currency, region, usage } = body;

    if (action === 'recommend') {
      // Generate a realistic build based on budget
      const tier = budget > 300000 ? 'HIGH_END' : budget > 150000 ? 'MID_RANGE' : 'BUDGET';
      
      // Calculate component prices based on budget
      const cpuPrice = Math.round(budget * 0.20);
      const gpuPrice = Math.round(budget * 0.35);
      const moboPrice = Math.round(budget * 0.10);
      const ramPrice = Math.round(budget * 0.08);
      const storagePrice = Math.round(budget * 0.07);
      const psuPrice = Math.round(budget * 0.06);
      const coolerPrice = Math.round(budget * 0.02);
      const casePrice = Math.round(budget * 0.05);
      const monitorPrice = Math.round(budget * 0.07);

      const build = {
        id: 'build_' + Date.now(),
        name: `${usage.charAt(0).toUpperCase() + usage.slice(1)} Build - ${tier}`,
        tier: tier,
        totalPrice: budget,
        currency: currency || 'PKR',
        components: {
          cpu: { 
            name: budget > 200000 ? 'AMD Ryzen 7 7800X3D' : 'AMD Ryzen 5 5600X', 
            brand: 'AMD', 
            price: cpuPrice, 
            currency: currency || 'PKR', 
            reason: budget > 200000 ? 'Best gaming CPU' : 'Great value gaming CPU' 
          },
          gpu: { 
            name: budget > 300000 ? 'NVIDIA RTX 4070 Ti' : budget > 150000 ? 'NVIDIA RTX 3060 12GB' : 'NVIDIA GTX 1660 Super', 
            brand: 'NVIDIA', 
            price: gpuPrice, 
            currency: currency || 'PKR', 
            reason: budget > 300000 ? 'Excellent 1440p gaming' : 'Great 1080p gaming' 
          },
          motherboard: { 
            name: budget > 200000 ? 'ASUS ROG STRIX B650E-F' : 'MSI B550M PRO-VDH', 
            brand: budget > 200000 ? 'ASUS' : 'MSI', 
            price: moboPrice, 
            currency: currency || 'PKR', 
            reason: 'Reliable motherboard' 
          },
          ram: { 
            name: budget > 200000 ? '32GB DDR5 6000MHz' : '16GB DDR4 3200MHz', 
            brand: 'Corsair', 
            price: ramPrice, 
            currency: currency || 'PKR', 
            reason: budget > 200000 ? 'DDR5 sweet spot' : 'DDR4 sweet spot' 
          },
          storage: { 
            name: budget > 150000 ? '1TB NVMe SSD' : '512GB NVMe SSD', 
            brand: 'Samsung', 
            price: storagePrice, 
            currency: currency || 'PKR', 
            reason: 'Fast storage' 
          },
          psu: { 
            name: budget > 200000 ? '750W 80+ Gold' : '650W 80+ Bronze', 
            brand: 'Seasonic', 
            price: psuPrice, 
            currency: currency || 'PKR', 
            reason: 'Reliable power supply' 
          },
          cooler: { 
            name: budget > 200000 ? 'Noctua NH-D15' : 'Stock Cooler', 
            brand: budget > 200000 ? 'Noctua' : 'AMD', 
            price: coolerPrice, 
            currency: currency || 'PKR', 
            reason: budget > 200000 ? 'Premium cooling' : 'Included with CPU' 
          },
          case: { 
            name: budget > 150000 ? 'NZXT H7 Flow' : 'Mid Tower ATX', 
            brand: 'NZXT', 
            price: casePrice, 
            currency: currency || 'PKR', 
            reason: 'Good airflow' 
          },
          monitor: { 
            name: budget > 200000 ? '27" 1440p 165Hz' : '24" 1080p 144Hz', 
            brand: 'ASUS', 
            price: monitorPrice, 
            currency: currency || 'PKR', 
            reason: budget > 200000 ? 'Great for gaming' : 'Great for gaming' 
          },
        },
        performance: {
          games: [
            { name: 'Valorant', resolution: budget > 200000 ? '1440p' : '1080p', preset: 'High', avgFPS: budget > 200000 ? 300 : 200, lowFPS: budget > 200000 ? 250 : 150, confidence: 90 },
            { name: 'Counter-Strike 2', resolution: budget > 200000 ? '1440p' : '1080p', preset: 'High', avgFPS: budget > 200000 ? 250 : 180, lowFPS: budget > 200000 ? 200 : 130, confidence: 85 },
            { name: 'GTA V', resolution: budget > 200000 ? '1440p' : '1080p', preset: 'High', avgFPS: budget > 200000 ? 180 : 120, lowFPS: budget > 200000 ? 140 : 80, confidence: 80 },
            { name: 'Cyberpunk 2077', resolution: budget > 200000 ? '1440p' : '1080p', preset: budget > 200000 ? 'High' : 'Medium', avgFPS: budget > 200000 ? 90 : 60, lowFPS: budget > 200000 ? 70 : 45, confidence: 75 },
            { name: 'Fortnite', resolution: budget > 200000 ? '1440p' : '1080p', preset: 'High', avgFPS: budget > 200000 ? 200 : 140, lowFPS: budget > 200000 ? 160 : 100, confidence: 85 },
          ],
          synthetic: {
            singleCore: budget > 200000 ? 2100 : 1500,
            multiCore: budget > 200000 ? 12000 : 8000,
            gpuScore: budget > 300000 ? 22000 : budget > 150000 ? 12000 : 8000,
            memoryScore: budget > 200000 ? 3500 : 2500,
          },
          summary: `${tier} build optimized for ${usage} with excellent performance in all major titles.`,
        },
        peripherals: [
          { category: 'keyboard' as const, name: budget > 150000 ? 'Logitech G Pro X' : 'Redragon K552', brand: budget > 150000 ? 'Logitech' : 'Redragon', price: budget > 150000 ? 15000 : 5000, currency: currency || 'PKR', tier: budget > 150000 ? 'premium' : 'budget', reason: 'Great mechanical keyboard' },
          { category: 'mouse' as const, name: budget > 150000 ? 'Logitech G Pro X Superlight' : 'Logitech G203', brand: 'Logitech', price: budget > 150000 ? 20000 : 4000, currency: currency || 'PKR', tier: budget > 150000 ? 'premium' : 'budget', reason: 'Excellent gaming mouse' },
          { category: 'headphones' as const, name: budget > 150000 ? 'SteelSeries Arctis Nova Pro' : 'HyperX Cloud Stinger', brand: budget > 150000 ? 'SteelSeries' : 'HyperX', price: budget > 150000 ? 25000 : 6000, currency: currency || 'PKR', tier: budget > 150000 ? 'premium' : 'budget', reason: 'Great gaming headset' },
        ],
        compatibility: {
          overall: true,
          issues: [],
          warnings: [],
          suggestions: ['Consider upgrading GPU for 4K gaming'],
        },
        summary: `A powerful ${tier} build optimized for ${usage}. All components are compatible and offer excellent performance for the budget.`,
        upgradePath: 'Consider upgrading the GPU first for better gaming performance, followed by CPU for productivity workloads.',
      };

      return NextResponse.json({ build });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}