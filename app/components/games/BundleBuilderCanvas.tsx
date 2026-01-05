'use client';

import React, { useMemo } from 'react';
import { Stage, Layer, Group, Circle, Rect, RegularPolygon, Text, Line } from 'react-konva';
import { useShadowStoryStore } from '../../store/useShadowStoryStore';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;

// Pre-generated stars
const STARS = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  x: (i * 137.5) % CANVAS_WIDTH,
  y: (i * 53) % 200,
  radius: 1 + (i % 3),
}));

type ShapeType = 'circle' | 'square' | 'triangle' | 'rectangle';

const SHAPE_COLORS: Record<ShapeType, string> = {
  circle: '#8b5cf6',
  square: '#3b82f6',
  triangle: '#ec4899',
  rectangle: '#f59e0b',
};

const BUNDLE_ZONE = {
  x: 300,
  y: 350,
  radius: 70,
};

export default function BundleBuilderCanvas() {
  const { bundleChallenge, moveShapeToZone, removeShapeFromZone, createBundle } = useShadowStoryStore();

  const { shapesInZone, unbundledShapes, bundleReady } = useMemo(() => {
    if (!bundleChallenge) return { shapesInZone: [], unbundledShapes: [], bundleReady: false };
    
    const inZone = bundleChallenge.shapes.filter(s => s.inZone && !s.bundled);
    const unbundled = bundleChallenge.shapes.filter(s => !s.bundled && !s.inZone);
    
    return {
      shapesInZone: inZone,
      unbundledShapes: unbundled,
      bundleReady: inZone.length >= 10,
    };
  }, [bundleChallenge]);

  if (!bundleChallenge) {
    return (
      <div className="flex items-center justify-center h-[450px]">
        <p className="text-purple-300">Loading gems...</p>
      </div>
    );
  }

  const { totalShapes, completedBundles, bundleZoneCount } = bundleChallenge;

  const handleShapeClick = (id: string, inZone: boolean) => {
    if (inZone) {
      removeShapeFromZone(id);
    } else {
      moveShapeToZone(id);
    }
  };

  const handleBundleClick = () => {
    if (bundleReady) {
      createBundle();
    }
  };

  const renderMiniShape = (type: ShapeType, x: number, y: number, size: number) => {
    const fill = SHAPE_COLORS[type];
    switch (type) {
      case 'circle':
        return <Circle x={x} y={y} radius={size} fill={fill} />;
      case 'square':
        return <Rect x={x - size} y={y - size} width={size * 2} height={size * 2} fill={fill} />;
      case 'triangle':
        return <RegularPolygon x={x} y={y} sides={3} radius={size * 1.2} fill={fill} />;
      case 'rectangle':
        return <Rect x={x - size * 1.3} y={y - size * 0.7} width={size * 2.6} height={size * 1.4} fill={fill} />;
    }
  };

  return (
    <div className="relative">
      {/* Stats Display */}
      <div className="absolute top-4 left-4 z-10 bg-purple-900/80 rounded-xl px-4 py-2 border border-purple-500/50">
        <p className="text-purple-200 text-sm">Total Gems: {totalShapes}</p>
        <p className="text-green-400 font-bold">Bundles: {completedBundles} × 10</p>
        <p className="text-orange-400">Remaining: {unbundledShapes.length + shapesInZone.length}</p>
      </div>

      {/* Bundle Zone Counter */}
      <div className="absolute top-4 right-4 z-10 bg-purple-900/80 rounded-xl px-4 py-2 border border-purple-500/50">
        <p className="text-purple-200 text-sm">In Zone:</p>
        <p className={`text-3xl font-bold ${bundleZoneCount >= 10 ? 'text-green-400' : 'text-yellow-400'}`}>
          {bundleZoneCount}/10
        </p>
      </div>

      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          {/* Background */}
          <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#1a1a2e" />

          {/* Stars */}
          {STARS.map((star) => (
            <Circle
              key={`star-${star.id}`}
              x={star.x}
              y={star.y}
              radius={star.radius}
              fill="#fff"
              opacity={0.4}
            />
          ))}

          {/* Completed bundles display */}
          {Array.from({ length: completedBundles }).map((_, i) => (
            <Group key={`bundle-${i}`} x={30 + (i % 5) * 55} y={280 + Math.floor(i / 5) * 60}>
              <Rect
                x={-20}
                y={-20}
                width={45}
                height={45}
                fill="#2ecc71"
                stroke="#27ae60"
                strokeWidth={2}
                cornerRadius={8}
              />
              <Text
                x={-15}
                y={-8}
                text="10"
                fontSize={18}
                fill="#fff"
                fontStyle="bold"
              />
            </Group>
          ))}

          {/* Unbundled shapes (scattered) */}
          {unbundledShapes.map((shape) => (
            <Group
              key={shape.id}
              x={shape.x}
              y={shape.y}
              onClick={() => handleShapeClick(shape.id, false)}
              onTap={() => handleShapeClick(shape.id, false)}
            >
              {renderMiniShape(shape.type, 0, 0, 12)}
              <Circle
                x={0}
                y={0}
                radius={16}
                stroke="#ffd700"
                strokeWidth={1}
                opacity={0.3}
              />
            </Group>
          ))}

          {/* Bundle Zone */}
          <Group x={BUNDLE_ZONE.x} y={BUNDLE_ZONE.y}>
            {/* Outer glow */}
            <Circle
              x={0}
              y={0}
              radius={BUNDLE_ZONE.radius + 10}
              fill="transparent"
              stroke={bundleReady ? '#22c55e' : '#8b5cf6'}
              strokeWidth={4}
              dash={bundleReady ? [] : [10, 5]}
              opacity={bundleReady ? 1 : 0.5}
            />
            
            {/* Inner zone */}
            <Circle
              x={0}
              y={0}
              radius={BUNDLE_ZONE.radius}
              fill={bundleReady ? 'rgba(34, 197, 94, 0.2)' : 'rgba(139, 92, 246, 0.2)'}
              stroke={bundleReady ? '#22c55e' : '#8b5cf6'}
              strokeWidth={2}
            />

            {/* Shapes in zone (arranged in circle) */}
            {shapesInZone.map((shape, i) => {
              const angle = (i / Math.max(shapesInZone.length, 1)) * Math.PI * 2 - Math.PI / 2;
              const radius = shapesInZone.length > 5 ? 45 : 35;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <Group
                  key={shape.id}
                  x={x}
                  y={y}
                  onClick={() => handleShapeClick(shape.id, true)}
                  onTap={() => handleShapeClick(shape.id, true)}
                >
                  {renderMiniShape(shape.type, 0, 0, 10)}
                </Group>
              );
            })}

            {/* Bundle button */}
            {bundleReady && (
              <Group
                onClick={handleBundleClick}
                onTap={handleBundleClick}
              >
                <Circle
                  x={0}
                  y={0}
                  radius={25}
                  fill="#22c55e"
                  shadowBlur={15}
                  shadowColor="#22c55e"
                />
                <Text
                  x={-20}
                  y={-10}
                  text="Bundle!"
                  fontSize={11}
                  fill="#fff"
                  fontStyle="bold"
                  width={40}
                  align="center"
                />
              </Group>
            )}

            {/* Zone label */}
            {!bundleReady && shapesInZone.length === 0 && (
              <Text
                x={-40}
                y={-8}
                text="Drop Zone"
                fontSize={14}
                fill="#8b5cf6"
                width={80}
                align="center"
              />
            )}
          </Group>

          {/* Instructions */}
          <Group x={CANVAS_WIDTH / 2} y={CANVAS_HEIGHT - 30}>
            <Text
              x={-150}
              y={0}
              text={bundleReady 
                ? "✨ Tap the green button to create a bundle!" 
                : "👆 Tap gems to add them to the zone"}
              fontSize={12}
              fill="#a78bfa"
              width={300}
              align="center"
            />
          </Group>

          {/* Division line */}
          <Line
            points={[0, 260, CANVAS_WIDTH, 260]}
            stroke="#4a4a6a"
            strokeWidth={1}
            dash={[5, 5]}
          />
        </Layer>
      </Stage>
    </div>
  );
}
