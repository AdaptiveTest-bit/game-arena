'use client';

import React from 'react';
import { Stage, Layer, Rect, Text, Group, Line, Circle } from 'react-konva';
import { useWeightWarehouseStore } from '../../store/useWeightWarehouseStore';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;

export default function CargoLoaderCanvas() {
  const { cargoChallenge, loadBox, unloadBox } = useWeightWarehouseStore();

  if (!cargoChallenge) {
    return (
      <div className="flex items-center justify-center h-[450px]">
        <p className="text-gray-500">Loading challenge...</p>
      </div>
    );
  }

  const { truckCapacity, boxes, currentLoad } = cargoChallenge;
  const loadPercentage = (currentLoad / truckCapacity) * 100;
  const isNearLimit = loadPercentage > 80;
  const remainingCapacity = truckCapacity - currentLoad;

  const unloadedBoxes = boxes.filter(b => !b.loaded);
  const loadedBoxes = boxes.filter(b => b.loaded);

  return (
    <div className="relative">
      {/* Weight Display */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 rounded-xl px-4 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-600">Truck Capacity:</p>
        <p className="text-2xl font-bold text-amber-600">
          {currentLoad}kg / {truckCapacity}kg
        </p>
        <p className="text-sm text-gray-500">
          {remainingCapacity}kg remaining
        </p>
      </div>

      {/* Load Meter */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 rounded-xl px-4 py-2 shadow-lg w-40">
        <p className="text-sm font-medium text-gray-600 mb-1">Load Meter</p>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              isNearLimit ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(loadPercentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">
          {loadPercentage.toFixed(0)}%
        </p>
      </div>

      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          {/* Background - Warehouse floor */}
          <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#F5E6D3" />
          
          {/* Grid lines for warehouse floor */}
          {Array.from({ length: 10 }).map((_, i) => (
            <Line
              key={`h-${i}`}
              points={[0, i * 50, CANVAS_WIDTH, i * 50]}
              stroke="#E8D5C4"
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <Line
              key={`v-${i}`}
              points={[i * 50, 0, i * 50, CANVAS_HEIGHT]}
              stroke="#E8D5C4"
              strokeWidth={1}
            />
          ))}

          {/* Truck */}
          <Group x={350} y={80}>
            {/* Truck body */}
            <Rect
              x={0}
              y={0}
              width={220}
              height={180}
              fill="#F4D03F"
              stroke="#C9A227"
              strokeWidth={3}
              cornerRadius={5}
            />
            
            {/* Cargo bay */}
            <Rect
              x={10}
              y={10}
              width={200}
              height={160}
              fill="#FFF8DC"
              stroke="#DEB887"
              strokeWidth={2}
            />
            
            {/* Cab */}
            <Rect
              x={220}
              y={80}
              width={60}
              height={100}
              fill="#F4D03F"
              stroke="#C9A227"
              strokeWidth={3}
              cornerRadius={[0, 10, 10, 0]}
            />
            
            {/* Window */}
            <Rect
              x={230}
              y={90}
              width={40}
              height={35}
              fill="#87CEEB"
              stroke="#5DADE2"
              strokeWidth={2}
              cornerRadius={3}
            />
            
            {/* Wheels */}
            <Circle x={50} y={195} radius={20} fill="#333" />
            <Circle x={50} y={195} radius={10} fill="#666" />
            <Circle x={180} y={195} radius={20} fill="#333" />
            <Circle x={180} y={195} radius={10} fill="#666" />
            <Circle x={250} y={195} radius={20} fill="#333" />
            <Circle x={250} y={195} radius={10} fill="#666" />
            
            {/* Loaded boxes in truck */}
            {loadedBoxes.map((box, index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;
              const boxSize = box.size === 'small' ? 45 : box.size === 'medium' ? 50 : 55;
              
              return (
                <Group
                  key={box.id}
                  x={20 + col * 65}
                  y={130 - row * 55}
                  onClick={() => unloadBox(box.id)}
                  onTap={() => unloadBox(box.id)}
                >
                  <Rect
                    width={boxSize}
                    height={boxSize}
                    fill={box.color}
                    stroke="#333"
                    strokeWidth={2}
                    cornerRadius={3}
                    shadowBlur={5}
                    shadowColor="rgba(0,0,0,0.3)"
                  />
                  <Text
                    x={0}
                    y={boxSize / 2 - 8}
                    width={boxSize}
                    text={`${box.weight}kg`}
                    fontSize={12}
                    fill="#FFF"
                    fontStyle="bold"
                    align="center"
                  />
                </Group>
              );
            })}
            
            {/* Truck label */}
            <Text
              x={0}
              y={-25}
              width={220}
              text="🚚 DELIVERY TRUCK"
              fontSize={16}
              fill="#8B4513"
              fontStyle="bold"
              align="center"
            />
          </Group>

          {/* Available boxes area */}
          <Rect
            x={20}
            y={80}
            width={300}
            height={280}
            fill="rgba(139, 69, 19, 0.1)"
            stroke="#8B4513"
            strokeWidth={2}
            dash={[10, 5]}
            cornerRadius={10}
          />
          
          <Text
            x={20}
            y={55}
            width={300}
            text="📦 CARGO BOXES - Click to load"
            fontSize={14}
            fill="#8B4513"
            fontStyle="bold"
            align="center"
          />

          {/* Unloaded boxes */}
          {unloadedBoxes.map((box, index) => {
            const row = Math.floor(index / 4);
            const col = index % 4;
            const boxSize = box.size === 'small' ? 55 : box.size === 'medium' ? 60 : 65;
            const canFit = box.weight <= remainingCapacity;
            
            return (
              <Group
                key={box.id}
                x={35 + col * 72}
                y={100 + row * 85}
                onClick={() => canFit && loadBox(box.id)}
                onTap={() => canFit && loadBox(box.id)}
                opacity={canFit ? 1 : 0.5}
              >
                <Rect
                  width={boxSize}
                  height={boxSize}
                  fill={box.color}
                  stroke={canFit ? '#333' : '#999'}
                  strokeWidth={2}
                  cornerRadius={5}
                  shadowBlur={5}
                  shadowColor="rgba(0,0,0,0.3)"
                />
                <Text
                  x={0}
                  y={boxSize / 2 - 10}
                  width={boxSize}
                  text={`${box.weight}`}
                  fontSize={18}
                  fill="#FFF"
                  fontStyle="bold"
                  align="center"
                />
                <Text
                  x={0}
                  y={boxSize / 2 + 5}
                  width={boxSize}
                  text="kg"
                  fontSize={12}
                  fill="#FFF"
                  align="center"
                />
                
                {!canFit && (
                  <Text
                    x={0}
                    y={boxSize + 5}
                    width={boxSize}
                    text="Too heavy!"
                    fontSize={9}
                    fill="#E74C3C"
                    align="center"
                  />
                )}
              </Group>
            );
          })}

          {/* Arrow indicating direction */}
          <Group x={280} y={200}>
            <Line
              points={[0, 0, 50, 0]}
              stroke="#27AE60"
              strokeWidth={4}
            />
            <Line
              points={[40, -10, 50, 0, 40, 10]}
              stroke="#27AE60"
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
            />
          </Group>

          {/* Instructions */}
          <Rect
            x={150}
            y={CANVAS_HEIGHT - 45}
            width={300}
            height={35}
            fill="rgba(0,0,0,0.7)"
            cornerRadius={17}
          />
          <Text
            x={150}
            y={CANVAS_HEIGHT - 38}
            width={300}
            text="Click boxes to load/unload • Don't exceed limit!"
            fontSize={12}
            fill="#FFFFFF"
            align="center"
          />
        </Layer>
      </Stage>
    </div>
  );
}
