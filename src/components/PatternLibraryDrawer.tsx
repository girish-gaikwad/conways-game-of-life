import React, { useState, useMemo } from 'react';
import { X, Search, RotateCw, Sparkles, Plus, Stamp } from 'lucide-react';
import { PATTERNS, rotateGrid } from '../data/patterns';
import { Pattern, PatternCategory, Theme } from '../types/game';

interface PatternLibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPattern: (pattern: Pattern, mode: 'stamp' | 'center') => void;
  theme: Theme;
}

const CATEGORIES: { id: PatternCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Patterns' },
  { id: 'spaceships', label: 'Spaceships' },
  { id: 'guns', label: 'Guns & Breeders' },
  { id: 'oscillators', label: 'Oscillators' },
  { id: 'methuselahs', label: 'Methuselahs' },
  { id: 'still-life', label: 'Still Lifes' },
];

export const PatternLibraryDrawer: React.FC<PatternLibraryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectPattern,
  theme,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PatternCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rotatedGrids, setRotatedGrids] = useState<Record<string, number[][]>>({});

  // Filter patterns by search & category
  const filteredPatterns = useMemo(() => {
    return PATTERNS.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.author && p.author.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleRotate = (patternId: string, currentGrid: number[][]) => {
    const nextGrid = rotateGrid(currentGrid);
    setRotatedGrids((prev) => ({ ...prev, [patternId]: nextGrid }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl h-full glass-panel border-l border-white/10 flex flex-col shadow-2xl overflow-hidden animate-slideLeft">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-wide">Pattern Catalog</h2>
              <p className="text-xs text-white/50">Historic cellular automata structures & engines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search patterns (e.g. Glider, Gun, Pulsar, Acorn)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-white shadow-glow-emerald'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Patterns List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {filteredPatterns.length === 0 ? (
            <div className="text-center py-16 text-white/40 text-xs">
              No patterns found matching "{searchQuery}"
            </div>
          ) : (
            filteredPatterns.map((pattern) => {
              const activeGrid = rotatedGrids[pattern.id] || pattern.grid;
              const rows = activeGrid.length;
              const cols = activeGrid[0].length;

              return (
                <div
                  key={pattern.id}
                  className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group"
                >
                  {/* Left: Mini Grid Visual & Details */}
                  <div className="flex items-center space-x-4">
                    {/* Interactive Pattern Preview Canvas */}
                    <div className="w-20 h-20 rounded-lg bg-black/40 border border-white/10 p-1.5 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      <div
                        className="grid gap-[1px]"
                        style={{
                          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                          maxWidth: '100%',
                          maxHeight: '100%',
                        }}
                      >
                        {activeGrid.map((row, r) =>
                          row.map((cell, c) => (
                            <div
                              key={`${r}-${c}`}
                              className="w-1.5 h-1.5 rounded-[0.5px]"
                              style={{
                                backgroundColor: cell ? theme.cellColor : 'transparent',
                              }}
                            />
                          ))
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-white">{pattern.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 font-mono text-white/60">
                          {cols}×{rows}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed max-w-xs">
                        {pattern.description}
                      </p>
                      {pattern.author && (
                        <div className="text-[10px] text-white/40 font-mono">
                          Discovered by {pattern.author} ({pattern.year})
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex items-center space-x-1.5 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    {/* Rotate button */}
                    <button
                      onClick={() => handleRotate(pattern.id, activeGrid)}
                      title="Rotate 90°"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>

                    {/* Stamp Mode */}
                    <button
                      onClick={() => {
                        onSelectPattern({ ...pattern, grid: activeGrid }, 'stamp');
                        onClose();
                      }}
                      title="Select as Stamp Tool (Click anywhere on grid)"
                      className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center space-x-1.5 transition-colors"
                    >
                      <Stamp className="w-3.5 h-3.5" />
                      <span>Stamp</span>
                    </button>

                    {/* Place Centered */}
                    <button
                      onClick={() => {
                        onSelectPattern({ ...pattern, grid: activeGrid }, 'center');
                        onClose();
                      }}
                      title="Spawn in Center of Grid"
                      className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md"
                      style={{
                        backgroundColor: theme.accentColor,
                        color: theme.isLight ? '#ffffff' : '#0a0f14',
                      }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Place</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
