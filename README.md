# Conway’s Game of Life — Cellular Automata Lab

A clean, high-performance, and professionally designed simulation of John Horton Conway’s classic **Game of Life (1970)**. Built with scientific interface discipline, double-buffered engine performance, generative audio synthesis, custom cellular automata physics, and an extensive pattern library.

---

## ✨ Features

- **🚀 High-Performance Simulation Engine**
  - Double-buffered `Uint8Array` cellular automata grid with toroidal (wrap-around) and bounded boundary options.
  - Generational longevity tracking (`ageGrid`) for living cell heatmaps.
  - Multi-tier playback speeds: `1×` (10 gen/s), `2×` (20 gen/s), `5×` (50 gen/s), `10×` (100 gen/s), `20×` (200 gen/s), and `MAX` (~300+ gen/s batch mode).
  - Time reversal / step-back snapshot history buffer (`←` or `B`).

- **🎨 Themes & Cell Styles**
  - **Themes**: Bio-Synthetic (Emerald Matrix), Cyan Telemetry (Arctic Quantum), Amber Phosphor (Solar Terminal), Deep Violet, Monochrome CAD, and Architectural Blueprint.
  - **Cell Rendering**: Classic Square, Rounded Squircle, Dot Matrix, and Generational Heatmap.
  - Edge-to-edge full-screen canvas coverage with clamped panning and zoom bounds.

- **📜 Pattern Library & RLE Support**
  - Categorized pattern presets: Spaceships (*Glider, LWSS, MWSS, HWSS*), Guns (*Gosper, Simkin*), Oscillators (*Pulsar, Pentadecathlon, Galaxy*), Methuselahs (*Acorn, R-pentomino, Diehard*), and Still Lifes.
  - 90° pattern rotation (`R`), ghost placement preview, and one-click center placement.
  - Full **RLE (Run Length Encoded)** parser and exporter for sharing cellular patterns with the broader Conway community.

- **🔬 Custom Cellular Automata Rulesets**
  - Standard Conway (`B3/S23`)
  - HighLife (`B36/S23` with Replicators)
  - Seeds (`B2/S` pure chaotic growth)
  - Inkspot (`B3/S012345678`)
  - Day & Night (`B3678/S34678`)

- **🎵 Generative Audio Synthesizer**
  - Pentatonic Web Audio API soundscape reacting to births, deaths, and population activity (toggleable with `M`).

---

## ⌨️ Controls & Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Space` | Play / Pause simulation |
| `→` or `N` | Step forward 1 generation |
| `←` or `B` | Step backward (Undo 1 generation) |
| `1`, `2`, `5`, `0` | Quick speed switch (`1×`, `2×`, `5×`, `20×`) |
| `D` | Draw Tool (Pencil) |
| `E` | Erase Tool |
| `H` | Hand / Pan Tool |
| `P` | Open Pattern Library |
| `R` | Rotate selected pattern 90° clockwise |
| `S` | Seed random soup |
| `C` | Clear grid |
| `M` | Toggle generative audio |
| `G` | Toggle grid guidelines |
| `Scroll Wheel` | Zoom in / out towards cursor |
| `Click & Drag` | Draw / Erase / Pan based on active tool |

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite 6**
- **Tailwind CSS**
- **Radix UI** primitives (`@radix-ui/react-tooltip`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-dialog`, `@radix-ui/react-slider`)
- **Lucide Icons**
- **HTML5 Canvas 2D** + **Web Audio API**

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/girish-gaikwad/Conway-s-Game-of-Life.git

# Navigate into the project folder
cd Conway-s-Game-of-Life

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
```
The optimized bundle will be compiled into the `dist/` folder, ready to deploy to Vercel, Netlify, GitHub Pages, or any static hosting platform.

---

## 🍴 Forking & Attribution

> **Yeah, you can fork it!** 🚀
> 
> You are completely welcome to fork this project, experiment with it, and build upon it. If you do fork or showcase it, please remember to **mention and credit the original creator** — it means a lot and supports open-source work!

---

## 💡 Open to New Features & Ideas

Have an idea for a cool feature, an interesting cellular automata rule, a visual effect, or an optimization? 

Contributions and feature requests are always welcome! Feel free to:
1. **Open an Issue** with feature suggestions or bug reports.
2. **Submit a Pull Request** with your enhancements.

---

## 👨‍💻 Author & Connect

**Girish Gaikwad**

- 🌐 **Portfolio / Website**: [girish-gaikwad.tech](https://girish-gaikwad.tech)
- 🐙 **GitHub**: [@girish-gaikwad](https://github.com/girish-gaikwad)

---

## 📄 License

This project is open-source. Feel free to use, learn from, and build on it with proper attribution.
