'use client';

import React, { useState } from 'react';
import { Stage, Layer, Group, Rect, Text, Circle } from 'react-konva';
import { useNumberJungleStore, JUNGLE_EMOJIS, type DisplayObject } from '../../store/useNumberJungleStore';

interface NumberJungleCanvasProps {
  width: number;
  height: number;
}

// Render jungle object as emoji
const JungleObject: React.FC<{
  obj: DisplayObject;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ obj, isSelected, onClick }) => {
  const emoji = JUNGLE_EMOJIS[obj.type];

  return (
    <Group x={obj.x} y={obj.y} onClick={onClick} onTap={onClick}>
      {isSelected && (
        <Circle
          x={0}
          y={0}
          radius={obj.size / 2 + 8}
          fill="#4ade80"
          opacity={0.5}
        />
      )}
      <Text
        text={emoji}
        fontSize={obj.size}
        x={-obj.size / 2}
        y={-obj.size / 2}
        rotation={obj.rotation}
      />
    </Group>
  );
};

// Number box for sequence display
const NumberBox: React.FC<{
  value: number | null;
  x: number;
  y: number;
  size: number;
  isMissing?: boolean;
}> = ({ value, x, y, size, isMissing }) => {
  return (
    <Group x={x} y={y}>
      <Rect
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        fill={isMissing ? '#fef3c7' : '#dbeafe'}
        stroke={isMissing ? '#f59e0b' : '#3b82f6'}
        strokeWidth={3}
        cornerRadius={10}
      />
      <Text
        text={value !== null ? value.toString() : '?'}
        fontSize={size * 0.6}
        fontStyle="bold"
        fill={isMissing ? '#f59e0b' : '#1e40af'}
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        align="center"
        verticalAlign="middle"
      />
    </Group>
  );
};

// Compare groups visualization
const CompareGroupsVisual: React.FC<{
  groupA: DisplayObject[];
  groupB: DisplayObject[];
}> = ({ groupA, groupB }) => {
  return (
    <Group>
      {/* Group A Background */}
      <Rect
        x={10}
        y={50}
        width={185}
        height={180}
        fill="#fef3c7"
        stroke="#f59e0b"
        strokeWidth={2}
        cornerRadius={12}
      />
      <Text
        text="Group A"
        fontSize={16}
        fontStyle="bold"
        fill="#b45309"
        x={10}
        width={185}
        y={55}
        align="center"
      />

      {/* Group B Background */}
      <Rect
        x={205}
        y={50}
        width={185}
        height={180}
        fill="#dbeafe"
        stroke="#3b82f6"
        strokeWidth={2}
        cornerRadius={12}
      />
      <Text
        text="Group B"
        fontSize={16}
        fontStyle="bold"
        fill="#1e40af"
        x={205}
        width={185}
        y={55}
        align="center"
      />

      {/* Render objects */}
      {groupA.map((obj) => (
        <JungleObject key={obj.id} obj={obj} />
      ))}
      {groupB.map((obj) => (
        <JungleObject key={obj.id} obj={obj} />
      ))}
    </Group>
  );
};

// Main canvas component
const NumberJungleCanvas: React.FC<NumberJungleCanvasProps> = ({ width, height }) => {
  const { currentChallenge, selectedObjects, toggleObjectSelection, orderedSequence, reorderSequence, showFeedback } = useNumberJungleStore();
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragX, setDragX] = useState(0);

  if (!currentChallenge) {
    return (
      <Stage width={width} height={height}>
        <Layer>
          <Rect x={0} y={0} width={width} height={height} fill="#bbf7d0" />
          <Text
            text="🌴 Number Jungle 🌴"
            fontSize={32}
            fontStyle="bold"
            fill="#166534"
            x={0}
            y={height / 2 - 20}
            width={width}
            align="center"
          />
        </Layer>
      </Stage>
    );
  }

  const renderChallengeContent = () => {
    switch (currentChallenge.type) {
      case 'count-objects':
      case 'match-number':
        return (
          <Group>
            {currentChallenge.data.displayObjects?.map((obj) => (
              <JungleObject key={obj.id} obj={obj} />
            ))}
          </Group>
        );

      case 'tap-the-number':
        return (
          <Group>
            {/* Show large target instruction */}
            <Text
              text={currentChallenge.data.targetNumber?.toString() || ''}
              fontSize={120}
              fontStyle="bold"
              fill="#166534"
              x={0}
              y={60}
              width={width}
              align="center"
              opacity={0.15}
            />
            <Text
              text="🔍"
              fontSize={80}
              x={width / 2 - 40}
              y={120}
            />
          </Group>
        );

      case 'missing-number': {
        const sequence = currentChallenge.data.numberSequence || [];
        const boxSize = Math.min(60, (width - 40) / sequence.length - 10);
        const startX = (width - sequence.length * (boxSize + 10)) / 2 + boxSize / 2;

        return (
          <Group>
            {sequence.map((num, idx) => (
              <NumberBox
                key={idx}
                value={num}
                x={startX + idx * (boxSize + 10)}
                y={150}
                size={boxSize}
                isMissing={num === null}
              />
            ))}
            {/* Arrows between boxes */}
            {sequence.slice(0, -1).map((_, idx) => (
              <Text
                key={`arrow-${idx}`}
                text="→"
                fontSize={24}
                fill="#6b7280"
                x={startX + idx * (boxSize + 10) + boxSize / 2}
                y={145}
              />
            ))}
          </Group>
        );
      }

      case 'number-sequence': {
        // Use orderedSequence for drag-drop
        const sequence = orderedSequence;
        const correctSequence = currentChallenge.data.correctAnswer as number[];
        const boxSize = Math.min(70, (width - 40) / sequence.length - 15);
        const gap = 15;
        const totalWidth = sequence.length * boxSize + (sequence.length - 1) * gap;
        const startX = (width - totalWidth) / 2 + boxSize / 2;

        // Calculate drop zones
        const getDropIndex = (x: number): number => {
          for (let i = 0; i < sequence.length; i++) {
            const boxCenterX = startX + i * (boxSize + gap);
            if (x < boxCenterX + boxSize / 2 + gap / 2) {
              return i;
            }
          }
          return sequence.length - 1;
        };

        return (
          <Group>
            {/* Drop zone indicators */}
            {sequence.map((_, idx) => (
              <Rect
                key={`zone-${idx}`}
                x={startX + idx * (boxSize + gap) - boxSize / 2 - 3}
                y={120 - 3}
                width={boxSize + 6}
                height={boxSize + 6}
                fill="transparent"
                stroke="#94a3b8"
                strokeWidth={2}
                dash={[5, 5]}
                cornerRadius={12}
                opacity={0.5}
              />
            ))}

            {/* Instruction text */}
            <Text
              text="👆 Drag numbers to arrange them"
              fontSize={14}
              fill="#6b7280"
              x={0}
              y={60}
              width={width}
              align="center"
            />

            {/* Arrows between drop zones */}
            {sequence.slice(0, -1).map((_, idx) => (
              <Text
                key={`arrow-${idx}`}
                text="→"
                fontSize={20}
                fill="#6b7280"
                x={startX + idx * (boxSize + gap) + boxSize / 2 - 3}
                y={145}
              />
            ))}

            {/* Draggable number boxes */}
            {sequence.map((num, idx) => {
              const isDragging = draggingIndex === idx;
              const isCorrectPosition = showFeedback && num === correctSequence[idx];
              const isWrongPosition = showFeedback && num !== correctSequence[idx];

              return (
                <Group
                  key={`drag-${num}-${idx}`}
                  x={isDragging ? dragX : startX + idx * (boxSize + gap)}
                  y={isDragging ? 110 : 120}
                  draggable={!showFeedback}
                  onDragStart={() => {
                    setDraggingIndex(idx);
                    setDragX(startX + idx * (boxSize + gap));
                  }}
                  onDragMove={(e) => {
                    const newX = e.target.x();
                    setDragX(newX);
                    e.target.y(110); // Keep vertical position fixed while dragging
                  }}
                  onDragEnd={(e) => {
                    const dropX = e.target.x();
                    const newIndex = getDropIndex(dropX);
                    if (newIndex !== idx) {
                      reorderSequence(idx, newIndex);
                    }
                    setDraggingIndex(null);
                    // Reset position (will be recalculated on next render)
                    e.target.position({ x: startX + idx * (boxSize + gap), y: 120 });
                  }}
                >
                  {/* Shadow for dragging */}
                  {isDragging && (
                    <Rect
                      x={-boxSize / 2 + 4}
                      y={-boxSize / 2 + 4}
                      width={boxSize}
                      height={boxSize}
                      fill="#94a3b8"
                      cornerRadius={10}
                      opacity={0.4}
                    />
                  )}
                  <Rect
                    x={-boxSize / 2}
                    y={-boxSize / 2}
                    width={boxSize}
                    height={boxSize}
                    fill={
                      isCorrectPosition ? '#bbf7d0' :
                      isWrongPosition ? '#fecaca' :
                      isDragging ? '#bfdbfe' : '#dbeafe'
                    }
                    stroke={
                      isCorrectPosition ? '#22c55e' :
                      isWrongPosition ? '#ef4444' :
                      isDragging ? '#2563eb' : '#3b82f6'
                    }
                    strokeWidth={isDragging ? 4 : 3}
                    cornerRadius={10}
                    shadowColor={isDragging ? '#000' : undefined}
                    shadowBlur={isDragging ? 10 : 0}
                    shadowOpacity={isDragging ? 0.3 : 0}
                  />
                  <Text
                    text={num.toString()}
                    fontSize={boxSize * 0.5}
                    fontStyle="bold"
                    fill={
                      isCorrectPosition ? '#15803d' :
                      isWrongPosition ? '#dc2626' :
                      '#1e40af'
                    }
                    x={-boxSize / 2}
                    y={-boxSize / 2}
                    width={boxSize}
                    height={boxSize}
                    align="center"
                    verticalAlign="middle"
                  />
                  {/* Grab handle indicator */}
                  {!showFeedback && (
                    <Text
                      text="⋮⋮"
                      fontSize={12}
                      fill="#94a3b8"
                      x={-boxSize / 2}
                      y={boxSize / 2 - 18}
                      width={boxSize}
                      align="center"
                    />
                  )}
                </Group>
              );
            })}

            {/* Position labels */}
            {sequence.map((_, idx) => (
              <Text
                key={`pos-${idx}`}
                text={`${idx + 1}`}
                fontSize={12}
                fill="#9ca3af"
                x={startX + idx * (boxSize + gap) - boxSize / 2}
                y={120 + boxSize / 2 + 8}
                width={boxSize}
                align="center"
              />
            ))}
          </Group>
        );
      }

      case 'before-after': {
        const targetNum = currentChallenge.data.targetNumber || 0;
        const askBefore = currentChallenge.data.askBefore;

        return (
          <Group>
            <Rect
              x={width / 2 - 50}
              y={100}
              width={100}
              height={100}
              fill="#dbeafe"
              stroke="#3b82f6"
              strokeWidth={4}
              cornerRadius={12}
            />
            <Text
              text={targetNum.toString()}
              fontSize={60}
              fontStyle="bold"
              fill="#1e40af"
              x={width / 2 - 50}
              y={115}
              width={100}
              align="center"
            />
            {/* Arrow indicator */}
            <Text
              text={askBefore ? '⬅️ ?' : '? ➡️'}
              fontSize={40}
              x={askBefore ? width / 2 - 150 : width / 2 + 60}
              y={125}
            />
          </Group>
        );
      }

      case 'compare-quantities':
        return currentChallenge.data.compareGroups ? (
          <CompareGroupsVisual
            groupA={currentChallenge.data.compareGroups.groupA}
            groupB={currentChallenge.data.compareGroups.groupB}
          />
        ) : null;

      case 'make-the-number':
        return (
          <Group>
            {/* Target number display */}
            <Rect
              x={width / 2 - 50}
              y={20}
              width={100}
              height={80}
              fill="#fef3c7"
              stroke="#f59e0b"
              strokeWidth={3}
              cornerRadius={10}
            />
            <Text
              text={`Tap ${currentChallenge.data.targetNumber}`
              }
              fontSize={24}
              fontStyle="bold"
              fill="#b45309"
              x={width / 2 - 50}
              y={45}
              width={100}
              align="center"
            />

            {/* Selection counter */}
            <Text
              text={`Selected: ${selectedObjects.length}`}
              fontSize={18}
              fill="#166534"
              x={10}
              y={height - 30}
            />

            {/* Objects to tap */}
            {currentChallenge.data.displayObjects?.map((obj) => (
              <JungleObject
                key={obj.id}
                obj={{ ...obj, isSelected: selectedObjects.includes(obj.id) }}
                isSelected={selectedObjects.includes(obj.id)}
                onClick={() => toggleObjectSelection(obj.id)}
              />
            ))}
          </Group>
        );

      default:
        return null;
    }
  };

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Background */}
        <Rect x={0} y={0} width={width} height={height} fill="#d1fae5" cornerRadius={16} />

        {/* Decorative elements */}
        <Text text="🌿" fontSize={30} x={10} y={10} opacity={0.5} />
        <Text text="🌺" fontSize={25} x={width - 40} y={15} opacity={0.5} />
        <Text text="🦋" fontSize={20} x={width - 35} y={height - 35} opacity={0.5} />
        <Text text="🌴" fontSize={28} x={10} y={height - 40} opacity={0.5} />

        {/* Challenge content */}
        {renderChallengeContent()}
      </Layer>
    </Stage>
  );
};

export default NumberJungleCanvas;
