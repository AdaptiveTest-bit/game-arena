'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect, Ellipse, Text, Group, Line, Circle } from 'react-konva';
import Konva from 'konva';
import { Balloon } from '@/app/store/useBalloonBlastoffStore';

// ============================================
// TYPES
// ============================================

interface BalloonBlastoffCanvasProps {
  width: number;
  height: number;
  targetSum: number;
  currentSum: number;
  availableBalloons: Balloon[];
  attachedBalloons: Balloon[];
  gamePhase: 'menu' | 'playing' | 'floating' | 'success' | 'celebrating';
  onAttachBalloon: (balloonId: string) => void;
  onDetachBalloon: (balloonId: string) => void;
}

// ============================================
// CONSTANTS
// ============================================

const BASKET_X = 350;
const BASKET_Y = 350;
const BASKET_WIDTH = 120;
const BASKET_HEIGHT = 70;
const CLOUD_Y = 80;

const BALLOON_COLORS: Record<string, { light: string; dark: string }> = {
  '#FF6B6B': { light: '#FF8A8A', dark: '#E55555' },
  '#4ECDC4': { light: '#6FE5DD', dark: '#3BB5AD' },
  '#45B7D1': { light: '#67C9E1', dark: '#2DA5BF' },
  '#96CEB4': { light: '#AEE0C8', dark: '#7EBE9C' },
  '#FFEAA7': { light: '#FFF0BC', dark: '#E5D292' },
  '#DDA0DD': { light: '#E8B8E8', dark: '#C588C5' },
  '#98D8C8': { light: '#B0E8DA', dark: '#80C8B8' },
  '#F7DC6F': { light: '#F9E68A', dark: '#E5C85A' },
  '#BB8FCE': { light: '#CDA8DE', dark: '#A976BE' },
  '#85C1E9': { light: '#9DD1F1', dark: '#6DB1D9' },
};

// ============================================
// SUB-COMPONENTS
// ============================================

// Draggable Balloon Component
const DraggableBalloon: React.FC<{
  balloon: Balloon;
  onDragEnd: (balloonId: string, x: number, y: number) => void;
  gamePhase: string;
}> = ({ balloon, onDragEnd, gamePhase }) => {
  const groupRef = useRef<Konva.Group>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  
  const colorData = BALLOON_COLORS[balloon.color] || { light: balloon.color, dark: balloon.color };

  // Wobble animation
  useEffect(() => {
    if (gamePhase !== 'playing') return;
    
    const wobbleInterval = setInterval(() => {
      setRotation((r) => (r === 3 ? -3 : 3));
    }, 1200 + Math.random() * 400);
    
    return () => clearInterval(wobbleInterval);
  }, [gamePhase]);

  return (
    <Group
      ref={groupRef}
      x={balloon.x}
      y={balloon.y}
      draggable={gamePhase === 'playing'}
      rotation={rotation}
      scaleX={scale}
      scaleY={scale}
      onDragStart={() => setScale(1.1)}
      onDragEnd={(e) => {
        setScale(1);
        const pos = e.target.position();
        onDragEnd(balloon.id, pos.x, pos.y);
      }}
      onMouseEnter={(e) => {
        const container = e.target.getStage()?.container();
        if (container && gamePhase === 'playing') container.style.cursor = 'grab';
      }}
      onMouseLeave={(e) => {
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = 'default';
      }}
    >
      {/* Balloon String */}
      <Line
        points={[0, 40, 0, 70]}
        stroke="#8B4513"
        strokeWidth={2}
      />
      
      {/* Balloon Body */}
      <Ellipse
        radiusX={35}
        radiusY={45}
        fill={balloon.color}
        stroke={colorData.dark}
        strokeWidth={2}
      />
      
      {/* Balloon Shine */}
      <Ellipse
        x={-12}
        y={-15}
        radiusX={8}
        radiusY={12}
        fill={colorData.light}
        opacity={0.6}
      />
      
      {/* Balloon Knot */}
      <Circle
        y={42}
        radius={5}
        fill={colorData.dark}
      />
      
      {/* Number on Balloon */}
      <Text
        text={String(balloon.value)}
        fontSize={balloon.value >= 10 ? 20 : 24}
        fontFamily="Arial"
        fontStyle="bold"
        fill="#FFFFFF"
        stroke="#333333"
        strokeWidth={0.5}
        align="center"
        verticalAlign="middle"
        offsetX={balloon.value >= 10 ? 12 : 7}
        offsetY={12}
      />
    </Group>
  );
};

// Cloud Component
const Cloud: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => {
  return (
    <Group x={x} y={y} scaleX={scale} scaleY={scale}>
      <Circle x={0} y={0} radius={30} fill="#FFFFFF" opacity={0.95} />
      <Circle x={25} y={5} radius={25} fill="#FFFFFF" opacity={0.95} />
      <Circle x={50} y={0} radius={30} fill="#FFFFFF" opacity={0.95} />
      <Circle x={15} y={-15} radius={22} fill="#FFFFFF" opacity={0.95} />
      <Circle x={35} y={-15} radius={22} fill="#FFFFFF" opacity={0.95} />
    </Group>
  );
};

// Basket Component with Animation
const Basket: React.FC<{
  attachedBalloons: Balloon[];
  isFloating: boolean;
}> = ({ attachedBalloons, isFloating }) => {
  const groupRef = useRef<Konva.Group>(null);
  const [currentY, setCurrentY] = useState(BASKET_Y);

  // Animate basket floating up
  useEffect(() => {
    let anim: Konva.Animation | null = null;
    
    if (isFloating && groupRef.current) {
      const targetY = CLOUD_Y + 50;
      anim = new Konva.Animation((frame) => {
        if (!frame) return;
        const elapsed = frame.time;
        const duration = 2000;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const newY = BASKET_Y - (BASKET_Y - targetY) * eased;
        setCurrentY(newY);
        if (progress >= 1) {
          anim?.stop();
        }
      }, groupRef.current.getLayer());
      anim.start();
    } else {
      setCurrentY(BASKET_Y);
    }
    
    return () => {
      if (anim) anim.stop();
    };
  }, [isFloating]);

  return (
    <Group ref={groupRef} x={BASKET_X} y={currentY}>
      {/* Ropes from basket to balloons */}
      {attachedBalloons.map((balloon, index) => {
        const ropeEndX = ((index % 3) - 1) * 60;
        const ropeEndY = -100 - Math.floor(index / 3) * 80;
        return (
          <Line
            key={`rope-${balloon.id}`}
            points={[0, -20, ropeEndX, ropeEndY]}
            stroke="#8B4513"
            strokeWidth={2}
          />
        );
      })}
      
      {/* Basket Body */}
      <Rect
        x={-BASKET_WIDTH / 2}
        y={0}
        width={BASKET_WIDTH}
        height={BASKET_HEIGHT}
        fill="#8B4513"
        stroke="#5D3A1A"
        strokeWidth={3}
        cornerRadius={[0, 0, 10, 10]}
      />
      
      {/* Basket Weave Pattern */}
      {[0, 15, 30, 45].map((yOffset) => (
        <Line
          key={`weave-h-${yOffset}`}
          points={[-BASKET_WIDTH / 2, yOffset + 10, BASKET_WIDTH / 2, yOffset + 10]}
          stroke="#6B4423"
          strokeWidth={1}
        />
      ))}
      {[-40, -20, 0, 20, 40].map((xOffset) => (
        <Line
          key={`weave-v-${xOffset}`}
          points={[xOffset, 0, xOffset, BASKET_HEIGHT]}
          stroke="#6B4423"
          strokeWidth={1}
        />
      ))}
      
      {/* Basket Rim */}
      <Rect
        x={-BASKET_WIDTH / 2 - 5}
        y={-5}
        width={BASKET_WIDTH + 10}
        height={12}
        fill="#A0522D"
        stroke="#5D3A1A"
        strokeWidth={2}
        cornerRadius={3}
      />
      
      {/* Cute Animal (Bunny) */}
      <Group y={15} x={0}>
        {/* Body */}
        <Ellipse radiusX={25} radiusY={20} fill="#F5DEB3" />
        {/* Head */}
        <Circle y={-25} radius={20} fill="#F5DEB3" />
        {/* Ears */}
        <Ellipse x={-12} y={-50} radiusX={8} radiusY={18} fill="#F5DEB3" stroke="#DEB887" strokeWidth={1} />
        <Ellipse x={-12} y={-50} radiusX={4} radiusY={12} fill="#FFB6C1" />
        <Ellipse x={12} y={-50} radiusX={8} radiusY={18} fill="#F5DEB3" stroke="#DEB887" strokeWidth={1} />
        <Ellipse x={12} y={-50} radiusX={4} radiusY={12} fill="#FFB6C1" />
        {/* Eyes */}
        <Circle x={-8} y={-28} radius={5} fill="#333333" />
        <Circle x={8} y={-28} radius={5} fill="#333333" />
        <Circle x={-6} y={-29} radius={2} fill="#FFFFFF" />
        <Circle x={10} y={-29} radius={2} fill="#FFFFFF" />
        {/* Nose */}
        <Circle y={-20} radius={4} fill="#FFB6C1" />
        {/* Cheeks */}
        <Circle x={-15} y={-22} radius={5} fill="#FFB6C1" opacity={0.5} />
        <Circle x={15} y={-22} radius={5} fill="#FFB6C1" opacity={0.5} />
      </Group>
    </Group>
  );
};

// Attached Balloon Component (Draggable to remove)
const AttachedBalloon: React.FC<{
  balloon: Balloon;
  index: number;
  basketY: number;
  onDragEnd: (balloonId: string, x: number, y: number) => void;
  gamePhase: string;
}> = ({ balloon, index, basketY, onDragEnd, gamePhase }) => {
  const [scale, setScale] = useState(1);
  const colorData = BALLOON_COLORS[balloon.color] || { light: balloon.color, dark: balloon.color };
  
  // Calculate position relative to basket
  const bx = BASKET_X + ((index % 3) - 1) * 60;
  const by = basketY - 130 - Math.floor(index / 3) * 80;

  return (
    <Group
      x={bx}
      y={by}
      draggable={gamePhase === 'playing'}
      scaleX={scale}
      scaleY={scale}
      onDragStart={() => setScale(1.1)}
      onDragEnd={(e) => {
        setScale(1);
        const pos = e.target.position();
        onDragEnd(balloon.id, pos.x, pos.y);
      }}
      onMouseEnter={(e) => {
        const container = e.target.getStage()?.container();
        if (container && gamePhase === 'playing') container.style.cursor = 'grab';
      }}
      onMouseLeave={(e) => {
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = 'default';
      }}
    >
      <Line points={[0, 40, 0, 70]} stroke="#8B4513" strokeWidth={2} />
      <Ellipse radiusX={35} radiusY={45} fill={balloon.color} stroke={colorData.dark} strokeWidth={2} />
      <Ellipse x={-12} y={-15} radiusX={8} radiusY={12} fill={colorData.light} opacity={0.6} />
      <Circle y={42} radius={5} fill={colorData.dark} />
      <Text
        text={String(balloon.value)}
        fontSize={balloon.value >= 10 ? 20 : 24}
        fontFamily="Arial"
        fontStyle="bold"
        fill="#FFFFFF"
        stroke="#333333"
        strokeWidth={0.5}
        align="center"
        offsetX={balloon.value >= 10 ? 12 : 7}
        offsetY={12}
      />
    </Group>
  );
};

// Confetti Particle
interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
}

const ConfettiLayer: React.FC<{ show: boolean; width: number; height: number }> = ({ show, width, height }) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const animRef = useRef<Konva.Animation | null>(null);
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (show) {
      // Create particles
      const colors = Object.keys(BALLOON_COLORS);
      const newParticles: ConfettiParticle[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: -20 - Math.random() * 100,
        color: colors[i % colors.length],
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      }));
      setParticles(newParticles);

      // Start animation
      if (layerRef.current) {
        animRef.current = new Konva.Animation((frame) => {
          if (!frame) return;
          setParticles((prev) =>
            prev.map((p) => ({
              ...p,
              x: p.x + p.velocityX,
              y: p.y + p.velocityY,
              rotation: p.rotation + p.rotationSpeed,
            })).filter((p) => p.y < height + 50)
          );
        }, layerRef.current);
        animRef.current.start();
      }

      return () => {
        if (animRef.current) animRef.current.stop();
      };
    } else {
      setParticles([]);
    }
  }, [show, width, height]);

  return (
    <Layer ref={layerRef}>
      {particles.map((p) => (
        <Rect
          key={p.id}
          x={p.x}
          y={p.y}
          width={10}
          height={10}
          fill={p.color}
          rotation={p.rotation}
          offsetX={5}
          offsetY={5}
        />
      ))}
    </Layer>
  );
};

// ============================================
// MAIN CANVAS COMPONENT
// ============================================

export const BalloonBlastoffCanvas: React.FC<BalloonBlastoffCanvasProps> = ({
  width,
  height,
  targetSum,
  currentSum,
  availableBalloons,
  attachedBalloons,
  gamePhase,
  onAttachBalloon,
  onDetachBalloon,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Show confetti on success
  useEffect(() => {
    if (gamePhase === 'success' || gamePhase === 'celebrating') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [gamePhase]);

  // Check if position is in basket zone
  const isInBasketZone = useCallback((x: number, y: number): boolean => {
    const zoneX = BASKET_X - 150;
    const zoneY = BASKET_Y - 200;
    const zoneWidth = 300;
    const zoneHeight = 250;
    
    return x > zoneX && x < zoneX + zoneWidth && y > zoneY && y < zoneY + zoneHeight;
  }, []);

  // Handle available balloon drag end (for attaching)
  const handleBalloonDragEnd = useCallback((balloonId: string, x: number, y: number) => {
    if (gamePhase !== 'playing') return;
    
    const balloon = availableBalloons.find((b) => b.id === balloonId);
    if (balloon) {
      // Available balloon dropped in basket zone -> attach
      if (isInBasketZone(x, y)) {
        onAttachBalloon(balloonId);
      }
    }
  }, [gamePhase, availableBalloons, isInBasketZone, onAttachBalloon]);

  // Handle attached balloon drag end (for detaching)
  const handleAttachedBalloonDragEnd = useCallback((balloonId: string, x: number, y: number) => {
    if (gamePhase !== 'playing') return;
    
    // If dropped outside basket zone -> detach
    if (!isInBasketZone(x, y)) {
      onDetachBalloon(balloonId);
    }
  }, [gamePhase, isInBasketZone, onDetachBalloon]);

  const isFloating = gamePhase === 'floating' || gamePhase === 'success' || gamePhase === 'celebrating';

  // Calculate current basket Y position for attached balloons
  const [basketDisplayY, setBasketDisplayY] = useState(BASKET_Y);
  
  useEffect(() => {
    if (isFloating) {
      // Sync with basket animation
      const interval = setInterval(() => {
        setBasketDisplayY((prev) => {
          const targetY = CLOUD_Y + 50;
          if (prev <= targetY + 5) return targetY;
          return prev - 5;
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      setBasketDisplayY(BASKET_Y);
    }
  }, [isFloating]);

  return (
    <Stage ref={stageRef} width={width} height={height}>
      {/* Background Layer */}
      <Layer>
        {/* Sky Gradient */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 0, y: height }}
          fillLinearGradientColorStops={[0, '#87CEEB', 0.7, '#B0E0E6', 1, '#98FB98']}
        />
        
        {/* Sun */}
        <Circle
          x={width - 80}
          y={80}
          radius={50}
          fill="#FFD700"
          shadowColor="#FFA500"
          shadowBlur={30}
          shadowOpacity={0.8}
        />
        
        {/* Clouds */}
        <Cloud x={50} y={60} scale={0.8} />
        <Cloud x={width / 2 - 40} y={40} scale={1.2} />
        <Cloud x={width - 200} y={100} scale={0.9} />
        
        {/* Target Cloud Platform */}
        <Group x={BASKET_X} y={CLOUD_Y}>
          <Cloud x={-80} y={0} scale={1.5} />
          <Text x={-15} y={-20} text="🎯" fontSize={40} />
        </Group>
        
        {/* Ground */}
        <Rect x={0} y={height - 80} width={width} height={80} fill="#90EE90" />
        
        {/* Grass Details */}
        {Array.from({ length: 20 }, (_, i) => (
          <Line
            key={`grass-${i}`}
            points={[i * 40 + 20, height - 80, i * 40 + 25, height - 95, i * 40 + 30, height - 80]}
            stroke="#228B22"
            strokeWidth={2}
          />
        ))}
      </Layer>

      {/* Game Elements Layer */}
      <Layer>
        {/* Target Sum Display */}
        <Group x={width / 2} y={30}>
          <Rect
            x={-100}
            y={-20}
            width={200}
            height={50}
            fill="#1E3A5F"
            stroke="#FFD700"
            strokeWidth={3}
            cornerRadius={25}
            shadowColor="#000000"
            shadowBlur={10}
            shadowOpacity={0.3}
          />
          <Text
            x={-80}
            y={-8}
            text={`🎯 Reach: ${targetSum}`}
            fontSize={24}
            fontFamily="Arial"
            fontStyle="bold"
            fill="#FFFFFF"
          />
        </Group>
        
        {/* Current Sum Display */}
        <Group x={60} y={150}>
          <Rect
            x={0}
            y={0}
            width={120}
            height={80}
            fill="#1E3A5F"
            stroke={currentSum === targetSum ? '#10B981' : currentSum > targetSum ? '#EF4444' : '#3B82F6'}
            strokeWidth={3}
            cornerRadius={10}
          />
          <Text x={10} y={10} text="Your Sum" fontSize={14} fill="#94A3B8" />
          <Text
            x={20}
            y={35}
            text={String(currentSum)}
            fontSize={32}
            fontStyle="bold"
            fill={currentSum === targetSum ? '#10B981' : currentSum > targetSum ? '#EF4444' : '#FFFFFF'}
          />
        </Group>
        
        {/* Basket Zone Indicator */}
        {gamePhase === 'playing' && (
          <Rect
            x={BASKET_X - 150}
            y={BASKET_Y - 200}
            width={300}
            height={250}
            stroke="#3B82F6"
            strokeWidth={2}
            dash={[10, 5]}
            opacity={0.3}
            cornerRadius={20}
          />
        )}
        
        {/* Basket with attached balloons */}
        <Basket attachedBalloons={attachedBalloons} isFloating={isFloating} />
        
        {/* Vendor Area Label */}
        <Group x={width / 2} y={420}>
          <Rect x={-80} y={0} width={160} height={30} fill="#8B4513" cornerRadius={5} />
          <Text x={-65} y={7} text="🎈 Balloon Shop" fontSize={16} fill="#FFFFFF" fontStyle="bold" />
        </Group>
      </Layer>

      {/* Available Balloons Layer */}
      <Layer>
        {availableBalloons.map((balloon) => (
          <DraggableBalloon
            key={balloon.id}
            balloon={balloon}
            onDragEnd={handleBalloonDragEnd}
            gamePhase={gamePhase}
          />
        ))}
      </Layer>

      {/* Attached Balloons Layer (Draggable to remove) */}
      <Layer>
        {attachedBalloons.map((balloon, index) => (
          <AttachedBalloon
            key={balloon.id}
            balloon={balloon}
            index={index}
            basketY={basketDisplayY}
            onDragEnd={handleAttachedBalloonDragEnd}
            gamePhase={gamePhase}
          />
        ))}
      </Layer>

      {/* Confetti Layer */}
      <ConfettiLayer show={showConfetti} width={width} height={height} />

      {/* Feedback Overlay Layer */}
      <Layer>
        {gamePhase === 'floating' && (
          <Group x={width / 2} y={height / 2}>
            <Text
              x={-80}
              y={0}
              text="🎉 Perfect!"
              fontSize={48}
              fontFamily="Arial"
              fontStyle="bold"
              fill="#10B981"
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          </Group>
        )}
        
        {currentSum > targetSum && gamePhase === 'playing' && (
          <Group x={width / 2} y={height / 2 - 50}>
            <Rect x={-160} y={-25} width={320} height={60} fill="#EF4444" cornerRadius={10} opacity={0.9} />
            <Text x={-150} y={-15} text="⚠️ Too heavy! Drag a balloon" fontSize={18} fill="#FFFFFF" fontStyle="bold" />
            <Text x={-80} y={8} text="out of the basket" fontSize={18} fill="#FFFFFF" fontStyle="bold" />
          </Group>
        )}
      </Layer>
    </Stage>
  );
};

export default BalloonBlastoffCanvas;
