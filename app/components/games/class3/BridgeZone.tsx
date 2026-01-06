'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import Plank from './Plank';

interface BridgeZoneProps {
  planks: Array<{ id: string; numerator: number; denominator: number; label: string }>;
  currentOrder: string[];
  onReorder: (newOrder: string[]) => void;
  isShaking: boolean;
  isCompleted: boolean;
}

const BridgeZone: React.FC<BridgeZoneProps> = ({
  planks,
  currentOrder,
  onReorder,
  isShaking,
  isCompleted,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const activeInBridge = currentOrder.includes(activeId);
    const overInBridge = currentOrder.includes(overId);

    // Case 1: Dragging from available planks to bridge (drop over any bridge plank)
    if (!activeInBridge && overInBridge) {
      const newOrder = [...currentOrder];
      if (!newOrder.includes(activeId)) {
        const overIndex = currentOrder.indexOf(overId);
        newOrder.splice(overIndex, 0, activeId);
        onReorder(newOrder);
      }
      return;
    }

    // Case 2: Dragging from available planks to bridge (first plank, drop on empty space)
    if (!activeInBridge && !overInBridge && currentOrder.length === 0) {
      onReorder([activeId]);
      return;
    }

    // Case 3: Reordering planks already in bridge
    if (activeInBridge && overInBridge && activeId !== overId) {
      const oldIndex = currentOrder.indexOf(activeId);
      const newIndex = currentOrder.indexOf(overId);
      const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
      onReorder(newOrder);
      return;
    }

    // Case 4: Moving plank back to available (if dropped outside bridge)
    // This is handled by not matching any over condition
  };

  const shakeVariants = {
    shake: {
      x: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
        repeat: 1,
      },
    },
  };

  const getPlankById = (id: string) => {
    return planks.find((p) => p.id === id);
  };

  // Combine all plank IDs for the global DndContext
  const allPlankIds = planks.map((p) => p.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Chasm visualization */}
        <div className="relative h-40 bg-gradient-to-b from-sky-200 to-blue-400 rounded-lg overflow-hidden border-4 border-gray-400">
          {/* Left side */}
          <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-green-600 to-green-400 border-r-4 border-green-800">
            <div className="absolute right-2 bottom-4 text-4xl">🧑</div>
          </div>

          {/* Water/chasm effect */}
          <div className="absolute left-24 top-0 w-full h-full flex items-center justify-center">
            <div className="text-6xl opacity-30">💧</div>
          </div>

          {/* Right side */}
          <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-green-600 to-green-400 border-l-4 border-green-800"></div>

          {/* Goal flag on right side */}
          <div className="absolute right-8 top-8 text-3xl">🚩</div>
        </div>

        {/* Bridge zone with shake animation */}
        <motion.div
          variants={shakeVariants}
          animate={isShaking ? 'shake' : 'initial'}
          className={`
            p-6 rounded-lg border-4 border-dashed transition-all
            ${
              currentOrder.length > 0
                ? 'border-yellow-600 bg-yellow-50'
                : 'border-gray-300 bg-gray-50'
            }
            ${isCompleted ? 'border-green-500 bg-green-50' : ''}
          `}
        >
          <p className="text-center text-sm font-semibold text-gray-700 mb-4">
            Drop planks here in descending order (largest → smallest)
          </p>

          <SortableContext
            items={currentOrder}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex gap-3 justify-center flex-wrap min-h-32 items-center">
              {currentOrder.length > 0 ? (
                currentOrder.map((plankId) => {
                  const plank = getPlankById(plankId);
                  return plank ? (
                    <Plank
                      key={plankId}
                      id={plankId}
                      label={plank.label}
                      numerator={plank.numerator}
                      denominator={plank.denominator}
                    />
                  ) : null;
                })
              ) : (
                <p className="text-gray-400 italic">Drag planks here...</p>
              )}
            </div>
          </SortableContext>
        </motion.div>

        {/* Available planks */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Available Planks:</p>
          <SortableContext
            items={planks
              .filter((p) => !currentOrder.includes(p.id))
              .map((p) => p.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex gap-4 justify-start flex-wrap">
              {planks
                .filter((p) => !currentOrder.includes(p.id))
                .map((plank) => (
                  <Plank
                    key={plank.id}
                    id={plank.id}
                    label={plank.label}
                    numerator={plank.numerator}
                    denominator={plank.denominator}
                  />
                ))}
            </div>
          </SortableContext>
        </div>
      </div>
    </DndContext>
  );
};

export default BridgeZone;
