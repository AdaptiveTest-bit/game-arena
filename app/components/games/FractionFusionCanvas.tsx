'use client';

import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Text, Circle, Group, Line } from 'react-konva';
import { useFractionFusionStore, FractionChallenge } from '@/app/store/useFractionFusionStore';

interface FractionFusionCanvasProps {
  width: number;
  height: number;
  onAnswerSelect?: (answer: string) => void;
  level: number;
}

const FractionFusionCanvas: React.FC<FractionFusionCanvasProps> = ({
  width,
  height,
  onAnswerSelect,
  level,
}) => {
  const {
    challenges,
    currentChallengeIndex,
    selectedAnswer,
    score,
    answeredChallenges,
  } = useFractionFusionStore();

  const currentChallenge = challenges[currentChallengeIndex];

  // Render fraction visualization
  const renderFraction = (fraction: { numerator: number; denominator: number }, x: number, y: number, color: string, label: string) => {
    const unitSize = 40;
    const totalWidth = fraction.denominator * unitSize;
    const totalHeight = fraction.numerator * unitSize + 30;

    return (
      <Group x={x} y={y}>
        {/* Label */}
        <Text
          x={totalWidth / 2 - 30}
          y={-25}
          text={label}
          fontSize={16}
          fontStyle="bold"
          fill={color}
        />

        {/* Fraction bars */}
        {Array.from({ length: fraction.numerator }).map((_, rowIndex) => (
          <Group key={rowIndex} y={rowIndex * (unitSize + 5)}>
            {Array.from({ length: fraction.denominator }).map((_, colIndex) => (
              <Rect
                key={colIndex}
                x={colIndex * unitSize}
                y={0}
                width={unitSize - 2}
                height={unitSize - 2}
                fill={color}
                opacity={0.3 + (fraction.numerator - rowIndex) * 0.1}
                cornerRadius={2}
              />
            ))}
            {/* Fraction bar line */}
            <Rect
              x={-5}
              y={unitSize - 2}
              width={totalWidth + 10}
              height={3}
              fill="#2C3E50"
            />
          </Group>
        ))}

        {/* Numerator and denominator text */}
        <Text
          x={totalWidth / 2 - 10}
          y={totalHeight + 10}
          text={`${fraction.numerator}/${fraction.denominator}`}
          fontSize={24}
          fontStyle="bold"
          fill="#2C3E50"
        />
      </Group>
    );
  };

  // Generate answer options
  const generateAnswerOptions = (challenge: FractionChallenge): string[] => {
    const options: string[] = [];
    const correct = challenge.correctAnswer;
    
    if (challenge.operation === 'comparison') {
      options.push('>');
      options.push('<');
      options.push('=');
      // Add a duplicate to make 4 options
      options.push(correct as string);
    } else if (typeof correct === 'object') {
      // Fraction answer options
      options.push(`${correct.numerator}/${correct.denominator}`);
      
      // Generate wrong options
      const wrongOptions = [
        `${correct.numerator + 1}/${correct.denominator}`,
        `${correct.numerator}/${correct.denominator + 1}`,
        `${correct.numerator + 1}/${correct.denominator + 1}`,
        `${correct.numerator - 1 > 0 ? correct.numerator - 1 : 1}/${correct.denominator}`,
      ];
      
      for (const opt of wrongOptions) {
        if (options.length < 4 && !options.includes(opt)) {
          options.push(opt);
        }
      }
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  // Get chapter color
  const getChapterColor = (): string => {
    if (!currentChallenge) return '#9B59B6';
    return currentChallenge.chapter === 'ch5' ? '#9B59B6' : '#E74C3C';
  };

  // Get operation symbol
  const getOperationSymbol = (op: string): string => {
    switch (op) {
      case 'addition': return '+';
      case 'subtraction': return '-';
      case 'multiplication': return '×';
      case 'comparison': return '?';
      default: return '?';
    }
  };

  if (!currentChallenge) return null;

  const answerOptions = generateAnswerOptions(currentChallenge);
  const progressPercent = ((currentChallengeIndex + 1) / challenges.length) * 100;

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 0, y: height }}
          fillLinearGradientColorStops={[
            0,
            level === 1 ? '#FDF2E9' : level === 2 ? '#FEF5E7' : '#FBEAEB',
            1,
            level === 1 ? '#FAE5D3' : level === 2 ? '#FDEBD0' : '#FADBD8',
          ]}
        />

        {/* Header */}
        <Text
          x={20}
          y={20}
          text={`Level ${level}: Fraction Fusion Reactor`}
          fontSize={24}
          fontStyle="bold"
          fill="#2C3E50"
        />

        {/* Chapter indicator */}
        <Group x={width - 280} y={20}>
          <Rect
            width={260}
            height={36}
            fill={getChapterColor()}
            cornerRadius={18}
          />
          <Text
            x={20}
            y={10}
            text={`⚛️ ${currentChallenge.chapter === 'ch5' ? 'Chapter 5' : 'Chapter 6'}`}
            fontSize={16}
            fontStyle="bold"
            fill="white"
          />
        </Group>

        {/* Progress bar */}
        <Group x={20} y={70}>
          <Rect
            width={300}
            height={16}
            fill="#ECF0F1"
            cornerRadius={8}
          />
          <Rect
            width={300 * (progressPercent / 100)}
            height={16}
            fill={getChapterColor()}
            cornerRadius={8}
          />
          <Text
            x={0}
            y={22}
            text={`Progress: ${currentChallengeIndex + 1}/${challenges.length}`}
            fontSize={12}
            fill="#7F8C8D"
          />
        </Group>

        {/* Score */}
        <Group x={width - 150} y={70}>
          <Rect
            width={130}
            height={50}
            fill="#3498DB"
            cornerRadius={10}
          />
          <Text
            x={20}
            y={15}
            text={`⭐ ${score}`}
            fontSize={20}
            fontStyle="bold"
            fill="white"
          />
        </Group>

        {/* Fraction Visualization Area */}
        <Group x={width / 2 - 200} y={120}>
          {/* Title */}
          <Text
            x={100}
            y={-40}
            text="Fusion Reactor"
            fontSize={18}
            fontStyle="bold"
            fill="#2C3E50"
            align="center"
          />

          {/* First Fraction */}
          {renderFraction(
            currentChallenge.fraction1,
            0,
            0,
            getChapterColor(),
            'Input A'
          )}

          {/* Operation Symbol */}
          <Group x={150} y={30}>
            <Circle
              radius={25}
              fill={getChapterColor()}
              opacity={0.2}
            />
            <Text
              x={-10}
              y={-15}
              text={getOperationSymbol(currentChallenge.operation)}
              fontSize={30}
              fontStyle="bold"
              fill={getChapterColor()}
            />
          </Group>

          {/* Second Fraction */}
          {currentChallenge.fraction2 && renderFraction(
            currentChallenge.fraction2,
            220,
            0,
            getChapterColor(),
            'Input B'
          )}

          {/* Equals sign */}
          <Group x={380} y={50}>
            <Text
              text="="
              fontSize={40}
              fontStyle="bold"
              fill="#2C3E50"
            />
          </Group>
        </Group>

        {/* Question */}
        <Group x={width / 2 - 200} y={280}>
          <Rect
            width={500}
            height={50}
            fill="white"
            cornerRadius={10}
            shadowColor="black"
            shadowBlur={10}
            shadowOpacity={0.1}
          />
          <Text
            x={20}
            y={15}
            text={currentChallenge.question}
            fontSize={18}
            fontStyle="bold"
            fill="#2C3E50"
          />
        </Group>

        {/* Answer Options */}
        <Group x={width / 2 - 250} y={350}>
          <Text
            text="Select Answer:"
            fontSize={16}
            fontStyle="bold"
            fill="#5D6D7E"
          />

          {answerOptions.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isAnswered = selectedAnswer !== null;
            const correct = currentChallenge.correctAnswer;
            let isCorrect = false;
            
            if (currentChallenge.operation === 'comparison') {
              isCorrect = option === correct;
            } else if (typeof correct === 'object') {
              isCorrect = option === `${correct.numerator}/${correct.denominator}`;
            }

            let fillColor = '#FFFFFF';
            let strokeColor = '#BDC3C7';

            if (isAnswered) {
              if (isCorrect) {
                fillColor = '#D5F5E3';
                strokeColor = '#27AE60';
              } else if (isSelected && !isCorrect) {
                fillColor = '#FADBD8';
                strokeColor = '#E74C3C';
              }
            } else if (isSelected) {
              fillColor = '#EBF5FB';
              strokeColor = '#3498DB';
            }

            const optionX = (index % 2) * 260;
            const optionY = Math.floor(index / 2) * 70;

            return (
              <Group
                key={option}
                x={optionX}
                y={optionY + 25}
                onClick={() => !isAnswered && onAnswerSelect?.(option)}
                onTouchStart={() => !isAnswered && onAnswerSelect?.(option)}
              >
                <Rect
                  width={240}
                  height={60}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? 3 : 2}
                  cornerRadius={10}
                  shadowColor="black"
                  shadowBlur={isSelected ? 10 : 5}
                  shadowOpacity={isSelected ? 0.15 : 0.1}
                />
                <Text
                  x={20}
                  y={20}
                  text={`${String.fromCharCode(65 + index)}. ${option}`}
                  fontSize={18}
                  fontStyle={isSelected ? 'bold' : 'normal'}
                  fill={isAnswered && isCorrect ? '#27AE60' : isAnswered && isSelected && !isCorrect ? '#E74C3C' : '#2C3E50'}
                />
              </Group>
            );
          })}
        </Group>

        {/* Difficulty indicator */}
        <Group x={20} y={height - 50}>
          <Rect
            width={150}
            height={30}
            fill={level === 1 ? '#27AE60' : level === 2 ? '#F39C12' : '#E74C3C'}
            cornerRadius={15}
          />
          <Text
            x={15}
            y={8}
            text={`${level === 1 ? 'Easy' : level === 2 ? 'Medium' : 'Hard'}`}
            fontSize={14}
            fontStyle="bold"
            fill="white"
          />
        </Group>
      </Layer>
    </Stage>
  );
};

export default FractionFusionCanvas;

