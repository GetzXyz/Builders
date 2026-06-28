export interface BuildRequest {
  budget: number;
  currency: string;
  region: string;
  usage: string;
  preferences?: {
    includeMonitor?: boolean;
    includePeripherals?: boolean;
  };
}

export interface BuildResponse {
  id: string;
  name: string;
  tier: string;
  totalPrice: number;
  currency: string;
  components: Record<string, ComponentSelection>;
  performance: PerformancePrediction;
  peripherals?: PeripheralRecommendation[];
  compatibility: CompatibilityReport;
  summary: string;
  upgradePath: string;
}

export interface ComponentSelection {
  name: string;
  brand: string;
  price: number;
  currency: string;
  reason: string;
  specs?: Record<string, any>;
}

export interface PerformancePrediction {
  games: GamePerformance[];
  synthetic: {
    singleCore: number;
    multiCore: number;
    gpuScore: number;
    memoryScore: number;
  };
  summary: string;
}

export interface GamePerformance {
  name: string;
  resolution: string;
  preset: string;
  avgFPS: number;
  lowFPS: number;
  confidence: number;
}

export interface PeripheralRecommendation {
  category: 'keyboard' | 'mouse' | 'headphones';
  name: string;
  brand: string;
  price: number;
  currency: string;
  tier: 'budget' | 'mid' | 'premium';
  reason: string;
}

export interface CompatibilityReport {
  overall: boolean;
  issues: string[];
  warnings: string[];
  suggestions: string[];
} 