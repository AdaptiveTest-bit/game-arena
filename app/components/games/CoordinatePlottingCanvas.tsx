'use client';

import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Line, Group, Circle } from 'react-konva';
import { useTreasureMapStore, Coordinate } from '@/app/store/useTreasureMapStore';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 550;
const GRID_SIZE = 10;
const CELL_SIZE = 45;
const GRID_OFFSET_X = 80;
const GRID_OFFSET_Y = 60;

const CoordinatePlottingCanvas: React.FC = () => {
  const {
    plottingChallenge,
    plotCoordinate,
    isPhaseCorrect
  } = useTreasureMapStore();

  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [lastClickWrong, setLastClickWrong] = useState<Coordinate | null>(null);

  if (!plottingChallenge) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const { targetCoordinates, labels, icons, playerPlacements, currentPlotIndex } = plottingChallenge;
  const currentTarget = currentPlotIndex < targetCoordinates.length ? targetCoordinates[currentPlotIndex] : null;

  const handleCellClick = (x: number, y: number) => {
    if (isPhaseCorrect || currentPlotIndex >= targetCoordinates.length) return;
    
    const coord = { x, y };
    const success = plotCoordinate(coord);
    
    if (success) {
      setValidationMessage(`✅ Correct! ${icons[currentPlotIndex]} placed at (${x}, ${y})`);
      setLastClickWrong(null);
    } else {
      setValidationMessage(`❌ Incorrect! That's not (${currentTarget?.x}, ${currentTarget?.y}). Try again!`);
      setLastClickWrong(coord);
    }
  };

  // Get cell coordinates from grid position
  const getCellPos = (gridX: number, gridY: number) => ({
    x: GRID_OFFSET_X + (gridX - 1) * CELL_SIZE + CELL_SIZE / 2,
    y: GRID_OFFSET_Y + (GRID_SIZE - gridY) * CELL_SIZE + CELL_SIZE / 2
  });

  return (
    <div className="w-full">
      {/* Current Task */}
      <div className="mb-4 text-center">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl p-4 inline-block">
          {currentTarget ? (
            <>
              <p className="text-sm uppercase tracking-wide opacity-80">Plot this landmark</p>
              <p className="text-3xl font-bold">
                {icons[currentPlotIndex]} {labels[currentPlotIndex]}
              </p>
              <p className="text-xl mt-1">
                at coordinates <span className="font-mono bg-white/20 px-2 py-1 rounded">({currentTarget.x}, {currentTarget.y})</span>
              </p>
            </>
          ) : (
            <p className="text-2xl font-bold">🎉 All landmarks placed!</p>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4 flex justify-center gap-2">
        {targetCoordinates.map((_, idx) => (
          <div
            key={idx}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
              idx < currentPlotIndex
                ? 'bg-green-500 text-white'
                : idx === currentPlotIndex
                ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {idx < currentPlotIndex ? '✓' : icons[idx]}
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-lg overflow-hidden border-2 border-amber-300 mb-4">
        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          <Layer>
            {/* Map Background */}
            <Rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#FEF3C7" />
            
            {/* Decorative compass */}
            <Text x={CANVAS_WIDTH - 80} y={20} text="🧭" fontSize={40} />
            <Text x={CANVAS_WIDTH - 70} y={70} text="N" fontSize={14} fill="#92400E" fontStyle="bold" />

            {/* Y-axis label */}
            <Text
              x={15}
              y={GRID_OFFSET_Y + (GRID_SIZE * CELL_SIZE) / 2}
              text="Y →"
              fontSize={16}
              fill="#92400E"
              fontStyle="bold"
              rotation={-90}
            />

            {/* X-axis label */}
            <Text
              x={GRID_OFFSET_X + (GRID_SIZE * CELL_SIZE) / 2 - 15}
              y={GRID_OFFSET_Y + GRID_SIZE * CELL_SIZE + 25}
              text="X →"
              fontSize={16}
              fill="#92400E"
              fontStyle="bold"
            />

            {/* Grid Lines */}
            {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
              <React.Fragment key={`grid-${i}`}>
                {/* Vertical lines */}
                <Line
                  points={[
                    GRID_OFFSET_X + i * CELL_SIZE,
                    GRID_OFFSET_Y,
                    GRID_OFFSET_X + i * CELL_SIZE,
                    GRID_OFFSET_Y + GRID_SIZE * CELL_SIZE
                  ]}
                  stroke="#D97706"
                  strokeWidth={1}
                  opacity={0.5}
                />
                {/* Horizontal lines */}
                <Line
                  points={[
                    GRID_OFFSET_X,
                    GRID_OFFSET_Y + i * CELL_SIZE,
                    GRID_OFFSET_X + GRID_SIZE * CELL_SIZE,
                    GRID_OFFSET_Y + i * CELL_SIZE
                  ]}
                  stroke="#D97706"
                  strokeWidth={1}
                  opacity={0.5}
                />
              </React.Fragment>
            ))}

            {/* X-axis numbers */}
            {Array.from({ length: GRID_SIZE }).map((_, i) => (
              <Text
                key={`x-${i}`}
                x={GRID_OFFSET_X + i * CELL_SIZE + CELL_SIZE / 2 - 5}
                y={GRID_OFFSET_Y + GRID_SIZE * CELL_SIZE + 5}
                text={String(i + 1)}
                fontSize={14}
                fill="#92400E"
                fontStyle="bold"
              />
            ))}

            {/* Y-axis numbers */}
            {Array.from({ length: GRID_SIZE }).map((_, i) => (
              <Text
                key={`y-${i}`}
                x={GRID_OFFSET_X - 20}
                y={GRID_OFFSET_Y + (GRID_SIZE - i - 1) * CELL_SIZE + CELL_SIZE / 2 - 7}
                text={String(i + 1)}
                fontSize={14}
                fill="#92400E"
                fontStyle="bold"
              />
            ))}

            {/* Clickable cells */}
            {Array.from({ length: GRID_SIZE }).map((_, row) =>
              Array.from({ length: GRID_SIZE }).map((_, col) => {
                const gridX = col + 1;
                const gridY = GRID_SIZE - row;
                const isWrongClick = lastClickWrong?.x === gridX && lastClickWrong?.y === gridY;
                
                return (
                  <Group
                    key={`cell-${row}-${col}`}
                    x={GRID_OFFSET_X + col * CELL_SIZE}
                    y={GRID_OFFSET_Y + row * CELL_SIZE}
                    onClick={() => handleCellClick(gridX, gridY)}
                    onTap={() => handleCellClick(gridX, gridY)}
                  >
                    <Rect
                      width={CELL_SIZE}
                      height={CELL_SIZE}
                      fill={isWrongClick ? '#FEE2E2' : 'transparent'}
                      stroke={isWrongClick ? '#EF4444' : 'transparent'}
                      strokeWidth={2}
                    />
                  </Group>
                );
              })
            )}

            {/* Placed landmarks */}
            {playerPlacements.map((placement, idx) => {
              if (!placement) return null;
              const pos = getCellPos(placement.x, placement.y);
              
              return (
                <Group key={`placed-${idx}`}>
                  <Circle
                    x={pos.x}
                    y={pos.y}
                    radius={18}
                    fill="#10B981"
                    shadowColor="#000"
                    shadowBlur={5}
                    shadowOpacity={0.3}
                  />
                  <Text
                    x={pos.x - 12}
                    y={pos.y - 12}
                    text={icons[idx]}
                    fontSize={20}
                    listening={false}
                  />
                </Group>
              );
            })}

            {/* Legend */}
            <Rect
              x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 20}
              y={GRID_OFFSET_Y}
              width={180}
              height={GRID_SIZE * CELL_SIZE}
              fill="#FFF7ED"
              stroke="#D97706"
              strokeWidth={2}
              cornerRadius={10}
            />
            <Text
              x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 30}
              y={GRID_OFFSET_Y + 10}
              text="📋 Landmarks"
              fontSize={16}
              fill="#92400E"
              fontStyle="bold"
            />
            
            {targetCoordinates.map((coord, idx) => {
              const isPlaced = playerPlacements[idx] !== null;
              const isCurrent = idx === currentPlotIndex;
              
              return (
                <Group key={`legend-${idx}`}>
                  <Rect
                    x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 30}
                    y={GRID_OFFSET_Y + 40 + idx * 45}
                    width={160}
                    height={40}
                    fill={isPlaced ? '#D1FAE5' : isCurrent ? '#FEF3C7' : '#FFF'}
                    stroke={isCurrent ? '#F59E0B' : '#E5E7EB'}
                    strokeWidth={isCurrent ? 2 : 1}
                    cornerRadius={8}
                  />
                  <Text
                    x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 40}
                    y={GRID_OFFSET_Y + 45 + idx * 45}
                    text={icons[idx]}
                    fontSize={18}
                    listening={false}
                  />
                  <Text
                    x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 65}
                    y={GRID_OFFSET_Y + 48 + idx * 45}
                    text={`(${coord.x}, ${coord.y})`}
                    fontSize={14}
                    fontFamily="monospace"
                    fill={isPlaced ? '#059669' : '#374151'}
                    fontStyle="bold"
                    listening={false}
                  />
                  {isPlaced && (
                    <Text
                      x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 155}
                      y={GRID_OFFSET_Y + 48 + idx * 45}
                      text="✓"
                      fontSize={16}
                      fill="#10B981"
                      fontStyle="bold"
                      listening={false}
                    />
                  )}
                </Group>
              );
            })}

            {/* Success overlay */}
            {isPhaseCorrect && (
              <Text
                x={0}
                y={CANVAS_HEIGHT - 40}
                width={CANVAS_WIDTH}
                text="🎉 All landmarks plotted correctly!"
                fontSize={24}
                fontFamily="Arial"
                fill="#059669"
                align="center"
                fontStyle="bold"
              />
            )}
          </Layer>
        </Stage>
      </div>

      {/* Validation Message */}
      {validationMessage && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            validationMessage.includes('✅')
              ? 'bg-green-50 border border-green-300'
              : 'bg-red-50 border border-red-300'
          }`}
        >
          <p className={validationMessage.includes('✅') ? 'text-green-800' : 'text-red-800'}>
            {validationMessage}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>How to plot:</strong> Look at the coordinate (x, y). The x-value tells you which column 
          (count from left), and the y-value tells you which row (count from bottom). Click on the correct 
          cell to place the landmark!
        </p>
      </div>
    </div>
  );
};

export default CoordinatePlottingCanvas;
