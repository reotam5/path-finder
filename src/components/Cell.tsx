import { cn } from '@/lib/utils';
import React from 'react';
import { GRID_CONFIG } from '../constants';
import type { Cell as CellType } from '../types';
import { CellType as CellTypeEnum } from '../types';

interface CellProps {
  cell: CellType;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

const Cell: React.FC<CellProps> = ({
  cell,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}) => {
  const getCellClasses = (cell: CellType) => {
    const baseClasses = "border border-gray-200 cursor-pointer transition-all duration-150 hover:opacity-80";

    if (cell.type === CellTypeEnum.START) {
      return cn(baseClasses, "bg-green-500 border-green-600");
    }
    if (cell.type === CellTypeEnum.END) {
      return cn(baseClasses, "bg-red-500 border-red-600");
    }

    // Handle path visualization with priority
    if (cell.isPath) {
      return cn(baseClasses, "bg-yellow-400 border-yellow-500 animate-pulse");
    }
    if (cell.isVisited) {
      return cn(baseClasses, "bg-blue-200 border-blue-300");
    }

    switch (cell.type) {
      case CellTypeEnum.WALL:
        return cn(baseClasses, "bg-slate-800 border-slate-700");
      default:
        return cn(baseClasses, "bg-white hover:bg-gray-50");
    }
  };

  return (
    <div
      className={getCellClasses(cell)}
      style={{
        width: `${GRID_CONFIG.CELL_SIZE}px`,
        height: `${GRID_CONFIG.CELL_SIZE}px`,
      }}
      onMouseDown={() => onMouseDown(cell.row, cell.col)}
      onMouseEnter={() => onMouseEnter(cell.row, cell.col)}
      onMouseUp={onMouseUp}
    />
  );
};

export default Cell;