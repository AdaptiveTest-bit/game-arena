'use client';

import React, { useState, useMemo } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group, Line, RegularPolygon } from 'react-konva';
import { useShapeCityStore } from '../../store/useShapeCityStore';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;

const ITEM_EMOJIS = {
  windows: '🪟',
  wheels: '⚙️',
  trees: '🌳',
  people: '🧑',
  birds: '🐦',
  flowers: '🌸'
};

const ITEM_COLORS = {
  windows: '#87CEEB',
  wheels: '#4A4A4A',
  trees: '#228B22',
  people: '#DEB887',
  birds: '#FFD700',
  flowers: '#FF69B4'
};

export default function GroupCounterCanvas() {
  const { counterChallenge, selectGroupSize } = useShapeCityStore();
  const [selectedGroups, setSelectedGroups] = useState<number>(0);
  const [selectedRemainder, setSelectedRemainder] = useState<number>(0);

  // Generate stable positions using useMemo
  const itemPositions = useMemo(() => {
    if (!counterChallenge) return [];
    return counterChallenge.items.map((item, index) => ({
      ...item,
      displayX: 60 + (index % 8) * 65,
      displayY: 140 + Math.floor(index / 8) * 65
    }));
  }, [counterChallenge]);

  if (!counterChallenge) {
    return (
      <div className="flex items-center justify-center h-[450px]">
        <p className="text-gray-500">Loading challenge...</p>
      </div>
    );
  }

  const { itemType, groupSize, totalItems, correctGroups, correctRemainder, answered } = counterChallenge;

  const handleSubmit = () => {
    selectGroupSize(selectedGroups, selectedRemainder);
  };

  const isCorrect = answered && selectedGroups === correctGroups && selectedRemainder === correctRemainder;

  // Possible answer options
  const groupOptions = [];
  for (let g = 0; g <= Math.ceil(totalItems / groupSize); g++) {
    groupOptions.push(g);
  }

  const remainderOptions = [];
  for (let r = 0; r < groupSize; r++) {
    remainderOptions.push(r);
  }

  return (
    <div className="relative">
      {/* Instructions */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 rounded-xl px-4 py-2 shadow-lg max-w-[200px]">
        <p className="text-sm font-medium text-gray-600">Count by grouping in:</p>
        <p className="text-2xl font-bold text-blue-600">
          Groups of {groupSize}
        </p>
      </div>

      {/* Item count */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 rounded-xl px-4 py-2 shadow-lg">
        <p className="text-sm text-gray-600">Total items:</p>
        <p className="text-2xl font-bold text-gray-800">
          {ITEM_EMOJIS[itemType]} {totalItems}
        </p>
      </div>

      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          {/* Background */}
          <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#F0F8FF" />
          
          {/* Grid pattern */}
          {Array.from({ length: 10 }).map((_, i) => (
            <Line
              key={`v-${i}`}
              points={[60 + i * 65, 120, 60 + i * 65, 350]}
              stroke="#E0E0E0"
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <Line
              key={`h-${i}`}
              points={[40, 140 + i * 65, 560, 140 + i * 65]}
              stroke="#E0E0E0"
              strokeWidth={1}
            />
          ))}

          {/* Items to count */}
          {itemPositions.map((item, index) => {
            const groupIndex = Math.floor(index / groupSize);
            const isInCompleteGroup = index < correctGroups * groupSize;
            const groupColor = isInCompleteGroup 
              ? `hsl(${(groupIndex * 60) % 360}, 70%, 80%)` 
              : '#FFE4E1';
            
            return (
              <Group key={item.id}>
                {/* Group highlight background */}
                <Circle
                  x={item.displayX}
                  y={item.displayY}
                  radius={28}
                  fill={answered ? groupColor : '#FFFFFF'}
                  stroke={answered && isInCompleteGroup ? '#333' : '#DDD'}
                  strokeWidth={answered && isInCompleteGroup ? 2 : 1}
                />
                
                {/* Item representation */}
                {itemType === 'windows' && (
                  <Rect
                    x={item.displayX - 15}
                    y={item.displayY - 15}
                    width={30}
                    height={30}
                    fill={ITEM_COLORS[itemType]}
                    stroke="#333"
                    strokeWidth={2}
                    cornerRadius={3}
                  />
                )}
                {itemType === 'wheels' && (
                  <>
                    <Circle
                      x={item.displayX}
                      y={item.displayY}
                      radius={18}
                      fill={ITEM_COLORS[itemType]}
                      stroke="#222"
                      strokeWidth={2}
                    />
                    <Circle
                      x={item.displayX}
                      y={item.displayY}
                      radius={6}
                      fill="#888"
                    />
                  </>
                )}
                {itemType === 'trees' && (
                  <>
                    <Rect
                      x={item.displayX - 5}
                      y={item.displayY + 5}
                      width={10}
                      height={20}
                      fill="#8B4513"
                    />
                    <RegularPolygon
                      x={item.displayX}
                      y={item.displayY - 5}
                      sides={3}
                      radius={18}
                      fill={ITEM_COLORS[itemType]}
                    />
                  </>
                )}
                {itemType === 'people' && (
                  <>
                    <Circle
                      x={item.displayX}
                      y={item.displayY - 10}
                      radius={10}
                      fill={ITEM_COLORS[itemType]}
                    />
                    <Rect
                      x={item.displayX - 8}
                      y={item.displayY}
                      width={16}
                      height={20}
                      fill="#4169E1"
                      cornerRadius={3}
                    />
                  </>
                )}
                {itemType === 'birds' && (
                  <RegularPolygon
                    x={item.displayX}
                    y={item.displayY}
                    sides={3}
                    radius={15}
                    fill={ITEM_COLORS[itemType]}
                    rotation={-30}
                  />
                )}
                {itemType === 'flowers' && (
                  <>
                    {[0, 72, 144, 216, 288].map(angle => (
                      <Circle
                        key={angle}
                        x={item.displayX + Math.cos(angle * Math.PI / 180) * 10}
                        y={item.displayY + Math.sin(angle * Math.PI / 180) * 10}
                        radius={8}
                        fill={ITEM_COLORS[itemType]}
                      />
                    ))}
                    <Circle
                      x={item.displayX}
                      y={item.displayY}
                      radius={6}
                      fill="#FFD700"
                    />
                  </>
                )}
                
                {/* Group number label when answered */}
                {answered && isInCompleteGroup && (
                  <Text
                    x={item.displayX - 6}
                    y={item.displayY + 20}
                    text={`${groupIndex + 1}`}
                    fontSize={10}
                    fill="#333"
                    fontStyle="bold"
                  />
                )}
              </Group>
            );
          })}

          {/* Answer result overlay */}
          {answered && (
            <Group>
              <Rect
                x={150}
                y={CANVAS_HEIGHT - 80}
                width={300}
                height={60}
                fill={isCorrect ? '#90EE90' : '#FFB6C1'}
                cornerRadius={15}
                stroke={isCorrect ? '#228B22' : '#DC143C'}
                strokeWidth={3}
              />
              <Text
                x={150}
                y={CANVAS_HEIGHT - 70}
                width={300}
                text={isCorrect ? '✅ Correct!' : '❌ Not quite!'}
                fontSize={18}
                fill="#333"
                align="center"
                fontStyle="bold"
              />
              <Text
                x={150}
                y={CANVAS_HEIGHT - 45}
                width={300}
                text={`${correctGroups} groups of ${groupSize} + ${correctRemainder} left over`}
                fontSize={14}
                fill="#555"
                align="center"
              />
            </Group>
          )}
        </Layer>
      </Stage>

      {/* Answer selection UI */}
      {!answered && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 rounded-xl p-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Groups of {groupSize}:</p>
              <div className="flex gap-2">
                {groupOptions.map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGroups(g)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${
                      selectedGroups === g
                        ? 'bg-blue-500 text-white scale-110'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-2xl text-gray-400">+</div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Left over:</p>
              <div className="flex gap-2">
                {remainderOptions.map(r => (
                  <button
                    key={r}
                    onClick={() => setSelectedRemainder(r)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${
                      selectedRemainder === r
                        ? 'bg-orange-500 text-white scale-110'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all hover:scale-105 ml-4"
            >
              Check ✓
            </button>
          </div>
          
          <p className="text-center text-gray-500 text-sm mt-2">
            {totalItems} = {selectedGroups} × {groupSize} + {selectedRemainder}
          </p>
        </div>
      )}
    </div>
  );
}
