
import React, {
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { LifeEngine } from '../core/lifeEngine';
import {
  CellStyle,
  Pattern,
  Theme,
  ToolType,
  ViewportTransform,
} from '../types/game';
import { soundFX } from '../utils/audio';

interface GridCanvasProps {
  engine: LifeEngine;
  theme: Theme;
  cellStyle: CellStyle;
  showGridLines: boolean;
  activeTool: ToolType;
  selectedPattern: Pattern | null;
  transform: ViewportTransform;
  onTransformChange: (t: ViewportTransform) => void;
  onCellModified: () => void;
  onPatternPlaced?: () => void;
  hoverCoord: { x: number; y: number } | null;
  setHoverCoord: (coord: { x: number; y: number } | null) => void;
}

type Point = { x: number; y: number };

const BASE_CELL_SIZE = 16;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 6;

export const GridCanvas: React.FC<GridCanvasProps> = ({
  engine,
  theme,
  cellStyle,
  showGridLines,
  activeTool,
  selectedPattern,
  transform,
  onTransformChange,
  onCellModified,
  onPatternPlaced,
  setHoverCoord,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const frameRef = useRef<number>(0);
  const isMouseDownRef = useRef(false);
  const mouseButtonRef = useRef(0);
  const lastMousePosRef = useRef<Point>({ x: 0, y: 0 });
  const lastDrawnCellRef = useRef<Point | null>(null);
  const drawActionRef = useRef(1);

  const touchStartRef = useRef<{
    x: number;
    y: number;
    dist: number;
  } | null>(null);

  // Keep frequently changing callbacks and values accessible to
  // the animation loop without restarting it on every render.
  const latestRef = useRef({
    engine,
    theme,
    cellStyle,
    showGridLines,
    activeTool,
    selectedPattern,
    transform,
    onCellModified,
    onPatternPlaced,
    screenToGrid: null as
      | ((x: number, y: number) => {
          x: number;
          y: number;
          inBounds: boolean;
        })
      | null,
  });

  const screenToGrid = useCallback(
    (screenX: number, screenY: number) => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return { x: 0, y: 0, inBounds: false };
      }

      const rect = canvas.getBoundingClientRect();
      const cssX = screenX - rect.left;
      const cssY = screenY - rect.top;

      const effectiveCellSize = BASE_CELL_SIZE * transform.zoom;

      const originX =
        rect.width / 2 +
        transform.panX -
        (engine.width * effectiveCellSize) / 2;

      const originY =
        rect.height / 2 +
        transform.panY -
        (engine.height * effectiveCellSize) / 2;

      const x = Math.floor((cssX - originX) / effectiveCellSize);
      const y = Math.floor((cssY - originY) / effectiveCellSize);

      return {
        x,
        y,
        inBounds:
          x >= 0 &&
          x < engine.width &&
          y >= 0 &&
          y < engine.height,
      };
    },
    [transform, engine.width, engine.height]
  );

  useEffect(() => {
    latestRef.current = {
      engine,
      theme,
      cellStyle,
      showGridLines,
      activeTool,
      selectedPattern,
      transform,
      onCellModified,
      onPatternPlaced,
      screenToGrid,
    };
  }, [
    engine,
    theme,
    cellStyle,
    showGridLines,
    activeTool,
    selectedPattern,
    transform,
    onCellModified,
    onPatternPlaced,
    screenToGrid,
  ]);

  // ----------------------------------------------------------------
  // Canvas sizing
  // ----------------------------------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      contextRef.current = canvas.getContext('2d', {
        alpha: false,
      });
    };

    resizeCanvas();

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);

    window.addEventListener('resize', resizeCanvas);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // ----------------------------------------------------------------
  // Drawing helpers
  // ----------------------------------------------------------------

  const drawLine = useCallback(
    (x0: number, y0: number, x1: number, y1: number, state: number) => {
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);

      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;

      let err = dx - dy;
      let x = x0;
      let y = y0;
      let changed = false;

      while (true) {
        if (
          x >= 0 &&
          x < engine.width &&
          y >= 0 &&
          y < engine.height
        ) {
          if (engine.setCell(x, y, state)) {
            changed = true;
          }
        }

        if (x === x1 && y === y1) break;

        const e2 = 2 * err;

        if (e2 > -dy) {
          err -= dy;
          x += sx;
        }

        if (e2 < dx) {
          err += dx;
          y += sy;
        }
      }

      if (changed) {
        soundFX.playCellTone(x1 + y1, state === 1);
        onCellModified();
      }
    },
    [engine, onCellModified]
  );

  const placePattern = useCallback(
    (x: number, y: number) => {
      if (!selectedPattern) return;

      engine.stampPattern(selectedPattern.grid, x, y, true);
      soundFX.playCellTone(x + y, true);
      onCellModified();
      onPatternPlaced?.();
    },
    [
      engine,
      selectedPattern,
      onCellModified,
      onPatternPlaced,
    ]
  );

  const updateHover = useCallback(
    (clientX: number, clientY: number) => {
      const { x, y, inBounds } = screenToGrid(clientX, clientY);

      setHoverCoord(inBounds ? { x, y } : null);

      return { x, y, inBounds };
    },
    [screenToGrid, setHoverCoord]
  );

  // ----------------------------------------------------------------
  // Rendering
  // ----------------------------------------------------------------

  useEffect(() => {
    let active = true;

    const render = () => {
      if (!active) return;

      const canvas = canvasRef.current;
      const ctx = contextRef.current;

      if (!canvas || !ctx) {
        frameRef.current = requestAnimationFrame(render);
        return;
      }

      const {
        engine,
        theme,
        cellStyle,
        showGridLines,
        activeTool,
        selectedPattern,
        transform,
        screenToGrid,
      } = latestRef.current;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width;
      const height = canvas.height;

      const cssWidth = width / dpr;
      const cssHeight = height / dpr;

      // Background
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.scale(dpr, dpr);

      const cellSize = BASE_CELL_SIZE * transform.zoom;

      const originX =
        cssWidth / 2 +
        transform.panX -
        (engine.width * cellSize) / 2;

      const originY =
        cssHeight / 2 +
        transform.panY -
        (engine.height * cellSize) / 2;

      // Only render cells that can appear in the viewport.
      const minX = Math.max(
        0,
        Math.floor(-originX / cellSize)
      );

      const maxX = Math.min(
        engine.width - 1,
        Math.ceil((cssWidth - originX) / cellSize)
      );

      const minY = Math.max(
        0,
        Math.floor(-originY / cellSize)
      );

      const maxY = Math.min(
        engine.height - 1,
        Math.ceil((cssHeight - originY) / cellSize)
      );

      const gridWidth = engine.width * cellSize;
      const gridHeight = engine.height * cellSize;

      // Grid lines
      if (showGridLines && cellSize >= 5) {
        ctx.beginPath();
        ctx.strokeStyle = theme.gridLineColor;
        ctx.lineWidth = 0.5;

        ctx.globalAlpha = Math.min(
          0.65,
          (cellSize - 5) / 12
        );

        for (let x = minX; x <= maxX + 1; x++) {
          const px = originX + x * cellSize;
          ctx.moveTo(px, originY);
          ctx.lineTo(px, originY + gridHeight);
        }

        for (let y = minY; y <= maxY + 1; y++) {
          const py = originY + y * cellSize;
          ctx.moveTo(originX, py);
          ctx.lineTo(originX + gridWidth, py);
        }

        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Universe boundary
      ctx.strokeStyle = theme.gridLineColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(
        originX,
        originY,
        gridWidth,
        gridHeight
      );

      // Living cells
      const gap = cellSize >= 4 ? 1 : 0;
      const innerSize = Math.max(1, cellSize - gap);
      const isHeatmap = cellStyle === 'heatmap';

      for (let y = minY; y <= maxY; y++) {
        const rowIndex = y * engine.width;
        const py = originY + y * cellSize;

        for (let x = minX; x <= maxX; x++) {
          const index = rowIndex + x;

          if (engine.currentGrid[index] !== 1) continue;

          const px = originX + x * cellSize;
          const age = engine.ageGrid[index];

          if (isHeatmap) {
            if (age <= 1) {
              ctx.fillStyle = theme.cellNewColor;
            } else if (age < 12) {
              ctx.fillStyle = theme.cellColor;
            } else {
              ctx.fillStyle = theme.cellOldColor;
            }
          } else {
            ctx.fillStyle =
              age <= 1
                ? theme.cellNewColor
                : theme.cellColor;
          }

          if (cellStyle === 'rounded' && innerSize >= 6) {
            const radius = Math.min(2, innerSize / 4);

            ctx.beginPath();
            ctx.roundRect(
              px,
              py,
              innerSize,
              innerSize,
              radius
            );
            ctx.fill();
          } else if (cellStyle === 'dots' && innerSize >= 4) {
            const radius = innerSize / 2;

            ctx.beginPath();
            ctx.arc(
              px + radius,
              py + radius,
              radius,
              0,
              Math.PI * 2
            );
            ctx.fill();
          } else {
            ctx.fillRect(px, py, innerSize, innerSize);
          }
        }
      }

      // Pattern placement preview
      if (
        activeTool === 'stamp' &&
        selectedPattern &&
        screenToGrid
      ) {
        const mouse = lastMousePosRef.current;

        const { x: hoverX, y: hoverY, inBounds } =
          screenToGrid(mouse.x, mouse.y);

        if (inBounds) {
          const grid = selectedPattern.grid;
          const rows = grid.length;
          const cols = grid[0]?.length ?? 0;

          const offsetX = Math.floor(hoverX - cols / 2);
          const offsetY = Math.floor(hoverY - rows / 2);

          const boxX = originX + offsetX * cellSize;
          const boxY = originY + offsetY * cellSize;

          // Preview boundary
          ctx.save();

          ctx.strokeStyle = theme.accentColor;
          ctx.globalAlpha = 0.7;
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);

          ctx.strokeRect(
            boxX,
            boxY,
            cols * cellSize,
            rows * cellSize
          );

          ctx.setLineDash([]);

          // Ghost cells
          ctx.fillStyle = theme.accentColor;
          ctx.globalAlpha = 0.4;

          for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
              if (grid[row][col] !== 1) continue;

              const gx = offsetX + col;
              const gy = offsetY + row;

              if (
                gx < 0 ||
                gx >= engine.width ||
                gy < 0 ||
                gy >= engine.height
              ) {
                continue;
              }

              ctx.fillRect(
                originX + gx * cellSize,
                originY + gy * cellSize,
                innerSize,
                innerSize
              );
            }
          }

          ctx.restore();
        }
      }

      ctx.restore();

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // ----------------------------------------------------------------
  // Dynamic Minimum Zoom & Panning Clamping (Always Covers Screen)
  // ----------------------------------------------------------------

  const getMinZoom = useCallback(
    (rect?: DOMRect) => {
      const canvas = canvasRef.current;
      if (!canvas) return MIN_ZOOM;
      const r = rect || canvas.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return MIN_ZOOM;
      const baseW = engine.width * BASE_CELL_SIZE;
      const baseH = engine.height * BASE_CELL_SIZE;
      // Exact zoom scale where the grid covers the entire canvas (max of width/height ratio)
      const coverZoom = Math.max(r.width / baseW, r.height / baseH);
      return Math.min(MAX_ZOOM, Math.max(0.1, Number(coverZoom.toFixed(2))));
    },
    [engine.width, engine.height]
  );

  const clampPan = (
    panX: number,
    panY: number,
    zoom: number,
    viewW: number,
    viewH: number
  ) => {
    const gW = engine.width * BASE_CELL_SIZE * zoom;
    const gH = engine.height * BASE_CELL_SIZE * zoom;
    const maxPanX = Math.max(0, (gW - viewW) / 2);
    const maxPanY = Math.max(0, (gH - viewH) / 2);
    return {
      panX: Math.min(maxPanX, Math.max(-maxPanX, panX)),
      panY: Math.min(maxPanY, Math.max(-maxPanY, panY)),
    };
  };

  // ----------------------------------------------------------------
  // Mouse interactions
  // ----------------------------------------------------------------

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const minZoom = getMinZoom(rect);

    const factor = e.deltaY < 0 ? 1.12 : 0.89;

    const newZoom = Math.min(
      MAX_ZOOM,
      Math.max(minZoom, transform.zoom * factor)
    );

    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    const scale = newZoom / transform.zoom;

    const rawPanX = mouseX - (mouseX - transform.panX) * scale;
    const rawPanY = mouseY - (mouseY - transform.panY) * scale;
    const clamped = clampPan(rawPanX, rawPanY, newZoom, rect.width, rect.height);

    onTransformChange({
      zoom: newZoom,
      panX: clamped.panX,
      panY: clamped.panY,
    });
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (e.button === 2) e.preventDefault();

    isMouseDownRef.current = true;
    mouseButtonRef.current = e.button;

    lastMousePosRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    if (
      e.button === 1 ||
      activeTool === 'pan' ||
      e.shiftKey
    ) {
      return;
    }

    const { x, y, inBounds } = screenToGrid(
      e.clientX,
      e.clientY
    );

    if (!inBounds) return;

    if (activeTool === 'stamp' && selectedPattern) {
      placePattern(x, y);
      return;
    }

    if (activeTool === 'erase' || e.button === 2) {
      drawActionRef.current = 0;
    } else {
      drawActionRef.current =
        engine.getCell(x, y) === 1 ? 0 : 1;
    }

    const changed = engine.setCell(
      x,
      y,
      drawActionRef.current
    );

    if (changed) {
      soundFX.playCellTone(
        x + y,
        drawActionRef.current === 1
      );
      onCellModified();
    }

    lastDrawnCellRef.current = { x, y };
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const previous = lastMousePosRef.current;

    const dx = e.clientX - previous.x;
    const dy = e.clientY - previous.y;

    lastMousePosRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    const { x, y, inBounds } = updateHover(
      e.clientX,
      e.clientY
    );

    if (!isMouseDownRef.current) return;

    if (
      mouseButtonRef.current === 1 ||
      activeTool === 'pan' ||
      e.shiftKey
    ) {
      const canvas = canvasRef.current;
      const rect = canvas ? canvas.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      const clamped = clampPan(transform.panX + dx, transform.panY + dy, transform.zoom, rect.width, rect.height);

      onTransformChange({
        ...transform,
        panX: clamped.panX,
        panY: clamped.panY,
      });

      return;
    }

    if (activeTool === 'stamp') return;

    if (inBounds) {
      const previousCell = lastDrawnCellRef.current;

      if (
        previousCell &&
        (previousCell.x !== x || previousCell.y !== y)
      ) {
        drawLine(
          previousCell.x,
          previousCell.y,
          x,
          y,
          drawActionRef.current
        );
      }

      lastDrawnCellRef.current = { x, y };
    }
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    lastDrawnCellRef.current = null;
  };

  const handleMouseLeave = () => {
    isMouseDownRef.current = false;
    lastDrawnCellRef.current = null;
    setHoverCoord(null);
  };

  // ----------------------------------------------------------------
  // Touch interactions
  // ----------------------------------------------------------------

  const handleTouchStart = (
    e: React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];

      lastMousePosRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        dist: 0,
      };

      isMouseDownRef.current = true;

      const { x, y, inBounds } = screenToGrid(
        touch.clientX,
        touch.clientY
      );

      if (!inBounds) return;

      if (activeTool === 'stamp' && selectedPattern) {
        placePattern(x, y);
      } else if (
        activeTool === 'erase' ||
        activeTool === 'draw'
      ) {
        drawActionRef.current =
          activeTool === 'erase'
            ? 0
            : engine.getCell(x, y) === 1
              ? 0
              : 1;

        const changed = engine.setCell(
          x,
          y,
          drawActionRef.current
        );

        if (changed) {
          soundFX.playCellTone(
            x + y,
            drawActionRef.current === 1
          );
          onCellModified();
        }

        lastDrawnCellRef.current = { x, y };
      }
    } else if (e.touches.length === 2) {
      isMouseDownRef.current = false;
      lastDrawnCellRef.current = null;

      const [a, b] = Array.from(e.touches);

      const dx = a.clientX - b.clientX;
      const dy = a.clientY - b.clientY;

      touchStartRef.current = {
        x: (a.clientX + b.clientX) / 2,
        y: (a.clientY + b.clientY) / 2,
        dist: Math.hypot(dx, dy),
      };
    }
  };

  const handleTouchMove = (
    e: React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();

    if (
      e.touches.length === 1 &&
      touchStartRef.current
    ) {
      const touch = e.touches[0];

      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;

      if (activeTool === 'pan') {
        const canvas = canvasRef.current;
        const rect = canvas ? canvas.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
        const clamped = clampPan(transform.panX + dx, transform.panY + dy, transform.zoom, rect.width, rect.height);

        onTransformChange({
          ...transform,
          panX: clamped.panX,
          panY: clamped.panY,
        });

        touchStartRef.current.x = touch.clientX;
        touchStartRef.current.y = touch.clientY;

        return;
      }

      if (
        activeTool === 'draw' ||
        activeTool === 'erase'
      ) {
        const { x, y, inBounds } = screenToGrid(
          touch.clientX,
          touch.clientY
        );

        const previous = lastDrawnCellRef.current;

        if (inBounds && previous) {
          drawLine(
            previous.x,
            previous.y,
            x,
            y,
            drawActionRef.current
          );

          lastDrawnCellRef.current = { x, y };
        }
      }
    } else if (
      e.touches.length === 2 &&
      touchStartRef.current &&
      touchStartRef.current.dist > 0
    ) {
      const [a, b] = Array.from(e.touches);

      const dx = a.clientX - b.clientX;
      const dy = a.clientY - b.clientY;

      const distance = Math.hypot(dx, dy);
      const ratio = distance / touchStartRef.current.dist;

      const canvas = canvasRef.current;

      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const minZoom = getMinZoom(rect);

        const newZoom = Math.min(
          MAX_ZOOM,
          Math.max(minZoom, transform.zoom * ratio)
        );

        const centerX =
          (a.clientX + b.clientX) / 2 -
          rect.left -
          rect.width / 2;

        const centerY =
          (a.clientY + b.clientY) / 2 -
          rect.top -
          rect.height / 2;

        const scale = newZoom / transform.zoom;
        const rawPanX = centerX - (centerX - transform.panX) * scale;
        const rawPanY = centerY - (centerY - transform.panY) * scale;
        const clamped = clampPan(rawPanX, rawPanY, newZoom, rect.width, rect.height);

        onTransformChange({
          zoom: newZoom,
          panX: clamped.panX,
          panY: clamped.panY,
        });
      }

      touchStartRef.current.dist = distance;
    }
  };

  const handleTouchEnd = () => {
    isMouseDownRef.current = false;
    touchStartRef.current = null;
    lastDrawnCellRef.current = null;
  };

  // ----------------------------------------------------------------
  // Canvas
  // ----------------------------------------------------------------

  return (
    <canvas
      ref={canvasRef}
      className={`block h-full w-full select-none ${
        activeTool === 'pan'
          ? 'cursor-grab active:cursor-grabbing'
          : activeTool === 'stamp'
            ? 'cursor-cell'
            : 'cursor-crosshair'
      }`}
      style={{
        touchAction: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
      onContextMenu={(e) => e.preventDefault()}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    />
  );
};
