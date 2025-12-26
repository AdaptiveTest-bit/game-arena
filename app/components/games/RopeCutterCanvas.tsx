'use client';

import React, { useRef, useState } from 'react';
import { Stage, Layer, Line, Text, Circle, Rect, Group } from 'react-konva';
import { useGameStore, type CutLocation } from '@/app/store/useGameStore';
import { formatLength } from '@/app/utils/gameUtils';
import Konva from 'konva';

interface RopeCutterCanvasProps {
  width: number;
  height: number;
  onCut: (location: number) => boolean;
}

const ROPE_Y = 100;
const ROPE_HEIGHT = 20;
const RULER_Y = 150;
const GRID_START_X = 50;
const GRID_END_X = 950;

const RopeCutterCanvas: React.FC<RopeCutterCanvasProps> = ({
  width,
  height,
  onCut,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [cursorX, setCursorX] = useState(0);
  const [hoveredCut, setHoveredCut] = useState<number | null>(null);
  const [frayingPosition, setFrayingPosition] = useState<number | null>(null);

  const { cuts, getExpectedCutPositions, totalLength } = useGameStore();

  const pixelsPerMeter = (GRID_END_X - GRID_START_X) / totalLength;

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (stageRef.current) {
      const pos = stageRef.current.getPointerPosition();
      if (pos) {
        setCursorX(pos.x);
      }
    }
  };

  const handleCanvasClick = () => {
    const meterPosition = (cursorX - GRID_START_X) / pixelsPerMeter;

    if (meterPosition >= 0 && meterPosition <= totalLength) {
      const isValid = onCut(meterPosition);

      if (!isValid) {
        setFrayingPosition(meterPosition);
        setTimeout(() => setFrayingPosition(null), 500);
      }
    }
  };

  const rulerMarkings = [];
  for (let i = 0; i <= totalLength; i++) {
    const x = GRID_START_X + i * pixelsPerMeter;
    rulerMarkings.push(
      <Line
        key={`ruler-line-${i}`}
        points={[x, RULER_Y, x, RULER_Y + 10]}
        stroke="#ccc"
        strokeWidth={1}
      />
    );
    rulerMarkings.push(
      <Text
        key={`ruler-text-${i}`}
        x={x - 10}
        y={RULER_Y + 15}
        text={`${i}m`}
        fontSize={12}
        fill="#666"
      />
    );
  }

  const expectedPositions = getExpectedCutPositions();
  const expectedCutLines = expectedPositions.map((pos: number, idx: number) => (
    <Line
      key={`expected-cut-${idx}`}
      points={[
        GRID_START_X + pos * pixelsPerMeter,
        ROPE_Y - 10,
        GRID_START_X + pos * pixelsPerMeter,
        ROPE_Y + ROPE_HEIGHT + 10,
      ]}
      stroke="#e0e0e0"
      strokeWidth={2}
      dash={[5, 5]}
      opacity={0.5}
    />
  ));

  const cutMarkers = cuts.map((cut: CutLocation, idx: number) => {
    const pixelX = GRID_START_X + cut.location * pixelsPerMeter;
    const isHovered = hoveredCut === idx;

    return (
      <Group key={`cut-${idx}`}>
        <Line
          points={[pixelX, ROPE_Y - 15, pixelX, ROPE_Y + ROPE_HEIGHT + 15]}
          stroke={cut.isValid ? '#4CAF50' : '#FF6B6B'}
          strokeWidth={cut.isValid ? 3 : 4}
          opacity={isHovered ? 1 : 0.8}
        />
        <Circle
          x={pixelX}
          y={ROPE_Y + ROPE_HEIGHT / 2}
          radius={isHovered ? 8 : 6}
          fill={cut.isValid ? '#4CAF50' : '#FF6B6B'}
          opacity={0.7}
          onMouseEnter={() => setHoveredCut(idx)}
          onMouseLeave={() => setHoveredCut(null)}
        />
        <Text
          x={pixelX - 15}
          y={ROPE_Y - 35}
          text={formatLength(cut.location)}
          fontSize={11}
          fill={cut.isValid ? '#4CAF50' : '#FF6B6B'}
          visible={isHovered}
        />
      </Group>
    );
  });

  const cursorIndicator = cursorX > GRID_START_X && cursorX < GRID_END_X && (
    <Group>
      <Line
        points={[cursorX, ROPE_Y - 30, cursorX, ROPE_Y + ROPE_HEIGHT + 30]}
        stroke="#FF9800"
        strokeWidth={1}
        opacity={0.5}
        dash={[3, 3]}
      />
      <Text x={cursorX - 5} y={ROPE_Y - 50} text="✂️" fontSize={20} />
    </Group>
  );

  const frayAnimation = frayingPosition !== null && (
    <Rect
      x={GRID_START_X + frayingPosition * pixelsPerMeter - 20}
      y={ROPE_Y - 20}
      width={40}
      height={ROPE_HEIGHT + 40}
      fill="#FF6B6B"
      opacity={0.3}
    />
  );

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      onClick={handleCanvasClick}
      style={{
        cursor: cursorX > GRID_START_X && cursorX < GRID_END_X ? 'crosshair' : 'default',
      }}
    >
      <Layer>
        <Rect width={width} height={height} fill="#f9f9f9" />

        <Rect
          x={GRID_START_X}
          y={ROPE_Y}
          width={GRID_END_X - GRID_START_X}
          height={ROPE_HEIGHT}
          fill="#D2691E"
          stroke="#8B4513"
          strokeWidth={2}
          cornerRadius={5}
        />

        {expectedCutLines}

        <Line
          points={[GRID_START_X, RULER_Y, GRID_END_X, RULER_Y]}
          stroke="#bbb"
          strokeWidth={2}
        />
        {rulerMarkings}

        {cutMarkers}

        {cursorIndicator}

        {frayAnimation}

        <Text
          x={GRID_START_X}
          y={height - 30}
          text="Click on the rope to cut it into 2.5m pieces"
          fontSize={13}
          fill="#666"
          fontStyle="italic"
        />
      </Layer>
    </Stage>
  );
};

export default RopeCutterCanvas;
