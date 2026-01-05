'use client';

import React, { useState } from 'react';
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

interface ShapeBlockProps {
  shape: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  selected: boolean;
  placed: boolean;
  onClick: () => void;
}

function ShapeBlock({ shape, x, y, width, height, color, selected, placed, onClick }: ShapeBlockProps) {
  if (placed) return null;
  
  const strokeColor = selected ? '#FFD700' : '#333';
  const strokeWidth = selected ? 4 : 2;
  
  const commonProps = {
    x,
    y,
    fill: color,
    stroke: strokeColor,
    strokeWidth,
    onClick,
    onTap: onClick,
    shadowBlur: selected ? 15 : 5,
    shadowColor: selected ? '#FFD700' : 'rgba(0,0,0,0.3)',
    shadowOffset: { x: 2, y: 2 }
  };

  switch (shape) {
    case 'circle':
      return <Circle {...commonProps} radius={width / 2} />;
    case 'square':
      return (
        <Rect
          {...commonProps}
          width={width}
          height={width}
          offsetX={width / 2}
          offsetY={width / 2}
          cornerRadius={3}
        />
      );
    case 'rectangle':
      return (
        <Rect
          {...commonProps}
          width={width * 1.4}
          height={height * 0.6}
          offsetX={width * 0.7}
          offsetY={height * 0.3}
          cornerRadius={3}
        />
      );
    case 'triangle':
      return <RegularPolygon {...commonProps} sides={3} radius={width / 2} />;
    case 'semicircle':
      return (
        <Group x={x} y={y} onClick={onClick} onTap={onClick}>
          <Circle
            radius={width / 2}
            fill={color}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <Rect
            x={-width / 2}
            y={0}
            width={width}
            height={width / 2}
            fill="#F0F0F0"
          />
        </Group>
      );
    case 'pentagon':
      return <RegularPolygon {...commonProps} sides={5} radius={width / 2} />;
    case 'hexagon':
      return <RegularPolygon {...commonProps} sides={6} radius={width / 2} />;
    default:
      return <Circle {...commonProps} radius={width / 2} />;
  }
}

interface SlotOutlineProps {
  shape: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  filled: boolean;
  isTarget: boolean;
  onClick: () => void;
}

function SlotOutline({ shape, x, y, width, height, filled, isTarget, onClick }: SlotOutlineProps) {
  const color = filled ? SHAPE_COLORS[shape] : 'transparent';
  const strokeColor = isTarget ? '#FFD700' : (filled ? '#333' : '#999');
  const strokeWidth = isTarget ? 4 : 3;
  const dash = filled ? undefined : [8, 4];
  
  const commonProps = {
    x,
    y,
    fill: color,
    stroke: strokeColor,
    strokeWidth,
    dash,
    onClick,
    onTap: onClick,
    shadowBlur: isTarget ? 10 : 0,
    shadowColor: isTarget ? '#FFD700' : undefined
  };

  switch (shape) {
    case 'circle':
      return <Circle {...commonProps} radius={width / 2} />;
    case 'square':
      return (
        <Rect
          {...commonProps}
          width={width}
          height={width}
          offsetX={width / 2}
          offsetY={width / 2}
        />
      );
    case 'rectangle':
      return (
        <Rect
          {...commonProps}
          width={width * 1.2}
          height={height * 0.7}
          offsetX={width * 0.6}
          offsetY={height * 0.35}
        />
      );
    case 'triangle':
      return <RegularPolygon {...commonProps} sides={3} radius={width / 2} />;
    case 'semicircle':
      return (
        <Group x={x} y={y} onClick={onClick} onTap={onClick}>
          <Circle
            radius={width / 2}
            fill={color}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            dash={dash}
          />
          {!filled && (
            <Rect
              x={-width / 2}
              y={0}
              width={width}
              height={width / 2}
              fill="#F5F5F5"
            />
          )}
        </Group>
      );
    case 'pentagon':
      return <RegularPolygon {...commonProps} sides={5} radius={width / 2} />;
    case 'hexagon':
      return <RegularPolygon {...commonProps} sides={6} radius={width / 2} />;
    default:
      return <Circle {...commonProps} radius={width / 2} />;
  }
}

export default function CityConstructorCanvas() {
  const { constructorChallenge } = useShapeCityStore();
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [placedBlocks, setPlacedBlocks] = useState<Set<string>>(new Set());
  const [filledSlots, setFilledSlots] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);

  if (!constructorChallenge) {
    return (
      <div className="flex items-center justify-center h-[450px]">
        <p className="text-gray-500">Loading challenge...</p>
      </div>
    );
  }

  const { buildingName, blocks, slots } = constructorChallenge;
  const totalSlots = slots.length;
  const filledCount = filledSlots.size;

  const handleBlockClick = (blockId: string) => {
    if (placedBlocks.has(blockId)) return;
    setSelectedBlockId(blockId === selectedBlockId ? null : blockId);
  };

  const handleSlotClick = (slotId: string) => {
    if (!selectedBlockId || filledSlots.has(slotId)) return;
    
    const block = blocks.find(b => b.id === selectedBlockId);
    const slot = slots.find(s => s.id === slotId);
    
    if (!block || !slot) return;
    
    // Check if shapes match
    if (block.shape === slot.requiredShape) {
      setPlacedBlocks(prev => new Set([...prev, selectedBlockId]));
      setFilledSlots(prev => new Set([...prev, slotId]));
      setScore(prev => prev + 15);
      setSelectedBlockId(null);
    }
  };

  const isComplete = filledCount >= totalSlots;

  return (
    <div className="relative">
      {/* Building name */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 rounded-xl px-4 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-600">Building:</p>
        <p className="text-xl font-bold text-indigo-600">
          🏗️ {buildingName}
        </p>
      </div>

      {/* Progress */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 rounded-xl px-4 py-2 shadow-lg">
        <p className="text-sm text-gray-600">Progress:</p>
        <p className="text-lg font-bold text-gray-800">
          {filledCount} / {totalSlots} blocks
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${(filledCount / totalSlots) * 100}%` }}
          />
        </div>
      </div>

      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          {/* Sky background */}
          <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT * 0.65} fill="#87CEEB" />
          
          {/* Ground */}
          <Rect x={0} y={CANVAS_HEIGHT * 0.65} width={CANVAS_WIDTH} height={CANVAS_HEIGHT * 0.35} fill="#90EE90" />
          
          {/* Construction zone */}
          <Rect
            x={100}
            y={80}
            width={400}
            height={220}
            fill="#FFF8DC"
            stroke="#DEB887"
            strokeWidth={3}
            cornerRadius={10}
          />
          
          {/* Construction crane decoration */}
          <Line points={[80, 320, 80, 60]} stroke="#FFA500" strokeWidth={8} />
          <Line points={[80, 70, 200, 70]} stroke="#FFA500" strokeWidth={6} />
          <Line points={[180, 70, 180, 100]} stroke="#333" strokeWidth={2} />
          
          {/* Building title */}
          <Rect
            x={200}
            y={90}
            width={200}
            height={35}
            fill="#4A90D9"
            cornerRadius={8}
          />
          <Text
            x={200}
            y={100}
            width={200}
            text={`🏛️ ${buildingName}`}
            fontSize={16}
            fill="#FFFFFF"
            align="center"
            fontStyle="bold"
          />

          {/* Building slots (where blocks go) */}
          {slots.map((slot) => {
            const isFilled = filledSlots.has(slot.id);
            const isTarget = selectedBlockId !== null && 
              blocks.find(b => b.id === selectedBlockId)?.shape === slot.requiredShape &&
              !isFilled;
            
            return (
              <Group key={slot.id}>
                <SlotOutline
                  shape={slot.requiredShape}
                  x={slot.x}
                  y={slot.y}
                  width={slot.width}
                  height={slot.height}
                  filled={isFilled}
                  isTarget={isTarget}
                  onClick={() => handleSlotClick(slot.id)}
                />
                
                {/* Shape label */}
                {!isFilled && (
                  <Text
                    x={slot.x - 25}
                    y={slot.y + slot.height / 2 + 15}
                    width={50}
                    text={slot.requiredShape}
                    fontSize={9}
                    fill="#666"
                    align="center"
                  />
                )}
              </Group>
            );
          })}

          {/* Block palette area */}
          <Rect
            x={30}
            y={CANVAS_HEIGHT - 100}
            width={CANVAS_WIDTH - 60}
            height={90}
            fill="#E8E8E8"
            stroke="#CCC"
            strokeWidth={2}
            cornerRadius={10}
          />
          
          <Text
            x={30}
            y={CANVAS_HEIGHT - 95}
            width={CANVAS_WIDTH - 60}
            text="🧱 Available Blocks - Tap to select, then tap a matching slot"
            fontSize={12}
            fill="#666"
            align="center"
          />

          {/* Available blocks */}
          {blocks.map((block, index) => {
            if (placedBlocks.has(block.id)) return null;
            
            const blockX = 80 + (index % 6) * 90;
            const blockY = CANVAS_HEIGHT - 50;
            const isSelected = selectedBlockId === block.id;
            
            return (
              <ShapeBlock
                key={block.id}
                shape={block.shape}
                x={blockX}
                y={blockY}
                width={block.width}
                height={block.height}
                color={block.color}
                selected={isSelected}
                placed={placedBlocks.has(block.id)}
                onClick={() => handleBlockClick(block.id)}
              />
            );
          })}

          {/* Completion overlay */}
          {isComplete && (
            <Group>
              <Rect
                x={150}
                y={150}
                width={300}
                height={120}
                fill="#90EE90"
                stroke="#228B22"
                strokeWidth={4}
                cornerRadius={20}
                shadowBlur={20}
                shadowColor="#000"
                shadowOpacity={0.3}
              />
              <Text
                x={150}
                y={175}
                width={300}
                text="🎉 Building Complete!"
                fontSize={24}
                fill="#155724"
                align="center"
                fontStyle="bold"
              />
              <Text
                x={150}
                y={210}
                width={300}
                text={`+${score} points!`}
                fontSize={20}
                fill="#155724"
                align="center"
              />
            </Group>
          )}
        </Layer>
      </Stage>

      {/* Selection indicator */}
      {selectedBlockId && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-100 border-2 border-yellow-400 rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm font-medium text-yellow-800">
            ✨ Block selected! Tap a matching outline to place it.
          </p>
        </div>
      )}
    </div>
  );
}
