import React from 'react';
import { Theme } from '../types/game';

interface PopulationSparklineProps {
  data: number[];
  theme: Theme;
  width?: number;
  height?: number;
}

export const PopulationSparkline: React.FC<PopulationSparklineProps> = ({
  data,
  theme,
  width = 96,
  height = 24,
}) => {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="flex items-center space-x-1.5" title="Population Trend (Last 60 Gen)">
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        style={{ filter: `drop-shadow(0 0 4px ${theme.glowColor})` }}
      >
        <polyline
          fill="none"
          stroke={theme.cellColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* Latest point circle */}
        {data.length > 0 && (
          <circle
            cx={width}
            cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
            r="2"
            fill={theme.cellNewColor}
          />
        )}
      </svg>
    </div>
  );
};
