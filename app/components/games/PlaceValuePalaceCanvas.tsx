'use client';

import React from 'react';
import { Stage, Layer, Group, Circle, Rect, Text, Line } from 'react-konva';
import { useShadowStoryStore } from '../../store/useShadowStoryStore';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;

// Pre-generated stars
const STARS = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  x: 50 + (i * 137.5) % 500,
  y: 10 + (i * 23) % 80,
  radius: 1 + (i % 3),
}));

export default function PlaceValuePalaceCanvas() {
  const { placeValueChallenge, placeTens, placeOnes, submitPlaceValue } = useShadowStoryStore();

  if (!placeValueChallenge) {
    return (
      <div className="flex items-center justify-center h-[450px]">
        <p className="text-purple-300">Loading palace...</p>
      </div>
    );
  }

  const { targetNumber, placedTens, placedOnes, attempts, isCorrect } = placeValueChallenge;
  const playerAnswer = placedTens * 10 + placedOnes;

  return (
    <div className="relative">
      {/* Target Display */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl px-6 py-3 border-2 border-yellow-400/50">
        <p className="text-purple-200 text-sm text-center">Make this number:</p>
        <p className="text-5xl font-bold text-yellow-400 text-center">{targetNumber}</p>
      </div>

      {/* Attempts Display */}
      <div className="absolute top-4 right-4 z-10 bg-purple-900/80 rounded-xl px-3 py-2 border border-purple-500/50">
        <p className="text-purple-200 text-xs">Attempts: {attempts}</p>
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

          {/* Palace Structure */}
          {/* Roof */}
          <Line
            points={[100, 130, 300, 80, 500, 130]}
            fill="#4a3a6a"
            closed={true}
            stroke="#8b5cf6"
            strokeWidth={3}
          />

          {/* Palace body */}
          <Rect
            x={120}
            y={130}
            width={360}
            height={220}
            fill="#2a2a4a"
            stroke="#8b5cf6"
            strokeWidth={2}
            cornerRadius={5}
          />

          {/* Divider */}
          <Line
            points={[300, 130, 300, 350]}
            stroke="#8b5cf6"
            strokeWidth={3}
          />

          {/* TENS ROOM */}
          <Group x={210} y={160}>
            <Text
              x={-70}
              y={0}
              text="TENS"
              fontSize={24}
              fill="#2ecc71"
              fontStyle="bold"
              width={140}
              align="center"
            />

            {/* Ten bundles display */}
            <Group y={40}>
              {Array.from({ length: placedTens }).map((_, i) => (
                <Group key={`ten-${i}`} x={(i % 3) * 45 - 45} y={Math.floor(i / 3) * 50}>
                  <Rect
                    x={-15}
                    y={-18}
                    width={35}
                    height={40}
                    fill="#2ecc71"
                    stroke="#27ae60"
                    strokeWidth={2}
                    cornerRadius={5}
                  />
                  <Text
                    x={-12}
                    y={-8}
                    text="10"
                    fontSize={16}
                    fill="#fff"
                    fontStyle="bold"
                  />
                </Group>
              ))}
            </Group>

            {/* Counter */}
            <Group y={150}>
              <Rect
                x={-55}
                y={-5}
                width={110}
                height={45}
                fill="#1a1a2e"
                stroke="#2ecc71"
                strokeWidth={2}
                cornerRadius={8}
              />
              
              {/* Minus button */}
              <Group
                x={-40}
                y={18}
                onClick={() => placeTens(-1)}
                onTap={() => placeTens(-1)}
              >
                <Circle radius={15} fill="#ef4444" />
                <Text x={-6} y={-8} text="−" fontSize={20} fill="#fff" fontStyle="bold" />
              </Group>

              {/* Count display */}
              <Text
                x={-15}
                y={5}
                text={String(placedTens)}
                fontSize={28}
                fill="#2ecc71"
                fontStyle="bold"
                width={30}
                align="center"
              />

              {/* Plus button */}
              <Group
                x={40}
                y={18}
                onClick={() => placeTens(1)}
                onTap={() => placeTens(1)}
              >
                <Circle radius={15} fill="#22c55e" />
                <Text x={-5} y={-8} text="+" fontSize={20} fill="#fff" fontStyle="bold" />
              </Group>
            </Group>
          </Group>

          {/* ONES ROOM */}
          <Group x={390} y={160}>
            <Text
              x={-70}
              y={0}
              text="ONES"
              fontSize={24}
              fill="#ff7f50"
              fontStyle="bold"
              width={140}
              align="center"
            />

            {/* Single units display */}
            <Group y={40}>
              {Array.from({ length: placedOnes }).map((_, i) => (
                <Group key={`one-${i}`} x={(i % 3) * 35 - 35} y={Math.floor(i / 3) * 35}>
                  <Circle
                    radius={12}
                    fill="#ff7f50"
                    stroke="#e55a2b"
                    strokeWidth={2}
                  />
                  <Text
                    x={-4}
                    y={-7}
                    text="1"
                    fontSize={12}
                    fill="#fff"
                    fontStyle="bold"
                  />
                </Group>
              ))}
            </Group>

            {/* Counter */}
            <Group y={150}>
              <Rect
                x={-55}
                y={-5}
                width={110}
                height={45}
                fill="#1a1a2e"
                stroke="#ff7f50"
                strokeWidth={2}
                cornerRadius={8}
              />
              
              {/* Minus button */}
              <Group
                x={-40}
                y={18}
                onClick={() => placeOnes(-1)}
                onTap={() => placeOnes(-1)}
              >
                <Circle radius={15} fill="#ef4444" />
                <Text x={-6} y={-8} text="−" fontSize={20} fill="#fff" fontStyle="bold" />
              </Group>

              {/* Count display */}
              <Text
                x={-15}
                y={5}
                text={String(placedOnes)}
                fontSize={28}
                fill="#ff7f50"
                fontStyle="bold"
                width={30}
                align="center"
              />

              {/* Plus button */}
              <Group
                x={40}
                y={18}
                onClick={() => placeOnes(1)}
                onTap={() => placeOnes(1)}
              >
                <Circle radius={15} fill="#22c55e" />
                <Text x={-5} y={-8} text="+" fontSize={20} fill="#fff" fontStyle="bold" />
              </Group>
            </Group>
          </Group>

          {/* Equation Display */}
          <Group x={CANVAS_WIDTH / 2} y={370}>
            <Rect
              x={-180}
              y={-15}
              width={360}
              height={40}
              fill="#1a1a2e"
              stroke={isCorrect ? '#22c55e' : '#8b5cf6'}
              strokeWidth={2}
              cornerRadius={10}
            />
            <Text
              x={-170}
              y={-5}
              text={`${placedTens} tens + ${placedOnes} ones = ${playerAnswer}`}
              fontSize={18}
              fill={playerAnswer === targetNumber ? '#22c55e' : '#a78bfa'}
              fontStyle="bold"
              width={340}
              align="center"
            />
          </Group>

          {/* Check Button */}
          <Group
            x={CANVAS_WIDTH / 2}
            y={420}
            onClick={submitPlaceValue}
            onTap={submitPlaceValue}
          >
            <Rect
              x={-60}
              y={-15}
              width={120}
              height={35}
              fill={playerAnswer === targetNumber ? '#22c55e' : '#8b5cf6'}
              cornerRadius={8}
              shadowBlur={playerAnswer === targetNumber ? 10 : 0}
              shadowColor="#22c55e"
            />
            <Text
              x={-55}
              y={-5}
              text="Check ✓"
              fontSize={16}
              fill="#fff"
              fontStyle="bold"
              width={110}
              align="center"
            />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
}
