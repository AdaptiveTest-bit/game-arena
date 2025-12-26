/**
 * Utility functions for the Rope Cutter game
 */

export interface ErrorAnalysis {
  type: 'precision_error' | 'conceptual_error' | null;
  description: string;
}

/**
 * Analyzes cut locations to determine error type
 */
export const analyzeErrorType = (
  cuts: number[],
  expectedPositions: number[],
  tolerance: number
): ErrorAnalysis => {
  if (cuts.length === 0) {
    return {
      type: null,
      description: 'No cuts made',
    };
  }

  // Check if all cuts are valid (within tolerance)
  const allValid = cuts.every((cut) =>
    expectedPositions.some((expected) => Math.abs(cut - expected) <= tolerance)
  );

  if (allValid) {
    return {
      type: null,
      description: 'All cuts are correct',
    };
  }

  // Check for precision errors (cuts are close but not within tolerance)
  const hasPrecisionErrors = cuts.some((cut) => {
    const hasCloseMatch = expectedPositions.some(
      (expected) => Math.abs(cut - expected) <= tolerance * 3 // 0.6m tolerance for "close"
    );
    const isNotValid = !expectedPositions.some(
      (expected) => Math.abs(cut - expected) <= tolerance
    );
    return hasCloseMatch && isNotValid;
  });

  if (hasPrecisionErrors) {
    return {
      type: 'precision_error',
      description: 'Cuts are close but not precise enough. Fine-tune your accuracy.',
    };
  }

  // Otherwise, it's a conceptual error (cuts are random/incorrect)
  return {
    type: 'conceptual_error',
    description: 'Cuts do not follow the correct pattern. Review the mixed fraction concept.',
  };
};

/**
 * Snaps a cut location to the nearest expected position if within tolerance
 */
export const snapCutToGrid = (
  location: number,
  expectedPositions: number[],
  tolerance: number
): number => {
  for (const expected of expectedPositions) {
    if (Math.abs(location - expected) <= tolerance) {
      return expected;
    }
  }
  return location; // Return original if no snap
};

/**
 * Calculates the closest expected position
 */
export const findClosestExpectedPosition = (
  location: number,
  expectedPositions: number[]
): number => {
  return expectedPositions.reduce((closest, expected) =>
    Math.abs(expected - location) < Math.abs(closest - location) ? expected : closest
  );
};

/**
 * Formats a number to 2 decimal places for display
 */
export const formatLength = (value: number): string => {
  return value.toFixed(2);
};

/**
 * Validates if a cut is within the rope bounds
 */
export const isWithinBounds = (location: number, ropeLength: number): boolean => {
  return location > 0 && location < ropeLength;
};

/**
 * Converts a decimal number to a mixed fraction format string
 * E.g., 2.5 -> "2 1/2", 3.33 -> "3 1/3", 4.75 -> "4 3/4"
 */
export const decimalToMixedFraction = (value: number): string => {
  const whole = Math.floor(value);
  const decimal = value - whole;

  // Handle whole numbers
  if (decimal === 0) {
    return `${whole}`;
  }

  // Common fractions mapping for decimals
  const fractionMap: { [key: number]: [number, number] } = {
    0.5: [1, 2],
    0.33: [1, 3],
    0.67: [2, 3],
    0.25: [1, 4],
    0.75: [3, 4],
    0.2: [1, 5],
    0.4: [2, 5],
    0.6: [3, 5],
    0.8: [4, 5],
    0.167: [1, 6],
    0.333: [1, 3],
    0.667: [2, 3],
    0.833: [5, 6],
  };

  // Find closest fraction
  let closestFraction: [number, number] = [1, 2];
  let minDiff = 1;

  for (const [decimalKey, fraction] of Object.entries(fractionMap)) {
    const diff = Math.abs(parseFloat(decimalKey) - decimal);
    if (diff < minDiff) {
      minDiff = diff;
      closestFraction = fraction;
    }
  }

  if (whole === 0) {
    return `${closestFraction[0]}/${closestFraction[1]}`;
  }

  return `${whole} ${closestFraction[0]}/${closestFraction[1]}`;
};

/**
 * Mock function to submit telemetry to backend
 */
export const submitTelemetry = (log: any): void => {
  console.log('📊 TELEMETRY LOG SUBMITTED:');
  console.log(JSON.stringify(log, null, 2));
};
