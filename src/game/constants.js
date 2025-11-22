// Define all Ludo constants: colors, safe tiles, home paths, base positions

// Player colors
export const COLORS = {
  RED: '#FF4444',
  GREEN: '#44AA44',
  BLUE: '#4444FF',
  YELLOW: '#FFAA00'
};

// Starting positions for each player's 4 tokens (base positions)
export const START_POSITIONS = {
  RED: [
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 2, col: 1 },
    { row: 2, col: 2 }
  ],
  GREEN: [
    { row: 1, col: 12 },
    { row: 1, col: 13 },
    { row: 2, col: 12 },
    { row: 2, col: 13 }
  ],
  BLUE: [
    { row: 12, col: 12 },
    { row: 12, col: 13 },
    { row: 13, col: 12 },
    { row: 13, col: 13 }
  ],
  YELLOW: [
    { row: 12, col: 1 },
    { row: 12, col: 2 },
    { row: 13, col: 1 },
    { row: 13, col: 2 }
  ]
};

// Safe tiles where tokens cannot be captured
export const SAFE_TILES = [
  { row: 6, col: 1 },   // Red starting tile
  { row: 2, col: 6 },   // Green entry tile
  { row: 8, col: 13 },  // Green starting tile
  { row: 12, col: 8 },  // Blue entry tile
  { row: 8, col: 13 },  // Blue starting tile
  { row: 12, col: 8 },  // Yellow entry tile
  { row: 6, col: 1 },   // Yellow starting tile
  { row: 2, col: 6 },   // Red entry tile
  // Corner safe tiles
  { row: 6, col: 2 },
  { row: 2, col: 8 },
  { row: 8, col: 12 },
  { row: 12, col: 6 }
];

// Home entry positions for each player
export const HOME_ENTRY = {
  RED: { row: 6, col: 1 },
  GREEN: { row: 1, col: 8 },
  BLUE: { row: 8, col: 13 },
  YELLOW: { row: 13, col: 6 }
};

// Home paths for each player (from entry to center)
export const HOME_PATHS = {
  RED: [
    { row: 6, col: 1 },
    { row: 6, col: 2 },
    { row: 6, col: 3 },
    { row: 6, col: 4 },
    { row: 6, col: 5 },
    { row: 6, col: 6 }
  ],
  GREEN: [
    { row: 1, col: 8 },
    { row: 2, col: 8 },
    { row: 3, col: 8 },
    { row: 4, col: 8 },
    { row: 5, col: 8 },
    { row: 6, col: 8 }
  ],
  BLUE: [
    { row: 8, col: 13 },
    { row: 8, col: 12 },
    { row: 8, col: 11 },
    { row: 8, col: 10 },
    { row: 8, col: 9 },
    { row: 8, col: 8 }
  ],
  YELLOW: [
    { row: 13, col: 6 },
    { row: 12, col: 6 },
    { row: 11, col: 6 },
    { row: 10, col: 6 },
    { row: 9, col: 6 },
    { row: 8, col: 6 }
  ]
};

// Main track path (52 tiles around the board)
export const MAIN_TRACK = [
  // Red to Green side
  { row: 6, col: 1 }, { row: 5, col: 1 }, { row: 4, col: 1 }, { row: 3, col: 1 }, { row: 2, col: 1 }, { row: 1, col: 1 },
  { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 }, { row: 1, col: 5 }, { row: 1, col: 6 }, { row: 1, col: 7 }, { row: 1, col: 8 },
  // Green to Blue side
  { row: 2, col: 8 }, { row: 3, col: 8 }, { row: 4, col: 8 }, { row: 5, col: 8 }, { row: 6, col: 8 }, { row: 7, col: 8 }, { row: 8, col: 8 },
  { row: 8, col: 9 }, { row: 8, col: 10 }, { row: 8, col: 11 }, { row: 8, col: 12 }, { row: 8, col: 13 },
  // Blue to Yellow side
  { row: 9, col: 13 }, { row: 10, col: 13 }, { row: 11, col: 13 }, { row: 12, col: 13 }, { row: 13, col: 13 },
  { row: 13, col: 12 }, { row: 13, col: 11 }, { row: 13, col: 10 }, { row: 13, col: 9 }, { row: 13, col: 8 }, { row: 13, col: 7 }, { row: 13, col: 6 },
  // Yellow to Red side
  { row: 12, col: 6 }, { row: 11, col: 6 }, { row: 10, col: 6 }, { row: 9, col: 6 }, { row: 8, col: 6 }, { row: 7, col: 6 }, { row: 6, col: 6 },
  { row: 6, col: 5 }, { row: 6, col: 4 }, { row: 6, col: 3 }, { row: 6, col: 2 }, { row: 6, col: 1 }
];

// Game configuration constants
export const TOTAL_TILES = 52;
export const HOME_PATH_LENGTH = 6;
export const TOKENS_PER_PLAYER = 4;
export const BOARD_SIZE = 15;
export const WINNING_SCORE = 4; // All 4 tokens must reach home

// Dice values
export const DICE_MIN = 1;
export const DICE_MAX = 6;
export const ENTRY_ROLL = 6; // Need to roll 6 to enter from base

// Player order
export const PLAYER_ORDER = ['RED', 'GREEN', 'BLUE', 'YELLOW'];

// Center position (home)
export const CENTER_POSITION = { row: 7, col: 7 };
