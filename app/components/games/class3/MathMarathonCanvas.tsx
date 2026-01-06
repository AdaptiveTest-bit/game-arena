'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text, Circle, Group } from 'react-konva';
import { useMathMarathonStore } from '@/app/store/useMathMarathonStore';
import { decimalToMixedFraction } from '@/app/utils/gameUtils';

interface MathMarathonCanvasProps {
  width: number;
  height: number;
  onAnswerSelect?: (answer: number) => void;
  level: number;
}

const MathMarathonCanvas: React.FC<MathMarathonCanvasProps> = ({
  width,
  height,
  onAnswerSelect,
  level,
}) => {
  const {
    questions,
    currentQuestionIndex,
    selectedAnswer,
    answeredQuestions,
  } = useMathMarathonStore();

  const currentQuestion = questions[currentQuestionIndex];

  // Track animation frame for car movement
  const carPositionRef = useRef(50);
  const [carPosition, setCarPosition] = useState(50);

  // Animate car based on progress
  useEffect(() => {
    const progress = (currentQuestionIndex + (selectedAnswer !== null ? 1 : 0)) / questions.length;
    const targetPosition = 50 + progress * (width - 150);
    
    const animate = () => {
      carPositionRef.current += (targetPosition - carPositionRef.current) * 0.1;
      setCarPosition(carPositionRef.current);
      requestAnimationFrame(animate);
    };
    
    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [currentQuestionIndex, selectedAnswer, questions.length, width]);

  // Draw track
  const trackY = height - 100;
  const finishLineX = width - 100;

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Background gradient effect */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 0, y: height }}
          fillLinearGradientColorStops={[
            0,
            level === 1 ? '#87CEEB' : level === 2 ? '#98D8C8' : '#F7DC6F',
            1,
            level === 1 ? '#E0F7FA' : level === 2 ? '#D5F5E3' : '#FCF3CF',
          ]}
        />

        {/* Title */}
        <Text
          x={20}
          y={20}
          text={`Level ${level}: Math Marathon`}
          fontSize={24}
          fontStyle="bold"
          fill="#2C3E50"
        />

        {/* Progress indicator */}
        <Text
          x={20}
          y={50}
          text={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
          fontSize={16}
          fill="#5D6D7E"
        />

        {/* Question display */}
        <Group x={width / 2 - 300} y={100}>
          <Rect
            x={0}
            y={0}
            width={600}
            height={80}
            fill="white"
            cornerRadius={10}
            shadowColor="black"
            shadowBlur={10}
            shadowOpacity={0.1}
          />
          <Text
            x={20}
            y={20}
            text={currentQuestion?.question || ''}
            fontSize={20}
            fontStyle="bold"
            fill="#2C3E50"
            width={560}
          />
        </Group>

        {/* Race Track */}
        <Rect
          x={50}
          y={trackY}
          width={width - 150}
          height={60}
          fill="#555"
          cornerRadius={5}
        />

        {/* Track markings */}
        {Array.from({ length: 10 }).map((_, i) => (
          <Rect
            key={i}
            x={50 + i * ((width - 150) / 10)}
            y={trackY}
            width={4}
            height={60}
            fill="#FFF"
          />
        ))}

        {/* Finish line */}
        <Rect
          x={finishLineX}
          y={trackY - 10}
          width={10}
          height={80}
          fill="#27AE60"
        />
        <Text
          x={finishLineX - 20}
          y={trackY - 35}
          text="FINISH"
          fontSize={14}
          fontStyle="bold"
          fill="#27AE60"
        />

        {/* Racing car */}
        <Group x={carPosition} y={trackY - 15}>
          {/* Car body */}
          <Rect
            x={0}
            y={0}
            width={50}
            height={30}
            fill={level === 1 ? '#3498DB' : level === 2 ? '#9B59B6' : '#E74C3C'}
            cornerRadius={5}
          />
          {/* Car top */}
          <Rect
            x={10}
            y={-15}
            width={30}
            height={20}
            fill={level === 1 ? '#2980B9' : level === 2 ? '#8E44AD' : '#C0392B'}
            cornerRadius={3}
          />
          {/* Wheels */}
          <Circle x={12} y={30} radius={8} fill="#2C3E50" />
          <Circle x={38} y={30} radius={8} fill="#2C3E50" />
          {/* Driver */}
          <Circle x={25} y={-5} radius={8} fill="#F39C12" />
        </Group>

        {/* Answer options */}
        <Group x={width / 2 - 280} y={220}>
          {currentQuestion?.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = currentQuestion.correctAnswer === option;
            const isAnswered = selectedAnswer !== null;
            
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

            const optionX = index % 2 === 0 ? 0 : 300;
            const optionY = Math.floor(index / 2) * 70;

            return (
              <Group
                key={option}
                x={optionX}
                y={optionY}
                onClick={() => onAnswerSelect?.(option)}
                onTouchStart={() => onAnswerSelect?.(option)}
              >
                <Rect
                  width={280}
                  height={60}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? 3 : 2}
                  cornerRadius={10}
                  shadowColor="black"
                  shadowBlur={isSelected ? 10 : 5}
                  shadowOpacity={isSelected ? 0.2 : 0.1}
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

        {/* Streak indicator */}
        <Group x={width - 200} y={20}>
          <Rect
            width={180}
            height={40}
            fill={get().streak > 2 ? '#F39C12' : '#ECF0F1'}
            cornerRadius={20}
          />
          <Text
            x={20}
            y={12}
            text={`🔥 Streak: ${get().streak}`}
            fontSize={16}
            fontStyle="bold"
            fill={get().streak > 2 ? '#FFFFFF' : '#2C3E50'}
          />
        </Group>

        {/* Score display */}
        <Group x={width - 200} y={70}>
          <Rect
            width={180}
            height={40}
            fill="#3498DB"
            cornerRadius={20}
          />
          <Text
            x={20}
            y={12}
            text={`⭐ Score: ${get().score}`}
            fontSize={16}
            fontStyle="bold"
            fill="white"
          />
        </Group>
      </Layer>
    </Stage>
  );
};

// Helper to access store state inside component
const get = () => useMathMarathonStore.getState();

export default MathMarathonCanvas;

