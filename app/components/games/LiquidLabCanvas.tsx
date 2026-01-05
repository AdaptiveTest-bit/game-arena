'use client';

import React, { useRef } from 'react';
import { Stage, Layer, Rect, Text, Line } from 'react-konva';
import { useLiquidGameStore } from '@/app/store/useLiquidGameStore';
import Konva from 'konva';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;

// Container dimensions
const SOURCE_X = 100;
const SOURCE_Y = 80;
const SOURCE_WIDTH = 120;
const SOURCE_HEIGHT = 200;

const TARGET_X = 550;
const TARGET_Y = 100;
const TARGET_WIDTH = 80;
const TARGET_HEIGHT = 180;

// Mark spacing
const SOURCE_MARK_SPACING = SOURCE_HEIGHT / 6; // 6 marks for sixths
const TARGET_MARK_SPACING = TARGET_HEIGHT / 3; // 3 marks for thirds

interface LiquidLabCanvasProps {
  onPouring: (isPour: boolean) => void;
}

const LiquidLabCanvas: React.FC<LiquidLabCanvasProps> = ({ onPouring }) => {
  const stageRef = useRef<Konva.Stage>(null);
  const { sourceLiters, targetLiters, sourceCapacity, targetCapacity } = useLiquidGameStore();

  // Calculate liquid heights
  const sourceHeight = (sourceLiters / sourceCapacity) * SOURCE_HEIGHT;
  const targetHeight = (targetLiters / targetCapacity) * TARGET_HEIGHT;

  const sourceLiquidY = SOURCE_Y + SOURCE_HEIGHT - sourceHeight;
  const targetLiquidY = TARGET_Y + TARGET_HEIGHT - targetHeight;

  // Render graduation marks for source (sixths)
  const sourceMarks = [];
  for (let i = 1; i <= 6; i++) {
    const y = SOURCE_Y + SOURCE_HEIGHT - i * SOURCE_MARK_SPACING;
    const fraction = i === 3 ? '3/6\n(1/2)' : i === 6 ? '6/6\n(1)' : `${i}/6`;
    
    sourceMarks.push(
      <Line
        key={`source-mark-${i}`}
        points={[SOURCE_X - 10, y, SOURCE_X, y]}
        stroke="#666"
        strokeWidth={2}
      />
    );
    sourceMarks.push(
      <Text
        key={`source-label-${i}`}
        x={SOURCE_X - 50}
        y={y - 15}
        text={fraction}
        fontSize={10}
        fill="#666"
        align="center"
      />
    );
  }

  // Render graduation marks for target (thirds)
  const targetMarks = [];
  for (let i = 1; i <= 3; i++) {
    const y = TARGET_Y + TARGET_HEIGHT - i * TARGET_MARK_SPACING;
    const fraction = i === 1 ? '1/3' : i === 2 ? '2/3' : '3/3 (1)';
    
    targetMarks.push(
      <Line
        key={`target-mark-${i}`}
        points={[TARGET_X + TARGET_WIDTH, y, TARGET_X + TARGET_WIDTH + 10, y]}
        stroke="#666"
        strokeWidth={2}
      />
    );
    targetMarks.push(
      <Text
        key={`target-label-${i}`}
        x={TARGET_X + TARGET_WIDTH + 15}
        y={y - 15}
        text={fraction}
        fontSize={10}
        fill="#666"
        align="left"
      />
    );
  }

  // Target line indicator (1/3 = 2/6)
  const targetLineY = TARGET_Y + TARGET_HEIGHT - (1 / 3 / 1.0) * TARGET_HEIGHT;

  return (
    <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={stageRef}>
      <Layer>
        {/* Background */}
        <Rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#f5f5f5" />

        {/* Source Beaker */}
        <Rect
          x={SOURCE_X}
          y={SOURCE_Y}
          width={SOURCE_WIDTH}
          height={SOURCE_HEIGHT}
          fill="none"
          stroke="#333"
          strokeWidth={3}
        />

        {/* Source Liquid */}
        <Rect
          x={SOURCE_X + 2}
          y={sourceLiquidY}
          width={SOURCE_WIDTH - 4}
          height={sourceHeight}
          fill="#3b82f6"
          opacity={0.6}
        />

        {/* Source Labels */}
        <Text
          x={SOURCE_X + SOURCE_WIDTH / 2 - 20}
          y={SOURCE_Y - 30}
          text="Beaker"
          fontSize={14}
          fill="#333"
          fontStyle="bold"
        />
        <Text
          x={SOURCE_X}
          y={SOURCE_Y + SOURCE_HEIGHT + 10}
          text={`${sourceLiters.toFixed(3)}L`}
          fontSize={12}
          fill="#333"
        />

        {/* Source Marks */}
        {sourceMarks}

        {/* Target Test Tube */}
        <Rect
          x={TARGET_X}
          y={TARGET_Y}
          width={TARGET_WIDTH}
          height={TARGET_HEIGHT}
          fill="none"
          stroke="#333"
          strokeWidth={3}
        />

        {/* Target Liquid */}
        <Rect
          x={TARGET_X + 2}
          y={targetLiquidY}
          width={TARGET_WIDTH - 4}
          height={targetHeight}
          fill="#8b5cf6"
          opacity={0.6}
        />

        {/* Target Goal Line (1/3 L) */}
        <Line
          points={[TARGET_X - 10, targetLineY, TARGET_X + TARGET_WIDTH + 10, targetLineY]}
          stroke="#22c55e"
          strokeWidth={2}
          dash={[5, 5]}
        />
        <Text
          x={TARGET_X - 35}
          y={targetLineY - 15}
          text="GOAL:\n1/3 L"
          fontSize={11}
          fill="#22c55e"
          fontStyle="bold"
        />

        {/* Target Labels */}
        <Text
          x={TARGET_X + TARGET_WIDTH / 2 - 25}
          y={TARGET_Y - 30}
          text="Test Tube"
          fontSize={14}
          fill="#333"
          fontStyle="bold"
        />
        <Text
          x={TARGET_X}
          y={TARGET_Y + TARGET_HEIGHT + 10}
          text={`${targetLiters.toFixed(3)}L`}
          fontSize={12}
          fill="#333"
        />

        {/* Target Marks */}
        {targetMarks}

        {/* Arrow between containers */}
        <Line
          points={[SOURCE_X + SOURCE_WIDTH + 20, 150, TARGET_X - 20, 150]}
          stroke="#666"
          strokeWidth={2}
          opacity={0.3}
        />
        <Text
          x={
            (SOURCE_X + SOURCE_WIDTH + TARGET_X) / 2 - 20
          }
          y={120}
          text="Pour"
          fontSize={12}
          fill="#666"
          fontStyle="italic"
        />

        {/* Instructions */}
        <Text
          x={50}
          y={CANVAS_HEIGHT - 40}
          text="Remember: 1/3 = 2/6. Calculate the equivalent volume before stopping!"
          fontSize={11}
          fill="#666"
          fontStyle="italic"
        />
      </Layer>
    </Stage>
  );
};

export default LiquidLabCanvas;
