export interface LifeEngineConfig {
  width: number;
  height: number;
  toroidal?: boolean;
  maxHistory?: number;
}

export class LifeEngine {
  public width: number;
  public height: number;
  public size: number;
  public toroidal: boolean;

  public currentGrid: Uint8Array;
  private nextGrid: Uint8Array;
  public ageGrid: Uint16Array;

  public generation: number = 0;
  public aliveCount: number = 0;
  public peakPopulation: number = 0;

  private history: Uint8Array[] = [];
  private historyAges: Uint16Array[] = [];
  private maxHistory: number;

  constructor(config: LifeEngineConfig) {
    this.width = config.width;
    this.height = config.height;
    this.size = this.width * this.height;
    this.toroidal = config.toroidal ?? true;
    this.maxHistory = config.maxHistory ?? 60;

    this.currentGrid = new Uint8Array(this.size);
    this.nextGrid = new Uint8Array(this.size);
    this.ageGrid = new Uint16Array(this.size);
  }

  public resize(newWidth: number, newHeight: number) {
    const oldWidth = this.width;
    const oldHeight = this.height;
    const oldGrid = this.currentGrid;
    const oldAges = this.ageGrid;

    this.width = newWidth;
    this.height = newHeight;
    this.size = newWidth * newHeight;
    this.currentGrid = new Uint8Array(this.size);
    this.nextGrid = new Uint8Array(this.size);
    this.ageGrid = new Uint16Array(this.size);
    this.history = [];
    this.historyAges = [];

    // Copy overlapping cells centered
    const offsetX = Math.floor((newWidth - oldWidth) / 2);
    const offsetY = Math.floor((newHeight - oldHeight) / 2);

    let newAlive = 0;
    for (let y = 0; y < oldHeight; y++) {
      for (let x = 0; x < oldWidth; x++) {
        const oldVal = oldGrid[y * oldWidth + x];
        if (oldVal) {
          const nx = x + offsetX;
          const ny = y + offsetY;
          if (nx >= 0 && nx < newWidth && ny >= 0 && ny < newHeight) {
            const nIdx = ny * newWidth + nx;
            this.currentGrid[nIdx] = 1;
            this.ageGrid[nIdx] = oldAges[y * oldWidth + x];
            newAlive++;
          }
        }
      }
    }
    this.aliveCount = newAlive;
  }

  public getIndex(x: number, y: number): number {
    return y * this.width + x;
  }

  public getCell(x: number, y: number): number {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      if (this.toroidal) {
        x = (x % this.width + this.width) % this.width;
        y = (y % this.height + this.height) % this.height;
      } else {
        return 0;
      }
    }
    return this.currentGrid[y * this.width + x];
  }

  public setCell(x: number, y: number, state: number): boolean {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
    const idx = y * this.width + x;
    const prev = this.currentGrid[idx];
    if (prev !== state) {
      this.currentGrid[idx] = state ? 1 : 0;
      if (state) {
        this.ageGrid[idx] = 1;
        this.aliveCount++;
        if (this.aliveCount > this.peakPopulation) {
          this.peakPopulation = this.aliveCount;
        }
      } else {
        this.ageGrid[idx] = 0;
        this.aliveCount--;
      }
      return true;
    }
    return false;
  }

  public toggleCell(x: number, y: number): boolean {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
    const idx = y * this.width + x;
    const isNowAlive = this.currentGrid[idx] === 0;
    this.setCell(x, y, isNowAlive ? 1 : 0);
    return isNowAlive;
  }

  // Stamp pattern centered or aligned at (startX, startY)
  public stampPattern(patternGrid: number[][], startX: number, startY: number, center: boolean = true) {
    this.saveSnapshot();
    const pHeight = patternGrid.length;
    const pWidth = patternGrid[0].length;

    const ox = center ? Math.floor(startX - pWidth / 2) : startX;
    const oy = center ? Math.floor(startY - pHeight / 2) : startY;

    for (let r = 0; r < pHeight; r++) {
      for (let c = 0; c < pWidth; c++) {
        const val = patternGrid[r][c];
        const gx = ox + c;
        const gy = oy + r;

        if (this.toroidal) {
          const tx = (gx % this.width + this.width) % this.width;
          const ty = (gy % this.height + this.height) % this.height;
          if (val === 1) this.setCell(tx, ty, 1);
        } else if (gx >= 0 && gx < this.width && gy >= 0 && gy < this.height) {
          if (val === 1) this.setCell(gx, gy, 1);
        }
      }
    }
  }

  public step(): void {
    this.saveSnapshot();

    const w = this.width;
    const h = this.height;
    const curr = this.currentGrid;
    const next = this.nextGrid;
    const ages = this.ageGrid;
    const isToroidal = this.toroidal;

    let newAlive = 0;

    for (let y = 0; y < h; y++) {
      const yPrev = isToroidal ? (y === 0 ? h - 1 : y - 1) : y - 1;
      const yNext = isToroidal ? (y === h - 1 ? 0 : y + 1) : y + 1;

      const rowIdx = y * w;
      const rowPrevIdx = yPrev * w;
      const rowNextIdx = yNext * w;

      for (let x = 0; x < w; x++) {
        const xPrev = isToroidal ? (x === 0 ? w - 1 : x - 1) : x - 1;
        const xNext = isToroidal ? (x === w - 1 ? 0 : x + 1) : x + 1;

        let neighbors = 0;

        if (isToroidal || yPrev >= 0) {
          if (isToroidal || xPrev >= 0) neighbors += curr[rowPrevIdx + xPrev];
          neighbors += curr[rowPrevIdx + x];
          if (isToroidal || xNext < w) neighbors += curr[rowPrevIdx + xNext];
        }

        if (isToroidal || xPrev >= 0) neighbors += curr[rowIdx + xPrev];
        if (isToroidal || xNext < w) neighbors += curr[rowIdx + xNext];

        if (isToroidal || yNext < h) {
          if (isToroidal || xPrev >= 0) neighbors += curr[rowNextIdx + xPrev];
          neighbors += curr[rowNextIdx + x];
          if (isToroidal || xNext < w) neighbors += curr[rowNextIdx + xNext];
        }

        const idx = rowIdx + x;
        const cell = curr[idx];

        // Conway's B3/S23
        if (cell === 1) {
          if (neighbors === 2 || neighbors === 3) {
            next[idx] = 1;
            ages[idx] = ages[idx] < 65535 ? ages[idx] + 1 : 65535;
            newAlive++;
          } else {
            next[idx] = 0;
            ages[idx] = 0;
          }
        } else {
          if (neighbors === 3) {
            next[idx] = 1;
            ages[idx] = 1; // newborn
            newAlive++;
          } else {
            next[idx] = 0;
            ages[idx] = 0;
          }
        }
      }
    }

    // Swap buffers
    this.currentGrid.set(this.nextGrid);
    this.aliveCount = newAlive;
    this.generation++;
    if (newAlive > this.peakPopulation) {
      this.peakPopulation = newAlive;
    }
  }

  private saveSnapshot() {
    if (this.history.length >= this.maxHistory) {
      this.history.shift();
      this.historyAges.shift();
    }
    this.history.push(new Uint8Array(this.currentGrid));
    this.historyAges.push(new Uint16Array(this.ageGrid));
  }

  public canStepBack(): boolean {
    return this.history.length > 0;
  }

  public stepBack(): boolean {
    if (this.history.length === 0) return false;
    const prevGrid = this.history.pop()!;
    const prevAges = this.historyAges.pop()!;

    this.currentGrid.set(prevGrid);
    this.ageGrid.set(prevAges);

    let count = 0;
    for (let i = 0; i < this.size; i++) {
      if (this.currentGrid[i]) count++;
    }
    this.aliveCount = count;
    if (this.generation > 0) this.generation--;
    return true;
  }

  public randomize(density: number = 0.22): void {
    this.saveSnapshot();
    let alive = 0;
    for (let i = 0; i < this.size; i++) {
      const isAlive = Math.random() < density ? 1 : 0;
      this.currentGrid[i] = isAlive;
      this.ageGrid[i] = isAlive ? 1 : 0;
      if (isAlive) alive++;
    }
    this.aliveCount = alive;
    this.generation = 0;
    this.peakPopulation = alive;
    this.history = [];
    this.historyAges = [];
  }

  public clear(): void {
    this.saveSnapshot();
    this.currentGrid.fill(0);
    this.nextGrid.fill(0);
    this.ageGrid.fill(0);
    this.aliveCount = 0;
    this.generation = 0;
    this.peakPopulation = 0;
  }

  public invert(): void {
    this.saveSnapshot();
    let alive = 0;
    for (let i = 0; i < this.size; i++) {
      const val = this.currentGrid[i] === 1 ? 0 : 1;
      this.currentGrid[i] = val;
      this.ageGrid[i] = val ? 1 : 0;
      if (val) alive++;
    }
    this.aliveCount = alive;
    if (alive > this.peakPopulation) {
      this.peakPopulation = alive;
    }
  }
}
