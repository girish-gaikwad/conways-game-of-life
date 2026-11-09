import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  shortcut?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  shortcut,
  side = 'top',
  align = 'center',
}) => {
  return (
    <TooltipPrimitive.Root delayDuration={200}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={6}
          className="z-50 overflow-hidden rounded bg-sim-elevated px-2 py-1 text-[11px] font-sans font-medium text-sim-text-primary border border-sim-border shadow-popover select-none flex items-center space-x-1.5 animate-fadeIn"
        >
          <span>{content}</span>
          {shortcut && (
            <kbd className="rounded bg-sim-surface px-1 py-0.2 text-[10px] font-mono text-sim-text-secondary border border-sim-border">
              {shortcut}
            </kbd>
          )}
          <TooltipPrimitive.Arrow className="fill-sim-elevated border-t border-sim-border" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};
