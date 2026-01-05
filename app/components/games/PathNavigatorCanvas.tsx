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

const PathNavigatorCanvas: React.FC = () => {
  const {
    pathChallenge,
    addToPath,
    removeLastFromPath,
    clearPath,
    validatePath,
    isPhaseCorrect
  } = useTreasureMapStore();

  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  if (!pathChallenge) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const { startPoint, endPoint, waypoints, obstacles, playerPath } = pathChallenge;
  const currentPos = playerPath[playerPath.length - 1];

  // Check if waypoint is visited
  const isWaypointVisited = (wp: Coordinate) =>
    playerPath.some(p => p.x === wp.x && p.y === wp.y);

  // Get cell position from grid coordinates
  const getCellPos = (gridX: number, gridY: number) => ({
    x: GRID_OFFSET_X + (gridX - 1) * CELL_SIZE + CELL_SIZE / 2,
    y: GRID_OFFSET_Y + (GRID_SIZE - gridY) * CELL_SIZE + CELL_SIZE / 2
  });

  // Check if cell is adjacent to current position
  const isAdjacent = (x: number, y: number) => {
    const dx = Math.abs(x - currentPos.x);
    const dy = Math.abs(y - currentPos.y);
    return dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0);
  };

  // Check if cell is obstacle
  const isObstacle = (x: number, y: number) =>
    obstacles.some(o => o.x === x && o.y === y);

  // Check if cell is in path
  const isInPath = (x: number, y: number) =>
    playerPath.some(p => p.x === x && p.y === y);

  const handleCellClick = (x: number, y: number) => {
    if (isPhaseCorrect) return;
    
    const coord = { x, y };
    addToPath(coord);
    setValidationMessage(null);
  };

  const handleValidate = () => {
    const success = validatePath();
    
    if (success) {
      setValidationMessage('🎉 Perfect navigation! You found the treasure!');
    } else {
      // Check what's wrong
      const lastPoint = playerPath[playerPath.length - 1];
      const reachedEnd = lastPoint.x === endPoint.x && lastPoint.y === endPoint.y;
      const visitedAll = waypoints.every(wp => isWaypointVisited(wp.coord));
      
      if (!visitedAll) {
        setValidationMessage('❌ You missed some waypoints! Collect all keys first.');
      } else if (!reachedEnd) {
        setValidationMessage('❌ You haven\'t reached the treasure yet! Keep navigating.');
      } else {
        setValidationMessage('❌ Your path is too long. Try finding a shorter route!');
      }
    }
  };

  const reachedEnd = currentPos.x === endPoint.x && currentPos.y === endPoint.y;
  const allWaypointsVisited = waypoints.every(wp => isWaypointVisited(wp.coord));

  return (
    <div className="w-full">
      {/* Mission Info */}
      <div className="mb-4 flex justify-center gap-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-3 text-center">
          <p className="text-xs uppercase opacity-80">Start</p>
          <p className="font-bold">🚩 ({startPoint.x}, {startPoint.y})</p>
        </div>
        
        {waypoints.map((wp, idx) => (
          <div 
            key={idx}
            className={`rounded-xl p-3 text-center ${
              isWaypointVisited(wp.coord)
                ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
            }`}
          >
            <p className="text-xs uppercase opacity-80">{isWaypointVisited(wp.coord) ? 'Collected!' : 'Collect'}</p>
            <p className="font-bold">{wp.icon} ({wp.coord.x}, {wp.coord.y})</p>
          </div>
        ))}
        
        <div className={`rounded-xl p-3 text-center ${
          reachedEnd 
            ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
            : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
        }`}>
          <p className="text-xs uppercase opacity-80">Treasure</p>
          <p className="font-bold">💎 ({endPoint.x}, {endPoint.y})</p>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-lg overflow-hidden border-2 border-amber-300 mb-4">
        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          <Layer>
            {/* Map Background */}
            <Rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#FEF3C7" />

            {/* Grid Lines */}
            {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
              <React.Fragment key={`grid-${i}`}>
                <Line
                  points={[
                    GRID_OFFSET_X + i * CELL_SIZE,
                    GRID_OFFSET_Y,
                    GRID_OFFSET_X + i * CELL_SIZE,
                    GRID_OFFSET_Y + GRID_SIZE * CELL_SIZE
                  ]}
                  stroke="#D97706"
                  strokeWidth={1}
                  opacity={0.3}
                />
                <Line
                  points={[
                    GRID_OFFSET_X,
                    GRID_OFFSET_Y + i * CELL_SIZE,
                    GRID_OFFSET_X + GRID_SIZE * CELL_SIZE,
                    GRID_OFFSET_Y + i * CELL_SIZE
                  ]}
                  stroke="#D97706"
                  strokeWidth={1}
                  opacity={0.3}
                />
              </React.Fragment>
            ))}

            {/* Axis labels */}
            {Array.from({ length: GRID_SIZE }).map((_, i) => (
              <React.Fragment key={`axis-${i}`}>
                <Text
                  x={GRID_OFFSET_X + i * CELL_SIZE + CELL_SIZE / 2 - 5}
                  y={GRID_OFFSET_Y + GRID_SIZE * CELL_SIZE + 5}
                  text={String(i + 1)}
                  fontSize={12}
                  fill="#92400E"
                  fontStyle="bold"
                />
                <Text
                  x={GRID_OFFSET_X - 18}
                  y={GRID_OFFSET_Y + (GRID_SIZE - i - 1) * CELL_SIZE + CELL_SIZE / 2 - 6}
                  text={String(i + 1)}
                  fontSize={12}
                  fill="#92400E"
                  fontStyle="bold"
                />
              </React.Fragment>
            ))}

            {/* Obstacles */}
            {obstacles.map((obs, idx) => {
              const pos = getCellPos(obs.x, obs.y);
              return (
                <Group key={`obs-${idx}`} listening={false}>
                  <Rect
                    x={pos.x - CELL_SIZE / 2 + 2}
                    y={pos.y - CELL_SIZE / 2 + 2}
                    width={CELL_SIZE - 4}
                    height={CELL_SIZE - 4}
                    fill="#7C2D12"
                    cornerRadius={5}
                  />
                  <Text
                    x={pos.x - 10}
                    y={pos.y - 10}
                    text="🪨"
                    fontSize={18}
                    listening={false}
                  />
                </Group>
              );
            })}

            {/* Path line */}
            {playerPath.length > 1 && (
              <Line
                points={playerPath.flatMap(p => {
                  const pos = getCellPos(p.x, p.y);
                  return [pos.x, pos.y];
                })}
                stroke="#3B82F6"
                strokeWidth={4}
                lineCap="round"
                lineJoin="round"
                dash={[10, 5]}
                listening={false}
              />
            )}

            {/* Waypoints */}
            {waypoints.map((wp, idx) => {
              const pos = getCellPos(wp.coord.x, wp.coord.y);
              const visited = isWaypointVisited(wp.coord);
              
              return (
                <Group key={`wp-${idx}`} listening={false}>
                  <Circle
                    x={pos.x}
                    y={pos.y}
                    radius={18}
                    fill={visited ? '#10B981' : '#FBBF24'}
                    stroke={visited ? '#059669' : '#F59E0B'}
                    strokeWidth={3}
                    shadowColor="#000"
                    shadowBlur={5}
                    shadowOpacity={0.3}
                  />
                  <Text
                    x={pos.x - 10}
                    y={pos.y - 10}
                    text={visited ? '✓' : wp.icon}
                    fontSize={18}
                    listening={false}
                  />
                </Group>
              );
            })}

            {/* Start point */}
            {(() => {
              const pos = getCellPos(startPoint.x, startPoint.y);
              return (
                <Group listening={false}>
                  <Circle
                    x={pos.x}
                    y={pos.y}
                    radius={18}
                    fill="#10B981"
                    stroke="#059669"
                    strokeWidth={3}
                  />
                  <Text
                    x={pos.x - 10}
                    y={pos.y - 10}
                    text="🚩"
                    fontSize={18}
                    listening={false}
                  />
                </Group>
              );
            })()}

            {/* End point (treasure) */}
            {(() => {
              const pos = getCellPos(endPoint.x, endPoint.y);
              return (
                <Group listening={false}>
                  <Circle
                    x={pos.x}
                    y={pos.y}
                    radius={20}
                    fill={reachedEnd ? '#10B981' : '#EF4444'}
                    stroke={reachedEnd ? '#059669' : '#DC2626'}
                    strokeWidth={3}
                    shadowColor="#000"
                    shadowBlur={8}
                    shadowOpacity={0.4}
                  />
                  <Text
                    x={pos.x - 12}
                    y={pos.y - 12}
                    text="💎"
                    fontSize={22}
                    listening={false}
                  />
                </Group>
              );
            })()}

            {/* Current position marker */}
            {(() => {
              const pos = getCellPos(currentPos.x, currentPos.y);
              return (
                <Circle
                  x={pos.x}
                  y={pos.y}
                  radius={8}
                  fill="#3B82F6"
                  stroke="#1D4ED8"
                  strokeWidth={2}
                  listening={false}
                />
              );
            })()}

            {/* Clickable cells - rendered LAST to be on top for clicks */}
            {Array.from({ length: GRID_SIZE }).map((_, row) =>
              Array.from({ length: GRID_SIZE }).map((_, col) => {
                const gridX = col + 1;
                const gridY = GRID_SIZE - row;
                const adjacent = isAdjacent(gridX, gridY);
                const obstacle = isObstacle(gridX, gridY);
                const inPath = isInPath(gridX, gridY);
                const clickable = adjacent && !obstacle && !inPath && !isPhaseCorrect;
                
                // Only render clickable cells to avoid blocking other interactions
                if (!clickable) return null;
                
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
                      fill="#DBEAFE"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      opacity={0.6}
                      cornerRadius={4}
                    />
                  </Group>
                );
              })
            )}

            {/* Path Info Panel */}
            <Rect
              x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 20}
              y={GRID_OFFSET_Y}
              width={180}
              height={200}
              fill="#FFF7ED"
              stroke="#D97706"
              strokeWidth={2}
              cornerRadius={10}
            />
            <Text
              x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 30}
              y={GRID_OFFSET_Y + 10}
              text="🗺️ Navigation"
              fontSize={16}
              fill="#92400E"
              fontStyle="bold"
            />
            <Text
              x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 30}
              y={GRID_OFFSET_Y + 40}
              text={`Current: (${currentPos.x}, ${currentPos.y})`}
              fontSize={14}
              fill="#374151"
            />
            <Text
              x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 30}
              y={GRID_OFFSET_Y + 65}
              text={`Steps: ${playerPath.length - 1}`}
              fontSize={14}
              fill="#374151"
            />
            <Text
              x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 30}
              y={GRID_OFFSET_Y + 90}
              text={`Keys: ${waypoints.filter(wp => isWaypointVisited(wp.coord)).length}/${waypoints.length}`}
              fontSize={14}
              fill={allWaypointsVisited ? '#10B981' : '#374151'}
            />
            <Text
              x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 30}
              y={GRID_OFFSET_Y + 120}
              text="Legend:"
              fontSize={12}
              fill="#6B7280"
              fontStyle="bold"
            />
            <Text
              x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 30}
              y={GRID_OFFSET_Y + 140}
              text="🪨 = Obstacle"
              fontSize={12}
              fill="#6B7280"
            />
            <Text
              x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 30}
              y={GRID_OFFSET_Y + 158}
              text="🔑 = Collect Key"
              fontSize={12}
              fill="#6B7280"
            />
            <Text
              x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 30}
              y={GRID_OFFSET_Y + 176}
              text="💎 = Treasure"
              fontSize={12}
              fill="#6B7280"
            />

            {/* Success overlay */}
            {isPhaseCorrect && (
              <Text
                x={0}
                y={CANVAS_HEIGHT - 40}
                width={CANVAS_WIDTH}
                text="🏆 Treasure Found! Perfect Navigation!"
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
            validationMessage.includes('🎉') || validationMessage.includes('🏆')
              ? 'bg-green-50 border border-green-300'
              : 'bg-red-50 border border-red-300'
          }`}
        >
          <p className={validationMessage.includes('🎉') || validationMessage.includes('🏆') ? 'text-green-800' : 'text-red-800'}>
            {validationMessage}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={removeLastFromPath}
          disabled={playerPath.length <= 1 || isPhaseCorrect}
          className={`px-4 py-2 rounded-lg font-bold ${
            playerPath.length > 1 && !isPhaseCorrect
              ? 'bg-gray-500 hover:bg-gray-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          ↩️ Undo
        </button>
        
        <button
          onClick={clearPath}
          disabled={playerPath.length <= 1 || isPhaseCorrect}
          className={`px-4 py-2 rounded-lg font-bold ${
            playerPath.length > 1 && !isPhaseCorrect
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          🔄 Reset Path
        </button>

        <button
          onClick={handleValidate}
          disabled={isPhaseCorrect}
          className={`flex-1 px-4 py-2 rounded-lg font-bold ${
            !isPhaseCorrect
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          ✓ Check Path
        </button>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>How to navigate:</strong> Click on highlighted adjacent cells to move. Collect all keys 🔑 
          before reaching the treasure 💎. Avoid obstacles 🪨! Move horizontally, vertically, or diagonally.
        </p>
      </div>
    </div>
  );
};

export default PathNavigatorCanvas;
