import React from 'react';
import { X, Keyboard } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Theme } from '../types/game';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

const SHORTCUT_GROUPS = [
  {
    category: 'Simulation Playback',
    items: [
      { key: 'Space', desc: 'Toggle Run / Pause' },
      { key: '→ or N', desc: 'Step forward 1 generation' },
      { key: '← or B', desc: 'Step backward 1 generation (Undo)' },
      { key: '1, 2, 5, 0', desc: 'Speed multiplier (1×, 2×, 5×, 20×)' },
    ],
  },
  {
    category: 'Tools & Viewport',
    items: [
      { key: 'D', desc: 'Draw tool (toggle cells)' },
      { key: 'E', desc: 'Erase tool' },
      { key: 'H', desc: 'Hand / Pan tool' },
      { key: 'Shift + Drag', desc: 'Pan canvas at any time' },
      { key: 'Scroll Wheel', desc: 'Zoom in / Zoom out at cursor' },
      { key: 'Home', desc: 'Reset viewport to center' },
    ],
  },
  {
    category: 'Patterns & World',
    items: [
      { key: 'P', desc: 'Open Pattern Explorer' },
      { key: 'R', desc: 'Rotate selected pattern 90°' },
      { key: 'S', desc: 'Primordial random soup' },
      { key: 'C', desc: 'Clear entire universe' },
      { key: 'M', desc: 'Toggle ambient audio' },
      { key: 'G', desc: 'Toggle grid guidelines' },
      { key: '?', desc: 'Keyboard shortcuts guide' },
    ],
  },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-fadeIn" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-sim-surface border border-sim-border rounded-lg shadow-popover overflow-hidden flex flex-col font-sans animate-fadeIn outline-none">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-sim-border bg-sim-surface">
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded bg-sim-elevated border border-sim-border text-sim-accent">
                <Keyboard className="w-3.5 h-3.5" />
              </div>
              <div>
                <Dialog.Title className="text-xs font-semibold tracking-wider font-mono uppercase text-sim-text-primary">
                  KEYBOARD SHORTCUTS
                </Dialog.Title>
                <Dialog.Description className="text-[11px] text-sim-text-secondary">
                  Complete hotkey directory for high-efficiency operation
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
          <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto bg-sim-bg text-xs">
            {SHORTCUT_GROUPS.map((group) => (
              <div key={group.category} className="space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-sim-text-muted px-1">
                  {group.category}
                </div>
                <div className="space-y-1">
                  {group.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded bg-sim-surface border border-sim-border-subtle"
                    >
                      <span className="text-sim-text-secondary text-[11px]">{item.desc}</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-sim-elevated text-sim-text-primary font-mono text-[10px] border border-sim-border">
                        {item.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-sim-border bg-sim-surface flex justify-end">
            <Dialog.Close asChild>
              <button className="px-3 py-1.5 rounded text-xs font-semibold bg-sim-elevated hover:bg-sim-hover text-sim-text-primary border border-sim-border transition-colors font-mono">
                DISMISS
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
