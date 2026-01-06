import React, { useRef } from 'react';
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva';
import Konva from 'konva';

interface CargoCaptainCanvasProps {
  length: number;
  breadth: number;
  height: number;
  currentLayer: number;
  cellsPackaged: boolean[];
  onCellClick: (cellIndex: number) => void;
  isGameComplete: boolean;
}

const CELL_SIZE = 50;
const PADDING = 40;
const LAYER_INDICATOR_Y = 20;

export const CargoCaptainCanvas: React.FC<CargoCaptainCanvasProps> = ({
  length,
  breadth,
  height,
  currentLayer,
  cellsPackaged,
  onCellClick,
  isGameComplete,
}) => {
  const stageRef = useRef<Konva.Stage>(null);

  // Calculate canvas dimensions
  const gridWidth = length * CELL_SIZE;
  const gridHeight = breadth * CELL_SIZE;
  const containerViewWidth = gridWidth + 80; // Extra space for 3D effect
  const containerViewHeight = 100 + gridHeight + 100; // Space for labels + grid + info

  // Render wireframe container (3D effect)
  const renderContainerWireframe = () => {
    const elements = [];
    const offsetX = PADDING + 40;
    const offsetY = PADDING + 60;
    const depthOffset = 20; // For 3D perspective

    // Front face
    elements.push(
      <Rect
        key="front-box"
        x={offsetX}
        y={offsetY}
        width={gridWidth}
        height={gridHeight}
        fill="none"
        stroke="#64748B"
        strokeWidth={2}
        opacity={0.3}
      />
    );

    // Top face (3D perspective)
    const topX = offsetX;
    const topY = offsetY - depthOffset;
    elements.push(
      <Line
        key="top-left"
        points={[offsetX, offsetY, topX - depthOffset, topY]}
        stroke="#64748B"
        strokeWidth={1}
        opacity={0.2}
      />
    );
    elements.push(
      <Line
        key="top-right"
        points={[offsetX + gridWidth, offsetY, topX + gridWidth - depthOffset, topY]}
        stroke="#64748B"
        strokeWidth={1}
        opacity={0.2}
      />
    );
    elements.push(
      <Rect
        key="top-face"
        x={topX - depthOffset}
        y={topY}
        width={gridWidth}
        height={0}
        fill="none"
        stroke="#64748B"
        strokeWidth={1}
        opacity={0.1}
      />
    );

    // Right face (3D perspective)
    elements.push(
      <Line
        key="right-bottom"
        points={[offsetX + gridWidth, offsetY, offsetX + gridWidth + depthOffset, offsetY - depthOffset]}
        stroke="#64748B"
        strokeWidth={1}
        opacity={0.2}
      />
    );
    elements.push(
      <Line
        key="right-top"
        points={[offsetX + gridWidth, offsetY + gridHeight, offsetX + gridWidth + depthOffset, offsetY + gridHeight - depthOffset]}
        stroke="#64748B"
        strokeWidth={1}
        opacity={0.2}
      />
    );

    return elements;
  };

  // Render grid cells (current layer)
  const renderGridCells = () => {
    const cells = [];
    const offsetX = PADDING + 40;
    const offsetY = PADDING + 60;

    for (let row = 0; row < breadth; row++) {
      for (let col = 0; col < length; col++) {
        const cellIndex = row * length + col;
        const x = offsetX + col * CELL_SIZE;
        const y = offsetY + row * CELL_SIZE;
        const isPacked = cellsPackaged[cellIndex] || false;

        // Cell background
        cells.push(
          <Rect
            key={`cell-bg-${cellIndex}`}
            x={x}
            y={y}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill={isPacked ? '#10B981' : '#1E293B'}
            stroke="#334155"
            strokeWidth={1}
            onClick={() => !isGameComplete && onCellClick(cellIndex)}
            onMouseEnter={(e) => {
              if (!isGameComplete && e.currentTarget instanceof Konva.Rect) {
                e.currentTarget.fill(isPacked ? '#059669' : '#334155');
              }
            }}
            onMouseLeave={(e) => {
              if (e.currentTarget instanceof Konva.Rect) {
                e.currentTarget.fill(isPacked ? '#10B981' : '#1E293B');
              }
            }}
          />
        );

        // Crate icon if packed
        if (isPacked) {
          cells.push(
            <Text
              key={`crate-${cellIndex}`}
              x={x}
              y={y}
              width={CELL_SIZE}
              height={CELL_SIZE}
              text="📦"
              fontSize={28}
              align="center"
              verticalAlign="middle"
            />
          );
        }
      }
    }

    return cells;
  };

  // Render layer indicator
  const renderLayerIndicator = () => {
    const filledCells = cellsPackaged.filter((c) => c).length;
    const totalCells = length * breadth;
    const fillPercentage = (filledCells / totalCells) * 100;

    return (
      <Group key="layer-indicator">
        {/* Title */}
        <Text
          x={PADDING}
          y={LAYER_INDICATOR_Y}
          text={`Layer ${currentLayer + 1} of ${height}`}
          fontSize={18}
          fontFamily="Arial"
          fontStyle="bold"
          fill="#FFFFFF"
        />

        {/* Progress bar */}
        <Rect
          x={PADDING}
          y={LAYER_INDICATOR_Y + 30}
          width={300}
          height={20}
          fill="#0F172A"
          stroke="#475569"
          strokeWidth={1}
        />
        <Rect
          x={PADDING}
          y={LAYER_INDICATOR_Y + 30}
          width={Math.max(0, (300 * fillPercentage) / 100)}
          height={20}
          fill="#10B981"
        />
        <Text
          x={PADDING + 150}
          y={LAYER_INDICATOR_Y + 30}
          text={`${filledCells}/${totalCells} cells`}
          fontSize={12}
          fontFamily="Arial"
          fill="#FFFFFF"
          align="center"
          width={300}
          height={20}
          verticalAlign="middle"
        />
      </Group>
    );
  };

  // Render dimensions info
  const renderDimensionsInfo = () => {
    const offsetX = PADDING + 40 + gridWidth + 30;
    const offsetY = PADDING + 60;

    return (
      <Group key="dimensions-info">
        <Text
          x={offsetX}
          y={offsetY}
          text="Container:"
          fontSize={14}
          fontFamily="Arial"
          fontStyle="bold"
          fill="#94A3B8"
        />
        <Text
          x={offsetX}
          y={offsetY + 25}
          text={`Length: ${length}m`}
          fontSize={12}
          fontFamily="Arial"
          fill="#FFFFFF"
        />
        <Text
          x={offsetX}
          y={offsetY + 45}
          text={`Breadth: ${breadth}m`}
          fontSize={12}
          fontFamily="Arial"
          fill="#FFFFFF"
        />
        <Text
          x={offsetX}
          y={offsetY + 65}
          text={`Height: ${height}m`}
          fontSize={12}
          fontFamily="Arial"
          fill="#FFFFFF"
        />
        <Text
          x={offsetX}
          y={offsetY + 90}
          text={`Volume: ${length * breadth * height} units³`}
          fontSize={13}
          fontFamily="Arial"
          fontStyle="bold"
          fill="#10B981"
        />
      </Group>
    );
  };

  // Render completion overlay
  const renderCompletionOverlay = () => {
    if (!isGameComplete) return null;

    const offsetX = PADDING + 40;
    const offsetY = PADDING + 60;

    return (
      <Group key="completion-overlay">
        <Rect
          x={offsetX}
          y={offsetY}
          width={gridWidth}
          height={gridHeight}
          fill="rgba(16, 185, 129, 0.1)"
        />
        <Rect
          x={offsetX + gridWidth / 2 - 100}
          y={offsetY + gridHeight / 2 - 40}
          width={200}
          height={80}
          fill="#1E293B"
          stroke="#10B981"
          strokeWidth={2}
          cornerRadius={8}
        />
        <Text
          x={offsetX + gridWidth / 2 - 100}
          y={offsetY + gridHeight / 2 - 30}
          width={200}
          text="✓ Layer Complete!"
          fontSize={16}
          fontFamily="Arial"
          fontStyle="bold"
          fill="#10B981"
          align="center"
          verticalAlign="middle"
          height={30}
        />
      </Group>
    );
  };

  return (
    <Stage
      ref={stageRef}
      width={Math.max(700, containerViewWidth)}
      height={containerViewHeight}
    >
      <Layer>
        {/* Background */}
        <Rect
          width={Math.max(700, containerViewWidth)}
          height={containerViewHeight}
          fill="#0F172A"
        />

        {/* Wireframe container */}
        {renderContainerWireframe()}

        {/* Grid cells */}
        {renderGridCells()}

        {/* Layer indicator */}
        {renderLayerIndicator()}

        {/* Dimensions info */}
        {renderDimensionsInfo()}

        {/* Completion overlay */}
        {renderCompletionOverlay()}
      </Layer>
    </Stage>
  );
};
