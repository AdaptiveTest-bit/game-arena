'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Group, Rect, Text, Line, Circle } from 'react-konva';
import { usePatternParadeStore } from '@/app/store/usePatternParadeStore';
import { PatternItem, TrainCar } from '@/app/utils/patternUtils';

interface PatternParadeCanvasProps {
  width: number;
  height: number;
}

// ============== LAYOUT CONSTANTS ==============

const LAYOUT = {
  CAR_WIDTH: 80,
  CAR_HEIGHT: 90,
  CAR_GAP: 10,
  CAR_Y: 180,
  
  ITEM_SIZE: 45,
  
  TRACK_Y: 280,
  TRACK_HEIGHT: 20,
  
  OPTIONS_Y: 380,
  OPTION_SIZE: 60,
  OPTION_GAP: 15,
  
  POT_WIDTH: 100,
  POT_HEIGHT: 70,
  POT_Y: 200,
  FLOWER_SIZE: 25,
};

// ============== TRAIN CAR COMPONENT ==============

interface TrainCarComponentProps {
  car: TrainCar;
  x: number;
  y: number;
  isDropTarget: boolean;
  onDrop?: (item: PatternItem) => void;
  onClick?: () => void;
  showMirrorHighlight?: boolean;
}

const TrainCarComponent: React.FC<TrainCarComponentProps> = ({ 
  car, 
  x, 
  y, 
  isDropTarget,
  onClick,
  showMirrorHighlight,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const carColor = car.isEmpty 
    ? (showMirrorHighlight ? '#BFDBFE' : '#E5E7EB')
    : '#8B5CF6';
  const strokeColor = car.isMissing 
    ? '#EF4444' 
    : (showMirrorHighlight ? '#3B82F6' : '#6D28D9');
  
  const scale = isHovered && isDropTarget ? 1.05 : 1;

  return (
    <Group 
      x={x} 
      y={y}
      scaleX={scale}
      scaleY={scale}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      onTap={onClick}
    >
      {/* Car body */}
      <Rect
        width={LAYOUT.CAR_WIDTH}
        height={LAYOUT.CAR_HEIGHT}
        fill={carColor}
        stroke={strokeColor}
        strokeWidth={car.isMissing ? 3 : 2}
        cornerRadius={10}
        shadowColor="#000"
        shadowBlur={isHovered && isDropTarget ? 12 : 5}
        shadowOpacity={0.2}
        shadowOffsetY={3}
      />
      
      {/* Connector hook on left */}
      <Rect
        x={-8}
        y={LAYOUT.CAR_HEIGHT / 2 - 5}
        width={10}
        height={10}
        fill="#A78BFA"
        cornerRadius={2}
      />
      
      {/* Connector hook on right */}
      <Rect
        x={LAYOUT.CAR_WIDTH - 2}
        y={LAYOUT.CAR_HEIGHT / 2 - 5}
        width={10}
        height={10}
        fill="#A78BFA"
        cornerRadius={2}
      />
      
      {/* Wheels */}
      <Circle x={20} y={LAYOUT.CAR_HEIGHT + 8} radius={12} fill="#374151" />
      <Circle x={20} y={LAYOUT.CAR_HEIGHT + 8} radius={6} fill="#6B7280" />
      <Circle x={60} y={LAYOUT.CAR_HEIGHT + 8} radius={12} fill="#374151" />
      <Circle x={60} y={LAYOUT.CAR_HEIGHT + 8} radius={6} fill="#6B7280" />
      
      {/* Item or question mark */}
      {car.item ? (
        <Text
          text={car.item.emoji}
          fontSize={LAYOUT.ITEM_SIZE}
          x={(LAYOUT.CAR_WIDTH - LAYOUT.ITEM_SIZE) / 2}
          y={(LAYOUT.CAR_HEIGHT - LAYOUT.ITEM_SIZE) / 2}
          listening={false}
        />
      ) : (
        <Text
          text="?"
          fontSize={40}
          fontStyle="bold"
          fill="#9CA3AF"
          x={(LAYOUT.CAR_WIDTH - 25) / 2}
          y={(LAYOUT.CAR_HEIGHT - 45) / 2}
          listening={false}
        />
      )}
      
      {/* Car number */}
      <Text
        text={String(car.position + 1)}
        fontSize={12}
        fontStyle="bold"
        fill={car.isEmpty ? '#6B7280' : '#FFF'}
        x={LAYOUT.CAR_WIDTH - 18}
        y={5}
        listening={false}
      />
    </Group>
  );
};

// ============== DRAGGABLE OPTION COMPONENT ==============

interface DraggableOptionProps {
  item: PatternItem;
  x: number;
  y: number;
  onDragEnd: (item: PatternItem, x: number, y: number) => void;
  onClick: (item: PatternItem) => void;
  isSelected?: boolean;
}

const DraggableOption: React.FC<DraggableOptionProps> = ({ 
  item, 
  x, 
  y, 
  onDragEnd,
  onClick,
  isSelected,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const groupRef = useRef<any>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  
  const scale = isDragging ? 1.2 : (isSelected ? 1.15 : 1);

  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      scaleX={scale}
      scaleY={scale}
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        // Store initial position to detect if it was just a click
        dragStartPos.current = { x: e.target.x(), y: e.target.y() };
      }}
      onDragEnd={() => {
        setIsDragging(false);
        if (groupRef.current) {
          // Get absolute position of the group on stage
          const absPos = groupRef.current.getAbsolutePosition();
          
          // Check if it was actually dragged (moved more than 10 pixels)
          const currentPos = groupRef.current.position();
          const dragDistance = Math.sqrt(
            Math.pow(currentPos.x - x, 2) + Math.pow(currentPos.y - y, 2)
          );
          
          if (dragDistance > 10) {
            onDragEnd(item, absPos.x, absPos.y);
          }
          
          // Reset position after drop
          groupRef.current.position({ x, y });
        }
      }}
      onClick={() => onClick(item)}
      onTap={() => onClick(item)}
    >
      <Rect
        width={LAYOUT.OPTION_SIZE}
        height={LAYOUT.OPTION_SIZE}
        fill={isSelected ? '#FDE68A' : '#FFF'}
        stroke={isSelected ? '#F59E0B' : '#D1D5DB'}
        strokeWidth={isSelected ? 4 : 2}
        cornerRadius={12}
        shadowColor={isSelected ? '#F59E0B' : '#000'}
        shadowBlur={isSelected ? 12 : (isDragging ? 15 : 5)}
        shadowOpacity={isSelected ? 0.4 : 0.2}
        shadowOffsetY={isDragging ? 8 : 3}
      />
      <Text
        text={item.emoji}
        fontSize={38}
        x={11}
        y={11}
        listening={false}
      />
    </Group>
  );
};

// ============== GARDEN POT COMPONENT ==============

interface GardenPotProps {
  count: number;
  x: number;
  y: number;
  isTarget: boolean;
  potNumber: number;
}

const GardenPot: React.FC<GardenPotProps> = ({ count, x, y, isTarget, potNumber }) => {
  const flowers: React.ReactNode[] = [];
  
  // Arrange flowers in a nice pattern
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    flowers.push(
      <Text
        key={i}
        text="🌸"
        fontSize={LAYOUT.FLOWER_SIZE}
        x={15 + col * 28}
        y={-30 - row * 25}
      />
    );
  }
  
  return (
    <Group x={x} y={y}>
      {/* Stem */}
      {!isTarget && count > 0 && (
        <Line
          points={[50, 0, 50, -20]}
          stroke="#22C55E"
          strokeWidth={3}
        />
      )}
      
      {/* Flowers */}
      {!isTarget && flowers}
      
      {/* Question mark for target pot */}
      {isTarget && (
        <Text
          text="❓"
          fontSize={40}
          x={30}
          y={-50}
        />
      )}
      
      {/* Pot */}
      <Rect
        x={10}
        y={0}
        width={LAYOUT.POT_WIDTH - 20}
        height={LAYOUT.POT_HEIGHT}
        fill="#92400E"
        cornerRadius={[0, 0, 15, 15]}
      />
      
      {/* Pot rim */}
      <Rect
        x={5}
        y={-5}
        width={LAYOUT.POT_WIDTH - 10}
        height={15}
        fill="#A16207"
        cornerRadius={5}
      />
      
      {/* Count label */}
      {!isTarget && (
        <Text
          text={String(count)}
          fontSize={22}
          fontStyle="bold"
          fill="#FFF"
          x={40}
          y={25}
        />
      )}
      
      {/* Pot number */}
      <Text
        text={`Pot ${potNumber}`}
        fontSize={14}
        fill="#78350F"
        x={25}
        y={LAYOUT.POT_HEIGHT + 5}
      />
    </Group>
  );
};

// ============== MIRROR LINE COMPONENT ==============

const MirrorLine: React.FC<{ x: number; height: number }> = ({ x, height }) => (
  <Group>
    <Line
      points={[x, 120, x, height - 120]}
      stroke="#06B6D4"
      strokeWidth={4}
      dash={[15, 10]}
    />
    <Rect
      x={x - 45}
      y={85}
      width={90}
      height={28}
      fill="#CFFAFE"
      cornerRadius={14}
    />
    <Text
      text="🪞 MIRROR"
      x={x - 40}
      y={90}
      fontSize={14}
      fontStyle="bold"
      fill="#0891B2"
    />
  </Group>
);

// ============== MAIN CANVAS ==============

const PatternParadeCanvas: React.FC<PatternParadeCanvasProps> = ({ width, height }) => {
  const stageRef = useRef<any>(null);
  const [selectedItem, setSelectedItem] = useState<PatternItem | null>(null);
  const {
    currentMode,
    roundConfig,
    placeItem,
    removeItem,
    isRoundComplete,
    showFeedback,
    isCorrect,
  } = usePatternParadeStore();

  if (!roundConfig) return null;

  // Calculate train starting X to center all cars
  const totalTrainWidth = roundConfig.trainCars.length * (LAYOUT.CAR_WIDTH + LAYOUT.CAR_GAP);
  const trainStartX = Math.max(100, (width - totalTrainWidth) / 2);

  // Calculate options starting X to center
  const totalOptionsWidth = roundConfig.options.length * (LAYOUT.OPTION_SIZE + LAYOUT.OPTION_GAP);
  const optionsStartX = (width - totalOptionsWidth) / 2;

  const handleOptionDrop = (item: PatternItem, dropX: number, dropY: number) => {
    // Find which car the item was dropped on
    // The dropX, dropY are now absolute positions on the stage
    for (let idx = 0; idx < roundConfig.trainCars.length; idx++) {
      const car = roundConfig.trainCars[idx];
      const carX = trainStartX + idx * (LAYOUT.CAR_WIDTH + LAYOUT.CAR_GAP);
      const carY = LAYOUT.CAR_Y;
      
      // Check if drop is within car bounds (with generous tolerance)
      const isWithinX = dropX >= carX - 40 && dropX <= carX + LAYOUT.CAR_WIDTH + 40;
      const isWithinY = dropY >= carY - 40 && dropY <= carY + LAYOUT.CAR_HEIGHT + 40;
      const canDrop = (car.isEmpty || car.isMissing) && !car.isLocked;
      
      if (isWithinX && isWithinY && canDrop) {
        placeItem(item, idx);
        setSelectedItem(null); // Clear selection after placing
        break; // Only place in one car
      }
    }
  };

  // Handle clicking on an option to select it
  const handleOptionClick = (item: PatternItem) => {
    setSelectedItem(selectedItem?.id === item.id ? null : item);
  };

  // Handle clicking on a car - either to place selected item or remove existing item
  const handleCarClick = (carIndex: number) => {
    const car = roundConfig.trainCars[carIndex];
    
    // If there's a selected item and the car is empty, place it
    if (selectedItem && (car.isEmpty || car.isMissing) && !car.isLocked) {
      placeItem(selectedItem, carIndex);
      setSelectedItem(null);
      return;
    }
    
    // If car has an item and is not locked, remove it
    if (car && !car.isLocked && car.item) {
      removeItem(carIndex);
    }
  };

  // Determine if this is mirror mode to show the mirror line
  const isMirrorMode = currentMode === 'mirror-match';
  const mirrorLineX = isMirrorMode ? trainStartX + (totalTrainWidth / 2) - (LAYOUT.CAR_GAP / 2) : 0;
  const leftSideLength = Math.floor(roundConfig.trainCars.length / 2);

  // Growing garden mode rendering
  if (currentMode === 'growing-garden') {
    const sequence = roundConfig.growthSequence || [1, 2, 3, 4];
    const potCount = sequence.length;
    const potSpacing = 140;
    const potsStartX = (width - (potCount * potSpacing)) / 2;
    
    return (
      <Stage width={width} height={height} ref={stageRef}>
        <Layer>
          {/* Sky background */}
          <Rect width={width} height={height} fill="#E0F2FE" />
          
          {/* Sun */}
          <Text text="🌞" fontSize={60} x={width - 90} y={20} />
          
          {/* Clouds */}
          <Text text="☁️" fontSize={50} x={50} y={30} opacity={0.7} />
          <Text text="☁️" fontSize={35} x={180} y={50} opacity={0.5} />
          
          {/* Ground */}
          <Rect
            x={0}
            y={height - 80}
            width={width}
            height={80}
            fill="#86EFAC"
          />
          
          {/* Grass texture */}
          {Array(20).fill(0).map((_, i) => (
            <Text
              key={i}
              text="🌿"
              fontSize={20}
              x={i * 45}
              y={height - 75}
              opacity={0.6}
            />
          ))}
          
          {/* Garden pots */}
          {sequence.map((count, idx) => (
            <GardenPot
              key={idx}
              count={count}
              x={potsStartX + idx * potSpacing}
              y={LAYOUT.POT_Y + 50}
              isTarget={idx === sequence.length - 1}
              potNumber={idx + 1}
            />
          ))}
          
          {/* Arrow showing progression */}
          <Group y={LAYOUT.POT_Y + 130}>
            {sequence.slice(0, -1).map((_, idx) => (
              <Text
                key={idx}
                text="➡️"
                fontSize={30}
                x={potsStartX + idx * potSpacing + 100}
                y={0}
              />
            ))}
          </Group>
          
          {/* Title */}
          <Rect
            x={width / 2 - 120}
            y={15}
            width={240}
            height={40}
            fill="#FEF9C3"
            cornerRadius={20}
            stroke="#F59E0B"
            strokeWidth={2}
          />
          <Text
            text="🌱 Count the Growing Pattern!"
            fontSize={16}
            fontStyle="bold"
            fill="#78350F"
            x={width / 2 - 110}
            y={27}
          />
        </Layer>
      </Stage>
    );
  }

  return (
    <Stage width={width} height={height} ref={stageRef}>
      <Layer>
        {/* Sky background */}
        <Rect width={width} height={height} fill="#E0F2FE" />
        
        {/* Clouds */}
        <Text text="☁️" fontSize={55} x={40} y={25} opacity={0.7} />
        <Text text="☁️" fontSize={35} x={180} y={55} opacity={0.5} />
        <Text text="☁️" fontSize={45} x={width - 150} y={35} opacity={0.6} />
        
        {/* Sun */}
        <Text text="🌞" fontSize={65} x={width - 100} y={15} />
        
        {/* Mountains in background */}
        <Line
          points={[0, 150, 100, 80, 200, 140, 300, 60, 400, 120, 500, 70, 600, 130, 700, 90, 800, 145, 900, 100, 1000, 150]}
          closed
          fill="#C4B5FD"
          opacity={0.5}
        />
        
        {/* Train Track */}
        <Rect
          x={0}
          y={LAYOUT.TRACK_Y}
          width={width}
          height={LAYOUT.TRACK_HEIGHT}
          fill="#78716C"
        />
        {/* Track rails */}
        <Line
          points={[0, LAYOUT.TRACK_Y + 3, width, LAYOUT.TRACK_Y + 3]}
          stroke="#A8A29E"
          strokeWidth={2}
        />
        <Line
          points={[0, LAYOUT.TRACK_Y + 17, width, LAYOUT.TRACK_Y + 17]}
          stroke="#A8A29E"
          strokeWidth={2}
        />
        {/* Track ties */}
        {Array(Math.floor(width / 35)).fill(0).map((_, i) => (
          <Rect
            key={i}
            x={i * 35 + 5}
            y={LAYOUT.TRACK_Y + LAYOUT.TRACK_HEIGHT}
            width={25}
            height={8}
            fill="#57534E"
          />
        ))}
        
        {/* Grass below track */}
        <Rect
          x={0}
          y={LAYOUT.TRACK_Y + LAYOUT.TRACK_HEIGHT + 8}
          width={width}
          height={40}
          fill="#86EFAC"
        />
        
        {/* Train Engine */}
        <Group x={trainStartX - 110} y={LAYOUT.CAR_Y - 25}>
          <Text text="🚂" fontSize={85} />
          <Text 
            text="Pattern Express" 
            fontSize={12} 
            fontStyle="bold"
            fill="#7C3AED"
            x={10}
            y={95}
          />
        </Group>
        
        {/* Mirror Line (for mirror mode) */}
        {isMirrorMode && (
          <MirrorLine x={mirrorLineX} height={height} />
        )}
        
        {/* Train Cars */}
        {roundConfig.trainCars.map((car, idx) => (
          <TrainCarComponent
            key={car.id}
            car={car}
            x={trainStartX + idx * (LAYOUT.CAR_WIDTH + LAYOUT.CAR_GAP)}
            y={LAYOUT.CAR_Y}
            isDropTarget={(car.isEmpty || car.isMissing) && !car.isLocked}
            onClick={() => handleCarClick(idx)}
            showMirrorHighlight={isMirrorMode && idx >= leftSideLength && (car.isEmpty || car.isMissing)}
          />
        ))}
        
        {/* Options Palette (only for modes that need it - excludes spot-pattern which uses buttons) */}
        {roundConfig.options.length > 0 && currentMode !== 'spot-pattern' && (
          <Group y={LAYOUT.OPTIONS_Y}>
            {/* Palette background */}
            <Rect
              x={optionsStartX - 25}
              y={-15}
              width={totalOptionsWidth + 50}
              height={LAYOUT.OPTION_SIZE + 40}
              fill="#FEF9C3"
              stroke="#EAB308"
              strokeWidth={2}
              cornerRadius={20}
              shadowColor="#000"
              shadowBlur={10}
              shadowOpacity={0.1}
              shadowOffsetY={4}
            />
            
            {/* Label */}
            <Text
              text="✨ Click or drag items to the train cars!"
              fontSize={14}
              fontStyle="bold"
              fill="#78350F"
              x={optionsStartX - 40}
              y={-35}
            />
            
            {/* Draggable options - click or drag to place */}
            {roundConfig.options.map((item, idx) => (
              <DraggableOption
                key={item.id}
                item={item}
                x={optionsStartX + idx * (LAYOUT.OPTION_SIZE + LAYOUT.OPTION_GAP)}
                y={5}
                onDragEnd={handleOptionDrop}
                onClick={handleOptionClick}
                isSelected={selectedItem?.id === item.id}
              />
            ))}
          </Group>
        )}
        
        {/* Mode Title Badge */}
        <Rect
          x={width / 2 - 100}
          y={10}
          width={200}
          height={35}
          fill="#8B5CF6"
          cornerRadius={18}
          shadowColor="#000"
          shadowBlur={8}
          shadowOpacity={0.2}
        />
        <Text
          text={
            currentMode === 'spot-pattern' ? '🔍 Find the Pattern' :
            currentMode === 'what-next' ? '🔮 What Comes Next?' :
            currentMode === 'find-missing' ? '🧩 Find the Missing' :
            currentMode === 'build-pattern' ? '🎨 Build Your Pattern' :
            currentMode === 'mirror-match' ? '🪞 Mirror Match' : ''
          }
          fontSize={14}
          fontStyle="bold"
          fill="#FFF"
          x={width / 2 - 85}
          y={20}
        />
        
        {/* Feedback overlay */}
        {showFeedback && (
          <Group>
            <Rect
              width={width}
              height={height}
              fill={isCorrect ? '#22C55E' : '#EF4444'}
              opacity={0.2}
            />
          </Group>
        )}
      </Layer>
    </Stage>
  );
};

export default PatternParadeCanvas;
