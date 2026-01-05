'use client';

import React, { useState, useMemo } from 'react';
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva';
import { useOceanEmpireStore, formatIndian } from '@/app/store/useOceanEmpireStore';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 450;

const MentalMathPhaseCanvas: React.FC = () => {
  const {
    mentalMathChallenge,
    appendToAnswer,
    clearAnswer,
    backspaceAnswer,
    setPlayerOrder,
    validateMentalMath,
    isPhaseCorrect
  } = useOceanEmpireStore();

  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [draggedNumber, setDraggedNumber] = useState<number | null>(null);

  // For comparison type - track order
  const [orderSlots, setOrderSlots] = useState<(number | null)[]>([null, null, null, null]);

  // Memoize the shuffled numbers for comparison - use seeded shuffle
  const shuffledNumbers = useMemo(() => {
    if (!mentalMathChallenge || mentalMathChallenge.type !== 'comparison') return [];
    // Create a stable shuffle based on the sum of numbers as seed
    const numbers = [...mentalMathChallenge.numbers];
    const seed = numbers.reduce((a, b) => a + b, 0);
    return numbers.sort((a, b) => {
      const hashA = (a * seed) % 100;
      const hashB = (b * seed) % 100;
      return hashA - hashB;
    });
  }, [mentalMathChallenge]);

  if (!mentalMathChallenge) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { type, numbers, operation, context, playerAnswer, strategy } = mentalMathChallenge;

  const handleKeypadClick = (key: string) => {
    if (isPhaseCorrect) return;
    
    if (key === 'C') {
      clearAnswer();
    } else if (key === '⌫') {
      backspaceAnswer();
    } else {
      appendToAnswer(key);
    }
    setValidationMessage(null);
  };

  const handleValidate = () => {
    if (type === 'comparison') {
      // Validate order
      const allFilled = orderSlots.every(s => s !== null);
      if (!allFilled) {
        setValidationMessage('❌ Please order all numbers first!');
        return;
      }
      setPlayerOrder(orderSlots as number[]);
    } else if (!playerAnswer) {
      setValidationMessage('❌ Please enter your answer!');
      return;
    }
    
    // Small delay to ensure state updates
    setTimeout(() => {
      const correct = validateMentalMath();
      if (correct) {
        setValidationMessage('✅ Excellent mental math skills!');
      } else {
        setValidationMessage('❌ Not quite right. Check your calculation!');
      }
    }, 50);
  };

  const handleOrderSlotClick = (slotIndex: number) => {
    if (isPhaseCorrect) return;
    
    if (draggedNumber !== null) {
      const newSlots = [...orderSlots];
      // Remove number from any existing slot
      const existingIndex = newSlots.indexOf(draggedNumber);
      if (existingIndex !== -1) {
        newSlots[existingIndex] = null;
      }
      newSlots[slotIndex] = draggedNumber;
      setOrderSlots(newSlots);
      setDraggedNumber(null);
      setValidationMessage(null);
    } else if (orderSlots[slotIndex] !== null) {
      // Remove from slot
      const newSlots = [...orderSlots];
      newSlots[slotIndex] = null;
      setOrderSlots(newSlots);
    }
  };

  const handleNumberClick = (num: number) => {
    if (isPhaseCorrect) return;
    setDraggedNumber(draggedNumber === num ? null : num);
  };

  const isNumberPlaced = (num: number) => orderSlots.includes(num);

  // Keypad layout
  const keypadRows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['C', '0', '⌫']
  ];

  return (
    <div className="w-full">
      {/* Context Display */}
      <div className="mb-4 text-center">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-4 inline-block">
          <p className="text-lg">🌊 {context}</p>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-gradient-to-b from-indigo-50 to-purple-50 rounded-lg overflow-hidden border border-indigo-200 mb-4">
        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          <Layer>
            {/* Background */}
            <Rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#EEF2FF" />

            {/* Ocean decorations */}
            {[0, 1].map((i) => (
              <Line
                key={`wave-${i}`}
                points={Array.from({ length: 20 }, (_, j) => [
                  j * 50,
                  400 + i * 20 + Math.sin(j * 0.5) * 8
                ]).flat()}
                stroke="#818CF8"
                strokeWidth={2}
                opacity={0.2}
              />
            ))}

            {type !== 'comparison' ? (
              <>
                {/* Numbers Display for Addition/Subtraction */}
                <Text
                  x={50}
                  y={30}
                  text="🐠 Calculate the fish population change:"
                  fontSize={18}
                  fontFamily="Arial"
                  fill="#3730A3"
                  fontStyle="bold"
                />

                {/* First Number - Zone A */}
                <Group x={100} y={70}>
                  <Rect
                    width={300}
                    height={100}
                    fill="#3B82F6"
                    cornerRadius={15}
                    shadowColor="#000"
                    shadowBlur={10}
                    shadowOpacity={0.2}
                  />
                  <Text
                    x={10}
                    y={10}
                    text="🦈 Zone A"
                    fontSize={14}
                    fill="#FFF"
                    opacity={0.8}
                    listening={false}
                  />
                  <Text
                    x={0}
                    y={40}
                    width={300}
                    text={formatIndian(numbers[0])}
                    fontSize={32}
                    fontFamily="monospace"
                    fill="#FFF"
                    align="center"
                    fontStyle="bold"
                    listening={false}
                  />
                </Group>

                {/* Operation Symbol */}
                <Group x={420} y={100}>
                  <Rect
                    width={60}
                    height={60}
                    fill="#8B5CF6"
                    cornerRadius={30}
                  />
                  <Text
                    x={0}
                    y={12}
                    width={60}
                    text={operation}
                    fontSize={32}
                    fill="#FFF"
                    align="center"
                    fontStyle="bold"
                    listening={false}
                  />
                </Group>

                {/* Second Number - Zone B */}
                <Group x={500} y={70}>
                  <Rect
                    width={300}
                    height={100}
                    fill="#10B981"
                    cornerRadius={15}
                    shadowColor="#000"
                    shadowBlur={10}
                    shadowOpacity={0.2}
                  />
                  <Text
                    x={10}
                    y={10}
                    text="🐠 Zone B"
                    fontSize={14}
                    fill="#FFF"
                    opacity={0.8}
                    listening={false}
                  />
                  <Text
                    x={0}
                    y={40}
                    width={300}
                    text={formatIndian(numbers[1])}
                    fontSize={32}
                    fontFamily="monospace"
                    fill="#FFF"
                    align="center"
                    fontStyle="bold"
                    listening={false}
                  />
                </Group>

                {/* Answer Display */}
                <Text
                  x={100}
                  y={200}
                  text="Your Answer:"
                  fontSize={16}
                  fontFamily="Arial"
                  fill="#3730A3"
                  fontStyle="bold"
                />
                
                <Rect
                  x={100}
                  y={225}
                  width={300}
                  height={60}
                  fill="#FFF"
                  stroke={isPhaseCorrect ? '#10B981' : '#6366F1'}
                  strokeWidth={3}
                  cornerRadius={10}
                />
                <Text
                  x={100}
                  y={240}
                  width={300}
                  text={playerAnswer || 'Enter your answer...'}
                  fontSize={playerAnswer ? 28 : 16}
                  fontFamily="monospace"
                  fill={playerAnswer ? '#1F2937' : '#9CA3AF'}
                  align="center"
                  fontStyle="bold"
                />

                {/* Keypad */}
                {keypadRows.map((row, rowIdx) => (
                  row.map((key, keyIdx) => {
                    const kx = 500 + keyIdx * 70;
                    const ky = 200 + rowIdx * 55;
                    
                    return (
                      <Group
                        key={`key-${key}`}
                        x={kx}
                        y={ky}
                        onClick={() => handleKeypadClick(key)}
                        onTap={() => handleKeypadClick(key)}
                      >
                        <Rect
                          width={60}
                          height={45}
                          fill={key === 'C' ? '#EF4444' : key === '⌫' ? '#F59E0B' : '#6366F1'}
                          stroke={key === 'C' ? '#DC2626' : key === '⌫' ? '#D97706' : '#4F46E5'}
                          strokeWidth={2}
                          cornerRadius={8}
                          shadowColor="#000"
                          shadowBlur={3}
                          shadowOpacity={0.2}
                        />
                        <Text
                          x={0}
                          y={12}
                          width={60}
                          text={key}
                          fontSize={20}
                          fontFamily="Arial"
                          fill="#FFF"
                          align="center"
                          fontStyle="bold"
                          listening={false}
                        />
                      </Group>
                    );
                  })
                ))}
              </>
            ) : (
              <>
                {/* Comparison Mode */}
                <Text
                  x={50}
                  y={20}
                  text="📊 Order populations from SMALLEST to LARGEST:"
                  fontSize={18}
                  fontFamily="Arial"
                  fill="#3730A3"
                  fontStyle="bold"
                />

                {/* Order Slots */}
                <Text x={50} y={60} text="Smallest" fontSize={12} fill="#6B7280" />
                <Text x={750} y={60} text="Largest" fontSize={12} fill="#6B7280" />
                
                {[0, 1, 2, 3].map((slotIdx) => {
                  const slotX = 80 + slotIdx * 200;
                  const slotY = 80;
                  const hasNumber = orderSlots[slotIdx] !== null;
                  
                  return (
                    <Group
                      key={`order-slot-${slotIdx}`}
                      x={slotX}
                      y={slotY}
                      onClick={() => handleOrderSlotClick(slotIdx)}
                      onTap={() => handleOrderSlotClick(slotIdx)}
                    >
                      <Rect
                        width={180}
                        height={80}
                        fill={hasNumber ? '#10B981' : draggedNumber !== null ? '#FEF3C7' : '#FFF'}
                        stroke={hasNumber ? '#059669' : draggedNumber !== null ? '#F59E0B' : '#9CA3AF'}
                        strokeWidth={3}
                        cornerRadius={12}
                        shadowColor="#000"
                        shadowBlur={5}
                        shadowOpacity={0.1}
                      />
                      <Text
                        x={0}
                        y={10}
                        width={180}
                        text={`#${slotIdx + 1}`}
                        fontSize={12}
                        fill={hasNumber ? '#FFF' : '#9CA3AF'}
                        align="center"
                        listening={false}
                      />
                      <Text
                        x={0}
                        y={35}
                        width={180}
                        text={hasNumber ? formatIndian(orderSlots[slotIdx]!) : '?'}
                        fontSize={hasNumber ? 20 : 32}
                        fontFamily="monospace"
                        fill={hasNumber ? '#FFF' : '#CBD5E1'}
                        align="center"
                        fontStyle="bold"
                        listening={false}
                      />
                      
                      {/* Arrow between slots */}
                      {slotIdx < 3 && (
                        <Text
                          x={185}
                          y={30}
                          text="→"
                          fontSize={24}
                          fill="#9CA3AF"
                          listening={false}
                        />
                      )}
                    </Group>
                  );
                })}

                {/* Available Numbers */}
                <Text
                  x={50}
                  y={200}
                  text="🐟 Click a number, then click a slot to place it:"
                  fontSize={16}
                  fontFamily="Arial"
                  fill="#3730A3"
                  fontStyle="bold"
                />

                {shuffledNumbers.map((num, idx) => {
                  const numX = 80 + (idx % 2) * 400;
                  const numY = 240 + Math.floor(idx / 2) * 90;
                  const isPlaced = isNumberPlaced(num);
                  const isSelected = draggedNumber === num;

                  return (
                    <Group
                      key={`num-${idx}`}
                      x={numX}
                      y={numY}
                      onClick={() => !isPlaced && handleNumberClick(num)}
                      onTap={() => !isPlaced && handleNumberClick(num)}
                    >
                      <Rect
                        width={350}
                        height={70}
                        fill={isPlaced ? '#D1D5DB' : isSelected ? '#FCD34D' : '#3B82F6'}
                        stroke={isSelected ? '#F59E0B' : isPlaced ? '#9CA3AF' : '#1D4ED8'}
                        strokeWidth={isSelected ? 4 : 2}
                        cornerRadius={12}
                        opacity={isPlaced ? 0.5 : 1}
                        shadowColor="#000"
                        shadowBlur={isSelected ? 10 : 5}
                        shadowOpacity={0.2}
                      />
                      <Text
                        x={10}
                        y={10}
                        text={['🦈', '🐠', '🐋', '🐡'][idx]}
                        fontSize={20}
                        listening={false}
                      />
                      <Text
                        x={0}
                        y={25}
                        width={350}
                        text={formatIndian(num)}
                        fontSize={24}
                        fontFamily="monospace"
                        fill={isPlaced ? '#6B7280' : '#FFF'}
                        align="center"
                        fontStyle="bold"
                        listening={false}
                      />
                    </Group>
                  );
                })}
              </>
            )}

            {/* Success overlay */}
            {isPhaseCorrect && (
              <Text
                x={0}
                y={CANVAS_HEIGHT - 40}
                width={CANVAS_WIDTH}
                text="✅ Excellent mental math!"
                fontSize={24}
                fontFamily="Arial"
                fill="#059669"
                align="center"
                fontStyle="bold"
              />
            )}
          </Layer>
        </Stage>
      </div>

      {/* Validation Message */}
      {validationMessage && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            validationMessage.includes('✅')
              ? 'bg-green-50 border border-green-300'
              : 'bg-red-50 border border-red-300'
          }`}
        >
          <p className={validationMessage.includes('✅') ? 'text-green-800' : 'text-red-800'}>
            {validationMessage}
          </p>
        </div>
      )}

      {/* Check Answer Button */}
      {!isPhaseCorrect && (
        <button
          onClick={handleValidate}
          className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg rounded-lg transition-all"
        >
          ✓ Check Answer
        </button>
      )}

      {/* Instructions */}
      <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <p className="text-sm text-indigo-800">
          <strong>How to play:</strong>{' '}
          {type === 'comparison'
            ? 'Click a fish population card to select it (it will glow yellow), then click a slot to place it. Order all populations from smallest to largest!'
            : 'Use the keypad to enter your answer. Use mental math strategies: round to the nearest lakh, calculate, then adjust!'}
        </p>
        {type !== 'comparison' && (
          <p className="text-xs text-indigo-600 mt-2">
            💡 <strong>Strategy:</strong> {strategy}
          </p>
        )}
      </div>
    </div>
  );
};

export default MentalMathPhaseCanvas;
