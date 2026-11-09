import { Pattern } from '../types/game';

export const PATTERNS: Pattern[] = [
  // SPACESHIPS
  {
    id: 'glider',
    name: 'Glider',
    category: 'spaceships',
    description: 'The smallest, most famous spaceship. Glides diagonally across the universe.',
    author: 'Richard K. Guy',
    year: '1970',
    grid: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
  {
    id: 'lwss',
    name: 'Lightweight Spaceship (LWSS)',
    category: 'spaceships',
    description: 'Travels orthogonally at half the speed of light (c/2).',
    author: 'John Conway',
    year: '1970',
    grid: [
      [0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 0],
    ],
  },
  {
    id: 'mwss',
    name: 'Middleweight Spaceship (MWSS)',
    category: 'spaceships',
    description: 'A medium orthogonal spaceship that moves smoothly across the grid.',
    author: 'John Conway',
    year: '1970',
    grid: [
      [0, 0, 1, 0, 0, 0],
      [1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [0, 1, 1, 1, 1, 1],
    ],
  },
  {
    id: 'hwss',
    name: 'Heavyweight Spaceship (HWSS)',
    category: 'spaceships',
    description: 'The largest of the three standard Conway spaceships.',
    author: 'John Conway',
    year: '1970',
    grid: [
      [0, 0, 0, 1, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0],
    ],
  },

  // GUNS
  {
    id: 'gosper-gun',
    name: 'Gosper Glider Gun',
    category: 'guns',
    description: 'First known gun in Conway’s Game of Life. Continuously produces gliders every 30 generations.',
    author: 'Bill Gosper',
    year: '1970',
    grid: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
      [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
  },
  {
    id: 'simkin-gun',
    name: 'Simkin Glider Gun',
    category: 'guns',
    description: 'A compact gun discovered in 2015 that fires gliders every 120 ticks.',
    author: 'Michael Simkin',
    year: '2015',
    grid: [
      [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0]
    ],
  },

  // OSCILLATORS
  {
    id: 'pulsar',
    name: 'Pulsar',
    category: 'oscillators',
    description: 'A dazzling 13x13 period-3 oscillator resembling a stellar explosion.',
    author: 'John Conway',
    year: '1970',
    grid: [
      [0,0,1,1,1,0,0,0,1,1,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,1,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,1,0,0,0,0,1],
      [0,0,1,1,1,0,0,0,1,1,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,1,1,1,0,0,0,1,1,1,0,0],
      [1,0,0,0,0,1,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,1,0,0,0,0,1],
      [1,0,0,0,0,1,0,1,0,0,0,0,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,1,1,1,0,0,0,1,1,1,0,0],
    ],
  },
  {
    id: 'pentadecathlon',
    name: 'Pentadecathlon',
    category: 'oscillators',
    description: 'A period-15 oscillator, one of the most versatile oscillators known.',
    author: 'John Conway',
    year: '1970',
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
  },
  {
    id: 'koks-galaxy',
    name: 'Kok’s Galaxy',
    category: 'oscillators',
    description: 'A hypnotic period-8 spiral galaxy oscillator.',
    author: 'Jan Kok',
    year: '1971',
    grid: [
      [1,1,1,1,1,1,0,1,1],
      [1,1,1,1,1,1,0,1,1],
      [0,0,0,0,0,0,0,1,1],
      [1,1,0,0,0,0,0,1,1],
      [1,1,0,0,0,0,0,1,1],
      [1,1,0,0,0,0,0,1,1],
      [1,1,0,0,0,0,0,0,0],
      [1,1,0,1,1,1,1,1,1],
      [1,1,0,1,1,1,1,1,1],
    ],
  },
  {
    id: 'blinker',
    name: 'Blinker',
    category: 'oscillators',
    description: 'The simplest and most common oscillator (period 2).',
    author: 'John Conway',
    year: '1970',
    grid: [
      [1, 1, 1]
    ],
  },
  {
    id: 'toad',
    name: 'Toad',
    category: 'oscillators',
    description: 'A 6-cell period 2 oscillator.',
    author: 'John Conway',
    year: '1970',
    grid: [
      [0, 1, 1, 1],
      [1, 1, 1, 0]
    ],
  },
  {
    id: 'beacon',
    name: 'Beacon',
    category: 'oscillators',
    description: 'A period 2 oscillator formed by touching diagonal blocks.',
    author: 'John Conway',
    year: '1970',
    grid: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 1, 1]
    ],
  },

  // METHUSELAHS
  {
    id: 'acorn',
    name: 'Acorn',
    category: 'methuselahs',
    description: 'A tiny 7-cell seed that takes 5,206 generations to stabilize, generating 13 gliders.',
    author: 'Charles Corderman',
    year: '1971',
    grid: [
      [0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [1, 1, 0, 0, 1, 1, 1],
    ],
  },
  {
    id: 'r-pentomino',
    name: 'R-pentomino',
    category: 'methuselahs',
    description: 'Active for 1,103 generations before settling into 116 living cells.',
    author: 'John Conway',
    year: '1970',
    grid: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0],
    ],
  },
  {
    id: 'diehard',
    name: 'Diehard',
    category: 'methuselahs',
    description: 'A pattern that vanishes entirely after exactly 130 generations.',
    author: 'Hugh ApSimon',
    year: '1971',
    grid: [
      [0, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 1, 1],
    ],
  },

  // STILL LIFE
  {
    id: 'block',
    name: 'Block',
    category: 'still-life',
    description: 'The simplest and most abundant still life (2x2 square).',
    grid: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    id: 'beehive',
    name: 'Beehive',
    category: 'still-life',
    description: 'The second most common still life.',
    grid: [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 1, 0],
    ],
  },
  {
    id: 'loaf',
    name: 'Loaf',
    category: 'still-life',
    description: 'A 7-cell still life shaped like a bread loaf.',
    grid: [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 0, 1],
      [0, 0, 1, 0],
    ],
  },
  {
    id: 'boat',
    name: 'Boat',
    category: 'still-life',
    description: 'A common 5-cell still life with diagonal symmetry.',
    grid: [
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ],
  },
];

// Helper to rotate grid 90 degrees clockwise
export function rotateGrid(grid: number[][]): number[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const result: number[][] = [];
  for (let c = 0; c < cols; c++) {
    result[c] = [];
    for (let r = rows - 1; r >= 0; r--) {
      result[c].push(grid[r][c]);
    }
  }
  return result;
}

// Helper to flip horizontally
export function flipGridH(grid: number[][]): number[][] {
  return grid.map(row => [...row].reverse());
}

// Helper to flip vertically
export function flipGridV(grid: number[][]): number[][] {
  return [...grid].reverse();
}
