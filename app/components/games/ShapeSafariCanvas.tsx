'use client';

import React, { useEffect, useState } from 'react';
import { Stage, Layer, Circle, Rect, Line, Text, RegularPolygon, Group, Star, Ellipse } from 'react-konva';
import { useShapeSafariStore, ShapeType, Shape3DType, LineType, PositionType, DisplayShape } from '@/app/store/useShapeSafariStore';

// Shape rendering component for 2D shapes
const Shape2D = ({
  type,
  x,
  y,
  size,
  color,
  rotation = 0,
}: {
  type: ShapeType;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation?: number;
}) => {
  const commonProps = {
    x,
    y,
    rotation,
    shadowColor: '#333',
    shadowBlur: 5,
    shadowOffset: { x: 2, y: 2 },
    shadowOpacity: 0.3,
  };

  switch (type) {
    case 'circle':
      return <Circle {...commonProps} radius={size / 2} fill={color} stroke="#333" strokeWidth={2} />;
    case 'square':
      return (
        <Rect
          {...commonProps}
          width={size}
          height={size}
          offsetX={size / 2}
          offsetY={size / 2}
          fill={color}
          stroke="#333"
          strokeWidth={2}
        />
      );
    case 'rectangle':
      return (
        <Rect
          {...commonProps}
          width={size * 1.5}
          height={size}
          offsetX={(size * 1.5) / 2}
          offsetY={size / 2}
          fill={color}
          stroke="#333"
          strokeWidth={2}
        />
      );
    case 'triangle':
      return (
        <RegularPolygon
          {...commonProps}
          sides={3}
          radius={size / 2}
          fill={color}
          stroke="#333"
          strokeWidth={2}
        />
      );
    default:
      return null;
  }
};

// Shape rendering component for 3D shapes (isometric style)
const Shape3D = ({
  type,
  x,
  y,
  size,
  color,
}: {
  type: Shape3DType;
  x: number;
  y: number;
  size: number;
  color: string;
}) => {
  const darkerColor = adjustColor(color, -30);
  const lighterColor = adjustColor(color, 30);

  switch (type) {
    case 'cube':
      return (
        <Group x={x} y={y}>
          {/* Front face */}
          <Rect x={-size / 2} y={-size / 4} width={size} height={size} fill={color} stroke="#333" strokeWidth={2} />
          {/* Top face */}
          <Line
            points={[-size / 2, -size / 4, 0, -size / 4 - size / 2, size, -size / 4 - size / 2, size / 2, -size / 4]}
            closed
            fill={lighterColor}
            stroke="#333"
            strokeWidth={2}
          />
          {/* Right face */}
          <Line
            points={[size / 2, -size / 4, size, -size / 4 - size / 2, size, size / 4 + size / 2, size / 2, size - size / 4]}
            closed
            fill={darkerColor}
            stroke="#333"
            strokeWidth={2}
          />
        </Group>
      );
    case 'sphere':
      return (
        <Group x={x} y={y}>
          <Circle radius={size / 2} fill={color} stroke="#333" strokeWidth={2} />
          {/* Highlight */}
          <Circle x={-size / 6} y={-size / 6} radius={size / 8} fill={lighterColor} opacity={0.6} />
        </Group>
      );
    case 'cone':
      return (
        <Group x={x} y={y}>
          <Line points={[0, -size / 2, size / 2, size / 2, -size / 2, size / 2]} closed fill={color} stroke="#333" strokeWidth={2} />
          <Ellipse y={size / 2} radiusX={size / 2} radiusY={size / 6} fill={darkerColor} stroke="#333" strokeWidth={2} />
        </Group>
      );
    case 'cylinder':
      return (
        <Group x={x} y={y}>
          {/* Body */}
          <Rect x={-size / 2} y={-size / 3} width={size} height={size * 0.8} fill={color} />
          <Line points={[-size / 2, -size / 3, -size / 2, size / 2]} stroke="#333" strokeWidth={2} />
          <Line points={[size / 2, -size / 3, size / 2, size / 2]} stroke="#333" strokeWidth={2} />
          {/* Top */}
          <Ellipse y={-size / 3} radiusX={size / 2} radiusY={size / 6} fill={lighterColor} stroke="#333" strokeWidth={2} />
          {/* Bottom */}
          <Ellipse y={size / 2} radiusX={size / 2} radiusY={size / 6} fill={darkerColor} stroke="#333" strokeWidth={2} />
        </Group>
      );
    case 'cuboid':
      return (
        <Group x={x} y={y}>
          {/* Front face */}
          <Rect x={-size * 0.6} y={-size / 4} width={size * 1.2} height={size * 0.7} fill={color} stroke="#333" strokeWidth={2} />
          {/* Top face */}
          <Line
            points={[-size * 0.6, -size / 4, -size * 0.3, -size / 2, size * 0.9, -size / 2, size * 0.6, -size / 4]}
            closed
            fill={lighterColor}
            stroke="#333"
            strokeWidth={2}
          />
          {/* Right face */}
          <Line
            points={[size * 0.6, -size / 4, size * 0.9, -size / 2, size * 0.9, size * 0.2, size * 0.6, size * 0.45]}
            closed
            fill={darkerColor}
            stroke="#333"
            strokeWidth={2}
          />
        </Group>
      );
    default:
      return null;
  }
};

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Line type rendering
const LineShape = ({
  type,
  x,
  y,
  length,
  color,
}: {
  type: LineType;
  x: number;
  y: number;
  length: number;
  color: string;
}) => {
  switch (type) {
    case 'straight':
      return <Line points={[x, y, x + length, y]} stroke={color} strokeWidth={6} lineCap="round" />;
    case 'curved':
      return (
        <Line
          points={[x, y, x + length / 3, y - 30, x + (length * 2) / 3, y + 30, x + length, y]}
          stroke={color}
          strokeWidth={6}
          tension={0.5}
          lineCap="round"
        />
      );
    case 'slanting':
      return <Line points={[x, y + 40, x + length, y - 40]} stroke={color} strokeWidth={6} lineCap="round" />;
    default:
      return null;
  }
};

// Position visualization
const PositionVisualization = ({
  position,
  width,
  height,
}: {
  position: PositionType;
  width: number;
  height: number;
}) => {
  const boxX = width / 2;
  const boxY = height / 2;
  const boxSize = 80;

  let starX = boxX;
  let starY = boxY;

  switch (position) {
    case 'inside':
      starX = boxX;
      starY = boxY;
      break;
    case 'outside':
      starX = boxX + boxSize + 40;
      starY = boxY;
      break;
    case 'above':
      starX = boxX;
      starY = boxY - boxSize - 30;
      break;
    case 'below':
      starX = boxX;
      starY = boxY + boxSize + 30;
      break;
    case 'left':
      starX = boxX - boxSize - 40;
      starY = boxY;
      break;
    case 'right':
      starX = boxX + boxSize + 40;
      starY = boxY;
      break;
  }

  return (
    <Group>
      {/* Box */}
      <Rect
        x={boxX - boxSize / 2}
        y={boxY - boxSize / 2}
        width={boxSize}
        height={boxSize}
        fill="#4ECDC4"
        stroke="#333"
        strokeWidth={3}
        cornerRadius={5}
      />
      <Text x={boxX - 15} y={boxY - 10} text="BOX" fontSize={14} fontStyle="bold" fill="#333" />
      {/* Star */}
      <Star x={starX} y={starY} numPoints={5} innerRadius={12} outerRadius={25} fill="#FFD700" stroke="#FFA500" strokeWidth={2} />
    </Group>
  );
};

// Pattern visualization
const PatternVisualization = ({
  pattern,
  width,
}: {
  pattern: Array<{ shape: ShapeType; color: string }>;
  width: number;
}) => {
  const shapeSize = 45;
  const spacing = 55;
  const startX = (width - pattern.length * spacing) / 2 + spacing / 2;

  return (
    <Group>
      {pattern.map((item, idx) => (
        <Group key={idx}>
          <Shape2D type={item.shape} x={startX + idx * spacing} y={180} size={shapeSize} color={item.color} />
        </Group>
      ))}
      {/* Question mark for next */}
      <Group>
        <Circle x={startX + pattern.length * spacing} y={180} radius={25} fill="#DDD" stroke="#999" strokeWidth={2} />
        <Text x={startX + pattern.length * spacing - 10} y={165} text="?" fontSize={30} fontStyle="bold" fill="#666" />
      </Group>
    </Group>
  );
};

export default function ShapeSafariCanvas() {
  const { currentChallenge } = useShapeSafariStore();
  const [dimensions, setDimensions] = useState({ width: 400, height: 350 });

  useEffect(() => {
    const updateDimensions = () => {
      const maxWidth = Math.min(window.innerWidth - 40, 500);
      setDimensions({
        width: maxWidth,
        height: Math.min(350, maxWidth * 0.75),
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (!currentChallenge) return null;

  const { width, height } = dimensions;

  const renderChallengeContent = () => {
    switch (currentChallenge.type) {
      case 'identify-2d':
      case 'count-shapes':
        return (
          <>
            {currentChallenge.data.displayShapes?.map((shape: DisplayShape) => (
              <Shape2D
                key={shape.id}
                type={shape.shape as ShapeType}
                x={shape.x}
                y={shape.y}
                size={shape.size}
                color={shape.color}
                rotation={shape.rotation}
              />
            ))}
          </>
        );

      case 'identify-3d':
        return (
          <Shape3D
            type={currentChallenge.data.targetShape as Shape3DType}
            x={width / 2}
            y={height / 2}
            size={120}
            color="#4ECDC4"
          />
        );

      case 'match-shape':
        return (
          <Group>
            <Shape2D
              type={currentChallenge.data.targetShape as ShapeType}
              x={width / 2}
              y={height / 2}
              size={100}
              color="#4ECDC4"
            />
            <Text
              x={width / 2 - 80}
              y={height / 2 + 70}
              text="Find the object!"
              fontSize={18}
              fontStyle="bold"
              fill="#666"
            />
          </Group>
        );

      case 'find-line':
        return (
          <Group>
            <LineShape type="straight" x={60} y={100} length={120} color="#FF6B6B" />
            <Text x={60} y={120} text="Straight" fontSize={14} fill="#666" />

            <LineShape type="curved" x={60} y={180} length={120} color="#4ECDC4" />
            <Text x={60} y={220} text="Curved" fontSize={14} fill="#666" />

            <LineShape type="slanting" x={250} y={140} length={100} color="#96CEB4" />
            <Text x={250} y={200} text="Slanting" fontSize={14} fill="#666" />
          </Group>
        );

      case 'position':
        return <PositionVisualization position={currentChallenge.data.targetPosition!} width={width} height={height} />;

      case 'odd-one-out':
        return (
          <>
            {currentChallenge.data.displayShapes?.map((shape: DisplayShape, idx: number) => (
              <Group key={shape.id}>
                <Shape2D
                  type={shape.shape as ShapeType}
                  x={80 + (idx % 2) * 120}
                  y={120 + Math.floor(idx / 2) * 100}
                  size={shape.size}
                  color={shape.color}
                />
                <Text
                  x={65 + (idx % 2) * 120}
                  y={160 + Math.floor(idx / 2) * 100}
                  text={`${idx + 1}`}
                  fontSize={20}
                  fontStyle="bold"
                  fill="#333"
                />
              </Group>
            ))}
          </>
        );

      case 'pattern-complete':
        return <PatternVisualization pattern={currentChallenge.data.pattern!} width={width} />;

      case 'shape-in-object':
        return (
          <Group>
            <Text
              x={width / 2 - 60}
              y={height / 2 - 40}
              text={currentChallenge.data.object}
              fontSize={36}
              fontStyle="bold"
              fill="#333"
            />
            <Text
              x={width / 2 - 100}
              y={height / 2 + 20}
              text="What shape is this?"
              fontSize={18}
              fill="#666"
            />
          </Group>
        );

      case 'big-small':
        return (
          <Group>
            {/* Big shape */}
            <Shape2D
              type={currentChallenge.data.targetShape as ShapeType}
              x={width / 3}
              y={height / 2}
              size={100}
              color="#FF6B6B"
            />
            <Text x={width / 3 - 15} y={height / 2 + 65} text="BIG" fontSize={16} fontStyle="bold" fill="#333" />

            {/* Small shape */}
            <Shape2D
              type={currentChallenge.data.targetShape as ShapeType}
              x={(width * 2) / 3}
              y={height / 2}
              size={50}
              color="#4ECDC4"
            />
            <Text x={(width * 2) / 3 - 25} y={height / 2 + 45} text="SMALL" fontSize={16} fontStyle="bold" fill="#333" />
          </Group>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-purple-300">
        <Stage width={width} height={height}>
          {/* Background Layer */}
          <Layer>
            <Rect x={0} y={0} width={width} height={height} fill="#FAFAFA" />
          </Layer>

          {/* Content Layer */}
          <Layer>{renderChallengeContent()}</Layer>
        </Stage>
      </div>
    </div>
  );
}
