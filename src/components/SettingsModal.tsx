import React from 'react';
import { X, Sliders, Eye, Box, Volume2, Globe, Shield } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
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
  { label: 'Compact', w: 80, h: 50, desc: '80×50 cells' },
  { label: 'Standard', w: 120, h: 80, desc: '120×80 cells' },
  { label: 'Large', w: 160, h: 100, desc: '160×100 cells' },
  { label: 'Vast', w: 220, h: 140, desc: '220×140 cells' },
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
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-fadeIn" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-sim-surface border border-sim-border rounded-lg shadow-popover overflow-hidden flex flex-col font-sans animate-fadeIn outline-none">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-sim-border bg-sim-surface">
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded bg-sim-elevated border border-sim-border text-sim-accent">
                <Sliders className="w-3.5 h-3.5" />
              </div>
              <div>
                <Dialog.Title className="text-xs font-semibold tracking-wider font-mono uppercase text-sim-text-primary">
                  SIMULATION SETTINGS
                </Dialog.Title>
                <Dialog.Description className="text-[11px] text-sim-text-secondary">
                  Grid physics, geometry & display parameters
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="p-1 rounded text-sim-text-secondary hover:text-sim-text-primary hover:bg-sim-hover border border-transparent hover:border-sim-border transition-colors">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Settings Body */}
          <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto bg-sim-bg text-xs">
            {/* Cell Visual Mode */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-sim-text-secondary flex items-center space-x-1.5">
                <Eye className="w-3 h-3 text-sim-accent" />
                <span>Cell Render Mode</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'square', label: 'Classic Square', desc: 'Sharp geometric pixels' },
                  { id: 'rounded', label: 'Rounded Squircle', desc: 'Subtle corner rounding' },
                  { id: 'dots', label: 'Dot Matrix', desc: 'Circular micro-dots' },
                  { id: 'heatmap', label: 'Age Heatmap', desc: 'Longevity gradient' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => onSelectCellStyle(mode.id as CellStyle)}
                    className={`p-2.5 rounded border text-left transition-colors ${
                      cellStyle === mode.id
                        ? 'bg-sim-elevated border-sim-accent/50 text-sim-text-primary'
                        : 'bg-sim-surface border-sim-border text-sim-text-secondary hover:bg-sim-hover hover:text-sim-text-primary'
                    }`}
                  >
                    <div className="font-medium text-xs text-sim-text-primary">{mode.label}</div>
                    <div className="text-[10px] text-sim-text-muted mt-0.5">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Universe Topology */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-sim-text-secondary flex items-center space-x-1.5">
                <Globe className="w-3 h-3 text-sim-secondary" />
                <span>Universe Topology</span>
              </label>
              <div
                onClick={onToggleToroidal}
                className="flex items-center justify-between p-3 rounded bg-sim-surface border border-sim-border cursor-pointer hover:bg-sim-hover transition-colors"
              >
                <div>
                  <div className="font-medium text-sim-text-primary">
                    {toroidal ? 'Toroidal (Infinite Edge Wrapping)' : 'Bounded (Hard Border Collisions)'}
                  </div>
                  <div className="text-[11px] text-sim-text-muted mt-0.5">
                    {toroidal
                      ? 'Cells that exit one edge immediately enter from the opposite side'
                      : 'Cells at border walls cannot escape and die when overcrowded'}
                  </div>
                </div>
                <div
                  className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${
                    toroidal ? 'bg-sim-accent' : 'bg-sim-elevated border border-sim-border'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-sim-bg transition-transform ${
                      toroidal ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Grid Matrix Guidelines */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-sim-text-secondary flex items-center space-x-1.5">
                <Box className="w-3 h-3 text-sim-text-secondary" />
                <span>Matrix Guidelines</span>
              </label>
              <div
                onClick={onToggleGridLines}
                className="flex items-center justify-between p-3 rounded bg-sim-surface border border-sim-border cursor-pointer hover:bg-sim-hover transition-colors"
              >
                <div>
                  <div className="font-medium text-sim-text-primary">Show Grid Matrix Lines</div>
                  <div className="text-[11px] text-sim-text-muted mt-0.5">
                    Render subtle partition lines between neighboring cells
                  </div>
                </div>
                <div
                  className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${
                    showGridLines ? 'bg-sim-accent' : 'bg-sim-elevated border border-sim-border'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-sim-bg transition-transform ${
                      showGridLines ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Grid Dimensions */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-sim-text-secondary flex items-center space-x-1.5">
                <Shield className="w-3 h-3 text-sim-accent" />
                <span>Universe Dimensions</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GRID_SIZES.map((size) => {
                  const isSelected = gridWidth === size.w && gridHeight === size.h;
                  return (
                    <button
                      key={size.label}
                      onClick={() => onResizeGrid(size.w, size.h)}
                      className={`p-2.5 rounded border text-left transition-colors ${
                        isSelected
                          ? 'bg-sim-elevated border-sim-accent/50 text-sim-text-primary'
                          : 'bg-sim-surface border-sim-border text-sim-text-secondary hover:bg-sim-hover hover:text-sim-text-primary'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs text-sim-text-primary">{size.label}</span>
                        <span className="text-[10px] font-mono text-sim-text-muted">
                          {size.w}×{size.h}
                        </span>
                      </div>
                      <div className="text-[10px] text-sim-text-muted mt-0.5">{size.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Audio Synthesis */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-sim-text-secondary flex items-center space-x-1.5">
                <Volume2 className="w-3 h-3 text-sim-secondary" />
                <span>Ambient Synthesis</span>
              </label>
              <div
                onClick={onToggleSound}
                className="flex items-center justify-between p-3 rounded bg-sim-surface border border-sim-border cursor-pointer hover:bg-sim-hover transition-colors"
              >
                <div>
                  <div className="font-medium text-sim-text-primary">Generative Pentatonic Audio</div>
                  <div className="text-[11px] text-sim-text-muted mt-0.5">
                    Subtle harmonic micro-chimes triggered during cellular birth and steps
                  </div>
                </div>
                <div
                  className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${
                    soundEnabled ? 'bg-sim-accent' : 'bg-sim-elevated border border-sim-border'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-sim-bg transition-transform ${
                      soundEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-sim-border bg-sim-surface flex justify-end">
            <Dialog.Close asChild>
              <button className="px-3 py-1.5 rounded text-xs font-semibold bg-sim-accent text-sim-bg hover:opacity-90 shadow-sm transition-opacity font-mono">
                APPLY & CLOSE
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
