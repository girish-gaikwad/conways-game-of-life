import React, { useState, useMemo } from 'react';
import { X, Search, RotateCw, Sparkles, Plus, Stamp } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { PATTERNS, rotateGrid } from '../data/patterns';
import { Pattern, PatternCategory, Theme } from '../types/game';

interface PatternLibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPattern: (pattern: Pattern, mode: 'stamp' | 'center') => void;
  selectedPattern: Pattern | null;
  theme: Theme;
}

const CATEGORIES: { id: PatternCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'spaceships', label: 'Spaceships' },
  { id: 'guns', label: 'Guns' },
  { id: 'oscillators', label: 'Oscillators' },
  { id: 'methuselahs', label: 'Methuselahs' },
  { id: 'still-life', label: 'Still Life' },
];

export const PatternLibraryDrawer: React.FC<PatternLibraryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectPattern,
  selectedPattern,
  theme,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rotatedGrids, setRotatedGrids] = useState<Record<string, number[][]>>({});
  const [rotationAngles, setRotationAngles] = useState<Record<string, number>>({});

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
    setRotationAngles((prev) => ({
      ...prev,
      [patternId]: ((prev[patternId] || 0) + 90) % 360,
    }));
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-fadeIn" />
        <Dialog.Content className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-sim-surface border-l border-sim-border shadow-2xl flex flex-col overflow-hidden animate-slideLeft outline-none font-sans">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-sim-border bg-sim-surface">
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded bg-sim-elevated border border-sim-border text-sim-accent">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <Dialog.Title className="text-xs font-semibold tracking-wider font-mono uppercase text-sim-text-primary">
                  PATTERN EXPLORER
                </Dialog.Title>
                <Dialog.Description className="text-[11px] text-sim-text-secondary">
                  Historic cellular automata architectures & structures
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="p-1 rounded text-sim-text-secondary hover:text-sim-text-primary hover:bg-sim-hover border border-transparent hover:border-sim-border transition-colors">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Search Bar & Categories Tabs */}
          <div className="p-3 border-b border-sim-border bg-sim-surface space-y-2.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sim-text-muted" />
              <input
                type="text"
                placeholder="Search by name, author, or behavior..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded bg-sim-elevated border border-sim-border text-xs text-sim-text-primary placeholder-sim-text-muted focus:outline-none focus:border-sim-border-focus font-sans"
              />
            </div>

            {/* Radix Tabs Category Switcher */}
            <Tabs.Root value={selectedCategory} onValueChange={setSelectedCategory}>
              <Tabs.List className="flex items-center space-x-1 overflow-x-auto pb-0.5 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <Tabs.Trigger
                    key={cat.id}
                    value={cat.id}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-colors outline-none ${
                      selectedCategory === cat.id
                        ? 'bg-sim-elevated text-sim-accent border border-sim-border font-medium'
                        : 'text-sim-text-secondary hover:text-sim-text-primary hover:bg-sim-hover'
                    }`}
                  >
                    {cat.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </Tabs.Root>
          </div>

          {/* Pattern Cards List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-sim-bg">
            {filteredPatterns.length === 0 ? (
              <div className="text-center py-16 text-sim-text-muted text-xs font-mono">
                No patterns matching "{searchQuery}"
              </div>
            ) : (
              filteredPatterns.map((pattern) => {
                const activeGrid = rotatedGrids[pattern.id] || pattern.grid;
                const angle = rotationAngles[pattern.id] || 0;
                const rows = activeGrid.length;
                const cols = activeGrid[0].length;
                const isArmed = selectedPattern?.id === pattern.id;

                return (
                  <div
                    key={pattern.id}
                    className={`p-3 rounded border transition-all ${
                      isArmed
                        ? 'bg-sim-elevated border-sim-accent/50 shadow-sm'
                        : 'bg-sim-surface border-sim-border hover:border-sim-border-focus'
                    }`}
                  >
                    <div className="flex items-start space-x-3.5">
                      {/* High-Contrast Pattern Matrix Preview */}
                      <div className="w-16 h-16 rounded bg-sim-bg border border-sim-border p-1 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
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
                                className="w-1 h-1 rounded-[0.5px]"
                                style={{
                                  backgroundColor: cell ? theme.cellColor : 'transparent',
                                }}
                              />
                            ))
                          )}
                        </div>
                      </div>

                      {/* Pattern Information */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-sim-text-primary tracking-wide">
                            {pattern.name}
                          </span>
                          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-sim-elevated border border-sim-border text-sim-text-secondary">
                            {cols}×{rows}
                          </span>
                          {angle > 0 && (
                            <span className="text-[10px] font-mono text-sim-accent">
                              {angle}°
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-sim-text-secondary leading-snug line-clamp-2">
                          {pattern.description}
                        </p>
                        {pattern.author && (
                          <div className="text-[10px] text-sim-text-muted font-mono">
                            {pattern.author} ({pattern.year})
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-sim-border-subtle">
                      {/* Left: Rotate 90 deg */}
                      <button
                        onClick={() => handleRotate(pattern.id, activeGrid)}
                        className="flex items-center space-x-1 px-2 py-1 rounded text-[11px] font-mono text-sim-text-secondary hover:text-sim-text-primary hover:bg-sim-hover transition-colors"
                        title="Rotate 90 degrees clockwise"
                      >
                        <RotateCw className="w-3 h-3 text-sim-secondary" />
                        <span>Rotate</span>
                      </button>

                      {/* Right: Stamp & Place */}
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => {
                            onSelectPattern({ ...pattern, grid: activeGrid }, 'stamp');
                            onClose();
                          }}
                          className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                            isArmed
                              ? 'bg-sim-accent-muted text-sim-accent border-sim-accent/50'
                              : 'bg-sim-elevated hover:bg-sim-hover text-sim-text-primary border-sim-border'
                          }`}
                        >
                          <Stamp className="w-3 h-3" />
                          <span>{isArmed ? 'Armed' : 'Stamp Tool'}</span>
                        </button>

                        <button
                          onClick={() => {
                            onSelectPattern({ ...pattern, grid: activeGrid }, 'center');
                            onClose();
                          }}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold bg-sim-accent text-sim-bg hover:opacity-90 shadow-sm transition-opacity"
                        >
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                          <span>Place Center</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
