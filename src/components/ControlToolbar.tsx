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
  FastForward,
  Library,
  RotateCw,
} from 'lucide-react';
import { Pattern, Theme, ToolType } from '../types/game';

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
  onOpenPatternCatalog: () => void;
  onRotatePattern: () => void;
  onRandomize: (density?: number) => void;
  onClear: () => void;
  theme: Theme;
}

const SPEED_PRESETS = [
  { label: '1×', value: 1, title: 'Standard (10 gen/s)' },
  { label: '2×', value: 2, title: '2× Speed (20 gen/s)' },
  { label: '5×', value: 5, title: '5× Fast Forward (50 gen/s)' },
  { label: '10×', value: 10, title: '10× Warp Speed (100 gen/s)' },
  { label: '20×', value: 20, title: '20× Hyper Speed (200 gen/s)' },
  { label: 'MAX', value: 60, title: 'Max Frame Rate (~60+ gen/s)' },
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
  onOpenPatternCatalog,
  onRotatePattern,
  onRandomize,
  onClear,
  theme,
}) => {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 max-w-[96vw] flex flex-col items-center gap-2 select-none">
      {/* Pattern Stamp Quick Ribbon if stamp mode is selected */}
      {selectedPattern && (
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full glass-panel shadow-lg border border-white/10 text-xs text-white/90 animate-fadeIn">
          <span className="text-white/50">Stamping:</span>
          <span className="font-semibold text-white">{selectedPattern.name}</span>
          <button
            onClick={onRotatePattern}
            title="Rotate Pattern 90° (R)"
            className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center space-x-1"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">Rotate (R)</span>
          </button>
        </div>
      )}

      {/* Main Glass HUD Bar */}
      <div className="flex items-center flex-wrap justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl glass-panel shadow-hud border border-white/15">
        {/* Step Back (Undo Gen) */}
        <button
          onClick={onStepBackward}
          disabled={!canStepBack}
          title="Step Backward (B / ←)"
          className={`p-2 rounded-xl transition-all ${
            canStepBack
              ? 'bg-white/[0.06] hover:bg-white/[0.14] text-white/80 hover:text-white'
              : 'text-white/20 cursor-not-allowed'
          }`}
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Primary Play / Pause Button */}
        <button
          onClick={onTogglePlay}
          title={isRunning ? 'Pause Simulation (Space)' : 'Start Simulation (Space)'}
          className="relative px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center space-x-2 shadow-lg transition-all duration-200 transform active:scale-95 group"
          style={{
            backgroundColor: isRunning ? '#ef4444' : theme.accentColor,
            color: '#ffffff',
            boxShadow: isRunning
              ? '0 0 20px rgba(239, 68, 68, 0.4)'
              : `0 0 20px ${theme.glowColor}`,
          }}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-white text-white" />
              <span className="font-semibold tracking-wide">PAUSE</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
              <span className="font-semibold tracking-wide">SIMULATE</span>
            </>
          )}
        </button>

        {/* Step Forward */}
        <button
          onClick={onStepForward}
          title="Step Forward 1 Gen (N / →)"
          className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] text-white/80 hover:text-white transition-all"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Speed / Fast Forward Dropdown / Pills */}
        <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/5 space-x-1">
          <FastForward className="w-3.5 h-3.5 text-white/40 ml-1.5 mr-0.5" />
          {SPEED_PRESETS.map((preset) => {
            const isActive = speedMultiplier === preset.value;
            return (
              <button
                key={preset.value}
                onClick={() => onSpeedChange(preset.value)}
                title={preset.title}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'text-white font-bold shadow-sm'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: isActive ? theme.accentColor : 'transparent',
                  color: isActive ? (theme.isLight ? '#ffffff' : '#0a0f14') : undefined,
                }}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

        {/* Tool Mode Buttons */}
        <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/5 space-x-1">
          <button
            onClick={() => onSelectTool('draw')}
            title="Draw Mode (D)"
            className={`p-2 rounded-lg text-xs transition-colors ${
              activeTool === 'draw'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-white/50 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectTool('erase')}
            title="Eraser Mode (E)"
            className={`p-2 rounded-lg text-xs transition-colors ${
              activeTool === 'erase'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-white/50 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            <Eraser className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectTool('pan')}
            title="Pan / Move Canvas (H)"
            className={`p-2 rounded-lg text-xs transition-colors ${
              activeTool === 'pan'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-white/50 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            <Hand className="w-4 h-4" />
          </button>
        </div>

        {/* Pattern Library Trigger */}
        <button
          onClick={onOpenPatternCatalog}
          title="Open Pattern Catalog (P)"
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-xs font-medium text-white/90 hover:text-white transition-colors"
        >
          <Library className="w-4 h-4 text-emerald-400" />
          <span className="hidden md:inline">Patterns</span>
        </button>

        <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

        {/* Random Soup (Spawn Life) */}
        <button
          onClick={() => onRandomize()}
          title="Random Soup of Life (S)"
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-xs font-medium text-white/80 hover:text-white transition-colors flex items-center space-x-1.5"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="hidden lg:inline">Random</span>
        </button>

        {/* Clear Canvas */}
        <button
          onClick={onClear}
          title="Clear Universe (C)"
          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
