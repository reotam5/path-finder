import type { Cell, PathfindingResult } from '../types';
import { CellType } from '../types';

// Helper function to get neighbors of a cell
function getNeighbors(
  cell: Cell,
  grid: Cell[][],
  rows: number,
  cols: number
): Cell[] {
  const neighbors: Cell[] = [];
  const directions = [
    [-1, 0], // up
    [1, 0],  // down
    [0, -1], // left
    [0, 1]   // right
  ];

  for (const [dRow, dCol] of directions) {
    const newRow = cell.row + dRow;
    const newCol = cell.col + dCol;

    if (
      newRow >= 0 &&
      newRow < rows &&
      newCol >= 0 &&
      newCol < cols &&
      grid[newRow][newCol].type !== CellType.WALL
    ) {
      neighbors.push(grid[newRow][newCol]);
    }
  }

  return neighbors;
}

// Helper function to reconstruct path from parent map
function reconstructPath(
  start: Cell,
  end: Cell,
  parentMap: Map<string, Cell>
): Cell[] {
  const path: Cell[] = [];
  let current = end;

  while (current) {
    path.unshift(current);
    const key = `${current.row}-${current.col}`;
    const parent = parentMap.get(key);

    // Stop when we reach the start or when parent is the same as current (root)
    if (!parent || (parent.row === start.row && parent.col === start.col) ||
      (parent.row === current.row && parent.col === current.col)) {
      break;
    }
    current = parent;
  }

  return path;
}

// Helper function to create cell key
function getCellKey(cell: Cell): string {
  return `${cell.row}-${cell.col}`;
}

// Depth-First Search
export function dfs(
  grid: Cell[][],
  start: Cell,
  end: Cell,
  rows: number,
  cols: number
): PathfindingResult {
  const visited = new Set<string>();
  const parentMap = new Map<string, Cell>();
  const visitedCells: Cell[] = [];
  const stack: Cell[] = [start];

  // Mark start as the root (no parent)
  parentMap.set(getCellKey(start), start);

  while (stack.length > 0) {
    const current = stack.pop()!;
    const currentKey = getCellKey(current);

    if (visited.has(currentKey)) {
      continue;
    }

    visited.add(currentKey);
    visitedCells.push(current);

    if (current.row === end.row && current.col === end.col) {
      const path = reconstructPath(start, end, parentMap);
      return { path, visitedCells, found: true };
    }

    const neighbors = getNeighbors(current, grid, rows, cols);
    for (const neighbor of neighbors) {
      const neighborKey = getCellKey(neighbor);
      if (!visited.has(neighborKey)) {
        parentMap.set(neighborKey, current);
        stack.push(neighbor);
      }
    }
  }

  return { path: [], visitedCells, found: false };
}

// Breadth-First Search
export function bfs(
  grid: Cell[][],
  start: Cell,
  end: Cell,
  rows: number,
  cols: number
): PathfindingResult {
  const visited = new Set<string>();
  const parentMap = new Map<string, Cell>();
  const visitedCells: Cell[] = [];
  const queue: Cell[] = [start];

  // Mark start as the root (no parent)
  parentMap.set(getCellKey(start), start);
  visited.add(getCellKey(start));

  while (queue.length > 0) {
    const current = queue.shift()!;
    visitedCells.push(current);

    if (current.row === end.row && current.col === end.col) {
      const path = reconstructPath(start, end, parentMap);
      return { path, visitedCells, found: true };
    }

    const neighbors = getNeighbors(current, grid, rows, cols);
    for (const neighbor of neighbors) {
      const neighborKey = getCellKey(neighbor);
      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        parentMap.set(neighborKey, current);
        queue.push(neighbor);
      }
    }
  }

  return { path: [], visitedCells, found: false };
}

// A* Search
export function aStar(
  grid: Cell[][],
  start: Cell,
  end: Cell,
  rows: number,
  cols: number
): PathfindingResult {
  // Manhattan distance heuristic
  const heuristic = (cell: Cell): number => {
    return Math.abs(cell.row - end.row) + Math.abs(cell.col - end.col);
  };

  const openSet: Cell[] = [start];
  const closedSet = new Set<string>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const parentMap = new Map<string, Cell>();
  const visitedCells: Cell[] = [];

  gScore.set(getCellKey(start), 0);
  fScore.set(getCellKey(start), heuristic(start));

  while (openSet.length > 0) {
    // Find node with lowest fScore
    let current = openSet[0];
    let currentIndex = 0;

    for (let i = 1; i < openSet.length; i++) {
      const currentFScore = fScore.get(getCellKey(current)) || Infinity;
      const candidateFScore = fScore.get(getCellKey(openSet[i])) || Infinity;
      if (candidateFScore < currentFScore) {
        current = openSet[i];
        currentIndex = i;
      }
    }

    openSet.splice(currentIndex, 1);
    const currentKey = getCellKey(current);
    closedSet.add(currentKey);
    visitedCells.push(current);

    if (current.row === end.row && current.col === end.col) {
      const path = reconstructPath(start, end, parentMap);
      return { path, visitedCells, found: true };
    }

    const neighbors = getNeighbors(current, grid, rows, cols);
    for (const neighbor of neighbors) {
      const neighborKey = getCellKey(neighbor);

      if (closedSet.has(neighborKey)) {
        continue;
      }

      const tentativeGScore = (gScore.get(currentKey) || 0) + 1;

      if (!openSet.some(cell => getCellKey(cell) === neighborKey)) {
        openSet.push(neighbor);
      } else if (tentativeGScore >= (gScore.get(neighborKey) || 0)) {
        continue;
      }

      parentMap.set(neighborKey, current);
      gScore.set(neighborKey, tentativeGScore);
      fScore.set(neighborKey, tentativeGScore + heuristic(neighbor));
    }
  }

  return { path: [], visitedCells, found: false };
}

// Bidirectional Search
export function bidirectionalSearch(
  grid: Cell[][],
  start: Cell,
  end: Cell,
  rows: number,
  cols: number
): PathfindingResult {
  const visitedFromStart = new Set<string>();
  const visitedFromEnd = new Set<string>();
  const parentFromStart = new Map<string, Cell>();
  const parentFromEnd = new Map<string, Cell>();
  const queueFromStart: Cell[] = [start];
  const queueFromEnd: Cell[] = [end];
  const visitedCells: Cell[] = [];

  visitedFromStart.add(getCellKey(start));
  visitedFromEnd.add(getCellKey(end));

  while (queueFromStart.length > 0 && queueFromEnd.length > 0) {
    // Expand from start
    if (queueFromStart.length > 0) {
      const current = queueFromStart.shift()!;
      const currentKey = getCellKey(current);
      visitedCells.push(current);

      if (visitedFromEnd.has(currentKey)) {
        // Found intersection
        const pathFromStart = reconstructPath(start, current, parentFromStart);
        const pathFromEnd = reconstructPath(end, current, parentFromEnd);
        pathFromEnd.reverse();
        pathFromEnd.shift(); // Remove duplicate intersection cell
        const fullPath = [...pathFromStart, ...pathFromEnd];
        return { path: fullPath, visitedCells, found: true };
      }

      const neighbors = getNeighbors(current, grid, rows, cols);
      for (const neighbor of neighbors) {
        const neighborKey = getCellKey(neighbor);
        if (!visitedFromStart.has(neighborKey)) {
          visitedFromStart.add(neighborKey);
          parentFromStart.set(neighborKey, current);
          queueFromStart.push(neighbor);
        }
      }
    }

    // Expand from end
    if (queueFromEnd.length > 0) {
      const current = queueFromEnd.shift()!;
      const currentKey = getCellKey(current);
      visitedCells.push(current);

      if (visitedFromStart.has(currentKey)) {
        // Found intersection
        const pathFromStart = reconstructPath(start, current, parentFromStart);
        const pathFromEnd = reconstructPath(end, current, parentFromEnd);
        pathFromEnd.reverse();
        pathFromEnd.shift(); // Remove duplicate intersection cell
        const fullPath = [...pathFromStart, ...pathFromEnd];
        return { path: fullPath, visitedCells, found: true };
      }

      const neighbors = getNeighbors(current, grid, rows, cols);
      for (const neighbor of neighbors) {
        const neighborKey = getCellKey(neighbor);
        if (!visitedFromEnd.has(neighborKey)) {
          visitedFromEnd.add(neighborKey);
          parentFromEnd.set(neighborKey, current);
          queueFromEnd.push(neighbor);
        }
      }
    }
  }

  return { path: [], visitedCells, found: false };
}