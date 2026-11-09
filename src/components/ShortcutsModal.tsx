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
    category: 'Viewport & Zoom',
    items: [
      { key: '+ / -', desc: 'Zoom in / Zoom out' },
      { key: 'Scroll Wheel', desc: 'Zoom toward cursor' },
      { key: 'Home', desc: 'Reset viewport center & zoom' },
      { key: 'Shift + Drag', desc: 'Pan canvas at any time' },
    ],
  },
  {
    category: 'Tools & Patterns',
    items: [
      { key: 'D', desc: 'Draw tool' },
      { key: 'E', desc: 'Erase tool' },
      { key: 'H', desc: 'Pan / Hand tool' },
      { key: 'P', desc: 'Open Pattern Explorer' },
      { key: 'R', desc: 'Rotate selected pattern 90°' },
      { key: 'Esc', desc: 'Cancel stamp tool' },
    ],
  },
  {
    category: 'World & System',
    items: [
      { key: 'S', desc: 'Primordial random soup' },
      { key: 'C', desc: 'Clear entire universe' },
      { key: 'M', desc: 'Toggle ambient audio' },
      { key: 'G', desc: 'Toggle grid matrix lines' },
      { key: '?', desc: 'Keyboard shortcuts guide' },
    ],
  },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose, theme }) => {
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
                  <Keyboard className="w-4 h-4" />
                </div>
                <div>
                  <Dialog.Title className="text-sm font-semibold tracking-wider font-mono uppercase">
                    KEYBOARD SHORTCUTS
                  </Dialog.Title>
                  <Dialog.Description
                    className="text-xs mt-0.5"
                    style={{ color: theme.textSecondary }}
                  >
                    Quick-action hotkeys for rapid navigation & simulation control
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

            {/* Content */}
            <div
              className="p-6 space-y-5 max-h-[72vh] overflow-y-auto text-xs transition-colors"
              style={{
                backgroundColor: theme.bg,
                color: theme.textPrimary,
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SHORTCUT_GROUPS.map((group) => (
                  <div
                    key={group.category}
                    className="p-4 rounded-xl border space-y-2.5 transition-colors"
                    style={{
                      backgroundColor: theme.panelBg,
                      borderColor: theme.borderSubtleColor || theme.borderColor,
                    }}
                  >
                    <div
                      className="text-[11px] font-mono uppercase tracking-wider font-semibold pb-1 border-b"
                      style={{
                        color: theme.accentColor,
                        borderColor: theme.borderSubtleColor || theme.borderColor,
                      }}
                    >
                      {group.category}
                    </div>
                    <div className="space-y-1.5">
                      {group.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1 text-xs"
                        >
                          <span style={{ color: theme.textSecondary }}>{item.desc}</span>
                          <kbd
                            className="px-2 py-0.5 rounded font-mono text-[10px] border shadow-sm"
                            style={{
                              backgroundColor: theme.elevatedBg,
                              borderColor: theme.borderSubtleColor || theme.borderColor,
                              color: theme.textPrimary,
                            }}
                          >
                            {item.key}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
                  DISMISS
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
