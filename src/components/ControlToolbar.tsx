import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Pencil,
  Eraser,
  Hand,
  Sparkles,
  Trash2,
  Library,
  RotateCw,
  X,
} from 'lucide-react';
import { Pattern, Theme, ToolType } from '../types/game';
import { Tooltip } from './ui/Tooltip';

interface ControlToolbarProps {
  isRunning: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  canStepBack: boolean;
  speedMultiplier: number;
  onSpeedChange: (speed: number) => void;
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  selectedPattern: Pattern | null;
  onClearSelectedPattern?: () => void;
  onOpenPatternCatalog: () => void;
  onRotatePattern: () => void;
  onRandomize: (density?: number) => void;
  onClear: () => void;
  theme: Theme;
}

const SPEED_PRESETS = [
  { label: '1×', value: 1, title: '10 gen/s' },
  { label: '2×', value: 2, title: '20 gen/s' },
  { label: '5×', value: 5, title: '50 gen/s' },
  { label: '10×', value: 10, title: '100 gen/s' },
  { label: '20×', value: 20, title: '200 gen/s' },
  { label: 'MAX', value: 60, title: 'Uncapped (~300+ gen/s)' },
];

export const ControlToolbar: React.FC<ControlToolbarProps> = ({
  isRunning,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  canStepBack,
  speedMultiplier,
  onSpeedChange,
  activeTool,
  onSelectTool,
  selectedPattern,
  onClearSelectedPattern,
  onOpenPatternCatalog,
  onRotatePattern,
  onRandomize,
  onClear,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 select-none max-w-[98vw]">
      {/* Pattern Stamping Mode Context Ribbon */}
      {selectedPattern && (
        <div className="flex items-center space-x-2 px-2.5 py-1 rounded bg-sim-elevated border border-sim-accent/40 shadow-hud text-xs text-sim-text-primary animate-fadeIn">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sim-accent animate-pulse" />
            <span className="text-sim-text-secondary text-[11px] font-mono">STAMP:</span>
            <span className="font-medium text-sim-text-primary text-xs">{selectedPattern.name}</span>
          </div>
          <div className="h-3 w-px bg-sim-border" />
          <Tooltip content="Rotate pattern 90° clockwise" shortcut="R">
            <button
              onClick={onRotatePattern}
              className="px-1.5 py-0.5 rounded text-[11px] font-mono text-sim-text-secondary hover:text-sim-text-primary hover:bg-sim-hover transition-colors flex items-center space-x-1"
            >
              <RotateCw className="w-3 h-3 text-sim-accent" />
              <span>Rotate</span>
            </button>
          </Tooltip>
          {onClearSelectedPattern && (
            <Tooltip content="Cancel stamp mode" shortcut="Esc / D">
              <button
                onClick={onClearSelectedPattern}
                className="p-0.5 rounded text-sim-text-secondary hover:text-sim-danger hover:bg-sim-danger-muted transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          )}
        </div>
      )}

      {/* Main Professional HUD Toolbar */}
      <div className="flex items-center flex-wrap justify-center gap-1 bg-sim-surface border border-sim-border rounded-lg shadow-hud px-1.5 py-1.5">
        {/* GROUP 1: PLAYBACK CONTROLS */}
        <div className="flex items-center space-x-0.5 bg-sim-elevated/60 p-0.5 rounded border border-sim-border-subtle">
          <Tooltip content="Step backward 1 generation" shortcut="← or B">
            <button
              onClick={onStepBackward}
              disabled={!canStepBack}
              className={`p-1.5 rounded text-xs transition-colors ${
                canStepBack
                  ? 'text-sim-text-secondary hover:text-sim-text-primary hover:bg-sim-hover active:bg-sim-elevated'
                  : 'text-sim-text-muted/40 cursor-not-allowed'
              }`}
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
          </Tooltip>

          {/* Primary Action: Play/Pause */}
          <Tooltip content={isRunning ? 'Pause simulation' : 'Start simulation'} shortcut="Space">
            <button
              onClick={onTogglePlay}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-semibold tracking-wide transition-all ${
                isRunning
                  ? 'bg-sim-accent text-sim-bg hover:opacity-90 shadow-sm'
                  : 'bg-sim-elevated text-sim-text-primary hover:bg-sim-hover border border-sim-border'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span className="font-mono text-[11px] tracking-wider uppercase">PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-sim-accent ml-0.5" />
                  <span className="font-mono text-[11px] tracking-wider uppercase">RUN</span>
                </>
              )}
            </button>
          </Tooltip>

          <Tooltip content="Step forward 1 generation" shortcut="→ or N">
            <button
              onClick={onStepForward}
              className="p-1.5 rounded text-xs text-sim-text-secondary hover:text-sim-text-primary hover:bg-sim-hover active:bg-sim-elevated transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>

        <div className="h-4 w-px bg-sim-border mx-0.5 hidden sm:block" />

        {/* GROUP 2: SPEED CONTROLS */}
        <div className="flex items-center bg-sim-elevated/60 p-0.5 rounded border border-sim-border-subtle space-x-0.5">
          {SPEED_PRESETS.map((preset) => {
            const isActive = speedMultiplier === preset.value;
            return (
              <Tooltip key={preset.value} content={preset.title}>
                <button
                  onClick={() => onSpeedChange(preset.value)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    isActive
                      ? 'bg-sim-accent text-sim-bg font-bold shadow-sm'
                      : 'text-sim-text-secondary hover:text-sim-text-primary hover:bg-sim-hover'
                  }`}
                >
                  {preset.label}
                </button>
              </Tooltip>
            );
          })}
        </div>

        <div className="h-4 w-px bg-sim-border mx-0.5 hidden sm:block" />

        {/* GROUP 3: TOOLS (Draw, Erase, Pan) */}
        <div className="flex items-center bg-sim-elevated/60 p-0.5 rounded border border-sim-border-subtle space-x-0.5">
          <Tooltip content="Draw cells" shortcut="D">
            <button
              onClick={() => onSelectTool('draw')}
              className={`p-1.5 rounded transition-colors ${
                activeTool === 'draw'
                  ? 'bg-sim-hover text-sim-accent border border-sim-border'
                  : 'text-sim-text-secondary hover:text-sim-text-primary hover:bg-sim-hover'
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </Tooltip>

          <Tooltip content="Erase cells" shortcut="E">
            <button
              onClick={() => onSelectTool('erase')}
              className={`p-1.5 rounded transition-colors ${
                activeTool === 'erase'
                  ? 'bg-sim-hover text-sim-accent border border-sim-border'
                  : 'text-sim-text-secondary hover:text-sim-text-primary hover:bg-sim-hover'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
          </Tooltip>

          <Tooltip content="Pan canvas" shortcut="H / Shift+Drag">
            <button
              onClick={() => onSelectTool('pan')}
              className={`p-1.5 rounded transition-colors ${
                activeTool === 'pan'
                  ? 'bg-sim-hover text-sim-accent border border-sim-border'
                  : 'text-sim-text-secondary hover:text-sim-text-primary hover:bg-sim-hover'
              }`}
            >
              <Hand className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>

        <div className="h-4 w-px bg-sim-border mx-0.5 hidden sm:block" />

        {/* GROUP 4: PATTERN EXPLORER */}
        <Tooltip content="Pattern Explorer library" shortcut="P">
          <button
            onClick={onOpenPatternCatalog}
            className="flex items-center space-x-1.5 px-2 py-1 rounded bg-sim-elevated hover:bg-sim-hover text-sim-text-primary border border-sim-border text-xs font-medium transition-colors"
          >
            <Library className="w-3.5 h-3.5 text-sim-secondary" />
            <span className="text-[11px] font-sans">Patterns</span>
          </button>
        </Tooltip>

        <div className="h-4 w-px bg-sim-border mx-0.5 hidden sm:block" />

        {/* GROUP 5: WORLD ACTIONS (Randomize, Clear) */}
        <div className="flex items-center space-x-1">
          <Tooltip content="Random primordial soup" shortcut="S">
            <button
              onClick={() => onRandomize()}
              className="flex items-center space-x-1 px-2 py-1 rounded bg-sim-elevated hover:bg-sim-hover text-sim-text-secondary hover:text-sim-text-primary border border-sim-border text-xs transition-colors"
            >
              <Sparkles className="w-3 h-3 text-sim-accent" />
              <span className="text-[11px] hidden md:inline">Random</span>
            </button>
          </Tooltip>

          <Tooltip content="Clear entire grid" shortcut="C">
            <button
              onClick={onClear}
              className="p-1 rounded text-sim-text-muted hover:text-sim-danger hover:bg-sim-danger-muted border border-transparent hover:border-sim-danger/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
