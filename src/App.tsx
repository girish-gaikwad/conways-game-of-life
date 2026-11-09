import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LifeEngine } from './core/lifeEngine';
import { GridCanvas } from './components/GridCanvas';
import { Header } from './components/Header';
import { ControlToolbar } from './components/ControlToolbar';
import { PatternLibraryDrawer } from './components/PatternLibraryDrawer';
import { SettingsModal } from './components/SettingsModal';
import { RulesModal } from './components/RulesModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { TooltipProvider } from './components/ui/Tooltip';
import { PATTERNS, rotateGrid } from './data/patterns';
import { THEMES } from './data/themes';
import { RULESETS } from './data/rules';
import { CellStyle, GameStats, Pattern, RuleSet, Theme, ToolType, ViewportTransform } from './types/game';
import { soundFX } from './utils/audio';

export const App: React.FC = () => {
  // Engine configuration
  const [gridSize, setGridSize] = useState({ w: 120, h: 80 });
  const [toroidal, setToroidal] = useState(true);
  const engineRef = useRef<LifeEngine>(new LifeEngine({ width: 120, height: 80, toroidal: true }));
  const engine = engineRef.current;

  // Viewport
  const [transform, setTransform] = useState<ViewportTransform>({
    panX: 0,
    panY: 0,
    zoom: 1.25,
  });

  // Simulation controls
  const [isRunning, setIsRunning] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [activeTool, setActiveTool] = useState<ToolType>('draw');
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);

  // Styling & Themes
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [currentRule, setCurrentRule] = useState<RuleSet>(RULESETS[0]);
  const [cellStyle, setCellStyle] = useState<CellStyle>('heatmap');
  const [showGridLines, setShowGridLines] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals
  const [isPatternCatalogOpen, setIsPatternCatalogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Stats
  const [stats, setStats] = useState<GameStats>({
    generation: 0,
    aliveCount: 0,
    peakPopulation: 0,
    births: 0,
    deaths: 0,
    density: 0,
    fps: 0,
    speedMultiplier: 1,
    cursorX: null,
    cursorY: null,
    historyPopulations: [],
  });
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);
  const [canStepBack, setCanStepBack] = useState(false);

  // Trigger re-render of canvas stats
  const [, setTick] = useState(0);
  const triggerRender = useCallback(() => {
    setTick((t) => (t + 1) % 1000000);
    const totalCells = engine.width * engine.height;
    const currentDensity = totalCells > 0 ? (engine.aliveCount / totalCells) * 100 : 0;

    setStats((prev) => {
      const newHistory = [...prev.historyPopulations, engine.aliveCount];
      if (newHistory.length > 50) newHistory.shift();

      return {
        ...prev,
        generation: engine.generation,
        aliveCount: engine.aliveCount,
        peakPopulation: engine.peakPopulation,
        births: engine.lastBirths,
        deaths: engine.lastDeaths,
        density: currentDensity,
        speedMultiplier,
        historyPopulations: newHistory,
      };
    });
    setCanStepBack(engine.canStepBack());
  }, [engine, speedMultiplier]);

  // Initial Seed on mount: Spawn Gosper Glider Gun or primordial soup
  useEffect(() => {
    const gosper = PATTERNS.find((p) => p.id === 'gosper-gun');
    if (gosper) {
      engine.stampPattern(gosper.grid, Math.floor(gridSize.w / 2 - 10), Math.floor(gridSize.h / 2), true);
    } else {
      engine.randomize(0.18);
    }
    triggerRender();
  }, []);

  // Handle Resize of Grid Dimensions
  const handleResizeGrid = (newW: number, newH: number) => {
    setGridSize({ w: newW, h: newH });
    engine.resize(newW, newH);
    triggerRender();
  };

  // Toggle toroidal universe
  const handleToggleToroidal = () => {
    const nextVal = !toroidal;
    setToroidal(nextVal);
    engine.toroidal = nextVal;
  };

  // Rule change
  const handleSelectRule = (rule: RuleSet) => {
    setCurrentRule(rule);
    engine.setRule(rule.birth, rule.survival);
    triggerRender();
  };

  // Simulation execution loop with Fast Forward support
  useEffect(() => {
    if (!isRunning) return;

    let animId: number;
    let lastTime = performance.now();
    let accumulatedTime = 0;
    let frameCount = 0;
    let lastFpsTime = performance.now();

    // Target steps per second
    const stepsPerSecond =
      speedMultiplier === 1 ? 10 :
      speedMultiplier === 2 ? 20 :
      speedMultiplier === 5 ? 50 :
      speedMultiplier === 10 ? 100 :
      speedMultiplier === 20 ? 200 : 300;

    const msPerStep = 1000 / stepsPerSecond;

    const loop = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      accumulatedTime += delta;

      frameCount++;
      if (currentTime - lastFpsTime >= 500) {
        const measuredFps = Math.round((frameCount * 1000) / (currentTime - lastFpsTime));
        setStats((prev) => ({ ...prev, fps: measuredFps }));
        frameCount = 0;
        lastFpsTime = currentTime;
      }

      let stepsExecuted = 0;
      const maxBatch = speedMultiplier >= 20 ? 8 : 4;

      while (accumulatedTime >= msPerStep && stepsExecuted < maxBatch) {
        engine.step();
        accumulatedTime -= msPerStep;
        stepsExecuted++;
      }

      if (accumulatedTime > msPerStep * 2) {
        accumulatedTime = 0;
      }

      if (stepsExecuted > 0) {
        if (soundEnabled && stepsExecuted === 1) {
          soundFX.playGenerationTick(engine.aliveCount);
        }
        triggerRender();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, speedMultiplier, engine, soundEnabled, triggerRender]);

  // Step Controls
  const handleStepForward = useCallback(() => {
    engine.step();
    if (soundEnabled) soundFX.playGenerationTick(engine.aliveCount);
    triggerRender();
  }, [engine, soundEnabled, triggerRender]);

  const handleStepBackward = useCallback(() => {
    const success = engine.stepBack();
    if (success) {
      if (soundEnabled) soundFX.playCellTone(0, false);
      triggerRender();
    }
  }, [engine, soundEnabled, triggerRender]);

  // Sound Toggle
  const handleToggleSound = useCallback(() => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundFX.setEnabled(nextState);
  }, [soundEnabled]);

  // Randomize
  const handleRandomize = useCallback(
    (density: number = 0.22) => {
      engine.randomize(density);
      if (soundEnabled) soundFX.playCellTone(5, true);
      triggerRender();
    },
    [engine, soundEnabled, triggerRender]
  );

  // Clear
  const handleClear = useCallback(() => {
    engine.clear();
    setIsRunning(false);
    if (soundEnabled) soundFX.playClearSound();
    triggerRender();
  }, [engine, soundEnabled, triggerRender]);

  // Reset View / Center
  const handleResetView = useCallback(() => {
    setTransform({
      panX: 0,
      panY: 0,
      zoom: 1.25,
    });
  }, []);

  // Rotate selected pattern
  const handleRotatePattern = useCallback(() => {
    if (!selectedPattern) return;
    const rotated = rotateGrid(selectedPattern.grid);
    setSelectedPattern({ ...selectedPattern, grid: rotated });
  }, [selectedPattern]);

  // Export Canvas Snapshot as PNG
  const handleExportSnapshot = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `conway-simulation-gen-${engine.generation}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export canvas snapshot', err);
    }
  }, [engine.generation]);

  // Fullscreen Toggle
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  }, []);

  // Listen for fullscreen change
  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  // Pattern Selection from Catalog
  const handleSelectPattern = useCallback(
    (pattern: Pattern, mode: 'stamp' | 'center') => {
      if (mode === 'center') {
        engine.stampPattern(
          pattern.grid,
          Math.floor(gridSize.w / 2),
          Math.floor(gridSize.h / 2),
          true
        );
        triggerRender();
      } else {
        setSelectedPattern(pattern);
        setActiveTool('stamp');
      }
    },
    [engine, gridSize, triggerRender]
  );

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsRunning((r) => !r);
          break;
        case 'ArrowRight':
        case 'KeyN':
          e.preventDefault();
          handleStepForward();
          break;
        case 'ArrowLeft':
        case 'KeyB':
          e.preventDefault();
          handleStepBackward();
          break;
        case 'Digit1':
          setSpeedMultiplier(1);
          break;
        case 'Digit2':
          setSpeedMultiplier(2);
          break;
        case 'Digit5':
          setSpeedMultiplier(5);
          break;
        case 'Digit0':
          setSpeedMultiplier(20);
          break;
        case 'KeyD':
          setActiveTool('draw');
          setSelectedPattern(null);
          break;
        case 'KeyE':
          setActiveTool('erase');
          setSelectedPattern(null);
          break;
        case 'KeyH':
          setActiveTool('pan');
          break;
        case 'KeyP':
          setIsPatternCatalogOpen((o) => !o);
          break;
        case 'KeyR':
          handleRotatePattern();
          break;
        case 'KeyS':
          handleRandomize();
          break;
        case 'KeyC':
          handleClear();
          break;
        case 'KeyM':
          handleToggleSound();
          break;
        case 'KeyG':
          setShowGridLines((g) => !g);
          break;
        case 'Home':
          handleResetView();
          break;
        case 'Escape':
          if (selectedPattern) {
            setSelectedPattern(null);
            setActiveTool('draw');
          }
          break;
        case 'Slash':
          if (e.shiftKey) {
            e.preventDefault();
            setIsShortcutsOpen((s) => !s);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleStepForward,
    handleStepBackward,
    handleRotatePattern,
    handleRandomize,
    handleClear,
    handleToggleSound,
    handleResetView,
    selectedPattern,
  ]);

  // Sync Theme CSS variables to DOM root and body
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--sim-bg', theme.bg);
    root.style.setProperty('--sim-surface', theme.panelBg);
    root.style.setProperty('--sim-elevated', theme.elevatedBg || theme.panelBg);
    root.style.setProperty('--sim-accent', theme.accentColor);
    root.style.setProperty('--sim-accent-muted', `${theme.accentColor}26`);
    root.style.setProperty('--sim-glow', theme.glowColor);
    root.style.setProperty('--sim-secondary', theme.secondaryColor || theme.cellOldColor);
    root.style.setProperty('--sim-text-primary', theme.textPrimary || (theme.isLight ? '#0F172A' : '#E8EEE9'));
    root.style.setProperty('--sim-text-secondary', theme.textSecondary || (theme.isLight ? '#64748B' : '#89958C'));
    root.style.setProperty('--sim-border', theme.borderColor || (theme.isLight ? '#CBD5E1' : '#28332C'));
    root.style.setProperty('--sim-border-subtle', theme.borderSubtleColor || (theme.isLight ? '#E2E8F0' : '#1E2822'));

    document.body.style.backgroundColor = theme.bg;
    document.body.style.color = theme.textPrimary || (theme.isLight ? '#0F172A' : '#E8EEE9');
  }, [theme]);

  return (
    <TooltipProvider>
      <div
        className="relative w-screen h-screen overflow-hidden flex flex-col font-sans transition-colors duration-200 select-none bg-sim-bg text-sim-text-primary"
        style={{
          backgroundColor: theme.bg,
          color: theme.textPrimary || (theme.isLight ? '#0F172A' : '#E8EEE9'),
          ['--sim-bg' as string]: theme.bg,
          ['--sim-surface' as string]: theme.panelBg,
          ['--sim-elevated' as string]: theme.elevatedBg || theme.panelBg,
          ['--sim-accent' as string]: theme.accentColor,
          ['--sim-glow' as string]: theme.glowColor,
          ['--sim-border' as string]: theme.borderColor || (theme.isLight ? '#CBD5E1' : '#28332C'),
        }}
      >
        {/* Top Header Bar */}
        <Header
          stats={stats}
          onResetView={handleResetView}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          currentTheme={theme}
          onSelectTheme={setTheme}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          gridWidth={gridSize.w}
          gridHeight={gridSize.h}
          onExportSnapshot={handleExportSnapshot}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          isRunning={isRunning}
        />

        {/* Main Interactive Canvas Area */}
        <main className="relative flex-1 w-full h-full overflow-hidden">
          <GridCanvas
            engine={engine}
            theme={theme}
            cellStyle={cellStyle}
            showGridLines={showGridLines}
            activeTool={activeTool}
            selectedPattern={selectedPattern}
            transform={transform}
            onTransformChange={setTransform}
            onCellModified={triggerRender}
            onPatternPlaced={() => {
              // Placed pattern
            }}
            hoverCoord={hoverCoord}
            setHoverCoord={setHoverCoord}
          />

          {/* Precision Hover Coordinate HUD in bottom right */}
          {hoverCoord && (
            <div className="absolute bottom-4 right-4 pointer-events-none z-20 px-2 py-1 rounded bg-sim-surface/90 border border-sim-border text-[10px] font-mono text-sim-text-secondary flex items-center space-x-2 shadow-sm">
              <span>
                X: <strong className="text-sim-text-primary">{hoverCoord.x}</strong>
              </span>
              <span className="text-sim-border">|</span>
              <span>
                Y: <strong className="text-sim-text-primary">{hoverCoord.y}</strong>
              </span>
              <span className="text-sim-border">|</span>
              <span>
                STATUS:{' '}
                <strong
                  style={{
                    color:
                      engine.getCell(hoverCoord.x, hoverCoord.y) === 1
                        ? theme.cellColor
                        : '#89958C',
                  }}
                >
                  {engine.getCell(hoverCoord.x, hoverCoord.y) === 1 ? 'ALIVE' : 'DEAD'}
                </strong>
              </span>
            </div>
          )}

          {/* Viewport Zoom Indicator in bottom left */}
          <div className="absolute bottom-4 left-4 pointer-events-none z-20 px-2 py-1 rounded bg-sim-surface/90 border border-sim-border text-[10px] font-mono text-sim-text-secondary flex items-center space-x-1.5 shadow-sm">
            <span>ZOOM</span>
            <span className="text-sim-text-primary font-semibold">
              {Math.round(transform.zoom * 100)}%
            </span>
          </div>
        </main>

        {/* Floating Bottom Professional Control Bar */}
        <ControlToolbar
          isRunning={isRunning}
          onTogglePlay={() => setIsRunning((r) => !r)}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          canStepBack={canStepBack}
          speedMultiplier={speedMultiplier}
          onSpeedChange={setSpeedMultiplier}
          activeTool={activeTool}
          onSelectTool={(tool) => {
            setActiveTool(tool);
            if (tool !== 'stamp') setSelectedPattern(null);
          }}
          selectedPattern={selectedPattern}
          onClearSelectedPattern={() => {
            setSelectedPattern(null);
            setActiveTool('draw');
          }}
          onOpenPatternCatalog={() => setIsPatternCatalogOpen(true)}
          onRotatePattern={handleRotatePattern}
          onRandomize={handleRandomize}
          onClear={handleClear}
          theme={theme}
        />

        {/* Pattern Catalog Drawer */}
        <PatternLibraryDrawer
          isOpen={isPatternCatalogOpen}
          onClose={() => setIsPatternCatalogOpen(false)}
          onSelectPattern={handleSelectPattern}
          selectedPattern={selectedPattern}
          theme={theme}
        />

        {/* Simulation Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          cellStyle={cellStyle}
          onSelectCellStyle={setCellStyle}
          toroidal={toroidal}
          onToggleToroidal={handleToggleToroidal}
          showGridLines={showGridLines}
          onToggleGridLines={() => setShowGridLines((g) => !g)}
          gridWidth={gridSize.w}
          gridHeight={gridSize.h}
          onResizeGrid={handleResizeGrid}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          currentRule={currentRule}
          onSelectRule={handleSelectRule}
          theme={theme}
        />

        {/* Rules of Life Educational Modal */}
        <RulesModal
          isOpen={isRulesOpen}
          onClose={() => setIsRulesOpen(false)}
          theme={theme}
        />

        {/* Keyboard Shortcuts Reference Modal */}
        <ShortcutsModal
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
          theme={theme}
        />
      </div>
    </TooltipProvider>
  );
};

export default App;
