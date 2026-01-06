'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text, Line, Circle, Group, Arc } from 'react-konva';
import { useMeasureIslandStore, MeasurableObject } from '../../store/useMeasureIslandStore';

interface MeasureIslandCanvasProps {
  width: number;
  height: number;
}

// ─────────────────────────────────────────────────────────────
// SEESAW COMPONENT
// ─────────────────────────────────────────────────────────────

interface SeesawProps {
  x: number;
  y: number;
  width: number;
  tilt: number; // -1 to 1
  leftObject: MeasurableObject | null;
  rightObject: MeasurableObject | null;
  onLeftClick: () => void;
  onRightClick: () => void;
  selectedId: string | null;
  showResult: boolean;
}

const Seesaw: React.FC<SeesawProps> = ({
  x, y, width, tilt, leftObject, rightObject,
  onLeftClick, onRightClick, selectedId, showResult
}) => {
  const beamHeight = 16;
  const beamLength = width * 0.8;
  const pivotHeight = 60;
  const pivotWidth = 40;
  const maxTiltAngle = 15; // degrees
  
  // Animate tilt
  const [currentTilt, setCurrentTilt] = useState(0);
  
  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => {
        setCurrentTilt(tilt);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setCurrentTilt(0);
    }
  }, [tilt, showResult]);
  
  const rotation = currentTilt * maxTiltAngle;
  
  // Platform positions (at ends of beam)
  const leftPlatformOffset = { x: -beamLength / 2 + 40, y: -30 };
  const rightPlatformOffset = { x: beamLength / 2 - 40, y: -30 };
  
  // Adjust platform Y based on tilt
  const leftY = leftPlatformOffset.y - (currentTilt * 30);
  const rightY = rightPlatformOffset.y + (currentTilt * 30);
  
  return (
    <Group x={x} y={y}>
      {/* Pivot/Fulcrum - Triangle */}
      <Line
        points={[0, 0, -pivotWidth / 2, pivotHeight, pivotWidth / 2, pivotHeight]}
        closed
        fill="#8B4513"
        stroke="#5D3A1A"
        strokeWidth={3}
      />
      
      {/* Beam */}
      <Group rotation={rotation}>
        <Rect
          x={-beamLength / 2}
          y={-beamHeight / 2}
          width={beamLength}
          height={beamHeight}
          fill="#DEB887"
          stroke="#8B4513"
          strokeWidth={3}
          cornerRadius={4}
        />
        
        {/* Left Platform */}
        <Group 
          x={leftPlatformOffset.x} 
          y={leftY}
          onClick={onLeftClick}
          onTap={onLeftClick}
        >
          <Rect
            x={-50}
            y={-10}
            width={100}
            height={20}
            fill={selectedId === leftObject?.id ? '#4ADE80' : '#FFD700'}
            stroke={selectedId === leftObject?.id ? '#16A34A' : '#B8860B'}
            strokeWidth={3}
            cornerRadius={4}
            shadowColor="black"
            shadowBlur={5}
            shadowOpacity={0.3}
          />
          {leftObject && (
            <>
              <Text
                x={-40}
                y={-60}
                text={leftObject.emoji}
                fontSize={48}
                align="center"
                width={80}
              />
              <Text
                x={-50}
                y={-5}
                text={leftObject.name}
                fontSize={12}
                fontStyle="bold"
                fill="#333"
                align="center"
                width={100}
              />
            </>
          )}
        </Group>
        
        {/* Right Platform */}
        <Group 
          x={rightPlatformOffset.x} 
          y={rightY}
          onClick={onRightClick}
          onTap={onRightClick}
        >
          <Rect
            x={-50}
            y={-10}
            width={100}
            height={20}
            fill={selectedId === rightObject?.id ? '#4ADE80' : '#FFD700'}
            stroke={selectedId === rightObject?.id ? '#16A34A' : '#B8860B'}
            strokeWidth={3}
            cornerRadius={4}
            shadowColor="black"
            shadowBlur={5}
            shadowOpacity={0.3}
          />
          {rightObject && (
            <>
              <Text
                x={-40}
                y={-60}
                text={rightObject.emoji}
                fontSize={48}
                align="center"
                width={80}
              />
              <Text
                x={-50}
                y={-5}
                text={rightObject.name}
                fontSize={12}
                fontStyle="bold"
                fill="#333"
                align="center"
                width={100}
              />
            </>
          )}
        </Group>
      </Group>
      
      {/* Ground line */}
      <Line
        points={[-width / 2, pivotHeight + 5, width / 2, pivotHeight + 5]}
        stroke="#228B22"
        strokeWidth={4}
      />
    </Group>
  );
};

// ─────────────────────────────────────────────────────────────
// MEASUREMENT RULER COMPONENT
// ─────────────────────────────────────────────────────────────

interface MeasurementRulerProps {
  x: number;
  y: number;
  object: MeasurableObject;
  count: number;
  unit: string;
  onIncrement: () => void;
  onDecrement: () => void;
}

const MeasurementRuler: React.FC<MeasurementRulerProps> = ({
  x, y, object, count, unit, onIncrement, onDecrement
}) => {
  const unitWidth = 50;
  const rulerWidth = count * unitWidth;
  const rulerHeight = 30;
  
  // Unit emoji mapping
  const unitEmoji: Record<string, string> = {
    'handspans': '🖐️',
    'footsteps': '👣',
    'pencils': '✏️',
    'cubes': '🧊',
    'cups': '☕',
    'spoons': '🥄',
    'mugs': '🍵',
    'glasses': '🥛',
  };
  
  return (
    <Group x={x} y={y}>
      {/* Object being measured */}
      <Text
        x={0}
        y={-80}
        text={object.emoji}
        fontSize={64}
        align="center"
        width={rulerWidth}
      />
      <Text
        x={0}
        y={-10}
        text={object.name}
        fontSize={18}
        fontStyle="bold"
        fill="#333"
        align="center"
        width={rulerWidth}
      />
      
      {/* Ruler */}
      <Rect
        x={0}
        y={20}
        width={rulerWidth}
        height={rulerHeight}
        fill="#FFF8DC"
        stroke="#8B4513"
        strokeWidth={2}
      />
      
      {/* Unit divisions */}
      {Array.from({ length: count }).map((_, i) => (
        <Group key={i}>
          <Rect
            x={i * unitWidth}
            y={20}
            width={unitWidth}
            height={rulerHeight}
            fill={i % 2 === 0 ? '#FFE4B5' : '#FFF8DC'}
            stroke="#8B4513"
            strokeWidth={1}
          />
          <Text
            x={i * unitWidth}
            y={55}
            text={unitEmoji[unit] || '📏'}
            fontSize={24}
            align="center"
            width={unitWidth}
          />
        </Group>
      ))}
      
      {/* Count display */}
      <Group y={100}>
        {/* Decrement button */}
        <Group onClick={onDecrement} onTap={onDecrement}>
          <Circle
            x={rulerWidth / 2 - 80}
            y={20}
            radius={25}
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth={3}
            shadowColor="black"
            shadowBlur={5}
            shadowOpacity={0.3}
          />
          <Text
            x={rulerWidth / 2 - 92}
            y={8}
            text="−"
            fontSize={32}
            fontStyle="bold"
            fill="white"
            width={24}
            align="center"
          />
        </Group>
        
        {/* Count display */}
        <Rect
          x={rulerWidth / 2 - 40}
          y={-5}
          width={80}
          height={50}
          fill="white"
          stroke="#333"
          strokeWidth={2}
          cornerRadius={8}
        />
        <Text
          x={rulerWidth / 2 - 40}
          y={5}
          text={count.toString()}
          fontSize={32}
          fontStyle="bold"
          fill="#333"
          width={80}
          align="center"
        />
        
        {/* Increment button */}
        <Group onClick={onIncrement} onTap={onIncrement}>
          <Circle
            x={rulerWidth / 2 + 80}
            y={20}
            radius={25}
            fill="#22C55E"
            stroke="#16A34A"
            strokeWidth={3}
            shadowColor="black"
            shadowBlur={5}
            shadowOpacity={0.3}
          />
          <Text
            x={rulerWidth / 2 + 68}
            y={8}
            text="+"
            fontSize={32}
            fontStyle="bold"
            fill="white"
            width={24}
            align="center"
          />
        </Group>
      </Group>
      
      {/* Unit label */}
      <Text
        x={0}
        y={165}
        text={`${count} ${unit}`}
        fontSize={20}
        fontStyle="bold"
        fill="#666"
        align="center"
        width={rulerWidth}
      />
    </Group>
  );
};

// ─────────────────────────────────────────────────────────────
// ORDERING COMPONENT
// ─────────────────────────────────────────────────────────────

interface OrderingAreaProps {
  x: number;
  y: number;
  width: number;
  objects: MeasurableObject[];
  orderedIds: string[];
  onObjectClick: (id: string) => void;
  onRemove: (id: string) => void;
}

const OrderingArea: React.FC<OrderingAreaProps> = ({
  x, y, width, objects, orderedIds, onObjectClick, onRemove
}) => {
  const itemWidth = 100;
  const itemHeight = 100;
  const spacing = 20;
  
  // Objects not yet placed
  const unorderedObjects = objects.filter(o => !orderedIds.includes(o.id));
  
  return (
    <Group x={x} y={y}>
      {/* Available objects */}
      <Text
        x={0}
        y={0}
        text="Tap to add in order:"
        fontSize={18}
        fill="#333"
        fontStyle="bold"
      />
      
      <Group y={30}>
        {unorderedObjects.map((obj, i) => (
          <Group
            key={obj.id}
            x={i * (itemWidth + spacing)}
            onClick={() => onObjectClick(obj.id)}
            onTap={() => onObjectClick(obj.id)}
          >
            <Rect
              width={itemWidth}
              height={itemHeight}
              fill="#FEF3C7"
              stroke="#F59E0B"
              strokeWidth={3}
              cornerRadius={10}
              shadowColor="black"
              shadowBlur={5}
              shadowOpacity={0.2}
            />
            <Text
              x={0}
              y={15}
              text={obj.emoji}
              fontSize={40}
              align="center"
              width={itemWidth}
            />
            <Text
              x={0}
              y={65}
              text={obj.name}
              fontSize={14}
              fontStyle="bold"
              fill="#333"
              align="center"
              width={itemWidth}
            />
          </Group>
        ))}
      </Group>
      
      {/* Ordered slots */}
      <Text
        x={0}
        y={160}
        text="Your order (tap to remove):"
        fontSize={18}
        fill="#333"
        fontStyle="bold"
      />
      
      <Group y={190}>
        {objects.map((_, i) => {
          const placedId = orderedIds[i];
          const placedObj = objects.find(o => o.id === placedId);
          
          return (
            <Group 
              key={i} 
              x={i * (itemWidth + spacing)}
              onClick={() => placedObj && onRemove(placedObj.id)}
              onTap={() => placedObj && onRemove(placedObj.id)}
            >
              {/* Slot background */}
              <Rect
                width={itemWidth}
                height={itemHeight}
                fill={placedObj ? '#D1FAE5' : '#F3F4F6'}
                stroke={placedObj ? '#10B981' : '#9CA3AF'}
                strokeWidth={3}
                cornerRadius={10}
                dash={placedObj ? undefined : [5, 5]}
              />
              
              {/* Slot number */}
              <Circle
                x={itemWidth - 15}
                y={15}
                radius={12}
                fill="#6366F1"
              />
              <Text
                x={itemWidth - 22}
                y={8}
                text={(i + 1).toString()}
                fontSize={14}
                fontStyle="bold"
                fill="white"
              />
              
              {/* Placed object */}
              {placedObj ? (
                <>
                  <Text
                    x={0}
                    y={20}
                    text={placedObj.emoji}
                    fontSize={36}
                    align="center"
                    width={itemWidth}
                  />
                  <Text
                    x={0}
                    y={65}
                    text={placedObj.name}
                    fontSize={12}
                    fontStyle="bold"
                    fill="#333"
                    align="center"
                    width={itemWidth}
                  />
                </>
              ) : (
                <Text
                  x={0}
                  y={40}
                  text="?"
                  fontSize={32}
                  fill="#9CA3AF"
                  align="center"
                  width={itemWidth}
                />
              )}
            </Group>
          );
        })}
      </Group>
    </Group>
  );
};

// ─────────────────────────────────────────────────────────────
// HEIGHT COMPARISON COMPONENT
// ─────────────────────────────────────────────────────────────

interface HeightCompareProps {
  x: number;
  y: number;
  objects: MeasurableObject[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const HeightCompare: React.FC<HeightCompareProps> = ({
  x, y, objects, selectedId, onSelect
}) => {
  const baseWidth = 120;
  const maxHeight = 200;
  const spacing = 60;
  
  return (
    <Group x={x} y={y}>
      {objects.map((obj, i) => {
        const height = (obj.value / 10) * maxHeight + 60;
        const objX = i * (baseWidth + spacing);
        const isSelected = selectedId === obj.id;
        
        return (
          <Group 
            key={obj.id}
            x={objX}
            onClick={() => onSelect(obj.id)}
            onTap={() => onSelect(obj.id)}
          >
            {/* Object container */}
            <Rect
              x={0}
              y={maxHeight - height + 20}
              width={baseWidth}
              height={height}
              fill={isSelected ? '#BBF7D0' : '#FEF9C3'}
              stroke={isSelected ? '#22C55E' : '#EAB308'}
              strokeWidth={4}
              cornerRadius={10}
              shadowColor="black"
              shadowBlur={isSelected ? 10 : 5}
              shadowOpacity={0.3}
            />
            
            {/* Emoji */}
            <Text
              x={0}
              y={maxHeight - height + 40}
              text={obj.emoji}
              fontSize={56}
              align="center"
              width={baseWidth}
            />
            
            {/* Name label */}
            <Rect
              x={10}
              y={maxHeight + 30}
              width={baseWidth - 20}
              height={30}
              fill={isSelected ? '#22C55E' : '#6366F1'}
              cornerRadius={6}
            />
            <Text
              x={0}
              y={maxHeight + 35}
              text={obj.name}
              fontSize={14}
              fontStyle="bold"
              fill="white"
              align="center"
              width={baseWidth}
            />
          </Group>
        );
      })}
      
      {/* Ground line */}
      <Line
        points={[-20, maxHeight + 20, objects.length * (baseWidth + spacing), maxHeight + 20]}
        stroke="#228B22"
        strokeWidth={4}
      />
    </Group>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN CANVAS
// ─────────────────────────────────────────────────────────────

const MeasureIslandCanvas: React.FC<MeasureIslandCanvasProps> = ({ width, height }) => {
  const {
    currentQuestion,
    selectedAnswer,
    orderedAnswers,
    seesawTilt,
    showSeesawResult,
    measurementCount,
    selectAnswer,
    addToOrder,
    removeFromOrder,
    incrementMeasurement,
    decrementMeasurement,
  } = useMeasureIslandStore();
  
  if (!currentQuestion) {
    return null;
  }
  
  const { type, objects } = currentQuestion;
  
  // Render based on activity type
  const renderActivity = () => {
    switch (type) {
      case 'compare-weight':
      case 'compare-capacity': {
        // Use seesaw for weight/capacity
        return (
          <Seesaw
            x={width / 2}
            y={height / 2 + 40}
            width={width - 100}
            tilt={seesawTilt}
            leftObject={objects[0] || null}
            rightObject={objects[1] || null}
            onLeftClick={() => selectAnswer(objects[0]?.id)}
            onRightClick={() => selectAnswer(objects[1]?.id)}
            selectedId={selectedAnswer}
            showResult={showSeesawResult}
          />
        );
      }
      
      case 'compare-length':
      case 'compare-height': {
        // Use height comparison visual
        return (
          <HeightCompare
            x={(width - (objects.length * 180)) / 2}
            y={height / 2 - 100}
            objects={objects}
            selectedId={selectedAnswer}
            onSelect={selectAnswer}
          />
        );
      }
      
      case 'measure-length': {
        // Use measurement ruler
        const obj = objects[0];
        const unit = currentQuestion.unit || 'units';
        const rulerWidth = Math.max(300, measurementCount * 50);
        
        return (
          <MeasurementRuler
            x={(width - rulerWidth) / 2}
            y={height / 2 - 100}
            object={obj}
            count={measurementCount}
            unit={unit}
            onIncrement={incrementMeasurement}
            onDecrement={decrementMeasurement}
          />
        );
      }
      
      case 'order-length':
      case 'order-weight':
      case 'order-capacity': {
        // Use ordering area
        return (
          <OrderingArea
            x={(width - (objects.length * 120)) / 2}
            y={height / 2 - 150}
            width={width - 100}
            objects={objects}
            orderedIds={orderedAnswers}
            onObjectClick={addToOrder}
            onRemove={removeFromOrder}
          />
        );
      }
      
      default:
        return null;
    }
  };
  
  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#E0F2FE"
        />
        
        {/* Island ground */}
        <Arc
          x={width / 2}
          y={height}
          innerRadius={0}
          outerRadius={width / 1.5}
          angle={180}
          rotation={180}
          fill="#90EE90"
          stroke="#228B22"
          strokeWidth={4}
        />
        
        {/* Decorative palm trees */}
        <Text x={30} y={height - 120} text="🌴" fontSize={60} />
        <Text x={width - 80} y={height - 100} text="🌴" fontSize={50} />
        
        {/* Clouds */}
        <Text x={50} y={30} text="☁️" fontSize={40} />
        <Text x={width - 100} y={50} text="☁️" fontSize={35} />
        <Text x={width / 2 - 20} y={20} text="☁️" fontSize={30} />
        
        {/* Sun */}
        <Text x={width - 70} y={10} text="☀️" fontSize={50} />
        
        {/* Activity content */}
        {renderActivity()}
        
        {/* Milo the Monkey mascot */}
        <Group x={width - 100} y={height - 140}>
          <Text text="🐒" fontSize={50} />
        </Group>
      </Layer>
    </Stage>
  );
};

export default MeasureIslandCanvas;
