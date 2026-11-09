
import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  RotateCw,
  Sparkles,
  Plus,
  Stamp,
  FileCode,
  Check,
  AlertCircle,
  Library,
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
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

const QUICK_SAMPLES = [
  {
    label: 'Glider',
    rle: 'x = 3, y = 3, rule = B3/S23\nbob$2bo$3o!',
  },
  {
    label: 'Pulsar',
    rle: 'x = 13, y = 13, rule = B3/S23\n2b3o3b3o2b2$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o2b2$2b3o3b3o2b$o4bobo4bo$o4bobo4bo$o4bobo4bo2$2b3o3b3o2b!',
  },
  {
    label: 'Acorn',
    rle: 'x = 7, y = 3, rule = B3/S23\nbo5b$3bo3b$2o2b3o!',
  },
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

  const [rotatedGrids, setRotatedGrids] = useState<
    Record<string, number[][]>
  >({});
  const [rotationAngles, setRotationAngles] = useState<
    Record<string, number>
  >({});

  // RLE import state
  const [rleInput, setRleInput] = useState('');
  const [parsedPattern, setParsedPattern] = useState<ParsedRLE | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const isLight = Boolean(theme.isLight);

  const colors = {
    background: theme.bg,
    surface: theme.panelBg,
    border: theme.gridLineColor,
    text: isLight ? '#202820' : '#E5EAE5',
    muted: isLight ? '#69736B' : '#929D95',
    accent: theme.accentColor,
    input: isLight ? '#F0F2ED' : '#0D1310',
    danger: '#E16D6D',
  };

  const subtleAccent = `${colors.accent}15`;

  const filteredPatterns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return PATTERNS.filter((pattern) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        pattern.category === selectedCategory;

      const matchesSearch =
        !query ||
        pattern.name.toLowerCase().includes(query) ||
        pattern.description.toLowerCase().includes(query) ||
        (pattern.author && pattern.author.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleRotate = (patternId: string, currentGrid: number[][]) => {
    const nextGrid = rotateGrid(currentGrid);

    setRotatedGrids((previous) => ({
      ...previous,
      [patternId]: nextGrid,
    }));

    setRotationAngles((previous) => ({
      ...previous,
      [patternId]: ((previous[patternId] || 0) + 90) % 360,
    }));
  };

  const handleParseRLE = () => {
    try {
      setParseError(null);
      setParsedPattern(null);

      if (!rleInput.trim()) {
        setParseError('Paste RLE code before parsing.');
        return;
      }

      const parsed = parseRLE(rleInput);

      if (!parsed.grid.length || !parsed.grid[0]?.length) {
        setParseError('No living cells were found in the provided pattern.');
        return;
      }

      setParsedPattern(parsed);
    } catch {
      setParseError('Unable to parse this RLE data. Check its syntax and try again.');
    }
  };

  const handleImportPattern = (mode: 'stamp' | 'center') => {
    if (!parsedPattern) return;

    const newPattern: Pattern = {
      id: `custom-${Date.now()}`,
      name: parsedPattern.name || 'Custom Pattern',
      category: 'spaceships',
      description: 'Imported via RLE format',
      grid: parsedPattern.grid,
    };

    onSelectPattern(newPattern, mode);
    onClose();
  };

  const selectCatalogPattern = (
    pattern: Pattern,
    grid: number[][],
    mode: 'stamp' | 'center'
  ) => {
    onSelectPattern({ ...pattern, grid }, mode);
    onClose();
  };

  const dividerStyle: React.CSSProperties = {
    borderColor: colors.border,
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[3px] animate-fadeIn" />

        <Dialog.Content
          className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-[560px] flex-col overflow-hidden border-l outline-none font-sans animate-slideLeft"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
          }}
        >
          {/* Header */}
          <header
            className="flex shrink-0 items-center justify-between gap-3 border-b px-5 py-4"
            style={dividerStyle}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center border"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.accent,
                }}
              >
                <Sparkles size={17} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <Dialog.Title className="text-sm font-semibold tracking-wide">
                  Pattern Explorer
                </Dialog.Title>

                <Dialog.Description
                  className="mt-1 text-[11px]"
                  style={{ color: colors.muted }}
                >
                  Browse, rotate and import cellular structures
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close pattern explorer"
                className="flex h-8 w-8 shrink-0 items-center justify-center transition-opacity hover:opacity-60"
                style={{ color: colors.muted }}
              >
                <X size={17} />
              </button>
            </Dialog.Close>
          </header>

          {/* Main view navigation */}
          <nav
            className="flex shrink-0 items-center gap-5 border-b px-5"
            style={dividerStyle}
          >
            <button
              type="button"
              onClick={() => setActiveView('catalog')}
              className="relative flex items-center gap-2 py-3 text-xs font-medium transition-colors"
              style={{
                color: activeView === 'catalog'
                  ? colors.accent
                  : colors.muted,
              }}
            >
              <Library size={14} />
              Pattern catalog

              {activeView === 'catalog' && (
                <span
                  className="absolute bottom-0 left-0 h-[2px] w-full"
                  style={{ backgroundColor: colors.accent }}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveView('rle')}
              className="relative flex items-center gap-2 py-3 text-xs font-medium transition-colors"
              style={{
                color: activeView === 'rle'
                  ? colors.accent
                  : colors.muted,
              }}
            >
              <FileCode size={14} />
              Import RLE

              {activeView === 'rle' && (
                <span
                  className="absolute bottom-0 left-0 h-[2px] w-full"
                  style={{ backgroundColor: colors.accent }}
                />
              )}
            </button>
          </nav>

          {/* Catalog */}
          {activeView === 'catalog' && (
            <>
              {/* Search and category filters */}
              <div
                className="shrink-0 space-y-3 border-b px-5 py-4"
                style={dividerStyle}
              >
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    size={15}
                    style={{ color: colors.muted }}
                  />

                  <input
                    type="text"
                    placeholder="Search patterns, authors..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="h-9 w-full border pl-9 pr-3 text-xs outline-none transition-colors focus:ring-1"
                    style={{
                      backgroundColor: colors.input,
                      borderColor: colors.border,
                      color: colors.text,
                      outlineColor: colors.accent,
                    }}
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: colors.muted }}
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {CATEGORIES.map((category) => {
                    const active = selectedCategory === category.id;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        aria-pressed={active}
                        className="shrink-0 border px-2.5 py-1.5 text-[10px] font-medium transition-colors"
                        style={{
                          backgroundColor: active
                            ? subtleAccent
                            : 'transparent',
                          borderColor: active
                            ? colors.accent
                            : 'transparent',
                          color: active ? colors.accent : colors.muted,
                        }}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: colors.muted }}
                  >
                    {filteredPatterns.length} PATTERNS
                  </span>

                  {(searchQuery || selectedCategory !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="text-[10px] font-medium hover:opacity-70"
                      style={{ color: colors.accent }}
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>

              {/* Pattern list */}
              <main
                className="flex-1 space-y-2 overflow-y-auto p-4"
                style={{ backgroundColor: colors.background }}
              >
                {filteredPatterns.length === 0 ? (
                  <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                    <Search
                      size={23}
                      strokeWidth={1.5}
                      style={{ color: colors.muted }}
                    />

                    <p
                      className="mt-3 text-xs font-medium"
                      style={{ color: colors.text }}
                    >
                      No matching patterns
                    </p>

                    <p
                      className="mt-1 text-[11px]"
                      style={{ color: colors.muted }}
                    >
                      Try another search or category.
                    </p>
                  </div>
                ) : (
                  filteredPatterns.map((pattern) => {
                    const activeGrid =
                      rotatedGrids[pattern.id] || pattern.grid;

                    const angle = rotationAngles[pattern.id] || 0;
                    const rows = activeGrid.length;
                    const cols = activeGrid[0]?.length || 0;
                    const isArmed = selectedPattern?.id === pattern.id;

                    return (
                      <article
                        key={pattern.id}
                        className="border p-3 transition-colors"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: isArmed
                            ? colors.accent
                            : colors.border,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Pattern preview */}
                          <div
                            className="flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden border p-1"
                            style={{
                              backgroundColor: colors.background,
                              borderColor: colors.border,
                            }}
                          >
                            <div
                              className="grid"
                              style={{
                                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                                width: '100%',
                                height: '100%',
                                gap: '1px',
                              }}
                            >
                              {activeGrid.map((row, rowIndex) =>
                                row.map((cell, columnIndex) => (
                                  <div
                                    key={`${rowIndex}-${columnIndex}`}
                                    style={{
                                      backgroundColor: cell
                                        ? theme.cellColor
                                        : 'transparent',
                                      minWidth: 0,
                                      minHeight: 0,
                                    }}
                                  />
                                ))
                              )}
                            </div>
                          </div>

                          {/* Pattern information */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-xs font-semibold">
                                {pattern.name}
                              </h3>

                              <span
                                className="border px-1.5 py-0.5 font-mono text-[9px]"
                                style={{
                                  backgroundColor: colors.background,
                                  borderColor: colors.border,
                                  color: colors.muted,
                                }}
                              >
                                {cols} × {rows}
                              </span>

                              {angle > 0 && (
                                <span
                                  className="font-mono text-[10px]"
                                  style={{ color: colors.accent }}
                                >
                                  {angle}°
                                </span>
                              )}

                              {isArmed && (
                                <span
                                  className="font-mono text-[9px] uppercase tracking-wide"
                                  style={{ color: colors.accent }}
                                >
                                  Active
                                </span>
                              )}
                            </div>

                            <p
                              className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed"
                              style={{ color: colors.muted }}
                            >
                              {pattern.description}
                            </p>

                            {pattern.author && (
                              <p
                                className="mt-1.5 text-[10px] font-mono"
                                style={{ color: colors.muted }}
                              >
                                {pattern.author}
                                {pattern.year ? ` · ${pattern.year}` : ''}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Card actions */}
                        <div
                          className="mt-3 flex items-center justify-between gap-2 border-t pt-2"
                          style={dividerStyle}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleRotate(pattern.id, activeGrid)
                            }
                            className="flex items-center gap-1.5 px-1 py-1 text-[11px] transition-opacity hover:opacity-70"
                            style={{ color: colors.muted }}
                          >
                            <RotateCw
                              size={13}
                              style={{ color: colors.accent }}
                            />
                            Rotate
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                selectCatalogPattern(
                                  pattern,
                                  activeGrid,
                                  'stamp'
                                )
                              }
                              className="flex h-8 items-center gap-1.5 border px-2.5 text-[10px] font-medium transition-colors hover:opacity-75"
                              style={{
                                backgroundColor: isArmed
                                  ? subtleAccent
                                  : 'transparent',
                                borderColor: isArmed
                                  ? colors.accent
                                  : colors.border,
                                color: isArmed
                                  ? colors.accent
                                  : colors.text,
                              }}
                            >
                              <Stamp size={13} />
                              {isArmed ? 'Select Stamp' : 'Stamp Tool'}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                selectCatalogPattern(
                                  pattern,
                                  activeGrid,
                                  'center'
                                )
                              }
                              className="flex h-8 items-center gap-1.5 px-2.5 text-[10px] font-semibold transition-opacity hover:opacity-80"
                              style={{
                                backgroundColor: colors.accent,
                                color: '#FFFFFF',
                              }}
                            >
                              <Plus size={13} />
                              Place Center
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </main>
            </>
          )}

          {/* RLE Import */}
          {activeView === 'rle' && (
            <main
              className="flex-1 space-y-5 overflow-y-auto p-5"
              style={{ backgroundColor: colors.background }}
            >
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="rle-input"
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: colors.text }}
                  >
                    RLE source
                  </label>

                  <span
                    className="text-[10px] font-mono"
                    style={{ color: colors.muted }}
                  >
                    B3 / S23
                  </span>
                </div>

                <textarea
                  id="rle-input"
                  rows={10}
                  value={rleInput}
                  onChange={(event) => {
                    setRleInput(event.target.value);
                    setParsedPattern(null);
                    setParseError(null);
                  }}
                  placeholder={`#N Gosper Glider Gun
x = 36, y = 9, rule = B3/S23
24bo$22bobo...`}
                  spellCheck={false}
                  className="w-full resize-y border p-3 font-mono text-[11px] leading-relaxed outline-none transition-colors focus:ring-1"
                  style={{
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    color: colors.text,
                    outlineColor: colors.accent,
                    minHeight: '180px',
                  }}
                />

                <p
                  className="mt-2 text-[10px] leading-relaxed"
                  style={{ color: colors.muted }}
                >
                  Paste a Run Length Encoded pattern or supported plaintext
                  format. The pattern will be validated before placement.
                </p>
              </section>

              {/* Quick samples */}
              <section>
                <h3
                  className="mb-2 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: colors.muted }}
                >
                  Example patterns
                </h3>

                <div className="flex flex-wrap gap-2">
                  {QUICK_SAMPLES.map((sample) => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => {
                        setRleInput(sample.rle);
                        setParsedPattern(null);
                        setParseError(null);
                      }}
                      className="border px-3 py-2 text-[10px] font-medium transition-colors hover:opacity-75"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.text,
                      }}
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </section>

              {/* Parse action */}
              <button
                type="button"
                onClick={handleParseRLE}
                className="flex h-9 w-full items-center justify-center gap-2 text-xs font-semibold transition-opacity hover:opacity-85"
                style={{
                  backgroundColor: colors.accent,
                  color: '#FFFFFF',
                }}
              >
                <Check size={14} />
                Parse and validate
              </button>

              {/* Error state */}
              {parseError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 border p-3 text-xs"
                  style={{
                    backgroundColor: `${colors.danger}12`,
                    borderColor: `${colors.danger}55`,
                    color: colors.danger,
                  }}
                >
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{parseError}</span>
                </div>
              )}

              {/* Successful parse */}
              {parsedPattern && (
                <section
                  className="border p-4 animate-fadeIn"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.accent,
                  }}
                >
                  <div className="flex items-start gap-2">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0"
                      style={{ color: colors.accent }}
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs font-semibold">
                        {parsedPattern.name || 'Valid pattern'}
                      </h3>

                      <p
                        className="mt-1 text-[10px] leading-relaxed"
                        style={{ color: colors.muted }}
                      >
                        Pattern successfully parsed and ready for placement.
                      </p>
                    </div>

                    <span
                      className="border px-2 py-1 font-mono text-[9px]"
                      style={{
                        borderColor: colors.border,
                        color: colors.accent,
                      }}
                    >
                      VALID
                    </span>
                  </div>

                  <div
                    className="mt-4 grid grid-cols-3 gap-2 border-y py-3"
                    style={dividerStyle}
                  >
                    <div>
                      <span
                        className="block text-[9px] uppercase tracking-wider"
                        style={{ color: colors.muted }}
                      >
                        Width
                      </span>
                      <span className="mt-1 block font-mono text-xs">
                        {parsedPattern.width}
                      </span>
                    </div>

                    <div>
                      <span
                        className="block text-[9px] uppercase tracking-wider"
                        style={{ color: colors.muted }}
                      >
                        Height
                      </span>
                      <span className="mt-1 block font-mono text-xs">
                        {parsedPattern.height}
                      </span>
                    </div>

                    <div>
                      <span
                        className="block text-[9px] uppercase tracking-wider"
                        style={{ color: colors.muted }}
                      >
                        Rule
                      </span>
                      <span className="mt-1 block font-mono text-xs">
                        {parsedPattern.rule}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleImportPattern('stamp')}
                      className="flex h-9 flex-1 items-center justify-center gap-2 border px-2 text-[10px] font-semibold transition-opacity hover:opacity-75"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        color: colors.text,
                      }}
                    >
                      <Stamp size={14} style={{ color: colors.accent }} />
                      Arm as Stamp
                    </button>

                    <button
                      type="button"
                      onClick={() => handleImportPattern('center')}
                      className="flex h-9 flex-1 items-center justify-center gap-2 px-2 text-[10px] font-semibold transition-opacity hover:opacity-80"
                      style={{
                        backgroundColor: colors.accent,
                        color: '#FFFFFF',
                      }}
                    >
                      <Plus size={14} />
                      Place Center
                    </button>
                  </div>
                </section>
              )}
            </main>
          )}

          {/* Footer */}
          <footer
            className="flex shrink-0 items-center justify-between gap-3 border-t px-5 py-3"
            style={{
              ...dividerStyle,
              backgroundColor: colors.surface,
            }}
          >
            <span
              className="text-[10px] font-mono"
              style={{ color: colors.muted }}
            >
              {activeView === 'catalog'
                ? `${filteredPatterns.length} RESULTS`
                : 'RLE IMPORT'}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 text-[11px] font-semibold transition-colors hover:opacity-75"
              style={{
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              Close
            </button>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
