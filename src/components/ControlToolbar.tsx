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
  theme,
}) => {
  const dividerStyle = {
    backgroundColor: theme.borderSubtleColor || theme.borderColor || 'rgba(255,255,255,0.1)',
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-30 flex max-w-[calc(100vw-24px)] -translate-x-1/2 flex-col items-center gap-1.5 select-none font-sans">
      {/* Pattern Stamping Context Ribbon */}
      {selectedPattern && (
        <div
          className="flex max-w-full items-center gap-3 border px-3 py-1.5 text-xs shadow-lg animate-fadeIn rounded"
          style={{
            backgroundColor: theme.elevatedBg || theme.panelBg,
            borderColor: theme.accentColor,
            color: theme.textPrimary,
          }}
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full animate-pulse"
            style={{ backgroundColor: theme.accentColor }}
          />

          <span style={{ color: theme.textSecondary }}>Placing</span>
          <span className="max-w-[150px] truncate font-semibold" style={{ color: theme.textPrimary }}>
            {selectedPattern.name}
          </span>

          <div className="h-4 w-px" style={dividerStyle} />

          <Tooltip content="Rotate pattern 90° clockwise" shortcut="R">
            <button
              onClick={onRotatePattern}
              className="flex items-center gap-1.5 font-medium transition-opacity hover:opacity-80"
              style={{ color: theme.accentColor }}
            >
              <RotateCw size={13} />
              <span>Rotate</span>
            </button>
          </Tooltip>

          {onClearSelectedPattern && (
            <Tooltip content="Cancel placement" shortcut="Esc / D">
              <button
                onClick={onClearSelectedPattern}
                aria-label="Cancel pattern placement"
                className="ml-1 transition-colors hover:text-[#E16D6D]"
                style={{ color: theme.textSecondary }}
              >
                <X size={14} />
              </button>
            </Tooltip>
          )}
        </div>
      )}

      {/* Main Control Strip HUD */}
      <div
        className="flex max-w-full items-center gap-1 overflow-x-auto border px-2 py-1.5 shadow-2xl rounded-md transition-colors duration-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          backgroundColor: theme.panelBg,
          borderColor: theme.borderColor,
          color: theme.textPrimary,
        }}
      >
        {/* Playback Controls */}
        <div className="flex shrink-0 items-center">
          <Tooltip content="Step backward 1 generation" shortcut="← or B">
            <button
              onClick={onStepBackward}
              disabled={!canStepBack}
              aria-label="Step backward"
              className="flex h-8 w-8 items-center justify-center rounded transition-colors disabled:cursor-not-allowed disabled:opacity-30 hover:opacity-80"
              style={{ color: theme.textSecondary }}
            >
              <SkipBack size={15} />
            </button>
          </Tooltip>

          {/* Primary Play / Pause Button */}
          <Tooltip content={isRunning ? 'Pause simulation' : 'Start simulation'} shortcut="Space">
            <button
              onClick={onTogglePlay}
              aria-label={isRunning ? 'Pause' : 'Start'}
              className="mx-1 flex h-8 items-center gap-1.5 px-3 rounded text-xs font-semibold tracking-wide shadow-sm transition-transform active:scale-95"
              style={{
                backgroundColor: isRunning ? '#E16D6D' : theme.accentColor,
                color: isRunning ? '#FFFFFF' : (theme.isLight ? '#FFFFFF' : '#0B0F0D'),
              }}
            >
              {isRunning ? (
                <>
                  <Pause size={14} fill="currentColor" />
                  <span className="font-mono text-[11px] tracking-wider uppercase">PAUSE</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" className="ml-0.5" />
                  <span className="font-mono text-[11px] tracking-wider uppercase">RUN</span>
                </>
              )}
            </button>
          </Tooltip>

          <Tooltip content="Step forward 1 generation" shortcut="→ or N">
            <button
              onClick={onStepForward}
              aria-label="Step forward"
              className="flex h-8 w-8 items-center justify-center rounded transition-colors hover:opacity-80"
              style={{ color: theme.textSecondary }}
            >
              <SkipForward size={15} />
            </button>
          </Tooltip>
        </div>

        <div className="mx-1.5 h-6 w-px shrink-0" style={dividerStyle} />

        {/* Speed Selector */}
        <div className="flex shrink-0 items-center gap-0.5">
          {SPEED_PRESETS.map((preset) => {
            const isActive = speedMultiplier === preset.value;
            return (
              <Tooltip key={preset.value} content={preset.title}>
                <button
                  onClick={() => onSpeedChange(preset.value)}
                  className="flex h-7 min-w-[28px] items-center justify-center px-1.5 text-[11px] font-mono rounded transition-colors"
                  style={{
                    backgroundColor: isActive ? theme.accentColor : 'transparent',
                    color: isActive
                      ? (theme.isLight ? '#FFFFFF' : '#0B0F0D')
                      : theme.textSecondary,
                    fontWeight: isActive ? 700 : 400,
                  }}
                >
                  {preset.label}
                </button>
              </Tooltip>
            );
          })}
        </div>

        <div className="mx-1.5 h-6 w-px shrink-0" style={dividerStyle} />

        {/* Tools: Draw, Erase, Pan */}
        <div className="flex shrink-0 items-center gap-0.5">
          <Tooltip content="Draw cells" shortcut="D">
            <button
              onClick={() => onSelectTool('draw')}
              aria-label="Draw"
              className="flex h-8 w-8 items-center justify-center rounded transition-colors"
              style={{
                backgroundColor: activeTool === 'draw' ? (theme.elevatedBg || `${theme.accentColor}25`) : 'transparent',
                color: activeTool === 'draw' ? theme.accentColor : theme.textSecondary,
                borderColor: activeTool === 'draw' ? theme.borderColor : 'transparent',
                borderWidth: 1,
              }}
            >
              <Pencil size={15} />
            </button>
          </Tooltip>

          <Tooltip content="Erase cells" shortcut="E">
            <button
              onClick={() => onSelectTool('erase')}
              aria-label="Erase"
              className="flex h-8 w-8 items-center justify-center rounded transition-colors"
              style={{
                backgroundColor: activeTool === 'erase' ? (theme.elevatedBg || `${theme.accentColor}25`) : 'transparent',
                color: activeTool === 'erase' ? theme.accentColor : theme.textSecondary,
                borderColor: activeTool === 'erase' ? theme.borderColor : 'transparent',
                borderWidth: 1,
              }}
            >
              <Eraser size={15} />
            </button>
          </Tooltip>

          <Tooltip content="Pan canvas" shortcut="H / Shift+Drag">
            <button
              onClick={() => onSelectTool('pan')}
              aria-label="Pan"
              className="flex h-8 w-8 items-center justify-center rounded transition-colors"
              style={{
                backgroundColor: activeTool === 'pan' ? (theme.elevatedBg || `${theme.accentColor}25`) : 'transparent',
                color: activeTool === 'pan' ? theme.accentColor : theme.textSecondary,
                borderColor: activeTool === 'pan' ? theme.borderColor : 'transparent',
                borderWidth: 1,
              }}
            >
              <Hand size={15} />
            </button>
          </Tooltip>
        </div>

        <div className="mx-1.5 h-6 w-px shrink-0" style={dividerStyle} />

        {/* Pattern Catalog Button */}
        <Tooltip content="Pattern Explorer" shortcut="P">
          <button
            onClick={onOpenPatternCatalog}
            className="flex h-8 shrink-0 items-center gap-1.5 px-2.5 rounded text-xs font-medium border transition-colors outline-none"
            style={{
              backgroundColor: theme.elevatedBg || 'transparent',
              borderColor: theme.borderColor,
              color: theme.textPrimary,
            }}
          >
            <Library size={14} style={{ color: theme.accentColor }} />
            <span className="font-sans">Patterns</span>
          </button>
        </Tooltip>

        <div className="mx-1.5 h-6 w-px shrink-0" style={dividerStyle} />

        {/* World Actions: Randomize & Clear */}
        <div className="flex shrink-0 items-center gap-0.5">
          <Tooltip content="Random soup" shortcut="S">
            <button
              onClick={() => onRandomize()}
              aria-label="Randomize"
              className="flex h-8 w-8 items-center justify-center rounded transition-colors hover:opacity-80"
              style={{ color: theme.accentColor }}
            >
              <Sparkles size={15} />
            </button>
          </Tooltip>

          <Tooltip content="Clear universe" shortcut="C">
            <button
              onClick={onClear}
              aria-label="Clear"
              className="flex h-8 w-8 items-center justify-center rounded transition-colors hover:text-[#E16D6D] hover:bg-[#E16D6D]15"
              style={{ color: theme.textSecondary }}
            >
              <Trash2 size={15} />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
