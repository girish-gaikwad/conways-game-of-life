import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { Theme } from '../types/game';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

const SHORTCUTS = [
  { key: 'Space', desc: 'Play / Pause simulation' },
  { key: '→ or N', desc: 'Step forward 1 generation' },
  { key: '← or B', desc: 'Step backward (Undo 1 gen)' },
  { key: '1, 2, 5, 0', desc: 'Set speed (1×, 2×, 5×, 20×)' },
  { key: 'D', desc: 'Draw tool (Pencil)' },
  { key: 'E', desc: 'Eraser tool' },
  { key: 'H', desc: 'Pan / Hand tool' },
  { key: 'P', desc: 'Open Pattern catalog' },
  { key: 'R', desc: 'Rotate selected pattern 90°' },
  { key: 'S', desc: 'Random soup of life' },
  { key: 'C', desc: 'Clear entire universe' },
  { key: 'M', desc: 'Toggle generative sound effects' },
  { key: 'G', desc: 'Toggle grid matrix guidelines' },
  { key: 'Scroll Wheel', desc: 'Zoom in / Zoom out' },
  { key: 'Shift + Drag', desc: 'Pan canvas at any time' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Keyboard Shortcuts</h2>
              <p className="text-xs text-white/50">Master Conway's Game of Life like a pro</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-2">
          {SHORTCUTS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs"
            >
              <span className="text-white/70">{item.desc}</span>
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-white/90 font-mono text-[11px] border border-white/10 shadow-sm">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-md"
            style={{ backgroundColor: theme.accentColor }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
