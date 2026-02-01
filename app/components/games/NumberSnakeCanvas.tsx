'use client';

import React, { useEffect, useRef } from 'react';
import { useNumberSnakeStore, GameType } from '../../store/useNumberSnakeStore';

interface NumberSnakeCanvasProps {
  width: number;
  height: number;
}

const TYPE_COLORS: Record<GameType, { primary: string; secondary: string; bg: string }> = {
  'counting-up': { primary: '#22c55e', secondary: '#16a34a', bg: '#dcfce7' },
  'counting-down': { primary: '#3b82f6', secondary: '#2563eb', bg: '#dbeafe' },
  'skip-counting-2': { primary: '#f59e0b', secondary: '#d97706', bg: '#fef3c7' },
  'skip-counting-5': { primary: '#ec4899', secondary: '#db2777', bg: '#fce7f3' },
  'skip-counting-10': { primary: '#8b5cf6', secondary: '#7c3aed', bg: '#ede9fe' },
};

const NumberSnakeCanvas: React.FC<NumberSnakeCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const {
    snake,
    numbers,
    gridSize,
    currentType,
    expectedNumber,
    gameOver,
    gameWon,
    gamePaused,
    gameStarted,
  } = useNumberSnakeStore();
  
  const cellSize = Math.min(width, height) / gridSize;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const colors = TYPE_COLORS[currentType];
    
    // Draw background grid
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(width, i * cellSize);
      ctx.stroke();
    }
    
    // Draw border
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);
    
    // Draw numbers
    numbers.forEach((numItem) => {
      if (numItem.collected) return;
      
      const x = numItem.x * cellSize + cellSize / 2;
      const y = numItem.y * cellSize + cellSize / 2;
      const radius = cellSize * 0.4;
      
      // Highlight expected number
      const isExpected = numItem.value === expectedNumber;
      
      // Draw circle background
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isExpected ? colors.primary : '#ffffff';
      ctx.fill();
      ctx.strokeStyle = isExpected ? colors.secondary : '#9ca3af';
      ctx.lineWidth = isExpected ? 3 : 2;
      ctx.stroke();
      
      // Pulsing effect for expected number
      if (isExpected) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = colors.primary + '60';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Draw number text
      ctx.fillStyle = isExpected ? '#ffffff' : '#374151';
      ctx.font = `bold ${cellSize * 0.35}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(numItem.value.toString(), x, y);
    });
    
    // Draw snake
    snake.forEach((segment, index) => {
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      const isHead = index === 0;
      
      // Draw segment
      ctx.fillStyle = isHead ? colors.primary : colors.secondary;
      ctx.beginPath();
      
      if (isHead) {
        // Draw head as rounded rectangle
        const padding = cellSize * 0.1;
        ctx.roundRect(
          x + padding,
          y + padding,
          cellSize - padding * 2,
          cellSize - padding * 2,
          cellSize * 0.3
        );
      } else {
        // Draw body segments
        const padding = cellSize * 0.15;
        ctx.roundRect(
          x + padding,
          y + padding,
          cellSize - padding * 2,
          cellSize - padding * 2,
          cellSize * 0.2
        );
      }
      ctx.fill();
      
      // Draw eyes on head
      if (isHead) {
        ctx.fillStyle = '#ffffff';
        const eyeSize = cellSize * 0.12;
        const eyeOffset = cellSize * 0.15;
        
        // Left eye
        ctx.beginPath();
        ctx.arc(x + cellSize * 0.35, y + cellSize * 0.35, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Right eye
        ctx.beginPath();
        ctx.arc(x + cellSize * 0.65, y + cellSize * 0.35, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = '#1f2937';
        ctx.beginPath();
        ctx.arc(x + cellSize * 0.35, y + cellSize * 0.35, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + cellSize * 0.65, y + cellSize * 0.35, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Show collected number on body segment
      if (!isHead && segment.number) {
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${cellSize * 0.3}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(segment.number.toString(), x + cellSize / 2, y + cellSize / 2);
      }
    });
    
    // Draw game over overlay
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GAME OVER', width / 2, height / 2 - 30);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.fillText('Press RESTART to try again', width / 2, height / 2 + 30);
    }
    
    // Draw game won overlay
    if (gameWon) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎉 YOU WON! 🎉', width / 2, height / 2 - 30);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.fillText('All counting challenges completed!', width / 2, height / 2 + 30);
    }
    
    // Draw paused overlay
    if (gamePaused && gameStarted) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PAUSED', width / 2, height / 2);
    }
    
    // Draw start screen
    if (!gameStarted && !gameOver && !gameWon) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐍 NUMBER SNAKE 🐍', width / 2, height / 2 - 60);
      
      ctx.font = '20px Arial';
      ctx.fillText('Learn counting from 1 to 100!', width / 2, height / 2 - 10);
      ctx.fillText('Use Arrow Keys to move the snake', width / 2, height / 2 + 30);
      ctx.fillText('Eat numbers in the correct order!', width / 2, height / 2 + 60);
      
      ctx.fillStyle = colors.primary;
      ctx.font = 'bold 24px Arial';
      ctx.fillText('Click START to begin!', width / 2, height / 2 + 110);
    }
    
  }, [snake, numbers, gridSize, cellSize, width, height, currentType, expectedNumber, gameOver, gameWon, gamePaused, gameStarted]);
  
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: '2px solid #374151',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      }}
    />
  );
};

export default NumberSnakeCanvas;
