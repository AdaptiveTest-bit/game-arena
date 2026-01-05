'use client';

import React, { useState, useMemo } from 'react';
import { Stage, Layer, Rect, Text, Group, Circle, Line } from 'react-konva';
import { useWeightWarehouseStore } from '../../store/useWeightWarehouseStore';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;

export default function NumberBreakerCanvas() {
  const { breakerChallenge, submitFragment, resetFragments } = useWeightWarehouseStore();
  const [inputValue, setInputValue] = useState('');

  const { currentSum, remaining, isComplete } = useMemo(() => {
    if (!breakerChallenge) return { currentSum: 0, remaining: 0, isComplete: false };
    
    const sum = breakerChallenge.fragments.reduce((a, b) => a + b, 0);
    return {
      currentSum: sum,
      remaining: breakerChallenge.targetNumber - sum,
      isComplete: sum === breakerChallenge.targetNumber && breakerChallenge.fragments.length >= 2
    };
  }, [breakerChallenge]);

  if (!breakerChallenge) {
    return (
      <div className="flex items-center justify-center h-[450px]">
        <p className="text-gray-500">Loading challenge...</p>
      </div>
    );
  }

  const { targetNumber, breakType, fragments } = breakerChallenge;

  const handleNumberClick = (digit: string) => {
    if (inputValue.length < 5) {
      setInputValue(prev => prev + digit);
    }
  };

  const handleClear = () => {
    setInputValue('');
  };

  const handleSubmit = () => {
    const value = parseInt(inputValue, 10);
    if (!isNaN(value) && value > 0 && value <= remaining) {
      submitFragment(value);
      setInputValue('');
    }
  };

  const handleReset = () => {
    resetFragments();
    setInputValue('');
  };

  const getBreakTypeDescription = () => {
    switch (breakType) {
      case 'place-value':
        return 'Break into place values (hundreds, tens, ones)';
      case 'two-parts':
        return 'Break into exactly 2 parts';
      case 'multi-parts':
        return 'Break into multiple parts';
      default:
        return 'Break the number';
    }
  };

  return (
    <div className="relative">
      {/* Target Number Display */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 rounded-xl px-4 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-600">Break this number:</p>
        <p className="text-3xl font-bold text-purple-600">{targetNumber}</p>
        <p className="text-xs text-gray-500">{getBreakTypeDescription()}</p>
      </div>

      {/* Progress Display */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 rounded-xl px-4 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-600">Your fragments:</p>
        <p className={`text-xl font-bold ${isComplete ? 'text-green-600' : 'text-orange-600'}`}>
          {fragments.join(' + ') || '?'} = {currentSum}
        </p>
        <p className="text-sm text-gray-500">{remaining > 0 ? `${remaining} remaining` : '✅ Complete!'}</p>
      </div>

      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          {/* Background */}
          <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#F5F0FF" />

          {/* Boulder/Number display */}
          <Group x={CANVAS_WIDTH / 2} y={100}>
            {/* Boulder shape */}
            <Circle
              x={0}
              y={0}
              radius={70}
              fill="#7F8C8D"
              stroke="#5D6D7E"
              strokeWidth={4}
              shadowBlur={10}
              shadowColor="rgba(0,0,0,0.3)"
            />
            {/* Cracks */}
            <Line points={[-30, -20, 0, 10, 20, -15]} stroke="#566573" strokeWidth={2} />
            <Line points={[-20, 30, 5, 5, 25, 25]} stroke="#566573" strokeWidth={2} />
            
            {/* Number on boulder */}
            <Text
              x={-50}
              y={-20}
              width={100}
              text={String(targetNumber)}
              fontSize={36}
              fill="#FFF"
              fontStyle="bold"
              align="center"
            />
          </Group>

          {/* Hammer icon */}
          <Group x={CANVAS_WIDTH / 2 + 100} y={80}>
            <Text text="🔨" fontSize={40} />
          </Group>

          {/* Fragments display area */}
          <Rect
            x={40}
            y={180}
            width={CANVAS_WIDTH - 80}
            height={80}
            fill="#E8DAEF"
            stroke="#9B59B6"
            strokeWidth={2}
            cornerRadius={10}
            dash={[8, 4]}
          />
          
          <Text
            x={40}
            y={165}
            text="📦 Fragment Collection"
            fontSize={12}
            fill="#9B59B6"
            fontStyle="bold"
          />

          {/* Fragment boxes */}
          {fragments.map((frag, index) => (
            <Group key={index} x={70 + index * 90} y={205}>
              <Rect
                width={70}
                height={45}
                fill="#9B59B6"
                stroke="#7D3C98"
                strokeWidth={2}
                cornerRadius={8}
                shadowBlur={5}
                shadowColor="rgba(0,0,0,0.2)"
              />
              <Text
                x={0}
                y={12}
                width={70}
                text={String(frag)}
                fontSize={20}
                fill="#FFF"
                fontStyle="bold"
                align="center"
              />
            </Group>
          ))}

          {/* Plus signs between fragments */}
          {fragments.length > 0 && fragments.map((_, index) => {
            if (index < fragments.length - 1) {
              return (
                <Text
                  key={`plus-${index}`}
                  x={130 + index * 90}
                  y={215}
                  text="+"
                  fontSize={24}
                  fill="#9B59B6"
                  fontStyle="bold"
                />
              );
            }
            return null;
          })}

          {/* Current sum display */}
          {fragments.length > 0 && (
            <Group x={CANVAS_WIDTH - 130} y={205}>
              <Text text="=" fontSize={24} fill="#9B59B6" fontStyle="bold" />
              <Text
                x={30}
                y={-3}
                text={String(currentSum)}
                fontSize={28}
                fill={isComplete ? '#27AE60' : '#E67E22'}
                fontStyle="bold"
              />
            </Group>
          )}

          {/* Input display */}
          <Rect
            x={180}
            y={275}
            width={240}
            height={45}
            fill="#FFF"
            stroke="#9B59B6"
            strokeWidth={3}
            cornerRadius={10}
          />
          <Text
            x={180}
            y={285}
            width={240}
            text={inputValue || 'Enter a number...'}
            fontSize={22}
            fill={inputValue ? '#333' : '#AAA'}
            align="center"
          />

          {/* Keypad */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit, index) => {
            const row = Math.floor(index / 5);
            const col = index % 5;
            
            return (
              <Group
                key={digit}
                x={130 + col * 70}
                y={335 + row * 55}
                onClick={() => handleNumberClick(String(digit))}
                onTap={() => handleNumberClick(String(digit))}
              >
                <Rect
                  width={55}
                  height={45}
                  fill="#9B59B6"
                  stroke="#7D3C98"
                  strokeWidth={2}
                  cornerRadius={8}
                  shadowBlur={3}
                  shadowColor="rgba(0,0,0,0.2)"
                />
                <Text
                  x={0}
                  y={10}
                  width={55}
                  text={String(digit)}
                  fontSize={22}
                  fill="#FFF"
                  fontStyle="bold"
                  align="center"
                />
              </Group>
            );
          })}

          {/* Action buttons */}
          {/* Clear button */}
          <Group x={30} y={335} onClick={handleClear} onTap={handleClear}>
            <Rect
              width={80}
              height={45}
              fill="#E74C3C"
              stroke="#C0392B"
              strokeWidth={2}
              cornerRadius={8}
            />
            <Text
              x={0}
              y={12}
              width={80}
              text="Clear"
              fontSize={14}
              fill="#FFF"
              fontStyle="bold"
              align="center"
            />
          </Group>

          {/* Add button */}
          <Group 
            x={490} 
            y={335} 
            onClick={handleSubmit} 
            onTap={handleSubmit}
            opacity={inputValue && parseInt(inputValue) <= remaining ? 1 : 0.5}
          >
            <Rect
              width={80}
              height={45}
              fill="#27AE60"
              stroke="#1E8449"
              strokeWidth={2}
              cornerRadius={8}
            />
            <Text
              x={0}
              y={12}
              width={80}
              text="Add +"
              fontSize={14}
              fill="#FFF"
              fontStyle="bold"
              align="center"
            />
          </Group>

          {/* Reset fragments button */}
          <Group x={30} y={390} onClick={handleReset} onTap={handleReset}>
            <Rect
              width={80}
              height={40}
              fill="#95A5A6"
              stroke="#7F8C8D"
              strokeWidth={2}
              cornerRadius={8}
            />
            <Text
              x={0}
              y={10}
              width={80}
              text="Reset"
              fontSize={12}
              fill="#FFF"
              fontStyle="bold"
              align="center"
            />
          </Group>

          {/* Success indicator */}
          {isComplete && (
            <Group x={CANVAS_WIDTH / 2 - 80} y={130}>
              <Rect
                width={160}
                height={40}
                fill="#27AE60"
                cornerRadius={20}
              />
              <Text
                x={0}
                y={10}
                width={160}
                text="✅ Perfect Break!"
                fontSize={16}
                fill="#FFF"
                fontStyle="bold"
                align="center"
              />
            </Group>
          )}
        </Layer>
      </Stage>
    </div>
  );
}
