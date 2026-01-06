'use client';

import React, { useRef } from 'react';
import { Stage, Layer, Rect, Line, Text, Group } from 'react-konva';
import Konva from 'konva';
import { useSymmetryShieldStore } from '@/app/store/useSymmetryShieldStore';

interface SymmetryShieldCanvasProps {
  width: number;
  height: number;
  onCellClick: (row: number, col: number) => void;
  isGameComplete: boolean;
}

const SymmetryShieldCanvas: React.FC<SymmetryShieldCanvasProps> = ({
  width,
  height,
  onCellClick,
  isGameComplete,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const { leftSide, rightSide, cellSize, gridHeight, gridWidth } = useSymmetryShieldStore();

  const startX = (width - gridWidth * cellSize) / 2;
  const startY = (height - gridHeight * cellSize) / 2;

  const handleCellClick = (e: any) => {
    if (isGameComplete) return;

    const stage = stageRef.current;
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    const relX = pos.x - startX;
    const relY = pos.y - startY;

    const col = Math.floor(relX / cellSize);
    const row = Math.floor(relY / cellSize);

    if (row >= 0 && row < gridHeight && col >= 0 && col < gridWidth) {
      onCellClick(row, col);
    }
  };

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onClick={handleCellClick}
      className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg"
    >
      <Layer>
        {/* Background grid */}
        {Array.from({ length: gridHeight + 1 }).map((_, i) => (
          <Line
            key={`h-${i}`}
            points={[
              startX,
              startY + i * cellSize,
              startX + gridWidth * cellSize,
              startY + i * cellSize,
            ]}
            stroke="#334155"
            strokeWidth={1}
          />
        ))}

        {Array.from({ length: gridWidth + 1 }).map((_, i) => (
          <Line
            key={`v-${i}`}
            points={[
              startX + i * cellSize,
              startY,
              startX + i * cellSize,
              startY + gridHeight * cellSize,
            ]}
            stroke="#334155"
            strokeWidth={1}
          />
        ))}

        {/* Symmetry axis (glowing center line) */}
        <Line
          points={[
            startX + 5 * cellSize,
            startY,
            startX + 5 * cellSize,
            startY + gridHeight * cellSize,
          ]}
          stroke="#60A5FA"
          strokeWidth={3}
          shadowColor="#3B82F6"
          shadowBlur={10}
          shadowOpacity={0.8}
        />

        {/* Left side cells (read-only) */}
        {leftSide.map((isActive, index) => {
          const row = Math.floor(index / 5);
          const col = index % 5;
          return (
            <Rect
              key={`left-${index}`}
              x={startX + col * cellSize}
              y={startY + row * cellSize}
              width={cellSize}
              height={cellSize}
              fill={isActive ? '#3B82F6' : '#1E293B'}
              stroke={isActive ? '#1E40AF' : '#64748B'}
              strokeWidth={1}
              opacity={0.8}
            />
          );
        })}

        {/* Right side cells (interactive) */}
        {rightSide.map((isActive, index) => {
          const row = Math.floor(index / 5);
          const col = 5 + (index % 5);
          return (
            <Group key={`right-${index}`}>
              <Rect
                x={startX + col * cellSize}
                y={startY + row * cellSize}
                width={cellSize}
                height={cellSize}
                fill={isActive ? '#10B981' : '#1E293B'}
                stroke={isActive ? '#059669' : '#64748B'}
                strokeWidth={1}
                opacity={0.8}
              />
              
              {/* Hover indicator for empty cells */}
              {!isActive && !isGameComplete && (
                <Rect
                  x={startX + col * cellSize}
                  y={startY + row * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="transparent"
                  stroke="#94A3B8"
                  strokeWidth={1}
                  opacity={0}
                  onMouseEnter={(e) => {
                    e.currentTarget.opacity(0.3);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.opacity(0);
                  }}
                  cursor="pointer"
                />
              )}
            </Group>
          );
        })}

        {/* Success overlay (when shield is locked) */}
        {isGameComplete && (
          <>
            <Rect
              x={startX}
              y={startY}
              width={gridWidth * cellSize}
              height={gridHeight * cellSize}
              fill="#10B981"
              opacity={0.1}
            />
            <Text
              x={startX + (gridWidth * cellSize) / 2 - 80}
              y={startY + (gridHeight * cellSize) / 2 - 20}
              text="🛡️ SHIELD ACTIVATED ✓"
              fontSize={24}
              fontFamily="Arial"
              fontStyle="bold"
              fill="#10B981"
            />
          </>
        )}

        {/* Grid labels */}
        <Text
          x={startX - 30}
          y={startY - 25}
          text="LEFT SIDE"
          fontSize={12}
          fontFamily="Arial"
          fontStyle="bold"
          fill="#60A5FA"
        />
        <Text
          x={startX + gridWidth * cellSize - 140}
          y={startY - 25}
          text="RIGHT SIDE (Mirror)"
          fontSize={12}
          fontFamily="Arial"
          fontStyle="bold"
          fill="#10B981"
        />
      </Layer>
    </Stage>
  );
};

export default SymmetryShieldCanvas;
