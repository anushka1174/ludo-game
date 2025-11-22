// Pure functions for Ludo game token mechanics - immutable operations only

import { 
  TOTAL_TILES, 
  SAFE_TILES, 
  HOME_PATH_LENGTH, 
  MAIN_TRACK,
  CENTER_POSITION 
} from './constants.js';

/**
 * Checks if a token can exit its base (enter the game)
 * @param {Object} token - Token object to check
 * @param {number} diceValue - Current dice roll value
 * @param {Object} player - Player who owns the token
 * @param {Object} constants - Game constants
 * @returns {boolean} True if token can exit base
 */
export const canTokenExitBase = (token, diceValue, player, constants) => {
  // Token must not be already out and dice must be 6
  return !token.isOut && diceValue === 6;
};

/**
 * Creates an updated token after a move (immutable)
 * @param {Object} token - Original token object
 * @param {number} diceValue - Dice roll value
 * @param {Object} player - Player who owns the token
 * @param {Object} constants - Game constants
 * @returns {Object} New token object with updated position
 */
export const moveToken = (token, diceValue, player, constants) => {
  // If token is not out and can't exit base, return unchanged
  if (!token.isOut && !canTokenExitBase(token, diceValue, player, constants)) {
    return { ...token };
  }

  // If token is exiting base
  if (!token.isOut && canTokenExitBase(token, diceValue, player, constants)) {
    const newPosition = { ...player.startTile };
    return {
      ...token,
      position: newPosition,
      isOut: true,
      isSafe: isOnSafeTile(newPosition, constants),
      isCompleted: false
    };
  }

  // If token is already out, move it
  const newPosition = getNextPosition(token.position, diceValue, player, constants);
  
  // Check if token has completed the journey
  const completed = isTokenCompleted(newPosition, player, constants);
  
  return {
    ...token,
    position: newPosition,
    isSafe: completed || isOnSafeTile(newPosition, constants),
    isCompleted: completed
  };
};

/**
 * Calculates the next position after moving specified steps
 * @param {Object} currentPosition - Current position {row, col}
 * @param {number} steps - Number of steps to move
 * @param {Object} player - Player moving the token
 * @param {Object} constants - Game constants
 * @returns {Object} New position {row, col}
 */
export const getNextPosition = (currentPosition, steps, player, constants) => {
  if (!currentPosition || steps <= 0) {
    return currentPosition ? { ...currentPosition } : null;
  }

  // Find current position in main track
  const mainTrackIndex = MAIN_TRACK.findIndex(pos => 
    pos.row === currentPosition.row && pos.col === currentPosition.col
  );

  // If on main track
  if (mainTrackIndex !== -1) {
    const homeEntryIndex = MAIN_TRACK.findIndex(pos =>
      pos.row === player.homeEntryTile.row && pos.col === player.homeEntryTile.col
    );

    // Calculate new position on main track
    let newIndex = (mainTrackIndex + steps) % TOTAL_TILES;

    // Check if we pass or land on home entry
    const passesHomeEntry = (mainTrackIndex < homeEntryIndex && 
                           (mainTrackIndex + steps) >= homeEntryIndex) ||
                          (mainTrackIndex > homeEntryIndex && 
                           (mainTrackIndex + steps) >= TOTAL_TILES + homeEntryIndex);

    if (passesHomeEntry) {
      // Calculate remaining steps after reaching home entry
      let remainingSteps;
      if (mainTrackIndex < homeEntryIndex) {
        remainingSteps = steps - (homeEntryIndex - mainTrackIndex);
      } else {
        remainingSteps = steps - (TOTAL_TILES + homeEntryIndex - mainTrackIndex);
      }

      // If we have remaining steps, move into home path
      if (remainingSteps > 0) {
        if (remainingSteps <= HOME_PATH_LENGTH) {
          return { ...player.homePath[remainingSteps - 1] };
        } else {
          // Can't move beyond home, stay at entry
          return { ...player.homeEntryTile };
        }
      } else {
        // Land exactly on home entry
        return { ...player.homeEntryTile };
      }
    }

    // Normal movement on main track
    return { ...MAIN_TRACK[newIndex] };
  }

  // If on home path
  const homePathIndex = player.homePath.findIndex(pos =>
    pos.row === currentPosition.row && pos.col === currentPosition.col
  );

  if (homePathIndex !== -1) {
    const newHomeIndex = homePathIndex + steps;
    if (newHomeIndex < HOME_PATH_LENGTH) {
      return { ...player.homePath[newHomeIndex] };
    } else if (newHomeIndex === HOME_PATH_LENGTH) {
      // Reached center (completed)
      return { ...CENTER_POSITION };
    } else {
      // Can't move beyond center, stay in current position
      return { ...currentPosition };
    }
  }

  // Position not found in tracks, return current position
  return { ...currentPosition };
};

/**
 * Checks if a position is on a safe tile
 * @param {Object} position - Position to check {row, col}
 * @param {Object} constants - Game constants
 * @returns {boolean} True if position is safe
 */
export const isOnSafeTile = (position, constants) => {
  if (!position) return false;
  
  return SAFE_TILES.some(safeTile => 
    safeTile.row === position.row && safeTile.col === position.col
  );
};

/**
 * Checks if a token has completed its journey (reached center)
 * @param {Object} position - Token position to check
 * @param {Object} player - Player who owns the token
 * @param {Object} constants - Game constants
 * @returns {boolean} True if token is completed
 */
export const isTokenCompleted = (position, player, constants) => {
  if (!position) return false;
  
  return position.row === CENTER_POSITION.row && 
         position.col === CENTER_POSITION.col;
};

/**
 * Checks if a moving token can capture an opponent's token
 * @param {Object} opponentToken - Opponent's token to potentially capture
 * @param {Object} newPosition - Position where moving token will land
 * @param {Object} constants - Game constants
 * @returns {boolean} True if capture is possible
 */
export const canCapture = (opponentToken, newPosition, constants) => {
  if (!opponentToken || !newPosition || !opponentToken.position) {
    return false;
  }

  // Can't capture if opponent is not out, completed, or on safe tile
  if (!opponentToken.isOut || opponentToken.isCompleted || opponentToken.isSafe) {
    return false;
  }

  // Can't capture if new position is a safe tile
  if (isOnSafeTile(newPosition, constants)) {
    return false;
  }

  // Check if positions match
  return opponentToken.position.row === newPosition.row && 
         opponentToken.position.col === newPosition.col;
};

/**
 * Applies capture logic to all players (immutable)
 * @param {Array} playerList - Array of all players
 * @param {string} movingPlayerId - ID of player making the move
 * @param {Object} newPosition - Position where capture occurs
 * @param {Object} constants - Game constants
 * @returns {Array} New array of players with captured tokens reset
 */
export const applyCapture = (playerList, movingPlayerId, newPosition, constants) => {
  return playerList.map(player => {
    // Skip the moving player
    if (player.id === movingPlayerId) {
      return { ...player };
    }

    // Check each token for potential capture
    const updatedTokens = player.tokens.map(token => {
      if (canCapture(token, newPosition, constants)) {
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

    // Return player with potentially updated tokens
    return {
      ...player,
      tokens: updatedTokens
    };
  });
};

/**
 * Gets all valid moves for a token given a dice roll
 * @param {Object} token - Token to check moves for
 * @param {number} diceValue - Current dice roll
 * @param {Object} player - Player who owns the token
 * @param {Object} constants - Game constants
 * @returns {Array} Array of possible move objects
 */
export const getValidMoves = (token, diceValue, player, constants) => {
  const moves = [];

  // If token can exit base
  if (canTokenExitBase(token, diceValue, player, constants)) {
    moves.push({
      type: 'exit_base',
      from: null,
      to: { ...player.startTile },
      token: { ...token }
    });
  }

  // If token is out and can move
  if (token.isOut && !token.isCompleted) {
    const newPosition = getNextPosition(token.position, diceValue, player, constants);
    if (newPosition && (newPosition.row !== token.position?.row || 
                       newPosition.col !== token.position?.col)) {
      moves.push({
        type: 'move',
        from: token.position ? { ...token.position } : null,
        to: { ...newPosition },
        token: { ...token }
      });
    }
  }

  return moves;
};

/**
 * Checks if any token of a player can move with given dice value
 * @param {Object} player - Player to check
 * @param {number} diceValue - Current dice roll
 * @param {Object} constants - Game constants
 * @returns {boolean} True if player has valid moves
 */
export const hasValidMoves = (player, diceValue, constants) => {
  return player.tokens.some(token => 
    getValidMoves(token, diceValue, player, constants).length > 0
  );
};

/**
 * Calculates the distance a token needs to travel to complete
 * @param {Object} token - Token to calculate distance for
 * @param {Object} player - Player who owns the token
 * @param {Object} constants - Game constants
 * @returns {number} Steps needed to complete (or -1 if not calculable)
 */
export const getDistanceToComplete = (token, player, constants) => {
  if (!token.isOut || token.isCompleted) {
    return -1;
  }

  const currentPosition = token.position;
  if (!currentPosition) return -1;

  // Find current position in main track
  const mainTrackIndex = MAIN_TRACK.findIndex(pos => 
    pos.row === currentPosition.row && pos.col === currentPosition.col
  );

  if (mainTrackIndex !== -1) {
    // On main track - calculate distance to home entry plus home path
    const homeEntryIndex = MAIN_TRACK.findIndex(pos =>
      pos.row === player.homeEntryTile.row && pos.col === player.homeEntryTile.col
    );

    let distanceToEntry;
    if (mainTrackIndex <= homeEntryIndex) {
      distanceToEntry = homeEntryIndex - mainTrackIndex;
    } else {
      distanceToEntry = TOTAL_TILES - mainTrackIndex + homeEntryIndex;
    }

    return distanceToEntry + HOME_PATH_LENGTH;
  }

  // Check if on home path
  const homePathIndex = player.homePath.findIndex(pos =>
    pos.row === currentPosition.row && pos.col === currentPosition.col
  );

  if (homePathIndex !== -1) {
    return HOME_PATH_LENGTH - homePathIndex;
  }

  return -1;
};
