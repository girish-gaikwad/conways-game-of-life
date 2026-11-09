import React, { useState } from 'react';
import { X, Sliders, Eye, Box, Volume2, Globe, Shield, Cpu, Check } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
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
  { label: 'Compact', w: 80, h: 50, desc: '80×50 (4,000 cells) — High FPS for laptops & mobile' },
  { label: 'Standard', w: 120, h: 80, desc: '120×80 (9,600 cells) — Optimal balanced canvas' },
  { label: 'Large', w: 160, h: 100, desc: '160×100 (16,000 cells) — Expansive spaceship runways' },
  { label: 'Vast', w: 220, h: 140, desc: '220×140 (30,800 cells) — Mega ecosystem sandbox' },
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
  const [activeTab, setActiveTab] = useState<'cells' | 'physics' | 'universe'>('cells');

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fadeIn" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
          <Dialog.Content
            className="pointer-events-auto relative w-full max-w-xl border rounded-xl shadow-2xl overflow-hidden flex flex-col font-sans outline-none transition-colors max-h-[88vh] animate-fadeIn"
            style={{
              backgroundColor: theme.panelBg,
              borderColor: theme.borderColor,
              color: theme.textPrimary,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b transition-colors"
              style={{
                backgroundColor: theme.panelBg,
                borderColor: theme.borderColor,
              }}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="p-1.5 rounded-lg border"
                  style={{
                    backgroundColor: theme.elevatedBg,
                    borderColor: theme.borderColor,
                    color: theme.accentColor,
                  }}
                >
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <Dialog.Title className="text-sm font-semibold tracking-wider font-mono uppercase">
                    SIMULATION SETTINGS
                  </Dialog.Title>
                  <Dialog.Description
                    className="text-xs mt-0.5"
                    style={{ color: theme.textSecondary }}
                  >
                    Customize rendering optics, physics rules, and universe dimensions
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                  style={{ color: theme.textSecondary }}
                >
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            {/* Segmented Category Tabs */}
            <Tabs.Root
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as 'cells' | 'physics' | 'universe')}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <Tabs.List
                className="flex items-center px-6 pt-3 pb-2 border-b space-x-2"
                style={{
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderColor,
                }}
              >
                {[
                  { id: 'cells', label: 'Cell Optics & Display', icon: Eye },
                  { id: 'physics', label: 'Rules & Physics', icon: Cpu },
                  { id: 'universe', label: 'Dimensions & Audio', icon: Shield },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <Tabs.Trigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all outline-none"
                      style={{
                        backgroundColor: isActive ? theme.elevatedBg : 'transparent',
                        color: isActive ? theme.accentColor : theme.textSecondary,
                        borderColor: isActive ? theme.accentColor : 'transparent',
                        borderWidth: 1,
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </Tabs.Trigger>
                  );
                })}
              </Tabs.List>

              {/* Tab 1: Cell Optics & Display */}
              <Tabs.Content
                value="cells"
                className="p-6 space-y-6 overflow-y-auto flex-1 outline-none"
                style={{ backgroundColor: theme.bg }}
              >
                {/* Cell Render Mode with Mini Previews */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold" style={{ color: theme.textSecondary }}>
                      Cell Geometry & Rendering Style
                    </span>
                    <span className="text-[11px]" style={{ color: theme.textSecondary }}>
                      Select visual representation
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        id: 'square',
                        label: 'Classic Square',
                        desc: 'Crisp pixel-precise geometric squares',
                        preview: (
                          <div className="flex gap-1 p-1.5 rounded bg-black/40 border border-white/5">
                            <div className="w-3 h-3" style={{ backgroundColor: theme.cellColor }} />
                            <div className="w-3 h-3" style={{ backgroundColor: theme.cellColor }} />
                            <div className="w-3 h-3" style={{ backgroundColor: theme.cellColor }} />
                          </div>
                        ),
                      },
                      {
                        id: 'rounded',
                        label: 'Rounded Squircle',
                        desc: 'Modern softened squircle cell edges',
                        preview: (
                          <div className="flex gap-1 p-1.5 rounded bg-black/40 border border-white/5">
                            <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: theme.cellColor }} />
                            <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: theme.cellColor }} />
                            <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: theme.cellColor }} />
                          </div>
                        ),
                      },
                      {
                        id: 'dots',
                        label: 'Dot Matrix',
                        desc: 'Circular micro-dot matrix array',
                        preview: (
                          <div className="flex gap-1 p-1.5 rounded bg-black/40 border border-white/5">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.cellColor }} />
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.cellColor }} />
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.cellColor }} />
                          </div>
                        ),
                      },
                      {
                        id: 'heatmap',
                        label: 'Age Heatmap',
                        desc: 'Dynamic color shift based on cell longevity',
                        preview: (
                          <div className="flex gap-1 p-1.5 rounded bg-black/40 border border-white/5">
                            <div className="w-3 h-3 rounded-[1px]" style={{ backgroundColor: theme.cellNewColor }} title="Newborn" />
                            <div className="w-3 h-3 rounded-[1px]" style={{ backgroundColor: theme.cellColor }} title="Mature" />
                            <div className="w-3 h-3 rounded-[1px]" style={{ backgroundColor: theme.cellOldColor }} title="Veteran" />
                          </div>
                        ),
                      },
                    ].map((mode) => {
                      const isSelected = cellStyle === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => onSelectCellStyle(mode.id as CellStyle)}
                          className="p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between group"
                          style={{
                            backgroundColor: isSelected ? (theme.elevatedBg || `${theme.accentColor}20`) : theme.panelBg,
                            borderColor: isSelected ? theme.accentColor : (theme.borderSubtleColor || theme.borderColor),
                            color: theme.textPrimary,
                            boxShadow: isSelected ? `0 0 0 1px ${theme.accentColor}40` : 'none',
                          }}
                        >
                          <div className="flex items-start justify-between w-full mb-3">
                            <div>
                              <div className="font-semibold text-xs flex items-center space-x-1.5">
                                <span>{mode.label}</span>
                                {isSelected && (
                                  <Check className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                                )}
                              </div>
                              <p className="text-[11px] mt-1 leading-snug" style={{ color: theme.textSecondary }}>
                                {mode.desc}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end">{mode.preview}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Grid Lines Toggle */}
                <div
                  onClick={onToggleGridLines}
                  className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors"
                  style={{
                    backgroundColor: theme.panelBg,
                    borderColor: theme.borderSubtleColor || theme.borderColor,
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-lg border"
                      style={{
                        backgroundColor: theme.elevatedBg,
                        borderColor: theme.borderColor,
                        color: theme.accentColor,
                      }}
                    >
                      <Box className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs">Grid Matrix Lines</div>
                      <div className="text-[11px] mt-0.5" style={{ color: theme.textSecondary }}>
                        Subtle matrix boundary lines separating adjacent cells
                      </div>
                    </div>
                  </div>
                  <div
                    className="w-10 h-6 rounded-full transition-colors flex items-center px-0.5"
                    style={{
                      backgroundColor: showGridLines ? theme.accentColor : (theme.elevatedBg || '#333333'),
                    }}
                  >
                    <div
                      className={`w-5 h-5 rounded-full transition-transform ${
                        showGridLines ? 'translate-x-4' : 'translate-x-0'
                      }`}
                      style={{
                        backgroundColor: showGridLines
                          ? (theme.isLight ? '#FFFFFF' : '#0B0F0D')
                          : '#FFFFFF',
                      }}
                    />
                  </div>
                </div>
              </Tabs.Content>

              {/* Tab 2: Rules & Physics */}
              <Tabs.Content
                value="physics"
                className="p-6 space-y-6 overflow-y-auto flex-1 outline-none"
                style={{ backgroundColor: theme.bg }}
              >
                {/* Cellular Automata Rule Set */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold" style={{ color: theme.textSecondary }}>
                      Automaton Evolution Rules
                    </span>
                    <span className="text-[11px] font-mono" style={{ color: theme.accentColor }}>
                      B = Birth, S = Survival
                    </span>
                  </div>

                  <div className="space-y-2">
                    {RULESETS.map((r) => {
                      const isSelected = currentRule.id === r.id;
                      return (
                        <button
                          key={r.id}
                          onClick={() => onSelectRule(r)}
                          className="w-full p-3.5 rounded-xl border text-left transition-colors flex items-start justify-between group"
                          style={{
                            backgroundColor: isSelected ? (theme.elevatedBg || `${theme.accentColor}20`) : theme.panelBg,
                            borderColor: isSelected ? theme.accentColor : (theme.borderSubtleColor || theme.borderColor),
                            color: theme.textPrimary,
                            boxShadow: isSelected ? `0 0 0 1px ${theme.accentColor}40` : 'none',
                          }}
                        >
                          <div className="pr-4">
                            <div className="font-semibold text-xs flex items-center space-x-2">
                              <span>{r.name}</span>
                              {isSelected && (
                                <span
                                  className="text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold"
                                  style={{
                                    backgroundColor: `${theme.accentColor}30`,
                                    color: theme.accentColor,
                                  }}
                                >
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] mt-1 leading-relaxed" style={{ color: theme.textSecondary }}>
                              {r.description}
                            </div>
                          </div>
                          <div
                            className="text-[11px] font-mono px-2 py-1 rounded border flex-shrink-0"
                            style={{
                              backgroundColor: theme.elevatedBg,
                              borderColor: theme.borderSubtleColor || theme.borderColor,
                              color: theme.textSecondary,
                            }}
                          >
                            B{r.birth.join('')}/S{r.survival.join('')}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Topology Wrapping */}
                <div
                  onClick={onToggleToroidal}
                  className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors"
                  style={{
                    backgroundColor: theme.panelBg,
                    borderColor: theme.borderSubtleColor || theme.borderColor,
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-lg border"
                      style={{
                        backgroundColor: theme.elevatedBg,
                        borderColor: theme.borderColor,
                        color: theme.accentColor,
                      }}
                    >
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs">
                        {toroidal ? 'Toroidal Universe (Edge Wrapping)' : 'Bounded Wall Borders'}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: theme.textSecondary }}>
                        {toroidal
                          ? 'Gliders and spaceships wrap across opposite borders indefinitely'
                          : 'Cells collide with borders and die from crowding'}
                      </div>
                    </div>
                  </div>
                  <div
                    className="w-10 h-6 rounded-full transition-colors flex items-center px-0.5"
                    style={{
                      backgroundColor: toroidal ? theme.accentColor : (theme.elevatedBg || '#333333'),
                    }}
                  >
                    <div
                      className={`w-5 h-5 rounded-full transition-transform ${
                        toroidal ? 'translate-x-4' : 'translate-x-0'
                      }`}
                      style={{
                        backgroundColor: toroidal
                          ? (theme.isLight ? '#FFFFFF' : '#0B0F0D')
                          : '#FFFFFF',
                      }}
                    />
                  </div>
                </div>
              </Tabs.Content>

              {/* Tab 3: Dimensions & Audio */}
              <Tabs.Content
                value="universe"
                className="p-6 space-y-6 overflow-y-auto flex-1 outline-none"
                style={{ backgroundColor: theme.bg }}
              >
                {/* Universe Dimensions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold" style={{ color: theme.textSecondary }}>
                      Universe Grid Dimensions
                    </span>
                    <span className="text-[11px]" style={{ color: theme.textSecondary }}>
                      Active: {gridWidth}×{gridHeight}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {GRID_SIZES.map((size) => {
                      const isSelected = gridWidth === size.w && gridHeight === size.h;
                      return (
                        <button
                          key={size.label}
                          onClick={() => onResizeGrid(size.w, size.h)}
                          className="p-3.5 rounded-xl border text-left transition-colors flex flex-col justify-between"
                          style={{
                            backgroundColor: isSelected ? (theme.elevatedBg || `${theme.accentColor}20`) : theme.panelBg,
                            borderColor: isSelected ? theme.accentColor : (theme.borderSubtleColor || theme.borderColor),
                            color: theme.textPrimary,
                            boxShadow: isSelected ? `0 0 0 1px ${theme.accentColor}40` : 'none',
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-xs flex items-center space-x-1.5">
                              <span>{size.label}</span>
                              {isSelected && <Check className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border" style={{ backgroundColor: theme.elevatedBg, borderColor: theme.borderSubtleColor || theme.borderColor, color: theme.textSecondary }}>
                              {size.w}×{size.h}
                            </span>
                          </div>
                          <div className="text-[11px] leading-snug" style={{ color: theme.textSecondary }}>
                            {size.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Generative Audio Synthesis */}
                <div
                  onClick={onToggleSound}
                  className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors"
                  style={{
                    backgroundColor: theme.panelBg,
                    borderColor: theme.borderSubtleColor || theme.borderColor,
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-lg border"
                      style={{
                        backgroundColor: theme.elevatedBg,
                        borderColor: theme.borderColor,
                        color: theme.accentColor,
                      }}
                    >
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs">Ambient Pentatonic Chimes</div>
                      <div className="text-[11px] mt-0.5" style={{ color: theme.textSecondary }}>
                        Harmonic audio synthesis triggered on cellular birth and tick transitions
                      </div>
                    </div>
                  </div>
                  <div
                    className="w-10 h-6 rounded-full transition-colors flex items-center px-0.5"
                    style={{
                      backgroundColor: soundEnabled ? theme.accentColor : (theme.elevatedBg || '#333333'),
                    }}
                  >
                    <div
                      className={`w-5 h-5 rounded-full transition-transform ${
                        soundEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                      style={{
                        backgroundColor: soundEnabled
                          ? (theme.isLight ? '#FFFFFF' : '#0B0F0D')
                          : '#FFFFFF',
                      }}
                    />
                  </div>
                </div>
              </Tabs.Content>
            </Tabs.Root>

            {/* Footer */}
            <div
              className="px-6 py-3.5 border-t flex justify-end transition-colors"
              style={{
                backgroundColor: theme.panelBg,
                borderColor: theme.borderColor,
              }}
            >
              <Dialog.Close asChild>
                <button
                  className="px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 font-mono tracking-wide"
                  style={{
                    backgroundColor: theme.accentColor,
                    color: theme.isLight ? '#FFFFFF' : '#0B0F0D',
                  }}
                >
                  SAVE & CLOSE
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
