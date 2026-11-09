export type ToolType = 'draw' | 'erase' | 'pan' | 'stamp';

export type CellStyle = 'square' | 'rounded' | 'dots' | 'heatmap';

export type PatternCategory = 'spaceships' | 'oscillators' | 'guns' | 'methuselahs' | 'still-life';

export interface RuleSet {
  id: string;
  name: string;
  birth: number[];
  survival: number[];
  description: string;
}

export interface Pattern {
  id: string;
  name: string;
  category: PatternCategory;
  description: string;
  grid: number[][]; // 2D binary representation [row][col]
  author?: string;
  year?: string;
}

export interface Theme {
  id: string;
  name: string;
  bg: string;
  panelBg: string;
  cellColor: string;
  cellNewColor: string;
  cellOldColor: string;
  gridLineColor: string;
  accentColor: string;
  glowColor: string;
  isLight?: boolean;
}

export interface GameStats {
  generation: number;
  aliveCount: number;
  peakPopulation: number;
  births: number;
  deaths: number;
  density: number;
  fps: number;
  speedMultiplier: number;
  cursorX: number | null;
  cursorY: number | null;
  historyPopulations: number[];
}

export interface ViewportTransform {
  panX: number;
  panY: number;
  zoom: number;
}

