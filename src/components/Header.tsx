
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
  const isLight = Boolean(currentTheme.isLight);

  const colors = {
    background: currentTheme.panelBg,
    surface: currentTheme.bg,
    border: currentTheme.gridLineColor,
    text: isLight ? '#202820' : '#E5EAE5',
    muted: isLight ? '#69736B' : '#929D95',
    accent: currentTheme.accentColor,
    danger: '#E16D6D',
  };

  const iconButtonClass =
    'flex h-8 w-8 shrink-0 items-center justify-center transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 disabled:opacity-35';

  const divider = (
    <div
      className="mx-1 h-5 w-px shrink-0"
      style={{ backgroundColor: colors.border }}
    />
  );

  const renderStat = (
    label: string,
    value: React.ReactNode,
    valueColor: string = colors.text
  ) => (
    <div className="flex flex-col justify-center">
      <span
        className="text-[9px] font-medium uppercase tracking-wider"
        style={{ color: colors.muted }}
      >
        {label}
      </span>
      <span
        className="text-[13px] font-medium tabular-nums font-mono"
        style={{ color: valueColor }}
      >
        {value}
      </span>
    </div>
  );

  return (
    <header
      className="relative z-30 flex min-h-[56px] w-full select-none items-center justify-between gap-3 border-b px-3 sm:px-5 transition-colors duration-200"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        color: colors.text,
      }}
    >
      {/* Brand */}
      <div className="flex min-w-0 shrink-0 items-center gap-2.5">
        <div className="relative flex items-center justify-center">
          <Dna
            className="h-5 w-5"
            style={{ color: colors.accent }}
            strokeWidth={1.7}
          />

          {isRunning && (
            <span
              className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: colors.accent,
                boxShadow: `0 0 0 2px ${colors.background}`,
              }}
            />
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-mono text-[13px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: colors.text }}
            >
              CONWAY
            </span>
            <span
              className="font-mono text-[10px] font-medium tracking-wide"
              style={{ color: colors.accent }}
            >
              / LAB
            </span>
          </div>

          <span
            className="hidden text-[10px] font-mono tracking-tight sm:block"
            style={{ color: colors.muted }}
          >
            Cellular automata
          </span>
        </div>
      </div>

      {/* Simulation Statistics */}
      <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
        <div className="flex items-center gap-4 font-mono">
          {renderStat(
            'Generation',
            stats.generation.toLocaleString()
          )}

          {divider}

          {renderStat(
            'Population',
            stats.aliveCount.toLocaleString(),
            colors.accent
          )}

          {divider}

          {renderStat(
            'Births / Deaths',
            <span className="flex items-center gap-1">
              <span style={{ color: colors.accent }}>
                +{stats.births}
              </span>
              <span style={{ color: colors.muted }}>/</span>
              <span style={{ color: colors.danger }}>
                −{stats.deaths}
              </span>
            </span>
          )}

          <div className="hidden 2xl:block">{divider}</div>

          <div className="hidden 2xl:block">
            {renderStat('Density', `${stats.density.toFixed(1)}%`)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-0.5">
        {/* Grid dimensions */}
        <div
          className="mr-2 hidden items-center gap-1.5 border-r pr-3 text-[10px] font-mono xl:flex"
          style={{
            borderColor: colors.border,
            color: colors.muted,
          }}
        >
          <Activity
            className="h-3 w-3"
            style={{ color: colors.accent }}
          />
          <span>
            {gridWidth} × {gridHeight}
          </span>
        </div>

        {/* Theme selector */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              title="Change theme"
              className="flex h-8 max-w-[145px] items-center gap-2 border px-2 text-[11px] font-medium transition-colors outline-none hover:opacity-80 focus-visible:ring-1"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
                outlineColor: colors.accent,
              }}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: currentTheme.cellColor }}
              />

              <span className="hidden truncate sm:inline">
                {currentTheme.name}
              </span>

              <ChevronDown
                className="h-3 w-3 shrink-0"
                style={{ color: colors.muted }}
              />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={6}
              className="z-50 min-w-[205px] border p-1 shadow-xl outline-none"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              <div
                className="border-b px-2.5 py-2 font-mono text-[10px] uppercase tracking-wider"
                style={{
                  color: colors.muted,
                  borderColor: colors.border,
                }}
              >
                Appearance
              </div>

              {THEMES.map((theme) => {
                const isActive = currentTheme.id === theme.id;

                return (
                  <DropdownMenu.Item
                    key={theme.id}
                    onSelect={() => onSelectTheme(theme)}
                    className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2.5 text-xs outline-none transition-colors focus:opacity-75"
                    style={{
                      backgroundColor: isActive
                        ? `${colors.accent}15`
                        : 'transparent',
                      color: isActive ? colors.accent : colors.text,
                    }}
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full border"
                      style={{
                        backgroundColor: theme.cellColor,
                        borderColor: colors.border,
                      }}
                    />

                    <span className="font-medium">
                      {theme.name}
                    </span>

                    {isActive && (
                      <span className="ml-auto text-xs font-semibold">
                        ✓
                      </span>
                    )}
                  </DropdownMenu.Item>
                );
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {divider}

        {/* Center viewport */}
        <Tooltip content="Center viewport" shortcut="Home">
          <button
            type="button"
            onClick={onResetView}
            className={iconButtonClass}
            style={{ color: colors.muted }}
            aria-label="Center viewport"
          >
            <Compass size={16} strokeWidth={1.7} />
          </button>
        </Tooltip>

        {/* Export */}
        <Tooltip content="Export snapshot PNG">
          <button
            type="button"
            onClick={onExportSnapshot}
            className={iconButtonClass}
            style={{ color: colors.muted }}
            aria-label="Export snapshot"
          >
            <Camera size={16} strokeWidth={1.7} />
          </button>
        </Tooltip>

        {/* Audio */}
        <Tooltip
          content={soundEnabled ? 'Mute audio' : 'Enable ambient audio'}
          shortcut="M"
        >
          <button
            type="button"
            onClick={onToggleSound}
            className={iconButtonClass}
            style={{
              color: soundEnabled ? colors.accent : colors.muted,
              backgroundColor: soundEnabled
                ? `${colors.accent}15`
                : 'transparent',
            }}
            aria-label="Toggle audio"
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? (
              <Volume2 size={16} strokeWidth={1.7} />
            ) : (
              <VolumeX size={16} strokeWidth={1.7} />
            )}
          </button>
        </Tooltip>

        {/* Fullscreen */}
        <Tooltip
          content={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          <button
            type="button"
            onClick={onToggleFullscreen}
            className={`${iconButtonClass} hidden sm:flex`}
            style={{ color: colors.muted }}
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? (
              <Minimize size={16} strokeWidth={1.7} />
            ) : (
              <Maximize size={16} strokeWidth={1.7} />
            )}
          </button>
        </Tooltip>

        {/* Keyboard shortcuts */}
        <Tooltip content="Keyboard shortcuts" shortcut="?">
          <button
            type="button"
            onClick={onOpenShortcuts}
            className={iconButtonClass}
            style={{ color: colors.muted }}
            aria-label="Keyboard shortcuts"
          >
            <Keyboard size={16} strokeWidth={1.7} />
          </button>
        </Tooltip>

        {/* Rules */}
        <Tooltip content="Rules of Life">
          <button
            type="button"
            onClick={onOpenRules}
            className={iconButtonClass}
            style={{ color: colors.muted }}
            aria-label="Rules of Life"
          >
            <HelpCircle size={16} strokeWidth={1.7} />
          </button>
        </Tooltip>

        {/* Settings */}
        <Tooltip content="Simulation settings">
          <button
            type="button"
            onClick={onOpenSettings}
            className={iconButtonClass}
            style={{ color: colors.muted }}
            aria-label="Simulation settings"
          >
            <Settings size={16} strokeWidth={1.7} />
          </button>
        </Tooltip>
      </div>
    </header>
  );
};
