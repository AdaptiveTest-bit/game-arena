'use client';

import React, { useEffect, useRef } from 'react';
import { useAdditionSnakeStore } from '../../store/useAdditionSnakeStore';

interface AdditionSnakeCanvasProps {
  width: number;
  height: number;
}

const DIFFICULTY_COLORS = {
  easy: { primary: '#22c55e', secondary: '#16a34a', bg: '#dcfce7', border: '#15803d' },
  medium: { primary: '#f59e0b', secondary: '#d97706', bg: '#fef3c7', border: '#b45309' },
  hard: { primary: '#ef4444', secondary: '#dc2626', bg: '#fee2e2', border: '#b91c1c' },
};

const AdditionSnakeCanvas: React.FC<AdditionSnakeCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const {
    snake,
    answers,
    gridSize,
    currentQuestion,
    difficulty,
    gameOver,
    gamePaused,
    gameStarted,
  } = useAdditionSnakeStore();
  
  const cellSize = Math.min(width, height) / gridSize;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const colors = DIFFICULTY_COLORS[difficulty];
    
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
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);
    
    // Draw answers
    answers.forEach((answer) => {
      if (answer.collected) return;
      
      const x = answer.x * cellSize + cellSize / 2;
      const y = answer.y * cellSize + cellSize / 2;
      const radius = cellSize * 0.42;
      
      // Draw circle background
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      
      // Different colors for visual distinction
      const hue = (answer.value * 37) % 360;
      ctx.fillStyle = `hsl(${hue}, 70%, 85%)`;
      ctx.fill();
      ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw number text
      ctx.fillStyle = '#1f2937';
      ctx.font = `bold ${cellSize * 0.4}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(answer.value.toString(), x, y);
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
        const padding = cellSize * 0.08;
        ctx.roundRect(
          x + padding,
          y + padding,
          cellSize - padding * 2,
          cellSize - padding * 2,
          cellSize * 0.3
        );
        ctx.fill();
        
        // Draw eyes
        ctx.fillStyle = '#ffffff';
        const eyeSize = cellSize * 0.12;
        
        // Left eye
        ctx.beginPath();
        ctx.arc(x + cellSize * 0.32, y + cellSize * 0.35, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Right eye
        ctx.beginPath();
        ctx.arc(x + cellSize * 0.68, y + cellSize * 0.35, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = '#1f2937';
        ctx.beginPath();
        ctx.arc(x + cellSize * 0.32, y + cellSize * 0.35, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + cellSize * 0.68, y + cellSize * 0.35, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw question on head
        if (currentQuestion) {
          // Question bubble above head
          const bubbleY = y - cellSize * 0.8;
          const bubbleWidth = cellSize * 2.5;
          const bubbleHeight = cellSize * 0.7;
          const bubbleX = x + cellSize / 2 - bubbleWidth / 2;
          
          // Make sure bubble stays on screen
          const adjustedX = Math.max(5, Math.min(bubbleX, width - bubbleWidth - 5));
          const adjustedY = Math.max(5, bubbleY);
          
          // Draw bubble
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = colors.primary;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(adjustedX, adjustedY, bubbleWidth, bubbleHeight, 8);
          ctx.fill();
          ctx.stroke();
          
          // Draw question text
          ctx.fillStyle = '#1f2937';
          ctx.font = `bold ${cellSize * 0.4}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            currentQuestion.questionText,
            adjustedX + bubbleWidth / 2,
            adjustedY + bubbleHeight / 2
          );
        }
      } else {
        // Draw body segments
        const padding = cellSize * 0.12;
        ctx.roundRect(
          x + padding,
          y + padding,
          cellSize - padding * 2,
          cellSize - padding * 2,
          cellSize * 0.2
        );
        ctx.fill();
        
        // Show collected answer on body segment
        if (segment.value) {
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${cellSize * 0.35}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(segment.value.toString(), x + cellSize / 2, y + cellSize / 2);
        }
      }
    });
    
    // Draw game over overlay
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 52px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GAME OVER', width / 2, height / 2 - 40);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.fillText('Press RESTART to try again', width / 2, height / 2 + 20);
      
      ctx.font = '20px Arial';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('Keep practicing addition!', width / 2, height / 2 + 60);
    }
    
    // Draw paused overlay
    if (gamePaused && gameStarted) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 52px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⏸️ PAUSED', width / 2, height / 2);
    }
    
    // Draw start screen
    if (!gameStarted && !gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐍 ADDITION SNAKE ➕', width / 2, height / 2 - 80);
      
      ctx.font = '22px Arial';
      ctx.fillText('Master Addition from 1 to 100!', width / 2, height / 2 - 30);
      
      ctx.font = '18px Arial';
      ctx.fillStyle = '#a5f3fc';
      ctx.fillText('🎯 Eat the CORRECT answer to grow!', width / 2, height / 2 + 20);
      ctx.fillText('⬆️⬇️⬅️➡️ Use Arrow Keys to move', width / 2, height / 2 + 50);
      ctx.fillText('❌ Avoid walls and wrong answers!', width / 2, height / 2 + 80);
      
      ctx.fillStyle = colors.primary;
      ctx.font = 'bold 26px Arial';
      ctx.fillText('Click START to begin!', width / 2, height / 2 + 130);
    }
    
  }, [snake, answers, gridSize, cellSize, width, height, currentQuestion, difficulty, gameOver, gamePaused, gameStarted]);
  
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: '3px solid #374151',
        borderRadius: '16px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
      }}
    />
  );
};

export default AdditionSnakeCanvas;
