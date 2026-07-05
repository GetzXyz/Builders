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

/* ===== Engine v2 ===== */

export type ComponentCategory =
  | 'cpu' | 'gpu' | 'motherboard' | 'ram'
  | 'storage' | 'psu' | 'case' | 'cooler';

export interface ComponentOption {
  name: string;
  brand: string;
  condition: 'new' | 'used';
  price: number;
  currency: string;
  reason: string;
  wattage: number;
  riskRating?: 'low' | 'medium' | 'high';
}

export interface ComponentSlot {
  category: ComponentCategory;
  options: ComponentOption[]; // exactly 3
  selectedIndex: number;
}

export interface BuildV2 {
  id: string;
  name: string;
  tier: string;
  currency: string;
  slots: ComponentSlot[];
  totalPrice: number;
  compatibility: CompatibilityReport;
  summary: string;
}

export interface GamePerf {
  name: string;
  resolution: string;
  preset: string;
  avgFPS: number;
  low1: number;
}

export interface SoftwarePerf {
  name: string;
  score: number; // 0-100
  tier: 'Entry' | 'Capable' | 'Professional' | 'Workstation';
  note: string;
}

export interface PerformanceReport {
  games: GamePerf[];
  software: SoftwarePerf[];
  summary: string;
}

/* ===== Legacy v1 (used by current builder page until R3) ===== */

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