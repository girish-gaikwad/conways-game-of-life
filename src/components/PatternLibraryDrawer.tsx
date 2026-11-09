import React, { useState, useMemo } from 'react';
import { X, Search, RotateCw, Sparkles, Plus, Stamp, FileCode, Check, AlertCircle } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { PATTERNS, rotateGrid } from '../data/patterns';
import { Pattern, PatternCategory, Theme } from '../types/game';
import { parseRLE, ParsedRLE } from '../utils/rle';

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
  const [activeView, setActiveView] = useState<'catalog' | 'rle'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rotatedGrids, setRotatedGrids] = useState<Record<string, number[][]>>({});
  const [rotationAngles, setRotationAngles] = useState<Record<string, number>>({});

  // RLE Import State
  const [rleInput, setRleInput] = useState<string>('');
  const [parsedPattern, setParsedPattern] = useState<ParsedRLE | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

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

  const handleParseRLE = () => {
    try {
      setParseError(null);
      if (!rleInput.trim()) {
        setParseError('Please paste RLE code first.');
        return;
      }
      const parsed = parseRLE(rleInput);
      if (parsed.grid.length === 0 || parsed.grid[0].length === 0) {
        setParseError('Failed to parse living cells from the provided RLE.');
        return;
      }
      setParsedPattern(parsed);
    } catch {
      setParseError('Syntax error in RLE data string.');
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm animate-fadeIn" />
        <Dialog.Content
          className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg border-l shadow-2xl flex flex-col overflow-hidden animate-slideLeft outline-none font-sans transition-colors"
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
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <Dialog.Title className="text-xs font-semibold tracking-wider font-mono uppercase">
                  PATTERN EXPLORER
                </Dialog.Title>
                <Dialog.Description
                  className="text-[11px]"
                  style={{ color: theme.textSecondary }}
                >
                  Historic cellular automata architectures & structures
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

          {/* Mode Switcher: Catalog vs RLE Import */}
          <div
            className="flex items-center border-b px-4 py-2 space-x-2"
            style={{
              backgroundColor: theme.panelBg,
              borderColor: theme.borderColor,
            }}
          >
            <button
              onClick={() => setActiveView('catalog')}
              className="px-3 py-1 text-xs font-mono rounded border transition-colors"
              style={{
                backgroundColor: activeView === 'catalog' ? (theme.elevatedBg || `${theme.accentColor}25`) : 'transparent',
                borderColor: activeView === 'catalog' ? theme.accentColor : 'transparent',
                color: activeView === 'catalog' ? theme.accentColor : theme.textSecondary,
                fontWeight: activeView === 'catalog' ? 600 : 400,
              }}
            >
              Built-in Catalog
            </button>
            <button
              onClick={() => setActiveView('rle')}
              className="flex items-center space-x-1.5 px-3 py-1 text-xs font-mono rounded border transition-colors"
              style={{
                backgroundColor: activeView === 'rle' ? (theme.elevatedBg || `${theme.accentColor}25`) : 'transparent',
                borderColor: activeView === 'rle' ? theme.accentColor : 'transparent',
                color: activeView === 'rle' ? theme.accentColor : theme.textSecondary,
                fontWeight: activeView === 'rle' ? 600 : 400,
              }}
            >
              <FileCode className="w-3 h-3" />
              <span>Import RLE</span>
            </button>
          </div>

          {activeView === 'catalog' ? (
            <>
              {/* Search Bar & Categories Tabs */}
              <div
                className="p-3 border-b space-y-2.5 transition-colors"
                style={{
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderColor,
                }}
              >
                <div className="relative">
                  <Search
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                    style={{ color: theme.textSecondary }}
                  />
                  <input
                    type="text"
                    placeholder="Search by name, author, or behavior..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded border text-xs focus:outline-none transition-colors font-sans"
                    style={{
                      backgroundColor: theme.elevatedBg,
                      borderColor: theme.borderSubtleColor || theme.borderColor,
                      color: theme.textPrimary,
                    }}
                  />
                </div>

                {/* Radix Tabs Category Switcher */}
                <Tabs.Root value={selectedCategory} onValueChange={setSelectedCategory}>
                  <Tabs.List className="flex items-center space-x-1 overflow-x-auto pb-0.5 scrollbar-none">
                    {CATEGORIES.map((cat) => {
                      const isActive = selectedCategory === cat.id;
                      return (
                        <Tabs.Trigger
                          key={cat.id}
                          value={cat.id}
                          className="px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-colors outline-none"
                          style={{
                            backgroundColor: isActive ? theme.elevatedBg : 'transparent',
                            color: isActive ? theme.accentColor : theme.textSecondary,
                            borderColor: isActive ? theme.borderColor : 'transparent',
                            borderWidth: 1,
                            fontWeight: isActive ? 600 : 400,
                          }}
                        >
                          {cat.label}
                        </Tabs.Trigger>
                      );
                    })}
                  </Tabs.List>
                </Tabs.Root>
              </div>

              {/* Pattern Cards List */}
              <div
                className="flex-1 overflow-y-auto p-3 space-y-2.5 transition-colors"
                style={{
                  backgroundColor: theme.bg,
                  color: theme.textPrimary,
                }}
              >
                {filteredPatterns.length === 0 ? (
                  <div
                    className="text-center py-16 text-xs font-mono"
                    style={{ color: theme.textSecondary }}
                  >
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
                        className="p-3 rounded border transition-colors"
                        style={{
                          backgroundColor: isArmed
                            ? (theme.elevatedBg || `${theme.accentColor}18`)
                            : theme.panelBg,
                          borderColor: isArmed
                            ? theme.accentColor
                            : (theme.borderSubtleColor || theme.borderColor),
                        }}
                      >
                        <div className="flex items-start space-x-3.5">
                          {/* Pattern Matrix Preview */}
                          <div
                            className="w-16 h-16 rounded border p-1 flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                            style={{
                              backgroundColor: theme.bg,
                              borderColor: theme.borderSubtleColor || theme.borderColor,
                            }}
                          >
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

                          {/* Pattern Info */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span
                                className="text-xs font-semibold tracking-wide"
                                style={{ color: theme.textPrimary }}
                              >
                                {pattern.name}
                              </span>
                              <span
                                className="text-[10px] font-mono px-1 py-0.2 rounded border"
                                style={{
                                  backgroundColor: theme.elevatedBg,
                                  borderColor: theme.borderSubtleColor || theme.borderColor,
                                  color: theme.textSecondary,
                                }}
                              >
                                {cols}×{rows}
                              </span>
                              {angle > 0 && (
                                <span className="text-[10px] font-mono" style={{ color: theme.accentColor }}>
                                  {angle}°
                                </span>
                              )}
                            </div>
                            <p
                              className="text-[11px] leading-snug line-clamp-2"
                              style={{ color: theme.textSecondary }}
                            >
                              {pattern.description}
                            </p>
                            {pattern.author && (
                              <div
                                className="text-[10px] font-mono"
                                style={{ color: theme.textSecondary, opacity: 0.8 }}
                              >
                                {pattern.author} ({pattern.year})
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div
                          className="flex items-center justify-between mt-2.5 pt-2 border-t"
                          style={{
                            borderColor: theme.borderSubtleColor || theme.borderColor,
                          }}
                        >
                          <button
                            onClick={() => handleRotate(pattern.id, activeGrid)}
                            className="flex items-center space-x-1 px-2 py-1 rounded text-[11px] font-mono transition-opacity hover:opacity-80"
                            style={{ color: theme.textSecondary }}
                            title="Rotate 90 degrees clockwise"
                          >
                            <RotateCw className="w-3 h-3" style={{ color: theme.accentColor }} />
                            <span>Rotate</span>
                          </button>

                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() => {
                                onSelectPattern({ ...pattern, grid: activeGrid }, 'stamp');
                                onClose();
                              }}
                              className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors"
                              style={{
                                backgroundColor: isArmed ? `${theme.accentColor}25` : (theme.elevatedBg || 'transparent'),
                                borderColor: isArmed ? theme.accentColor : (theme.borderSubtleColor || theme.borderColor),
                                color: isArmed ? theme.accentColor : theme.textPrimary,
                              }}
                            >
                              <Stamp className="w-3 h-3" />
                              <span>{isArmed ? 'Armed' : 'Stamp Tool'}</span>
                            </button>

                            <button
                              onClick={() => {
                                onSelectPattern({ ...pattern, grid: activeGrid }, 'center');
                                onClose();
                              }}
                              className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold shadow-sm transition-opacity hover:opacity-90"
                              style={{
                                backgroundColor: theme.accentColor,
                                color: theme.isLight ? '#FFFFFF' : '#0B0F0D',
                              }}
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
            </>
          ) : (
            /* RLE Import View */
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 text-xs transition-colors"
              style={{
                backgroundColor: theme.bg,
                color: theme.textPrimary,
              }}
            >
              <div className="space-y-1.5">
                <label
                  className="font-mono text-[11px] uppercase tracking-wider block"
                  style={{ color: theme.textSecondary }}
                >
                  Paste RLE (Run Length Encoded) or Plaintext
                </label>
                <textarea
                  rows={8}
                  value={rleInput}
                  onChange={(e) => setRleInput(e.target.value)}
                  placeholder={`#N Gosper Glider Gun\nx = 36, y = 9, rule = B3/S23\n24bo$22bobo...`}
                  className="w-full p-2.5 rounded border font-mono text-[11px] focus:outline-none leading-relaxed resize-none"
                  style={{
                    backgroundColor: theme.elevatedBg,
                    borderColor: theme.borderSubtleColor || theme.borderColor,
                    color: theme.textPrimary,
                  }}
                />
              </div>

              {/* Quick Sample RLE Buttons */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono" style={{ color: theme.textSecondary }}>
                  Quick Samples:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Glider', rle: 'x = 3, y = 3, rule = B3/S23\nbob$2bo$3o!' },
                    { label: 'Pulsar', rle: 'x = 13, y = 13, rule = B3/S23\n2b3o3b3o2b2$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o2b2$2b3o3b3o2b$o4bobo4bo$o4bobo4bo$o4bobo4bo2$2b3o3b3o2b!' },
                    { label: 'Acorn', rle: 'x = 7, y = 3, rule = B3/S23\nbo5b$3bo3b$2o2b3o!' },
                  ].map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setRleInput(s.rle)}
                      className="px-2 py-0.5 rounded border text-[10px] font-mono hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: theme.panelBg,
                        borderColor: theme.borderSubtleColor || theme.borderColor,
                        color: theme.textSecondary,
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleParseRLE}
                  className="px-4 py-2 rounded text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 font-mono"
                  style={{
                    backgroundColor: theme.accentColor,
                    color: theme.isLight ? '#FFFFFF' : '#0B0F0D',
                  }}
                >
                  Parse & Verify Pattern
                </button>
              </div>

              {parseError && (
                <div className="p-2.5 rounded border border-[#E16D6D]/40 bg-[#E16D6D]/15 text-[#E16D6D] flex items-center space-x-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {parsedPattern && (
                <div
                  className="p-3.5 rounded border space-y-3 animate-fadeIn"
                  style={{
                    backgroundColor: theme.panelBg,
                    borderColor: theme.accentColor,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-xs flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-sim-accent" />
                        <span>{parsedPattern.name || 'Valid Pattern'}</span>
                      </div>
                      <div className="text-[10px] font-mono mt-0.5" style={{ color: theme.textSecondary }}>
                        Dimensions: {parsedPattern.width} × {parsedPattern.height} cells | Rule: {parsedPattern.rule}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1 border-t" style={{ borderColor: theme.borderSubtleColor || theme.borderColor }}>
                    <button
                      onClick={() => {
                        const newPattern: Pattern = {
                          id: `custom-${Date.now()}`,
                          name: parsedPattern.name || 'Custom Pattern',
                          category: 'spaceships',
                          description: 'Imported via RLE format',
                          grid: parsedPattern.grid,
                        };
                        onSelectPattern(newPattern, 'stamp');
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded border text-xs font-medium flex items-center space-x-1 transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: theme.elevatedBg,
                        borderColor: theme.borderColor,
                        color: theme.textPrimary,
                      }}
                    >
                      <Stamp className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                      <span>Arm as Stamp Tool</span>
                    </button>

                    <button
                      onClick={() => {
                        const newPattern: Pattern = {
                          id: `custom-${Date.now()}`,
                          name: parsedPattern.name || 'Custom Pattern',
                          category: 'spaceships',
                          description: 'Imported via RLE format',
                          grid: parsedPattern.grid,
                        };
                        onSelectPattern(newPattern, 'center');
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded text-xs font-semibold shadow-sm flex items-center space-x-1 transition-opacity hover:opacity-90 font-mono"
                      style={{
                        backgroundColor: theme.accentColor,
                        color: theme.isLight ? '#FFFFFF' : '#0B0F0D',
                      }}
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Place Center</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
