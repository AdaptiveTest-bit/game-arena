'use client';

import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Text, Group, Circle } from 'react-konva';
import { useBeachSafariStore, BeachItem } from '@/app/store/useBeachSafariStore';
import Konva from 'konva';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;

// Bin positions
const ROUND_BIN = { x: 120, y: 420, width: 160, height: 80 };
const LONG_BIN = { x: 620, y: 420, width: 160, height: 80 };

const ShapeSorterCanvas: React.FC = () => {
  const {
    sortingItems,
    roundBin,
    longBin,
    addToBin,
    sortingComplete
  } = useBeachSafariStore();

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; correct: boolean } | null>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const isOverBin = (x: number, y: number, bin: typeof ROUND_BIN) => {
    return x > bin.x - bin.width / 2 && 
           x < bin.x + bin.width / 2 && 
           y > bin.y - bin.height / 2 && 
           y < bin.y + bin.height / 2;
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, item: BeachItem) => {
    const pos = e.target.position();
    
    if (isOverBin(pos.x, pos.y, ROUND_BIN)) {
      const correct = addToBin(item, 'round');
      setFeedback({
        message: correct ? '✓ Round! Great job!' : '✗ That\'s not round!',
        correct
      });
      if (!correct) {
        // Snap back
        e.target.to({
          x: item.originalPosition.x,
          y: item.originalPosition.y,
          duration: 0.3
        });
      }
    } else if (isOverBin(pos.x, pos.y, LONG_BIN)) {
      const correct = addToBin(item, 'long');
      setFeedback({
        message: correct ? '✓ Long! Excellent!' : '✗ That\'s not long!',
        correct
      });
      if (!correct) {
        // Snap back
        e.target.to({
          x: item.originalPosition.x,
          y: item.originalPosition.y,
          duration: 0.3
        });
      }
    } else {
      // Snap back if not over any bin
      e.target.to({
        x: item.originalPosition.x,
        y: item.originalPosition.y,
        duration: 0.3
      });
    }
    
    setDraggedItem(null);
    
    // Clear feedback after delay
    setTimeout(() => setFeedback(null), 1500);
  };

  return (
    <div className="w-full">
      <Stage ref={stageRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          {/* Sky */}
          <Rect
            x={0}
            y={0}
            width={CANVAS_WIDTH}
            height={150}
            fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            fillLinearGradientEndPoint={{ x: 0, y: 150 }}
            fillLinearGradientColorStops={[0, '#87CEEB', 1, '#B0E0E6']}
          />
          
          {/* Sun */}
          <Circle x={780} y={60} radius={40} fill="#FFD700" shadowColor="#FFA500" shadowBlur={20} />
          
          {/* Beach sand */}
          <Rect
            x={0}
            y={150}
            width={CANVAS_WIDTH}
            height={350}
            fillLinearGradientStartPoint={{ x: 0, y: 150 }}
            fillLinearGradientEndPoint={{ x: 0, y: 500 }}
            fillLinearGradientColorStops={[0, '#F5E6D3', 1, '#D4A574']}
          />
          
          {/* Wave decorations */}
          <Text x={10} y={140} text="🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊" fontSize={20} listening={false} />
          
          {/* Round Bin */}
          <Group x={ROUND_BIN.x} y={ROUND_BIN.y}>
            <Rect
              x={-ROUND_BIN.width / 2}
              y={-ROUND_BIN.height / 2}
              width={ROUND_BIN.width}
              height={ROUND_BIN.height}
              fill="#4FC3F7"
              stroke="#0288D1"
              strokeWidth={4}
              cornerRadius={15}
              shadowColor="#000"
              shadowBlur={10}
              shadowOpacity={0.3}
            />
            <Text
              x={-ROUND_BIN.width / 2}
              y={-ROUND_BIN.height / 2 + 10}
              width={ROUND_BIN.width}
              text="🔵 ROUND"
              fontSize={22}
              fontStyle="bold"
              fill="#01579B"
              align="center"
              listening={false}
            />
            <Text
              x={-ROUND_BIN.width / 2}
              y={-ROUND_BIN.height / 2 + 40}
              width={ROUND_BIN.width}
              text={`${roundBin.length} items`}
              fontSize={16}
              fill="#01579B"
              align="center"
              listening={false}
            />
          </Group>
          
          {/* Long Bin */}
          <Group x={LONG_BIN.x} y={LONG_BIN.y}>
            <Rect
              x={-LONG_BIN.width / 2}
              y={-LONG_BIN.height / 2}
              width={LONG_BIN.width}
              height={LONG_BIN.height}
              fill="#FFB74D"
              stroke="#F57C00"
              strokeWidth={4}
              cornerRadius={15}
              shadowColor="#000"
              shadowBlur={10}
              shadowOpacity={0.3}
            />
            <Text
              x={-LONG_BIN.width / 2}
              y={-LONG_BIN.height / 2 + 10}
              width={LONG_BIN.width}
              text="📏 LONG"
              fontSize={22}
              fontStyle="bold"
              fill="#E65100"
              align="center"
              listening={false}
            />
            <Text
              x={-LONG_BIN.width / 2}
              y={-LONG_BIN.height / 2 + 40}
              width={LONG_BIN.width}
              text={`${longBin.length} items`}
              fontSize={16}
              fill="#E65100"
              align="center"
              listening={false}
            />
          </Group>
          
          {/* Instructions */}
          <Text
            x={CANVAS_WIDTH / 2 - 150}
            y={390}
            width={300}
            text="⬇️ Drag items to bins! ⬇️"
            fontSize={18}
            fill="#795548"
            align="center"
            listening={false}
          />
          
          {/* Coco the Crab */}
          <Group x={800} y={320}>
            <Text x={-20} y={0} text="🦀" fontSize={50} listening={false} />
            <Rect
              x={-80}
              y={-50}
              width={80}
              height={45}
              fill="white"
              stroke="#FFB74D"
              strokeWidth={2}
              cornerRadius={10}
            />
            <Text
              x={-75}
              y={-45}
              width={70}
              text={sortingComplete ? "Great job!" : "Sort them!"}
              fontSize={12}
              fill="#795548"
              align="center"
              wrap="word"
              listening={false}
            />
          </Group>
          
          {/* Draggable Items */}
          {sortingItems.map((item) => (
            <Group
              key={item.id}
              x={item.position.x}
              y={item.position.y}
              draggable
              onDragStart={() => setDraggedItem(item.id)}
              onDragEnd={(e) => handleDragEnd(e, item)}
            >
              <Circle
                radius={30}
                fill={draggedItem === item.id ? '#FFF9C4' : '#FFFFFF'}
                stroke={draggedItem === item.id ? '#FFC107' : '#E0E0E0'}
                strokeWidth={3}
                shadowColor="#000"
                shadowBlur={draggedItem === item.id ? 15 : 5}
                shadowOpacity={0.3}
              />
              <Text
                x={-18}
                y={-18}
                text={item.icon}
                fontSize={36}
                listening={false}
              />
            </Group>
          ))}
          
          {/* Feedback Message */}
          {feedback && (
            <Group x={CANVAS_WIDTH / 2} y={50}>
              <Rect
                x={-120}
                y={-25}
                width={240}
                height={50}
                fill={feedback.correct ? '#C8E6C9' : '#FFCDD2'}
                stroke={feedback.correct ? '#4CAF50' : '#F44336'}
                strokeWidth={3}
                cornerRadius={25}
              />
              <Text
                x={-120}
                y={-10}
                width={240}
                text={feedback.message}
                fontSize={20}
                fontStyle="bold"
                fill={feedback.correct ? '#2E7D32' : '#C62828'}
                align="center"
                listening={false}
              />
            </Group>
          )}
          
          {/* Completion Message */}
          {sortingComplete && (
            <Group x={CANVAS_WIDTH / 2} y={CANVAS_HEIGHT / 2}>
              <Rect
                x={-150}
                y={-50}
                width={300}
                height={100}
                fill="#E8F5E9"
                stroke="#4CAF50"
                strokeWidth={4}
                cornerRadius={20}
                shadowColor="#000"
                shadowBlur={20}
                shadowOpacity={0.4}
              />
              <Text
                x={-150}
                y={-30}
                width={300}
                text="🎉 All Sorted! 🎉"
                fontSize={28}
                fontStyle="bold"
                fill="#2E7D32"
                align="center"
                listening={false}
              />
              <Text
                x={-150}
                y={10}
                width={300}
                text="Click 'Continue' to proceed!"
                fontSize={16}
                fill="#388E3C"
                align="center"
                listening={false}
              />
            </Group>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default ShapeSorterCanvas;
