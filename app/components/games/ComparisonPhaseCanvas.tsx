'use client';

import React, { useState, useMemo } from 'react';
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva';
import { useOceanEmpireStore, formatIndian } from '@/app/store/useOceanEmpireStore';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;

const ComparisonPhaseCanvas: React.FC = () => {
  const {
    comparisonChallenge,
    placeZone,
    removeZone,
    validateComparison,
    isPhaseCorrect
  } = useOceanEmpireStore();

  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  // Memoize shuffled zones
  const displayZones = useMemo(() => {
    if (!comparisonChallenge) return [];
    return [...comparisonChallenge.zones];
  }, [comparisonChallenge]);

  if (!comparisonChallenge) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { playerOrder } = comparisonChallenge;

  const handleSlotClick = (slotIndex: number) => {
    if (isPhaseCorrect) return;
    
    if (selectedZone !== null) {
      placeZone(slotIndex, selectedZone);
      setSelectedZone(null);
      setValidationMessage(null);
    } else if (playerOrder[slotIndex] !== null) {
      removeZone(slotIndex);
    }
  };

  const handleZoneClick = (zoneName: string) => {
    if (isPhaseCorrect) return;
    if (isZonePlaced(zoneName)) return;
    setSelectedZone(selectedZone === zoneName ? null : zoneName);
  };

  const getZoneByName = (name: string) => displayZones.find(z => z.name === name);
  const isZonePlaced = (name: string) => playerOrder.includes(name);

  const handleValidate = () => {
    if (playerOrder.includes(null)) {
      setValidationMessage('❌ Please place all ocean zones in order first!');
      return;
    }
    
    const correct = validateComparison();
    if (correct) {
      setValidationMessage('✅ Perfect! You ordered all zones correctly!');
    } else {
      setValidationMessage('❌ Not quite right. Compare the populations more carefully!');
    }
  };

  const allFilled = !playerOrder.includes(null);

  return (
    <div className="w-full">
      {/* Title */}
      <div className="mb-4 text-center">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl p-4 inline-block">
          <p className="text-lg">🏆 Final Challenge: Order the Ocean Zones!</p>
          <p className="text-sm opacity-80">Drag zones from SMALLEST to LARGEST population</p>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-gradient-to-b from-emerald-50 to-teal-50 rounded-lg overflow-hidden border border-emerald-200 mb-4">
        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          <Layer>
            {/* Background */}
            <Rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#ECFDF5" />

            {/* Ocean decorations */}
            {[0, 1, 2].map((i) => (
              <Line
                key={`wave-${i}`}
                points={Array.from({ length: 20 }, (_, j) => [
                  j * 50,
                  460 + i * 12 + Math.sin(j * 0.5 + i) * 6
                ]).flat()}
                stroke="#34D399"
                strokeWidth={2}
                opacity={0.3 - i * 0.1}
              />
            ))}

            {/* Order Slots */}
            <Text
              x={50}
              y={20}
              text="📍 Drop Zones (Smallest → Largest)"
              fontSize={16}
              fontFamily="Arial"
              fill="#047857"
              fontStyle="bold"
            />

            <Text x={85} y={50} text="Smallest" fontSize={12} fill="#6B7280" fontStyle="italic" />
            <Text x={745} y={50} text="Largest" fontSize={12} fill="#6B7280" fontStyle="italic" />

            {/* Arrow line connecting slots */}
            <Line
              points={[90, 130, 830, 130]}
              stroke="#9CA3AF"
              strokeWidth={2}
              dash={[10, 5]}
            />

            {[0, 1, 2, 3, 4].map((slotIdx) => {
              const slotX = 60 + slotIdx * 160;
              const slotY = 70;
              const placedZoneName = playerOrder[slotIdx];
              const placedZone = placedZoneName ? getZoneByName(placedZoneName) : null;

              return (
                <Group
                  key={`slot-${slotIdx}`}
                  x={slotX}
                  y={slotY}
                  onClick={() => handleSlotClick(slotIdx)}
                  onTap={() => handleSlotClick(slotIdx)}
                >
                  <Rect
                    width={145}
                    height={110}
                    fill={placedZone ? '#10B981' : selectedZone ? '#FEF3C7' : '#FFF'}
                    stroke={placedZone ? '#059669' : selectedZone ? '#F59E0B' : '#9CA3AF'}
                    strokeWidth={3}
                    cornerRadius={15}
                    shadowColor="#000"
                    shadowBlur={8}
                    shadowOpacity={0.15}
                  />
                  
                  {/* Slot number */}
                  <Text
                    x={0}
                    y={8}
                    width={145}
                    text={`#${slotIdx + 1}`}
                    fontSize={12}
                    fill={placedZone ? '#FFF' : '#9CA3AF'}
                    align="center"
                    fontStyle="bold"
                    listening={false}
                  />

                  {placedZone ? (
                    <>
                      <Text
                        x={0}
                        y={28}
                        width={145}
                        text={placedZone.icon}
                        fontSize={28}
                        align="center"
                        listening={false}
                      />
                      <Text
                        x={0}
                        y={58}
                        width={145}
                        text={placedZone.name}
                        fontSize={14}
                        fill="#FFF"
                        align="center"
                        fontStyle="bold"
                        listening={false}
                      />
                      <Text
                        x={0}
                        y={78}
                        width={145}
                        text={formatIndian(placedZone.population)}
                        fontSize={12}
                        fontFamily="monospace"
                        fill="#FFF"
                        align="center"
                        opacity={0.9}
                        listening={false}
                      />
                    </>
                  ) : (
                    <Text
                      x={0}
                      y={45}
                      width={145}
                      text="?"
                      fontSize={40}
                      fill="#CBD5E1"
                      align="center"
                      fontStyle="bold"
                      listening={false}
                    />
                  )}

                  {/* Arrow to next slot */}
                  {slotIdx < 4 && (
                    <Text
                      x={148}
                      y={45}
                      text="→"
                      fontSize={20}
                      fill="#9CA3AF"
                      listening={false}
                    />
                  )}
                </Group>
              );
            })}

            {/* Zone Cards */}
            <Text
              x={50}
              y={210}
              text="🐟 Ocean Zone Cards (click to select, then click a slot)"
              fontSize={16}
              fontFamily="Arial"
              fill="#047857"
              fontStyle="bold"
            />

            {displayZones.map((zone, idx) => {
              const cardX = 60 + (idx % 3) * 280;
              const cardY = 250 + Math.floor(idx / 3) * 120;
              const isPlaced = isZonePlaced(zone.name);
              const isSelected = selectedZone === zone.name;

              return (
                <Group
                  key={`zone-${zone.name}`}
                  x={cardX}
                  y={cardY}
                  onClick={() => handleZoneClick(zone.name)}
                  onTap={() => handleZoneClick(zone.name)}
                >
                  <Rect
                    width={260}
                    height={100}
                    fill={isPlaced ? '#D1D5DB' : isSelected ? '#FCD34D' : '#0D9488'}
                    stroke={isSelected ? '#F59E0B' : isPlaced ? '#9CA3AF' : '#0F766E'}
                    strokeWidth={isSelected ? 4 : 2}
                    cornerRadius={15}
                    opacity={isPlaced ? 0.5 : 1}
                    shadowColor="#000"
                    shadowBlur={isSelected ? 12 : 6}
                    shadowOpacity={0.2}
                  />
                  
                  {/* Zone icon and name */}
                  <Text
                    x={15}
                    y={15}
                    text={zone.icon}
                    fontSize={30}
                    listening={false}
                  />
                  <Text
                    x={55}
                    y={20}
                    text={zone.name}
                    fontSize={18}
                    fill={isPlaced ? '#6B7280' : '#FFF'}
                    fontStyle="bold"
                    listening={false}
                  />
                  
                  {/* Population */}
                  <Text
                    x={0}
                    y={55}
                    width={260}
                    text={formatIndian(zone.population)}
                    fontSize={24}
                    fontFamily="monospace"
                    fill={isPlaced ? '#6B7280' : '#FFF'}
                    align="center"
                    fontStyle="bold"
                    listening={false}
                  />
                  
                  {/* Fish count label */}
                  <Text
                    x={0}
                    y={82}
                    width={260}
                    text="fish"
                    fontSize={11}
                    fill={isPlaced ? '#9CA3AF' : '#FFF'}
                    align="center"
                    opacity={0.7}
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
                  y={CANVAS_HEIGHT - 40}
                  width={CANVAS_WIDTH}
                  text="🏆 Perfect ordering! You're a Large Numbers Master!"
                  fontSize={22}
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
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          ✓ Check Order
        </button>
      )}

      {/* Instructions */}
      <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <p className="text-sm text-emerald-800">
          <strong>How to play:</strong> Click an ocean zone card to select it (it will glow yellow). 
          Then click a drop slot to place it. Order all 5 zones from smallest population to largest!
        </p>
        <p className="text-xs text-emerald-600 mt-2">
          💡 <strong>Tip:</strong> Compare numbers digit by digit from left to right. Start with crores, 
          then lakhs, then thousands...
        </p>
      </div>
    </div>
  );
};

export default ComparisonPhaseCanvas;
