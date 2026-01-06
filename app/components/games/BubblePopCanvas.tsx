'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Circle, Text, Group, Rect, Line } from 'react-konva';
import Konva from 'konva';
import { Bubble } from '@/app/store/useBubblePopStore';

// ============================================
// TYPES
// ============================================

interface BubblePopCanvasProps {
  width: number;
  height: number;
  startingBubbles: number;
  targetRemaining: number;
  bubblesToPop: number;
  bubbles: Bubble[];
  poppedCount: number;
  remainingCount: number;
  gamePhase: 'menu' | 'playing' | 'success' | 'overpop' | 'celebrating';
  onPopBubble: (bubbleId: string) => void;
}

// ============================================
// BUBBLE COLORS WITH GRADIENTS
// ============================================

const BUBBLE_GRADIENTS: Record<string, { light: string; dark: string }> = {
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
  '#FF9FF3': { light: '#FFB8F7', dark: '#E580D9' },
  '#54A0FF': { light: '#76B4FF', dark: '#3A8CE5' },
  '#5F27CD': { light: '#7B4FD9', dark: '#4A1FA3' },
  '#00D2D3': { light: '#33DCDD', dark: '#00B8B9' },
  '#FF6B81': { light: '#FF8A9A', dark: '#E55567' },
};

// ============================================
// POP PARTICLES COMPONENT
// ============================================

interface PopParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
}

// ============================================
// SINGLE BUBBLE COMPONENT
// ============================================

interface BubbleComponentProps {
  bubble: Bubble;
  onPop: (id: string) => void;
  isGameActive: boolean;
}

const BubbleComponent: React.FC<BubbleComponentProps> = ({ bubble, onPop, isGameActive }) => {
  const groupRef = useRef<Konva.Group>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPopping, setIsPopping] = React.useState(false);
  const [showParticles, setShowParticles] = React.useState(false);
  const [particles, setParticles] = React.useState<PopParticle[]>([]);
  
  // Floating animation
  useEffect(() => {
    if (bubble.isPopped || !groupRef.current) return;
    
    const anim = new Konva.Animation((frame) => {
      if (!frame || !groupRef.current) return;
      const offset = Math.sin((frame.time / 1000) * 1.5 + bubble.x * 0.01) * 4;
      groupRef.current.y(bubble.baseY + offset);
    }, groupRef.current.getLayer());
    
    anim.start();
    return () => {
      anim.stop();
    };
  }, [bubble.isPopped, bubble.baseY, bubble.x]);

  const handleClick = useCallback(() => {
    if (bubble.isPopped || !isGameActive || isPopping) return;
    
    setIsPopping(true);
    
    // Generate particles
    const newParticles: PopParticle[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      newParticles.push({
        id: `particle-${i}`,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * 3,
        vy: Math.sin(angle) * 3,
        radius: 4 + Math.random() * 4,
        color: bubble.color,
        opacity: 1,
      });
    }
    setParticles(newParticles);
    setShowParticles(true);
    
    // Animate pop
    if (groupRef.current) {
      const node = groupRef.current;
      node.to({
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 0.1,
        onFinish: () => {
          node.to({
            scaleX: 0,
            scaleY: 0,
            opacity: 0,
            duration: 0.15,
            onFinish: () => {
              onPop(bubble.id);
            },
          });
        },
      });
    }
    
    // Animate particles
    setTimeout(() => setShowParticles(false), 300);
  }, [bubble.id, bubble.isPopped, bubble.color, isGameActive, isPopping, onPop]);

  if (bubble.isPopped && !isPopping) return null;

  const gradient = BUBBLE_GRADIENTS[bubble.color] || { light: bubble.color, dark: bubble.color };

  return (
    <Group
      ref={groupRef}
      x={bubble.x}
      y={bubble.y}
      onClick={handleClick}
      onTap={handleClick}
      onMouseEnter={() => {
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Main bubble */}
      <Circle
        radius={bubble.radius * (isHovered ? 1.1 : 1)}
        fill={bubble.color}
        stroke={gradient.dark}
        strokeWidth={2}
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={10}
        shadowOffsetY={3}
      />
      
      {/* Shine highlight */}
      <Circle
        x={-bubble.radius * 0.25}
        y={-bubble.radius * 0.25}
        radius={bubble.radius * 0.25}
        fill="rgba(255,255,255,0.6)"
      />
      
      {/* Small shine */}
      <Circle
        x={-bubble.radius * 0.35}
        y={-bubble.radius * 0.45}
        radius={bubble.radius * 0.1}
        fill="rgba(255,255,255,0.8)"
      />
      
      {/* Particles */}
      {showParticles && particles.map((p, i) => (
        <Circle
          key={p.id}
          x={p.vx * 10 * (i * 0.2 + 1)}
          y={p.vy * 10 * (i * 0.2 + 1)}
          radius={p.radius}
          fill={p.color}
          opacity={0.7}
        />
      ))}
    </Group>
  );
};

// ============================================
// PUPPY CHARACTER COMPONENT
// ============================================

interface PuppyProps {
  x: number;
  y: number;
  mood: 'happy' | 'worried' | 'celebrating' | 'idle';
}

const Puppy: React.FC<PuppyProps> = ({ x, y, mood }) => {
  const groupRef = useRef<Konva.Group>(null);
  
  // Breathing/bounce animation
  useEffect(() => {
    if (!groupRef.current) return;
    
    const anim = new Konva.Animation((frame) => {
      if (!frame || !groupRef.current) return;
      
      let scale = 1;
      let offsetY = 0;
      
      if (mood === 'celebrating') {
        scale = 1 + Math.sin(frame.time / 100) * 0.1;
        offsetY = Math.abs(Math.sin(frame.time / 150)) * -15;
      } else if (mood === 'happy') {
        scale = 1 + Math.sin(frame.time / 300) * 0.03;
      } else if (mood === 'worried') {
        offsetY = Math.sin(frame.time / 100) * 2;
      } else {
        scale = 1 + Math.sin(frame.time / 500) * 0.02;
      }
      
      groupRef.current.scaleX(scale);
      groupRef.current.scaleY(scale);
      groupRef.current.offsetY(-offsetY);
    }, groupRef.current.getLayer());
    
    anim.start();
    return () => {
      anim.stop();
    };
  }, [mood]);

  return (
    <Group ref={groupRef} x={x} y={y}>
      {/* Body */}
      <Circle
        y={20}
        radius={35}
        fill="#D4A574"
      />
      
      {/* Head */}
      <Circle
        y={-15}
        radius={30}
        fill="#E8C4A0"
      />
      
      {/* Ears */}
      <Circle
        x={-25}
        y={-35}
        radius={15}
        fill="#D4A574"
        rotation={mood === 'worried' ? 30 : -15}
      />
      <Circle
        x={25}
        y={-35}
        radius={15}
        fill="#D4A574"
        rotation={mood === 'worried' ? -30 : 15}
      />
      
      {/* Eyes */}
      <Circle
        x={-10}
        y={-18}
        radius={6}
        fill="#000"
      />
      <Circle
        x={10}
        y={-18}
        radius={6}
        fill="#000"
      />
      
      {/* Eye shine */}
      <Circle
        x={-8}
        y={-20}
        radius={2}
        fill="#FFF"
      />
      <Circle
        x={12}
        y={-20}
        radius={2}
        fill="#FFF"
      />
      
      {/* Nose */}
      <Circle
        y={-5}
        radius={5}
        fill="#333"
      />
      
      {/* Mouth */}
      {mood === 'happy' || mood === 'celebrating' ? (
        <Line
          points={[-8, 2, 0, 8, 8, 2]}
          stroke="#333"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
      ) : (
        <Line
          points={[-6, 5, 6, 5]}
          stroke="#333"
          strokeWidth={2}
          lineCap="round"
        />
      )}
      
      {/* Tail (wagging for happy) */}
      <Line
        points={[30, 25, 45, mood === 'happy' ? 10 : 20, 55, mood === 'happy' ? 5 : 25]}
        stroke="#D4A574"
        strokeWidth={8}
        lineCap="round"
        lineJoin="round"
      />
      
      {/* Celebration stars */}
      {mood === 'celebrating' && (
        <>
          <Text x={-50} y={-60} text="⭐" fontSize={20} />
          <Text x={40} y={-55} text="✨" fontSize={18} />
          <Text x={-35} y={-75} text="🎉" fontSize={16} />
        </>
      )}
    </Group>
  );
};

// ============================================
// INFO PANEL COMPONENT
// ============================================

interface InfoPanelProps {
  x: number;
  y: number;
  startingBubbles: number;
  targetRemaining: number;
  remainingCount: number;
  poppedCount: number;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  x, y, startingBubbles, targetRemaining, remainingCount, poppedCount
}) => {
  return (
    <Group x={x} y={y}>
      {/* Background */}
      <Rect
        x={-160}
        y={-30}
        width={320}
        height={60}
        fill="#FFFFFF"
        cornerRadius={15}
        shadowColor="rgba(0,0,0,0.15)"
        shadowBlur={10}
        shadowOffsetY={3}
        stroke="#E0E0E0"
        strokeWidth={2}
      />
      
      {/* Start info */}
      <Text
        x={-150}
        y={-20}
        text={`START: ${startingBubbles}`}
        fontSize={16}
        fontStyle="bold"
        fill="#666"
      />
      
      {/* Arrow */}
      <Text
        x={-40}
        y={-20}
        text="→"
        fontSize={20}
        fill="#888"
      />
      
      {/* Target */}
      <Text
        x={-10}
        y={-20}
        text={`TARGET: ${targetRemaining}`}
        fontSize={16}
        fontStyle="bold"
        fill="#10B981"
      />
      
      {/* Current status */}
      <Text
        x={-150}
        y={5}
        text={`Remaining: ${remainingCount}`}
        fontSize={14}
        fill="#3B82F6"
      />
      
      <Text
        x={20}
        y={5}
        text={`Popped: ${poppedCount}`}
        fontSize={14}
        fill="#EF4444"
      />
    </Group>
  );
};

// ============================================
// EQUATION DISPLAY
// ============================================

interface EquationDisplayProps {
  x: number;
  y: number;
  startingBubbles: number;
  targetRemaining: number;
  poppedCount: number;
}

const EquationDisplay: React.FC<EquationDisplayProps> = ({
  x, y, startingBubbles, targetRemaining, poppedCount
}) => {
  return (
    <Group x={x} y={y}>
      <Rect
        x={-120}
        y={-25}
        width={240}
        height={50}
        fill="#FEF3C7"
        cornerRadius={10}
        stroke="#F59E0B"
        strokeWidth={2}
      />
      
      <Text
        x={-100}
        y={-10}
        text={`${startingBubbles} - `}
        fontSize={24}
        fontStyle="bold"
        fill="#92400E"
      />
      
      <Rect
        x={-20}
        y={-15}
        width={40}
        height={35}
        fill="#FFFFFF"
        cornerRadius={5}
        stroke="#D97706"
        strokeWidth={2}
      />
      
      <Text
        x={-10}
        y={-8}
        text={poppedCount > 0 ? `${poppedCount}` : '?'}
        fontSize={22}
        fontStyle="bold"
        fill={poppedCount > 0 ? '#DC2626' : '#9CA3AF'}
        align="center"
      />
      
      <Text
        x={30}
        y={-10}
        text={` = ${targetRemaining}`}
        fontSize={24}
        fontStyle="bold"
        fill="#92400E"
      />
    </Group>
  );
};

// ============================================
// CONFETTI LAYER
// ============================================

interface ConfettiLayerProps {
  show: boolean;
  width: number;
  height: number;
}

const ConfettiLayer: React.FC<ConfettiLayerProps> = ({ show, width, height }) => {
  const layerRef = useRef<Konva.Layer>(null);
  const confettiRef = useRef<Array<{ shape: Konva.Circle; vx: number; vy: number; gravity: number }>>([]);
  
  useEffect(() => {
    if (!show || !layerRef.current) return;
    
    const layer = layerRef.current;
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF9FF3'];
    
    // Create confetti particles
    for (let i = 0; i < 50; i++) {
      const circle = new Konva.Circle({
        x: Math.random() * width,
        y: -20,
        radius: 4 + Math.random() * 4,
        fill: colors[Math.floor(Math.random() * colors.length)],
      });
      
      layer.add(circle);
      confettiRef.current.push({
        shape: circle,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        gravity: 0.1,
      });
    }
    
    const anim = new Konva.Animation((frame) => {
      if (!frame) return;
      
      confettiRef.current.forEach((particle) => {
        particle.vy += particle.gravity;
        particle.shape.x(particle.shape.x() + particle.vx);
        particle.shape.y(particle.shape.y() + particle.vy);
        particle.shape.rotation(particle.shape.rotation() + 5);
        
        if (particle.shape.y() > height + 20) {
          particle.shape.y(-20);
          particle.shape.x(Math.random() * width);
          particle.vy = Math.random() * 3 + 2;
        }
      });
    }, layer);
    
    anim.start();
    
    return () => {
      anim.stop();
      confettiRef.current.forEach((p) => p.shape.destroy());
      confettiRef.current = [];
    };
  }, [show, width, height]);
  
  if (!show) return null;
  
  return <Layer ref={layerRef} />;
};

// ============================================
// MAIN CANVAS COMPONENT
// ============================================

export const BubblePopCanvas: React.FC<BubblePopCanvasProps> = ({
  width,
  height,
  startingBubbles,
  targetRemaining,
  bubblesToPop,
  bubbles,
  poppedCount,
  remainingCount,
  gamePhase,
  onPopBubble,
}) => {
  const isGameActive = gamePhase === 'playing' || gamePhase === 'overpop';
  const showConfetti = gamePhase === 'success' || gamePhase === 'celebrating';
  
  // Determine puppy mood
  let puppyMood: 'happy' | 'worried' | 'celebrating' | 'idle' = 'idle';
  if (gamePhase === 'success' || gamePhase === 'celebrating') {
    puppyMood = 'celebrating';
  } else if (gamePhase === 'overpop') {
    puppyMood = 'worried';
  } else if (poppedCount > 0 && remainingCount >= targetRemaining) {
    puppyMood = 'happy';
  }

  return (
    <Stage width={width} height={height}>
      {/* Background Layer */}
      <Layer>
        {/* Sky gradient background */}
        <Rect
          width={width}
          height={height}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 0, y: height }}
          fillLinearGradientColorStops={[0, '#E0F7FA', 0.5, '#B2EBF2', 1, '#80DEEA']}
        />
        
        {/* Grass */}
        <Rect
          x={0}
          y={height - 80}
          width={width}
          height={80}
          fill="#4CAF50"
        />
        
        {/* Grass detail */}
        <Rect
          x={0}
          y={height - 80}
          width={width}
          height={10}
          fill="#66BB6A"
        />
        
        {/* Decorative clouds */}
        <Group x={50} y={30}>
          <Circle radius={25} fill="#FFFFFF" opacity={0.8} />
          <Circle x={30} radius={30} fill="#FFFFFF" opacity={0.8} />
          <Circle x={60} radius={20} fill="#FFFFFF" opacity={0.8} />
        </Group>
        
        <Group x={width - 120} y={50}>
          <Circle radius={20} fill="#FFFFFF" opacity={0.7} />
          <Circle x={25} radius={25} fill="#FFFFFF" opacity={0.7} />
          <Circle x={50} radius={18} fill="#FFFFFF" opacity={0.7} />
        </Group>
        
        {/* Sun */}
        <Circle
          x={width - 60}
          y={60}
          radius={35}
          fill="#FFD93D"
          shadowColor="#FFD93D"
          shadowBlur={20}
        />
      </Layer>

      {/* Info Panel Layer */}
      <Layer>
        <InfoPanel
          x={width / 2}
          y={45}
          startingBubbles={startingBubbles}
          targetRemaining={targetRemaining}
          remainingCount={remainingCount}
          poppedCount={poppedCount}
        />
      </Layer>

      {/* Bubbles Layer */}
      <Layer>
        {bubbles.map((bubble) => (
          <BubbleComponent
            key={bubble.id}
            bubble={bubble}
            onPop={onPopBubble}
            isGameActive={isGameActive}
          />
        ))}
      </Layer>

      {/* Puppy Layer */}
      <Layer>
        <Puppy
          x={70}
          y={height - 130}
          mood={puppyMood}
        />
      </Layer>

      {/* Equation Layer */}
      <Layer>
        <EquationDisplay
          x={width / 2}
          y={height - 35}
          startingBubbles={startingBubbles}
          targetRemaining={targetRemaining}
          poppedCount={poppedCount}
        />
      </Layer>

      {/* Confetti Layer */}
      <ConfettiLayer show={showConfetti} width={width} height={height} />

      {/* Overlay Messages */}
      <Layer>
        {gamePhase === 'success' && (
          <Group x={width / 2} y={height / 2 - 50}>
            <Rect
              x={-150}
              y={-40}
              width={300}
              height={80}
              fill="#10B981"
              cornerRadius={20}
              shadowColor="rgba(0,0,0,0.3)"
              shadowBlur={15}
            />
            <Text
              x={-130}
              y={-25}
              text="🎉 Perfect! You did it!"
              fontSize={28}
              fontStyle="bold"
              fill="#FFFFFF"
            />
          </Group>
        )}
        
        {gamePhase === 'overpop' && (
          <Group x={width / 2} y={height / 2 - 50}>
            <Rect
              x={-160}
              y={-40}
              width={320}
              height={80}
              fill="#EF4444"
              cornerRadius={20}
              shadowColor="rgba(0,0,0,0.3)"
              shadowBlur={15}
            />
            <Text
              x={-140}
              y={-25}
              text="⚠️ Oops! Too many popped!"
              fontSize={24}
              fontStyle="bold"
              fill="#FFFFFF"
            />
            <Text
              x={-80}
              y={5}
              text="Use Undo to fix it!"
              fontSize={18}
              fill="#FECACA"
            />
          </Group>
        )}
      </Layer>
    </Stage>
  );
};

export default BubblePopCanvas;
