'use client';

import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Circle, Line, Text, Group, Wedge } from 'react-konva';

interface TickTockCanvasProps {
  width: number;
  height: number;
  displayHour?: number;
  hourHandAngle?: number;
  onAngleChange?: (angle: number) => void;
  interactive?: boolean;
  showNumbers?: boolean;
}

const TickTockCanvas: React.FC<TickTockCanvasProps> = ({
  width,
  height,
  displayHour,
  hourHandAngle = 0,
  onAngleChange,
  interactive = false,
  showNumbers = true,
}) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 20;
  
  // Calculate hour hand angle from displayHour if provided
  const handAngle = displayHour !== undefined 
    ? (displayHour % 12) * 30 - 90 // Convert to degrees, offset by -90 for 12 o'clock at top
    : hourHandAngle - 90;
  
  // Convert angle to radians for calculations
  const handRadians = (handAngle * Math.PI) / 180;
  const handLength = radius * 0.6;
  
  // Hour hand end position
  const handEndX = centerX + Math.cos(handRadians) * handLength;
  const handEndY = centerY + Math.sin(handRadians) * handLength;
  
  // Handle drag for interactive mode
  const handleDrag = (e: any) => {
    if (!interactive || !onAngleChange) return;
    
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    
    // Calculate angle from center to pointer
    const dx = pointer.x - centerX;
    const dy = pointer.y - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Normalize to 0-360 and offset for 12 o'clock at top
    angle = (angle + 90 + 360) % 360;
    
    // Snap to nearest hour (30 degrees)
    const snappedAngle = Math.round(angle / 30) * 30;
    
    onAngleChange(snappedAngle);
  };
  
  // Generate hour markers
  const hourMarkers = [];
  for (let i = 0; i < 12; i++) {
    const markerAngle = (i * 30 - 90) * (Math.PI / 180);
    const innerRadius = radius - 15;
    const outerRadius = radius - 5;
    
    hourMarkers.push(
      <Line
        key={`marker-${i}`}
        points={[
          centerX + Math.cos(markerAngle) * innerRadius,
          centerY + Math.sin(markerAngle) * innerRadius,
          centerX + Math.cos(markerAngle) * outerRadius,
          centerY + Math.sin(markerAngle) * outerRadius,
        ]}
        stroke="#8B4513"
        strokeWidth={i % 3 === 0 ? 4 : 2}
      />
    );
  }
  
  // Generate number labels
  const numberLabels = [];
  if (showNumbers) {
    for (let i = 1; i <= 12; i++) {
      const numAngle = ((i * 30) - 90) * (Math.PI / 180);
      const numRadius = radius - 35;
      
      numberLabels.push(
        <Text
          key={`num-${i}`}
          x={centerX + Math.cos(numAngle) * numRadius - 10}
          y={centerY + Math.sin(numAngle) * numRadius - 12}
          text={String(i)}
          fontSize={24}
          fontFamily="Comic Sans MS, cursive"
          fontStyle="bold"
          fill="#333333"
          width={24}
          align="center"
        />
      );
    }
  }
  
  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Clock face background */}
        <Circle
          x={centerX}
          y={centerY}
          radius={radius}
          fill="#FFFEF0"
          stroke="#8B4513"
          strokeWidth={8}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={15}
          shadowOffsetX={5}
          shadowOffsetY={5}
        />
        
        {/* Inner decorative circle */}
        <Circle
          x={centerX}
          y={centerY}
          radius={radius - 10}
          stroke="#D4A574"
          strokeWidth={2}
        />
        
        {/* Hour markers */}
        {hourMarkers}
        
        {/* Number labels */}
        {numberLabels}
        
        {/* Hour hand */}
        <Line
          points={[centerX, centerY, handEndX, handEndY]}
          stroke="#4A90D9"
          strokeWidth={12}
          lineCap="round"
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={5}
          shadowOffsetX={2}
          shadowOffsetY={2}
        />
        
        {/* Hour hand arrow tip */}
        <Circle
          x={handEndX}
          y={handEndY}
          radius={8}
          fill="#4A90D9"
        />
        
        {/* Center dot */}
        <Circle
          x={centerX}
          y={centerY}
          radius={14}
          fill="#FF6B6B"
          stroke="#CC5555"
          strokeWidth={2}
        />
        
        {/* Interactive drag area (invisible) */}
        {interactive && (
          <Circle
            x={centerX}
            y={centerY}
            radius={radius}
            fill="transparent"
            onMouseDown={handleDrag}
            onMouseMove={(e) => {
              if (e.evt.buttons === 1) handleDrag(e);
            }}
            onTouchStart={handleDrag}
            onTouchMove={handleDrag}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default TickTockCanvas;
