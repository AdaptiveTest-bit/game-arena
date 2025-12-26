'use client';

import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Circle, Rect, Arc, Text, Line } from 'react-konva';
import Konva from 'konva';
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
  const stageRef = useRef<Konva.Stage>(null);
  const bridgeRef = useRef<Konva.Rect>(null);
  const handleRef = useRef<Konva.Circle>(null);
  const isDraggingRef = useRef(false);

  const {
    currentAngle,
    targetAngle,
    showTarget,
    gameCompleted,
    bridgeLength,
    tolerance,
    getAngleClassificationColor,
  } = useAngleArchitectStore();

  const centerX = width / 2;
  const centerY = height / 2;
  const handleDistance = bridgeLength + 20; // Distance of handle from center

  // Handle mouse move for rotation
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleMouseMove = (e: any) => {
      if (!isDraggingRef.current) return;

      const pos = stage.getPointerPosition();
      if (!pos) return;

      // Calculate angle from center
      const dx = pos.x - centerX;
      const dy = pos.y - centerY;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      // Normalize to 0-360
      angle = ((angle % 360) + 360) % 360;

      onRotate(angle);
    };

    stage.on('mousemove', handleMouseMove);

    return () => {
      stage.off('mousemove', handleMouseMove);
    };
  }, [centerX, centerY, onRotate]);

  // Handle mouse up globally
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        onDragEnd();
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [onDragEnd]);

  // Calculate handle position
  const handleX = centerX + handleDistance * Math.cos((currentAngle * Math.PI) / 180);
  const handleY = centerY + handleDistance * Math.sin((currentAngle * Math.PI) / 180);

  // Calculate target handle position (for visual guide)
  const targetHandleX =
    centerX + handleDistance * Math.cos((targetAngle * Math.PI) / 180);
  const targetHandleY =
    centerY + handleDistance * Math.sin((targetAngle * Math.PI) / 180);

  const colorByAngle = getAngleClassificationColor();

  return (
    <Stage ref={stageRef} width={width} height={height} className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg">
      <Layer>
        {/* Dashed circle path */}
        <Circle
          x={centerX}
          y={centerY}
          radius={handleDistance}
          stroke="#CCCCCC"
          strokeWidth={1}
          dash={[5, 5]}
        />

        {/* Target platform (visible only in direct mode) */}
        {showTarget && (
          <>
            {/* Target landing zone */}
            <Circle
              x={targetHandleX}
              y={targetHandleY}
              radius={16}
              fill="#10B981"
              opacity={0.3}
            />
            <Circle
              x={targetHandleX}
              y={targetHandleY}
              radius={16}
              stroke="#10B981"
              strokeWidth={2}
            />
          </>
        )}

        {/* Dynamic Arc (angle visualization) */}
        <Arc
          x={centerX}
          y={centerY}
          innerRadius={60}
          outerRadius={100}
          angle={Math.abs(currentAngle)}
          rotation={0}
          fill={colorByAngle}
          opacity={0.2}
        />

        {/* Dashed line showing current angle */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + 120 * Math.cos((currentAngle * Math.PI) / 180),
            centerY + 120 * Math.sin((currentAngle * Math.PI) / 180),
          ]}
          stroke={colorByAngle}
          strokeWidth={2}
          dash={[3, 3]}
        />

        {/* Target dashed line (faint, always visible) */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + 120 * Math.cos((targetAngle * Math.PI) / 180),
            centerY + 120 * Math.sin((targetAngle * Math.PI) / 180),
          ]}
          stroke="#999999"
          strokeWidth={1}
          dash={[5, 5]}
          opacity={0.3}
        />

        {/* The Pivot (center hub) */}
        <Circle
          x={centerX}
          y={centerY}
          radius={18}
          fill="#1F2937"
          stroke="#111827"
          strokeWidth={2}
        />

        {/* Inner circle on pivot */}
        <Circle
          x={centerX}
          y={centerY}
          radius={10}
          fill="#60A5FA"
        />

        {/* The Bridge (rotatable arm) */}
        <Rect
          ref={bridgeRef}
          x={centerX}
          y={centerY - 12}
          width={bridgeLength}
          height={24}
          fill={gameCompleted ? '#10B981' : '#3B82F6'}
          stroke={gameCompleted ? '#059669' : '#1D4ED8'}
          strokeWidth={2}
          rotation={currentAngle}
          transformOrigin={{ x: 0, y: '50%' }}
        />

        {/* Bridge texture lines */}
        <Line
          points={[
            centerX + 10,
            centerY - 12,
            centerX + 10,
            centerY + 12,
          ]}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={1}
          rotation={currentAngle}
          transformOrigin={{ x: centerX, y: centerY }}
        />
        <Line
          points={[
            centerX + 50,
            centerY - 12,
            centerX + 50,
            centerY + 12,
          ]}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={1}
          rotation={currentAngle}
          transformOrigin={{ x: centerX, y: centerY }}
        />
        <Line
          points={[
            centerX + 90,
            centerY - 12,
            centerX + 90,
            centerY + 12,
          ]}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={1}
          rotation={currentAngle}
          transformOrigin={{ x: centerX, y: centerY }}
        />
        <Line
          points={[
            centerX + 130,
            centerY - 12,
            centerX + 130,
            centerY + 12,
          ]}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={1}
          rotation={currentAngle}
          transformOrigin={{ x: centerX, y: centerY }}
        />

        {/* Handle (draggable point) */}
        <Circle
          ref={handleRef}
          x={handleX}
          y={handleY}
          radius={14}
          fill="#FBBF24"
          stroke="#F59E0B"
          strokeWidth={2}
          cursor="grab"
          onMouseDown={() => {
            isDraggingRef.current = true;
            onDragStart();
          }}
        />

        {/* Angle label */}
        <Text
          x={centerX - 40}
          y={centerY - 60}
          text={`${currentAngle}°`}
          fontSize={28}
          fontFamily="Arial"
          fontStyle="bold"
          fill={colorByAngle}
        />

        {/* Angle type label */}
        <Text
          x={centerX - 40}
          y={centerY - 25}
          text={
            currentAngle < 90 ? 'Acute' :
            currentAngle === 90 ? 'Right' :
            currentAngle > 90 && currentAngle < 180 ? 'Obtuse' :
            'Reflex'
          }
          fontSize={14}
          fontFamily="Arial"
          fontStyle="bold"
          fill={colorByAngle}
        />

        {/* Tolerance indicator */}
        {!gameCompleted && (
          <Text
            x={centerX - 60}
            y={height - 40}
            text={`Target: ${targetAngle}° | Tolerance: ±${tolerance}°`}
            fontSize={12}
            fontFamily="Arial"
            fill="#4B5563"
          />
        )}

        {/* Success indicator */}
        {gameCompleted && (
          <Text
            x={centerX - 80}
            y={height - 40}
            text="✓ Bridge Locked! Citizens Crossing..."
            fontSize={14}
            fontFamily="Arial"
            fontStyle="bold"
            fill="#10B981"
          />
        )}
      </Layer>
    </Stage>
  );
};

export default AngleArchitectCanvas;
