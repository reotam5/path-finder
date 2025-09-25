export const GRID_CONFIG = {
  ROWS: 20,
  COLS: 30,
  CELL_SIZE: 25, // Size in pixels
} as const;

export const COLORS = {
  EMPTY: '#ffffff',
  WALL: '#2d3748',
  START: '#48bb78',
  END: '#ed8936',
  PATH: '#4299e1',
  VISITED: '#e2e8f0',
  BORDER: '#cbd5e0'
} as const;