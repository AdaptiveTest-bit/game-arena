'use client';

import React, { useState, useMemo } from 'react';
import { Stage, Layer, Rect, Text, Line, Group } from 'react-konva';
import { usePatternDetectiveStore } from '@/app/store/usePatternDetectiveStore';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 450;
const BOX_SIZE = 80;
const BOX_GAP = 20;
const TRAIN_Y = 120;

const PatternDiscoveryCanvas: React.FC = () => {
  const {
    sequence,
    hiddenIndices,
    playerAnswers,
    setPlayerAnswer,
    removePlayerAnswer,
    validateDiscovery,
    useHint: getHint,
    currentHint,
    attemptsRemaining,
    hintsUsed,
  } = usePatternDetectiveStore();

  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const totalBoxes = sequence.length;
  const startX = (CANVAS_WIDTH - totalBoxes * (BOX_SIZE + BOX_GAP) + BOX_GAP) / 2;

  // Generate number bin tokens (correct answers + distractors) - memoized to prevent reshuffling
  const allTokens = useMemo(() => {
    const correctAnswers = hiddenIndices.map((i) => sequence[i]).filter((v) => v !== undefined);
    const distractors: number[] = [];

    // Generate distractors only if we have correct answers
    if (correctAnswers.length > 0) {
      let attempts = 0;
      while (distractors.length < 6 && attempts < 100) {
        attempts++;
        const distractor = correctAnswers[0] + Math.floor(Math.random() * 20) - 10;
        if (!correctAnswers.includes(distractor) && !distractors.includes(distractor) && distractor > 0) {
          distractors.push(distractor);
        }
      }
    }

    return [...correctAnswers, ...distractors].sort(() => Math.random() - 0.5);
  }, [sequence, hiddenIndices]);

  // Check which tokens are already placed
  const placedValues = Object.values(playerAnswers).filter((v) => v !== null) as number[];

  const handleTokenClick = (value: number) => {
    if (placedValues.includes(value)) return;
    setSelectedToken(value);
  };

  const handleBoxClick = (index: number) => {
    if (!hiddenIndices.includes(index)) return;

    if (selectedToken !== null) {
      // Place token
      setPlayerAnswer(index, selectedToken);
      setSelectedToken(null);
    } else if (playerAnswers[index] !== null && playerAnswers[index] !== undefined) {
      // Remove placed token
      removePlayerAnswer(index);
    }
  };

  const handleValidate = () => {
    const isCorrect = validateDiscovery();
    if (isCorrect) {
      setValidationMessage('✅ Perfect! You found all the missing numbers!');
    } else {
      setValidationMessage(`❌ Not quite right. ${attemptsRemaining - 1} attempts remaining.`);
    }
  };

  const handleHint = () => {
    const hint = getHint();
    if (!hint) {
      setValidationMessage('No more hints available!');
    }
  };

  const allFilled = hiddenIndices.every((i) => playerAnswers[i] !== null && playerAnswers[i] !== undefined);

  // Show loading if sequence is not ready
  if (sequence.length === 0) {
    return (
      <div className="w-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pattern...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🚂 Number Train - Find the Missing Numbers!</h2>
      <p className="text-gray-600 mb-4">
        Click a number from the bin below, then click a mystery box to place it.
      </p>

      {/* Canvas */}
      <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-300 mb-4">
        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          <Layer>
            {/* Background */}
            <Rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#F0F4F8" />

            {/* Train Track */}
            <Line
              points={[20, TRAIN_Y + BOX_SIZE + 20, CANVAS_WIDTH - 20, TRAIN_Y + BOX_SIZE + 20]}
              stroke="#8B4513"
              strokeWidth={8}
            />
            <Line
              points={[20, TRAIN_Y + BOX_SIZE + 30, CANVAS_WIDTH - 20, TRAIN_Y + BOX_SIZE + 30]}
              stroke="#8B4513"
              strokeWidth={8}
            />

            {/* Train Engine */}
            <Rect x={startX - 80} y={TRAIN_Y - 10} width={60} height={BOX_SIZE + 20} fill="#4A5568" cornerRadius={8} />
            <Text x={startX - 75} y={TRAIN_Y + 25} text="🚂" fontSize={40} />

            {/* Number Boxes (Carriages) */}
            {sequence.map((num, idx) => {
              const x = startX + idx * (BOX_SIZE + BOX_GAP);
              const isHidden = hiddenIndices.includes(idx);
              const playerAnswer = playerAnswers[idx];
              const hasAnswer = playerAnswer !== null && playerAnswer !== undefined;

              return (
                <React.Fragment key={idx}>
                  {/* Carriage body */}
                  <Rect
                    x={x}
                    y={TRAIN_Y}
                    width={BOX_SIZE}
                    height={BOX_SIZE}
                    fill={isHidden ? (hasAnswer ? '#A78BFA' : '#E5E7EB') : '#60A5FA'}
                    stroke={isHidden ? '#7C3AED' : '#2563EB'}
                    strokeWidth={3}
                    cornerRadius={8}
                    onClick={() => handleBoxClick(idx)}
                    onTap={() => handleBoxClick(idx)}
                    shadowColor="#000"
                    shadowBlur={5}
                    shadowOpacity={0.2}
                  />

                  {/* Number or Question Mark */}
                  <Text
                    x={x}
                    y={TRAIN_Y + BOX_SIZE / 2 - 15}
                    width={BOX_SIZE}
                    text={isHidden ? (hasAnswer ? String(playerAnswer) : '?') : String(num)}
                    fontSize={isHidden && !hasAnswer ? 36 : 28}
                    fontFamily="Arial"
                    fill={isHidden ? (hasAnswer ? '#FFF' : '#9CA3AF') : '#FFF'}
                    align="center"
                    fontStyle="bold"
                    listening={false}
                  />

                  {/* Connector to next carriage */}
                  {idx < sequence.length - 1 && (
                    <Line
                      points={[x + BOX_SIZE, TRAIN_Y + BOX_SIZE / 2, x + BOX_SIZE + BOX_GAP, TRAIN_Y + BOX_SIZE / 2]}
                      stroke="#4A5568"
                      strokeWidth={4}
                    />
                  )}

                  {/* Wheels */}
                  <Rect
                    x={x + 10}
                    y={TRAIN_Y + BOX_SIZE}
                    width={20}
                    height={20}
                    fill="#1F2937"
                    cornerRadius={10}
                  />
                  <Rect
                    x={x + BOX_SIZE - 30}
                    y={TRAIN_Y + BOX_SIZE}
                    width={20}
                    height={20}
                    fill="#1F2937"
                    cornerRadius={10}
                  />
                </React.Fragment>
              );
            })}

            {/* Number Bin Label */}
            <Text x={50} y={280} text="🎯 Number Bin:" fontSize={18} fontFamily="Arial" fill="#374151" fontStyle="bold" />

            {/* Number Tokens */}
            {allTokens.map((num, idx) => {
              const tokenX = 50 + (idx % 9) * 90;
              const tokenY = 310 + Math.floor(idx / 9) * 50;
              const isPlaced = placedValues.includes(num);
              const isSelected = selectedToken === num;

              return (
                <Group
                  key={`token-${num}-${idx}`}
                  x={tokenX}
                  y={tokenY}
                  onClick={() => !isPlaced && handleTokenClick(num)}
                  onTap={() => !isPlaced && handleTokenClick(num)}
                >
                  <Rect
                    width={70}
                    height={40}
                    fill={isPlaced ? '#D1D5DB' : isSelected ? '#FCD34D' : '#8B5CF6'}
                    stroke={isSelected ? '#F59E0B' : '#6D28D9'}
                    strokeWidth={isSelected ? 4 : 2}
                    cornerRadius={8}
                    opacity={isPlaced ? 0.5 : 1}
                  />
                  <Text
                    x={0}
                    y={10}
                    width={70}
                    text={String(num)}
                    fontSize={18}
                    fontFamily="Arial"
                    fill={isPlaced ? '#9CA3AF' : '#FFF'}
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

      {/* Hint Display */}
      {currentHint && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
          <p className="text-yellow-800">💡 <strong>Hint:</strong> {currentHint}</p>
        </div>
      )}

      {/* Validation Message */}
      {validationMessage && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            validationMessage.includes('✅') ? 'bg-green-50 border border-green-300' : 'bg-red-50 border border-red-300'
          }`}
        >
          <p className={validationMessage.includes('✅') ? 'text-green-800' : 'text-red-800'}>{validationMessage}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={handleHint}
          disabled={hintsUsed >= 3}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            hintsUsed >= 3
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600 text-white'
          }`}
        >
          💡 Hint ({3 - hintsUsed} left)
        </button>

        <button
          onClick={handleValidate}
          disabled={!allFilled}
          className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
            allFilled ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          ✓ Check Answer
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>How to play:</strong> Look at the visible numbers and find the pattern. Click a number from the bin,
          then click a mystery box (?) to place it. Fill all boxes and click Check Answer!
        </p>
      </div>
    </div>
  );
};

export default PatternDiscoveryCanvas;
