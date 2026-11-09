import React from 'react';
import {
  Volume2,
  VolumeX,
  HelpCircle,
  Keyboard,
  Settings,
  Compass,
  Camera,
  Maximize,
  Minimize,
  ChevronDown,
  Activity,
  Dna,
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { GameStats, Theme } from '../types/game';
import { THEMES } from '../data/themes';
import { Tooltip } from './ui/Tooltip';

interface HeaderProps {
  stats: GameStats;
  onResetView: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentTheme: Theme;
  onSelectTheme: (theme: Theme) => void;
  onOpenRules: () => void;
  onOpenShortcuts: () => void;
  onOpenSettings: () => void;
  gridWidth: number;
  gridHeight: number;
  onExportSnapshot: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  onResetView,
  soundEnabled,
  onToggleSound,
  currentTheme,
  onSelectTheme,
  onOpenRules,
  onOpenShortcuts,
  onOpenSettings,
  gridWidth,
  gridHeight,
  onExportSnapshot,
  isFullscreen,
  onToggleFullscreen,
  isRunning,
}) => {
  const iconButtonClass =
    'flex h-8 w-8 shrink-0 items-center justify-center transition-colors rounded hover:opacity-80 focus-visible:outline-none disabled:opacity-35';

  return (
    <header
      className="relative z-30 flex min-h-[56px] w-full select-none items-center justify-between gap-4 border-b px-4 sm:px-6 transition-colors duration-200"
      style={{
        backgroundColor: currentTheme.panelBg,
        borderColor: currentTheme.borderColor || '#28332C',
        color: currentTheme.textPrimary || '#E8EEE9',
      }}
    >
      {/* Brand / Title */}
      <div className="flex min-w-[180px] shrink-0 items-center gap-2.5">
        <div className="relative">
          <Dna
            className="h-5 w-5"
            style={{ color: currentTheme.accentColor }}
            strokeWidth={1.7}
          />
          {isRunning && (
            <span
              className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full animate-ping"
              style={{ backgroundColor: currentTheme.accentColor }}
            />
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-[13px] font-semibold tracking-[0.12em] font-mono uppercase"
              style={{ color: currentTheme.textPrimary }}
            >
              CONWAY
            </span>
            <span
              className="text-[10px] font-medium tracking-wide font-mono"
              style={{ color: currentTheme.accentColor }}
            >
              / LAB
            </span>
          </div>
          <span
            className="text-[10px] font-mono tracking-tight"
            style={{ color: currentTheme.textSecondary }}
          >
            Cellular automata
          </span>
        </div>
      </div>

      {/* Simulation Telemetry & Statistics */}
      <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
        <div className="flex items-center space-x-4 font-mono">
          {/* Generation */}
          <div className="flex flex-col justify-center">
            <span
              className="text-[9px] font-medium uppercase tracking-[0.09em]"
              style={{ color: currentTheme.textSecondary }}
            >
              Generation
            </span>
            <span
              className="text-[13px] font-medium tabular-nums"
              style={{ color: currentTheme.textPrimary }}
            >
              {stats.generation.toLocaleString()}
            </span>
          </div>

          <div
            className="h-5 w-px shrink-0"
            style={{ backgroundColor: currentTheme.borderSubtleColor || currentTheme.borderColor }}
          />

          {/* Population */}
          <div className="flex flex-col justify-center">
            <span
              className="text-[9px] font-medium uppercase tracking-[0.09em]"
              style={{ color: currentTheme.textSecondary }}
            >
              Population
            </span>
            <span
              className="text-[13px] font-medium tabular-nums"
              style={{ color: currentTheme.accentColor }}
            >
              {stats.aliveCount.toLocaleString()}
            </span>
          </div>

          <div
            className="h-5 w-px shrink-0"
            style={{ backgroundColor: currentTheme.borderSubtleColor || currentTheme.borderColor }}
          />

          {/* Dynamics */}
          <div className="flex flex-col justify-center">
            <span
              className="text-[9px] font-medium uppercase tracking-[0.09em]"
              style={{ color: currentTheme.textSecondary }}
            >
              Births / Deaths
            </span>
            <span className="text-[13px] font-medium tabular-nums flex items-center space-x-1">
              <span style={{ color: currentTheme.accentColor }}>+{stats.births}</span>
              <span style={{ color: currentTheme.textSecondary }}>/</span>
              <span className="text-[#E16D6D]">−{stats.deaths}</span>
            </span>
          </div>

          <div
            className="h-5 w-px shrink-0 hidden 2xl:block"
            style={{ backgroundColor: currentTheme.borderSubtleColor || currentTheme.borderColor }}
          />

          {/* Density */}
          <div className="hidden 2xl:flex flex-col justify-center">
            <span
              className="text-[9px] font-medium uppercase tracking-[0.09em]"
              style={{ color: currentTheme.textSecondary }}
            >
              Density
            </span>
            <span
              className="text-[13px] font-medium tabular-nums"
              style={{ color: currentTheme.textPrimary }}
            >
              {stats.density.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Top Right Actions */}
      <div className="flex shrink-0 items-center gap-1">
        <div
          className="mr-2 hidden items-center gap-1.5 border-r pr-3 text-[10px] font-mono xl:flex"
          style={{
            borderColor: currentTheme.borderSubtleColor || currentTheme.borderColor,
            color: currentTheme.textSecondary,
          }}
        >
          <Activity className="h-3 w-3" style={{ color: currentTheme.accentColor }} />
          <span>
            {gridWidth} × {gridHeight}
          </span>
        </div>

        {/* Theme Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              title="Change theme"
              className="flex h-8 max-w-[145px] items-center gap-1.5 px-2 text-[11px] font-medium rounded border transition-colors outline-none"
              style={{
                backgroundColor: currentTheme.elevatedBg || currentTheme.panelBg,
                borderColor: currentTheme.borderColor,
                color: currentTheme.textPrimary,
              }}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/20"
                style={{ backgroundColor: currentTheme.cellColor }}
              />
              <span className="hidden truncate sm:inline">{currentTheme.name}</span>
              <ChevronDown className="h-3 w-3 shrink-0 opacity-70" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={6}
              className="z-50 min-w-[200px] border p-1 shadow-2xl rounded-md animate-fadeIn outline-none font-sans"
              style={{
                backgroundColor: currentTheme.panelBg,
                borderColor: currentTheme.borderColor,
                color: currentTheme.textPrimary,
              }}
            >
              <div
                className="px-2.5 py-1.5 text-[10px] uppercase font-mono tracking-wider"
                style={{ color: currentTheme.textSecondary }}
              >
                Simulation Themes
              </div>

              {THEMES.map((t) => {
                const isActive = currentTheme.id === t.id;
                return (
                  <DropdownMenu.Item
                    key={t.id}
                    onSelect={() => onSelectTheme(t)}
                    className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2 text-xs rounded transition-colors outline-none"
                    style={{
                      backgroundColor: isActive ? currentTheme.elevatedBg : 'transparent',
                      color: isActive ? currentTheme.accentColor : currentTheme.textPrimary,
                    }}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-black/30 shrink-0"
                      style={{ backgroundColor: t.cellColor }}
                    />
                    <span className="font-medium">{t.name}</span>
                    {isActive && (
                      <span className="ml-auto font-bold" style={{ color: currentTheme.accentColor }}>
                        ✓
                      </span>
                    )}
                  </DropdownMenu.Item>
                );
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <div
          className="mx-1 h-5 w-px"
          style={{ backgroundColor: currentTheme.borderSubtleColor || currentTheme.borderColor }}
        />

        {/* Center View */}
        <Tooltip content="Center viewport" shortcut="Home">
          <button
            onClick={onResetView}
            className={iconButtonClass}
            style={{ color: currentTheme.textSecondary }}
            aria-label="Center viewport"
          >
            <Compass size={16} strokeWidth={1.7} />
          </button>
        </Tooltip>

        {/* Export Snapshot */}
        <Tooltip content="Export snapshot PNG">
          <button
            onClick={onExportSnapshot}
            className={iconButtonClass}
            style={{ color: currentTheme.textSecondary }}
            aria-label="Export snapshot"
          >
            <Camera size={16} strokeWidth={1.7} />
          </button>
        </Tooltip>

        {/* Audio Toggle */}
        <Tooltip content={soundEnabled ? 'Mute audio' : 'Enable ambient audio'} shortcut="M">
          <button
            onClick={onToggleSound}
            className={iconButtonClass}
            style={{
              color: soundEnabled ? currentTheme.accentColor : currentTheme.textSecondary,
              backgroundColor: soundEnabled ? `${currentTheme.accentColor}20` : 'transparent',
            }}
            aria-label="Toggle audio"
          >
            {soundEnabled ? (
              <Volume2 size={16} strokeWidth={1.7} />
            ) : (
              <VolumeX size={16} strokeWidth={1.7} />
            )}
          </button>
        </Tooltip>

        {/* Fullscreen Toggle */}
        <Tooltip content={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
          <button
            onClick={onToggleFullscreen}
            className={`${iconButtonClass} hidden sm:flex`}
            style={{ color: currentTheme.textSecondary }}
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? (
              <Minimize size={16} strokeWidth={1.7} />
            ) : (
              <Maximize size={16} strokeWidth={1.7} />
            )}
          </button>
        </Tooltip>

        {/* Shortcuts Reference */}
        <Tooltip content="Keyboard shortcuts" shortcut="?">
          <button
            onClick={onOpenShortcuts}
            className={iconButtonClass}
            style={{ color: currentTheme.textSecondary }}
            aria-label="Keyboard shortcuts"
          >
            <Keyboard size={16} strokeWidth={1.7} />
          </button>
        </Tooltip>

        {/* Rules Guide */}
        <Tooltip content="Rules of Life">
          <button
            onClick={onOpenRules}
            className={iconButtonClass}
            style={{ color: currentTheme.textSecondary }}
            aria-label="Rules of Life"
          >
            <HelpCircle size={16} strokeWidth={1.7} />
          </button>
        </Tooltip>

        {/* Settings Dialog */}
        <Tooltip content="Simulation settings">
          <button
            onClick={onOpenSettings}
            className={iconButtonClass}
            style={{ color: currentTheme.textSecondary }}
            aria-label="Simulation settings"
          >
            <Settings size={16} strokeWidth={1.7} />
          </button>
        </Tooltip>
      </div>
    </header>
  );
};
