
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

const divider = 'mx-1.5 h-6 w-px shrink-0 bg-white/[0.10]';

const toolButton =
  'flex h-8 w-8 items-center justify-center text-[#929D94] transition-colors hover:bg-white/[0.06] hover:text-[#E5EBE5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A6D96A]';

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
    <div className="fixed bottom-4 left-1/2 z-30 flex max-w-[calc(100vw-24px)] -translate-x-1/2 flex-col items-center gap-1.5 select-none">
      {/* Pattern placement context */}
      {selectedPattern && (
        <div className="flex max-w-full items-center gap-3 border border-[#394332] bg-[#141914] px-3 py-2 text-xs shadow-lg shadow-black/20 animate-fadeIn">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#A6D96A]" />

          <span className="text-[#89958C]">Placing</span>
          <span className="max-w-[150px] truncate font-medium text-[#E2E9E1]">
            {selectedPattern.name}
          </span>

          <div className="h-4 w-px bg-white/[0.12]" />

          <Tooltip content="Rotate pattern 90° clockwise" shortcut="R">
            <button
              onClick={onRotatePattern}
              className="flex items-center gap-1.5 text-[#A6D96A] transition-colors hover:text-[#D0EBAA]"
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
                className="ml-1 text-[#89958C] transition-colors hover:text-[#E17C7C]"
              >
                <X size={14} />
              </button>
            </Tooltip>
          )}
        </div>
      )}

      {/* Main control strip */}
      <div className="flex max-w-full items-center gap-1 overflow-x-auto border border-[#303830] bg-[#101511] px-2 py-1.5 shadow-2xl shadow-black/35 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Playback */}
        <div className="flex shrink-0 items-center">
          <Tooltip content="Step backward 1 generation" shortcut="← or B">
            <button
              onClick={onStepBackward}
              disabled={!canStepBack}
              aria-label="Step backward"
              className={`${toolButton} disabled:cursor-not-allowed disabled:opacity-30`}
            >
              <SkipBack size={15} />
            </button>
          </Tooltip>

          <Tooltip content={isRunning ? 'Pause simulation' : 'Start simulation'} shortcut="Space">
            <button
              onClick={onTogglePlay}
              aria-label={isRunning ? 'Pause simulation' : 'Start simulation'}
              className={`mx-1 flex h-8 min-w-[76px] items-center justify-center gap-2 px-3 text-[11px] font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A6D96A] ${
                isRunning
                  ? 'bg-[#A6D96A] text-[#11170E] hover:bg-[#B9E58B]'
                  : 'bg-[#252D24] text-[#DCE8D4] hover:bg-[#303B2D]'
              }`}
            >
              {isRunning
                ? <Pause size={14} fill="currentColor" />
                : <Play size={14} fill="currentColor" />}
              {isRunning ? 'PAUSE' : 'RUN'}
            </button>
          </Tooltip>

          <Tooltip content="Step forward 1 generation" shortcut="→ or N">
            <button
              onClick={onStepForward}
              aria-label="Step forward"
              className={toolButton}
            >
              <SkipForward size={15} />
            </button>
          </Tooltip>
        </div>

        <div className={divider} />

        {/* Simulation speed */}
        <div className="flex shrink-0 items-center gap-0.5">
          {SPEED_PRESETS.map((preset) => {
            const isActive = speedMultiplier === preset.value;

            return (
              <Tooltip key={preset.value} content={preset.title}>
                <button
                  onClick={() => onSpeedChange(preset.value)}
                  aria-label={`Set speed to ${preset.label}`}
                  aria-pressed={isActive}
                  className={`flex h-7 min-w-[27px] items-center justify-center px-1.5 font-mono text-[10px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A6D96A] ${
                    isActive
                      ? 'bg-[#293522] text-[#B9E58B]'
                      : 'text-[#849087] hover:bg-white/[0.05] hover:text-[#E3E9E3]'
                  }`}
                >
                  {preset.label}
                </button>
              </Tooltip>
            );
          })}
        </div>

        <div className={divider} />

        {/* Editing tools */}
        <div className="flex shrink-0 items-center">
          <Tooltip content="Draw cells" shortcut="D">
            <button
              onClick={() => onSelectTool('draw')}
              aria-label="Draw cells"
              aria-pressed={activeTool === 'draw'}
              className={`${toolButton} ${
                activeTool === 'draw' ? 'bg-[#293522] text-[#B9E58B]' : ''
              }`}
            >
              <Pencil size={15} />
            </button>
          </Tooltip>

          <Tooltip content="Erase cells" shortcut="E">
            <button
              onClick={() => onSelectTool('erase')}
              aria-label="Erase cells"
              aria-pressed={activeTool === 'erase'}
              className={`${toolButton} ${
                activeTool === 'erase' ? 'bg-[#293522] text-[#B9E58B]' : ''
              }`}
            >
              <Eraser size={15} />
            </button>
          </Tooltip>

          <Tooltip content="Pan canvas" shortcut="H / Shift+Drag">
            <button
              onClick={() => onSelectTool('pan')}
              aria-label="Pan canvas"
              aria-pressed={activeTool === 'pan'}
              className={`${toolButton} ${
                activeTool === 'pan' ? 'bg-[#293522] text-[#B9E58B]' : ''
              }`}
            >
              <Hand size={15} />
            </button>
          </Tooltip>
        </div>

        <div className={divider} />

        {/* Pattern library */}
        <Tooltip content="Open pattern library" shortcut="P">
          <button
            onClick={onOpenPatternCatalog}
            className="flex h-8 shrink-0 items-center gap-2 px-2 text-[11px] text-[#C2CCC3] transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A6D96A]"
          >
            <Library size={15} className="text-[#A6D96A]" />
            <span>Patterns</span>
          </button>
        </Tooltip>

        <div className={divider} />

        {/* World actions */}
        <Tooltip content="Randomize grid" shortcut="S">
          <button
            onClick={() => onRandomize()}
            className="flex h-8 shrink-0 items-center gap-1.5 px-2 text-[11px] text-[#929D94] transition-colors hover:bg-white/[0.06] hover:text-[#E5EBE5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A6D96A]"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">Random</span>
          </button>
        </Tooltip>

        <Tooltip content="Clear entire grid" shortcut="C">
          <button
            onClick={onClear}
            aria-label="Clear entire grid"
            className="flex h-8 w-8 shrink-0 items-center justify-center text-[#89958C] transition-colors hover:bg-[#4A2925]/40 hover:text-[#E17C7C] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E17C7C]"
          >
            <Trash2 size={14} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
