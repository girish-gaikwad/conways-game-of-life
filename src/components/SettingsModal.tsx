
import React, { useState } from 'react';
import {
  X,
  SlidersHorizontal,
  Eye,
  Box,
  Volume2,
  Globe,
  Cpu,
  Check,
} from 'lucide-react';
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
  { label: 'Compact', w: 80, h: 50, desc: '4,000 cells' },
  { label: 'Standard', w: 120, h: 80, desc: '9,600 cells' },
  { label: 'Large', w: 160, h: 100, desc: '16,000 cells' },
  { label: 'Vast', w: 220, h: 140, desc: '30,800 cells' },
];

type TabId = 'cells' | 'physics' | 'universe';

const SectionHeading = ({
  title,
  description,
  muted,
}: {
  title: string;
  description?: string;
  muted: string;
}) => (
  <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em]">
      {title}
    </h3>
    {description && (
      <span className="text-[11px]" style={{ color: muted }}>
        {description}
      </span>
    )}
  </div>
);

const SettingRow = ({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
  theme,
  text,
  muted,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  theme: Theme;
  text: string;
  muted: string;
}) => (
  <div
    className="flex items-center justify-between gap-4 border px-3.5 py-3"
    style={{
      backgroundColor: theme.panelBg,
      borderColor: theme.gridLineColor,
    }}
  >
    <div className="flex min-w-0 items-center gap-3">
      <Icon
        size={16}
        strokeWidth={1.7}
        style={{ color: theme.accentColor }}
        className="shrink-0"
      />
      <div className="min-w-0">
        <div className="text-xs font-medium" style={{ color: text }}>
          {title}
        </div>
        <p className="mt-0.5 text-[11px] leading-relaxed" style={{ color: muted }}>
          {description}
        </p>
      </div>
    </div>

    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={title}
      onClick={onToggle}
      className="relative h-[19px] w-[34px] shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        backgroundColor: enabled ? theme.accentColor : '#454D47',
        '--tw-ring-color': theme.accentColor,
        '--tw-ring-offset-color': theme.panelBg,
      } as React.CSSProperties}
    >
      <span
        className={`absolute top-[3px] h-[13px] w-[13px] bg-white transition-transform ${
          enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  </div>
);

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
  const [activeTab, setActiveTab] = useState<TabId>('cells');

  // All colours come from the existing Theme interface.
  const text = theme.isLight ? '#202820' : '#E5EAE5';
  const muted = theme.isLight ? '#626D64' : '#929D94';
  const border = theme.gridLineColor;
  const selectedBg = `${theme.accentColor}18`;

  const tabItems = [
    { id: 'cells' as const, label: 'Display', icon: Eye },
    { id: 'physics' as const, label: 'Rules', icon: Cpu },
    { id: 'universe' as const, label: 'Universe', icon: Globe },
  ];

  const cellModes: {
    id: CellStyle;
    label: string;
    description: string;
    preview: React.ReactNode;
  }[] = [
    {
      id: 'square',
      label: 'Square',
      description: 'Classic pixel geometry',
      preview: (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-3.5 w-3.5"
              style={{ backgroundColor: theme.cellColor }}
            />
          ))}
        </div>
      ),
    },
    {
      id: 'rounded',
      label: 'Rounded',
      description: 'Softened cell edges',
      preview: (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-3.5 w-3.5 rounded-[3px]"
              style={{ backgroundColor: theme.cellColor }}
            />
          ))}
        </div>
      ),
    },
    {
      id: 'dots',
      label: 'Dot matrix',
      description: 'Circular cell rendering',
      preview: (
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-3.5 w-3.5 rounded-full"
              style={{ backgroundColor: theme.cellColor }}
            />
          ))}
        </div>
      ),
    },
    {
      id: 'heatmap',
      label: 'Age heatmap',
      description: 'Colour by cell age',
      preview: (
        <div className="flex gap-1">
          {[theme.cellNewColor, theme.cellColor, theme.cellOldColor].map(
            (color, i) => (
              <div
                key={i}
                className="h-3.5 w-3.5"
                style={{ backgroundColor: color }}
              />
            )
          )}
        </div>
      ),
    },
  ];

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px] animate-fadeIn" />

        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <Dialog.Content
            className="pointer-events-auto flex max-h-[88vh] w-full max-w-[590px] flex-col overflow-hidden border shadow-2xl outline-none animate-fadeIn"
            style={{
              backgroundColor: theme.bg,
              borderColor: border,
              color: text,
            }}
          >
            {/* Header */}
            <div
              className="flex shrink-0 items-center justify-between border-b px-5 py-4"
              style={{
                backgroundColor: theme.panelBg,
                borderColor: border,
              }}
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal
                  size={18}
                  strokeWidth={1.6}
                  style={{ color: theme.accentColor }}
                />

                <div>
                  <Dialog.Title className="text-[13px] font-semibold tracking-wide">
                    Settings
                  </Dialog.Title>
                  <Dialog.Description
                    className="mt-0.5 text-[11px]"
                    style={{ color: muted }}
                  >
                    Configure your simulation environment
                  </Dialog.Description>
                </div>
              </div>

              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close settings"
                  className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-white/[0.07]"
                  style={{ color: muted }}
                >
                  <X size={17} />
                </button>
              </Dialog.Close>
            </div>

            {/* Navigation */}
            <Tabs.Root
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as TabId)}
              className="flex min-h-0 flex-1 flex-col"
            >
              <Tabs.List
                className="flex shrink-0 items-center gap-5 border-b px-5"
                style={{
                  backgroundColor: theme.panelBg,
                  borderColor: border,
                }}
              >
                {tabItems.map(({ id, label, icon: Icon }) => {
                  const active = activeTab === id;

                  return (
                    <Tabs.Trigger
                      key={id}
                      value={id}
                      className="relative flex items-center gap-2 py-3 text-xs transition-colors focus-visible:outline-none"
                      style={{
                        color: active ? theme.accentColor : muted,
                      }}
                    >
                      <Icon size={14} strokeWidth={1.7} />
                      {label}

                      {active && (
                        <span
                          className="absolute bottom-0 left-0 h-[2px] w-full"
                          style={{ backgroundColor: theme.accentColor }}
                        />
                      )}
                    </Tabs.Trigger>
                  );
                })}
              </Tabs.List>

              {/* DISPLAY TAB */}
              <Tabs.Content
                value="cells"
                className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5 outline-none"
                style={{ backgroundColor: theme.bg }}
              >
                <section>
                  <SectionHeading
                    title="Cell rendering"
                    description="Choose how living cells appear"
                    muted={muted}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    {cellModes.map((mode) => {
                      const selected = cellStyle === mode.id;

                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => onSelectCellStyle(mode.id)}
                          aria-pressed={selected}
                          className="flex min-h-[76px] items-center justify-between gap-3 border px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-1"
                          style={{
                            backgroundColor: selected ? selectedBg : theme.panelBg,
                            borderColor: selected ? theme.accentColor : border,
                            '--tw-ring-color': theme.accentColor,
                          } as React.CSSProperties}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-xs font-medium">
                              <span>{mode.label}</span>
                              {selected && (
                                <Check
                                  size={13}
                                  style={{ color: theme.accentColor }}
                                />
                              )}
                            </div>
                            <p
                              className="mt-1 text-[11px]"
                              style={{ color: muted }}
                            >
                              {mode.description}
                            </p>
                          </div>

                          <div
                            className="flex h-9 w-[66px] shrink-0 items-center justify-center border"
                            style={{
                              backgroundColor: theme.bg,
                              borderColor: border,
                            }}
                          >
                            {mode.preview}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="space-y-2">
                  <SectionHeading
                    title="Canvas"
                    muted={muted}
                  />

                  <SettingRow
                    icon={Box}
                    title="Grid lines"
                    description="Show boundaries between cells"
                    enabled={showGridLines}
                    onToggle={onToggleGridLines}
                    theme={theme}
                    text={text}
                    muted={muted}
                  />
                </section>
              </Tabs.Content>

              {/* RULES TAB */}
              <Tabs.Content
                value="physics"
                className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5 outline-none"
                style={{ backgroundColor: theme.bg }}
              >
                <section>
                  <SectionHeading
                    title="Evolution rules"
                    description="Select the automaton rule set"
                    muted={muted}
                  />

                  <div className="space-y-1.5">
                    {RULESETS.map((rule) => {
                      const selected = currentRule.id === rule.id;

                      return (
                        <button
                          key={rule.id}
                          type="button"
                          onClick={() => onSelectRule(rule)}
                          aria-pressed={selected}
                          className="flex w-full items-center justify-between gap-3 border px-3.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-1"
                          style={{
                            backgroundColor: selected ? selectedBg : theme.panelBg,
                            borderColor: selected ? theme.accentColor : border,
                            '--tw-ring-color': theme.accentColor,
                          } as React.CSSProperties}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs font-medium">
                              {rule.name}
                              {selected && (
                                <span
                                  className="text-[9px] font-semibold uppercase tracking-wider"
                                  style={{ color: theme.accentColor }}
                                >
                                  Active
                                </span>
                              )}
                            </div>
                            <p
                              className="mt-1 text-[11px] leading-relaxed"
                              style={{ color: muted }}
                            >
                              {rule.description}
                            </p>
                          </div>

                          <span
                            className="shrink-0 border px-2 py-1 font-mono text-[11px]"
                            style={{
                              backgroundColor: theme.bg,
                              borderColor: border,
                              color: selected ? theme.accentColor : muted,
                            }}
                          >
                            B{rule.birth.join('')}/S{rule.survival.join('')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="space-y-2">
                  <SectionHeading title="World topology" muted={muted} />

                  <SettingRow
                    icon={Globe}
                    title="Toroidal wrapping"
                    description={
                      toroidal
                        ? 'Cells reappear at the opposite edge'
                        : 'Cells stop at the grid boundaries'
                    }
                    enabled={toroidal}
                    onToggle={onToggleToroidal}
                    theme={theme}
                    text={text}
                    muted={muted}
                  />
                </section>
              </Tabs.Content>

              {/* UNIVERSE TAB */}
              <Tabs.Content
                value="universe"
                className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5 outline-none"
                style={{ backgroundColor: theme.bg }}
              >
                <section>
                  <SectionHeading
                    title="Grid dimensions"
                    description={`Current: ${gridWidth} × ${gridHeight}`}
                    muted={muted}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    {GRID_SIZES.map((size) => {
                      const selected =
                        gridWidth === size.w && gridHeight === size.h;

                      return (
                        <button
                          key={size.label}
                          type="button"
                          onClick={() => onResizeGrid(size.w, size.h)}
                          aria-pressed={selected}
                          className="flex items-center justify-between border px-3.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-1"
                          style={{
                            backgroundColor: selected ? selectedBg : theme.panelBg,
                            borderColor: selected ? theme.accentColor : border,
                            '--tw-ring-color': theme.accentColor,
                          } as React.CSSProperties}
                        >
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-medium">
                              {size.label}
                              {selected && (
                                <Check
                                  size={13}
                                  style={{ color: theme.accentColor }}
                                />
                              )}
                            </div>
                            <p
                              className="mt-1 text-[11px]"
                              style={{ color: muted }}
                            >
                              {size.desc}
                            </p>
                          </div>

                          <span
                            className="font-mono text-[10px]"
                            style={{ color: muted }}
                          >
                            {size.w}×{size.h}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="space-y-2">
                  <SectionHeading title="Audio" muted={muted} />

                  <SettingRow
                    icon={Volume2}
                    title="Ambient audio"
                    description="Play tones during simulation events"
                    enabled={soundEnabled}
                    onToggle={onToggleSound}
                    theme={theme}
                    text={text}
                    muted={muted}
                  />
                </section>
              </Tabs.Content>
            </Tabs.Root>

            {/* Footer */}
            <div
              className="flex shrink-0 items-center justify-between border-t px-5 py-3"
              style={{
                backgroundColor: theme.panelBg,
                borderColor: border,
              }}
            >
              <span className="text-[10px]" style={{ color: muted }}>
                Changes apply immediately
              </span>

              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-medium transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
                  style={{
                    backgroundColor: theme.accentColor,
                    color: theme.isLight ? '#FFFFFF' : '#11170E',
                    '--tw-ring-color': theme.accentColor,
                  } as React.CSSProperties}
                >
                  Done
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
