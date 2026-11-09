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
  return (
    <header className="relative z-30 flex items-center justify-between px-3 sm:px-4 py-2 bg-sim-surface border-b border-sim-border select-none">
      {/* Brand & Simulation Spec */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          {/* Running State LED Indicator */}
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              isRunning ? 'bg-sim-accent animate-pulse' : 'bg-sim-text-muted/60'
            }`}
          />
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xs font-semibold tracking-wider font-mono uppercase text-sim-text-primary">
              CONWAY
            </span>
            <span className="text-[10px] font-mono tracking-widest text-sim-accent">
              SIMULATOR
            </span>
            <span className="text-[10px] font-mono text-sim-text-muted hidden sm:inline">
              // {gridWidth}×{gridHeight}
            </span>
          </div>
        </div>

        {/* SCIENTIFIC HUD METRICS DISPLAY */}
        <div className="hidden lg:flex items-center space-x-2 ml-3 pl-3 border-l border-sim-border text-xs font-mono">
          {/* Current Generation */}
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-sim-elevated border border-sim-border">
            <span className="text-[10px] text-sim-text-muted">GEN</span>
            <span className="font-semibold text-sim-text-primary tabular-nums">
              {stats.generation.toLocaleString()}
            </span>
          </div>

          {/* Live Population */}
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-sim-elevated border border-sim-border">
            <span className="text-[10px] text-sim-text-muted">LIVE</span>
            <span className="font-semibold text-sim-accent tabular-nums">
              {stats.aliveCount.toLocaleString()}
            </span>
          </div>

          {/* Births & Deaths dynamics */}
          <div
            className="hidden xl:flex items-center space-x-1 px-2 py-0.5 rounded bg-sim-elevated border border-sim-border text-[11px]"
            title="Last tick Births (+) / Deaths (-)"
          >
            <span className="text-sim-accent tabular-nums">+{stats.births}</span>
            <span className="text-sim-text-muted">/</span>
            <span className="text-sim-danger tabular-nums">-{stats.deaths}</span>
          </div>

          {/* Population Density */}
          <div className="hidden xl:flex items-center space-x-1 px-2 py-0.5 rounded bg-sim-elevated border border-sim-border">
            <span className="text-[10px] text-sim-text-muted">DENSITY</span>
            <span className="text-sim-text-primary tabular-nums font-medium">
              {stats.density.toFixed(1)}%
            </span>
          </div>

          {/* Peak Population */}
          <div className="hidden 2xl:flex items-center space-x-1 px-2 py-0.5 rounded bg-sim-elevated border border-sim-border">
            <span className="text-[10px] text-sim-text-muted">PEAK</span>
            <span className="text-sim-text-secondary tabular-nums">
              {stats.peakPopulation.toLocaleString()}
            </span>
          </div>

          {/* FPS Counter */}
          <div className="hidden 2xl:flex items-center space-x-1 px-1.5 py-0.5 text-[10px] text-sim-text-muted">
            <span>FPS</span>
            <span className="tabular-nums text-sim-text-secondary">{stats.fps}</span>
          </div>
        </div>
      </div>

      {/* TOP RIGHT TOOLBAR ACTIONS */}
      <div className="flex items-center space-x-1 sm:space-x-1.5">
        {/* Radix Dropdown Theme Selector */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center space-x-1.5 px-2 py-1 rounded bg-sim-elevated hover:bg-sim-hover border border-sim-border text-xs text-sim-text-secondary hover:text-sim-text-primary transition-colors">
              <div
                className="w-2.5 h-2.5 rounded-full border border-sim-border shadow-sm"
                style={{ backgroundColor: currentTheme.cellColor }}
              />
              <span className="hidden md:inline font-sans text-[11px]">{currentTheme.name}</span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={4}
              className="z-50 min-w-[180px] bg-sim-surface border border-sim-border rounded-md p-1 shadow-popover text-xs font-sans animate-fadeIn"
            >
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-sim-text-muted">
                Visual Palettes
              </div>
              {THEMES.map((t) => (
                <DropdownMenu.Item
                  key={t.id}
                  onClick={() => onSelectTheme(t)}
                  className={`flex items-center space-x-2 px-2 py-1.5 rounded cursor-pointer transition-colors outline-none ${
                    currentTheme.id === t.id
                      ? 'bg-sim-elevated text-sim-accent font-medium'
                      : 'text-sim-text-secondary hover:bg-sim-hover hover:text-sim-text-primary'
                  }`}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full border border-sim-border"
                    style={{ backgroundColor: t.cellColor }}
                  />
                  <span>{t.name}</span>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Reset View / Center */}
        <Tooltip content="Center viewport (Home)" shortcut="Home">
          <button
            onClick={onResetView}
            className="p-1.5 rounded bg-sim-elevated hover:bg-sim-hover border border-sim-border text-sim-text-secondary hover:text-sim-text-primary transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        {/* Capture Snapshot */}
        <Tooltip content="Export canvas as high-res PNG">
          <button
            onClick={onExportSnapshot}
            className="p-1.5 rounded bg-sim-elevated hover:bg-sim-hover border border-sim-border text-sim-text-secondary hover:text-sim-text-primary transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        {/* Audio Toggle */}
        <Tooltip content={soundEnabled ? 'Mute audio' : 'Enable ambient audio'} shortcut="M">
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded border text-xs transition-colors ${
              soundEnabled
                ? 'bg-sim-accent-muted border-sim-accent/40 text-sim-accent'
                : 'bg-sim-elevated border-sim-border text-sim-text-muted hover:text-sim-text-primary hover:bg-sim-hover'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </Tooltip>

        {/* Fullscreen Toggle */}
        <Tooltip content={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded bg-sim-elevated hover:bg-sim-hover border border-sim-border text-sim-text-secondary hover:text-sim-text-primary transition-colors hidden sm:block"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>
        </Tooltip>

        {/* Shortcuts Reference */}
        <Tooltip content="Keyboard shortcuts reference" shortcut="?">
          <button
            onClick={onOpenShortcuts}
            className="p-1.5 rounded bg-sim-elevated hover:bg-sim-hover border border-sim-border text-sim-text-secondary hover:text-sim-text-primary transition-colors"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        {/* Guide / Rules */}
        <Tooltip content="Conway's rules & background">
          <button
            onClick={onOpenRules}
            className="p-1.5 rounded bg-sim-elevated hover:bg-sim-hover border border-sim-border text-sim-text-secondary hover:text-sim-text-primary transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        {/* Settings Dialog */}
        <Tooltip content="Simulation settings">
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded bg-sim-elevated hover:bg-sim-hover border border-sim-border text-sim-text-secondary hover:text-sim-text-primary transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      </div>
    </header>
  );
};
