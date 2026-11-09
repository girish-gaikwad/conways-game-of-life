
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

const iconButton =
  'flex h-8 w-8 shrink-0 items-center justify-center text-[#89948B] transition-colors hover:bg-white/[0.055] hover:text-[#E7ECE7] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A6D96A] disabled:opacity-35';

const Metric = ({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) => (
  <div className="flex min-w-0 flex-col justify-center gap-0.5">
    <span className="text-[9px] font-medium uppercase tracking-[0.09em] text-[#78847B]">
      {label}
    </span>
    <span
      className={`font-mono text-[13px] font-medium tabular-nums ${
        accent ? 'text-[#B3D982]' : 'text-[#E0E6DF]'
      }`}
    >
      {value}
    </span>
  </div>
);

const Separator = () => (
  <div className="mx-4 h-6 w-px shrink-0 bg-white/[0.09]" />
);

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
    <header className="relative z-30 flex min-h-[60px] w-full select-none items-center justify-between gap-4 border-b border-[#292F29] bg-[#0C0F0D] px-4 sm:px-6">
      {/* Brand */}
      <div className="flex min-w-[180px] shrink-0 items-center gap-2.5">
        <Dna
          className="h-[21px] w-[21px] text-[#A6D96A]"
          strokeWidth={1.5}
        />
        <div className="flex flex-col gap-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[13px] font-semibold tracking-[0.12em] text-[#E6EBE5]">
              CONWAY
            </span>
            <span className="text-[10px] font-medium tracking-wide text-[#A6D96A]">
              / LIFE
            </span>
          </div>
          <span className="text-[10px] text-[#737F76]">
            Cellular automata
          </span>
        </div>
      </div>

      {/* Simulation statistics */}
      <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
        <div className="flex items-center">
          <Metric
            label="Generation"
            value={stats.generation.toLocaleString()}
          />

          <Separator />

          <Metric
            label="Population"
            value={stats.aliveCount.toLocaleString()}
            accent
          />

          <Separator />

          <Metric
            label="Births / deaths"
            value={
              <span>
                <span className="text-[#A6D96A]">+{stats.births}</span>
                <span className="px-1.5 text-[#68736A]">/</span>
                <span className="text-[#D98778]">−{stats.deaths}</span>
              </span>
            }
          />

          <div className="hidden 2xl:block">
            <Separator />
          </div>

          <div className="hidden 2xl:block">
            <Metric
              label="Density"
              value={`${stats.density.toFixed(1)}%`}
            />
          </div>
        </div>
      </div>

      {/* Application actions */}
      <div className="flex shrink-0 items-center gap-0.5">
        <div className="mr-2 hidden items-center gap-1.5 border-r border-[#292F29] pr-3 text-[10px] font-mono text-[#849087] xl:flex">
          <Activity className="h-3 w-3 text-[#A6D96A]" />
          <span>{gridWidth} × {gridHeight}</span>
        </div>

        {/* Theme */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              title="Change theme"
              className="flex h-8 max-w-[132px] items-center gap-2 px-2 text-[11px] text-[#C3CCC4] transition-colors hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A6D96A]"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: currentTheme.cellColor }}
              />
              <span className="hidden truncate sm:inline">
                {currentTheme.name}
              </span>
              <ChevronDown className="h-3 w-3 shrink-0 text-[#78847B]" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={6}
              className="z-50 min-w-[180px] border border-[#303830] bg-[#151A16] p-1 shadow-xl shadow-black/30 animate-fadeIn"
            >
              <div className="px-2.5 py-2 text-[10px] uppercase tracking-wider text-[#78847B]">
                Cell palette
              </div>

              {THEMES.map((t) => (
                <DropdownMenu.Item
                  key={t.id}
                  onSelect={() => onSelectTheme(t)}
                  className={`flex cursor-pointer items-center gap-2.5 px-2.5 py-2 text-xs outline-none transition-colors ${
                    currentTheme.id === t.id
                      ? 'bg-white/[0.07] text-[#B3D982]'
                      : 'text-[#B8C2B9] hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: t.cellColor }}
                  />
                  <span>{t.name}</span>
                  {currentTheme.id === t.id && (
                    <span className="ml-auto text-[#A6D96A]">✓</span>
                  )}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <div className="mx-1 h-5 w-px bg-[#292F29]" />

        <Tooltip content="Center viewport" shortcut="Home">
          <button onClick={onResetView} className={iconButton} aria-label="Center viewport">
            <Compass size={16} strokeWidth={1.7} />
          </button>
        </Tooltip>

        <Tooltip content="Export snapshot">
          <button onClick={onExportSnapshot} className={iconButton} aria-label="Export snapshot">
            <Camera size={16} strokeWidth={1.7} />
          </button>
        </Tooltip>

        <Tooltip content={soundEnabled ? 'Mute audio' : 'Enable audio'} shortcut="M">
          <button
            onClick={onToggleSound}
            className={`${iconButton} ${soundEnabled ? 'text-[#A6D96A]' : ''}`}
            aria-label={soundEnabled ? 'Mute audio' : 'Enable audio'}
            aria-pressed={soundEnabled}
          >
            {soundEnabled
              ? <Volume2 size={16} strokeWidth={1.7} />
              : <VolumeX size={16} strokeWidth={1.7} />}
          </button>
        </Tooltip>

        <div className="mx-1 h-5 w-px bg-[#292F29]" />

        <Tooltip content={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
          <button
            onClick={onToggleFullscreen}
            className={`${iconButton} hidden sm:flex`}
            aria-label="Toggle fullscreen"
          >
            {isFullscreen
              ? <Minimize size={16} strokeWidth={1.7} />
              : <Maximize size={16} strokeWidth={1.7} />}
          </button>
        </Tooltip>

        <Tooltip content="Keyboard shortcuts" shortcut="?">
          <button onClick={onOpenShortcuts} className={iconButton} aria-label="Keyboard shortcuts">
            <Keyboard size={16} strokeWidth={1.7} />
          </button>
        </Tooltip>

        <Tooltip content="Game rules">
          <button onClick={onOpenRules} className={iconButton} aria-label="Game rules">
            <HelpCircle size={16} strokeWidth={1.7} />
          </button>
        </Tooltip>

        <Tooltip content="Settings">
          <button onClick={onOpenSettings} className={iconButton} aria-label="Settings">
            <Settings size={16} strokeWidth={1.7} />
          </button>
        </Tooltip>
      </div>

      {/* Running indicator */}
      <div
        className={`absolute bottom-0 left-0 h-px transition-all duration-300 ${
          isRunning ? 'w-full bg-[#A6D96A]/55' : 'w-0'
        }`}
      />
    </header>
  );
};
