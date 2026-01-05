'use client';

import React from 'react';
import { Stage, Layer, Rect, Circle, RegularPolygon, Text, Group, Line } from 'react-konva';
import { useShapeCityStore } from '../../store/useShapeCityStore';

type ShapeType = 'circle' | 'square' | 'rectangle' | 'triangle' | 'semicircle' | 'pentagon' | 'hexagon';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;

const SHAPE_COLORS: Record<ShapeType, string> = {
  circle: '#FF6B6B',
  square: '#4ECDC4',
  rectangle: '#45B7D1',
  triangle: '#96CEB4',
  semicircle: '#FFEAA7',
  pentagon: '#DDA0DD',
  hexagon: '#98D8C8'
};

interface ShapeIconProps {
  shape: ShapeType;
  x: number;
  y: number;
  size: number;
  selected?: boolean;
  isSlot?: boolean;
  filled?: boolean;
  onClick?: () => void;
}

function ShapeIcon({ shape, x, y, size, selected, isSlot, filled, onClick }: ShapeIconProps) {
  const color = isSlot 
    ? (filled ? SHAPE_COLORS[shape] : '#E8E8E8')
    : SHAPE_COLORS[shape];
  const strokeColor = selected ? '#FFD700' : (isSlot && !filled ? '#AAA' : '#333');
  const strokeWidth = selected ? 4 : 2;
  
  const commonProps = {
    x,
    y,
    fill: color,
    stroke: strokeColor,
    strokeWidth,
    onClick,
    onTap: onClick,
    shadowBlur: selected ? 15 : 0,
    shadowColor: selected ? '#FFD700' : undefined
  };

  switch (shape) {
    case 'circle':
      return <Circle {...commonProps} radius={size / 2} />;
    case 'square':
      return (
        <Rect
          {...commonProps}
          width={size}
          height={size}
          offsetX={size / 2}
          offsetY={size / 2}
        />
      );
    case 'rectangle':
      return (
        <Rect
          {...commonProps}
          width={size * 1.5}
          height={size * 0.7}
          offsetX={size * 0.75}
          offsetY={size * 0.35}
        />
      );
    case 'triangle':
      return <RegularPolygon {...commonProps} sides={3} radius={size / 2} />;
    case 'semicircle':
      return (
        <Group x={x} y={y} onClick={onClick} onTap={onClick}>
          <Circle
            radius={size / 2}
            fill={color}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <Rect
            x={-size / 2}
            y={0}
            width={size}
            height={size / 2}
            fill="#F5F5F5"
          />
        </Group>
      );
    case 'pentagon':
      return <RegularPolygon {...commonProps} sides={5} radius={size / 2} />;
    case 'hexagon':
      return <RegularPolygon {...commonProps} sides={6} radius={size / 2} />;
    default:
      return <Circle {...commonProps} radius={size / 2} />;
  }
}

export default function ShapeCityPatternCanvas() {
  const { patternChallenge, selectPatternShape, placePatternShape } = useShapeCityStore();

  if (!patternChallenge) {
    return (
      <div className="flex items-center justify-center h-[450px]">
        <p className="text-gray-500">Loading challenge...</p>
      </div>
    );
  }

  const { pattern, availableShapes, selectedShape, completedSlots, totalBlankSlots } = patternChallenge;

  // Calculate pattern display
  const patternStartX = 40;
  const patternY = 180;
  const slotWidth = 55;
  const slotSize = 35;

  return (
    <div className="relative">
      {/* Progress indicator */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 rounded-xl px-4 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-600">Complete the pattern:</p>
        <p className="text-lg font-bold text-purple-600">
          {completedSlots} / {totalBlankSlots} slots filled
        </p>
      </div>

      {/* Selected shape indicator */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 rounded-xl px-4 py-2 shadow-lg">
        <p className="text-sm text-gray-600">Selected:</p>
        <p className="text-2xl font-bold">
          {selectedShape ? (
            <span style={{ color: SHAPE_COLORS[selectedShape] }}>
              {selectedShape.charAt(0).toUpperCase() + selectedShape.slice(1)}
            </span>
          ) : (
            <span className="text-gray-400">None</span>
          )}
        </p>
      </div>

      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          {/* Background */}
          <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#FAFAFA" />
          
          {/* Decorative border */}
          <Rect
            x={10}
            y={10}
            width={CANVAS_WIDTH - 20}
            height={CANVAS_HEIGHT - 20}
            stroke="#E0E0E0"
            strokeWidth={3}
            cornerRadius={15}
            dash={[10, 5]}
          />

          {/* Title area */}
          <Rect
            x={180}
            y={30}
            width={240}
            height={40}
            fill="#9B59B6"
            cornerRadius={20}
          />
          <Text
            x={180}
            y={40}
            width={240}
            text="🧩 Complete the Pattern!"
            fontSize={18}
            fill="#FFFFFF"
            align="center"
            fontStyle="bold"
          />

          {/* Pattern row background */}
          <Rect
            x={20}
            y={patternY - 40}
            width={CANVAS_WIDTH - 40}
            height={90}
            fill="#F0E6F6"
            cornerRadius={15}
            stroke="#D4B8E0"
            strokeWidth={2}
          />

          {/* Pattern sequence */}
          {pattern.map((slot, index) => {
            const x = patternStartX + index * slotWidth + slotSize / 2;
            const y = patternY;
            
            return (
              <Group key={slot.id}>
                {/* Slot background for blank slots */}
                {slot.isBlank && (
                  <Rect
                    x={x - slotSize / 2 - 5}
                    y={y - slotSize / 2 - 5}
                    width={slotSize + 10}
                    height={slotSize + 10}
                    fill={slot.shape ? '#D4EDDA' : '#FFF3CD'}
                    stroke={slot.shape ? '#28A745' : '#FFC107'}
                    strokeWidth={2}
                    cornerRadius={8}
                    dash={slot.shape ? undefined : [5, 3]}
                  />
                )}
                
                {/* Shape or question mark */}
                {slot.shape ? (
                  <ShapeIcon
                    shape={slot.shape}
                    x={x}
                    y={y}
                    size={slotSize}
                    isSlot={slot.isBlank}
                    filled={true}
                  />
                ) : (
                  <Group>
                    <Circle
                      x={x}
                      y={y}
                      radius={slotSize / 2}
                      fill="#FFF3CD"
                      stroke="#FFC107"
                      strokeWidth={2}
                      onClick={() => selectedShape && placePatternShape(slot.id)}
                      onTap={() => selectedShape && placePatternShape(slot.id)}
                    />
                    <Text
                      x={x - 10}
                      y={y - 12}
                      text="?"
                      fontSize={24}
                      fill="#856404"
                      fontStyle="bold"
                    />
                  </Group>
                )}
                
                {/* Slot number */}
                <Text
                  x={x - 6}
                  y={y + slotSize / 2 + 8}
                  text={`${index + 1}`}
                  fontSize={12}
                  fill="#888"
                />
              </Group>
            );
          })}

          {/* Divider */}
          <Line
            points={[50, 280, CANVAS_WIDTH - 50, 280]}
            stroke="#DDD"
            strokeWidth={2}
            dash={[10, 5]}
          />

          {/* Available shapes section */}
          <Text
            x={0}
            y={300}
            width={CANVAS_WIDTH}
            text="👇 Select a shape to place:"
            fontSize={16}
            fill="#666"
            align="center"
          />

          {/* Shape palette */}
          {availableShapes.map((shape, index) => {
            const paletteX = CANVAS_WIDTH / 2 - (availableShapes.length * 80) / 2 + index * 80 + 40;
            const paletteY = 370;
            const isSelected = selectedShape === shape;
            
            return (
              <Group key={shape}>
                {/* Selection highlight */}
                {isSelected && (
                  <Circle
                    x={paletteX}
                    y={paletteY}
                    radius={45}
                    fill="#FFE082"
                    opacity={0.5}
                  />
                )}
                
                <ShapeIcon
                  shape={shape}
                  x={paletteX}
                  y={paletteY}
                  size={50}
                  selected={isSelected}
                  onClick={() => selectPatternShape(shape)}
                />
                
                {/* Shape name */}
                <Text
                  x={paletteX - 35}
                  y={paletteY + 35}
                  width={70}
                  text={shape}
                  fontSize={11}
                  fill="#555"
                  align="center"
                />
              </Group>
            );
          })}

          {/* Instructions */}
          <Rect
            x={150}
            y={CANVAS_HEIGHT - 35}
            width={300}
            height={25}
            fill="rgba(0,0,0,0.6)"
            cornerRadius={12}
          />
          <Text
            x={150}
            y={CANVAS_HEIGHT - 30}
            width={300}
            text="Select shape → Tap empty slot to place"
            fontSize={12}
            fill="#FFFFFF"
            align="center"
          />
        </Layer>
      </Stage>
    </div>
  );
}
