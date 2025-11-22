// Pure functions for Ludo game dice mechanics

import { DICE_MIN, DICE_MAX, ENTRY_ROLL } from './constants.js';

/**
 * Rolls a dice and returns a random integer between 1 and 6
 * @returns {number} Random dice value (1-6)
 */
export const rollDice = () => {
  return Math.floor(Math.random() * (DICE_MAX - DICE_MIN + 1)) + DICE_MIN;
};

/**
 * Checks if the dice roll is a six
 * @param {number} value - The dice value to check
 * @returns {boolean} True if the value is 6, false otherwise
 */
export const isSix = (value) => {
  return value === 6;
};

/**
 * Creates a dice state object with the given value
 * @param {number} value - The dice value (1-6)
 * @returns {Object} Dice state object with currentValue property
 */
export const getDiceState = (value) => {
  return {
    currentValue: value
  };
};

/**
 * Validates if a dice value is within valid range
 * @param {number} value - The dice value to validate
 * @returns {boolean} True if value is between 1 and 6, false otherwise
 */
export const isValidDiceValue = (value) => {
  return typeof value === 'number' && 
         Number.isInteger(value) && 
         value >= DICE_MIN && 
         value <= DICE_MAX;
};

/**
 * Checks if the dice roll allows a token to enter the game from base
 * @param {number} value - The dice value to check
 * @returns {boolean} True if the value allows entry (currently 6), false otherwise
 */
export const canEnterWithRoll = (value) => {
  return value === ENTRY_ROLL;
};

/**
 * Checks if the dice roll grants an extra turn
 * @param {number} value - The dice value to check
 * @returns {boolean} True if the value grants extra turn (currently 6), false otherwise
 */
export const grantsExtraTurn = (value) => {
  return value === 6;
};

/**
 * Gets the display representation of a dice value
 * @param {number} value - The dice value (1-6)
 * @returns {string} String representation of the dice value
 */
export const getDiceDisplay = (value) => {
  if (!isValidDiceValue(value)) {
    return '?';
  }
  return value.toString();
};

/**
 * Gets the Unicode dice character for visual representation
 * @param {number} value - The dice value (1-6)
 * @returns {string} Unicode dice character
 */
export const getDiceUnicode = (value) => {
  const diceChars = {
    1: '⚀',
    2: '⚁', 
    3: '⚂',
    4: '⚃',
    5: '⚄',
    6: '⚅'
  };
  
  return diceChars[value] || '?';
};

/**
 * Creates a detailed dice result object with all relevant information
 * @param {number} value - The dice value (1-6)
 * @returns {Object} Comprehensive dice result object
 */
export const createDiceResult = (value) => {
  return {
    value,
    isSix: isSix(value),
    canEnter: canEnterWithRoll(value),
    grantsExtraTurn: grantsExtraTurn(value),
    display: getDiceDisplay(value),
    unicode: getDiceUnicode(value),
    isValid: isValidDiceValue(value)
  };
};

/**
 * Simulates multiple dice rolls for testing purposes
 * @param {number} count - Number of rolls to simulate
 * @returns {number[]} Array of dice values
 */
export const simulateRolls = (count) => {
  if (count <= 0) return [];
  
  const rolls = [];
  for (let i = 0; i < count; i++) {
    rolls.push(rollDice());
  }
  return rolls;
};

/**
 * Calculates statistics for a series of dice rolls
 * @param {number[]} rolls - Array of dice values
 * @returns {Object} Statistics object with counts and percentages
 */
export const calculateRollStats = (rolls) => {
  if (!Array.isArray(rolls) || rolls.length === 0) {
    return {
      total: 0,
      counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      percentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      sixCount: 0,
      sixPercentage: 0
    };
  }

  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  
  // Count occurrences of each value
  rolls.forEach(roll => {
    if (isValidDiceValue(roll)) {
      counts[roll]++;
    }
  });

  const total = rolls.length;
  const percentages = {};
  
  // Calculate percentages
  for (let i = 1; i <= 6; i++) {
    percentages[i] = total > 0 ? (counts[i] / total) * 100 : 0;
  }

  return {
    total,
    counts,
    percentages,
    sixCount: counts[6],
    sixPercentage: percentages[6]
  };
};
