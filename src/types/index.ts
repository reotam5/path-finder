export const CellType = {
  EMPTY: 'empty',
  WALL: 'wall',
  START: 'start',
  END: 'end',
  PATH: 'path',
  VISITED: 'visited'
} as const;

export type CellType = typeof CellType[keyof typeof CellType];

export interface Cell {
  row: number;
  col: number;
  type: CellType;
  isPath?: boolean;
  isVisited?: boolean;
}

export interface GridProps {
  rows: number;
  cols: number;
}

export const Algorithm = {
  DFS: 'dfs',
  BFS: 'bfs',
  A_STAR: 'a-star',
  BIDIRECTIONAL: 'bidirectional'
} as const;

export type Algorithm = typeof Algorithm[keyof typeof Algorithm];

export interface PathfindingResult {
  path: Cell[];
  visitedCells: Cell[];
  found: boolean;
}