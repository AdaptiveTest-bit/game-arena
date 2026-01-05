'use client';

import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Line, Group, Circle } from 'react-konva';
import { useTreasureMapStore } from '@/app/store/useTreasureMapStore';

const CANVAS_HEIGHT = 550;
const GRID_SIZE = 10;
const CELL_SIZE = 45;
const GRID_OFFSET_X = 80;
const GRID_OFFSET_Y = 60;

const DistanceCalculatorCanvas: React.FC = () => {
  const {
    distanceChallenge,
    setDistanceAnswer,
    validateDistance,
    isPhaseCorrect
  } = useTreasureMapStore();

  const [inputValue, setInputValue] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  if (!distanceChallenge) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const { pointA, pointB, questionType } = distanceChallenge;

  // Get cell position from grid coordinates
  const getCellPos = (gridX: number, gridY: number) => ({
    x: GRID_OFFSET_X + (gridX - 1) * CELL_SIZE + CELL_SIZE / 2,
    y: GRID_OFFSET_Y + (GRID_SIZE - gridY) * CELL_SIZE + CELL_SIZE / 2
  });

  const posA = getCellPos(pointA.x, pointA.y);
  const posB = getCellPos(pointB.x, pointB.y);

  const handleKeypadClick = (value: string) => {
    if (isPhaseCorrect) return;
    
    if (value === 'clear') {
      setInputValue('');
    } else if (value === 'backspace') {
      setInputValue(prev => prev.slice(0, -1));
    } else {
      setInputValue(prev => prev + value);
    }
    setValidationMessage(null);
  };

  const handleSubmit = () => {
    const numValue = parseInt(inputValue, 10);
    
    if (isNaN(numValue)) {
      setValidationMessage('❌ Please enter a valid number');
      return;
    }

    // Update the store with the answer first
    setDistanceAnswer(inputValue);
    
    // Then validate
    const success = validateDistance();
    
    if (success) {
      setValidationMessage('🎉 Correct! Great distance calculation!');
    } else {
      // Calculate what the correct answer should be
      let correctAnswer = 0;
      if (questionType === 'horizontal') {
        correctAnswer = Math.abs(pointB.x - pointA.x);
      } else if (questionType === 'vertical') {
        correctAnswer = Math.abs(pointB.y - pointA.y);
      } else {
        correctAnswer = Math.abs(pointB.x - pointA.x) + Math.abs(pointB.y - pointA.y);
      }
      setValidationMessage(`❌ Incorrect. The correct answer is ${correctAnswer} units. Try the next one!`);
    }
  };

  const getQuestionText = () => {
    if (questionType === 'horizontal') {
      return 'What is the HORIZONTAL distance between the two points?';
    } else if (questionType === 'vertical') {
      return 'What is the VERTICAL distance between the two points?';
    } else {
      return 'What is the TOTAL distance (horizontal + vertical) between the two points?';
    }
  };

  const getQuestionHint = () => {
    if (questionType === 'horizontal') {
      return 'Count how many steps you would need to move LEFT or RIGHT';
    } else if (questionType === 'vertical') {
      return 'Count how many steps you would need to move UP or DOWN';
    } else {
      return 'Add the horizontal distance and vertical distance together';
    }
  };

  return (
    <div className="w-full">
      {/* Question */}
      <div className="mb-4 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white text-center">
        <p className="text-lg font-bold mb-2">{getQuestionText()}</p>
        <p className="text-sm opacity-90">{getQuestionHint()}</p>
      </div>

      {/* Points Info */}
      <div className="mb-4 flex justify-center gap-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-3 text-center">
          <p className="text-xs uppercase opacity-80">Point A</p>
          <p className="font-bold text-lg">📍 ({pointA.x}, {pointA.y})</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-3 text-center">
          <p className="text-xs uppercase opacity-80">Point B</p>
          <p className="font-bold text-lg">📍 ({pointB.x}, {pointB.y})</p>
        </div>
      </div>

      {/* Canvas and Keypad */}
      <div className="flex gap-4">
        {/* Grid Canvas */}
        <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-lg overflow-hidden border-2 border-amber-300">
          <Stage width={650} height={CANVAS_HEIGHT}>
            <Layer>
              {/* Background */}
              <Rect width={650} height={CANVAS_HEIGHT} fill="#FEF3C7" />

              {/* Grid Lines */}
              {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
                <React.Fragment key={`grid-${i}`}>
                  <Line
                    points={[
                      GRID_OFFSET_X + i * CELL_SIZE,
                      GRID_OFFSET_Y,
                      GRID_OFFSET_X + i * CELL_SIZE,
                      GRID_OFFSET_Y + GRID_SIZE * CELL_SIZE
                    ]}
                    stroke="#D97706"
                    strokeWidth={1}
                    opacity={0.3}
                  />
                  <Line
                    points={[
                      GRID_OFFSET_X,
                      GRID_OFFSET_Y + i * CELL_SIZE,
                      GRID_OFFSET_X + GRID_SIZE * CELL_SIZE,
                      GRID_OFFSET_Y + i * CELL_SIZE
                    ]}
                    stroke="#D97706"
                    strokeWidth={1}
                    opacity={0.3}
                  />
                </React.Fragment>
              ))}

              {/* Axis labels */}
              {Array.from({ length: GRID_SIZE }).map((_, i) => (
                <React.Fragment key={`axis-${i}`}>
                  <Text
                    x={GRID_OFFSET_X + i * CELL_SIZE + CELL_SIZE / 2 - 5}
                    y={GRID_OFFSET_Y + GRID_SIZE * CELL_SIZE + 5}
                    text={String(i + 1)}
                    fontSize={12}
                    fill="#92400E"
                    fontStyle="bold"
                    listening={false}
                  />
                  <Text
                    x={GRID_OFFSET_X - 18}
                    y={GRID_OFFSET_Y + (GRID_SIZE - i - 1) * CELL_SIZE + CELL_SIZE / 2 - 6}
                    text={String(i + 1)}
                    fontSize={12}
                    fill="#92400E"
                    fontStyle="bold"
                    listening={false}
                  />
                </React.Fragment>
              ))}

              {/* Axis Labels */}
              <Text
                x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE / 2 - 10}
                y={GRID_OFFSET_Y + GRID_SIZE * CELL_SIZE + 22}
                text="X"
                fontSize={16}
                fill="#92400E"
                fontStyle="bold"
                listening={false}
              />
              <Text
                x={GRID_OFFSET_X - 40}
                y={GRID_OFFSET_Y + GRID_SIZE * CELL_SIZE / 2 - 8}
                text="Y"
                fontSize={16}
                fill="#92400E"
                fontStyle="bold"
                listening={false}
              />

              {/* Distance Visualization Lines */}
              {questionType === 'horizontal' && (
                <Line
                  points={[posA.x, posA.y, posB.x, posA.y]}
                  stroke="#3B82F6"
                  strokeWidth={4}
                  dash={[8, 4]}
                />
              )}
              {questionType === 'vertical' && (
                <Line
                  points={[posA.x, posA.y, posA.x, posB.y]}
                  stroke="#10B981"
                  strokeWidth={4}
                  dash={[8, 4]}
                />
              )}
              {questionType === 'manhattan' && (
                <>
                  <Line
                    points={[posA.x, posA.y, posB.x, posA.y]}
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dash={[8, 4]}
                  />
                  <Line
                    points={[posB.x, posA.y, posB.x, posB.y]}
                    stroke="#10B981"
                    strokeWidth={3}
                    dash={[8, 4]}
                  />
                </>
              )}

              {/* Point A */}
              <Group>
                <Circle
                  x={posA.x}
                  y={posA.y}
                  radius={18}
                  fill="#3B82F6"
                  stroke="#1D4ED8"
                  strokeWidth={3}
                  shadowColor="#000"
                  shadowBlur={5}
                  shadowOpacity={0.3}
                />
                <Text
                  x={posA.x - 8}
                  y={posA.y - 8}
                  text="A"
                  fontSize={16}
                  fill="white"
                  fontStyle="bold"
                  listening={false}
                />
              </Group>

              {/* Point B */}
              <Group>
                <Circle
                  x={posB.x}
                  y={posB.y}
                  radius={18}
                  fill="#EF4444"
                  stroke="#DC2626"
                  strokeWidth={3}
                  shadowColor="#000"
                  shadowBlur={5}
                  shadowOpacity={0.3}
                />
                <Text
                  x={posB.x - 8}
                  y={posB.y - 8}
                  text="B"
                  fontSize={16}
                  fill="white"
                  fontStyle="bold"
                  listening={false}
                />
              </Group>

              {/* Info Panel */}
              <Rect
                x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 20}
                y={GRID_OFFSET_Y}
                width={80}
                height={120}
                fill="#FFF7ED"
                stroke="#D97706"
                strokeWidth={2}
                cornerRadius={10}
              />
              <Text
                x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 30}
                y={GRID_OFFSET_Y + 10}
                text="📐 Units"
                fontSize={14}
                fill="#92400E"
                fontStyle="bold"
                listening={false}
              />
              <Text
                x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 30}
                y={GRID_OFFSET_Y + 35}
                text="1 cell"
                fontSize={12}
                fill="#374151"
                listening={false}
              />
              <Text
                x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 30}
                y={GRID_OFFSET_Y + 50}
                text="= 1 unit"
                fontSize={12}
                fill="#374151"
                listening={false}
              />
              
              <Rect
                x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 30}
                y={GRID_OFFSET_Y + 75}
                width={20}
                height={20}
                fill="#3B82F6"
                opacity={0.3}
                stroke="#3B82F6"
                strokeWidth={1}
              />
              <Text
                x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 55}
                y={GRID_OFFSET_Y + 78}
                text="H"
                fontSize={12}
                fill="#3B82F6"
                listening={false}
              />
              <Rect
                x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 30}
                y={GRID_OFFSET_Y + 98}
                width={20}
                height={20}
                fill="#10B981"
                opacity={0.3}
                stroke="#10B981"
                strokeWidth={1}
              />
              <Text
                x={GRID_OFFSET_X + GRID_SIZE * CELL_SIZE + 55}
                y={GRID_OFFSET_Y + 101}
                text="V"
                fontSize={12}
                fill="#10B981"
                listening={false}
              />

              {/* Success overlay */}
              {isPhaseCorrect && (
                <Text
                  x={0}
                  y={CANVAS_HEIGHT - 40}
                  width={650}
                  text="🏆 Distance Master!"
                  fontSize={24}
                  fontFamily="Arial"
                  fill="#059669"
                  align="center"
                  fontStyle="bold"
                  listening={false}
                />
              )}
            </Layer>
          </Stage>
        </div>

        {/* Keypad Panel */}
        <div className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl p-4 border-2 border-slate-300">
          <div className="text-center mb-4">
            <p className="text-sm text-slate-600 mb-2">Your Answer:</p>
            <div className="bg-white rounded-lg p-4 border-2 border-slate-300 min-h-[60px] flex items-center justify-center">
              <span className="text-3xl font-bold text-indigo-900">
                {inputValue || '?'}
              </span>
              <span className="text-xl text-slate-500 ml-2">units</span>
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num, idx) => (
              <button
                key={num}
                onClick={() => handleKeypadClick(String(num))}
                disabled={isPhaseCorrect}
                className={`py-4 rounded-lg font-bold text-xl ${
                  isPhaseCorrect
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-lg active:scale-95'
                } ${idx === 9 ? 'col-start-2' : ''}`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => handleKeypadClick('backspace')}
              disabled={isPhaseCorrect}
              className={`py-3 rounded-lg font-bold ${
                isPhaseCorrect
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              ⌫ Delete
            </button>
            <button
              onClick={() => handleKeypadClick('clear')}
              disabled={isPhaseCorrect}
              className={`py-3 rounded-lg font-bold ${
                isPhaseCorrect
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              C Clear
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isPhaseCorrect || !inputValue}
            className={`w-full py-4 rounded-lg font-bold text-xl ${
              !isPhaseCorrect && inputValue
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-md'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            ✓ Submit Answer
          </button>
        </div>
      </div>

      {/* Validation Message */}
      {validationMessage && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            validationMessage.includes('🎉') || validationMessage.includes('🏆')
              ? 'bg-green-50 border border-green-300'
              : 'bg-red-50 border border-red-300'
          }`}
        >
          <p className={validationMessage.includes('🎉') || validationMessage.includes('🏆') ? 'text-green-800' : 'text-red-800'}>
            {validationMessage}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <p className="text-sm text-indigo-800">
          <strong>How to calculate:</strong> 
          {questionType === 'horizontal' && ' Count the difference in X coordinates: |X₂ - X₁|'}
          {questionType === 'vertical' && ' Count the difference in Y coordinates: |Y₂ - Y₁|'}
          {questionType === 'manhattan' && ' Add horizontal and vertical distances: |X₂ - X₁| + |Y₂ - Y₁|'}
        </p>
      </div>
    </div>
  );
};

export default DistanceCalculatorCanvas;
