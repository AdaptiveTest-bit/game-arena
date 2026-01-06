
import React, { useEffect, useRef } from 'react';
import { useTimeShapeLogicStore } from '@/app/store/useTimeShapeLogicStore';

interface TimeShapeLogicCanvasProps {
  width: number;
  height: number;
  onAnswerSelect: (answerIndex: number) => void;
  level: number;
}

const TimeShapeLogicCanvas: React.FC<TimeShapeLogicCanvasProps> = ({
  width,
  height,
  onAnswerSelect,
  level,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    currentQuestion,
    selectedAnswer,
    answered,
    showFeedback,
    consecutiveCorrect,
  } = useTimeShapeLogicStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentQuestion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, width, height);

    // Question box
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    roundRect(ctx, 50, 20, width - 100, 70, 10, true, false);

    // Question text
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    
    // Word wrap for question
    const words = currentQuestion.question.split(' ');
    let line = '';
    let y = 50;
    const maxWidth = width - 140;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, width / 2, y);
        line = words[i] + ' ';
        y += 30;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);

    // Skill badge
    ctx.fillStyle = '#dbeafe';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(currentQuestion.skill, width / 2, 100);

    // Answer options
    const optionWidth = (width - 160) / 2;
    const optionHeight = 70;
    const startX = 80;
    const startY = 140;

    currentQuestion.options.forEach((option, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const x = startX + col * (optionWidth + 40);
      const y = startY + row * (optionHeight + 25);

      // Check if this option is selected or correct
      const isSelected = selectedAnswer === index;
      const isCorrect = index === currentQuestion.correctAnswer;
      const showResult = showFeedback;

      // Button background
      if (showResult) {
        if (isCorrect) {
          ctx.fillStyle = '#dcfce7';
          ctx.strokeStyle = '#22c55e';
        } else if (isSelected && !isCorrect) {
          ctx.fillStyle = '#fee2e2';
          ctx.strokeStyle = '#ef4444';
        } else {
          ctx.fillStyle = '#f3f4f6';
          ctx.strokeStyle = '#d1d5db';
        }
      } else {
        if (isSelected) {
          ctx.fillStyle = '#fce7f3';
          ctx.strokeStyle = '#ec4899';
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#d1d5db';
        }
      }

      ctx.lineWidth = 2;
      roundRect(ctx, x, y, optionWidth, optionHeight, 10, true, true);

      // Option letter
      ctx.fillStyle = '#6b7280';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(String.fromCharCode(65 + index) + ')', x + 12, y + 25);

      // Option value
      ctx.fillStyle = showResult && isCorrect ? '#166534' : showResult && isSelected && !isCorrect ? '#991b1b' : '#1f2937';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(option), x + optionWidth / 2, y + 48);
    });

    // Streak indicator
    if (consecutiveCorrect > 2) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`🔥 ${consecutiveCorrect} Streak!`, width / 2, height - 15);
    }

    // Auto-advance timer
    if (answered && showFeedback) {
      const remaining = Math.ceil(2000 / 1000); // 2 seconds
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`Next in ${remaining}s`, width - 30, height - 15);
    }

  }, [currentQuestion, selectedAnswer, answered, showFeedback, width, height, level, consecutiveCorrect]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (answered || !currentQuestion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const optionWidth = (width - 160) / 2;
    const optionHeight = 70;
    const startX = 80;
    const startY = 140;

    currentQuestion.options.forEach((_option, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const btnX = startX + col * (optionWidth + 40);
      const btnY = startY + row * (optionHeight + 25);

      if (x >= btnX && x <= btnX + optionWidth && y >= btnY && y <= btnY + optionHeight) {
        onAnswerSelect(index);
      }
    });
  };

  // Helper function for rounded rectangles
  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number,
    fill: boolean,
    stroke: boolean
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={handleClick}
      className="w-full cursor-pointer"
      style={{ borderRadius: '8px' }}
    />
  );
};

export default TimeShapeLogicCanvas;


