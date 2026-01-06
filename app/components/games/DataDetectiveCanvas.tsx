'use client';

import React, { useMemo } from 'react';
import { Stage, Layer, Rect, Text, Circle, Line, Group, Star } from 'react-konva';
import { 
  useDataDetectiveStore,
  Question,
  CountObjectsQuestion,
  SortObjectsQuestion,
  MakeTallyQuestion,
  ReadTallyQuestion,
  ReadPictographQuestion,
  CompareDataQuestion,
  DataQuestionQuestion,
  BuildPictographQuestion,
} from '../../store/useDataDetectiveStore';

// ─────────────────────────────────────────────────────────────
// HELPER: Scatter positions for objects
// ─────────────────────────────────────────────────────────────

function generateScatterPositions(count: number, width: number, height: number, margin: number = 60): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const minDist = 70;
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let pos = { x: 0, y: 0 };
    
    do {
      pos = {
        x: margin + Math.random() * (width - 2 * margin),
        y: margin + Math.random() * (height - 2 * margin),
      };
      attempts++;
    } while (
      attempts < 50 &&
      positions.some(p => Math.sqrt((p.x - pos.x) ** 2 + (p.y - pos.y) ** 2) < minDist)
    );
    
    positions.push(pos);
  }
  
  return positions;
}

// ─────────────────────────────────────────────────────────────
// TALLY MARKS RENDERER
// ─────────────────────────────────────────────────────────────

interface TallyMarksProps {
  count: number;
  x: number;
  y: number;
  scale?: number;
}

const TallyMarks: React.FC<TallyMarksProps> = ({ count, x, y, scale = 1 }) => {
  const marks: React.ReactNode[] = [];
  const fullGroups = Math.floor(count / 5);
  const remainder = count % 5;
  
  let offsetX = 0;
  const groupWidth = 60 * scale;
  const lineHeight = 50 * scale;
  const lineSpacing = 12 * scale;
  
  // Draw complete groups of 5 (4 vertical + 1 diagonal)
  for (let g = 0; g < fullGroups; g++) {
    for (let i = 0; i < 4; i++) {
      marks.push(
        <Line
          key={`group${g}-line${i}`}
          points={[
            x + offsetX + i * lineSpacing, y,
            x + offsetX + i * lineSpacing, y + lineHeight
          ]}
          stroke="#4A5568"
          strokeWidth={4 * scale}
          lineCap="round"
        />
      );
    }
    // Diagonal line crossing the 4
    marks.push(
      <Line
        key={`group${g}-cross`}
        points={[
          x + offsetX - 5 * scale, y + lineHeight + 5 * scale,
          x + offsetX + 3 * lineSpacing + 10 * scale, y - 5 * scale
        ]}
        stroke="#E53E3E"
        strokeWidth={4 * scale}
        lineCap="round"
      />
    );
    offsetX += groupWidth;
  }
  
  // Draw remaining lines
  for (let i = 0; i < remainder; i++) {
    marks.push(
      <Line
        key={`rem-line${i}`}
        points={[
          x + offsetX + i * lineSpacing, y,
          x + offsetX + i * lineSpacing, y + lineHeight
        ]}
        stroke="#4A5568"
        strokeWidth={4 * scale}
        lineCap="round"
      />
    );
  }
  
  return <>{marks}</>;
};

// ─────────────────────────────────────────────────────────────
// PICTOGRAPH RENDERER
// ─────────────────────────────────────────────────────────────

interface PictographDisplayProps {
  data: { category: string; emoji: string; count: number }[];
  x: number;
  y: number;
  title: string;
  highlightCategory?: string;
}

const PictographDisplay: React.FC<PictographDisplayProps> = ({ data, x, y, title, highlightCategory }) => {
  const rowHeight = 50;
  const cellWidth = 40;
  
  return (
    <Group>
      {/* Title */}
      <Text
        x={x}
        y={y - 40}
        text={`📊 ${title}`}
        fontSize={20}
        fontStyle="bold"
        fill="#2D3748"
      />
      
      {/* Rows */}
      {data.map((row, idx) => {
        const rowY = y + idx * rowHeight;
        const isHighlighted = highlightCategory === row.category;
        
        return (
          <Group key={row.category}>
            {/* Background highlight */}
            {isHighlighted && (
              <Rect
                x={x - 10}
                y={rowY - 5}
                width={300}
                height={rowHeight - 5}
                fill="#FED7D7"
                cornerRadius={8}
              />
            )}
            
            {/* Category label */}
            <Text
              x={x}
              y={rowY + 10}
              text={`${row.emoji} ${row.category}`}
              fontSize={16}
              fill="#4A5568"
              width={100}
            />
            
            {/* Emoji symbols */}
            {Array.from({ length: row.count }).map((_, i) => (
              <Text
                key={i}
                x={x + 110 + i * cellWidth}
                y={rowY + 5}
                text={row.emoji}
                fontSize={28}
              />
            ))}
          </Group>
        );
      })}
    </Group>
  );
};

// ─────────────────────────────────────────────────────────────
// COUNT OBJECTS ACTIVITY
// ─────────────────────────────────────────────────────────────

interface CountObjectsActivityProps {
  question: CountObjectsQuestion;
  width: number;
  height: number;
}

const CountObjectsActivity: React.FC<CountObjectsActivityProps> = ({ question, width, height }) => {
  const positions = useMemo(
    () => generateScatterPositions(question.count, width - 100, height - 150, 80),
    [question.count, width, height]
  );
  
  return (
    <Group>
      {/* Counting area */}
      <Rect
        x={50}
        y={40}
        width={width - 100}
        height={height - 150}
        fill="#E6FFFA"
        stroke="#38B2AC"
        strokeWidth={3}
        cornerRadius={15}
      />
      
      <Text
        x={width / 2}
        y={20}
        text="🔍 Count carefully!"
        fontSize={18}
        fill="#285E61"
        align="center"
        offsetX={80}
      />
      
      {/* Scattered objects */}
      {positions.map((pos, idx) => (
        <Text
          key={idx}
          x={50 + pos.x}
          y={40 + pos.y}
          text={question.objectEmoji}
          fontSize={48}
          offsetX={24}
          offsetY={24}
        />
      ))}
    </Group>
  );
};

// ─────────────────────────────────────────────────────────────
// SORT OBJECTS ACTIVITY
// ─────────────────────────────────────────────────────────────

interface SortObjectsActivityProps {
  question: SortObjectsQuestion;
  width: number;
  height: number;
  selectedObjects: string[];
  onToggle: (id: string) => void;
}

const SortObjectsActivity: React.FC<SortObjectsActivityProps> = ({ question, width, height, selectedObjects, onToggle }) => {
  const cols = 4;
  const cellWidth = (width - 100) / cols;
  const cellHeight = 80;
  
  return (
    <Group>
      {/* Objects to sort */}
      <Text
        x={width / 2}
        y={20}
        text="👆 Tap the correct items!"
        fontSize={18}
        fill="#553C9A"
        align="center"
        offsetX={100}
      />
      
      <Rect
        x={50}
        y={50}
        width={width - 100}
        height={height - 200}
        fill="#FAF5FF"
        stroke="#805AD5"
        strokeWidth={3}
        cornerRadius={15}
      />
      
      {question.objects.map((obj, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = 50 + col * cellWidth + cellWidth / 2;
        const y = 70 + row * cellHeight + 30;
        const isSelected = selectedObjects.includes(obj.id);
        
        return (
          <Group
            key={obj.id}
            onClick={() => onToggle(obj.id)}
            onTap={() => onToggle(obj.id)}
          >
            {/* Selection indicator */}
            <Circle
              x={x}
              y={y}
              radius={35}
              fill={isSelected ? '#C6F6D5' : '#FFFFFF'}
              stroke={isSelected ? '#38A169' : '#CBD5E0'}
              strokeWidth={isSelected ? 4 : 2}
            />
            
            {/* Emoji */}
            <Text
              x={x}
              y={y}
              text={obj.emoji}
              fontSize={36}
              offsetX={18}
              offsetY={18}
            />
            
            {/* Check mark if selected */}
            {isSelected && (
              <Text
                x={x + 25}
                y={y - 25}
                text="✓"
                fontSize={20}
                fill="#22543D"
                fontStyle="bold"
              />
            )}
          </Group>
        );
      })}
      
      {/* Basket area */}
      <Rect
        x={50}
        y={height - 130}
        width={width - 100}
        height={80}
        fill="#FEEBC8"
        stroke="#DD6B20"
        strokeWidth={3}
        cornerRadius={15}
        dash={[10, 5]}
      />
      
      <Text
        x={width / 2}
        y={height - 100}
        text="🧺 Your Basket"
        fontSize={20}
        fill="#C05621"
        align="center"
        offsetX={60}
        fontStyle="bold"
      />
      
      {/* Show selected in basket */}
      {selectedObjects.map((id, idx) => {
        const obj = question.objects.find(o => o.id === id);
        if (!obj) return null;
        return (
          <Text
            key={`basket-${id}`}
            x={80 + idx * 45}
            y={height - 70}
            text={obj.emoji}
            fontSize={30}
          />
        );
      })}
    </Group>
  );
};

// ─────────────────────────────────────────────────────────────
// MAKE TALLY ACTIVITY
// ─────────────────────────────────────────────────────────────

interface MakeTallyActivityProps {
  question: MakeTallyQuestion;
  width: number;
  height: number;
  tallyCount: number;
  onAdd: () => void;
  onRemove: () => void;
}

const MakeTallyActivity: React.FC<MakeTallyActivityProps> = ({ question, width, height, tallyCount, onAdd, onRemove }) => {
  return (
    <Group>
      {/* Target display */}
      <Rect
        x={50}
        y={30}
        width={width - 100}
        height={100}
        fill="#EBF8FF"
        stroke="#3182CE"
        strokeWidth={3}
        cornerRadius={15}
      />
      
      <Text
        x={width / 2}
        y={50}
        text={`Make tally marks for: ${question.targetNumber}`}
        fontSize={24}
        fill="#2C5282"
        align="center"
        offsetX={150}
        fontStyle="bold"
      />
      
      {/* Show objects to count */}
      {Array.from({ length: question.targetNumber }).map((_, i) => (
        <Text
          key={i}
          x={80 + i * 50}
          y={85}
          text={question.objectEmoji}
          fontSize={32}
        />
      ))}
      
      {/* Tally area */}
      <Rect
        x={50}
        y={150}
        width={width - 100}
        height={150}
        fill="#FFFFF0"
        stroke="#D69E2E"
        strokeWidth={3}
        cornerRadius={15}
      />
      
      <Text
        x={width / 2}
        y={160}
        text="Your Tally Marks:"
        fontSize={18}
        fill="#744210"
        align="center"
        offsetX={80}
      />
      
      <TallyMarks count={tallyCount} x={100} y={200} scale={1.2} />
      
      {/* Count display */}
      <Text
        x={width / 2}
        y={280}
        text={`Count: ${tallyCount}`}
        fontSize={22}
        fill="#744210"
        fontStyle="bold"
        align="center"
        offsetX={40}
      />
      
      {/* Control buttons */}
      <Group onClick={onRemove} onTap={onRemove}>
        <Circle
          x={width / 2 - 80}
          y={height - 60}
          radius={35}
          fill="#FED7D7"
          stroke="#C53030"
          strokeWidth={3}
        />
        <Text
          x={width / 2 - 80}
          y={height - 60}
          text="−"
          fontSize={40}
          fill="#C53030"
          align="center"
          offsetX={12}
          offsetY={22}
          fontStyle="bold"
        />
      </Group>
      
      <Group onClick={onAdd} onTap={onAdd}>
        <Circle
          x={width / 2 + 80}
          y={height - 60}
          radius={35}
          fill="#C6F6D5"
          stroke="#2F855A"
          strokeWidth={3}
        />
        <Text
          x={width / 2 + 80}
          y={height - 60}
          text="+"
          fontSize={40}
          fill="#2F855A"
          align="center"
          offsetX={12}
          offsetY={22}
          fontStyle="bold"
        />
      </Group>
    </Group>
  );
};

// ─────────────────────────────────────────────────────────────
// READ TALLY ACTIVITY
// ─────────────────────────────────────────────────────────────

interface ReadTallyActivityProps {
  question: ReadTallyQuestion;
  width: number;
  height: number;
}

const ReadTallyActivity: React.FC<ReadTallyActivityProps> = ({ question, width, height }) => {
  return (
    <Group>
      {/* Tally display area */}
      <Rect
        x={50}
        y={40}
        width={width - 100}
        height={180}
        fill="#FFFFF0"
        stroke="#D69E2E"
        strokeWidth={3}
        cornerRadius={15}
      />
      
      <Text
        x={width / 2}
        y={60}
        text="📊 How many tally marks?"
        fontSize={22}
        fill="#744210"
        align="center"
        offsetX={120}
        fontStyle="bold"
      />
      
      <TallyMarks count={question.tallyCount} x={(width - question.tallyCount * 15) / 2} y={110} scale={1.5} />
    </Group>
  );
};

// ─────────────────────────────────────────────────────────────
// READ PICTOGRAPH ACTIVITY
// ─────────────────────────────────────────────────────────────

interface ReadPictographActivityProps {
  question: ReadPictographQuestion;
  width: number;
  height: number;
}

const ReadPictographActivity: React.FC<ReadPictographActivityProps> = ({ question, width, height }) => {
  return (
    <Group>
      {/* Pictograph display */}
      <Rect
        x={30}
        y={20}
        width={width - 60}
        height={height - 150}
        fill="#FFFFFF"
        stroke="#805AD5"
        strokeWidth={3}
        cornerRadius={15}
      />
      
      <PictographDisplay
        data={question.data}
        x={50}
        y={80}
        title={question.title}
        highlightCategory={question.targetCategory}
      />
    </Group>
  );
};

// ─────────────────────────────────────────────────────────────
// COMPARE DATA ACTIVITY
// ─────────────────────────────────────────────────────────────

interface CompareDataActivityProps {
  question: CompareDataQuestion;
  width: number;
  height: number;
}

const CompareDataActivity: React.FC<CompareDataActivityProps> = ({ question, width, height }) => {
  const boxWidth = (width - 100) / 2 - 20;
  
  return (
    <Group>
      {/* Item 1 */}
      <Rect
        x={40}
        y={40}
        width={boxWidth}
        height={height - 180}
        fill="#E6FFFA"
        stroke="#38B2AC"
        strokeWidth={3}
        cornerRadius={15}
      />
      
      <Text
        x={40 + boxWidth / 2}
        y={60}
        text={question.item1.name}
        fontSize={20}
        fill="#234E52"
        fontStyle="bold"
        align="center"
        offsetX={50}
      />
      
      {/* Item 1 emojis */}
      {Array.from({ length: question.item1.count }).map((_, i) => {
        const cols = 3;
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <Text
            key={`item1-${i}`}
            x={60 + col * 60}
            y={100 + row * 60}
            text={question.item1.emoji}
            fontSize={40}
          />
        );
      })}
      
      {/* Item 2 */}
      <Rect
        x={width / 2 + 20}
        y={40}
        width={boxWidth}
        height={height - 180}
        fill="#FED7E2"
        stroke="#D53F8C"
        strokeWidth={3}
        cornerRadius={15}
      />
      
      <Text
        x={width / 2 + 20 + boxWidth / 2}
        y={60}
        text={question.item2.name}
        fontSize={20}
        fill="#702459"
        fontStyle="bold"
        align="center"
        offsetX={50}
      />
      
      {/* Item 2 emojis */}
      {Array.from({ length: question.item2.count }).map((_, i) => {
        const cols = 3;
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <Text
            key={`item2-${i}`}
            x={width / 2 + 40 + col * 60}
            y={100 + row * 60}
            text={question.item2.emoji}
            fontSize={40}
          />
        );
      })}
      
      {/* VS */}
      <Circle
        x={width / 2}
        y={height / 2 - 40}
        radius={30}
        fill="#805AD5"
      />
      <Text
        x={width / 2}
        y={height / 2 - 40}
        text="VS"
        fontSize={18}
        fill="#FFFFFF"
        fontStyle="bold"
        align="center"
        offsetX={12}
        offsetY={9}
      />
    </Group>
  );
};

// ─────────────────────────────────────────────────────────────
// DATA QUESTION ACTIVITY
// ─────────────────────────────────────────────────────────────

interface DataQuestionActivityProps {
  question: DataQuestionQuestion;
  width: number;
  height: number;
}

const DataQuestionActivity: React.FC<DataQuestionActivityProps> = ({ question, width, height }) => {
  return (
    <Group>
      {/* Scenario box */}
      <Rect
        x={30}
        y={20}
        width={width - 60}
        height={80}
        fill="#EBF8FF"
        stroke="#3182CE"
        strokeWidth={2}
        cornerRadius={10}
      />
      
      <Text
        x={50}
        y={35}
        text={question.scenario}
        fontSize={14}
        fill="#2C5282"
        width={width - 100}
        wrap="word"
      />
      
      {/* Data display */}
      <Rect
        x={30}
        y={110}
        width={width - 60}
        height={height - 260}
        fill="#FFFFFF"
        stroke="#805AD5"
        strokeWidth={3}
        cornerRadius={15}
      />
      
      {question.data.map((row, idx) => {
        const rowY = 130 + idx * 50;
        const isTarget = row.category === question.targetCategory;
        
        return (
          <Group key={row.category}>
            {isTarget && (
              <Rect
                x={40}
                y={rowY - 5}
                width={width - 80}
                height={45}
                fill="#FED7D7"
                cornerRadius={8}
              />
            )}
            
            <Text
              x={50}
              y={rowY + 10}
              text={`${row.emoji} ${row.category}: `}
              fontSize={18}
              fill="#4A5568"
            />
            
            {Array.from({ length: row.count }).map((_, i) => (
              <Text
                key={i}
                x={200 + i * 35}
                y={rowY + 5}
                text={row.emoji}
                fontSize={24}
              />
            ))}
          </Group>
        );
      })}
    </Group>
  );
};

// ─────────────────────────────────────────────────────────────
// BUILD PICTOGRAPH ACTIVITY
// ─────────────────────────────────────────────────────────────

interface BuildPictographActivityProps {
  question: BuildPictographQuestion;
  width: number;
  height: number;
  builtCount: number;
  onAdd: () => void;
  onRemove: () => void;
}

const BuildPictographActivity: React.FC<BuildPictographActivityProps> = ({
  question,
  width,
  height,
  builtCount,
  onAdd,
  onRemove,
}) => {
  return (
    <Group>
      {/* Target display */}
      <Rect
        x={50}
        y={30}
        width={width - 100}
        height={80}
        fill="#EBF8FF"
        stroke="#3182CE"
        strokeWidth={3}
        cornerRadius={15}
      />
      
      <Text
        x={width / 2}
        y={55}
        text={`Add ${question.targetCount} ${question.emoji} to the chart!`}
        fontSize={22}
        fill="#2C5282"
        fontStyle="bold"
        align="center"
        offsetX={150}
      />
      
      {/* Pictograph building area */}
      <Rect
        x={50}
        y={130}
        width={width - 100}
        height={120}
        fill="#FFFFF0"
        stroke="#D69E2E"
        strokeWidth={3}
        cornerRadius={15}
      />
      
      <Text
        x={60}
        y={150}
        text={`${question.emoji} ${question.category}:`}
        fontSize={18}
        fill="#744210"
      />
      
      {/* Built emojis */}
      {Array.from({ length: builtCount }).map((_, i) => (
        <Text
          key={i}
          x={200 + i * 45}
          y={145}
          text={question.emoji}
          fontSize={36}
        />
      ))}
      
      {/* Current count */}
      <Text
        x={width / 2}
        y={200}
        text={`You added: ${builtCount}`}
        fontSize={20}
        fill="#744210"
        fontStyle="bold"
        align="center"
        offsetX={60}
      />
      
      {/* Control buttons */}
      <Group onClick={onRemove} onTap={onRemove}>
        <Circle
          x={width / 2 - 80}
          y={height - 80}
          radius={35}
          fill="#FED7D7"
          stroke="#C53030"
          strokeWidth={3}
        />
        <Text
          x={width / 2 - 80}
          y={height - 80}
          text="−"
          fontSize={40}
          fill="#C53030"
          align="center"
          offsetX={12}
          offsetY={22}
          fontStyle="bold"
        />
      </Group>
      
      <Group onClick={onAdd} onTap={onAdd}>
        <Circle
          x={width / 2 + 80}
          y={height - 80}
          radius={35}
          fill="#C6F6D5"
          stroke="#2F855A"
          strokeWidth={3}
        />
        <Text
          x={width / 2 + 80}
          y={height - 80}
          text="+"
          fontSize={40}
          fill="#2F855A"
          align="center"
          offsetX={12}
          offsetY={22}
          fontStyle="bold"
        />
      </Group>
    </Group>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN CANVAS COMPONENT
// ─────────────────────────────────────────────────────────────

interface DataDetectiveCanvasProps {
  width: number;
  height: number;
}

const DataDetectiveCanvas: React.FC<DataDetectiveCanvasProps> = ({ width, height }) => {
  const {
    currentQuestion,
    selectedAnswer,
    selectedObjects,
    tallyCount,
    pictographBuilt,
    selectAnswer,
    toggleObjectSelection,
    addTallyMark,
    removeTallyMark,
    addToPictograph,
    removeFromPictograph,
    submitAnswer,
    phase,
  } = useDataDetectiveStore();
  
  if (!currentQuestion || phase !== 'playing') return null;
  
  // Render activity based on type
  const renderActivity = () => {
    switch (currentQuestion.type) {
      case 'count-objects':
        return (
          <CountObjectsActivity
            question={currentQuestion}
            width={width}
            height={height - 120}
          />
        );
        
      case 'sort-objects':
        return (
          <SortObjectsActivity
            question={currentQuestion}
            width={width}
            height={height - 80}
            selectedObjects={selectedObjects}
            onToggle={toggleObjectSelection}
          />
        );
        
      case 'make-tally':
        return (
          <MakeTallyActivity
            question={currentQuestion}
            width={width}
            height={height - 80}
            tallyCount={tallyCount}
            onAdd={addTallyMark}
            onRemove={removeTallyMark}
          />
        );
        
      case 'read-tally':
        return (
          <ReadTallyActivity
            question={currentQuestion}
            width={width}
            height={height - 120}
          />
        );
        
      case 'read-pictograph':
        return (
          <ReadPictographActivity
            question={currentQuestion}
            width={width}
            height={height - 120}
          />
        );
        
      case 'compare-data':
        return (
          <CompareDataActivity
            question={currentQuestion}
            width={width}
            height={height - 120}
          />
        );
        
      case 'data-question':
        return (
          <DataQuestionActivity
            question={currentQuestion}
            width={width}
            height={height - 120}
          />
        );
        
      case 'build-pictograph':
        return (
          <BuildPictographActivity
            question={currentQuestion}
            width={width}
            height={height - 80}
            builtCount={pictographBuilt}
            onAdd={addToPictograph}
            onRemove={removeFromPictograph}
          />
        );
        
      default:
        return null;
    }
  };
  
  // Render answer options for MCQ-type questions
  const renderOptions = () => {
    let options: (string | number)[] = [];
    
    switch (currentQuestion.type) {
      case 'count-objects':
      case 'read-tally':
      case 'data-question':
        options = currentQuestion.options;
        break;
      case 'read-pictograph':
      case 'compare-data':
        options = currentQuestion.options;
        break;
      default:
        return null;
    }
    
    const buttonWidth = (width - 60) / options.length - 10;
    const buttonY = height - 90;
    
    return (
      <>
        {options.map((opt, idx) => {
          const x = 40 + idx * (buttonWidth + 10);
          const isSelected = selectedAnswer === opt;
          
          return (
            <Group
              key={`opt-${idx}`}
              onClick={() => selectAnswer(opt)}
              onTap={() => selectAnswer(opt)}
            >
              <Rect
                x={x}
                y={buttonY}
                width={buttonWidth}
                height={60}
                fill={isSelected ? '#C6F6D5' : '#FFFFFF'}
                stroke={isSelected ? '#38A169' : '#CBD5E0'}
                strokeWidth={isSelected ? 4 : 2}
                cornerRadius={12}
                shadowColor="black"
                shadowBlur={5}
                shadowOpacity={0.1}
                shadowOffset={{ x: 0, y: 2 }}
              />
              
              <Text
                x={x + buttonWidth / 2}
                y={buttonY + 18}
                text={String(opt)}
                fontSize={22}
                fill={isSelected ? '#22543D' : '#4A5568'}
                fontStyle="bold"
                align="center"
                offsetX={String(opt).length * 6}
              />
            </Group>
          );
        })}
      </>
    );
  };
  
  // Check if submit is available
  const canSubmit = () => {
    switch (currentQuestion.type) {
      case 'count-objects':
      case 'read-tally':
      case 'read-pictograph':
      case 'compare-data':
      case 'data-question':
        return selectedAnswer !== null;
      case 'sort-objects':
        return selectedObjects.length > 0;
      case 'make-tally':
        return tallyCount > 0;
      case 'build-pictograph':
        return pictographBuilt > 0;
      default:
        return false;
    }
  };
  
  // Render submit button for non-MCQ activities
  const renderSubmitButton = () => {
    if (['sort-objects', 'make-tally', 'build-pictograph'].includes(currentQuestion.type)) {
      const buttonX = width / 2 - 60;
      const buttonY = height - 50;
      
      return (
        <Group onClick={canSubmit() ? submitAnswer : undefined} onTap={canSubmit() ? submitAnswer : undefined}>
          <Rect
            x={buttonX}
            y={buttonY}
            width={120}
            height={45}
            fill={canSubmit() ? '#38A169' : '#A0AEC0'}
            cornerRadius={12}
            shadowColor="black"
            shadowBlur={5}
            shadowOpacity={0.2}
          />
          <Text
            x={buttonX + 60}
            y={buttonY + 12}
            text="Check ✓"
            fontSize={18}
            fill="#FFFFFF"
            fontStyle="bold"
            align="center"
            offsetX={35}
          />
        </Group>
      );
    }
    return null;
  };
  
  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#F7FAFC"
        />
        
        {/* Activity content */}
        {renderActivity()}
        
        {/* Answer options */}
        {renderOptions()}
        
        {/* Submit button */}
        {renderSubmitButton()}
      </Layer>
    </Stage>
  );
};

export default DataDetectiveCanvas;
