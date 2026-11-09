
import React from 'react';
import {
  X,
  BookOpen,
  HeartPulse,
  Skull,
  UserPlus,
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Theme } from '../types/game';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

const RULES = [
  {
    number: '01',
    title: 'Underpopulation',
    category: 'DEATH',
    description:
      'A living cell with fewer than two living neighbours dies.',
    condition: '< 2',
    result: 'Cell dies',
    icon: Skull,
    color: '#E07878',
  },
  {
    number: '02',
    title: 'Survival',
    category: 'SURVIVAL',
    description:
      'A living cell with two or three living neighbours survives.',
    condition: '2 – 3',
    result: 'Cell lives',
    icon: HeartPulse,
    color: '#72BFA0',
  },
  {
    number: '03',
    title: 'Overpopulation',
    category: 'DEATH',
    description:
      'A living cell with more than three living neighbours dies.',
    condition: '> 3',
    result: 'Cell dies',
    icon: Skull,
    color: '#E07878',
  },
  {
    number: '04',
    title: 'Reproduction',
    category: 'BIRTH',
    description:
      'A dead cell with exactly three living neighbours becomes alive.',
    condition: '= 3',
    result: 'Cell is born',
    icon: UserPlus,
    color: '#A6D96A',
  },
];

export const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const text = theme.isLight ? '#202820' : '#E5EAE5';
  const muted = theme.isLight ? '#68736A' : '#929D94';
  const border = theme.gridLineColor;

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
                <BookOpen
                  size={19}
                  strokeWidth={1.6}
                  style={{ color: theme.accentColor }}
                />

                <div>
                  <Dialog.Title className="text-[13px] font-semibold tracking-wide">
                    Game rules
                  </Dialog.Title>

                  <Dialog.Description
                    className="mt-0.5 text-[11px]"
                    style={{ color: muted }}
                  >
                    Conway's Game of Life · 1970
                  </Dialog.Description>
                </div>
              </div>

              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close rules"
                  className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-white/[0.07]"
                  style={{ color: muted }}
                >
                  <X size={17} />
                </button>
              </Dialog.Close>
            </div>

            {/* Content */}
            <div
              className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5"
              style={{ backgroundColor: theme.bg }}
            >
              {/* Introduction */}
              <div className="flex gap-3 border-l-2 py-1 pl-3.5"
                style={{ borderColor: theme.accentColor }}
              >
                <div>
                  <p className="text-xs leading-relaxed" style={{ color: text }}>
                    Every cell interacts with its eight neighbouring cells.
                    At each generation, all cells update simultaneously
                    according to four simple rules.
                  </p>
                  <p
                    className="mt-2 font-mono text-[10px]"
                    style={{ color: muted }}
                  >
                    8 NEIGHBOURS · 1 GENERATION · 4 RULES
                  </p>
                </div>
              </div>

              {/* Rules */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3
                    className="text-[10px] font-semibold uppercase tracking-[0.12em]"
                    style={{ color: muted }}
                  >
                    The four rules
                  </h3>

                  <span
                    className="font-mono text-[10px]"
                    style={{ color: muted }}
                  >
                    B3 / S23
                  </span>
                </div>

                <div
                  className="grid grid-cols-1 gap-px border sm:grid-cols-2"
                  style={{
                    backgroundColor: border,
                    borderColor: border,
                  }}
                >
                  {RULES.map((rule) => {
                    const Icon = rule.icon;

                    return (
                      <article
                        key={rule.number}
                        className="flex min-h-[145px] flex-col justify-between p-4"
                        style={{ backgroundColor: theme.panelBg }}
                      >
                        <div>
                          <div className="mb-4 flex items-center justify-between">
                            <span
                              className="font-mono text-[11px]"
                              style={{ color: muted }}
                            >
                              {rule.number}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: rule.color }}
                              />
                              <span
                                className="text-[9px] font-semibold tracking-[0.1em]"
                                style={{ color: rule.color }}
                              >
                                {rule.category}
                              </span>
                            </div>
                          </div>

                          <h4 className="text-[13px] font-semibold">
                            {rule.title}
                          </h4>

                          <p
                            className="mt-1.5 text-[11px] leading-relaxed"
                            style={{ color: muted }}
                          >
                            {rule.description}
                          </p>
                        </div>

                        <div
                          className="mt-4 flex items-center justify-between border-t pt-2.5"
                          style={{ borderColor: border }}
                        >
                          <div className="flex items-center gap-2">
                            <Icon
                              size={13}
                              strokeWidth={1.8}
                              style={{ color: rule.color }}
                            />
                            <span
                              className="text-[10px]"
                              style={{ color: muted }}
                            >
                              Neighbours
                            </span>
                            <span
                              className="font-mono text-xs font-semibold"
                              style={{ color: text }}
                            >
                              {rule.condition}
                            </span>
                          </div>

                          <span
                            className="text-[10px] font-medium"
                            style={{ color: rule.color }}
                          >
                            {rule.result}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              {/* Summary */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 border px-3.5 py-3"
                style={{
                  backgroundColor: theme.panelBg,
                  borderColor: border,
                }}
              >
                <div>
                  <p className="text-[11px] font-semibold">
                    The original Conway rule set
                  </p>
                  <p
                    className="mt-1 text-[10px]"
                    style={{ color: muted }}
                  >
                    Birth at 3 · Survival at 2 or 3
                  </p>
                </div>

                <div
                  className="font-mono text-sm font-semibold"
                  style={{ color: theme.accentColor }}
                >
                  B3 / S23
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex shrink-0 items-center justify-between border-t px-5 py-3"
              style={{
                backgroundColor: theme.panelBg,
                borderColor: border,
              }}
            >
              <span
                className="text-[10px]"
                style={{ color: muted }}
              >
                Cellular automata reference
              </span>

              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-medium transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
                  style={{
                    backgroundColor: theme.accentColor,
                    color: theme.isLight ? '#FFFFFF' : '#11170E',
                  }}
                >
                  Close
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
