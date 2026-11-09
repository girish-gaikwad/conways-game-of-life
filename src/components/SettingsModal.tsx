import React from 'react';
import { X, Sliders, Eye, Box, Volume2, Globe, Shield, Cpu } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { CellStyle, RuleSet, Theme } from '../types/game';
import { RULESETS } from '../data/rules';

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
  currentRule: RuleSet;
  onSelectRule: (rule: RuleSet) => void;
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
  currentRule,
  onSelectRule,
  theme,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm animate-fadeIn" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg border rounded-lg shadow-2xl overflow-hidden flex flex-col font-sans animate-fadeIn outline-none transition-colors"
          style={{
            backgroundColor: theme.panelBg,
            borderColor: theme.borderColor,
            color: theme.textPrimary,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b transition-colors"
            style={{
              backgroundColor: theme.panelBg,
              borderColor: theme.borderColor,
            }}
          >
            <div className="flex items-center space-x-2">
              <div
                className="p-1 rounded border"
                style={{
                  backgroundColor: theme.elevatedBg,
                  borderColor: theme.borderColor,
                  color: theme.accentColor,
                }}
              >
                <Sliders className="w-3.5 h-3.5" />
              </div>
              <div>
                <Dialog.Title className="text-xs font-semibold tracking-wider font-mono uppercase">
                  SIMULATION SETTINGS
                </Dialog.Title>
                <Dialog.Description
                  className="text-[11px]"
                  style={{ color: theme.textSecondary }}
                >
                  Grid physics, cellular rules & display parameters
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                className="p-1 rounded transition-colors hover:opacity-70"
                style={{ color: theme.textSecondary }}
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Settings Body */}
          <div
            className="p-4 space-y-4 max-h-[75vh] overflow-y-auto text-xs transition-colors"
            style={{
              backgroundColor: theme.bg,
              color: theme.textPrimary,
            }}
          >
            {/* Cellular Automata Rule */}
            <div className="space-y-2">
              <label
                className="text-[11px] font-mono uppercase tracking-wider flex items-center space-x-1.5"
                style={{ color: theme.textSecondary }}
              >
                <Cpu className="w-3 h-3" style={{ color: theme.accentColor }} />
                <span>Automaton Rule Algorithm</span>
              </label>
              <div className="space-y-1.5">
                {RULESETS.map((r) => {
                  const isSelected = currentRule.id === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => onSelectRule(r)}
                      className="w-full p-2.5 rounded border text-left transition-colors flex items-start justify-between"
                      style={{
                        backgroundColor: isSelected ? (theme.elevatedBg || `${theme.accentColor}20`) : theme.panelBg,
                        borderColor: isSelected ? theme.accentColor : (theme.borderSubtleColor || theme.borderColor),
                        color: theme.textPrimary,
                      }}
                    >
                      <div>
                        <div className="font-medium text-xs flex items-center space-x-1.5">
                          <span>{r.name}</span>
                          {isSelected && (
                            <span
                              className="text-[9px] px-1 py-0.2 rounded font-mono font-semibold"
                              style={{
                                backgroundColor: `${theme.accentColor}30`,
                                color: theme.accentColor,
                              }}
                            >
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div
                          className="text-[10px] mt-0.5"
                          style={{ color: theme.textSecondary }}
                        >
                          {r.description}
                        </div>
                      </div>
                      <div
                        className="text-[10px] font-mono pl-2 flex-shrink-0"
                        style={{ color: theme.textSecondary }}
                      >
                        B{r.birth.join('')}/S{r.survival.join('')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cell Visual Mode */}
            <div className="space-y-2">
              <label
                className="text-[11px] font-mono uppercase tracking-wider flex items-center space-x-1.5"
                style={{ color: theme.textSecondary }}
              >
                <Eye className="w-3 h-3" style={{ color: theme.accentColor }} />
                <span>Cell Render Mode</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'square', label: 'Classic Square', desc: 'Sharp geometric pixels' },
                  { id: 'rounded', label: 'Rounded Squircle', desc: 'Subtle corner rounding' },
                  { id: 'dots', label: 'Dot Matrix', desc: 'Circular micro-dots' },
                  { id: 'heatmap', label: 'Age Heatmap', desc: 'Longevity gradient' },
                ].map((mode) => {
                  const isSelected = cellStyle === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => onSelectCellStyle(mode.id as CellStyle)}
                      className="p-2.5 rounded border text-left transition-colors"
                      style={{
                        backgroundColor: isSelected ? (theme.elevatedBg || `${theme.accentColor}20`) : theme.panelBg,
                        borderColor: isSelected ? theme.accentColor : (theme.borderSubtleColor || theme.borderColor),
                        color: theme.textPrimary,
                      }}
                    >
                      <div className="font-medium text-xs">{mode.label}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: theme.textSecondary }}>
                        {mode.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Universe Topology */}
            <div className="space-y-2">
              <label
                className="text-[11px] font-mono uppercase tracking-wider flex items-center space-x-1.5"
                style={{ color: theme.textSecondary }}
              >
                <Globe className="w-3 h-3" style={{ color: theme.accentColor }} />
                <span>Universe Topology</span>
              </label>
              <div
                onClick={onToggleToroidal}
                className="flex items-center justify-between p-3 rounded border cursor-pointer transition-colors"
                style={{
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderSubtleColor || theme.borderColor,
                }}
              >
                <div>
                  <div className="font-medium text-xs">
                    {toroidal ? 'Toroidal (Infinite Edge Wrapping)' : 'Bounded (Hard Border Collisions)'}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: theme.textSecondary }}>
                    {toroidal
                      ? 'Cells that exit one edge immediately enter from the opposite side'
                      : 'Cells at border walls cannot escape and die when overcrowded'}
                  </div>
                </div>
                <div
                  className="w-9 h-5 rounded-full transition-colors flex items-center px-0.5"
                  style={{
                    backgroundColor: toroidal ? theme.accentColor : (theme.elevatedBg || '#333333'),
                  }}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform ${
                      toroidal ? 'translate-x-4' : 'translate-x-0'
                    }`}
                    style={{ backgroundColor: toroidal ? (theme.isLight ? '#FFFFFF' : '#0B0F0D') : '#FFFFFF' }}
                  />
                </div>
              </div>
            </div>

            {/* Grid Matrix Guidelines */}
            <div className="space-y-2">
              <label
                className="text-[11px] font-mono uppercase tracking-wider flex items-center space-x-1.5"
                style={{ color: theme.textSecondary }}
              >
                <Box className="w-3 h-3" style={{ color: theme.accentColor }} />
                <span>Matrix Guidelines</span>
              </label>
              <div
                onClick={onToggleGridLines}
                className="flex items-center justify-between p-3 rounded border cursor-pointer transition-colors"
                style={{
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderSubtleColor || theme.borderColor,
                }}
              >
                <div>
                  <div className="font-medium text-xs">Show Grid Matrix Lines</div>
                  <div className="text-[11px] mt-0.5" style={{ color: theme.textSecondary }}>
                    Render subtle partition lines between neighboring cells
                  </div>
                </div>
                <div
                  className="w-9 h-5 rounded-full transition-colors flex items-center px-0.5"
                  style={{
                    backgroundColor: showGridLines ? theme.accentColor : (theme.elevatedBg || '#333333'),
                  }}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform ${
                      showGridLines ? 'translate-x-4' : 'translate-x-0'
                    }`}
                    style={{ backgroundColor: showGridLines ? (theme.isLight ? '#FFFFFF' : '#0B0F0D') : '#FFFFFF' }}
                  />
                </div>
              </div>
            </div>

            {/* Grid Dimensions */}
            <div className="space-y-2">
              <label
                className="text-[11px] font-mono uppercase tracking-wider flex items-center space-x-1.5"
                style={{ color: theme.textSecondary }}
              >
                <Shield className="w-3 h-3" style={{ color: theme.accentColor }} />
                <span>Universe Dimensions</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GRID_SIZES.map((size) => {
                  const isSelected = gridWidth === size.w && gridHeight === size.h;
                  return (
                    <button
                      key={size.label}
                      onClick={() => onResizeGrid(size.w, size.h)}
                      className="p-2.5 rounded border text-left transition-colors"
                      style={{
                        backgroundColor: isSelected ? (theme.elevatedBg || `${theme.accentColor}20`) : theme.panelBg,
                        borderColor: isSelected ? theme.accentColor : (theme.borderSubtleColor || theme.borderColor),
                        color: theme.textPrimary,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs">{size.label}</span>
                        <span className="text-[10px] font-mono" style={{ color: theme.textSecondary }}>
                          {size.w}×{size.h}
                        </span>
                      </div>
                      <div className="text-[10px] mt-0.5" style={{ color: theme.textSecondary }}>
                        {size.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Audio Synthesis */}
            <div className="space-y-2">
              <label
                className="text-[11px] font-mono uppercase tracking-wider flex items-center space-x-1.5"
                style={{ color: theme.textSecondary }}
              >
                <Volume2 className="w-3 h-3" style={{ color: theme.accentColor }} />
                <span>Ambient Synthesis</span>
              </label>
              <div
                onClick={onToggleSound}
                className="flex items-center justify-between p-3 rounded border cursor-pointer transition-colors"
                style={{
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderSubtleColor || theme.borderColor,
                }}
              >
                <div>
                  <div className="font-medium text-xs">Generative Pentatonic Audio</div>
                  <div className="text-[11px] mt-0.5" style={{ color: theme.textSecondary }}>
                    Subtle harmonic micro-chimes triggered during cellular birth and steps
                  </div>
                </div>
                <div
                  className="w-9 h-5 rounded-full transition-colors flex items-center px-0.5"
                  style={{
                    backgroundColor: soundEnabled ? theme.accentColor : (theme.elevatedBg || '#333333'),
                  }}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform ${
                      soundEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                    style={{ backgroundColor: soundEnabled ? (theme.isLight ? '#FFFFFF' : '#0B0F0D') : '#FFFFFF' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-4 py-3 border-t flex justify-end transition-colors"
            style={{
              backgroundColor: theme.panelBg,
              borderColor: theme.borderColor,
            }}
          >
            <Dialog.Close asChild>
              <button
                className="px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 font-mono"
                style={{
                  backgroundColor: theme.accentColor,
                  color: theme.isLight ? '#FFFFFF' : '#0B0F0D',
                }}
              >
                APPLY & CLOSE
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
