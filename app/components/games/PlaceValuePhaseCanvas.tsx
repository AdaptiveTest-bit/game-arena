'use client';

import React, { useState, useMemo } from 'react';
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva';
import { useOceanEmpireStore, formatIndian } from '@/app/store/useOceanEmpireStore';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;

const PlaceValuePhaseCanvas: React.FC = () => {
  const {
    placeValueChallenge,
    placeDigit,
    removeDigit,
    validatePlaceValue,
    isPhaseCorrect
  } = useOceanEmpireStore();

  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  // Memoize shuffled digits to prevent reshuffling on every render
  const displayDigits = useMemo(() => {
    if (!placeValueChallenge) return [];
    return [...placeValueChallenge.availableDigits];
  }, [placeValueChallenge]);

  if (!placeValueChallenge) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { targetNumber, targetNumberWords, placeValues, playerPlacements } = placeValueChallenge;
  const numSlots = placeValues.length;
  const slotWidth = 80;
  const slotGap = 10;
  const totalWidth = numSlots * (slotWidth + slotGap) - slotGap;
  const startX = (CANVAS_WIDTH - totalWidth) / 2;

  const handleSlotClick = (index: number) => {
    if (isPhaseCorrect) return;
    
    if (selectedDigit !== null) {
      placeDigit(index, selectedDigit);
      setSelectedDigit(null);
      setValidationMessage(null);
    } else if (playerPlacements[index] !== null) {
      removeDigit(index);
    }
  };

  const handleDigitClick = (digit: number) => {
    if (isPhaseCorrect) return;
    setSelectedDigit(selectedDigit === digit ? null : digit);
  };

  const handleValidate = () => {
    if (playerPlacements.includes(null)) {
      setValidationMessage('❌ Please fill all place value slots first!');
      return;
    }
    
    const correct = validatePlaceValue();
    if (correct) {
      setValidationMessage('✅ Perfect! All digits are in the correct places!');
    } else {
      setValidationMessage('❌ Not quite right. Check the place values again!');
    }
  };

  const allFilled = !playerPlacements.includes(null);

  return (
    <div className="w-full">
      {/* Target Number Display */}
      <div className="mb-6 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl p-6 inline-block">
          <p className="text-sm uppercase tracking-wide opacity-80">Target Population</p>
          <p className="text-4xl font-bold font-mono">{formatIndian(targetNumber)}</p>
          <p className="text-sm mt-2 opacity-80">{targetNumberWords}</p>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-gradient-to-b from-blue-50 to-cyan-50 rounded-lg overflow-hidden border border-blue-200 mb-4">
        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          <Layer>
            {/* Background */}
            <Rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#E0F2FE" />

            {/* Ocean waves decoration */}
            {[0, 1, 2].map((i) => (
              <Line
                key={`wave-${i}`}
                points={Array.from({ length: 20 }, (_, j) => [
                  j * 50,
                  450 + i * 15 + Math.sin(j * 0.5) * 10
                ]).flat()}
                stroke="#60A5FA"
                strokeWidth={3}
                opacity={0.3 - i * 0.1}
              />
            ))}

            {/* Place Value Labels */}
            <Text
              x={startX}
              y={20}
              text="📍 Place Value Slots (drag digits here)"
              fontSize={16}
              fontFamily="Arial"
              fill="#1E40AF"
              fontStyle="bold"
            />

            {/* Place Value Slots */}
            {placeValues.map((label, idx) => {
              const x = startX + idx * (slotWidth + slotGap);
              const y = 50;
              const hasDigit = playerPlacements[idx] !== null;
              
              // Determine separator positions (after crores, lakhs, thousands)
              const showSeparator = (numSlots === 8 && (idx === 0 || idx === 2 || idx === 4)) ||
                                   (numSlots === 7 && (idx === 1 || idx === 3));

              return (
                <React.Fragment key={`slot-${idx}`}>
                  {/* Separator line */}
                  {showSeparator && idx > 0 && (
                    <Line
                      points={[x - 5, y + 20, x - 5, y + 120]}
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dash={[5, 5]}
                    />
                  )}
                  
                  <Group
                    x={x}
                    y={y}
                    onClick={() => handleSlotClick(idx)}
                    onTap={() => handleSlotClick(idx)}
                  >
                    {/* Slot background */}
                    <Rect
                      width={slotWidth}
                      height={100}
                      fill={hasDigit ? '#10B981' : selectedDigit !== null ? '#FEF3C7' : '#FFF'}
                      stroke={hasDigit ? '#059669' : selectedDigit !== null ? '#F59E0B' : '#94A3B8'}
                      strokeWidth={3}
                      cornerRadius={10}
                      shadowColor="#000"
                      shadowBlur={5}
                      shadowOpacity={0.1}
                    />
                    
                    {/* Place value label */}
                    <Text
                      x={0}
                      y={10}
                      width={slotWidth}
                      text={label}
                      fontSize={11}
                      fontFamily="Arial"
                      fill={hasDigit ? '#FFF' : '#64748B'}
                      align="center"
                      fontStyle="bold"
                      listening={false}
                    />
                    
                    {/* Digit display */}
                    <Text
                      x={0}
                      y={40}
                      width={slotWidth}
                      text={hasDigit ? String(playerPlacements[idx]) : '?'}
                      fontSize={36}
                      fontFamily="Arial"
                      fill={hasDigit ? '#FFF' : '#CBD5E1'}
                      align="center"
                      fontStyle="bold"
                      listening={false}
                    />
                  </Group>
                </React.Fragment>
              );
            })}

            {/* Fish Bin Label */}
            <Text
              x={50}
              y={200}
              text="🐟 Fish Digit Bin (click to select, then click a slot)"
              fontSize={16}
              fontFamily="Arial"
              fill="#1E40AF"
              fontStyle="bold"
            />

            {/* Digit Tokens in Bin */}
            {displayDigits.map((digit, idx) => {
              const tokenX = 80 + (idx % 8) * 100;
              const tokenY = 240 + Math.floor(idx / 8) * 80;
              const isSelected = selectedDigit === digit;

              return (
                <Group
                  key={`digit-${idx}-${digit}`}
                  x={tokenX}
                  y={tokenY}
                  onClick={() => handleDigitClick(digit)}
                  onTap={() => handleDigitClick(digit)}
                >
                  {/* Fish-shaped token background */}
                  <Rect
                    width={80}
                    height={60}
                    fill={isSelected ? '#FCD34D' : '#3B82F6'}
                    stroke={isSelected ? '#F59E0B' : '#1D4ED8'}
                    strokeWidth={isSelected ? 4 : 2}
                    cornerRadius={30}
                    shadowColor="#000"
                    shadowBlur={isSelected ? 10 : 5}
                    shadowOpacity={0.2}
                  />
                  
                  {/* Fish emoji */}
                  <Text
                    x={5}
                    y={5}
                    text="🐟"
                    fontSize={16}
                    listening={false}
                  />
                  
                  {/* Digit */}
                  <Text
                    x={0}
                    y={18}
                    width={80}
                    text={String(digit)}
                    fontSize={28}
                    fontFamily="Arial"
                    fill="#FFF"
                    align="center"
                    fontStyle="bold"
                    listening={false}
                  />
                </Group>
              );
            })}

            {/* Success overlay */}
            {isPhaseCorrect && (
              <>
                <Rect
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  fill="#10B981"
                  opacity={0.1}
                />
                <Text
                  x={0}
                  y={400}
                  width={CANVAS_WIDTH}
                  text="✅ Correct! All digits placed correctly!"
                  fontSize={24}
                  fontFamily="Arial"
                  fill="#059669"
                  align="center"
                  fontStyle="bold"
                />
              </>
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
          disabled={!allFilled}
          className={`w-full px-6 py-4 rounded-lg font-bold text-lg transition-all ${
            allFilled
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          ✓ Check Answer
        </button>
      )}

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>How to play:</strong> Click a fish digit from the bin to select it (it will glow yellow). 
          Then click a place value slot to place it there. Fill all slots with the correct digits 
          matching the target number!
        </p>
      </div>
    </div>
  );
};

export default PlaceValuePhaseCanvas;
