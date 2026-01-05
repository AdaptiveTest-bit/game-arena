'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Stage, Layer, Rect, Text, Group, Circle, Line } from 'react-konva';
import { useBeachSafariStore } from '@/app/store/useBeachSafariStore';
import Konva from 'konva';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;

// Bucket position
const BUCKET = { x: 720, y: 280, width: 140, height: 180 };

// Generate stable bucket positions for items
const generateBucketPositions = (count: number): Array<{ x: number; y: number }> => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    // Use index-based deterministic positioning
    const angle = (i / count) * Math.PI * 2;
    const radius = 30 + (i % 3) * 15;
    positions.push({
      x: BUCKET.x + Math.cos(angle) * radius,
      y: BUCKET.y + Math.sin(angle) * radius
    });
  }
  return positions;
};

const BucketCounterCanvas: React.FC = () => {
  const {
    countingChallenge,
    bucketContents,
    addToBucket,
    removeFromBucket,
    submitBucketCount
  } = useBeachSafariStore();

  const [feedback, setFeedback] = useState<{ message: string; correct: boolean } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const stageRef = useRef<Konva.Stage>(null);

  // Pre-compute bucket positions for all possible items
  const bucketPositions = useMemo(() => {
    if (!countingChallenge) return [];
    return generateBucketPositions(countingChallenge.availableItems.length);
  }, [countingChallenge]);

  if (!countingChallenge) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const { targetCount, availableItems, itemIcon } = countingChallenge;

  const isInBucket = (x: number, y: number) => {
    return x > BUCKET.x - BUCKET.width / 2 && 
           x < BUCKET.x + BUCKET.width / 2 && 
           y > BUCKET.y - BUCKET.height / 2 && 
           y < BUCKET.y + BUCKET.height / 2;
  };

  const getBucketPosition = (itemId: string) => {
    const index = availableItems.findIndex(item => item.id === itemId);
    return bucketPositions[index] || { x: BUCKET.x, y: BUCKET.y };
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, itemId: string, originalPos: { x: number; y: number }) => {
    const pos = e.target.position();
    
    if (isInBucket(pos.x, pos.y) && !bucketContents.includes(itemId)) {
      addToBucket(itemId);
      const bucketPos = getBucketPosition(itemId);
      e.target.to({
        x: bucketPos.x,
        y: bucketPos.y,
        duration: 0.2
      });
    } else if (!isInBucket(pos.x, pos.y) && bucketContents.includes(itemId)) {
      removeFromBucket(itemId);
      e.target.to({
        x: originalPos.x,
        y: originalPos.y,
        duration: 0.3
      });
    } else if (!bucketContents.includes(itemId)) {
      e.target.to({
        x: originalPos.x,
        y: originalPos.y,
        duration: 0.3
      });
    }
  };

  const handleSubmit = () => {
    if (submitted) return;
    
    const correct = submitBucketCount();
    setSubmitted(true);
    setFeedback({
      message: correct 
        ? `🎉 Perfect! You counted exactly ${targetCount}!` 
        : `Oops! You put ${bucketContents.length}, but we needed ${targetCount}!`,
      correct
    });
  };

  return (
    <div className="w-full">
      {/* Target Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-4xl">🪣</span>
          <div>
            <p className="text-lg font-bold">Put exactly {targetCount} items in the bucket!</p>
            <p className="text-sm opacity-90">Drag the {itemIcon} to the bucket</p>
          </div>
        </div>
        <div className="bg-white/20 rounded-xl px-6 py-3 text-center">
          <p className="text-3xl font-bold">{bucketContents.length} / {targetCount}</p>
          <p className="text-xs opacity-80">In Bucket</p>
        </div>
      </div>

      <Stage ref={stageRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          {/* Beach Background */}
          <Rect
            x={0}
            y={0}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            fillLinearGradientEndPoint={{ x: 0, y: CANVAS_HEIGHT }}
            fillLinearGradientColorStops={[0, '#F5E6D3', 1, '#D4A574']}
          />

          {/* Scattered area background */}
          <Rect
            x={30}
            y={50}
            width={580}
            height={340}
            fill="#FFF8E1"
            stroke="#FFE082"
            strokeWidth={3}
            cornerRadius={20}
            dash={[10, 5]}
          />
          <Text
            x={30}
            y={60}
            width={580}
            text="🏖️ Beach Items - Drag to Bucket! 🏖️"
            fontSize={16}
            fill="#8D6E63"
            align="center"
            listening={false}
          />

          {/* Bucket */}
          <Group x={BUCKET.x} y={BUCKET.y}>
            {/* Bucket shadow */}
            <Rect
              x={-BUCKET.width / 2 + 10}
              y={-BUCKET.height / 2 + 10}
              width={BUCKET.width}
              height={BUCKET.height}
              fill="#00000022"
              cornerRadius={[10, 10, 30, 30]}
            />
            {/* Bucket body */}
            <Rect
              x={-BUCKET.width / 2}
              y={-BUCKET.height / 2}
              width={BUCKET.width}
              height={BUCKET.height}
              fill={bucketContents.length === targetCount ? '#81C784' : '#4FC3F7'}
              stroke={bucketContents.length === targetCount ? '#388E3C' : '#0288D1'}
              strokeWidth={5}
              cornerRadius={[10, 10, 30, 30]}
            />
            {/* Bucket rim */}
            <Rect
              x={-BUCKET.width / 2 - 5}
              y={-BUCKET.height / 2 - 10}
              width={BUCKET.width + 10}
              height={25}
              fill={bucketContents.length === targetCount ? '#66BB6A' : '#29B6F6'}
              stroke={bucketContents.length === targetCount ? '#388E3C' : '#0288D1'}
              strokeWidth={3}
              cornerRadius={8}
            />
            {/* Handle */}
            <Line
              points={[-50, -BUCKET.height / 2 - 20, 0, -BUCKET.height / 2 - 50, 50, -BUCKET.height / 2 - 20]}
              stroke="#795548"
              strokeWidth={8}
              lineCap="round"
              lineJoin="round"
            />
            {/* Bucket label */}
            <Text
              x={-BUCKET.width / 2}
              y={BUCKET.height / 2 + 10}
              width={BUCKET.width}
              text="🪣 BUCKET"
              fontSize={18}
              fontStyle="bold"
              fill="#5D4037"
              align="center"
              listening={false}
            />
            {/* Count display */}
            <Circle
              x={0}
              y={0}
              radius={35}
              fill="white"
              stroke={bucketContents.length === targetCount ? '#4CAF50' : '#FFC107'}
              strokeWidth={4}
            />
            <Text
              x={-20}
              y={-15}
              width={40}
              text={String(bucketContents.length)}
              fontSize={32}
              fontStyle="bold"
              fill={bucketContents.length === targetCount ? '#4CAF50' : '#FF9800'}
              align="center"
              listening={false}
            />
          </Group>

          {/* Available Items */}
          {availableItems.map((item) => {
            const isInBucketState = bucketContents.includes(item.id);
            const bucketPos = getBucketPosition(item.id);
            
            return (
              <Group
                key={item.id}
                x={isInBucketState ? bucketPos.x : item.position.x}
                y={isInBucketState ? bucketPos.y : item.position.y}
                draggable={!submitted}
                onDragEnd={(e) => handleDragEnd(e, item.id, item.position)}
              >
                <Circle
                  radius={25}
                  fill={isInBucketState ? '#E3F2FD' : '#FFFFFF'}
                  stroke={isInBucketState ? '#2196F3' : '#BDBDBD'}
                  strokeWidth={2}
                  shadowColor="#000"
                  shadowBlur={5}
                  shadowOpacity={0.2}
                />
                <Text
                  x={-15}
                  y={-15}
                  text={item.icon}
                  fontSize={28}
                  listening={false}
                />
              </Group>
            );
          })}

          {/* Submit Button */}
          {!submitted && (
            <Group
              x={BUCKET.x}
              y={BUCKET.y + BUCKET.height / 2 + 60}
              onClick={handleSubmit}
              onTap={handleSubmit}
            >
              <Rect
                x={-70}
                y={-20}
                width={140}
                height={45}
                fill={bucketContents.length === targetCount ? '#4CAF50' : '#FF9800'}
                stroke={bucketContents.length === targetCount ? '#388E3C' : '#F57C00'}
                strokeWidth={3}
                cornerRadius={22}
                shadowColor="#000"
                shadowBlur={10}
                shadowOpacity={0.3}
              />
              <Text
                x={-70}
                y={-8}
                width={140}
                text="✓ Check!"
                fontSize={22}
                fontStyle="bold"
                fill="white"
                align="center"
                listening={false}
              />
            </Group>
          )}

          {/* Feedback Message */}
          {feedback && (
            <Group x={CANVAS_WIDTH / 2} y={CANVAS_HEIGHT - 60}>
              <Rect
                x={-200}
                y={-25}
                width={400}
                height={50}
                fill={feedback.correct ? '#E8F5E9' : '#FFEBEE'}
                stroke={feedback.correct ? '#4CAF50' : '#F44336'}
                strokeWidth={4}
                cornerRadius={25}
                shadowColor="#000"
                shadowBlur={10}
                shadowOpacity={0.3}
              />
              <Text
                x={-200}
                y={-12}
                width={400}
                text={feedback.message}
                fontSize={18}
                fontStyle="bold"
                fill={feedback.correct ? '#2E7D32' : '#C62828'}
                align="center"
                listening={false}
              />
            </Group>
          )}

          {/* Counting helper */}
          <Group x={50} y={420}>
            <Text
              text={`Count: ${Array.from({ length: Math.min(bucketContents.length, 20) }).map((_, i) => i + 1).join(', ')}${bucketContents.length > 0 ? '' : '...'}`}
              fontSize={14}
              fill="#795548"
              listening={false}
            />
          </Group>

          {/* Coco helper */}
          <Group x={850} y={450}>
            <Text x={-30} y={-40} text="🦀" fontSize={40} listening={false} />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default BucketCounterCanvas;
