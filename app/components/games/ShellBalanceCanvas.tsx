'use client';

import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Group, Line, Circle } from 'react-konva';
import { useBeachSafariStore } from '@/app/store/useBeachSafariStore';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 480;

const ShellBalanceCanvas: React.FC = () => {
  const {
    balanceChallenge,
    balanceAnswered,
    selectBalanceAnswer,
    isPhaseCorrect
  } = useBeachSafariStore();

  const [selectedAnswer, setSelectedAnswer] = useState<'left' | 'right' | 'equal' | null>(null);

  if (!balanceChallenge) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const { leftCount, rightCount, question, itemIcon, tiltAngle } = balanceChallenge;

  const handleSelect = (answer: 'left' | 'right' | 'equal') => {
    if (balanceAnswered) return;
    
    setSelectedAnswer(answer);
    selectBalanceAnswer(answer);
  };

  // Generate item positions on plates
  const generateItemPositions = (count: number, plateX: number, plateY: number) => {
    const positions = [];
    
    for (let i = 0; i < count; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      positions.push({
        x: plateX - 50 + col * 25,
        y: plateY - 30 + row * 30
      });
    }
    return positions;
  };

  // Balance positions
  const pivotX = CANVAS_WIDTH / 2;
  const pivotY = 320;
  const beamLength = 350;
  const leftPlateX = pivotX - beamLength / 2;
  const rightPlateX = pivotX + beamLength / 2;

  // Calculate tilted positions
  const angleRad = (tiltAngle * Math.PI) / 180;
  const leftPlateY = pivotY - Math.sin(angleRad) * (beamLength / 2);
  const rightPlateY = pivotY + Math.sin(angleRad) * (beamLength / 2);

  const leftPositions = generateItemPositions(leftCount, leftPlateX, leftPlateY - 50);
  const rightPositions = generateItemPositions(rightCount, rightPlateX, rightPlateY - 50);

  const getQuestionText = () => {
    switch (question) {
      case 'more': return 'Which side has MORE?';
      case 'less': return 'Which side has LESS?';
      case 'equal': return 'Are they EQUAL?';
    }
  };

  const getCorrectAnswer = () => {
    if (question === 'equal') return 'equal';
    if (question === 'more') return leftCount > rightCount ? 'left' : 'right';
    return leftCount < rightCount ? 'left' : 'right';
  };

  return (
    <div className="w-full">
      {/* Question Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 text-center">
        <p className="text-2xl font-bold">{getQuestionText()} 🤔</p>
        <p className="text-sm opacity-90">Look at the balance and choose your answer!</p>
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

          {/* Balance Stand */}
          <Group x={pivotX} y={pivotY}>
            {/* Base */}
            <Rect
              x={-60}
              y={80}
              width={120}
              height={30}
              fill="#795548"
              stroke="#5D4037"
              strokeWidth={3}
              cornerRadius={5}
            />
            {/* Pole */}
            <Rect
              x={-15}
              y={-10}
              width={30}
              height={100}
              fill="#8D6E63"
              stroke="#5D4037"
              strokeWidth={2}
            />
            {/* Pivot point */}
            <Circle
              x={0}
              y={0}
              radius={15}
              fill="#FFD54F"
              stroke="#F57F17"
              strokeWidth={3}
            />
          </Group>

          {/* Balance Beam (tilted) */}
          <Group x={pivotX} y={pivotY} rotation={tiltAngle}>
            {/* Main beam */}
            <Rect
              x={-beamLength / 2 - 10}
              y={-10}
              width={beamLength + 20}
              height={20}
              fill="#A1887F"
              stroke="#6D4C41"
              strokeWidth={3}
              cornerRadius={5}
            />
            
            {/* Left chain */}
            <Line
              points={[-beamLength / 2, 10, -beamLength / 2, 60]}
              stroke="#9E9E9E"
              strokeWidth={4}
              dash={[8, 4]}
            />
            
            {/* Right chain */}
            <Line
              points={[beamLength / 2, 10, beamLength / 2, 60]}
              stroke="#9E9E9E"
              strokeWidth={4}
              dash={[8, 4]}
            />
          </Group>

          {/* Left Plate */}
          <Group x={leftPlateX} y={leftPlateY + 60 - tiltAngle}>
            <Rect
              x={-70}
              y={-20}
              width={140}
              height={80}
              fill="#BBDEFB"
              stroke="#1976D2"
              strokeWidth={3}
              cornerRadius={10}
            />
            <Text
              x={-70}
              y={45}
              width={140}
              text="LEFT"
              fontSize={14}
              fontStyle="bold"
              fill="#1565C0"
              align="center"
              listening={false}
            />
          </Group>

          {/* Right Plate */}
          <Group x={rightPlateX} y={rightPlateY + 60 + tiltAngle}>
            <Rect
              x={-70}
              y={-20}
              width={140}
              height={80}
              fill="#FFCCBC"
              stroke="#E64A19"
              strokeWidth={3}
              cornerRadius={10}
            />
            <Text
              x={-70}
              y={45}
              width={140}
              text="RIGHT"
              fontSize={14}
              fontStyle="bold"
              fill="#BF360C"
              align="center"
              listening={false}
            />
          </Group>

          {/* Items on left plate */}
          {leftPositions.map((pos, idx) => (
            <Text
              key={`left-${idx}`}
              x={pos.x + (tiltAngle * 0.5)}
              y={pos.y + 60 - tiltAngle}
              text={itemIcon}
              fontSize={22}
              listening={false}
            />
          ))}

          {/* Items on right plate */}
          {rightPositions.map((pos, idx) => (
            <Text
              key={`right-${idx}`}
              x={pos.x - (tiltAngle * 0.5)}
              y={pos.y + 60 + tiltAngle}
              text={itemIcon}
              fontSize={22}
              listening={false}
            />
          ))}

          {/* Count labels (shown after answer) */}
          {balanceAnswered && (
            <>
              <Group x={leftPlateX} y={leftPlateY - 30}>
                <Circle x={0} y={0} radius={25} fill="white" stroke="#1976D2" strokeWidth={3} />
                <Text x={-10} y={-12} text={String(leftCount)} fontSize={24} fontStyle="bold" fill="#1976D2" listening={false} />
              </Group>
              <Group x={rightPlateX} y={rightPlateY - 30}>
                <Circle x={0} y={0} radius={25} fill="white" stroke="#E64A19" strokeWidth={3} />
                <Text x={-10} y={-12} text={String(rightCount)} fontSize={24} fontStyle="bold" fill="#E64A19" listening={false} />
              </Group>
            </>
          )}

          {/* Answer Buttons */}
          <Group y={CANVAS_HEIGHT - 80}>
            {/* Left Button */}
            <Group
              x={200}
              onClick={() => handleSelect('left')}
              onTap={() => handleSelect('left')}
            >
              <Rect
                x={-80}
                y={-25}
                width={160}
                height={50}
                fill={
                  balanceAnswered && getCorrectAnswer() === 'left' ? '#C8E6C9' :
                  balanceAnswered && selectedAnswer === 'left' ? '#FFCDD2' :
                  selectedAnswer === 'left' ? '#BBDEFB' : '#E3F2FD'
                }
                stroke={
                  balanceAnswered && getCorrectAnswer() === 'left' ? '#4CAF50' :
                  balanceAnswered && selectedAnswer === 'left' ? '#F44336' :
                  '#1976D2'
                }
                strokeWidth={3}
                cornerRadius={25}
                shadowColor="#000"
                shadowBlur={5}
                shadowOpacity={0.2}
              />
              <Text
                x={-80}
                y={-10}
                width={160}
                text="⬅️ LEFT"
                fontSize={20}
                fontStyle="bold"
                fill="#1565C0"
                align="center"
                listening={false}
              />
            </Group>

            {/* Equal Button */}
            <Group
              x={CANVAS_WIDTH / 2}
              onClick={() => handleSelect('equal')}
              onTap={() => handleSelect('equal')}
            >
              <Rect
                x={-80}
                y={-25}
                width={160}
                height={50}
                fill={
                  balanceAnswered && getCorrectAnswer() === 'equal' ? '#C8E6C9' :
                  balanceAnswered && selectedAnswer === 'equal' ? '#FFCDD2' :
                  selectedAnswer === 'equal' ? '#E1BEE7' : '#F3E5F5'
                }
                stroke={
                  balanceAnswered && getCorrectAnswer() === 'equal' ? '#4CAF50' :
                  balanceAnswered && selectedAnswer === 'equal' ? '#F44336' :
                  '#7B1FA2'
                }
                strokeWidth={3}
                cornerRadius={25}
                shadowColor="#000"
                shadowBlur={5}
                shadowOpacity={0.2}
              />
              <Text
                x={-80}
                y={-10}
                width={160}
                text="⚖️ EQUAL"
                fontSize={20}
                fontStyle="bold"
                fill="#6A1B9A"
                align="center"
                listening={false}
              />
            </Group>

            {/* Right Button */}
            <Group
              x={700}
              onClick={() => handleSelect('right')}
              onTap={() => handleSelect('right')}
            >
              <Rect
                x={-80}
                y={-25}
                width={160}
                height={50}
                fill={
                  balanceAnswered && getCorrectAnswer() === 'right' ? '#C8E6C9' :
                  balanceAnswered && selectedAnswer === 'right' ? '#FFCDD2' :
                  selectedAnswer === 'right' ? '#FFCCBC' : '#FBE9E7'
                }
                stroke={
                  balanceAnswered && getCorrectAnswer() === 'right' ? '#4CAF50' :
                  balanceAnswered && selectedAnswer === 'right' ? '#F44336' :
                  '#E64A19'
                }
                strokeWidth={3}
                cornerRadius={25}
                shadowColor="#000"
                shadowBlur={5}
                shadowOpacity={0.2}
              />
              <Text
                x={-80}
                y={-10}
                width={160}
                text="RIGHT ➡️"
                fontSize={20}
                fontStyle="bold"
                fill="#BF360C"
                align="center"
                listening={false}
              />
            </Group>
          </Group>

          {/* Result Message */}
          {balanceAnswered && (
            <Group x={CANVAS_WIDTH / 2} y={50}>
              <Rect
                x={-220}
                y={-25}
                width={440}
                height={50}
                fill={isPhaseCorrect ? '#E8F5E9' : '#FFEBEE'}
                stroke={isPhaseCorrect ? '#4CAF50' : '#F44336'}
                strokeWidth={4}
                cornerRadius={25}
                shadowColor="#000"
                shadowBlur={10}
                shadowOpacity={0.3}
              />
              <Text
                x={-220}
                y={-10}
                width={440}
                text={isPhaseCorrect 
                  ? `🎉 Correct! ${leftCount} vs ${rightCount} - You got it!` 
                  : `Oops! Left has ${leftCount}, Right has ${rightCount}!`}
                fontSize={18}
                fontStyle="bold"
                fill={isPhaseCorrect ? '#2E7D32' : '#C62828'}
                align="center"
                listening={false}
              />
            </Group>
          )}

          {/* Coco helper */}
          <Group x={50} y={120}>
            <Text x={0} y={0} text="🦀" fontSize={45} listening={false} />
            <Rect x={50} y={-20} width={100} height={50} fill="white" stroke="#FFB74D" strokeWidth={2} cornerRadius={10} />
            <Text
              x={55}
              y={-10}
              width={90}
              text={balanceAnswered ? (isPhaseCorrect ? "Yay!" : "Try again!") : "Count carefully!"}
              fontSize={12}
              fill="#795548"
              wrap="word"
              listening={false}
            />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default ShellBalanceCanvas;
