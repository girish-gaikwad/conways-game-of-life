
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
  const isLight = Boolean(theme.isLight);

  const colors = {
    background: theme.panelBg,
    surface: theme.bg,
    border: theme.gridLineColor,
    text: isLight ? '#202820' : '#E5EAE5',
    muted: isLight ? '#69736B' : '#929D95',
    accent: theme.accentColor,
    danger: '#E16D6D',
    primaryText: isLight ? '#FFFFFF' : '#101510',
  };

  const dividerStyle: React.CSSProperties = {
    backgroundColor: colors.border,
  };

  const iconButtonClass =
    'flex h-8 w-8 shrink-0 items-center justify-center transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-30';

  const renderToolButton = (
    tool: ToolType,
    label: string,
    shortcut: string,
    Icon: React.ElementType
  ) => {
    const active = activeTool === tool;

    return (
      <Tooltip content={label} shortcut={shortcut}>
        <button
          type="button"
          onClick={() => onSelectTool(tool)}
          aria-label={label}
          aria-pressed={active}
          className="flex h-8 w-8 items-center justify-center border transition-colors focus-visible:outline-none focus-visible:ring-1"
          style={{
            backgroundColor: active
              ? `${colors.accent}18`
              : 'transparent',
            borderColor: active ? colors.accent : 'transparent',
            color: active ? colors.accent : colors.muted,
          }}
        >
          <Icon size={15} strokeWidth={1.8} />
        </button>
      </Tooltip>
    );
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-30 flex max-w-[calc(100vw-16px)] -translate-x-1/2 flex-col items-center gap-1.5 select-none font-sans">

      {/* Pattern placement context */}
      {selectedPattern && (
        <div
          className="flex max-w-full items-center gap-3 border px-3 py-2 text-xs animate-fadeIn"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.accent,
            color: colors.text,
          }}
        >
          <span
            className="h-1.5 w-1.5 shrink-0"
            style={{ backgroundColor: colors.accent }}
          />

          <span style={{ color: colors.muted }}>
            Placing
          </span>

          <span className="max-w-[150px] truncate font-semibold">
            {selectedPattern.name}
          </span>

          <div className="h-4 w-px" style={dividerStyle} />

          <Tooltip content="Rotate pattern 90° clockwise" shortcut="R">
            <button
              type="button"
              onClick={onRotatePattern}
              className="flex items-center gap-1.5 font-medium transition-opacity hover:opacity-70"
              style={{ color: colors.accent }}
            >
              <RotateCw size={13} />
              <span>Rotate</span>
            </button>
          </Tooltip>

          {onClearSelectedPattern && (
            <Tooltip content="Cancel placement" shortcut="Esc / D">
              <button
                type="button"
                onClick={onClearSelectedPattern}
                aria-label="Cancel pattern placement"
                className="ml-1 transition-colors hover:opacity-60"
                style={{ color: colors.muted }}
              >
                <X size={14} />
              </button>
            </Tooltip>
          )}
        </div>
      )}

      {/* Main control dock */}
      <div
        className="flex max-w-full items-center gap-1 overflow-x-auto border px-2 py-1.5 shadow-xl transition-colors duration-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border,
          color: colors.text,
        }}
      >
        {/* Playback */}
        <div className="flex shrink-0 items-center gap-0.5">
          <Tooltip content="Step backward one generation" shortcut="← or B">
            <button
              type="button"
              onClick={onStepBackward}
              disabled={!canStepBack}
              aria-label="Step backward"
              className={iconButtonClass}
              style={{ color: colors.muted }}
            >
              <SkipBack size={15} />
            </button>
          </Tooltip>

          <Tooltip
            content={isRunning ? 'Pause simulation' : 'Start simulation'}
            shortcut="Space"
          >
            <button
              type="button"
              onClick={onTogglePlay}
              aria-label={isRunning ? 'Pause' : 'Start'}
              aria-pressed={isRunning}
              className="mx-1 flex h-8 items-center gap-1.5 px-3 text-xs font-semibold tracking-wide transition-opacity hover:opacity-85 active:opacity-70"
              style={{
                backgroundColor: isRunning
                  ? colors.danger
                  : colors.accent,
                color: '#FFFFFF',
              }}
            >
              {isRunning ? (
                <>
                  <Pause size={14} fill="currentColor" />
                  <span className="font-mono text-[11px] uppercase tracking-wider">
                    Pause
                  </span>
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" />
                  <span className="font-mono text-[11px] uppercase tracking-wider">
                    Run
                  </span>
                </>
              )}
            </button>
          </Tooltip>

          <Tooltip content="Step forward one generation" shortcut="→ or N">
            <button
              type="button"
              onClick={onStepForward}
              aria-label="Step forward"
              className={iconButtonClass}
              style={{ color: colors.muted }}
            >
              <SkipForward size={15} />
            </button>
          </Tooltip>
        </div>

        <div className="mx-1.5 h-6 w-px shrink-0" style={dividerStyle} />

        {/* Speed presets */}
        <div className="flex shrink-0 items-center gap-0.5">
          {SPEED_PRESETS.map((preset) => {
            const active = speedMultiplier === preset.value;

            return (
              <Tooltip key={preset.value} content={preset.title}>
                <button
                  type="button"
                  onClick={() => onSpeedChange(preset.value)}
                  aria-label={`Set speed to ${preset.label}`}
                  aria-pressed={active}
                  className="flex h-7 min-w-[29px] items-center justify-center px-1.5 font-mono text-[11px] transition-colors"
                  style={{
                    backgroundColor: active
                      ? colors.accent
                      : 'transparent',
                    color: active ? '#FFFFFF' : colors.muted,
                    fontWeight: active ? 700 : 400,
                  }}
                >
                  {preset.label}
                </button>
              </Tooltip>
            );
          })}
        </div>

        <div className="mx-1.5 h-6 w-px shrink-0" style={dividerStyle} />

        {/* Drawing tools */}
        <div className="flex shrink-0 items-center gap-0.5">
          {renderToolButton('draw', 'Draw cells', 'D', Pencil)}
          {renderToolButton('erase', 'Erase cells', 'E', Eraser)}
          {renderToolButton('pan', 'Pan canvas', 'H / Shift+Drag', Hand)}
        </div>

        <div className="mx-1.5 h-6 w-px shrink-0" style={dividerStyle} />

        {/* Pattern explorer */}
        <Tooltip content="Pattern Explorer" shortcut="P">
          <button
            type="button"
            onClick={onOpenPatternCatalog}
            className="flex h-8 shrink-0 items-center gap-1.5 border px-2.5 text-xs font-medium transition-colors hover:opacity-75"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            }}
          >
            <Library size={14} style={{ color: colors.accent }} />
            <span>Patterns</span>
          </button>
        </Tooltip>

        <div className="mx-1.5 h-6 w-px shrink-0" style={dividerStyle} />

        {/* Universe actions */}
        <div className="flex shrink-0 items-center gap-0.5">
          <Tooltip content="Generate random universe" shortcut="S">
            <button
              type="button"
              onClick={() => onRandomize()}
              aria-label="Randomize universe"
              className={iconButtonClass}
              style={{ color: colors.accent }}
            >
              <Sparkles size={15} />
            </button>
          </Tooltip>

          <Tooltip content="Clear entire universe" shortcut="C">
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear universe"
              className={iconButtonClass}
              style={{ color: colors.muted }}
            >
              <Trash2 size={15} />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
