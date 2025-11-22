// Turn state machine for Ludo game - manages turn phases and transitions

import { rollDice } from './dice.js';
import { handleDiceRoll, handleMove, getPossibleMoves } from './gameLogic.js';
import { updateTurn, getCurrentPlayer } from './gameState.js';

/**
 * Turn phase constants defining the possible states of a turn
 */
export const TURN_PHASES = {
  WAITING_FOR_ROLL: 'WAITING_FOR_ROLL',
  WAITING_FOR_MOVE: 'WAITING_FOR_MOVE',
  TURN_END: 'TURN_END'
};

/**
 * Action type constants for turn actions
 */
export const ACTION_TYPES = {
  ROLL_DICE: 'ROLL_DICE',
  MAKE_MOVE: 'MAKE_MOVE',
  END_TURN: 'END_TURN'
};

/**
 * Returns the initial turn state for starting a new turn
 * @param {Object} gameState - Current game state
 * @returns {Object} Initial turn state object
 */
export const getInitialTurnState = (gameState) => {
  return {
    gameState: { ...gameState },
    phase: TURN_PHASES.WAITING_FOR_ROLL,
    currentDiceValue: null,
    possibleMoves: [],
    actionHistory: [],
    extraTurnGranted: false
  };
};

/**
 * Main turn state machine function - processes actions and transitions phases
 * @param {Object} turnState - Current turn state
 * @param {Object} action - Action object with type and payload
 * @returns {Object} New turn state after processing the action
 */
export const processTurnAction = (turnState, action) => {
  if (!turnState || !action || !action.type) {
    return turnState;
  }

  // Add action to history
  const newActionHistory = [...turnState.actionHistory, action];

  switch (turnState.phase) {
    case TURN_PHASES.WAITING_FOR_ROLL:
      return handleWaitingForRoll(turnState, action, newActionHistory);
    
    case TURN_PHASES.WAITING_FOR_MOVE:
      return handleWaitingForMove(turnState, action, newActionHistory);
    
    case TURN_PHASES.TURN_END:
      return handleTurnEnd(turnState, action, newActionHistory);
    
    default:
      return turnState;
  }
};

/**
 * Handles actions when in WAITING_FOR_ROLL phase
 * @param {Object} turnState - Current turn state
 * @param {Object} action - Action to process
 * @param {Array} actionHistory - Updated action history
 * @returns {Object} New turn state
 */
const handleWaitingForRoll = (turnState, action, actionHistory) => {
  if (action.type !== ACTION_TYPES.ROLL_DICE) {
    return { ...turnState, actionHistory };
  }

  // Get dice value - either from action or roll new one
  const diceValue = action.value || rollDice();

  // Process dice roll using game logic
  const newGameState = handleDiceRoll(turnState.gameState, diceValue);

  // Get possible moves for the current player
  const possibleMoves = getPossibleMoves(newGameState, diceValue);

  // Determine next phase
  let nextPhase;
  if (possibleMoves.length > 0) {
    // Player has valid moves - wait for move selection
    nextPhase = TURN_PHASES.WAITING_FOR_MOVE;
  } else {
    // No valid moves - end turn immediately
    nextPhase = TURN_PHASES.TURN_END;
  }

  return {
    gameState: newGameState,
    phase: nextPhase,
    currentDiceValue: diceValue,
    possibleMoves,
    actionHistory,
    extraTurnGranted: false
  };
};

/**
 * Handles actions when in WAITING_FOR_MOVE phase
 * @param {Object} turnState - Current turn state
 * @param {Object} action - Action to process
 * @param {Array} actionHistory - Updated action history
 * @returns {Object} New turn state
 */
const handleWaitingForMove = (turnState, action, actionHistory) => {
  if (action.type !== ACTION_TYPES.MAKE_MOVE) {
    return { ...turnState, actionHistory };
  }

  const { tokenId } = action;
  if (!tokenId || !turnState.currentDiceValue) {
    return { ...turnState, actionHistory };
  }

  // Validate the move is among possible moves
  const isValidMove = turnState.possibleMoves.some(token => token.id === tokenId);
  if (!isValidMove) {
    return { ...turnState, actionHistory };
  }

  // Process the move using game logic
  const gameStateBeforeMove = turnState.gameState;
  const newGameState = handleMove(gameStateBeforeMove, tokenId, turnState.currentDiceValue);

  // Determine if extra turn was granted
  const extraTurnGranted = checkExtraTurnGranted(
    gameStateBeforeMove, 
    newGameState, 
    turnState.currentDiceValue
  );

  // Determine next phase
  let nextPhase;
  if (extraTurnGranted) {
    // Extra turn granted - go back to waiting for roll
    nextPhase = TURN_PHASES.WAITING_FOR_ROLL;
  } else {
    // Normal turn progression - end turn
    nextPhase = TURN_PHASES.TURN_END;
  }

  return {
    gameState: newGameState,
    phase: nextPhase,
    currentDiceValue: extraTurnGranted ? null : turnState.currentDiceValue,
    possibleMoves: [],
    actionHistory,
    extraTurnGranted
  };
};

/**
 * Handles actions when in TURN_END phase
 * @param {Object} turnState - Current turn state
 * @param {Object} action - Action to process
 * @param {Array} actionHistory - Updated action history
 * @returns {Object} New turn state
 */
const handleTurnEnd = (turnState, action, actionHistory) => {
  // In TURN_END phase, automatically transition to next player
  // Unless extra turn was granted, in which case stay with same player
  
  let newGameState;
  if (turnState.extraTurnGranted) {
    // Keep same player, just reset turn state
    newGameState = turnState.gameState;
  } else {
    // Switch to next player
    newGameState = updateTurn(turnState.gameState);
  }

  // Return to initial state for new turn
  return {
    gameState: newGameState,
    phase: TURN_PHASES.WAITING_FOR_ROLL,
    currentDiceValue: null,
    possibleMoves: [],
    actionHistory: turnState.extraTurnGranted ? actionHistory : [], // Reset history for new player
    extraTurnGranted: false
  };
};

/**
 * Checks if an extra turn was granted based on game state changes
 * @param {Object} gameStateBefore - Game state before the move
 * @param {Object} gameStateAfter - Game state after the move
 * @param {number} diceValue - The dice value used
 * @returns {boolean} True if extra turn was granted
 */
const checkExtraTurnGranted = (gameStateBefore, gameStateAfter, diceValue) => {
  // Extra turn conditions:
  // 1. Rolled a 6
  if (diceValue === 6) {
    return true;
  }

  // 2. Captured an opponent token (check if any opponent lost a token)
  const beforeTokenCounts = countPlayerTokensInPlay(gameStateBefore);
  const afterTokenCounts = countPlayerTokensInPlay(gameStateAfter);
  
  const currentPlayer = getCurrentPlayer(gameStateBefore);
  const captureOccurred = Object.keys(beforeTokenCounts).some(playerId => {
    if (playerId === currentPlayer.id) return false;
    return beforeTokenCounts[playerId] > afterTokenCounts[playerId];
  });

  if (captureOccurred) {
    return true;
  }

  // 3. Token completed its journey (check if current player gained a completed token)
  const beforeCompleted = countCompletedTokens(gameStateBefore, currentPlayer.id);
  const afterCompleted = countCompletedTokens(gameStateAfter, currentPlayer.id);
  
  if (afterCompleted > beforeCompleted) {
    return true;
  }

  return false;
};

/**
 * Counts tokens in play (out of base but not completed) for each player
 * @param {Object} gameState - Game state to analyze
 * @returns {Object} Object mapping player IDs to token counts
 */
const countPlayerTokensInPlay = (gameState) => {
  const counts = {};
  gameState.players.forEach(player => {
    counts[player.id] = player.tokens.filter(token => 
      token.isOut && !token.isCompleted
    ).length;
  });
  return counts;
};

/**
 * Counts completed tokens for a specific player
 * @param {Object} gameState - Game state to analyze
 * @param {string} playerId - ID of player to count for
 * @returns {number} Number of completed tokens
 */
const countCompletedTokens = (gameState, playerId) => {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return 0;
  
  return player.tokens.filter(token => token.isCompleted).length;
};

/**
 * Validates if a specific action is allowed in the current turn phase
 * @param {Object} turnState - Current turn state
 * @param {Object} action - Action to validate
 * @returns {boolean} True if action is allowed
 */
export const isActionAllowed = (turnState, action) => {
  if (!turnState || !action || !action.type) {
    return false;
  }

  switch (turnState.phase) {
    case TURN_PHASES.WAITING_FOR_ROLL:
      return action.type === ACTION_TYPES.ROLL_DICE;
    
    case TURN_PHASES.WAITING_FOR_MOVE:
      if (action.type === ACTION_TYPES.MAKE_MOVE) {
        // Validate the token can be moved
        return action.tokenId && 
               turnState.possibleMoves.some(token => token.id === action.tokenId);
      }
      return false;
    
    case TURN_PHASES.TURN_END:
      // TURN_END automatically transitions, no user actions required
      return action.type === ACTION_TYPES.END_TURN;
    
    default:
      return false;
  }
};

/**
 * Gets the current phase of the turn
 * @param {Object} turnState - Current turn state
 * @returns {string} Current phase
 */
export const getCurrentPhase = (turnState) => {
  return turnState ? turnState.phase : null;
};

/**
 * Gets information about the current turn state for UI display
 * @param {Object} turnState - Current turn state
 * @returns {Object} Turn state information
 */
export const getTurnStateInfo = (turnState) => {
  if (!turnState) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(turnState.gameState);

  return {
    phase: turnState.phase,
    currentPlayer: currentPlayer ? {
      id: currentPlayer.id,
      color: currentPlayer.color
    } : null,
    diceValue: turnState.currentDiceValue,
    possibleMoves: turnState.possibleMoves.map(token => ({
      tokenId: token.id,
      currentPosition: token.position
    })),
    canRollDice: turnState.phase === TURN_PHASES.WAITING_FOR_ROLL,
    canMakeMove: turnState.phase === TURN_PHASES.WAITING_FOR_MOVE && turnState.possibleMoves.length > 0,
    extraTurnGranted: turnState.extraTurnGranted,
    gameOver: turnState.gameState.isGameOver,
    winners: turnState.gameState.winners
  };
};