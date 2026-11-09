
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
      { key: '→ / N', desc: 'Step forward one generation' },
      { key: '← / B', desc: 'Step backward one generation' },
      { key: '1 / 2 / 5 / 0', desc: 'Set speed multiplier' },
    ],
  },
  {
    category: 'Viewport & Zoom',
    items: [
      { key: '+ / −', desc: 'Zoom in / Zoom out' },
      { key: 'Scroll', desc: 'Zoom toward cursor' },
      { key: 'Home', desc: 'Reset viewport' },
      { key: 'Shift + Drag', desc: 'Pan canvas' },
    ],
  },
  {
    category: 'Tools & Patterns',
    items: [
      { key: 'D', desc: 'Activate draw tool' },
      { key: 'E', desc: 'Activate erase tool' },
      { key: 'H', desc: 'Activate hand tool' },
      { key: 'P', desc: 'Open Pattern Explorer' },
      { key: 'R', desc: 'Rotate selected pattern' },
      { key: 'Esc', desc: 'Cancel pattern placement' },
    ],
  },
  {
    category: 'World & System',
    items: [
      { key: 'S', desc: 'Generate random universe' },
      { key: 'C', desc: 'Clear universe' },
      { key: 'M', desc: 'Toggle ambient audio' },
      { key: 'G', desc: 'Toggle grid lines' },
      { key: '?', desc: 'Open shortcuts guide' },
    ],
  },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const isLight = Boolean(theme.isLight);

  const colors = {
    text: isLight ? '#202820' : '#E5EAE5',
    muted: isLight ? '#69736B' : '#929D95',
    border: theme.gridLineColor,
    surface: theme.panelBg,
    background: theme.bg,
    keyBackground: isLight ? '#F0F2ED' : '#1A211D',
    accent: theme.accentColor,
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[3px]" />

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <Dialog.Content
            className="pointer-events-auto relative flex w-full max-w-2xl max-h-[88vh] flex-col overflow-hidden border outline-none"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            }}
          >
            {/* Header */}
            <header
              className="flex items-center justify-between gap-4 px-5 py-4 border-b"
              style={{ borderColor: colors.border }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center border"
                  style={{
                    borderColor: colors.border,
                    color: colors.accent,
                    backgroundColor: colors.background,
                  }}
                >
                  <Keyboard size={17} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <Dialog.Title className="text-sm font-semibold tracking-wide">
                    Keyboard shortcuts
                  </Dialog.Title>
                  <Dialog.Description
                    className="mt-1 text-xs"
                    style={{ color: colors.muted }}
                  >
                    Controls for simulation, navigation and tools
                  </Dialog.Description>
                </div>
              </div>

              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close shortcuts"
                  className="flex h-8 w-8 shrink-0 items-center justify-center transition-colors hover:opacity-60"
                  style={{ color: colors.muted }}
                >
                  <X size={17} />
                </button>
              </Dialog.Close>
            </header>

            {/* Shortcut list */}
            <main
              className="overflow-y-auto p-5"
              style={{ backgroundColor: colors.background }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {SHORTCUT_GROUPS.map((group, groupIndex) => (
                  <section key={group.category} className="min-w-0">
                    <div
                      className="flex items-center gap-2 border-b pb-2 mb-2"
                      style={{ borderColor: colors.border }}
                    >
                      <span
                        className="font-mono text-[10px] tabular-nums"
                        style={{ color: colors.muted }}
                      >
                        0{groupIndex + 1}
                      </span>

                      <h3
                        className="text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: colors.accent }}
                      >
                        {group.category}
                      </h3>
                    </div>

                    <div>
                      {group.items.map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between gap-3 py-2 border-b last:border-b-0"
                          style={{ borderColor: colors.border }}
                        >
                          <span
                            className="text-xs leading-relaxed"
                            style={{ color: colors.muted }}
                          >
                            {item.desc}
                          </span>

                          <kbd
                            className="inline-flex min-h-6 shrink-0 items-center justify-center border px-2 font-mono text-[10px] font-medium"
                            style={{
                              backgroundColor: colors.keyBackground,
                              borderColor: colors.border,
                              color: colors.text,
                            }}
                          >
                            {item.key}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <p
                className="mt-6 border-t pt-3 text-[10px] leading-relaxed"
                style={{
                  borderColor: colors.border,
                  color: colors.muted,
                }}
              >
                Tip: Use the keyboard shortcuts while the simulation canvas is active.
              </p>
            </main>

            {/* Footer */}
            <footer
              className="flex items-center justify-between gap-3 border-t px-5 py-3"
              style={{ borderColor: colors.border }}
            >
              <span
                className="text-[10px] font-mono uppercase tracking-wider"
                style={{ color: colors.muted }}
              >
                {SHORTCUT_GROUPS.reduce(
                  (total, group) => total + group.items.length,
                  0
                )}{' '}
                shortcuts
              </span>

              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: colors.accent,
                    color: isLight ? '#FFFFFF' : '#101510',
                  }}
                >
                  Done
                </button>
              </Dialog.Close>
            </footer>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
