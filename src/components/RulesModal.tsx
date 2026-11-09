import React from 'react';
import { X, BookOpen, HeartPulse, Skull, UserPlus } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Theme } from '../types/game';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, theme }) => {
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
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <Dialog.Title className="text-sm font-semibold tracking-wider font-mono uppercase">
                    THE FOUR LAWS OF CELLULAR LIFE
                  </Dialog.Title>
                  <Dialog.Description
                    className="text-xs mt-0.5"
                    style={{ color: theme.textSecondary }}
                  >
                    John Horton Conway's deterministic 1970 automaton rules
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

            {/* Content Body */}
            <div
              className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs transition-colors"
              style={{
                backgroundColor: theme.bg,
                color: theme.textPrimary,
              }}
            >
              <div
                className="p-3.5 rounded-xl border text-xs leading-relaxed"
                style={{
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderSubtleColor || theme.borderColor,
                  color: theme.textSecondary,
                }}
              >
                Every cell in the matrix interacts with its eight horizontal, vertical, and diagonal neighbors. At each discrete tick, the entire universe evolves synchronously:
              </div>

              {/* 4 Clean Visual Law Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Law 1 */}
                <div
                  className="p-4 rounded-xl border flex flex-col justify-between transition-colors space-y-2.5"
                  style={{
                    backgroundColor: theme.panelBg,
                    borderColor: theme.borderSubtleColor || theme.borderColor,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold text-[#E16D6D] px-2 py-0.5 rounded bg-[#E16D6D]/15 border border-[#E16D6D]/30">
                      DEATH BY ISOLATION
                    </span>
                    <Skull className="w-4 h-4 text-[#E16D6D]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs font-mono">1. Underpopulation</h3>
                    <p className="text-[11px] mt-1 leading-relaxed" style={{ color: theme.textSecondary }}>
                      Any living cell with <strong>&lt; 2</strong> living neighbours dies of loneliness.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono opacity-80 pt-1 border-t" style={{ borderColor: theme.borderSubtleColor || theme.borderColor }}>
                    Neighbors &lt; 2 → Cell dies
                  </div>
                </div>

                {/* Law 2 */}
                <div
                  className="p-4 rounded-xl border flex flex-col justify-between transition-colors space-y-2.5"
                  style={{
                    backgroundColor: theme.panelBg,
                    borderColor: theme.borderSubtleColor || theme.borderColor,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: `${theme.accentColor}18`,
                        borderColor: `${theme.accentColor}40`,
                        color: theme.accentColor,
                      }}
                    >
                      SURVIVAL
                    </span>
                    <HeartPulse className="w-4 h-4" style={{ color: theme.accentColor }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs font-mono">2. Equilibrium</h3>
                    <p className="text-[11px] mt-1 leading-relaxed" style={{ color: theme.textSecondary }}>
                      Any living cell with <strong>2 or 3</strong> living neighbours stays alive.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono opacity-80 pt-1 border-t" style={{ borderColor: theme.borderSubtleColor || theme.borderColor }}>
                    Neighbors 2 or 3 → Cell lives
                  </div>
                </div>

                {/* Law 3 */}
                <div
                  className="p-4 rounded-xl border flex flex-col justify-between transition-colors space-y-2.5"
                  style={{
                    backgroundColor: theme.panelBg,
                    borderColor: theme.borderSubtleColor || theme.borderColor,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold text-[#E16D6D] px-2 py-0.5 rounded bg-[#E16D6D]/15 border border-[#E16D6D]/30">
                      DEATH BY OVERCROWD
                    </span>
                    <Skull className="w-4 h-4 text-[#E16D6D]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs font-mono">3. Overpopulation</h3>
                    <p className="text-[11px] mt-1 leading-relaxed" style={{ color: theme.textSecondary }}>
                      Any living cell with <strong>&gt; 3</strong> living neighbours dies of overcrowding.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono opacity-80 pt-1 border-t" style={{ borderColor: theme.borderSubtleColor || theme.borderColor }}>
                    Neighbors &gt; 3 → Cell dies
                  </div>
                </div>

                {/* Law 4 */}
                <div
                  className="p-4 rounded-xl border flex flex-col justify-between transition-colors space-y-2.5"
                  style={{
                    backgroundColor: theme.panelBg,
                    borderColor: theme.borderSubtleColor || theme.borderColor,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: `${theme.secondaryColor || theme.accentColor}18`,
                        borderColor: `${theme.secondaryColor || theme.accentColor}40`,
                        color: theme.secondaryColor || theme.accentColor,
                      }}
                    >
                      BIRTH & GENESIS
                    </span>
                    <UserPlus className="w-4 h-4" style={{ color: theme.secondaryColor || theme.accentColor }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs font-mono">4. Reproduction</h3>
                    <p className="text-[11px] mt-1 leading-relaxed" style={{ color: theme.textSecondary }}>
                      Any dead cell with <strong>exactly 3</strong> neighbours springs to life.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono opacity-80 pt-1 border-t" style={{ borderColor: theme.borderSubtleColor || theme.borderColor }}>
                    Neighbors = 3 → Cell is born
                  </div>
                </div>
              </div>
            </div>

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
                  GOT IT
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
