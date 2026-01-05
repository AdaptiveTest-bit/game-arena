'use client';

import React, { useState, useMemo } from 'react';
import { Stage, Layer, Rect, Text, Group, Circle, Line } from 'react-konva';
import { useWeightWarehouseStore } from '../../store/useWeightWarehouseStore';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;

export default function DeliveryPlannerCanvas() {
  const { deliveryChallenge, assignPackage, unassignPackage } = useWeightWarehouseStore();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const { allAssigned, anyOverloaded, unassignedCount } = useMemo(() => {
    if (!deliveryChallenge) return { allAssigned: false, anyOverloaded: false, unassignedCount: 0 };
    
    const unassigned = deliveryChallenge.packages.filter(p => !p.assignedTruck);
    const overloaded = deliveryChallenge.trucks.filter(t => t.currentLoad > t.capacity);
    
    return {
      allAssigned: unassigned.length === 0,
      anyOverloaded: overloaded.length > 0,
      unassignedCount: unassigned.length
    };
  }, [deliveryChallenge]);

  if (!deliveryChallenge) {
    return (
      <div className="flex items-center justify-center h-[450px]">
        <p className="text-gray-500">Loading challenge...</p>
      </div>
    );
  }

  const { trucks, packages } = deliveryChallenge;
  const unassignedPackages = packages.filter(p => !p.assignedTruck);

  const handlePackageClick = (pkgId: string) => {
    const pkg = packages.find(p => p.id === pkgId);
    if (pkg?.assignedTruck) {
      unassignPackage(pkgId);
      setSelectedPackage(null);
    } else {
      setSelectedPackage(selectedPackage === pkgId ? null : pkgId);
    }
  };

  const handleTruckClick = (truckId: string) => {
    if (selectedPackage) {
      assignPackage(selectedPackage, truckId);
      setSelectedPackage(null);
    }
  };

  return (
    <div className="relative">
      {/* Status Display */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 rounded-xl px-4 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-600">Packages to assign:</p>
        <p className={`text-2xl font-bold ${unassignedCount === 0 ? 'text-green-600' : 'text-orange-600'}`}>
          {unassignedCount} remaining
        </p>
      </div>

      {/* Alert Display */}
      {anyOverloaded && (
        <div className="absolute top-4 right-4 z-10 bg-red-100 border-2 border-red-500 rounded-xl px-4 py-2 shadow-lg">
          <p className="text-sm font-bold text-red-600">⚠️ Truck Overloaded!</p>
          <p className="text-xs text-red-500">Remove some packages</p>
        </div>
      )}

      {allAssigned && !anyOverloaded && (
        <div className="absolute top-4 right-4 z-10 bg-green-100 border-2 border-green-500 rounded-xl px-4 py-2 shadow-lg">
          <p className="text-sm font-bold text-green-600">✅ Ready to Deliver!</p>
        </div>
      )}

      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          {/* Background - Warehouse */}
          <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#E8E8E8" />
          
          {/* Floor grid */}
          {Array.from({ length: 9 }).map((_, i) => (
            <Line
              key={`h-${i}`}
              points={[0, i * 50, CANVAS_WIDTH, i * 50]}
              stroke="#D0D0D0"
              strokeWidth={1}
            />
          ))}

          {/* Trucks section */}
          <Rect
            x={10}
            y={10}
            width={CANVAS_WIDTH - 20}
            height={220}
            fill="#FFF8DC"
            stroke="#DEB887"
            strokeWidth={2}
            cornerRadius={10}
          />
          
          <Text
            x={20}
            y={15}
            text="🚛 DELIVERY TRUCKS - Click to assign selected package"
            fontSize={12}
            fill="#8B4513"
            fontStyle="bold"
          />

          {/* Render trucks */}
          {trucks.map((truck, index) => {
            const truckX = 30 + index * 145;
            const truckY = 45;
            const loadPercentage = (truck.currentLoad / truck.capacity) * 100;
            const isOverloaded = truck.currentLoad > truck.capacity;
            const truckPackages = packages.filter(p => p.assignedTruck === truck.id);
            
            return (
              <Group
                key={truck.id}
                x={truckX}
                y={truckY}
                onClick={() => handleTruckClick(truck.id)}
                onTap={() => handleTruckClick(truck.id)}
              >
                {/* Truck body */}
                <Rect
                  width={130}
                  height={100}
                  fill={truck.color}
                  stroke={isOverloaded ? '#E74C3C' : '#333'}
                  strokeWidth={isOverloaded ? 4 : 2}
                  cornerRadius={5}
                  shadowBlur={selectedPackage ? 10 : 0}
                  shadowColor={selectedPackage ? '#FFD700' : undefined}
                />
                
                {/* Cargo area */}
                <Rect
                  x={5}
                  y={5}
                  width={90}
                  height={90}
                  fill="#FFF"
                  stroke="#DDD"
                  strokeWidth={1}
                  cornerRadius={3}
                />
                
                {/* Cab */}
                <Rect
                  x={95}
                  y={40}
                  width={30}
                  height={55}
                  fill={truck.color}
                  stroke="#333"
                  strokeWidth={2}
                  cornerRadius={[0, 5, 5, 0]}
                />
                
                {/* Window */}
                <Rect
                  x={100}
                  y={45}
                  width={20}
                  height={18}
                  fill="#87CEEB"
                />
                
                {/* Wheel */}
                <Circle x={30} y={105} radius={12} fill="#333" />
                <Circle x={85} y={105} radius={12} fill="#333" />
                
                {/* Packages on truck */}
                {truckPackages.slice(0, 6).map((pkg, pIndex) => {
                  const pRow = Math.floor(pIndex / 3);
                  const pCol = pIndex % 3;
                  return (
                    <Group
                      key={pkg.id}
                      x={10 + pCol * 28}
                      y={70 - pRow * 30}
                      onClick={(e) => {
                        e.cancelBubble = true;
                        handlePackageClick(pkg.id);
                      }}
                      onTap={(e) => {
                        e.cancelBubble = true;
                        handlePackageClick(pkg.id);
                      }}
                    >
                      <Rect
                        width={24}
                        height={24}
                        fill={pkg.color}
                        stroke="#333"
                        strokeWidth={1}
                        cornerRadius={2}
                      />
                      <Text
                        x={0}
                        y={6}
                        width={24}
                        text={String(pkg.weight)}
                        fontSize={9}
                        fill="#FFF"
                        fontStyle="bold"
                        align="center"
                      />
                    </Group>
                  );
                })}
                
                {/* Capacity bar */}
                <Rect
                  x={0}
                  y={115}
                  width={130}
                  height={15}
                  fill="#EEE"
                  stroke="#CCC"
                  strokeWidth={1}
                  cornerRadius={7}
                />
                <Rect
                  x={2}
                  y={117}
                  width={Math.min(loadPercentage, 100) * 1.26}
                  height={11}
                  fill={isOverloaded ? '#E74C3C' : loadPercentage > 80 ? '#F39C12' : '#27AE60'}
                  cornerRadius={5}
                />
                
                {/* Capacity text */}
                <Text
                  x={0}
                  y={133}
                  width={130}
                  text={`${truck.currentLoad}/${truck.capacity}kg`}
                  fontSize={11}
                  fill={isOverloaded ? '#E74C3C' : '#333'}
                  fontStyle="bold"
                  align="center"
                />
                
                {isOverloaded && (
                  <Text
                    x={0}
                    y={148}
                    width={130}
                    text="⚠️ OVERLOAD!"
                    fontSize={10}
                    fill="#E74C3C"
                    fontStyle="bold"
                    align="center"
                  />
                )}
              </Group>
            );
          })}

          {/* Packages section */}
          <Rect
            x={10}
            y={245}
            width={CANVAS_WIDTH - 20}
            height={195}
            fill="#E8F6F3"
            stroke="#1ABC9C"
            strokeWidth={2}
            cornerRadius={10}
          />
          
          <Text
            x={20}
            y={250}
            text="📦 UNASSIGNED PACKAGES - Click to select, then click a truck"
            fontSize={12}
            fill="#16A085"
            fontStyle="bold"
          />

          {/* Render unassigned packages */}
          {unassignedPackages.map((pkg, index) => {
            const row = Math.floor(index / 6);
            const col = index % 6;
            const isSelected = selectedPackage === pkg.id;
            
            return (
              <Group
                key={pkg.id}
                x={35 + col * 92}
                y={275 + row * 75}
                onClick={() => handlePackageClick(pkg.id)}
                onTap={() => handlePackageClick(pkg.id)}
              >
                <Rect
                  width={80}
                  height={60}
                  fill={pkg.color}
                  stroke={isSelected ? '#FFD700' : '#333'}
                  strokeWidth={isSelected ? 4 : 2}
                  cornerRadius={5}
                  shadowBlur={isSelected ? 15 : 5}
                  shadowColor={isSelected ? '#FFD700' : 'rgba(0,0,0,0.2)'}
                />
                
                {/* Package tape */}
                <Rect
                  x={30}
                  y={0}
                  width={20}
                  height={60}
                  fill="rgba(139, 69, 19, 0.5)"
                />
                
                <Text
                  x={0}
                  y={15}
                  width={80}
                  text={`${pkg.weight}kg`}
                  fontSize={16}
                  fill="#FFF"
                  fontStyle="bold"
                  align="center"
                />
                <Text
                  x={0}
                  y={35}
                  width={80}
                  text={pkg.destination}
                  fontSize={10}
                  fill="#FFF"
                  align="center"
                />
              </Group>
            );
          })}

          {/* Selection indicator */}
          {selectedPackage && (
            <Group x={CANVAS_WIDTH / 2 - 100} y={CANVAS_HEIGHT - 35}>
              <Rect
                width={200}
                height={30}
                fill="#F39C12"
                cornerRadius={15}
              />
              <Text
                x={0}
                y={8}
                width={200}
                text="📦 Now click a truck to load"
                fontSize={12}
                fill="#FFF"
                fontStyle="bold"
                align="center"
              />
            </Group>
          )}
        </Layer>
      </Stage>
    </div>
  );
}
