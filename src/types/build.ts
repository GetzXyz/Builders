export interface BuildRequest {
  budget: number;
  currency: string;
  region: string;
  usage: UsageType;
  preferences?: BuildPreferences;
}

export type UsageType = 
  | 'gaming'
  | 'streaming'
  | 'editing'
  | 'programming'
  | 'ai_ml'
  | 'productivity'
  | 'mixed';

export interface BuildPreferences {
  includeMonitor?: boolean;
  includePeripherals?: boolean;
  usedComponents?: boolean;
  overclock?: boolean;
  colorTheme?: string;
  formFactor?: 'ATX' | 'mATX' | 'ITX';
}

export interface BuildResponse {
  id: string;
  name: string;
  tier: BuildTier;
  totalPrice: number;
  currency: string;
  components: ComponentSelection[];
  performance: PerformancePrediction;
  peripherals?: PeripheralRecommendation[];
  compatibility: CompatibilityReport;
  summary: string;
  upgradePath: string;
}

export interface ComponentSelection {
  category: ComponentCategory;
  name: string;
  brand: string;
  model: string;
  price: number;
  currency: string;
  reason: string;
  compatibility: ComponentCompatibility;
  specs: Record<string, any>;
  selected: boolean;
}

export type ComponentCategory = 
  | 'cpu'
  | 'gpu'
  | 'motherboard'
  | 'ram'
  | 'storage'
  | 'psu'
  | 'cooler'
  | 'case'
  | 'monitor';

export interface ComponentCompatibility {
  compatible: boolean;
  issues?: string[];
  warnings?: string[];
}

export interface CompatibilityReport {
  overall: boolean;
  issues: string[];
  warnings: string[];
  suggestions: string[];
}

export interface PerformancePrediction {
  games: GamePerformance[];
  synthetic: SyntheticPerformance;
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

export interface SyntheticPerformance {
  singleCore: number;
  multiCore: number;
  gpuScore: number;
  memoryScore: number;
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

export type BuildTier = 'ENTRY' | 'BUDGET' | 'MID_RANGE' | 'HIGH_END' | 'ENTHUSIAST' | 'FLAGSHIP';