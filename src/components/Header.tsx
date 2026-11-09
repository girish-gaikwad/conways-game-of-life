import React from 'react';
import { Volume2, VolumeX, HelpCircle, Keyboard, Settings, Compass } from 'lucide-react';
import { GameStats, Theme } from '../types/game';
import { THEMES } from '../data/themes';

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
}) => {
  return (
    <header className="relative z-30 flex items-center justify-between px-4 py-2.5 glass-panel border-b border-white/10 select-none">
      {/* Brand & Status */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shadow-md transition-all duration-300"
            style={{
              backgroundColor: currentTheme.accentColor,
              color: currentTheme.isLight ? '#ffffff' : '#0a0f14',
              boxShadow: `0 0 16px ${currentTheme.glowColor}`,
            }}
          >
            ●
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide flex items-center gap-1.5 leading-tight text-white">
              <span>CONWAY</span>
              <span className="text-[10px] tracking-widest px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono">
                LAB
              </span>
            </h1>
            <p className="text-[11px] text-white/50 font-mono tracking-tight">
              {gridWidth}×{gridHeight} CELLULAR AUTOMATON
            </p>
          </div>
        </div>

        {/* Live HUD Badges */}
        <div className="hidden md:flex items-center space-x-2 ml-4 pl-4 border-l border-white/10">
          <div className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 flex items-center space-x-2 text-xs font-mono">
            <span className="text-white/40">GEN</span>
            <span className="font-semibold text-white tabular-nums tracking-wide">
              {stats.generation.toLocaleString()}
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 flex items-center space-x-2 text-xs font-mono">
            <span className="text-white/40">ALIVE</span>
            <span
              className="font-semibold tabular-nums tracking-wide"
              style={{ color: currentTheme.cellColor }}
            >
              {stats.aliveCount.toLocaleString()}
            </span>
          </div>

          <div className="hidden lg:flex px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 items-center space-x-2 text-xs font-mono">
            <span className="text-white/40">PEAK</span>
            <span className="text-white/80 tabular-nums">
              {stats.peakPopulation.toLocaleString()}
            </span>
          </div>

          <div className="hidden xl:flex px-2 py-1 rounded-md bg-white/[0.04] border border-white/5 items-center space-x-1.5 text-xs font-mono text-white/50">
            <span>FPS</span>
            <span className="tabular-nums text-white/80">{stats.fps}</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Quick Theme Selector Dropdown */}
        <div className="relative group">
          <button
            title="Theme Selection"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-white/80 hover:text-white transition-colors"
          >
            <div
              className="w-3 h-3 rounded-full border border-white/30"
              style={{ backgroundColor: currentTheme.cellColor }}
            />
            <span className="hidden sm:inline">{currentTheme.name}</span>
          </button>

          <div className="absolute right-0 top-full mt-1.5 w-48 py-1 rounded-xl glass-panel shadow-2xl border border-white/10 hidden group-hover:block transition-all z-50">
            <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-white/40 border-b border-white/5">
              Color Themes
            </div>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTheme(t)}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-left transition-colors ${
                  currentTheme.id === t.id
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: t.cellColor }}
                />
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center / Reset View */}
        <button
          onClick={onResetView}
          title="Reset View / Center (Home)"
          className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-white/70 hover:text-white transition-colors flex items-center space-x-1"
        >
          <Compass className="w-4 h-4" />
          <span className="hidden md:inline">Center</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute generative audio (M)' : 'Enable generative audio (M)'}
          className={`p-1.5 sm:px-2 sm:py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center space-x-1 ${
            soundEnabled
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
              : 'bg-white/[0.06] border-white/10 text-white/50 hover:text-white/80'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden lg:inline">{soundEnabled ? 'Audio On' : 'Muted'}</span>
        </button>

        {/* Shortcuts Guide */}
        <button
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts (?)"
          className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/70 hover:text-white transition-colors"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Game Rules Modal */}
        <button
          onClick={onOpenRules}
          title="Conway's Rules & Guide"
          className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/70 hover:text-white transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Engine Settings */}
        <button
          onClick={onOpenSettings}
          title="Settings & Display Modes"
          className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/70 hover:text-white transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
