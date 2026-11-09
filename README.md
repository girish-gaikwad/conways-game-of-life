# Conway’s Game of Life — Cellular Automata Lab

A high-performance, professionally engineered simulation of John Horton Conway’s classic **Game of Life (1970)**. Designed with clean architectural aesthetics, smooth fast-forwarding, time reversal, comprehensive pattern catalogs, and generative audio synthesis.

## Features

- **Blazing Fast Performance Engine**:
  - Double-buffered `Uint8Array` cellular automata core.
  - Generational longevity tracking (`ageGrid`) for age-based cellular heatmaps.
  - Multi-tier Fast-Forward speeds: `1×` (10 gen/s), `2×` (20 gen/s), `5×` (50 gen/s), `10×` (100 gen/s), `20×` (200 gen/s), and `MAX` (~300+ gen/s with batch stepping).
  - Reverse time / Step Backward (`←` or `B`) with snapshot ring buffer.
- **Game Designer Aesthetic & Color Themes**:
  - **Emerald Matrix**: High-contrast laboratory dark slate with crisp emerald and mint accents.
  - **Arctic Quantum**: Deep obsidian navy with electric cyan highlights.
  - **Solar Terminal**: Warm graphite with radiant amber and sunburst tones.
  - **Nebula Violet**: Deep space with bioluminescent magenta and purple.
  - **Minimal Chalk**: Minimalist monochrome chalk & obsidian titanium.
  - **Blueprint Light**: Crisp architectural blueprint light theme.
- **Cell Render Styles**:
  - **Classic Square**: Pixel-precise geometric grid.
  - **Rounded Nano**: Modern squircle cell tokens.
  - **Dot Matrix**: Circular micro-dots.
  - **Age Heatmap**: Dynamic color gradation from newborn cells to veteran cells.
- **Historic Pattern Catalog**:
  - Spaceships: *Glider, Lightweight Spaceship (LWSS), Middleweight Spaceship (MWSS), Heavyweight Spaceship (HWSS)*.
  - Guns & Breeders: *Gosper Glider Gun (1970), Simkin Glider Gun (2015)*.
  - Oscillators: *Pulsar, Pentadecathlon, Kok’s Galaxy, Blinker, Toad, Beacon*.
  - Methuselahs: *Acorn (5,206 gen), R-pentomino (1,103 gen), Diehard (130 gen)*.
  - Still Lifes: *Block, Beehive, Loaf, Boat*.
  - Pattern rotation (90° clockwise) & ghost hover preview before stamping.
- **Canvas Interaction**:
  - Smooth pan & zoom (scroll wheel, touch pinch, or hand tool).
  - High-DPI Retina/4K sharp canvas scaling.
  - Responsive coordinate HUD and live generation / alive cell counters.
- **Generative Audio Synthesis**:
  - Ambient Web Audio API pentatonic chimes tuned to cellular births and steps.
  - Soft, non-intrusive micro-tones (toggleable anytime).

## Controls & Keyboard Shortcuts

| Key / Control | Action |
| --- | --- |
| `Space` | Play / Pause simulation |
| `→` or `N` | Step forward 1 generation |
| `←` or `B` | Step backward (Undo 1 gen) |
| `1`, `2`, `5`, `0` | Quick speed switch (1×, 2×, 5×, 20×) |
| `D` | Draw Tool (Pencil) |
| `E` | Erase Tool |
| `H` | Hand / Pan Tool |
| `P` | Open Pattern Catalog |
| `R` | Rotate selected pattern 90° |
| `S` | Spawn Random Soup |
| `C` | Clear Grid |
| `M` | Toggle Generative Audio |
| `G` | Toggle Grid Guidelines |
| `Scroll Wheel` | Zoom In / Out towards cursor |
| `Shift + Drag` | Pan canvas at any time |

## Development & Hosting

### Run locally:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
```
The optimized production files will be output to the `dist/` directory, ready to deploy instantly on Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static web server.
