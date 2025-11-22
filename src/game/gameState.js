// Pure functions for Ludo game state management - immutable operations only

import { 
  COLORS, 
  START_POSITIONS, 
  HOME_ENTRY, 
  HOME_PATHS, 
  PLAYER_ORDER, 
  TOKENS_PER_PLAYER 
} from './constants.js';
import { 
  createGameState, 
  createPlayer
} from './types.js';

/**
 * Initializes a new 4-player Ludo game with complete game state
 * @returns {Object} New GameState object with all players initialized
 */
export const initializeGame = () => {
  // Create all 4 players with their tokens and positions
  const players = PLAYER_ORDER.map(color => {
    const playerId = color.toLowerCase();
    const homeEntryTile = HOME_ENTRY[color];
    const homePath = HOME_PATHS[color];

    // Set correct start tile based on color
    let actualStartTile;
    switch (color) {
      case 'RED':
        actualStartTile = { row: 6, col: 1 };
        break;
      case 'GREEN':
        actualStartTile = { row: 1, col: 8 };
        break;
      case 'BLUE':
        actualStartTile = { row: 8, col: 13 };
        break;
      case 'YELLOW':
        actualStartTile = { row: 13, col: 6 };
        break;
      default:
        actualStartTile = { row: 6, col: 1 };
    }

    return createPlayer(playerId, color, actualStartTile, homeEntryTile, homePath);
  });

  // Create initial game state
  return createGameState(players);
};

/**
 * Updates the turn to the next player in sequence
 * @param {Object} gameState - Current game state
 * @returns {Object} New GameState object with updated currentPlayerIndex
 */
export const updateTurn = (gameState) => {
  if (!gameState || !Array.isArray(gameState.players)) {
    return gameState;
  }

  const nextIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
  
  return {
    ...gameState,
    currentPlayerIndex: nextIndex,
    turnCount: gameState.turnCount + 1
  };
};

/**
 * Gets the player whose turn it currently is
 * @param {Object} gameState - Current game state
 * @returns {Object} Player object of current player
 */
export const getCurrentPlayer = (gameState) => {
  if (!gameState || !Array.isArray(gameState.players) || 
      gameState.currentPlayerIndex < 0 || 
      gameState.currentPlayerIndex >= gameState.players.length) {
    return null;
  }

  return gameState.players[gameState.currentPlayerIndex];
};

/**
 * Gets all players except the current player
 * @param {Object} gameState - Current game state
 * @returns {Array} Array of Player objects excluding current player
 */
export const getOtherPlayers = (gameState) => {
  if (!gameState || !Array.isArray(gameState.players)) {
    return [];
  }

  return gameState.players.filter((player, index) => 
    index !== gameState.currentPlayerIndex
  );
};

/**
 * Updates the current player's data with new player object
 * @param {Object} gameState - Current game state
 * @param {Object} updatedPlayer - New player object to replace current player
 * @returns {Object} New GameState object with updated current player
 */
export const updatePlayer = (gameState, updatedPlayer) => {
  if (!gameState || !Array.isArray(gameState.players) || !updatedPlayer) {
    return gameState;
  }

  const newPlayers = [...gameState.players];
  newPlayers[gameState.currentPlayerIndex] = { ...updatedPlayer };

  return {
    ...gameState,
    players: newPlayers
  };
};

/**
 * Updates the entire players array with new players array
 * @param {Object} gameState - Current game state
 * @param {Array} updatedPlayers - New array of player objects
 * @returns {Object} New GameState object with updated players array
 */
export const updatePlayers = (gameState, updatedPlayers) => {
  if (!gameState || !Array.isArray(updatedPlayers)) {
    return gameState;
  }

  return {
    ...gameState,
    players: [...updatedPlayers]
  };
};

/**
 * Checks if the game has ended (one or more players have won)
 * @param {Object} gameState - Current game state
 * @returns {boolean} True if game is over
 */
export const isGameOver = (gameState) => {
  if (!gameState || !Array.isArray(gameState.players)) {
    return false;
  }

  return gameState.players.some(player => 
    player.tokens.every(token => token.isCompleted)
  );
};

/**
 * Gets the winners of the game (players with all tokens completed)
 * @param {Object} gameState - Current game state
 * @returns {Array} Array of player IDs who have won
 */
export const getWinners = (gameState) => {
  if (!gameState || !Array.isArray(gameState.players)) {
    return [];
  }

  return gameState.players
    .filter(player => player.tokens.every(token => token.isCompleted))
    .map(player => player.id);
};

/**
 * Updates game state with winner information and game over status
 * @param {Object} gameState - Current game state
 * @returns {Object} New GameState object with updated winner and game over status
 */
export const checkAndUpdateGameEnd = (gameState) => {
  const winners = getWinners(gameState);
  const gameOver = winners.length > 0;

  return {
    ...gameState,
    winners: winners.length > 0 ? winners : null,
    isGameOver: gameOver
  };
};

/**
 * Gets game statistics for display purposes
 * @param {Object} gameState - Current game state
 * @returns {Object} Statistics object with player progress and game info
 */
export const getGameStats = (gameState) => {
  if (!gameState || !Array.isArray(gameState.players)) {
    return {
      totalTurns: 0,
      playerStats: [],
      isComplete: false,
      winners: []
    };
  }

  const playerStats = gameState.players.map(player => {
    const completedTokens = player.tokens.filter(token => token.isCompleted).length;
    const tokensInPlay = player.tokens.filter(token => token.isOut && !token.isCompleted).length;
    const tokensInBase = player.tokens.filter(token => !token.isOut).length;

    return {
      playerId: player.id,
      color: player.color,
      completedTokens,
      tokensInPlay,
      tokensInBase,
      progress: (completedTokens / TOKENS_PER_PLAYER) * 100
    };
  });

  return {
    totalTurns: gameState.turnCount,
    playerStats,
    isComplete: gameState.isGameOver,
    winners: gameState.winners || []
  };
};

/**
 * Resets the game to initial state
 * @returns {Object} New GameState object with fresh initialization
 */
export const resetGame = () => {
  return initializeGame();
};

/**
 * Gets a specific player by ID
 * @param {Object} gameState - Current game state
 * @param {string} playerId - ID of player to find
 * @returns {Object|null} Player object or null if not found
 */
export const getPlayerById = (gameState, playerId) => {
  if (!gameState || !Array.isArray(gameState.players) || !playerId) {
    return null;
  }

  return gameState.players.find(player => player.id === playerId) || null;
};

/**
 * Updates a specific player by ID
 * @param {Object} gameState - Current game state
 * @param {string} playerId - ID of player to update
 * @param {Object} updatedPlayer - New player object
 * @returns {Object} New GameState object with updated player
 */
export const updatePlayerById = (gameState, playerId, updatedPlayer) => {
  if (!gameState || !Array.isArray(gameState.players) || !playerId || !updatedPlayer) {
    return gameState;
  }

  const newPlayers = gameState.players.map(player => 
    player.id === playerId ? { ...updatedPlayer } : { ...player }
  );

  return {
    ...gameState,
    players: newPlayers
  };
};

/**
 * Validates if a game state object is properly formed
 * @param {Object} gameState - Game state to validate
 * @returns {boolean} True if game state is valid
 */
export const isValidGameState = (gameState) => {
  if (!gameState || typeof gameState !== 'object') {
    return false;
  }

  // Check required properties
  if (!Array.isArray(gameState.players) || 
      typeof gameState.currentPlayerIndex !== 'number' ||
      typeof gameState.isGameOver !== 'boolean' ||
      typeof gameState.turnCount !== 'number') {
    return false;
  }

  // Check player count
  if (gameState.players.length !== 4) {
    return false;
  }

  // Check current player index bounds
  if (gameState.currentPlayerIndex < 0 || 
      gameState.currentPlayerIndex >= gameState.players.length) {
    return false;
  }

  // Validate each player has required structure
  return gameState.players.every(player => 
    player && 
    typeof player.id === 'string' &&
    typeof player.color === 'string' &&
    Array.isArray(player.tokens) &&
    player.tokens.length === TOKENS_PER_PLAYER
  );
};