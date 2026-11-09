import React, { useRef, useEffect, useCallback } from 'react';
import { LifeEngine } from '../core/lifeEngine';
import { CellStyle, Pattern, Theme, ToolType, ViewportTransform } from '../types/game';
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
  const isMouseDownRef = useRef(false);
  const mouseButtonRef = useRef<number>(0);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastDrawnCellRef = useRef<{ x: number; y: number } | null>(null);
  const drawActionRef = useRef<number>(1); // 1 = draw alive, 0 = erase

  // Convert screen coordinates to grid coordinates
  const screenToGrid = useCallback(
    (screenX: number, screenY: number): { x: number; y: number; inBounds: boolean } => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0, inBounds: false };

      const rect = canvas.getBoundingClientRect();
      const cssX = screenX - rect.left;
      const cssY = screenY - rect.top;

      const baseCellSize = 16;
      const effectiveCellSize = baseCellSize * transform.zoom;

      const gridOriginX = rect.width / 2 + transform.panX - (engine.width * effectiveCellSize) / 2;
      const gridOriginY = rect.height / 2 + transform.panY - (engine.height * effectiveCellSize) / 2;

      const cellX = Math.floor((cssX - gridOriginX) / effectiveCellSize);
      const cellY = Math.floor((cssY - gridOriginY) / effectiveCellSize);

      const inBounds = cellX >= 0 && cellX < engine.width && cellY >= 0 && cellY < engine.height;

      return { x: cellX, y: cellY, inBounds };
    },
    [transform, engine.width, engine.height]
  );

  // Line drawing interpolation
  const drawLine = useCallback(
    (x0: number, y0: number, x1: number, y1: number, state: number) => {
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx - dy;

      let currX = x0;
      let currY = y0;

      let changed = false;
      while (true) {
        if (currX >= 0 && currX < engine.width && currY >= 0 && currY < engine.height) {
          const mod = engine.setCell(currX, currY, state);
          if (mod) changed = true;
        }

        if (currX === x1 && currY === y1) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          currX += sx;
        }
        if (e2 < dx) {
          err += dx;
          currY += sy;
        }
      }

      if (changed) {
        soundFX.playCellTone(x1 + y1, state === 1);
        onCellModified();
      }
    },
    [engine, onCellModified]
  );

  // High-performance requestAnimationFrame loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const dpr = window.devicePixelRatio || 1;

      // 1. Dark Background
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.scale(dpr, dpr);

      const cssWidth = width / dpr;
      const cssHeight = height / dpr;

      const baseCellSize = 16;
      const effectiveCellSize = baseCellSize * transform.zoom;

      const originX = cssWidth / 2 + transform.panX - (engine.width * effectiveCellSize) / 2;
      const originY = cssHeight / 2 + transform.panY - (engine.height * effectiveCellSize) / 2;

      // Culling visible bounds
      const minX = Math.max(0, Math.floor(-originX / effectiveCellSize));
      const maxX = Math.min(engine.width - 1, Math.ceil((cssWidth - originX) / effectiveCellSize));
      const minY = Math.max(0, Math.floor(-originY / effectiveCellSize));
      const maxY = Math.min(engine.height - 1, Math.ceil((cssHeight - originY) / effectiveCellSize));

      const gridPxWidth = engine.width * effectiveCellSize;
      const gridPxHeight = engine.height * effectiveCellSize;

      // 2. Grid guidelines with contrast fade
      if (showGridLines && effectiveCellSize >= 5) {
        ctx.beginPath();
        ctx.strokeStyle = theme.gridLineColor;
        ctx.lineWidth = 0.5;

        const lineAlpha = Math.min(1, (effectiveCellSize - 5) / 10);
        ctx.globalAlpha = lineAlpha;

        for (let x = minX; x <= maxX + 1; x++) {
          const px = originX + x * effectiveCellSize;
          ctx.moveTo(px, originY);
          ctx.lineTo(px, originY + gridPxHeight);
        }

        for (let y = minY; y <= maxY + 1; y++) {
          const py = originY + y * effectiveCellSize;
          ctx.moveTo(originX, py);
          ctx.lineTo(originX + gridPxWidth, py);
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }

      // 3. Grid Perimeter Border
      ctx.strokeStyle = '#28332C';
      ctx.lineWidth = 1;
      ctx.strokeRect(originX, originY, gridPxWidth, gridPxHeight);

      // 4. Living Cells
      const cellGap = effectiveCellSize >= 4 ? 1 : 0;
      const cellInnerSize = Math.max(1, effectiveCellSize - cellGap);
      const isHeatmap = cellStyle === 'heatmap';

      for (let y = minY; y <= maxY; y++) {
        const rowIdx = y * engine.width;
        const cellY = originY + y * effectiveCellSize;

        for (let x = minX; x <= maxX; x++) {
          const idx = rowIdx + x;
          if (engine.currentGrid[idx] === 1) {
            const cellX = originX + x * effectiveCellSize;
            const age = engine.ageGrid[idx];

            if (isHeatmap) {
              if (age <= 1) {
                ctx.fillStyle = theme.cellNewColor;
              } else if (age < 12) {
                ctx.fillStyle = theme.cellColor;
              } else {
                ctx.fillStyle = theme.cellOldColor;
              }
            } else {
              ctx.fillStyle = age <= 1 ? theme.cellNewColor : theme.cellColor;
            }

            if (cellStyle === 'rounded' && cellInnerSize >= 6) {
              const radius = Math.min(2, cellInnerSize / 4);
              ctx.beginPath();
              ctx.roundRect(cellX, cellY, cellInnerSize, cellInnerSize, radius);
              ctx.fill();
            } else if (cellStyle === 'dots' && cellInnerSize >= 4) {
              const r = cellInnerSize / 2;
              ctx.beginPath();
              ctx.arc(cellX + r, cellY + r, r, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillRect(cellX, cellY, cellInnerSize, cellInnerSize);
            }
          }
        }
      }

      // 5. Ghost Pattern Preview for Stamping
      if (activeTool === 'stamp' && selectedPattern && lastMousePosRef.current) {
        const { x: hx, y: hy, inBounds } = screenToGrid(
          lastMousePosRef.current.x,
          lastMousePosRef.current.y
        );

        if (inBounds) {
          const pGrid = selectedPattern.grid;
          const pRows = pGrid.length;
          const pCols = pGrid[0].length;
          const ox = Math.floor(hx - pCols / 2);
          const oy = Math.floor(hy - pRows / 2);

          // Pattern bounding box outline
          const bPx = originX + ox * effectiveCellSize;
          const bPy = originY + oy * effectiveCellSize;
          const bW = pCols * effectiveCellSize;
          const bH = pRows * effectiveCellSize;

          ctx.strokeStyle = 'rgba(166, 217, 106, 0.4)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(bPx, bPy, bW, bH);
          ctx.setLineDash([]);

          ctx.fillStyle = 'rgba(166, 217, 106, 0.4)';
          for (let r = 0; r < pRows; r++) {
            for (let c = 0; c < pCols; c++) {
              if (pGrid[r][c] === 1) {
                const gx = ox + c;
                const gy = oy + r;
                if (gx >= 0 && gx < engine.width && gy >= 0 && gy < engine.height) {
                  const px = originX + gx * effectiveCellSize;
                  const py = originY + gy * effectiveCellSize;
                  ctx.fillRect(px, py, cellInnerSize, cellInnerSize);
                }
              }
            }
          }
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    engine,
    theme,
    cellStyle,
    showGridLines,
    activeTool,
    selectedPattern,
    transform,
    screenToGrid,
  ]);

  // Window Resize & High DPI
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const newZoom = Math.min(Math.max(0.2, transform.zoom * zoomFactor), 6.0);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    const scale = newZoom / transform.zoom;
    const newPanX = mouseX - (mouseX - transform.panX) * scale;
    const newPanY = mouseY - (mouseY - transform.panY) * scale;

    onTransformChange({
      panX: newPanX,
      panY: newPanY,
      zoom: newZoom,
    });
  };

  // Mouse Down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    isMouseDownRef.current = true;
    mouseButtonRef.current = e.button;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    // Middle click or space+click or Pan tool => start panning
    if (e.button === 1 || activeTool === 'pan' || e.shiftKey) {
      return;
    }

    const { x, y, inBounds } = screenToGrid(e.clientX, e.clientY);
    if (!inBounds) return;

    if (activeTool === 'stamp' && selectedPattern) {
      engine.stampPattern(selectedPattern.grid, x, y, true);
      soundFX.playCellTone(x + y, true);
      onCellModified();
      if (onPatternPlaced) onPatternPlaced();
      return;
    }

    if (activeTool === 'erase' || e.button === 2) {
      drawActionRef.current = 0;
      engine.setCell(x, y, 0);
      soundFX.playCellTone(x + y, false);
      onCellModified();
    } else {
      const currentlyAlive = engine.getCell(x, y) === 1;
      drawActionRef.current = currentlyAlive ? 0 : 1;
      engine.setCell(x, y, drawActionRef.current);
      soundFX.playCellTone(x + y, drawActionRef.current === 1);
      onCellModified();
    }

    lastDrawnCellRef.current = { x, y };
  };

  // Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    const { x, y, inBounds } = screenToGrid(e.clientX, e.clientY);
    if (inBounds) {
      setHoverCoord({ x, y });
    } else {
      setHoverCoord(null);
    }

    if (!isMouseDownRef.current) return;

    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    if (mouseButtonRef.current === 1 || activeTool === 'pan' || e.shiftKey) {
      onTransformChange({
        ...transform,
        panX: transform.panX + (e.movementX || dx),
        panY: transform.panY + (e.movementY || dy),
      });
      return;
    }

    if (activeTool === 'stamp') return;

    if (inBounds) {
      const prev = lastDrawnCellRef.current;
      if (prev && (prev.x !== x || prev.y !== y)) {
        drawLine(prev.x, prev.y, x, y, drawActionRef.current);
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

  // Touch handlers
  const touchStartRef = useRef<{ x: number; y: number; dist: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
      touchStartRef.current = { x: touch.clientX, y: touch.clientY, dist: 0 };
      isMouseDownRef.current = true;

      const { x, y, inBounds } = screenToGrid(touch.clientX, touch.clientY);
      if (inBounds) {
        if (activeTool === 'stamp' && selectedPattern) {
          engine.stampPattern(selectedPattern.grid, x, y, true);
          soundFX.playCellTone(x + y, true);
          onCellModified();
          if (onPatternPlaced) onPatternPlaced();
        } else if (activeTool === 'erase') {
          drawActionRef.current = 0;
          engine.setCell(x, y, 0);
          onCellModified();
        } else if (activeTool === 'draw') {
          const alive = engine.getCell(x, y) === 1;
          drawActionRef.current = alive ? 0 : 1;
          engine.setCell(x, y, drawActionRef.current);
          onCellModified();
        }
        lastDrawnCellRef.current = { x, y };
      }
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      touchStartRef.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        dist,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1 && touchStartRef.current) {
      const touch = e.touches[0];
      const moveX = touch.clientX - touchStartRef.current.x;
      const moveY = touch.clientY - touchStartRef.current.y;

      if (activeTool === 'pan') {
        onTransformChange({
          ...transform,
          panX: transform.panX + moveX,
          panY: transform.panY + moveY,
        });
        touchStartRef.current.x = touch.clientX;
        touchStartRef.current.y = touch.clientY;
      } else {
        const { x, y, inBounds } = screenToGrid(touch.clientX, touch.clientY);
        if (inBounds && lastDrawnCellRef.current) {
          drawLine(lastDrawnCellRef.current.x, lastDrawnCellRef.current.y, x, y, drawActionRef.current);
          lastDrawnCellRef.current = { x, y };
        }
      }
    } else if (e.touches.length === 2 && touchStartRef.current && touchStartRef.current.dist > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const ratio = dist / touchStartRef.current.dist;
      const newZoom = Math.min(Math.max(0.2, transform.zoom * ratio), 6.0);
      onTransformChange({
        ...transform,
        zoom: newZoom,
      });
      touchStartRef.current.dist = dist;
    }
  };

  const handleTouchEnd = () => {
    isMouseDownRef.current = false;
    touchStartRef.current = null;
    lastDrawnCellRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block ${
        activeTool === 'pan' ? 'cursor-grab active:cursor-grabbing' :
        activeTool === 'stamp' ? 'cursor-cell' :
        activeTool === 'erase' ? 'cursor-crosshair' : 'cursor-crosshair'
      }`}
      onContextMenu={(e) => e.preventDefault()}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
};
