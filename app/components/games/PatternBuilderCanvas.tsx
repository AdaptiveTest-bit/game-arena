'use client';

import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Line, Group } from 'react-konva';
import { usePatternDetectiveStore } from '@/app/store/usePatternDetectiveStore';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 350;
const BOX_SIZE = 80;
const BOX_GAP = 20;

const PatternBuilderCanvas: React.FC = () => {
  const {
    builderRule,
    builderStartNumber,
    builderSequence,
    builderTargetLength,
    addToBuilderSequence,
    clearBuilderSequence,
    isPhaseCorrect,
  } = usePatternDetectiveStore();

  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startX = (CANVAS_WIDTH - builderTargetLength * (BOX_SIZE + BOX_GAP) + BOX_GAP) / 2;
  const boxY = 100;

  const handleNumberClick = (digit: string) => {
    if (inputValue.length < 5) {
      setInputValue(inputValue + digit);
      setErrorMessage(null);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setErrorMessage(null);
  };

  const handleEnter = () => {
    if (!inputValue) return;

    const value = parseInt(inputValue, 10);
    const success = addToBuilderSequence(value);

    if (success) {
      setInputValue('');
      setErrorMessage(null);
    } else {
      setErrorMessage(`❌ ${value} is not correct. Try again!`);
      setInputValue('');
    }
  };

  const handleReset = () => {
    clearBuilderSequence();
    setInputValue('');
    setErrorMessage(null);
  };

  const getExpectedNext = (): string => {
    if (builderSequence.length === 0) {
      return `Start with ${builderStartNumber}`;
    }
    const prev = builderSequence[builderSequence.length - 1];
    switch (builderRule.operation) {
      case '+':
        return `${prev} ${builderRule.operation} ${builderRule.operand} = ?`;
      case '-':
        return `${prev} ${builderRule.operation} ${builderRule.operand} = ?`;
      case '×':
        return `${prev} ${builderRule.operation} ${builderRule.operand} = ?`;
      default:
        return `${prev} ${builderRule.operation} ${builderRule.operand} = ?`;
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🔧 Pattern Builder</h2>
      <p className="text-gray-600 mb-4">
        Build the sequence using the rule card. Enter each number one by one.
      </p>

      {/* Rule Card */}
      <div className="mb-4 flex justify-center">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg">
          <p className="text-sm uppercase tracking-wide opacity-80">Pattern Rule</p>
          <p className="text-4xl font-bold">
            {builderRule.operation}
            {builderRule.operand}
          </p>
          <p className="text-sm mt-2">Starting Number: {builderStartNumber}</p>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-300 mb-4">
        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          <Layer>
            {/* Background */}
            <Rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#F0F4F8" />

            {/* Label */}
            <Text x={startX} y={60} text="Your Sequence:" fontSize={18} fontFamily="Arial" fill="#374151" fontStyle="bold" />

            {/* Sequence Boxes */}
            {Array.from({ length: builderTargetLength }).map((_, idx) => {
              const x = startX + idx * (BOX_SIZE + BOX_GAP);
              const hasValue = idx < builderSequence.length;
              const value = builderSequence[idx];
              const isNext = idx === builderSequence.length;

              return (
                <React.Fragment key={idx}>
                  <Rect
                    x={x}
                    y={boxY}
                    width={BOX_SIZE}
                    height={BOX_SIZE}
                    fill={hasValue ? '#10B981' : isNext ? '#FCD34D' : '#E5E7EB'}
                    stroke={hasValue ? '#059669' : isNext ? '#F59E0B' : '#9CA3AF'}
                    strokeWidth={3}
                    cornerRadius={8}
                    shadowColor="#000"
                    shadowBlur={5}
                    shadowOpacity={0.2}
                  />
                  <Text
                    x={x}
                    y={boxY + BOX_SIZE / 2 - 12}
                    width={BOX_SIZE}
                    text={hasValue ? String(value) : isNext ? '?' : ''}
                    fontSize={24}
                    fontFamily="Arial"
                    fill={hasValue ? '#FFF' : '#9CA3AF'}
                    align="center"
                    fontStyle="bold"
                  />

                  {/* Connector */}
                  {idx < builderTargetLength - 1 && (
                    <Line
                      points={[x + BOX_SIZE, boxY + BOX_SIZE / 2, x + BOX_SIZE + BOX_GAP, boxY + BOX_SIZE / 2]}
                      stroke="#9CA3AF"
                      strokeWidth={3}
                    />
                  )}
                </React.Fragment>
              );
            })}

            {/* Current calculation hint */}
            {!isPhaseCorrect && (
              <Text
                x={startX}
                y={boxY + BOX_SIZE + 30}
                text={getExpectedNext()}
                fontSize={16}
                fontFamily="Arial"
                fill="#6B7280"
                fontStyle="italic"
              />
            )}

            {/* Keypad */}
            <Text x={300} y={240} text="Enter your answer:" fontSize={16} fontFamily="Arial" fill="#374151" fontStyle="bold" />

            {/* Input display */}
            <Rect x={300} y={265} width={150} height={50} fill="#FFF" stroke="#9CA3AF" strokeWidth={2} cornerRadius={8} />
            <Text
              x={300}
              y={280}
              width={150}
              text={inputValue || '_'}
              fontSize={28}
              fontFamily="Arial"
              fill="#1F2937"
              align="center"
              fontStyle="bold"
            />

            {/* Number buttons */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num, idx) => {
              const btnX = 470 + (idx % 5) * 55;
              const btnY = 240 + Math.floor(idx / 5) * 45;

              return (
                <Group
                  key={`btn-${num}`}
                  x={btnX}
                  y={btnY}
                  onClick={() => handleNumberClick(String(num))}
                  onTap={() => handleNumberClick(String(num))}
                >
                  <Rect
                    width={50}
                    height={40}
                    fill="#8B5CF6"
                    stroke="#7C3AED"
                    strokeWidth={2}
                    cornerRadius={8}
                  />
                  <Text
                    x={0}
                    y={10}
                    width={50}
                    text={String(num)}
                    fontSize={18}
                    fontFamily="Arial"
                    fill="#FFF"
                    align="center"
                    fontStyle="bold"
                    listening={false}
                  />
                </Group>
              );
            })}
          </Layer>
        </Stage>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-lg">
          <p className="text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Success Message */}
      {isPhaseCorrect && (
        <div className="mb-4 p-4 bg-green-50 border border-green-300 rounded-lg">
          <p className="text-green-800">🎉 Perfect! You built the complete sequence!</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={handleClear}
          className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-lg transition-all"
        >
          Clear
        </button>

        <button
          onClick={handleEnter}
          disabled={!inputValue || isPhaseCorrect}
          className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
            inputValue && !isPhaseCorrect
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Enter ↵
        </button>

        <button
          onClick={handleReset}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all"
        >
          Reset
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>How to play:</strong> Look at the rule card and starting number. Use the keypad to enter each
          number in the sequence. The pattern follows the rule: previous number {builderRule.operation}{' '}
          {builderRule.operand} = next number.
        </p>
      </div>
    </div>
  );
};

export default PatternBuilderCanvas;
