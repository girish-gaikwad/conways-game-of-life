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

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose, theme }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm animate-fadeIn" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md border rounded-lg shadow-2xl overflow-hidden flex flex-col font-sans animate-fadeIn outline-none transition-colors"
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
                <Keyboard className="w-3.5 h-3.5" />
              </div>
              <div>
                <Dialog.Title className="text-xs font-semibold tracking-wider font-mono uppercase">
                  KEYBOARD SHORTCUTS
                </Dialog.Title>
                <Dialog.Description
                  className="text-[11px]"
                  style={{ color: theme.textSecondary }}
                >
                  Complete hotkey directory for high-efficiency operation
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
            className="p-4 space-y-4 max-h-[70vh] overflow-y-auto text-xs transition-colors"
            style={{
              backgroundColor: theme.bg,
              color: theme.textPrimary,
            }}
          >
            {SHORTCUT_GROUPS.map((group) => (
              <div key={group.category} className="space-y-1.5">
                <div
                  className="text-[10px] font-mono uppercase tracking-wider px-1"
                  style={{ color: theme.textSecondary }}
                >
                  {group.category}
                </div>
                <div className="space-y-1">
                  {group.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded border transition-colors"
                      style={{
                        backgroundColor: theme.panelBg,
                        borderColor: theme.borderSubtleColor || theme.borderColor,
                      }}
                    >
                      <span className="text-[11px]" style={{ color: theme.textSecondary }}>
                        {item.desc}
                      </span>
                      <kbd
                        className="px-1.5 py-0.5 rounded font-mono text-[10px] border shadow-sm"
                        style={{
                          backgroundColor: theme.elevatedBg,
                          borderColor: theme.borderColor,
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
                DISMISS
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
