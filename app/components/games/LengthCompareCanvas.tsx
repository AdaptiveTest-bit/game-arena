'use client';

import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Group, Line, Circle } from 'react-konva';
import { useBeachSafariStore } from '@/app/store/useBeachSafariStore';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 450;

const LengthCompareCanvas: React.FC = () => {
  const {
    lengthChallenge,
    lengthAnswered,
    selectLengthAnswer,
    isPhaseCorrect
  } = useBeachSafariStore();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!lengthChallenge) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const { objects, question, correctIndex } = lengthChallenge;

  const handleSelect = (index: number) => {
    if (lengthAnswered) return;
    
    setSelectedIndex(index);
    selectLengthAnswer(index);
  };

  // Calculate object positions
  const objectSpacing = CANVAS_WIDTH / (objects.length + 1);
  const baseY = 250;

  return (
    <div className="w-full">
      {/* Question Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 text-center">
        <p className="text-2xl font-bold">
          Which one is {question.toUpperCase()}? 🤔
        </p>
        <p className="text-sm opacity-90">Tap on the {question} object!</p>
      </div>

      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
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
          
          {/* Decorative shells */}
          <Text x={50} y={380} text="🐚" fontSize={30} listening={false} />
          <Text x={750} y={350} text="⭐" fontSize={25} listening={false} />
          <Text x={820} y={390} text="🦀" fontSize={35} listening={false} />

          {/* Objects */}
          {objects.map((obj, index) => {
            const x = objectSpacing * (index + 1);
            const isHovered = hoveredIndex === index;
            const isSelected = selectedIndex === index;
            const isCorrectAnswer = lengthAnswered && index === correctIndex;
            const isWrongAnswer = lengthAnswered && isSelected && index !== correctIndex;

            // Object visualization based on type
            let objectElement;
            const height = 30;
            
            switch (obj.type) {
              case 'stick':
                objectElement = (
                  <Rect
                    x={-obj.length / 2}
                    y={-height / 2}
                    width={obj.length}
                    height={height}
                    fill={obj.color}
                    stroke="#5D4037"
                    strokeWidth={3}
                    cornerRadius={height / 2}
                  />
                );
                break;
              case 'rope':
                objectElement = (
                  <Line
                    points={[-obj.length / 2, 0, obj.length / 2, 0]}
                    stroke={obj.color}
                    strokeWidth={12}
                    lineCap="round"
                    dash={[15, 8]}
                  />
                );
                break;
              case 'fish':
                objectElement = (
                  <>
                    <Rect
                      x={-obj.length / 2}
                      y={-height / 2}
                      width={obj.length}
                      height={height}
                      fill={obj.color}
                      cornerRadius={[height / 2, 5, 5, height / 2]}
                    />
                    <Circle
                      x={-obj.length / 2 + 20}
                      y={0}
                      radius={5}
                      fill="#333"
                    />
                  </>
                );
                break;
              case 'seaweed':
                objectElement = (
                  <Rect
                    x={-obj.length / 2}
                    y={-height / 2}
                    width={obj.length}
                    height={height}
                    fill={obj.color}
                    cornerRadius={5}
                  />
                );
                break;
            }

            return (
              <Group
                key={obj.id}
                x={x}
                y={baseY}
                onClick={() => handleSelect(index)}
                onTap={() => handleSelect(index)}
                onMouseEnter={() => !lengthAnswered && setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Selection highlight */}
                <Rect
                  x={-obj.length / 2 - 20}
                  y={-50}
                  width={obj.length + 40}
                  height={100}
                  fill={
                    isCorrectAnswer ? '#C8E6C9' :
                    isWrongAnswer ? '#FFCDD2' :
                    isHovered ? '#FFF9C4' : 'transparent'
                  }
                  stroke={
                    isCorrectAnswer ? '#4CAF50' :
                    isWrongAnswer ? '#F44336' :
                    isHovered ? '#FFC107' : 'transparent'
                  }
                  strokeWidth={3}
                  cornerRadius={15}
                />

                {/* The object */}
                {objectElement}

                {/* Label */}
                <Text
                  x={-40}
                  y={40}
                  width={80}
                  text={`Object ${index + 1}`}
                  fontSize={16}
                  fontStyle="bold"
                  fill="#5D4037"
                  align="center"
                  listening={false}
                />

                {/* Length indicator (shown after answer) */}
                {lengthAnswered && (
                  <Text
                    x={-30}
                    y={-70}
                    width={60}
                    text={`${obj.length}px`}
                    fontSize={14}
                    fill="#666"
                    align="center"
                    listening={false}
                  />
                )}

                {/* Result icons */}
                {isCorrectAnswer && (
                  <Text
                    x={obj.length / 2 + 10}
                    y={-15}
                    text="✅"
                    fontSize={30}
                    listening={false}
                  />
                )}
                {isWrongAnswer && (
                  <Text
                    x={obj.length / 2 + 10}
                    y={-15}
                    text="❌"
                    fontSize={30}
                    listening={false}
                  />
                )}
              </Group>
            );
          })}

          {/* Ruler decoration */}
          <Group x={CANVAS_WIDTH / 2} y={380}>
            <Rect x={-100} y={-10} width={200} height={30} fill="#FFEB3B" stroke="#F57F17" strokeWidth={2} cornerRadius={5} />
            {Array.from({ length: 11 }).map((_, i) => (
              <Line
                key={i}
                points={[-90 + i * 18, -5, -90 + i * 18, i % 5 === 0 ? 10 : 5]}
                stroke="#F57F17"
                strokeWidth={2}
              />
            ))}
            <Text x={-100} y={-5} width={200} text="📏" fontSize={20} align="center" listening={false} />
          </Group>

          {/* Result Message */}
          {lengthAnswered && (
            <Group x={CANVAS_WIDTH / 2} y={60}>
              <Rect
                x={-180}
                y={-30}
                width={360}
                height={60}
                fill={isPhaseCorrect ? '#E8F5E9' : '#FFEBEE'}
                stroke={isPhaseCorrect ? '#4CAF50' : '#F44336'}
                strokeWidth={4}
                cornerRadius={30}
                shadowColor="#000"
                shadowBlur={10}
                shadowOpacity={0.3}
              />
              <Text
                x={-180}
                y={-15}
                width={360}
                text={isPhaseCorrect 
                  ? `🎉 Correct! Object ${correctIndex + 1} is ${question}!` 
                  : `Oops! Object ${correctIndex + 1} was ${question}!`}
                fontSize={20}
                fontStyle="bold"
                fill={isPhaseCorrect ? '#2E7D32' : '#C62828'}
                align="center"
                listening={false}
              />
            </Group>
          )}

          {/* Helper text */}
          {!lengthAnswered && (
            <Text
              x={0}
              y={30}
              width={CANVAS_WIDTH}
              text={`👆 Tap on the object you think is ${question}!`}
              fontSize={18}
              fill="#795548"
              align="center"
              listening={false}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default LengthCompareCanvas;
