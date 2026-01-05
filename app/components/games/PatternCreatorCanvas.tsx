'use client';

import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Line } from 'react-konva';
import { usePatternDetectiveStore } from '@/app/store/usePatternDetectiveStore';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 350;
const BOX_SIZE = 70;
const BOX_GAP = 15;

const PatternCreatorCanvas: React.FC = () => {
  const {
    creatorSequence,
    setCreatorParams,
    generateCreatorSequence,
    isPhaseCorrect,
  } = usePatternDetectiveStore();

  const [operation, setOperation] = useState<'+' | '-' | '×'>('+');
  const [operand, setOperand] = useState<string>('3');
  const [startNumber, setStartNumber] = useState<string>('5');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const sequenceLength = 6;
  const startX = (CANVAS_WIDTH - sequenceLength * (BOX_SIZE + BOX_GAP) + BOX_GAP) / 2;
  const boxY = 130;

  const handleGenerate = () => {
    const opValue = parseInt(operand, 10);
    const startValue = parseInt(startNumber, 10);

    // Basic validation before setting params
    if (isNaN(opValue) || opValue < 2 || opValue > 15) {
      setErrorMessage('Step value must be between 2 and 15');
      setHasGenerated(false);
      return;
    }

    if (isNaN(startValue) || startValue < 1) {
      setErrorMessage('Starting number must be at least 1');
      setHasGenerated(false);
      return;
    }

    // Check for negatives with subtraction
    if (operation === '-') {
      const finalValue = startValue - 5 * opValue;
      if (finalValue < 0) {
        setErrorMessage('This subtraction pattern would produce negative numbers. Use a larger start number.');
        setHasGenerated(false);
        return;
      }
    }

    // Check for overflow with multiplication
    if (operation === '×') {
      const finalValue = startValue * Math.pow(opValue, 5);
      if (finalValue > 100000) {
        setErrorMessage('This multiplication pattern would produce numbers too large. Use smaller values.');
        setHasGenerated(false);
        return;
      }
    }

    // Set params then generate
    setCreatorParams(operation, opValue, startValue);
    
    // Use setTimeout to ensure state is set before generating
    setTimeout(() => {
      generateCreatorSequence();
      setHasGenerated(true);
      setErrorMessage(null);
    }, 0);
  };

  const operations: Array<{ symbol: '+' | '-' | '×'; label: string }> = [
    { symbol: '+', label: 'Add (+)' },
    { symbol: '-', label: 'Subtract (-)' },
    { symbol: '×', label: 'Multiply (×)' },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🎨 Pattern Creator</h2>
      <p className="text-gray-600 mb-4">
        Design your own pattern! Choose an operation, a number, and a starting point.
      </p>

      {/* Controls */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {/* Operation Selector */}
        <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
          <label className="block text-sm font-bold text-purple-800 mb-2">Operation</label>
          <div className="flex flex-col gap-2">
            {operations.map((op) => (
              <button
                key={op.symbol}
                onClick={() => {
                  setOperation(op.symbol);
                  setHasGenerated(false);
                }}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  operation === op.symbol
                    ? 'bg-purple-600 text-white ring-4 ring-purple-300 shadow-lg scale-105'
                    : 'bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-100'
                }`}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        {/* Operand Input */}
        <div className="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-300">
          <label className="block text-sm font-bold text-indigo-800 mb-2">Step Value (2-15)</label>
          <input
            type="number"
            min="2"
            max="15"
            value={operand}
            onChange={(e) => {
              setOperand(e.target.value);
              setHasGenerated(false);
            }}
            className="w-full px-4 py-3 text-2xl font-bold text-center text-indigo-900 bg-white border-2 border-indigo-400 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-600"
          />
          <p className="text-xs text-indigo-600 mt-2">
            {operation === '×' ? 'For multiplication, use 2-4' : 'Choose a number between 2-15'}
          </p>
        </div>

        {/* Start Number Input */}
        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
          <label className="block text-sm font-bold text-blue-800 mb-2">Starting Number</label>
          <input
            type="number"
            min="1"
            max="100"
            value={startNumber}
            onChange={(e) => {
              setStartNumber(e.target.value);
              setHasGenerated(false);
            }}
            className="w-full px-4 py-3 text-2xl font-bold text-center text-blue-900 bg-white border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-600"
          />
          <p className="text-xs text-blue-600 mt-2">
            {operation === '-' ? 'Use a number large enough for subtraction' : 'Any positive number'}
          </p>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full mb-4 px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xl font-bold rounded-lg transition-all shadow-lg"
      >
        ✨ Generate My Pattern!
      </button>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-lg">
          <p className="text-red-800">❌ {errorMessage}</p>
        </div>
      )}

      {/* Canvas */}
      <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-300 mb-4">
        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          <Layer>
            {/* Background */}
            <Rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#F5F3FF" />

            {/* Title */}
            <Text
              x={20}
              y={20}
              text="Your Pattern:"
              fontSize={22}
              fontFamily="Arial"
              fill="#4C1D95"
              fontStyle="bold"
            />

            {/* Rule Display */}
            {hasGenerated && (
              <>
                <Rect x={200} y={10} width={500} height={50} fill="#8B5CF6" cornerRadius={10} />
                <Text
                  x={200}
                  y={22}
                  width={500}
                  text={`Rule: ${operation}${operand} | Start: ${startNumber}`}
                  fontSize={24}
                  fontFamily="Arial"
                  fill="#FFF"
                  align="center"
                  fontStyle="bold"
                />
              </>
            )}

            {/* Sequence Boxes */}
            {hasGenerated && creatorSequence.length > 0 ? (
              creatorSequence.map((num, idx) => {
                const x = startX + idx * (BOX_SIZE + BOX_GAP);

                return (
                  <React.Fragment key={idx}>
                    <Rect
                      x={x}
                      y={boxY}
                      width={BOX_SIZE}
                      height={BOX_SIZE}
                      fill="#7C3AED"
                      stroke="#5B21B6"
                      strokeWidth={3}
                      cornerRadius={10}
                      shadowColor="#000"
                      shadowBlur={8}
                      shadowOpacity={0.3}
                    />
                    <Text
                      x={x}
                      y={boxY + BOX_SIZE / 2 - 14}
                      width={BOX_SIZE}
                      text={String(num)}
                      fontSize={28}
                      fontFamily="Arial"
                      fill="#FFF"
                      align="center"
                      fontStyle="bold"
                    />

                    {/* Connector */}
                    {idx < creatorSequence.length - 1 && (
                      <>
                        <Line
                          points={[x + BOX_SIZE, boxY + BOX_SIZE / 2, x + BOX_SIZE + BOX_GAP, boxY + BOX_SIZE / 2]}
                          stroke="#A78BFA"
                          strokeWidth={4}
                        />
                        <Text
                          x={x + BOX_SIZE}
                          y={boxY + BOX_SIZE / 2 - 25}
                          width={BOX_GAP}
                          text={operation}
                          fontSize={16}
                          fontFamily="Arial"
                          fill="#6D28D9"
                          align="center"
                          fontStyle="bold"
                        />
                      </>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <Text
                x={CANVAS_WIDTH / 2 - 150}
                y={boxY + 20}
                width={300}
                text="Click 'Generate' to see your pattern!"
                fontSize={18}
                fontFamily="Arial"
                fill="#9CA3AF"
                align="center"
                fontStyle="italic"
              />
            )}

            {/* Calculation Display */}
            {hasGenerated && creatorSequence.length > 0 && (
              <Text
                x={startX}
                y={boxY + BOX_SIZE + 30}
                text={`${creatorSequence.slice(0, -1).join(` ${operation}${operand} → `)} ${operation}${operand} → ${creatorSequence[creatorSequence.length - 1]}`}
                fontSize={14}
                fontFamily="Arial"
                fill="#6B7280"
              />
            )}

            {/* Decorative elements */}
            <Rect x={20} y={270} width={860} height={60} fill="#EDE9FE" cornerRadius={10} />
            <Text
              x={30}
              y={285}
              text="🎯 Pattern Summary:"
              fontSize={16}
              fontFamily="Arial"
              fill="#4C1D95"
              fontStyle="bold"
            />
            <Text
              x={30}
              y={305}
              text={
                hasGenerated && creatorSequence.length > 0
                  ? `Start at ${startNumber}, then ${operation === '+' ? 'add' : operation === '-' ? 'subtract' : 'multiply by'} ${operand} each time to get the next number!`
                  : 'Create your pattern above to see the summary here.'
              }
              fontSize={14}
              fontFamily="Arial"
              fill="#6B7280"
            />
          </Layer>
        </Stage>
      </div>

      {/* Success Message */}
      {isPhaseCorrect && (
        <div className="mb-4 p-4 bg-green-50 border border-green-300 rounded-lg">
          <p className="text-green-800 text-lg">
            🎉 <strong>Amazing!</strong> You created a valid pattern! You&apos;re now a Pattern Master!
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
        <p className="text-sm text-purple-800">
          <strong>How to create patterns:</strong>
        </p>
        <ul className="text-sm text-purple-700 list-disc list-inside mt-2">
          <li><strong>Addition (+):</strong> Each number increases by your step value</li>
          <li><strong>Subtraction (-):</strong> Each number decreases by your step value</li>
          <li><strong>Multiplication (×):</strong> Each number is multiplied by your step value</li>
        </ul>
      </div>
    </div>
  );
};

export default PatternCreatorCanvas;
