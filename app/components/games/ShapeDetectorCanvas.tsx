'use client';

import React, { useMemo } from 'react';
import { Stage, Layer, Rect, Circle, RegularPolygon, Text, Group, Line } from 'react-konva';
import { useShapeCityStore } from '../../store/useShapeCityStore';

type ShapeType = 'circle' | 'square' | 'rectangle' | 'triangle' | 'semicircle' | 'pentagon' | 'hexagon';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;

// Scene colors
const SCENE_COLORS = {
  street: { sky: '#87CEEB', ground: '#8B7355', buildings: ['#FFB6C1', '#DDA0DD', '#B0C4DE', '#98FB98'] },
  park: { sky: '#87CEEB', ground: '#90EE90', buildings: ['#8FBC8F', '#F0E68C', '#DEB887'] },
  downtown: { sky: '#4A90D9', ground: '#696969', buildings: ['#708090', '#A9A9A9', '#C0C0C0', '#D3D3D3'] },
  neighborhood: { sky: '#FFB347', ground: '#DEB887', buildings: ['#FFDAB9', '#FFE4B5', '#FFEFD5', '#FFF8DC'] }
};

const SHAPE_COLORS = {
  circle: '#FF6B6B',
  square: '#4ECDC4',
  rectangle: '#45B7D1',
  triangle: '#96CEB4',
  semicircle: '#FFEAA7',
  pentagon: '#DDA0DD',
  hexagon: '#98D8C8'
};

interface ShapeProps {
  shape: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  found: boolean;
  isTarget: boolean;
  onClick: () => void;
}

function Shape({ shape, x, y, width, height, rotation, found, isTarget, onClick }: ShapeProps) {
  const color = found ? '#90EE90' : (isTarget ? SHAPE_COLORS[shape] : '#C0C0C0');
  const strokeColor = found ? '#228B22' : '#333';
  
  const commonProps = {
    x,
    y,
    rotation,
    fill: color,
    stroke: strokeColor,
    strokeWidth: 2,
    onClick,
    onTap: onClick,
    shadowBlur: found ? 10 : 0,
    shadowColor: found ? '#00FF00' : undefined
  };

  switch (shape) {
    case 'circle':
      return <Circle {...commonProps} radius={width / 2} />;
    case 'square':
      return <Rect {...commonProps} width={width} height={width} offsetX={width / 2} offsetY={width / 2} />;
    case 'rectangle':
      return <Rect {...commonProps} width={width} height={height * 0.6} offsetX={width / 2} offsetY={height * 0.3} />;
    case 'triangle':
      return <RegularPolygon {...commonProps} sides={3} radius={width / 2} />;
    case 'semicircle':
      return (
        <Group x={x} y={y} rotation={rotation} onClick={onClick} onTap={onClick}>
          <Circle
            radius={width / 2}
            fill={color}
            stroke={strokeColor}
            strokeWidth={2}
          />
          <Rect
            x={-width / 2}
            y={0}
            width={width}
            height={width / 2}
            fill={SCENE_COLORS.street.sky}
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

function CityBackground({ scene }: { scene: 'street' | 'park' | 'downtown' | 'neighborhood' }) {
  const colors = SCENE_COLORS[scene];
  
  return (
    <>
      {/* Sky */}
      <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT * 0.6} fill={colors.sky} />
      
      {/* Sun/Moon */}
      {scene === 'neighborhood' ? (
        <Circle x={520} y={60} radius={35} fill="#FFD700" shadowBlur={20} shadowColor="#FFD700" />
      ) : (
        <Circle x={520} y={60} radius={30} fill="#FFFACD" />
      )}
      
      {/* Clouds */}
      <Group>
        <Circle x={100} y={50} radius={25} fill="#FFFFFF" opacity={0.8} />
        <Circle x={130} y={45} radius={30} fill="#FFFFFF" opacity={0.8} />
        <Circle x={160} y={55} radius={20} fill="#FFFFFF" opacity={0.8} />
      </Group>
      <Group>
        <Circle x={350} y={70} radius={20} fill="#FFFFFF" opacity={0.7} />
        <Circle x={375} y={65} radius={25} fill="#FFFFFF" opacity={0.7} />
        <Circle x={400} y={72} radius={18} fill="#FFFFFF" opacity={0.7} />
      </Group>
      
      {/* Ground */}
      <Rect x={0} y={CANVAS_HEIGHT * 0.7} width={CANVAS_WIDTH} height={CANVAS_HEIGHT * 0.3} fill={colors.ground} />
      
      {/* Road */}
      {(scene === 'street' || scene === 'downtown') && (
        <>
          <Rect x={0} y={CANVAS_HEIGHT * 0.8} width={CANVAS_WIDTH} height={50} fill="#444" />
          <Line
            points={[0, CANVAS_HEIGHT * 0.8 + 25, CANVAS_WIDTH, CANVAS_HEIGHT * 0.8 + 25]}
            stroke="#FFFF00"
            strokeWidth={3}
            dash={[20, 15]}
          />
        </>
      )}
      
      {/* Buildings */}
      {colors.buildings.map((color, i) => (
        <Group key={i}>
          <Rect
            x={30 + i * 140}
            y={CANVAS_HEIGHT * 0.7 - 100 - i * 20}
            width={100}
            height={100 + i * 20}
            fill={color}
            stroke="#555"
            strokeWidth={2}
          />
          {/* Windows */}
          {[0, 1, 2].map(row => (
            [0, 1].map(col => (
              <Rect
                key={`${row}-${col}`}
                x={45 + i * 140 + col * 40}
                y={CANVAS_HEIGHT * 0.7 - 90 - i * 20 + row * 30}
                width={20}
                height={20}
                fill="#87CEEB"
                stroke="#333"
              />
            ))
          ))}
          {/* Door */}
          <Rect
            x={65 + i * 140}
            y={CANVAS_HEIGHT * 0.7 - 30}
            width={25}
            height={30}
            fill="#8B4513"
            stroke="#333"
          />
        </Group>
      ))}
      
      {/* Trees in park */}
      {scene === 'park' && (
        <>
          {[50, 200, 450, 550].map((x, i) => (
            <Group key={i}>
              <Rect x={x} y={CANVAS_HEIGHT * 0.7 - 40} width={15} height={50} fill="#8B4513" />
              <Circle x={x + 7} y={CANVAS_HEIGHT * 0.7 - 50} radius={30} fill="#228B22" />
            </Group>
          ))}
        </>
      )}
    </>
  );
}

export default function ShapeDetectorCanvas() {
  const { detectorChallenge, findShape } = useShapeCityStore();

  const targetShapeDisplay = useMemo(() => {
    if (!detectorChallenge) return null;
    
    const shapeNames: Record<ShapeType, string> = {
      circle: '⭕ Circles',
      square: '⬜ Squares',
      rectangle: '▬ Rectangles',
      triangle: '🔺 Triangles',
      semicircle: '🌓 Semicircles',
      pentagon: '⬠ Pentagons',
      hexagon: '⬡ Hexagons'
    };
    
    return shapeNames[detectorChallenge.targetShape];
  }, [detectorChallenge]);

  if (!detectorChallenge) {
    return (
      <div className="flex items-center justify-center h-[450px]">
        <p className="text-gray-500">Loading challenge...</p>
      </div>
    );
  }

  const { scene, targetShape, hiddenShapes, totalToFind, foundCount } = detectorChallenge;

  return (
    <div className="relative">
      {/* Target indicator */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 rounded-xl px-4 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-600">Find all the:</p>
        <p className="text-xl font-bold" style={{ color: SHAPE_COLORS[targetShape] }}>
          {targetShapeDisplay}
        </p>
      </div>
      
      {/* Progress indicator */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 rounded-xl px-4 py-2 shadow-lg">
        <p className="text-lg font-bold text-gray-800">
          {foundCount} / {totalToFind}
        </p>
        <div className="flex gap-1 mt-1">
          {Array.from({ length: totalToFind }).map((_, i) => (
            <span
              key={i}
              className={`text-lg ${i < foundCount ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              ⭐
            </span>
          ))}
        </div>
      </div>

      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          {/* Background scene */}
          <CityBackground scene={scene} />
          
          {/* Hidden shapes */}
          {hiddenShapes.map((shape) => (
            <Shape
              key={shape.id}
              shape={shape.shape}
              x={shape.x}
              y={shape.y}
              width={shape.width}
              height={shape.height}
              rotation={shape.rotation}
              found={shape.found}
              isTarget={shape.id.startsWith('target-')}
              onClick={() => findShape(shape.id)}
            />
          ))}
          
          {/* Instructions at bottom */}
          <Rect
            x={150}
            y={CANVAS_HEIGHT - 40}
            width={300}
            height={30}
            fill="rgba(0,0,0,0.7)"
            cornerRadius={15}
          />
          <Text
            x={150}
            y={CANVAS_HEIGHT - 35}
            width={300}
            text="👆 Tap on shapes to find them!"
            fontSize={14}
            fill="#FFFFFF"
            align="center"
          />
        </Layer>
      </Stage>
    </div>
  );
}
