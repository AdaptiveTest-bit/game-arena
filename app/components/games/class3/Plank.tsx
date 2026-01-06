'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface PlankProps {
  id: string;
  label: string;
  numerator: number;
  denominator: number;
  isDragging?: boolean;
}

const Plank: React.FC<PlankProps> = ({ id, label, numerator, denominator, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative w-20 h-24 bg-gradient-to-b from-yellow-700 to-yellow-900 rounded-lg
        shadow-lg border-2 border-yellow-900 cursor-grab active:cursor-grabbing
        flex flex-col items-center justify-center transition-all
        ${isSortableDragging ? 'scale-110 shadow-2xl' : 'hover:shadow-xl hover:scale-105'}
      `}
    >
      {/* Wood texture effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-600"></div>
        <div className="absolute top-6 left-0 w-full h-0.5 bg-yellow-800"></div>
        <div className="absolute top-12 left-0 w-full h-0.5 bg-yellow-600"></div>
      </div>

      {/* Grip handle */}
      <div className="absolute top-1 right-1 text-yellow-600">
        <GripVertical size={14} />
      </div>

      {/* Fraction display */}
      <div className="text-center z-10">
        <div className="text-sm font-bold text-white">{numerator}</div>
        <div className="h-0.5 bg-white w-4 my-0.5"></div>
        <div className="text-sm font-bold text-white">{denominator}</div>
      </div>

      {/* Alternative: Text label */}
      <div className="text-xs text-yellow-100 font-semibold mt-1 z-10">{label}</div>
    </div>
  );
};

export default Plank;
