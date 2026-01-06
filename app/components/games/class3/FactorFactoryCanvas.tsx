import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group, Line } from 'react-konva';
import Konva from 'konva';

interface FactorFactoryCanvasProps {
  width: number;
  height: number;
  targetNumber: number;
  currentSelection: { width: number | null; height: number | null; isValid: boolean };
  onCellSelection: (width: number, height: number) => void;
  onSubmit: () => void;
  isGameComplete: boolean;
}

const GRID_SIZE = 12; // 12x12 grid
const CELL_SIZE = 40; // 40px per cell
const PADDING = 40;

export const FactorFactoryCanvas: React.FC<FactorFactoryCanvasProps> = ({
  width,
  height,
  targetNumber,
  currentSelection,
  onCellSelection,
  onSubmit,
  isGameComplete,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startCell, setStartCell] = useState<{ x: number; y: number } | null>(null);
  const [hoverCell, setHoverCell] = useState<{ x: number; y: number } | null>(null);

  // Convert pixel coordinates to grid coordinates
  const getGridCoords = (e: Konva.KonvaEventObject<MouseEvent>): { x: number; y: number } | null => {
    if (!stageRef.current) return null;
    const stage = stageRef.current;
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return null;

    const gridX = Math.floor((pointerPos.x - PADDING) / CELL_SIZE);
    const gridY = Math.floor((pointerPos.y - PADDING) / CELL_SIZE);

    if (gridX >= 0 && gridX < GRID_SIZE && gridY >= 0 && gridY < GRID_SIZE) {
      return { x: gridX, y: gridY };
    }
    return null;
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isGameComplete) return;
    const coords = getGridCoords(e);
    if (coords) {
      setIsDrawing(true);
      setStartCell(coords);
      setHoverCell(coords);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !startCell) {
      const coords = getGridCoords(e);
      setHoverCell(coords);
      return;
    }

    const coords = getGridCoords(e);
    if (coords) {
      setHoverCell(coords);
      // Calculate dimensions
      const width = Math.abs(coords.x - startCell.x) + 1;
      const height = Math.abs(coords.y - startCell.y) + 1;
      onCellSelection(width, height);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
    setHoverCell(null);
  };

  // Render grid cells
  const renderGridCells = () => {
    const cells = [];

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const x = PADDING + col * CELL_SIZE;
        const y = PADDING + row * CELL_SIZE;

        // Check if this cell is in the current selection
        let isSelected = false;
        if (
          startCell &&
          hoverCell &&
          currentSelection.width &&
          currentSelection.height
        ) {
          const minX = Math.min(startCell.x, hoverCell.x);
          const maxX = Math.max(startCell.x, hoverCell.x);
          const minY = Math.min(startCell.y, hoverCell.y);
          const maxY = Math.max(startCell.y, hoverCell.y);

          if (col >= minX && col <= maxX && row >= minY && row <= maxY) {
            isSelected = true;
          }
        }

        // Determine fill color
        let fill = '#0F172A'; // Dark background
        let stroke = '#334155'; // Grid lines

        if (isSelected) {
          fill = currentSelection.isValid ? '#10B981' : '#EF4444'; // Green if valid, red if invalid
        }

        cells.push(
          <Rect
            key={`cell-${row}-${col}`}
            x={x}
            y={y}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill={fill}
            stroke={stroke}
            strokeWidth={1}
          />
        );
      }
    }

    return cells;
  };

  // Render dimension label
  const renderDimensionLabel = () => {
    if (!currentSelection.width || !currentSelection.height) return null;

    const labelX = PADDING + GRID_SIZE * CELL_SIZE + 20;
    const labelY = PADDING + 40;

    return (
      <Group key="dimension-label">
        <Rect
          x={labelX}
          y={labelY}
          width={120}
          height={60}
          fill="#1E293B"
          stroke={currentSelection.isValid ? '#10B981' : '#EF4444'}
          strokeWidth={2}
          cornerRadius={8}
        />
        <Text
          x={labelX + 10}
          y={labelY + 10}
          text={`${currentSelection.width} × ${currentSelection.height}`}
          fontSize={24}
          fontFamily="Arial"
          fontStyle="bold"
          fill="#FFFFFF"
        />
        <Text
          x={labelX + 10}
          y={labelY + 40}
          text={`= ${currentSelection.width * currentSelection.height}`}
          fontSize={16}
          fontFamily="Arial"
          fill={currentSelection.isValid ? '#10B981' : '#EF4444'}
        />
      </Group>
    );
  };

  // Render grid lines (vertical and horizontal)
  const renderGridLines = () => {
    const lines = [];

    // Vertical lines
    for (let col = 0; col <= GRID_SIZE; col++) {
      const x = PADDING + col * CELL_SIZE;
      lines.push(
        <Line
          key={`vline-${col}`}
          points={[x, PADDING, x, PADDING + GRID_SIZE * CELL_SIZE]}
          stroke="#475569"
          strokeWidth={0.5}
        />
      );
    }

    // Horizontal lines
    for (let row = 0; row <= GRID_SIZE; row++) {
      const y = PADDING + row * CELL_SIZE;
      lines.push(
        <Line
          key={`hline-${row}`}
          points={[PADDING, y, PADDING + GRID_SIZE * CELL_SIZE, y]}
          stroke="#475569"
          strokeWidth={0.5}
        />
      );
    }

    return lines;
  };

  // Render title and info
  const renderTitle = () => {
    return (
      <Group key="title">
        <Text
          x={PADDING}
          y={10}
          text="The Factory Floor"
          fontSize={20}
          fontFamily="Arial"
          fontStyle="bold"
          fill="#FFFFFF"
        />
        <Text
          x={PADDING}
          y={PADDING + GRID_SIZE * CELL_SIZE + 20}
          text={`Arrange ${targetNumber} Energy Cores into rectangles`}
          fontSize={14}
          fontFamily="Arial"
          fill="#94A3B8"
        />
        <Text
          x={PADDING}
          y={PADDING + GRID_SIZE * CELL_SIZE + 45}
          text="Drag across the grid to select a rectangle"
          fontSize={12}
          fontFamily="Arial"
          fill="#64748B"
        />
      </Group>
    );
  };

  const canvasWidth = PADDING * 2 + GRID_SIZE * CELL_SIZE + 150;
  const canvasHeight = PADDING * 2 + GRID_SIZE * CELL_SIZE + 80;

  return (
    <Stage
      ref={stageRef}
      width={canvasWidth}
      height={canvasHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <Layer>
        {/* Background */}
        <Rect width={canvasWidth} height={canvasHeight} fill="#0F172A" />

        {/* Title */}
        {renderTitle()}

        {/* Grid cells */}
        {renderGridCells()}

        {/* Grid lines */}
        {renderGridLines()}

        {/* Dimension label */}
        {renderDimensionLabel()}

        {/* Success overlay when complete */}
        {isGameComplete && (
          <Group key="success-overlay">
            <Rect
              x={0}
              y={0}
              width={canvasWidth}
              height={canvasHeight}
              fill="rgba(16, 185, 129, 0.1)"
            />
            <Rect
              x={canvasWidth / 2 - 150}
              y={canvasHeight / 2 - 60}
              width={300}
              height={120}
              fill="#1E293B"
              stroke="#10B981"
              strokeWidth={3}
              cornerRadius={12}
            />
            <Text
              x={canvasWidth / 2 - 140}
              y={canvasHeight / 2 - 40}
              text="🏭 FACTORY COMPLETE ✓"
              fontSize={18}
              fontFamily="Arial"
              fontStyle="bold"
              fill="#10B981"
            />
            <Text
              x={canvasWidth / 2 - 130}
              y={canvasHeight / 2 + 5}
              text="All rectangles found!"
              fontSize={14}
              fontFamily="Arial"
              fill="#94A3B8"
            />
          </Group>
        )}
      </Layer>
    </Stage>
  );
};
