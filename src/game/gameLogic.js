// Core game logic for Ludo - manages turn flow and game state transitions

import { isSix, createDiceResult } from './dice.js';
import { 
  moveToken, 
  getValidMoves, 
  hasValidMoves, 
  canCapture
} from './token.js';
import { 
  getCurrentPlayer, 
  getOtherPlayers, 
  updatePlayer, 
  updatePlayers, 
  updateTurn,
  checkAndUpdateGameEnd 
} from './gameState.js';

/**
 * Handles a dice roll and determines the resulting game state
 * @param {Object} gameState - Current game state
 * @param {number} diceValue - The dice roll result (1-6)
 * @returns {Object} New game state with dice roll processed
 */
export const handleDiceRoll = (gameState, diceValue) => {
  if (!gameState || typeof diceValue !== 'number') {
    return gameState;
  }

  const currentPlayer = getCurrentPlayer(gameState);
  if (!currentPlayer) {
    return gameState;
  }

  // Create dice result for this roll
  const diceResult = createDiceResult(diceValue);

  // Update game state with dice information
  let updatedGameState = {
    ...gameState,
    lastDiceRoll: diceResult,
    lastRollPlayerId: currentPlayer.id
  };

  // Check if current player has any valid moves with this roll
  const playerHasValidMoves = hasValidMoves(currentPlayer, diceValue, {});

  // If no valid moves available
  if (!playerHasValidMoves) {
    // Even if rolled 6, pass turn if no moves possible
    updatedGameState = updateTurn(updatedGameState);
    
    // Check for game end conditions
    updatedGameState = checkAndUpdateGameEnd(updatedGameState);
    
    return updatedGameState;
  }

  // Player has valid moves - they can choose which token to move
  // Game state updated with dice roll, waiting for move selection
  return updatedGameState;
};

/**
 * Handles moving a specific token and manages all resulting game state changes
 * @param {Object} gameState - Current game state
 * @param {string} tokenId - ID of the token to move
 * @param {number} diceValue - The dice value used for the move
 * @returns {Object} New game state after the move is processed
 */
export const handleMove = (gameState, tokenId, diceValue) => {
  if (!gameState || !tokenId || typeof diceValue !== 'number') {
    return gameState;
  }

  const currentPlayer = getCurrentPlayer(gameState);
  if (!currentPlayer) {
    return gameState;
  }

  // Find the token to move
  const tokenToMove = currentPlayer.tokens.find(token => token.id === tokenId);
  if (!tokenToMove) {
    return gameState;
  }

  // Validate the move is legal
  const validMoves = getValidMoves(tokenToMove, diceValue, currentPlayer, {});
  if (validMoves.length === 0) {
    return gameState;
  }

  // Calculate new token state after move
  const updatedToken = moveToken(tokenToMove, diceValue, currentPlayer, {});
  
  // Update current player's tokens
  const updatedTokens = currentPlayer.tokens.map(token => 
    token.id === tokenId ? updatedToken : { ...token }
  );

  const updatedCurrentPlayer = {
    ...currentPlayer,
    tokens: updatedTokens
  };

  // Update game state with moved player
  let updatedGameState = updatePlayer(gameState, updatedCurrentPlayer);

  // Check for captures at the new position
  if (updatedToken.position && updatedToken.isOut && !updatedToken.isCompleted) {
    const otherPlayers = getOtherPlayers(updatedGameState);
    let captureOccurred = false;

    // Check each opponent's tokens for potential capture
    const playersAfterCapture = otherPlayers.map(player => {
      const tokensAfterCapture = player.tokens.map(token => {
        if (canCapture(token, updatedToken.position, {})) {
          captureOccurred = true;
          // Reset captured token to base
          return {
            ...token,
            position: null,
            isOut: false,
            isSafe: false,
            isCompleted: false
          };
        }
        return { ...token };
      });

      return {
        ...player,
        tokens: tokensAfterCapture
      };
    });

    // Include current player in the updated players array
    const allUpdatedPlayers = updatedGameState.players.map(player => {
      if (player.id === currentPlayer.id) {
        return updatedCurrentPlayer;
      }
      return playersAfterCapture.find(p => p.id === player.id) || player;
    });

    updatedGameState = updatePlayers(updatedGameState, allUpdatedPlayers);

    // Record capture information
    if (captureOccurred) {
      updatedGameState = {
        ...updatedGameState,
        lastCapture: {
          capturingPlayerId: currentPlayer.id,
          capturePosition: { ...updatedToken.position }
        }
      };
    }
  }

  // Determine if player gets an extra turn
  let grantsExtraTurn = false;

  // Extra turn conditions:
  // 1. Rolled a 6
  // 2. Captured an opponent token
  // 3. Token completed its journey to home
  if (isSix(diceValue) || 
      updatedGameState.lastCapture?.capturingPlayerId === currentPlayer.id ||
      updatedToken.isCompleted) {
    grantsExtraTurn = true;
  }

  // Update turn if no extra turn granted
  if (!grantsExtraTurn) {
    updatedGameState = updateTurn(updatedGameState);
  }

  // Clear temporary move-related data if turn changed
  if (!grantsExtraTurn) {
    updatedGameState = {
      ...updatedGameState,
      lastDiceRoll: null,
      lastRollPlayerId: null,
      lastCapture: null
    };
  }

  // Check for game end conditions
  updatedGameState = checkAndUpdateGameEnd(updatedGameState);

  return updatedGameState;
};

/**
 * Gets all possible token moves for the current player with given dice value
 * @param {Object} gameState - Current game state
 * @param {number} diceValue - The dice roll value
 * @returns {Array} Array of tokens that can be moved
 */
export const getPossibleMoves = (gameState, diceValue) => {
  if (!gameState || typeof diceValue !== 'number') {
    return [];
  }

  const currentPlayer = getCurrentPlayer(gameState);
  if (!currentPlayer) {
    return [];
  }

  // Filter tokens that can be moved with the given dice value
  return currentPlayer.tokens.filter(token => {
    const validMoves = getValidMoves(token, diceValue, currentPlayer, {});
    return validMoves.length > 0;
  });
};

/**
 * Gets detailed move information for all possible moves
 * @param {Object} gameState - Current game state
 * @param {number} diceValue - The dice roll value
 * @returns {Array} Array of detailed move objects
 */
export const getDetailedMoveOptions = (gameState, diceValue) => {
  if (!gameState || typeof diceValue !== 'number') {
    return [];
  }

  const currentPlayer = getCurrentPlayer(gameState);
  if (!currentPlayer) {
    return [];
  }

  const moveOptions = [];

  currentPlayer.tokens.forEach(token => {
    const validMoves = getValidMoves(token, diceValue, currentPlayer, {});
    
    validMoves.forEach(move => {
      // Calculate what would happen with this move
      const updatedToken = moveToken(token, diceValue, currentPlayer, {});
      
      // Check for potential captures
      const otherPlayers = getOtherPlayers(gameState);
      let wouldCapture = false;
      
      if (updatedToken.position && updatedToken.isOut && !updatedToken.isCompleted) {
        wouldCapture = otherPlayers.some(player =>
          player.tokens.some(opponentToken =>
            canCapture(opponentToken, updatedToken.position, {})
          )
        );
      }

      moveOptions.push({
        tokenId: token.id,
        currentPosition: token.position ? { ...token.position } : null,
        newPosition: updatedToken.position ? { ...updatedToken.position } : null,
        moveType: move.type,
        wouldCapture,
        wouldComplete: updatedToken.isCompleted,
        grantsExtraTurn: isSix(diceValue) || wouldCapture || updatedToken.isCompleted
      });
    });
  });

  return moveOptions;
};

/**
 * Validates if a move is legal for the current game state
 * @param {Object} gameState - Current game state
 * @param {string} tokenId - ID of token to move
 * @param {number} diceValue - Dice value for the move
 * @returns {boolean} True if move is valid
 */
export const isValidMove = (gameState, tokenId, diceValue) => {
  const possibleTokens = getPossibleMoves(gameState, diceValue);
  return possibleTokens.some(token => token.id === tokenId);
};

/**
 * Simulates a move without actually applying it to get preview information
 * @param {Object} gameState - Current game state
 * @param {string} tokenId - ID of token to move
 * @param {number} diceValue - Dice value for the move
 * @returns {Object|null} Preview object with move results or null if invalid
 */
export const previewMove = (gameState, tokenId, diceValue) => {
  if (!isValidMove(gameState, tokenId, diceValue)) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(gameState);
  const tokenToMove = currentPlayer.tokens.find(token => token.id === tokenId);
  
  if (!tokenToMove) {
    return null;
  }

  const updatedToken = moveToken(tokenToMove, diceValue, currentPlayer, {});
  
  // Check for potential captures
  const otherPlayers = getOtherPlayers(gameState);
  const capturedTokens = [];
  
  if (updatedToken.position && updatedToken.isOut && !updatedToken.isCompleted) {
    otherPlayers.forEach(player => {
      player.tokens.forEach(opponentToken => {
        if (canCapture(opponentToken, updatedToken.position, {})) {
          capturedTokens.push({
            playerId: player.id,
            tokenId: opponentToken.id,
            position: { ...opponentToken.position }
          });
        }
      });
    });
  }

  return {
    tokenId,
    fromPosition: tokenToMove.position ? { ...tokenToMove.position } : null,
    toPosition: updatedToken.position ? { ...updatedToken.position } : null,
    wouldComplete: updatedToken.isCompleted,
    capturedTokens,
    grantsExtraTurn: isSix(diceValue) || capturedTokens.length > 0 || updatedToken.isCompleted
  };
};