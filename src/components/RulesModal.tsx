import React from 'react';
import { X, BookOpen, HeartPulse, Skull, UserPlus } from 'lucide-react';
import { Theme } from '../types/game';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">The Rules of Life</h2>
              <p className="text-xs text-white/50">Conway's 1970 Zero-Player Cellular Automaton</p>
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
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <p className="text-white/70 leading-relaxed">
            Devised by British mathematician <strong className="text-white">John Horton Conway</strong> in 1970, the Game of Life is an infinite, two-dimensional grid of cells governed by four simple local rules. Despite their simplicity, the system is Turing-complete and exhibits emergent complexity.
          </p>

          <div className="space-y-3">
            {/* Rule 1: Underpopulation */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-400 flex-shrink-0">
                <Skull className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white">1. Underpopulation</h3>
                <p className="text-white/60 mt-0.5 leading-relaxed">
                  Any live cell with <strong>fewer than 2</strong> live neighbours dies, as if by underpopulation.
                </p>
              </div>
            </div>

            {/* Rule 2: Survival */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white">2. Survival</h3>
                <p className="text-white/60 mt-0.5 leading-relaxed">
                  Any live cell with <strong>2 or 3</strong> live neighbours lives on to the next generation.
                </p>
              </div>
            </div>

            {/* Rule 3: Overpopulation */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 flex-shrink-0">
                <Skull className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white">3. Overpopulation</h3>
                <p className="text-white/60 mt-0.5 leading-relaxed">
                  Any live cell with <strong>more than 3</strong> live neighbours dies, as if by overcrowding.
                </p>
              </div>
            </div>

            {/* Rule 4: Reproduction */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 flex-shrink-0">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white">4. Reproduction</h3>
                <p className="text-white/60 mt-0.5 leading-relaxed">
                  Any dead cell with <strong>exactly 3</strong> live neighbours becomes a live cell, as if by reproduction.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <span className="font-semibold">Pro Tip:</span> Try spawning the <strong>Gosper Glider Gun</strong> or <strong>Acorn</strong> from the Pattern Catalog to see complex organic evolution unfold before your eyes!
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-md"
            style={{ backgroundColor: theme.accentColor }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
