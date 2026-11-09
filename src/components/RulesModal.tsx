import React from 'react';
import { X, BookOpen, HeartPulse, Skull, UserPlus } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Theme } from '../types/game';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-fadeIn" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-sim-surface border border-sim-border rounded-lg shadow-popover overflow-hidden flex flex-col font-sans animate-fadeIn outline-none">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-sim-border bg-sim-surface">
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded bg-sim-elevated border border-sim-border text-sim-accent">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <Dialog.Title className="text-xs font-semibold tracking-wider font-mono uppercase text-sim-text-primary">
                  THE RULES OF CONWAY’S LIFE
                </Dialog.Title>
                <Dialog.Description className="text-[11px] text-sim-text-secondary">
                  Mathematical principles of two-dimensional cellular automata (1970)
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="p-1 rounded text-sim-text-secondary hover:text-sim-text-primary hover:bg-sim-hover border border-transparent hover:border-sim-border transition-colors">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto bg-sim-bg text-xs">
            <p className="text-sim-text-secondary leading-relaxed">
              Devised by mathematician <strong className="text-sim-text-primary">John Horton Conway</strong> in 1970, the Game of Life is a zero-player simulation governed entirely by its initial state and four deterministic local rules evaluated simultaneously across an infinite matrix:
            </p>

            <div className="space-y-2">
              {/* Rule 1 */}
              <div className="p-3 rounded bg-sim-surface border border-sim-border flex items-start space-x-3">
                <div className="p-1.5 rounded bg-sim-danger-muted border border-sim-danger/30 text-sim-danger flex-shrink-0">
                  <Skull className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sim-text-primary font-mono text-[11px]">
                    1. UNDERPOPULATION
                  </h3>
                  <p className="text-sim-text-secondary text-[11px] mt-0.5 leading-relaxed">
                    Any living cell with <strong>fewer than 2</strong> living neighbours dies as if caused by underpopulation.
                  </p>
                </div>
              </div>

              {/* Rule 2 */}
              <div className="p-3 rounded bg-sim-surface border border-sim-border flex items-start space-x-3">
                <div className="p-1.5 rounded bg-sim-accent-muted border border-sim-accent/30 text-sim-accent flex-shrink-0">
                  <HeartPulse className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sim-text-primary font-mono text-[11px]">
                    2. EQUILIBRIUM & SURVIVAL
                  </h3>
                  <p className="text-sim-text-secondary text-[11px] mt-0.5 leading-relaxed">
                    Any living cell with <strong>2 or 3</strong> living neighbours survives to the subsequent generation.
                  </p>
                </div>
              </div>

              {/* Rule 3 */}
              <div className="p-3 rounded bg-sim-surface border border-sim-border flex items-start space-x-3">
                <div className="p-1.5 rounded bg-sim-danger-muted border border-sim-danger/30 text-sim-danger flex-shrink-0">
                  <Skull className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sim-text-primary font-mono text-[11px]">
                    3. OVERPOPULATION
                  </h3>
                  <p className="text-sim-text-secondary text-[11px] mt-0.5 leading-relaxed">
                    Any living cell with <strong>more than 3</strong> living neighbours dies as if by overcrowding.
                  </p>
                </div>
              </div>

              {/* Rule 4 */}
              <div className="p-3 rounded bg-sim-surface border border-sim-border flex items-start space-x-3">
                <div className="p-1.5 rounded bg-sim-elevated border border-sim-secondary/30 text-sim-secondary flex-shrink-0">
                  <UserPlus className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sim-text-primary font-mono text-[11px]">
                    4. REPRODUCTION
                  </h3>
                  <p className="text-sim-text-secondary text-[11px] mt-0.5 leading-relaxed">
                    Any dead cell with <strong>exactly 3</strong> living neighbours transitions to a live cell.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-sim-border bg-sim-surface flex justify-end">
            <Dialog.Close asChild>
              <button className="px-3 py-1.5 rounded text-xs font-semibold bg-sim-elevated hover:bg-sim-hover text-sim-text-primary border border-sim-border transition-colors font-mono">
                ACKNOWLEDGE
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
