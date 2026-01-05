'use client';

import React, { useState, useMemo } from 'react';
import { Stage, Layer, Group, Circle, Rect, Text, Line, RegularPolygon } from 'react-konva';
import { useShadowStoryStore } from '../../store/useShadowStoryStore';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;

// Pre-generated stars
const STARS = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  x: (i * 97) % CANVAS_WIDTH,
  y: (i * 37) % 150,
  radius: 1 + (i % 2) * 0.5,
  opacity: 0.3 + (i % 5) * 0.1,
}));

export default function VillageCounterCanvas() {
  const { villageChallenge, revealHouse, selectNextCount } = useShadowStoryStore();
  const [feedback, setFeedback] = useState<{ correct: boolean; value: number } | null>(null);

  // Generate answer options deterministically based on challenge state
  const answerOptions = useMemo(() => {
    if (!villageChallenge) return [];
    
    const expected = villageChallenge.countSequence[villageChallenge.currentIndex] || 0;
    
    // Generate deterministic distractors based on expected value
    const distractors = [
      expected - 20,
      expected - 10,
      expected + 10,
      expected + 20,
    ].filter(d => d > 0 && d !== expected);
    
    // Take 3 distractors and add correct answer
    const options = [expected, ...distractors.slice(0, 3)];
    return options.sort((a, b) => a - b);
  }, [villageChallenge]);

  if (!villageChallenge) {
    return (
      <div className="flex items-center justify-center h-[450px]">
        <p className="text-purple-300">Loading village...</p>
      </div>
    );
  }

  const { houses, countSequence, currentIndex, totalTarget, playerSequence, errors } = villageChallenge;
  const isComplete = currentIndex >= countSequence.length;

  const handleHouseClick = (id: string, index: number) => {
    // Only reveal houses in order
    if (index === currentIndex) {
      revealHouse(id);
    }
  };

  const handleAnswerClick = (value: number) => {
    if (isComplete) return;
    
    const isCorrect = selectNextCount(value);
    setFeedback({ correct: isCorrect, value });
    
    setTimeout(() => setFeedback(null), 800);
  };

  return (
    <div className="relative">
      {/* Progress Display */}
      <div className="absolute top-4 left-4 z-10 bg-purple-900/80 rounded-xl px-4 py-2 border border-purple-500/50">
        <p className="text-purple-200 text-sm">Count Progress</p>
        <p className="text-yellow-400 font-bold text-lg">
          {currentIndex} / {houses.length} houses
        </p>
        {errors > 0 && <p className="text-red-400 text-xs">Errors: {errors}</p>}
      </div>

      {/* Total Display */}
      <div className="absolute top-4 right-4 z-10 bg-purple-900/80 rounded-xl px-4 py-2 border border-purple-500/50">
        <p className="text-purple-200 text-sm">Village Total</p>
        <p className="text-2xl font-bold text-green-400">{totalTarget}</p>
      </div>

      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          {/* Night sky background */}
          <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#0f0f23" />
          
          {/* Stars */}
          {STARS.map((star) => (
            <Circle
              key={`star-${star.id}`}
              x={star.x}
              y={star.y}
              radius={star.radius}
              fill="#fff"
              opacity={star.opacity}
            />
          ))}

          {/* Moon */}
          <Circle
            x={520}
            y={60}
            radius={35}
            fill="#fdf5e6"
            shadowBlur={20}
            shadowColor="#fdf5e6"
          />
          <Circle
            x={530}
            y={55}
            radius={28}
            fill="#0f0f23"
          />

          {/* Ground */}
          <Rect
            x={0}
            y={280}
            width={CANVAS_WIDTH}
            height={170}
            fill="#1a2a1a"
          />

          {/* Houses */}
          {houses.map((house, index) => {
            const houseX = 60 + index * (480 / houses.length);
            const houseY = 220;
            const isRevealed = house.revealed || index < currentIndex;
            const isNext = index === currentIndex && !house.revealed;
            
            return (
              <Group
                key={house.id}
                x={houseX}
                y={houseY}
                onClick={() => handleHouseClick(house.id, index)}
                onTap={() => handleHouseClick(house.id, index)}
              >
                {/* House base */}
                <Rect
                  x={-30}
                  y={0}
                  width={60}
                  height={50}
                  fill={isRevealed ? '#4a3a6a' : '#2a2a3a'}
                  stroke={isNext ? '#ffd700' : '#6a5a8a'}
                  strokeWidth={isNext ? 3 : 2}
                  cornerRadius={3}
                />
                
                {/* Roof */}
                <RegularPolygon
                  x={0}
                  y={-15}
                  sides={3}
                  radius={40}
                  fill={isRevealed ? '#8b5cf6' : '#4a4a5a'}
                  rotation={180}
                />
                
                {/* Window/Door */}
                <Rect
                  x={-10}
                  y={20}
                  width={20}
                  height={25}
                  fill={isRevealed ? '#ffd700' : '#1a1a2a'}
                  cornerRadius={[5, 5, 0, 0]}
                />

                {/* Bundles display */}
                {isRevealed && (
                  <Group y={-55}>
                    <Rect
                      x={-25}
                      y={-15}
                      width={50}
                      height={30}
                      fill="#2ecc71"
                      stroke="#27ae60"
                      strokeWidth={2}
                      cornerRadius={5}
                    />
                    <Text
                      x={-20}
                      y={-8}
                      text={`${house.bundles * 10}`}
                      fontSize={18}
                      fill="#fff"
                      fontStyle="bold"
                      width={40}
                      align="center"
                    />
                  </Group>
                )}

                {/* Next indicator */}
                {isNext && (
                  <Text
                    x={-10}
                    y={-70}
                    text="👆"
                    fontSize={24}
                  />
                )}
              </Group>
            );
          })}

          {/* Count sequence path */}
          <Group y={330}>
            <Line
              points={[30, 0, CANVAS_WIDTH - 30, 0]}
              stroke="#4a4a6a"
              strokeWidth={3}
            />
            
            {/* Revealed counts */}
            {playerSequence.map((count, i) => (
              <Group key={`count-${i}`} x={50 + i * (500 / houses.length)}>
                <Circle
                  radius={22}
                  fill="#22c55e"
                  stroke="#16a34a"
                  strokeWidth={2}
                />
                <Text
                  x={-15}
                  y={-8}
                  text={String(count)}
                  fontSize={16}
                  fill="#fff"
                  fontStyle="bold"
                  width={30}
                  align="center"
                />
              </Group>
            ))}

            {/* Next slot */}
            {!isComplete && (
              <Group x={50 + currentIndex * (500 / houses.length)}>
                <Circle
                  radius={22}
                  fill="#1a1a2e"
                  stroke="#ffd700"
                  strokeWidth={2}
                  dash={[5, 5]}
                />
                <Text
                  x={-5}
                  y={-8}
                  text="?"
                  fontSize={18}
                  fill="#ffd700"
                  fontStyle="bold"
                />
              </Group>
            )}
          </Group>

          {/* Answer options */}
          {!isComplete && houses[currentIndex]?.revealed && (
            <Group y={390}>
              <Text
                x={CANVAS_WIDTH / 2 - 100}
                y={-25}
                text="What comes next?"
                fontSize={14}
                fill="#a78bfa"
                width={200}
                align="center"
              />
              {answerOptions.map((option, i) => (
                <Group
                  key={`option-${option}`}
                  x={120 + i * 100}
                  onClick={() => handleAnswerClick(option)}
                  onTap={() => handleAnswerClick(option)}
                >
                  <Rect
                    x={-35}
                    y={-15}
                    width={70}
                    height={40}
                    fill={feedback?.value === option 
                      ? (feedback.correct ? '#22c55e' : '#ef4444')
                      : '#4a3a6a'
                    }
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    cornerRadius={8}
                  />
                  <Text
                    x={-30}
                    y={-5}
                    text={String(option)}
                    fontSize={18}
                    fill="#fff"
                    fontStyle="bold"
                    width={60}
                    align="center"
                  />
                </Group>
              ))}
            </Group>
          )}

          {/* Complete message */}
          {isComplete && (
            <Group x={CANVAS_WIDTH / 2} y={400}>
              <Rect
                x={-100}
                y={-20}
                width={200}
                height={45}
                fill="#22c55e"
                cornerRadius={10}
              />
              <Text
                x={-90}
                y={-8}
                text={`🎉 Total: ${totalTarget} gems!`}
                fontSize={18}
                fill="#fff"
                fontStyle="bold"
                width={180}
                align="center"
              />
            </Group>
          )}
        </Layer>
      </Stage>
    </div>
  );
}
