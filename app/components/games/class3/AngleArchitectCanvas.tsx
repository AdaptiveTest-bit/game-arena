'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line, Circle, Text, Rect, Group, RegularPolygon } from 'react-konva';
import { useAngleArchitectStore } from '@/app/store/useAngleArchitectStore';

interface AngleArchitectCanvasProps {
  width: number;
  height: number;
  onDragStart: () => void;
  onDragEnd: () => void;
  onRotate: (angle: number) => void;
}

const AngleArchitectCanvas: React.FC<AngleArchitectCanvasProps> = ({
  width,
  height,
  onDragStart,
  onDragEnd,
  onRotate,
}) => {
  const {
    targetAngle,
    currentAngle,
    isWithinTolerance,
    showTarget,
    currentLevel,
  } = useAngleArchitectStore();

  const [isDragging, setIsDragging] = useState(false);
  const [handlePos, setHandlePos] = useState({ x: 0, y: 0 });

  // Calculate bridge rotation based on current angle
  const bridgeRotation = currentAngle;

  // Calculate handle position based on angle
  useEffect(() => {
    const radius = 80;
    const radian = (currentAngle - 90) * (Math.PI / 180);
    setHandlePos({
      x: radius * Math.cos(radian),
      y: radius * Math.sin(radian),
    });
  }, [currentAngle]);

  const handleDragMove = (e: any) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    const centerX = width / 2;
    const centerY = height / 2 - 30;

    // Calculate angle from center to pointer
    const dx = pointerPosition.x - centerX;
    const dy = pointerPosition.y - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

    if (angle < 0) angle += 360;
    if (angle > 360) angle -= 360;

    onRotate(angle);
  };

  const handleDragStart = () => {
    setIsDragging(true);
    onDragStart();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  // Colors
  const bridgeColor = isWithinTolerance() ? '#22c55e' : '#3b82f6';
  const targetColor = showTarget ? '#ef4444' : 'transparent';

  return (
    <div className="bg-gradient-to-b from-sky-100 to-sky-200 rounded-lg overflow-hidden">
      <Stage width={width} height={height}>
        <Layer>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="#e0f2fe"
          />

          {/* Title */}
          <Text
            x={width / 2}
            y={15}
            text="🌉 The Angle Architect"
            fontSize={18}
            fontStyle="bold"
            fill="#1e40af"
            align="center"
          />

          {/* Center pivot point */}
          <Circle
            x={width / 2}
            y={height / 2 - 30}
            radius={12}
            fill="#1e40af"
            stroke="#1e3a8a"
            strokeWidth={2}
          />

          {/* Target indicator */}
          {showTarget && (
            <Group x={width / 2} y={height / 2 - 30}>
              {/* Target arc */}
              <RegularPolygon
                sides={3}
                radius={100}
                fill={targetColor}
                opacity={0.2}
                rotation={targetAngle - 90}
              />
              {/* Target line */}
              <Line
                points={[
                  0,
                  0,
                  100 * Math.cos((targetAngle - 90) * Math.PI / 180),
                  100 * Math.sin((targetAngle - 90) * Math.PI / 180),
                ]}
                stroke="#ef4444"
                strokeWidth={3}
                dash={[10, 5]}
              />
            </Group>
          )}

          {/* Bridge/Platform */}
          <Group x={width / 2} y={height / 2 - 30} rotation={bridgeRotation}>
            {/* Main bridge platform */}
            <Rect
              x={-120}
              y={-15}
              width={200}
              height={30}
              fill={bridgeColor}
              cornerRadius={5}
              shadowColor="black"
              shadowBlur={10}
              shadowOpacity={0.2}
              shadowOffsetX={5}
              shadowOffsetY={5}
            />
            {/* Bridge detail lines */}
            <Rect
              x={-110}
              y={-5}
              width={180}
              height={10}
              fill="rgba(255,255,255,0.3)"
              cornerRadius={2}
            />
          </Group>

          {/* Current angle indicator */}
          <Group x={width / 2} y={height / 2 - 30}>
            {/* Current angle arc */}
            <Line
              points={[
                0,
                0,
                60 * Math.cos((currentAngle - 90) * Math.PI / 180),
                60 * Math.sin((currentAngle - 90) * Math.PI / 180),
              ]}
              stroke={bridgeColor}
              strokeWidth={4}
              lineCap="round"
            />
          </Group>

          {/* Handle */}
          <Circle
            x={width / 2 + handlePos.x}
            y={height / 2 - 30 + handlePos.y}
            radius={20}
            fill={isDragging ? '#f59e0b' : '#fbbf24'}
            stroke="#d97706"
            strokeWidth={3}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragMove={handleDragMove}
            dragBoundFunc={(pos) => {
              const centerX = width / 2;
              const centerY = height / 2 - 30;
              const dx = pos.x - centerX;
              const dy = pos.y - centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const minDistance = 60;
              const maxDistance = 100;

              if (distance < minDistance) {
                return {
                  x: centerX + (dx / distance) * minDistance,
                  y: centerY + (dy / distance) * minDistance,
                };
              }
              if (distance > maxDistance) {
                return {
                  x: centerX + (dx / distance) * maxDistance,
                  y: centerY + (dy / distance) * maxDistance,
                };
              }
              return pos;
            }}
            shadowColor="black"
            shadowBlur={isDragging ? 15 : 5}
            shadowOpacity={0.3}
          />

          {/* Handle icon */}
          <Text
            x={width / 2 + handlePos.x - 10}
            y={height / 2 - 30 + handlePos.y - 10}
            text="🎯"
            fontSize={20}
          />

          {/* Angle labels */}
          <Group x={width / 2} y={height / 2 - 30}>
            {/* 0° marker */}
            <Circle x={0} y={-120} radius={5} fill="#6b7280" />
            <Text x={-10} y={-145} text="0°" fontSize={12} fill="#374151" />
            
            {/* 90° marker */}
            <Circle x={120} y={0} radius={5} fill="#6b7280" />
            <Text x={125} y={-5} text="90°" fontSize={12} fill="#374151" />
            
            {/* 180° marker */}
            <Circle x={0} y={120} radius={5} fill="#6b7280" />
            <Text x={-15} y={125} text="180°" fontSize={12} fill="#374151" />
            
            {/* 270° marker */}
            <Circle x={-120} y={0} radius={5} fill="#6b7280" />
            <Text x={-140} y={-5} text="270°" fontSize={12} fill="#374151" />
          </Group>

          {/* Target display */}
          {showTarget && (
            <Text
              x={width - 120}
              y={30}
              text={`Target: ${targetAngle}°`}
              fontSize={16}
              fontStyle="bold"
              fill="#ef4444"
            />
          )}

          {/* Status display */}
          <Text
            x={30}
            y={30}
            text={`Current: ${Math.round(currentAngle)}°`}
            fontSize={16}
            fontStyle="bold"
            fill={isWithinTolerance() ? '#22c55e' : '#3b82f6'}
          />

          {/* Instructions */}
          <Text
            x={width / 2}
            y={height - 25}
            text="Drag the 🎯 handle to rotate the bridge!"
            fontSize={14}
            fill="#475569"
            align="center"
          />

          {/* Decorative clouds */}
          <Circle x={80} y={80} radius={30} fill="white" opacity={0.8} />
          <Circle x={110} y={70} radius={25} fill="white" opacity={0.8} />
          <Circle x={60} y={75} radius={20} fill="white" opacity={0.8} />

          <Circle x={width - 80} y={100} radius={25} fill="white" opacity={0.8} />
          <Circle x={width - 50} y={90} radius={20} fill="white" opacity={0.8} />
        </Layer>
      </Stage>
    </div>
  );
};

export default AngleArchitectCanvas;

