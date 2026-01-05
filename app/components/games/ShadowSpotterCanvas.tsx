'use client';

import React, { useState } from 'react';
import { Stage, Layer, Group, Circle, Rect, RegularPolygon, Text, Line } from 'react-konva';
import { useShadowStoryStore } from '../../store/useShadowStoryStore';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;

// Pre-generated stars (generated once at module load)
const STARS = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  x: (i * 137.5) % CANVAS_WIDTH,
  y: (i * 73) % 300,
  radius: 1 + (i % 3),
  opacity: 0.3 + (i % 5) * 0.1,
}));

type ShapeType = 'circle' | 'square' | 'triangle' | 'rectangle';

const BUCKET_POSITIONS = {
  circle: { x: 75, y: 400 },
  square: { x: 225, y: 400 },
  triangle: { x: 375, y: 400 },
  rectangle: { x: 525, y: 400 },
};

const SHAPE_COLORS = {
  circle: '#8b5cf6',
  square: '#3b82f6',
  triangle: '#ec4899',
  rectangle: '#f59e0b',
};

const GLOW_COLORS = {
  circle: '#fbbf24',
  square: '#34d399',
  triangle: '#f472b6',
  rectangle: '#fcd34d',
};

export default function ShadowSpotterCanvas() {
  const { spotterChallenge, revealShadow, sortShape } = useShadowStoryStore();
  const [selectedShadow, setSelectedShadow] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; x: number; y: number } | null>(null);

  if (!spotterChallenge) {
    return (
      <div className="flex items-center justify-center h-[450px]">
        <p className="text-purple-300">Loading shadows...</p>
      </div>
    );
  }

  const { shadows, buckets } = spotterChallenge;
  const sortedCount = shadows.filter(s => s.sorted).length;
  const totalCount = shadows.length;

  const handleShadowClick = (id: string) => {
    const shadow = shadows.find(s => s.id === id);
    if (!shadow) return;

    if (!shadow.revealed) {
      revealShadow(id);
    } else if (!shadow.sorted) {
      setSelectedShadow(selectedShadow === id ? null : id);
    }
  };

  const handleBucketClick = (bucketType: ShapeType) => {
    if (!selectedShadow) return;

    const shadow = shadows.find(s => s.id === selectedShadow);
    if (!shadow) return;

    const isCorrect = sortShape(selectedShadow, bucketType);
    
    setFeedback({
      correct: isCorrect,
      x: BUCKET_POSITIONS[bucketType].x,
      y: BUCKET_POSITIONS[bucketType].y - 50,
    });

    setTimeout(() => setFeedback(null), 800);
    setSelectedShadow(null);
  };

  const renderShape = (type: ShapeType, x: number, y: number, size: number, fill: string, rotation = 0) => {
    switch (type) {
      case 'circle':
        return <Circle x={x} y={y} radius={size} fill={fill} rotation={rotation} />;
      case 'square':
        return <Rect x={x - size} y={y - size} width={size * 2} height={size * 2} fill={fill} rotation={rotation} />;
      case 'triangle':
        return <RegularPolygon x={x} y={y} sides={3} radius={size * 1.2} fill={fill} rotation={rotation} />;
      case 'rectangle':
        return <Rect x={x - size * 1.3} y={y - size * 0.8} width={size * 2.6} height={size * 1.6} fill={fill} rotation={rotation} />;
    }
  };

  return (
    <div className="relative">
      {/* Progress Display */}
      <div className="absolute top-4 left-4 z-10 bg-purple-900/80 rounded-xl px-4 py-2 border border-purple-500/50">
        <p className="text-purple-200 text-sm">Shapes Found</p>
        <p className="text-2xl font-bold text-yellow-400">{sortedCount} / {totalCount}</p>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 z-10 bg-purple-900/80 rounded-xl px-3 py-2 border border-purple-500/50 max-w-[180px]">
        <p className="text-purple-200 text-xs">
          {selectedShadow 
            ? "👆 Now tap the matching bucket below!" 
            : "👆 Tap shadows to reveal shapes!"}
        </p>
      </div>

      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          {/* Background gradient */}
          <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#1a1a2e" />
          
          {/* Stars background */}
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

          {/* Ground line */}
          <Line
            points={[0, 340, CANVAS_WIDTH, 340]}
            stroke="#4a4a6a"
            strokeWidth={2}
          />

          {/* Shadows / Revealed Shapes */}
          {shadows.map((shadow) => (
            <Group
              key={shadow.id}
              x={shadow.x}
              y={shadow.y}
              rotation={shadow.rotation}
              onClick={() => handleShadowClick(shadow.id)}
              onTap={() => handleShadowClick(shadow.id)}
              opacity={shadow.sorted ? 0.3 : 1}
            >
              {!shadow.revealed ? (
                // Shadow blob
                <Group>
                  <Circle
                    x={0}
                    y={0}
                    radius={35}
                    fill="#4a4a6a"
                    shadowBlur={15}
                    shadowColor="#8b5cf6"
                    shadowOpacity={0.5}
                  />
                  <Text
                    x={-10}
                    y={-8}
                    text="?"
                    fontSize={24}
                    fill="#7c7c9c"
                    fontStyle="bold"
                  />
                </Group>
              ) : (
                // Revealed shape
                <Group>
                  {/* Glow effect */}
                  {renderShape(shadow.shape, 0, 0, 32, GLOW_COLORS[shadow.shape])}
                  {/* Main shape */}
                  {renderShape(shadow.shape, 0, 0, 28, SHAPE_COLORS[shadow.shape])}
                  {/* Selection ring */}
                  {selectedShadow === shadow.id && (
                    <Circle
                      x={0}
                      y={0}
                      radius={40}
                      stroke="#ffd700"
                      strokeWidth={3}
                      dash={[8, 4]}
                    />
                  )}
                </Group>
              )}
            </Group>
          ))}

          {/* Buckets */}
          {(Object.entries(BUCKET_POSITIONS) as [ShapeType, { x: number; y: number }][]).map(([type, pos]) => (
            <Group
              key={type}
              x={pos.x}
              y={pos.y}
              onClick={() => handleBucketClick(type)}
              onTap={() => handleBucketClick(type)}
            >
              {/* Bucket body */}
              <Rect
                x={-45}
                y={-35}
                width={90}
                height={70}
                fill="#2a2a4a"
                stroke={SHAPE_COLORS[type]}
                strokeWidth={3}
                cornerRadius={10}
              />
              
              {/* Shape icon */}
              {renderShape(type, 0, -5, 18, SHAPE_COLORS[type])}
              
              {/* Count badge */}
              <Circle
                x={35}
                y={-25}
                radius={12}
                fill="#1a1a2e"
                stroke="#ffd700"
                strokeWidth={2}
              />
              <Text
                x={28}
                y={-32}
                text={String(buckets[type].length)}
                fontSize={14}
                fill="#ffd700"
                fontStyle="bold"
              />
            </Group>
          ))}

          {/* Feedback animation */}
          {feedback && (
            <Group x={feedback.x} y={feedback.y}>
              <Text
                x={-20}
                text={feedback.correct ? "✓" : "✗"}
                fontSize={32}
                fill={feedback.correct ? "#22c55e" : "#ef4444"}
                fontStyle="bold"
              />
            </Group>
          )}
        </Layer>
      </Stage>
    </div>
  );
}
