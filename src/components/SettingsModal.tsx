import React from 'react';
import { X, Sliders, Eye, Box, Volume2, Globe } from 'lucide-react';
import { CellStyle, Theme } from '../types/game';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cellStyle: CellStyle;
  onSelectCellStyle: (style: CellStyle) => void;
  toroidal: boolean;
  onToggleToroidal: () => void;
  showGridLines: boolean;
  onToggleGridLines: () => void;
  gridWidth: number;
  gridHeight: number;
  onResizeGrid: (w: number, h: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: Theme;
}

const GRID_SIZES = [
  { label: 'Compact', w: 80, h: 50, desc: '80×50 cells — Best for mobile / smaller screens' },
  { label: 'Standard', w: 120, h: 80, desc: '120×80 cells — Balanced performance & space' },
  { label: 'Large', w: 160, h: 100, desc: '160×100 cells — Great for expansive gliders & guns' },
  { label: 'Vast', w: 220, h: 140, desc: '220×140 cells — Massive canvas for complex ecosystems' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  cellStyle,
  onSelectCellStyle,
  toroidal,
  onToggleToroidal,
  showGridLines,
  onToggleGridLines,
  gridWidth,
  gridHeight,
  onResizeGrid,
  soundEnabled,
  onToggleSound,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Simulation Settings</h2>
              <p className="text-xs text-white/50">Configure universe physics and display</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Cell Visual Style */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-white/80 flex items-center space-x-1.5 uppercase font-mono tracking-wider">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cell Rendering Mode</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'square', label: 'Classic Square', desc: 'Crisp geometric pixels' },
                { id: 'rounded', label: 'Rounded Nano', desc: 'Modern squircle cells' },
                { id: 'dots', label: 'Dot Matrix', desc: 'Circular micro-dots' },
                { id: 'heatmap', label: 'Age Heatmap', desc: 'Color shifts by cell longevity' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => onSelectCellStyle(style.id as CellStyle)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    cellStyle === style.id
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                      : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <div className="text-xs font-medium">{style.label}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Universe Topology */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-white/80 flex items-center space-x-1.5 uppercase font-mono tracking-wider">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Edge Wrapping (Toroidal Universe)</span>
            </label>
            <div
              onClick={onToggleToroidal}
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/[0.06] transition-colors"
            >
              <div>
                <div className="text-xs font-medium text-white">
                  {toroidal ? 'Toroidal Topology (Wrapping)' : 'Bounded Borders (Hard Wall)'}
                </div>
                <div className="text-[11px] text-white/40 mt-0.5">
                  {toroidal
                    ? 'Gliders and signals wrap seamlessly across the universe borders'
                    : 'Cells at borders collide with walls and die if overcrowded'}
                </div>
              </div>
              <div
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                  toroidal ? 'bg-emerald-500' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    toroidal ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Grid Lines */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-white/80 flex items-center space-x-1.5 uppercase font-mono tracking-wider">
              <Box className="w-3.5 h-3.5 text-amber-400" />
              <span>Grid Guidelines</span>
            </label>
            <div
              onClick={onToggleGridLines}
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/[0.06] transition-colors"
            >
              <div>
                <div className="text-xs font-medium text-white">Show Grid Matrix Lines</div>
                <div className="text-[11px] text-white/40 mt-0.5">
                  Subtle matrix lines separating individual cells
                </div>
              </div>
              <div
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                  showGridLines ? 'bg-emerald-500' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    showGridLines ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Grid Dimensions */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-white/80 flex items-center space-x-1.5 uppercase font-mono tracking-wider">
              <span>Universe Dimensions</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GRID_SIZES.map((size) => {
                const isSelected = gridWidth === size.w && gridHeight === size.h;
                return (
                  <button
                    key={size.label}
                    onClick={() => onResizeGrid(size.w, size.h)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                        : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{size.label}</span>
                      <span className="text-[10px] font-mono text-white/40">
                        {size.w}×{size.h}
                      </span>
                    </div>
                    <div className="text-[10px] text-white/40 mt-1">{size.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generative Sound FX */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-white/80 flex items-center space-x-1.5 uppercase font-mono tracking-wider">
              <Volume2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Audio Synthesis</span>
            </label>
            <div
              onClick={onToggleSound}
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/[0.06] transition-colors"
            >
              <div>
                <div className="text-xs font-medium text-white">Generative Pentatonic Audio</div>
                <div className="text-[11px] text-white/40 mt-0.5">
                  Subtle generative chimes on generation steps and cell drawing
                </div>
              </div>
              <div
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                  soundEnabled ? 'bg-purple-500' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-md"
            style={{ backgroundColor: theme.accentColor }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
