'use client';

// Coin Kingdom - Canvas Component
// CBSE Class 1 Mathematics - Chapter 7: Money

import React, { useRef, useState } from 'react';
import { Stage, Layer, Group, Rect, Circle, Text, Line } from 'react-konva';
import { useCoinKingdomStore } from '@/app/store/useCoinKingdomStore';
import {
  Currency,
  CoinCollectorRoundConfig,
  PiggyBankRoundConfig,
  MoneyCounterRoundConfig,
  ExactChangeRoundConfig,
  MoneyBalanceRoundConfig,
  ShopRoundConfig,
  ShopItem,
} from '@/app/utils/moneyUtils';

// ============== LAYOUT CONSTANTS ==============

const LAYOUT = {
  COIN_SIZE: 50,
  NOTE_WIDTH: 70,
  NOTE_HEIGHT: 40,
  PIGGY_WIDTH: 100,
  PIGGY_HEIGHT: 80,
  SHOP_ITEM_SIZE: 80,
};

interface CoinKingdomCanvasProps {
  width: number;
  height: number;
}

// ============== COIN COMPONENT ==============

interface CoinComponentProps {
  currency: Currency;
  x: number;
  y: number;
  draggable?: boolean;
  onClick?: () => void;
  onDragEnd?: (x: number, y: number) => void;
  scale?: number;
  isHighlighted?: boolean;
}

const CoinComponent: React.FC<CoinComponentProps> = ({
  currency,
  x,
  y,
  draggable = false,
  onClick,
  onDragEnd,
  scale = 1,
  isHighlighted = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const groupRef = useRef<any>(null);

  const size = currency.isNote 
    ? { w: LAYOUT.NOTE_WIDTH * scale, h: LAYOUT.NOTE_HEIGHT * scale }
    : { w: LAYOUT.COIN_SIZE * scale, h: LAYOUT.COIN_SIZE * scale };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (groupRef.current && onDragEnd) {
      const pos = groupRef.current.getAbsolutePosition();
      onDragEnd(pos.x, pos.y);
      // Reset position
      groupRef.current.position({ x, y });
    }
  };

  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      draggable={draggable}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      onTap={onClick}
    >
      {currency.isNote ? (
        // Note rendering
        <>
          <Rect
            width={size.w}
            height={size.h}
            fill={currency.color}
            cornerRadius={6}
            stroke={isHighlighted ? '#FFD700' : '#333'}
            strokeWidth={isHighlighted ? 3 : 1}
            shadowBlur={isDragging ? 12 : 5}
            shadowOpacity={0.3}
            shadowOffsetY={isDragging ? 6 : 2}
          />
          <Text
            text={currency.label}
            x={0}
            y={size.h / 2 - 8}
            width={size.w}
            fontSize={16 * scale}
            fontStyle="bold"
            fill="#FFF"
            align="center"
          />
        </>
      ) : (
        // Coin rendering
        <>
          <Circle
            radius={size.w / 2}
            fill={currency.color}
            stroke={isHighlighted ? '#FFD700' : '#8B7355'}
            strokeWidth={isHighlighted ? 4 : 3}
            shadowBlur={isDragging ? 12 : 5}
            shadowOpacity={0.3}
            shadowOffsetY={isDragging ? 6 : 2}
          />
          <Circle
            radius={size.w / 2 - 6}
            stroke="#FFF"
            strokeWidth={1}
            opacity={0.5}
          />
          <Text
            text={currency.label}
            x={-size.w / 2}
            y={-8}
            width={size.w}
            fontSize={14 * scale}
            fontStyle="bold"
            fill="#333"
            align="center"
          />
        </>
      )}
    </Group>
  );
};

// ============== PIGGY BANK COMPONENT ==============

interface PiggyBankProps {
  value: number;
  x: number;
  y: number;
  isTarget?: boolean;
  onClick?: () => void;
}

const PiggyBankComponent: React.FC<PiggyBankProps> = ({ value, x, y, isTarget = false, onClick }) => {
  const colors: Record<number, string> = {
    1: '#FFB6C1',  // Light pink
    2: '#98FB98',  // Pale green
    5: '#87CEEB',  // Sky blue
    10: '#FFD700', // Gold
    20: '#DDA0DD', // Plum
    50: '#F0E68C', // Khaki
  };

  const bgColor = colors[value] || '#FFB6C1';

  return (
    <Group x={x} y={y} onClick={onClick} onTap={onClick}>
      {/* Piggy body */}
      <Rect
        x={0}
        y={10}
        width={LAYOUT.PIGGY_WIDTH}
        height={LAYOUT.PIGGY_HEIGHT - 10}
        fill={bgColor}
        cornerRadius={20}
        stroke={isTarget ? '#FF6B6B' : '#333'}
        strokeWidth={isTarget ? 3 : 2}
        shadowBlur={8}
        shadowOpacity={0.2}
      />
      {/* Coin slot */}
      <Rect
        x={LAYOUT.PIGGY_WIDTH / 2 - 15}
        y={5}
        width={30}
        height={8}
        fill="#333"
        cornerRadius={4}
      />
      {/* Value label */}
      <Text
        text={`₹${value}`}
        x={0}
        y={LAYOUT.PIGGY_HEIGHT / 2}
        width={LAYOUT.PIGGY_WIDTH}
        fontSize={22}
        fontStyle="bold"
        fill="#333"
        align="center"
      />
      {/* Piggy face */}
      <Circle x={LAYOUT.PIGGY_WIDTH - 15} y={35} radius={8} fill={bgColor} stroke="#333" strokeWidth={1} />
      <Circle x={LAYOUT.PIGGY_WIDTH - 12} y={33} radius={2} fill="#333" />
      <Circle x={LAYOUT.PIGGY_WIDTH - 18} y={33} radius={2} fill="#333" />
      {/* Legs */}
      <Rect x={15} y={LAYOUT.PIGGY_HEIGHT - 5} width={12} height={15} fill={bgColor} stroke="#333" strokeWidth={1} />
      <Rect x={LAYOUT.PIGGY_WIDTH - 27} y={LAYOUT.PIGGY_HEIGHT - 5} width={12} height={15} fill={bgColor} stroke="#333" strokeWidth={1} />
    </Group>
  );
};

// ============== SHOP ITEM COMPONENT ==============

interface ShopItemComponentProps {
  item: ShopItem;
  x: number;
  y: number;
  isTarget?: boolean;
  onClick?: () => void;
}

const ShopItemComponent: React.FC<ShopItemComponentProps> = ({ item, x, y, isTarget = false }) => {
  return (
    <Group x={x} y={y}>
      <Rect
        width={LAYOUT.SHOP_ITEM_SIZE}
        height={LAYOUT.SHOP_ITEM_SIZE + 25}
        fill="#FFF"
        cornerRadius={10}
        stroke={isTarget ? '#22C55E' : '#DDD'}
        strokeWidth={isTarget ? 3 : 1}
        shadowBlur={8}
        shadowOpacity={0.15}
      />
      <Text
        text={item.emoji}
        x={0}
        y={10}
        width={LAYOUT.SHOP_ITEM_SIZE}
        fontSize={40}
        align="center"
      />
      <Text
        text={item.name}
        x={0}
        y={55}
        width={LAYOUT.SHOP_ITEM_SIZE}
        fontSize={12}
        fill="#666"
        align="center"
      />
      {/* Price tag */}
      <Rect
        x={LAYOUT.SHOP_ITEM_SIZE / 2 - 20}
        y={LAYOUT.SHOP_ITEM_SIZE}
        width={40}
        height={22}
        fill={isTarget ? '#22C55E' : '#FFD700'}
        cornerRadius={4}
      />
      <Text
        text={`₹${item.price}`}
        x={LAYOUT.SHOP_ITEM_SIZE / 2 - 20}
        y={LAYOUT.SHOP_ITEM_SIZE + 4}
        width={40}
        fontSize={13}
        fontStyle="bold"
        fill={isTarget ? '#FFF' : '#333'}
        align="center"
      />
    </Group>
  );
};

// ============== BALANCE SCALE COMPONENT ==============

interface BalanceScaleProps {
  leftTotal: number;
  rightTotal: number;
  leftCoins: Currency[];
  rightCoins: Currency[];
  centerX: number;
  centerY: number;
  showAnswer?: boolean;
}

const BalanceScaleComponent: React.FC<BalanceScaleProps> = ({
  leftTotal,
  rightTotal,
  leftCoins,
  rightCoins,
  centerX,
  centerY,
  showAnswer = false,
}) => {
  // Calculate tilt based on totals
  const tiltAngle = showAnswer 
    ? (leftTotal > rightTotal ? -10 : leftTotal < rightTotal ? 10 : 0)
    : 0;

  const plateWidth = 140;
  const plateY = 80;
  const leftPlateX = centerX - 120;
  const rightPlateX = centerX + 120;

  // Adjust plate positions based on tilt
  const leftOffset = showAnswer ? (leftTotal > rightTotal ? 15 : leftTotal < rightTotal ? -15 : 0) : 0;
  const rightOffset = showAnswer ? (leftTotal > rightTotal ? -15 : leftTotal < rightTotal ? 15 : 0) : 0;

  return (
    <Group>
      {/* Base */}
      <Rect
        x={centerX - 30}
        y={centerY + 100}
        width={60}
        height={20}
        fill="#8B4513"
        cornerRadius={5}
      />
      {/* Post */}
      <Rect
        x={centerX - 8}
        y={centerY}
        width={16}
        height={100}
        fill="#8B4513"
      />
      {/* Beam */}
      <Line
        points={[leftPlateX, centerY + leftOffset, rightPlateX, centerY + rightOffset]}
        stroke="#8B4513"
        strokeWidth={8}
        lineCap="round"
      />
      {/* Left plate */}
      <Rect
        x={leftPlateX - plateWidth / 2}
        y={plateY + centerY + leftOffset}
        width={plateWidth}
        height={12}
        fill="#CD853F"
        cornerRadius={6}
      />
      {/* Right plate */}
      <Rect
        x={rightPlateX - plateWidth / 2}
        y={plateY + centerY + rightOffset}
        width={plateWidth}
        height={12}
        fill="#CD853F"
        cornerRadius={6}
      />
      {/* Chains */}
      <Line points={[leftPlateX - plateWidth / 2 + 10, plateY + centerY + leftOffset, leftPlateX, centerY + leftOffset]} stroke="#666" strokeWidth={2} />
      <Line points={[leftPlateX + plateWidth / 2 - 10, plateY + centerY + leftOffset, leftPlateX, centerY + leftOffset]} stroke="#666" strokeWidth={2} />
      <Line points={[rightPlateX - plateWidth / 2 + 10, plateY + centerY + rightOffset, rightPlateX, centerY + rightOffset]} stroke="#666" strokeWidth={2} />
      <Line points={[rightPlateX + plateWidth / 2 - 10, plateY + centerY + rightOffset, rightPlateX, centerY + rightOffset]} stroke="#666" strokeWidth={2} />

      {/* Left coins */}
      {leftCoins.map((coin, idx) => (
        <CoinComponent
          key={coin.id}
          currency={coin}
          x={leftPlateX - plateWidth / 2 + 15 + (idx % 4) * 32}
          y={plateY + centerY + leftOffset - 35 - Math.floor(idx / 4) * 30}
          scale={0.6}
        />
      ))}

      {/* Right coins */}
      {rightCoins.map((coin, idx) => (
        <CoinComponent
          key={coin.id}
          currency={coin}
          x={rightPlateX - plateWidth / 2 + 15 + (idx % 4) * 32}
          y={plateY + centerY + rightOffset - 35 - Math.floor(idx / 4) * 30}
          scale={0.6}
        />
      ))}

      {/* Labels */}
      <Text
        text="Left"
        x={leftPlateX - 20}
        y={plateY + centerY + leftOffset + 20}
        fontSize={14}
        fontStyle="bold"
        fill="#666"
      />
      <Text
        text="Right"
        x={rightPlateX - 20}
        y={plateY + centerY + rightOffset + 20}
        fontSize={14}
        fontStyle="bold"
        fill="#666"
      />
    </Group>
  );
};

// ============== MAIN CANVAS COMPONENT ==============

const CoinKingdomCanvas: React.FC<CoinKingdomCanvasProps> = ({ width, height }) => {
  const {
    currentMode,
    roundConfig,
    selectCurrency,
    sortToPiggyBank,
    countCoin,
    placeExactChangeCoin,
    removeExactChangeCoin,
    payForItem,
    removePayment,
    isRoundComplete,
    showFeedback,
  } = useCoinKingdomStore();

  if (!roundConfig) return null;

  // ============== MODE: COIN COLLECTOR ==============
  const renderCoinCollector = () => {
    const config = roundConfig as CoinCollectorRoundConfig;
    const centerX = width / 2;

    return (
      <>
        {/* Target display */}
        <Group x={centerX - 100} y={30}>
          <Rect
            width={200}
            height={60}
            fill="#FEF3C7"
            cornerRadius={15}
            stroke="#F59E0B"
            strokeWidth={2}
          />
          <Text
            text={`Find the ${config.targetCurrency.label} ${config.targetCurrency.isNote ? 'note' : 'coin'}!`}
            x={0}
            y={20}
            width={200}
            fontSize={16}
            fontStyle="bold"
            fill="#92400E"
            align="center"
          />
        </Group>

        {/* Conveyor belt */}
        <Rect
          x={30}
          y={height / 2 - 40}
          width={width - 60}
          height={100}
          fill="#8B7355"
          cornerRadius={10}
        />
        <Rect
          x={40}
          y={height / 2 - 30}
          width={width - 80}
          height={80}
          fill="#A0522D"
          cornerRadius={8}
        />

        {/* Coins on conveyor */}
        {config.conveyorItems.map((currency, idx) => {
          const spacing = (width - 120) / config.conveyorItems.length;
          const coinX = 60 + idx * spacing;
          
          return (
            <CoinComponent
              key={currency.id}
              currency={currency}
              x={coinX}
              y={height / 2 - 5}
              onClick={() => !isRoundComplete && selectCurrency(currency)}
              isHighlighted={false}
            />
          );
        })}

        {/* Treasure chest */}
        <Group x={width / 2 - 50} y={height - 130}>
          <Rect
            width={100}
            height={70}
            fill="#8B4513"
            cornerRadius={10}
            stroke="#5D3A1A"
            strokeWidth={3}
          />
          <Rect
            x={40}
            y={20}
            width={20}
            height={15}
            fill="#FFD700"
            cornerRadius={3}
          />
          <Text
            text="🎁"
            x={30}
            y={35}
            fontSize={30}
          />
        </Group>
      </>
    );
  };

  // ============== MODE: PIGGY BANK SORT ==============
  const renderPiggyBankSort = () => {
    const config = roundConfig as PiggyBankRoundConfig;
    const piggyCount = config.piggyBankValues.length;
    const piggySpacing = (width - 60) / piggyCount;
    const currentCoin = config.currenciesToSort[0];

    return (
      <>
        {/* Current coin to sort */}
        {currentCoin && !isRoundComplete && (
          <Group x={width / 2 - 40} y={40}>
            <Rect
              width={80}
              height={80}
              fill="#FEF3C7"
              cornerRadius={15}
              stroke="#F59E0B"
              strokeWidth={2}
            />
            <CoinComponent
              currency={currentCoin}
              x={40}
              y={40}
            />
            <Text
              text={`Sort this: ${currentCoin.label}`}
              x={-60}
              y={90}
              width={200}
              fontSize={14}
              fontStyle="bold"
              fill="#92400E"
              align="center"
            />
          </Group>
        )}

        {/* Progress indicator */}
        <Text
          text={`Sorted: ${config.sortedCount} / ${config.sortedCount + config.currenciesToSort.length}`}
          x={width - 120}
          y={20}
          fontSize={14}
          fill="#666"
        />

        {/* Piggy banks */}
        {config.piggyBankValues.map((value, idx) => (
          <PiggyBankComponent
            key={value}
            value={value}
            x={30 + idx * piggySpacing}
            y={height - 150}
            onClick={() => currentCoin && !isRoundComplete && sortToPiggyBank(currentCoin, value)}
          />
        ))}

        {/* Remaining coins preview */}
        <Group x={20} y={height / 2 - 30}>
          <Text text="Coming up:" x={0} y={-20} fontSize={12} fill="#666" />
          {config.currenciesToSort.slice(1, 5).map((coin, idx) => (
            <CoinComponent
              key={coin.id}
              currency={coin}
              x={idx * 45 + 25}
              y={10}
              scale={0.7}
            />
          ))}
        </Group>
      </>
    );
  };

  // ============== MODE: MONEY COUNTER ==============
  const renderMoneyCounter = () => {
    const config = roundConfig as MoneyCounterRoundConfig;
    const coinsPerRow = 5;
    const startX = (width - coinsPerRow * 70) / 2;
    const startY = 100;

    return (
      <>
        {/* Wallet background */}
        <Rect
          x={30}
          y={60}
          width={width - 60}
          height={200}
          fill="#8B4513"
          cornerRadius={20}
          stroke="#5D3A1A"
          strokeWidth={3}
        />
        <Rect
          x={50}
          y={80}
          width={width - 100}
          height={160}
          fill="#D2691E"
          cornerRadius={15}
        />

        {/* Coins in wallet */}
        {config.coins.map((coin, idx) => {
          const row = Math.floor(idx / coinsPerRow);
          const col = idx % coinsPerRow;
          const isCounted = config.countedCoins.includes(coin.id);

          return (
            <Group key={coin.id}>
              <CoinComponent
                currency={coin}
                x={startX + col * 70}
                y={startY + row * 60}
                onClick={() => !isRoundComplete && countCoin(coin.id)}
                isHighlighted={isCounted}
              />
              {isCounted && (
                <Text
                  text="✓"
                  x={startX + col * 70 + (coin.isNote ? 50 : 15)}
                  y={startY + row * 60 - 10}
                  fontSize={20}
                  fill="#22C55E"
                  fontStyle="bold"
                />
              )}
            </Group>
          );
        })}

        {/* Count progress */}
        <Group x={width / 2 - 80} y={height - 140}>
          <Rect
            width={160}
            height={45}
            fill="#E8F5E9"
            cornerRadius={10}
            stroke="#4CAF50"
            strokeWidth={2}
          />
          <Text
            text={`Counted: ${config.countedCoins.length} / ${config.coins.length}`}
            x={0}
            y={15}
            width={160}
            fontSize={14}
            fontStyle="bold"
            fill="#2E7D32"
            align="center"
          />
        </Group>
      </>
    );
  };

  // ============== MODE: EXACT CHANGE ==============
  const renderExactChange = () => {
    const config = roundConfig as ExactChangeRoundConfig;
    const availablePerRow = 6;

    return (
      <>
        {/* Target amount */}
        <Group x={width / 2 - 80} y={20}>
          <Rect
            width={160}
            height={50}
            fill="#DBEAFE"
            cornerRadius={12}
            stroke="#3B82F6"
            strokeWidth={2}
          />
          <Text
            text={`Make: ₹${config.targetAmount}`}
            x={0}
            y={15}
            width={160}
            fontSize={20}
            fontStyle="bold"
            fill="#1E40AF"
            align="center"
          />
        </Group>

        {/* Payment plate */}
        <Rect
          x={width / 2 - 130}
          y={90}
          width={260}
          height={120}
          fill="#FFF"
          cornerRadius={15}
          stroke={config.currentTotal === config.targetAmount ? '#22C55E' : config.currentTotal > config.targetAmount ? '#EF4444' : '#DDD'}
          strokeWidth={3}
        />
        <Text
          text="Drop coins here"
          x={width / 2 - 50}
          y={95}
          fontSize={12}
          fill="#999"
        />

        {/* Placed coins */}
        {config.placedCoins.map((coin, idx) => (
          <CoinComponent
            key={coin.id}
            currency={coin}
            x={width / 2 - 110 + (idx % 4) * 60}
            y={120 + Math.floor(idx / 4) * 50}
            onClick={() => !isRoundComplete && removeExactChangeCoin(coin.id)}
            scale={0.9}
          />
        ))}

        {/* Current total */}
        <Group x={width / 2 - 60} y={220}>
          <Rect
            width={120}
            height={35}
            fill={config.currentTotal === config.targetAmount ? '#DCFCE7' : config.currentTotal > config.targetAmount ? '#FEE2E2' : '#FEF9C3'}
            cornerRadius={8}
          />
          <Text
            text={`Total: ₹${config.currentTotal}`}
            x={0}
            y={10}
            width={120}
            fontSize={16}
            fontStyle="bold"
            fill={config.currentTotal === config.targetAmount ? '#16A34A' : config.currentTotal > config.targetAmount ? '#DC2626' : '#CA8A04'}
            align="center"
          />
        </Group>

        {/* Available coins tray */}
        <Rect
          x={20}
          y={height - 140}
          width={width - 40}
          height={120}
          fill="#FEF3C7"
          cornerRadius={15}
          stroke="#F59E0B"
          strokeWidth={2}
        />
        <Text
          text="Your coins (tap to add):"
          x={30}
          y={height - 130}
          fontSize={12}
          fill="#92400E"
        />

        {/* Show unique coin types as buttons */}
        {(() => {
          const uniqueTypes = [...new Set(config.availableCoins.map(c => c.type))];
          const usedCounts: Record<string, number> = {};
          config.placedCoins.forEach(c => {
            usedCounts[c.type] = (usedCounts[c.type] || 0) + 1;
          });

          return uniqueTypes.map((type, idx) => {
            const coin = config.availableCoins.find(c => c.type === type)!;
            const totalOfType = config.availableCoins.filter(c => c.type === type).length;
            const usedOfType = usedCounts[type] || 0;
            const remaining = totalOfType - usedOfType;

            if (remaining <= 0) return null;

            return (
              <Group key={type}>
                <CoinComponent
                  currency={coin}
                  x={40 + idx * 70}
                  y={height - 85}
                  onClick={() => {
                    const available = config.availableCoins.find(c => c.type === type && !config.placedCoins.includes(c));
                    if (available && !isRoundComplete) placeExactChangeCoin(available);
                  }}
                />
                <Text
                  text={`×${remaining}`}
                  x={40 + idx * 70 + (coin.isNote ? 50 : 20)}
                  y={height - 70}
                  fontSize={12}
                  fill="#666"
                />
              </Group>
            );
          });
        })()}
      </>
    );
  };

  // ============== MODE: MONEY BALANCE ==============
  const renderMoneyBalance = () => {
    const config = roundConfig as MoneyBalanceRoundConfig;

    return (
      <>
        {/* Question */}
        <Text
          text="Which side has more money?"
          x={0}
          y={20}
          width={width}
          fontSize={18}
          fontStyle="bold"
          fill="#333"
          align="center"
        />

        {/* Balance scale */}
        <BalanceScaleComponent
          leftTotal={config.leftTotal}
          rightTotal={config.rightTotal}
          leftCoins={config.leftSide}
          rightCoins={config.rightSide}
          centerX={width / 2}
          centerY={80}
          showAnswer={showFeedback}
        />
      </>
    );
  };

  // ============== MODE: SHOP AND PAY ==============
  const renderShopAndPay = () => {
    const config = roundConfig as ShopRoundConfig;
    const itemSpacing = (width - 60) / config.shopItems.length;

    return (
      <>
        {/* Shop header */}
        <Rect
          x={20}
          y={15}
          width={width - 40}
          height={40}
          fill="#8B5CF6"
          cornerRadius={10}
        />
        <Text
          text="🏪 Welcome to the Shop!"
          x={0}
          y={25}
          width={width}
          fontSize={18}
          fontStyle="bold"
          fill="#FFF"
          align="center"
        />

        {/* Shop items */}
        {config.shopItems.map((item, idx) => (
          <ShopItemComponent
            key={item.id}
            item={item}
            x={30 + idx * itemSpacing}
            y={70}
            isTarget={item.id === config.targetItem.id}
          />
        ))}

        {/* Customer speech bubble */}
        <Group x={width / 2 - 120} y={190}>
          <Rect
            width={240}
            height={45}
            fill="#FEF3C7"
            cornerRadius={10}
            stroke="#F59E0B"
            strokeWidth={2}
          />
          <Text
            text={`"I want to buy the ${config.targetItem.name} ${config.targetItem.emoji}"`}
            x={10}
            y={12}
            width={220}
            fontSize={13}
            fill="#92400E"
            align="center"
          />
        </Group>

        {/* Payment area */}
        <Rect
          x={width / 2 - 120}
          y={250}
          width={240}
          height={80}
          fill="#FFF"
          cornerRadius={12}
          stroke={config.currentPaid === config.targetItem.price ? '#22C55E' : config.currentPaid > config.targetItem.price ? '#EF4444' : '#DDD'}
          strokeWidth={2}
        />
        <Text
          text="Payment"
          x={width / 2 - 30}
          y={255}
          fontSize={12}
          fill="#999"
        />

        {/* Paid coins */}
        {config.paidCoins.map((coin, idx) => (
          <CoinComponent
            key={coin.id}
            currency={coin}
            x={width / 2 - 100 + (idx % 4) * 55}
            y={275 + Math.floor(idx / 4) * 40}
            onClick={() => !isRoundComplete && removePayment(coin.id)}
            scale={0.8}
          />
        ))}

        {/* Current paid amount */}
        <Text
          text={`Paid: ₹${config.currentPaid} / ₹${config.targetItem.price}`}
          x={width / 2 - 60}
          y={335}
          fontSize={14}
          fontStyle="bold"
          fill={config.currentPaid === config.targetItem.price ? '#16A34A' : '#666'}
        />

        {/* Money tray */}
        <Rect
          x={20}
          y={height - 120}
          width={width - 40}
          height={100}
          fill="#E8F5E9"
          cornerRadius={12}
          stroke="#4CAF50"
          strokeWidth={2}
        />
        <Text
          text="Your money (tap to pay):"
          x={30}
          y={height - 110}
          fontSize={12}
          fill="#2E7D32"
        />

        {/* Available money */}
        {(() => {
          const uniqueTypes = [...new Set(config.availableMoney.map(c => c.type))];
          const usedCounts: Record<string, number> = {};
          config.paidCoins.forEach(c => {
            usedCounts[c.type] = (usedCounts[c.type] || 0) + 1;
          });

          return uniqueTypes.map((type, idx) => {
            const coin = config.availableMoney.find(c => c.type === type)!;
            const totalOfType = config.availableMoney.filter(c => c.type === type).length;
            const usedOfType = usedCounts[type] || 0;
            const remaining = totalOfType - usedOfType;

            if (remaining <= 0) return null;

            return (
              <Group key={type}>
                <CoinComponent
                  currency={coin}
                  x={40 + idx * 65}
                  y={height - 70}
                  onClick={() => {
                    const available = config.availableMoney.find(c => c.type === type && !config.paidCoins.some(p => p.id === c.id));
                    if (available && !isRoundComplete) payForItem(available);
                  }}
                  scale={0.85}
                />
                <Text
                  text={`×${remaining}`}
                  x={40 + idx * 65 + (coin.isNote ? 45 : 18)}
                  y={height - 55}
                  fontSize={11}
                  fill="#2E7D32"
                />
              </Group>
            );
          });
        })()}
      </>
    );
  };

  // ============== RENDER BASED ON MODE ==============

  const renderContent = () => {
    switch (currentMode) {
      case 'coin-collector': return renderCoinCollector();
      case 'piggy-bank-sort': return renderPiggyBankSort();
      case 'money-counter': return renderMoneyCounter();
      case 'exact-change': return renderExactChange();
      case 'money-balance': return renderMoneyBalance();
      case 'shop-and-pay': return renderShopAndPay();
      default: return null;
    }
  };

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Background */}
        <Rect
          width={width}
          height={height}
          fill="#FFF8E7"
        />
        
        {renderContent()}
      </Layer>
    </Stage>
  );
};

export default CoinKingdomCanvas;
