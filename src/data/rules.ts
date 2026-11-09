import { RuleSet } from '../types/game';

export const RULESETS: RuleSet[] = [
  {
    id: 'conway',
    name: "Conway's Life (B3/S23)",
    birth: [3],
    survival: [2, 3],
    description: 'The canonical classic rule. Balanced chaos, gliders, and rich emergent computing.',
  },
  {
    id: 'highlife',
    name: 'HighLife (B36/S23)',
    birth: [3, 6],
    survival: [2, 3],
    description: 'Similar to Conway, but features the famous self-replicating pattern (Replicator).',
  },
  {
    id: 'seeds',
    name: 'Seeds (B2/S)',
    birth: [2],
    survival: [],
    description: 'All live cells die every generation; chaos grows through pure reproduction.',
  },
  {
    id: 'life-without-death',
    name: 'Inkspot (B3/S012345678)',
    birth: [3],
    survival: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    description: 'Live cells never die, producing intricate organic labyrinth growth.',
  },
  {
    id: 'day-night',
    name: 'Day & Night (B3678/S34678)',
    birth: [3, 6, 7, 8],
    survival: [3, 4, 6, 7, 8],
    description: 'Symmetric universe where dark-on-light behaves identically to light-on-dark.',
  },
];
