'use client';

import React, { useMemo } from 'react';
import { Stage, Layer, Rect, Text, Group, Line, Circle, RegularPolygon } from 'react-konva';
import { useWeightWarehouseStore } from '../../store/useWeightWarehouseStore';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;

export default function WeightBalancerCanvas() {
  const { balanceChallenge, addWeight, removeWeight } = useWeightWarehouseStore();

  // Calculate tilt based on weight difference
  const { tiltAngle, currentSum, isBalanced } = useMemo(() => {
    if (!balanceChallenge) return { tiltAngle: 0, currentSum: 0, isBalanced: false };
    
    const sum = balanceChallenge.placedWeights.reduce((a, b) => a + b, 0);
    const diff = balanceChallenge.targetWeight - sum;
    const maxTilt = 15;
    const tilt = Math.max(-maxTilt, Math.min(maxTilt, diff * 0.5));
    
    return {
      tiltAngle: tilt,
      currentSum: sum,
      isBalanced: diff === 0
    };
  }, [balanceChallenge]);

  // Count available weights (subtract placed ones) - must be called before early return
  const availableCounts = useMemo(() => {
    if (!balanceChallenge) return {};
    const counts: Record<number, number> = {};
    balanceChallenge.availableWeights.forEach(w => {
      counts[w] = (counts[w] || 0) + 1;
    });
    balanceChallenge.placedWeights.forEach(w => {
      if (counts[w]) counts[w]--;
    });
    return counts;
  }, [balanceChallenge]);

  const uniqueWeights = useMemo(() => {
    if (!balanceChallenge) return [];
    return [...new Set(balanceChallenge.availableWeights)].sort((a, b) => a - b);
  }, [balanceChallenge]);

  if (!balanceChallenge) {
    return (
      <div className="flex items-center justify-center h-[450px]">
        <p className="text-gray-500">Loading challenge...</p>
      </div>
    );
  }

  const { targetWeight, placedWeights } = balanceChallenge;

  return (
    <div className="relative">
      {/* Target Display */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 rounded-xl px-4 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-600">Left Pan (Target):</p>
        <p className="text-2xl font-bold text-blue-600">{targetWeight}kg</p>
      </div>

      {/* Current Sum Display */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 rounded-xl px-4 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-600">Right Pan (Your weights):</p>
        <p className={`text-2xl font-bold ${isBalanced ? 'text-green-600' : 'text-orange-600'}`}>
          {currentSum}kg
        </p>
        {isBalanced && <p className="text-green-600 text-sm font-bold">✅ BALANCED!</p>}
      </div>

      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          {/* Background */}
          <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#FDF5E6" />

          {/* Scale Base */}
          <Group x={CANVAS_WIDTH / 2} y={320}>
            {/* Base triangle */}
            <RegularPolygon
              x={0}
              y={50}
              sides={3}
              radius={60}
              fill="#CD7F32"
              stroke="#8B4513"
              strokeWidth={3}
            />
            
            {/* Center pole */}
            <Rect
              x={-8}
              y={-100}
              width={16}
              height={150}
              fill="#8B4513"
              stroke="#5D3A1A"
              strokeWidth={2}
            />
            
            {/* Top ornament */}
            <Circle
              x={0}
              y={-110}
              radius={15}
              fill="#FFD700"
              stroke="#B8860B"
              strokeWidth={2}
            />
          </Group>

          {/* Balance beam (rotates based on weight difference) */}
          <Group 
            x={CANVAS_WIDTH / 2} 
            y={220}
            rotation={tiltAngle}
          >
            {/* Main beam */}
            <Rect
              x={-200}
              y={-8}
              width={400}
              height={16}
              fill="#CD7F32"
              stroke="#8B4513"
              strokeWidth={2}
              cornerRadius={3}
            />

            {/* Left pan chain */}
            <Line
              points={[-170, 8, -170, 50]}
              stroke="#8B4513"
              strokeWidth={3}
            />
            <Line
              points={[-150, 8, -130, 50]}
              stroke="#8B4513"
              strokeWidth={2}
            />
            <Line
              points={[-190, 8, -210, 50]}
              stroke="#8B4513"
              strokeWidth={2}
            />

            {/* Left pan (fixed weights) */}
            <Group x={-170} y={60}>
              <Rect
                x={-60}
                y={0}
                width={120}
                height={20}
                fill="#B8860B"
                stroke="#8B4513"
                strokeWidth={2}
                cornerRadius={3}
              />
              {/* Stacked weights visualization */}
              <Rect
                x={-40}
                y={-35}
                width={80}
                height={35}
                fill="#4A4A4A"
                stroke="#333"
                strokeWidth={2}
                cornerRadius={3}
              />
              <Text
                x={-40}
                y={-28}
                width={80}
                text={`${targetWeight}kg`}
                fontSize={16}
                fill="#FFF"
                fontStyle="bold"
                align="center"
              />
            </Group>

            {/* Right pan chain */}
            <Line
              points={[170, 8, 170, 50]}
              stroke="#8B4513"
              strokeWidth={3}
            />
            <Line
              points={[150, 8, 130, 50]}
              stroke="#8B4513"
              strokeWidth={2}
            />
            <Line
              points={[190, 8, 210, 50]}
              stroke="#8B4513"
              strokeWidth={2}
            />

            {/* Right pan (player's weights) */}
            <Group x={170} y={60}>
              <Rect
                x={-60}
                y={0}
                width={120}
                height={20}
                fill="#B8860B"
                stroke="#8B4513"
                strokeWidth={2}
                cornerRadius={3}
              />
              
              {/* Placed weights on right pan */}
              {placedWeights.map((weight, index) => {
                const row = Math.floor(index / 3);
                const col = index % 3;
                const size = weight >= 20 ? 35 : weight >= 10 ? 30 : 25;
                
                return (
                  <Group
                    key={index}
                    x={-45 + col * 35}
                    y={-25 - row * 30}
                    onClick={() => removeWeight(index)}
                    onTap={() => removeWeight(index)}
                  >
                    <Circle
                      radius={size / 2}
                      fill="#4A4A4A"
                      stroke="#333"
                      strokeWidth={2}
                    />
                    <Text
                      x={-size / 2}
                      y={-7}
                      width={size}
                      text={`${weight}`}
                      fontSize={11}
                      fill="#FFF"
                      fontStyle="bold"
                      align="center"
                    />
                  </Group>
                );
              })}
            </Group>
          </Group>

          {/* Tilt indicator */}
          <Group x={CANVAS_WIDTH / 2} y={150}>
            {tiltAngle > 0 && (
              <Text
                x={-100}
                y={0}
                text="⬇️ Heavy"
                fontSize={14}
                fill="#E74C3C"
              />
            )}
            {tiltAngle < 0 && (
              <Text
                x={50}
                y={0}
                text="Heavy ⬇️"
                fontSize={14}
                fill="#E74C3C"
              />
            )}
            {isBalanced && (
              <Text
                x={-40}
                y={0}
                text="⚖️ Perfect!"
                fontSize={16}
                fill="#27AE60"
                fontStyle="bold"
              />
            )}
          </Group>

          {/* Available weights palette */}
          <Rect
            x={20}
            y={CANVAS_HEIGHT - 110}
            width={CANVAS_WIDTH - 40}
            height={90}
            fill="#E8E8E8"
            stroke="#CCC"
            strokeWidth={2}
            cornerRadius={10}
          />
          
          <Text
            x={20}
            y={CANVAS_HEIGHT - 105}
            width={CANVAS_WIDTH - 40}
            text="🏋️ Available Weights - Click to add to right pan"
            fontSize={12}
            fill="#666"
            align="center"
          />

          {/* Weight options */}
          {uniqueWeights.map((weight, index) => {
            const available = availableCounts[weight] || 0;
            const size = weight >= 20 ? 50 : weight >= 10 ? 45 : 40;
            const xPos = 60 + index * 90;
            
            return (
              <Group
                key={weight}
                x={xPos}
                y={CANVAS_HEIGHT - 55}
                onClick={() => available > 0 && addWeight(weight)}
                onTap={() => available > 0 && addWeight(weight)}
                opacity={available > 0 ? 1 : 0.4}
              >
                <Circle
                  radius={size / 2}
                  fill={available > 0 ? '#4A4A4A' : '#999'}
                  stroke={available > 0 ? '#333' : '#777'}
                  strokeWidth={3}
                  shadowBlur={available > 0 ? 5 : 0}
                  shadowColor="rgba(0,0,0,0.3)"
                />
                <Text
                  x={-size / 2}
                  y={-10}
                  width={size}
                  text={`${weight}kg`}
                  fontSize={12}
                  fill="#FFF"
                  fontStyle="bold"
                  align="center"
                />
                <Circle
                  x={size / 2 - 5}
                  y={-size / 2 + 5}
                  radius={12}
                  fill={available > 0 ? '#27AE60' : '#999'}
                />
                <Text
                  x={size / 2 - 13}
                  y={-size / 2 - 2}
                  text={`${available}`}
                  fontSize={12}
                  fill="#FFF"
                  fontStyle="bold"
                />
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
