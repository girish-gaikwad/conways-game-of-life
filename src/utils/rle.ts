// RLE (Run Length Encoded) Parser & Serializer for Conway's Game of Life

export interface ParsedRLE {
  name?: string;
  author?: string;
  comments?: string[];
  width: number;
  height: number;
  rule?: string;
  grid: number[][];
}

export function parseRLE(rleString: string): ParsedRLE {
  const lines = rleString.trim().split(/\r?\n/);
  const comments: string[] = [];
  let name = 'Custom RLE Pattern';
  let author: string | undefined;
  let headerFound = false;
  let width = 0;
  let height = 0;
  let rule = 'B3/S23';
  let dataLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('#')) {
      if (trimmed.startsWith('#N')) {
        name = trimmed.substring(2).trim();
      } else if (trimmed.startsWith('#O')) {
        author = trimmed.substring(2).trim();
      } else if (trimmed.startsWith('#C') || trimmed.startsWith('#c')) {
        comments.push(trimmed.substring(2).trim());
      }
      continue;
    }

    if (!headerFound && (trimmed.startsWith('x') || trimmed.startsWith('X'))) {
      headerFound = true;
      const parts = trimmed.split(',');
      for (const part of parts) {
        const [k, v] = part.split('=').map((s) => s.trim().toLowerCase());
        if (k === 'x') width = parseInt(v, 10);
        if (k === 'y') height = parseInt(v, 10);
        if (k === 'rule') rule = v;
      }
      continue;
    }

    // Data line
    dataLines.push(trimmed);
  }

  const rawData = dataLines.join('');
  const grid: number[][] = [];
  let currentRow: number[] = [];
  let currentCount = 0;

  for (let i = 0; i < rawData.length; i++) {
    const char = rawData[i];

    if (char >= '0' && char <= '9') {
      currentCount = currentCount * 10 + parseInt(char, 10);
    } else if (char === 'b') {
      // Dead cell
      const count = currentCount === 0 ? 1 : currentCount;
      for (let c = 0; c < count; c++) currentRow.push(0);
      currentCount = 0;
    } else if (char === 'o' || char === 'A') {
      // Live cell
      const count = currentCount === 0 ? 1 : currentCount;
      for (let c = 0; c < count; c++) currentRow.push(1);
      currentCount = 0;
    } else if (char === '$') {
      // End of line
      const count = currentCount === 0 ? 1 : currentCount;
      // Pad row to width if needed
      while (width > 0 && currentRow.length < width) currentRow.push(0);
      grid.push(currentRow);
      for (let emptyRow = 1; emptyRow < count; emptyRow++) {
        grid.push(new Array(width || currentRow.length).fill(0));
      }
      currentRow = [];
      currentCount = 0;
    } else if (char === '!') {
      // End of pattern
      if (currentRow.length > 0) {
        while (width > 0 && currentRow.length < width) currentRow.push(0);
        grid.push(currentRow);
      }
      break;
    }
  }

  // Final fallback if width/height weren't parsed
  const actualHeight = grid.length;
  const actualWidth = grid.reduce((max, row) => Math.max(max, row.length), 0);

  // Normalize grid rows
  const normalizedGrid = grid.map((row) => {
    while (row.length < actualWidth) row.push(0);
    return row;
  });

  return {
    name,
    author,
    comments,
    width: width || actualWidth,
    height: height || actualHeight,
    rule,
    grid: normalizedGrid.length > 0 ? normalizedGrid : [[1]],
  };
}

export function encodeRLE(grid: number[][], name: string = 'Exported Pattern'): string {
  const rows = grid.length;
  if (rows === 0) return '';
  const cols = grid[0].length;

  let result = `#N ${name}\n`;
  result += `#O Conway Lab\n`;
  result += `x = ${cols}, y = ${rows}, rule = B3/S23\n`;

  let currentTag = '';
  let count = 0;
  let lineBuffer = '';

  const flush = (tag: string, runLength: number) => {
    if (runLength === 0) return '';
    return runLength === 1 ? tag : `${runLength}${tag}`;
  };

  for (let r = 0; r < rows; r++) {
    // Find last live cell in this row to avoid trailing dead cells
    let lastLiveCol = -1;
    for (let c = cols - 1; c >= 0; c--) {
      if (grid[r][c] === 1) {
        lastLiveCol = c;
        break;
      }
    }

    if (lastLiveCol === -1) {
      // Blank row
      lineBuffer += '$';
      continue;
    }

    for (let c = 0; c <= lastLiveCol; c++) {
      const tag = grid[r][c] === 1 ? 'o' : 'b';
      if (tag === currentTag) {
        count++;
      } else {
        if (count > 0) {
          lineBuffer += flush(currentTag, count);
        }
        currentTag = tag;
        count = 1;
      }
    }

    if (count > 0) {
      lineBuffer += flush(currentTag, count);
      currentTag = '';
      count = 0;
    }

    lineBuffer += '$';

    if (lineBuffer.length >= 65) {
      result += lineBuffer + '\n';
      lineBuffer = '';
    }
  }

  if (lineBuffer.endsWith('$')) {
    lineBuffer = lineBuffer.slice(0, -1);
  }
  lineBuffer += '!';
  result += lineBuffer + '\n';

  return result;
}
