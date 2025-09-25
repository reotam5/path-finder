import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { Eraser, MapPin, MousePointer, Play, RotateCcw, Square, Target, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { aStar, bfs, bidirectionalSearch, dfs } from '../algorithms';
import { GRID_CONFIG } from '../constants';
import { useTranslations } from '../i18n';
import type { Cell as CellType } from '../types';
import { Algorithm, CellType as CellTypeEnum } from '../types';
import Cell from './Cell';
import { LanguageSelector } from './LanguageSelector';

interface GridProps {
  rows?: number;
  cols?: number;
}

type ToolType = 'wall' | 'eraser' | 'start' | 'end';

const Grid: React.FC<GridProps> = ({
  rows = GRID_CONFIG.ROWS,
  cols = GRID_CONFIG.COLS
}) => {
  const { t } = useTranslations();
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [selectedTool, setSelectedTool] = useState<ToolType>('wall');
  const [startPosition, setStartPosition] = useState<{ row: number; col: number } | null>(null);
  const [endPosition, setEndPosition] = useState<{ row: number; col: number } | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>(Algorithm.BFS);
  const [isRunning, setIsRunning] = useState(false);
  const isDrawingRef = useRef(false);
  const lastToggledRef = useRef<{ row: number; col: number } | null>(null);

  // Initialize grid
  const initializeGrid = useCallback(() => {
    const newGrid: CellType[][] = [];

    // Default start and end positions
    const defaultStart = { row: Math.floor(rows / 2), col: Math.floor(cols / 4) };
    const defaultEnd = { row: Math.floor(rows / 2), col: Math.floor((3 * cols) / 4) };

    for (let row = 0; row < rows; row++) {
      const currentRow: CellType[] = [];
      for (let col = 0; col < cols; col++) {
        let cellType: CellType['type'] = CellTypeEnum.EMPTY;

        // Set default start position
        if (row === defaultStart.row && col === defaultStart.col) {
          cellType = CellTypeEnum.START;
        }
        // Set default end position
        else if (row === defaultEnd.row && col === defaultEnd.col) {
          cellType = CellTypeEnum.END;
        }

        currentRow.push({
          row,
          col,
          type: cellType
        });
      }
      newGrid.push(currentRow);
    }

    setGrid(newGrid);
    setStartPosition(defaultStart);
    setEndPosition(defaultEnd);
  }, [rows, cols]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  // Apply tool to cell
  const applyTool = useCallback((row: number, col: number) => {
    setGrid(prevGrid => {
      if (lastToggledRef.current && lastToggledRef.current.row === row && lastToggledRef.current.col === col) {
        return prevGrid;
      }
      lastToggledRef.current = { row, col };
      const newGrid = [...prevGrid];
      const currentCell = newGrid[row][col];

      let newCellType: CellType['type'];

      // Handle different tool types
      switch (selectedTool) {
        case 'wall':
          newCellType = CellTypeEnum.WALL;
          break;
        case 'eraser':
          newCellType = CellTypeEnum.EMPTY;
          break;
        case 'start':
          // Remove previous start position
          if (startPosition) {
            newGrid[startPosition.row][startPosition.col] = {
              ...newGrid[startPosition.row][startPosition.col],
              type: CellTypeEnum.EMPTY
            };
          }
          newCellType = CellTypeEnum.START;
          setStartPosition({ row, col });
          break;
        case 'end':
          // Remove previous end position
          if (endPosition) {
            newGrid[endPosition.row][endPosition.col] = {
              ...newGrid[endPosition.row][endPosition.col],
              type: CellTypeEnum.EMPTY
            };
          }
          newCellType = CellTypeEnum.END;
          setEndPosition({ row, col });
          break;
        default:
          newCellType = CellTypeEnum.EMPTY;
      }

      newGrid[row][col] = {
        ...currentCell,
        type: newCellType
      };
      return newGrid;
    });
  }, [selectedTool, startPosition, endPosition]);

  // Handle mouse events for drawing
  const handleMouseDown = useCallback((row: number, col: number) => {
    // Start and end tools should only work on single clicks, not drag
    if (selectedTool === 'start' || selectedTool === 'end') {
      applyTool(row, col);
      return;
    }

    isDrawingRef.current = true;
    lastToggledRef.current = null; // Reset for new drawing operation
    applyTool(row, col);
  }, [applyTool, selectedTool]);

  const handleMouseEnter = useCallback((row: number, col: number) => {
    // Only allow dragging for wall and eraser tools
    if (isDrawingRef.current && (selectedTool === 'wall' || selectedTool === 'eraser')) {
      applyTool(row, col);
    }
  }, [applyTool, selectedTool]);

  const handleMouseUp = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  // Clear grid
  const clearGrid = () => {
    initializeGrid();
  };

  // Clear path visualization
  const clearPath = () => {
    setGrid(prevGrid => {
      return prevGrid.map(row =>
        row.map(cell => ({
          ...cell,
          isPath: false,
          isVisited: false
        }))
      );
    });
  };

  // Run pathfinding algorithm
  const runPathfinding = async () => {
    if (!startPosition || !endPosition || isRunning) {
      return;
    }

    setIsRunning(true);
    clearPath();

    const startCell = grid[startPosition.row][startPosition.col];
    const endCell = grid[endPosition.row][endPosition.col];

    let result;
    switch (selectedAlgorithm) {
      case Algorithm.DFS:
        result = dfs(grid, startCell, endCell, rows, cols);
        break;
      case Algorithm.BFS:
        result = bfs(grid, startCell, endCell, rows, cols);
        break;
      case Algorithm.A_STAR:
        result = aStar(grid, startCell, endCell, rows, cols);
        break;
      case Algorithm.BIDIRECTIONAL:
        result = bidirectionalSearch(grid, startCell, endCell, rows, cols);
        break;
      default:
        result = bfs(grid, startCell, endCell, rows, cols);
    }

    // Animate visited cells
    for (let i = 0; i < result.visitedCells.length; i++) {
      setTimeout(() => {
        const cell = result.visitedCells[i];
        setGrid(prevGrid => {
          const newGrid = [...prevGrid];
          newGrid[cell.row][cell.col] = {
            ...newGrid[cell.row][cell.col],
            isVisited: true
          };
          return newGrid;
        });
      }, i * 20); // 20ms delay between each cell
    }

    // Animate path if found
    if (result.found && result.path.length > 0) {
      setTimeout(() => {
        for (let i = 0; i < result.path.length; i++) {
          setTimeout(() => {
            const cell = result.path[i];
            setGrid(prevGrid => {
              const newGrid = [...prevGrid];
              newGrid[cell.row][cell.col] = {
                ...newGrid[cell.row][cell.col],
                isPath: true
              };
              return newGrid;
            });
          }, i * 30); // 30ms delay between each path cell
        }
      }, result.visitedCells.length * 20 + 100); // Wait for visited animation + buffer
    }

    setTimeout(() => {
      setIsRunning(false);
    }, result.visitedCells.length * 20 + result.path.length * 30 + 200);
  };

  return (
    <div className="w-full mx-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
      {/* Header with Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1"></div>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold">{t.app.title}</h2>
            {isRunning && (
              <Badge variant="secondary" className="animate-pulse mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {t.status.running} {selectedAlgorithm}
              </Badge>
            )}
          </div>
          <div className="flex-1 flex justify-end">
            <LanguageSelector />
          </div>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm text-center">
          {t.app.subtitle}
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Drawing Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <MousePointer className="w-4 h-4" />
              {t.tools.drawingToolsTitle}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {t.tools.drawingToolsDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleGroup
              type="single"
              value={selectedTool}
              onValueChange={(value) => value && setSelectedTool(value as ToolType)}
              className="flex flex-wrap"
            >
              <ToggleGroupItem
                value="start"
                className="flex flex-col gap-1 h-auto py-2 sm:py-3"
                disabled={isRunning}
              >
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                <span className="text-xs">{t.tools.start}</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="end"
                className="flex flex-col gap-1 h-auto py-2 sm:py-3"
                disabled={isRunning}
              >
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                <span className="text-xs">{t.tools.end}</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="wall"
                className="flex flex-col gap-1 h-auto py-2 sm:py-3"
                disabled={isRunning}
              >
                <Square className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs">{t.tools.wall}</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="eraser"
                className="flex flex-col gap-1 h-auto py-2 sm:py-3"
                disabled={isRunning}
              >
                <Eraser className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs">{t.tools.eraser}</span>
              </ToggleGroupItem>
            </ToggleGroup>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={clearPath}
                  variant="outline"
                  className="flex-1 text-xs sm:text-sm"
                  disabled={isRunning}
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  {t.actions.clearPath}
                </Button>
                <Button
                  onClick={clearGrid}
                  variant="outline"
                  className="flex-1 text-xs sm:text-sm"
                  disabled={isRunning}
                >
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  {t.actions.resetGrid}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Target className="w-4 h-4" />
              {t.algorithms.title}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {t.algorithms.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedAlgorithm}
              onValueChange={(value) => setSelectedAlgorithm(value as Algorithm)}
              disabled={isRunning}
            >
              <SelectTrigger className="w-full text-xs sm:text-sm">
                <SelectValue placeholder={t.algorithms.selectPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Algorithm.BFS}>
                  <div className="flex flex-col items-start">
                    <span className="text-xs sm:text-sm">{t.algorithms.bfs.name}</span>
                    <span className="text-xs text-muted-foreground">{t.algorithms.bfs.description}</span>
                  </div>
                </SelectItem>
                <SelectItem value={Algorithm.DFS}>
                  <div className="flex flex-col items-start">
                    <span className="text-xs sm:text-sm">{t.algorithms.dfs.name}</span>
                    <span className="text-xs text-muted-foreground">{t.algorithms.dfs.description}</span>
                  </div>
                </SelectItem>
                <SelectItem value={Algorithm.A_STAR}>
                  <div className="flex flex-col items-start">
                    <span className="text-xs sm:text-sm">{t.algorithms.aStar.name}</span>
                    <span className="text-xs text-muted-foreground">{t.algorithms.aStar.description}</span>
                  </div>
                </SelectItem>
                <SelectItem value={Algorithm.BIDIRECTIONAL}>
                  <div className="flex flex-col items-start">
                    <span className="text-xs sm:text-sm">{t.algorithms.bidirectional.name}</span>
                    <span className="text-xs text-muted-foreground">{t.algorithms.bidirectional.description}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={runPathfinding}
              disabled={isRunning || !startPosition || !endPosition}
              size="lg"
              className="w-full text-xs sm:text-sm"
            >
              <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              {isRunning ? t.actions.running : t.actions.findPath}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Grid */}
      <Card className="overflow-hidden">
        <CardContent className="p-2 sm:p-6">
          <div className="w-full">
            <div className="flex justify-center">
              <div
                className={cn(
                  "grid gap-0 border-2 border-border rounded-lg overflow-hidden",
                  "shadow-lg bg-background w-full",
                  // Responsive grid sizing
                  "max-w-full"
                )}
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                  // Dynamic sizing based on viewport - ensures 100% visibility
                  width: `min(100vw - 1rem, 100%, ${cols * 25}px)`, // Scale to fit viewport width with margin
                  height: `min(70vh, calc((100vw - 1rem) * ${rows} / ${cols}), ${rows * 25}px)`, // Maintain aspect ratio
                  maxWidth: '100%', // Ensure it never overflows
                  maxHeight: '70vh' // Reasonable height limit
                }}
                onMouseLeave={() => isDrawingRef.current = false}
                // Add touch support for mobile
                onTouchStart={(e) => {
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const touch = e.touches[0];
                  const x = touch.clientX - rect.left;
                  const y = touch.clientY - rect.top;
                  const col = Math.floor((x / rect.width) * cols);
                  const row = Math.floor((y / rect.height) * rows);
                  if (row >= 0 && row < rows && col >= 0 && col < cols) {
                    handleMouseDown(row, col);
                  }
                }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <Cell
                      key={`${rowIndex}-${colIndex}`}
                      cell={cell}
                      onMouseDown={handleMouseDown}
                      onMouseEnter={handleMouseEnter}
                      onMouseUp={handleMouseUp}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Grid;