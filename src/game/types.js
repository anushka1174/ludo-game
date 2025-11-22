// Ludo game type definitions using JSDoc and example object shapes

/**
 * @typedef {Object} Position
 * @property {number} row - Row coordinate on the board (0-14)
 * @property {number} col - Column coordinate on the board (0-14)
 */

/**
 * @typedef {Object} Token
 * @property {string} id - Unique identifier for the token
 * @property {Position|null} position - Current position on board (null if in base)
 * @property {boolean} isOut - Whether token is out of base and on the board
 * @property {boolean} isSafe - Whether token is currently on a safe tile
 * @property {boolean} isCompleted - Whether token has reached home successfully
 */

/**
 * @typedef {Object} Player
 * @property {string} id - Unique player identifier
 * @property {string} color - Player color ('RED', 'GREEN', 'BLUE', 'YELLOW')
 * @property {Token[]} tokens - Array of 4 tokens belonging to this player
 * @property {Position} startTile - Starting position on the main track
 * @property {Position} homeEntryTile - Entry point to home path
 * @property {Position[]} homePath - Array of positions from entry to center
 */

/**
 * @typedef {Object} Dice
 * @property {number} currentValue - Current face value of the dice (1-6)
 */

/**
 * @typedef {Object} GameState
 * @property {Player[]} players - Array of all players in the game
 * @property {number} currentPlayerIndex - Index of the player whose turn it is
 * @property {Object} board - Current state of the game board
 * @property {string[]|null} winners - Array of player IDs who have won (null if game ongoing)
 * @property {boolean} isGameOver - Whether the game has ended
 * @property {number} turnCount - Total number of turns played
 */

// Example object shapes for runtime use

/**
 * Example Position object shape
 */
export const POSITION_EXAMPLE = {
  row: 0,
  col: 0
};

/**
 * Example Token object shape
 */
export const TOKEN_EXAMPLE = {
  id: '',
  position: null,
  isOut: false,
  isSafe: false,
  isCompleted: false
};

/**
 * Example Player object shape
 */
export const PLAYER_EXAMPLE = {
  id: '',
  color: '',
  tokens: [],
  startTile: { row: 0, col: 0 },
  homeEntryTile: { row: 0, col: 0 },
  homePath: []
};

/**
 * Example Dice object shape
 */
export const DICE_EXAMPLE = {
  currentValue: 1
};

/**
 * Example GameState object shape
 */
export const GAMESTATE_EXAMPLE = {
  players: [],
  currentPlayerIndex: 0,
  board: {},
  winners: null,
  isGameOver: false,
  turnCount: 0
};

// Factory functions to create new instances with proper structure

/**
 * Creates a new Position object
 * @param {number} row 
 * @param {number} col 
 * @returns {Position}
 */
export const createPosition = (row, col) => ({ row, col });

/**
 * Creates a new Token object
 * @param {string} id 
 * @returns {Token}
 */
export const createToken = (id) => ({
  id,
  position: null,
  isOut: false,
  isSafe: false,
  isCompleted: false
});

/**
 * Creates a new Player object
 * @param {string} id 
 * @param {string} color 
 * @param {Position} startTile 
 * @param {Position} homeEntryTile 
 * @param {Position[]} homePath 
 * @returns {Player}
 */
export const createPlayer = (id, color, startTile, homeEntryTile, homePath) => ({
  id,
  color,
  tokens: [
    createToken(`${id}_token_1`),
    createToken(`${id}_token_2`),
    createToken(`${id}_token_3`),
    createToken(`${id}_token_4`)
  ],
  startTile,
  homeEntryTile,
  homePath
});

/**
 * Creates a new Dice object
 * @returns {Dice}
 */
export const createDice = () => ({
  currentValue: 1
});

/**
 * Creates a new GameState object
 * @param {Player[]} players 
 * @returns {GameState}
 */
export const createGameState = (players) => ({
  players,
  currentPlayerIndex: 0,
  board: {},
  winners: null,
  isGameOver: false,
  turnCount: 0
});

// Validation helpers (pure data checks, no side effects)

/**
 * Validates if an object matches the Position structure
 * @param {any} obj 
 * @returns {boolean}
 */
export const isValidPosition = (obj) => {
  return obj !== null && 
         typeof obj === 'object' && 
         typeof obj.row === 'number' && 
         typeof obj.col === 'number';
};

/**
 * Validates if an object matches the Token structure
 * @param {any} obj 
 * @returns {boolean}
 */
export const isValidToken = (obj) => {
  return obj !== null &&
         typeof obj === 'object' &&
         typeof obj.id === 'string' &&
         (obj.position === null || isValidPosition(obj.position)) &&
         typeof obj.isOut === 'boolean' &&
         typeof obj.isSafe === 'boolean' &&
         typeof obj.isCompleted === 'boolean';
};

/**
 * Validates if an object matches the Player structure
 * @param {any} obj 
 * @returns {boolean}
 */
export const isValidPlayer = (obj) => {
  return obj !== null &&
         typeof obj === 'object' &&
         typeof obj.id === 'string' &&
         typeof obj.color === 'string' &&
         Array.isArray(obj.tokens) &&
         obj.tokens.length === 4 &&
         obj.tokens.every(isValidToken) &&
         isValidPosition(obj.startTile) &&
         isValidPosition(obj.homeEntryTile) &&
         Array.isArray(obj.homePath) &&
         obj.homePath.every(isValidPosition);
};

/**
 * Validates if an object matches the Dice structure
 * @param {any} obj 
 * @returns {boolean}
 */
export const isValidDice = (obj) => {
  return obj !== null &&
         typeof obj === 'object' &&
         typeof obj.currentValue === 'number' &&
         obj.currentValue >= 1 &&
         obj.currentValue <= 6;
};

/**
 * Validates if an object matches the GameState structure
 * @param {any} obj 
 * @returns {boolean}
 */
export const isValidGameState = (obj) => {
  return obj !== null &&
         typeof obj === 'object' &&
         Array.isArray(obj.players) &&
         obj.players.every(isValidPlayer) &&
         typeof obj.currentPlayerIndex === 'number' &&
         obj.currentPlayerIndex >= 0 &&
         obj.currentPlayerIndex < obj.players.length &&
         typeof obj.board === 'object' &&
         (obj.winners === null || Array.isArray(obj.winners)) &&
         typeof obj.isGameOver === 'boolean' &&
         typeof obj.turnCount === 'number';
};
