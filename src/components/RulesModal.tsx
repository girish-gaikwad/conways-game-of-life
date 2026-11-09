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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm animate-fadeIn" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <Dialog.Content
            className="pointer-events-auto relative w-full max-w-lg border rounded-lg shadow-2xl overflow-hidden flex flex-col font-sans outline-none transition-colors max-h-[90vh] animate-fadeIn"
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
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <Dialog.Title className="text-xs font-semibold tracking-wider font-mono uppercase">
                  THE RULES OF CONWAY’S LIFE
                </Dialog.Title>
                <Dialog.Description
                  className="text-[11px]"
                  style={{ color: theme.textSecondary }}
                >
                  Mathematical principles of two-dimensional cellular automata (1970)
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

          {/* Content */}
          <div
            className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto text-xs transition-colors"
            style={{
              backgroundColor: theme.bg,
              color: theme.textPrimary,
            }}
          >
            <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
              Devised by mathematician <strong style={{ color: theme.textPrimary }}>John Horton Conway</strong> in 1970, the Game of Life is a zero-player simulation governed entirely by its initial state and four deterministic local rules evaluated simultaneously across an infinite matrix:
            </p>

            <div className="space-y-2">
              {/* Rule 1 */}
              <div
                className="p-3 rounded border flex items-start space-x-3 transition-colors"
                style={{
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderSubtleColor || theme.borderColor,
                }}
              >
                <div className="p-1.5 rounded bg-[#E16D6D]20 text-[#E16D6D] flex-shrink-0">
                  <Skull className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-semibold font-mono text-[11px]">
                    1. UNDERPOPULATION
                  </h3>
                  <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: theme.textSecondary }}>
                    Any living cell with <strong>fewer than 2</strong> living neighbours dies as if caused by underpopulation.
                  </p>
                </div>
              </div>

              {/* Rule 2 */}
              <div
                className="p-3 rounded border flex items-start space-x-3 transition-colors"
                style={{
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderSubtleColor || theme.borderColor,
                }}
              >
                <div
                  className="p-1.5 rounded flex-shrink-0"
                  style={{
                    backgroundColor: `${theme.accentColor}25`,
                    color: theme.accentColor,
                  }}
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-semibold font-mono text-[11px]">
                    2. EQUILIBRIUM & SURVIVAL
                  </h3>
                  <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: theme.textSecondary }}>
                    Any living cell with <strong>2 or 3</strong> living neighbours survives to the subsequent generation.
                  </p>
                </div>
              </div>

              {/* Rule 3 */}
              <div
                className="p-3 rounded border flex items-start space-x-3 transition-colors"
                style={{
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderSubtleColor || theme.borderColor,
                }}
              >
                <div className="p-1.5 rounded bg-[#E16D6D]20 text-[#E16D6D] flex-shrink-0">
                  <Skull className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-semibold font-mono text-[11px]">
                    3. OVERPOPULATION
                  </h3>
                  <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: theme.textSecondary }}>
                    Any living cell with <strong>more than 3</strong> living neighbours dies as if by overcrowding.
                  </p>
                </div>
              </div>

              {/* Rule 4 */}
              <div
                className="p-3 rounded border flex items-start space-x-3 transition-colors"
                style={{
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderSubtleColor || theme.borderColor,
                }}
              >
                <div
                  className="p-1.5 rounded flex-shrink-0"
                  style={{
                    backgroundColor: `${theme.secondaryColor || theme.accentColor}25`,
                    color: theme.secondaryColor || theme.accentColor,
                  }}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-semibold font-mono text-[11px]">
                    4. REPRODUCTION
                  </h3>
                  <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: theme.textSecondary }}>
                    Any dead cell with <strong>exactly 3</strong> living neighbours transitions to a live cell.
                  </p>
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
                className="px-3 py-1.5 rounded text-xs font-semibold border transition-colors font-mono"
                style={{
                  backgroundColor: theme.elevatedBg,
                  borderColor: theme.borderColor,
                  color: theme.textPrimary,
                }}
              >
                ACKNOWLEDGE
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  </Dialog.Root>
  );
};
