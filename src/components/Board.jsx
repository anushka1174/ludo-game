// Main Ludo board visualization component

import React from 'react';
import Token from './Token.jsx';
import './Board.css';

/**
 * Board component - Main container for the Ludo board visualization
 * @param {Object} props - Component props
 * @param {Object} props.gameState - Current game state object
 * @param {Function} props.onAction - Function to dispatch actions to game logic
 */
const Board = ({ gameState, onAction }) => {
  // Get current player information
  const currentPlayer = gameState?.players?.[gameState.currentPlayerIndex];
  
  // Handle dice roll action
  const handleDiceRoll = () => {
    if (onAction) {
      onAction({ type: 'ROLL_DICE' });
    }
  };

  /**
   * Determines the tile type and class name based on coordinates
   * @param {number} row - Row index (0-14)
   * @param {number} col - Column index (0-14)
   * @returns {string} CSS class name for the tile
   */
  const getTileClass = (row, col) => {
    // Base Areas
    if (row >= 0 && row <= 5 && col >= 0 && col <= 5) {
      return 'tile tile-base tile-base-green';
    }
    if (row >= 0 && row <= 5 && col >= 9 && col <= 14) {
      return 'tile tile-base tile-base-blue';
    }
    if (row >= 9 && row <= 14 && col >= 9 && col <= 14) {
      return 'tile tile-base tile-base-yellow';
    }
    if (row >= 9 && row <= 14 && col >= 0 && col <= 5) {
      return 'tile tile-base tile-base-red';
    }

    // Center area (3x3)
    if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
      return 'tile tile-center';
    }

    // Main track tiles forming the cross shape
    // Vertical main track (columns 1, 7, 13)
    if ((col === 1 || col === 7 || col === 13) && row >= 6 && row <= 8) {
      return 'tile tile-track tile-main-track';
    }
    
    // Horizontal main track (rows 1, 7, 13)
    if ((row === 1 || row === 7 || row === 13) && col >= 6 && col <= 8) {
      return 'tile tile-track tile-main-track';
    }

    // Outer track tiles
    // Top row of track
    if (row === 6 && col >= 1 && col <= 5) {
      return 'tile tile-track tile-outer-track';
    }
    if (row === 6 && col >= 9 && col <= 13) {
      return 'tile tile-track tile-outer-track';
    }
    
    // Bottom row of track
    if (row === 8 && col >= 1 && col <= 5) {
      return 'tile tile-track tile-outer-track';
    }
    if (row === 8 && col >= 9 && col <= 13) {
      return 'tile tile-track tile-outer-track';
    }
    
    // Left column of track
    if (col === 6 && row >= 1 && row <= 5) {
      return 'tile tile-track tile-outer-track';
    }
    if (col === 6 && row >= 9 && row <= 13) {
      return 'tile tile-track tile-outer-track';
    }
    
    // Right column of track
    if (col === 8 && row >= 1 && row <= 5) {
      return 'tile tile-track tile-outer-track';
    }
    if (col === 8 && row >= 9 && row <= 13) {
      return 'tile tile-track tile-outer-track';
    }

    // Home paths leading to center
    // Red home path (row 7, columns 1-6)
    if (row === 7 && col >= 1 && col <= 6) {
      return 'tile tile-home tile-home-red';
    }
    
    // Green home path (column 7, rows 1-6)
    if (col === 7 && row >= 1 && row <= 6) {
      return 'tile tile-home tile-home-green';
    }
    
    // Blue home path (row 7, columns 8-13)
    if (row === 7 && col >= 8 && col <= 13) {
      return 'tile tile-home tile-home-blue';
    }
    
    // Yellow home path (column 7, rows 8-13)
    if (col === 7 && row >= 8 && row <= 13) {
      return 'tile tile-home tile-home-yellow';
    }

    // Special tiles (safe tiles, entry points)
    // Starting positions for each color
    if (row === 6 && col === 1) return 'tile tile-track tile-start tile-start-red';
    if (row === 1 && col === 8) return 'tile tile-track tile-start tile-start-green';
    if (row === 8 && col === 13) return 'tile tile-track tile-start tile-start-blue';
    if (row === 13 && col === 6) return 'tile tile-track tile-start tile-start-yellow';

    // Default empty tiles
    return 'tile tile-empty';
  };

  /**
   * Renders all board tiles in a 15x15 grid
   * @returns {JSX.Element[]} Array of tile elements
   */
  const renderBoardTiles = () => {
    const tiles = [];
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        const tileClass = getTileClass(row, col);
        const key = `tile-${row}-${col}`;
        
        tiles.push(
          <div
            key={key}
            className={tileClass}
            data-row={row}
            data-col={col}
            style={{
              gridRow: row + 1,
              gridColumn: col + 1,
            }}
          >
            {/* Tile content can be added here later */}
            <div className="tile-content">
              {/* Content will be added when implementing tokens */}
            </div>
          </div>
        );
      }
    }
    return tiles;
  };

  /**
   * Renders all tokens for all players
   * @returns {JSX.Element[]} Array of Token components
   */
  const renderTokens = () => {
    if (!gameState?.players) return [];

    const tokens = [];
    
    gameState.players.forEach((player) => {
      if (!player?.tokens) return;
      
      player.tokens.forEach((token) => {
        // Only render tokens that are out on the board (have a position)
        if (token?.position) {
          tokens.push(
            <Token
              key={token.id}
              token={token}
              onTokenClick={(tokenId) => {
                console.log('Token clicked:', tokenId);
                // TODO: Handle token selection for moves
              }}
            />
          );
        }
      });
    });

    return tokens;
  };

  return (
    <div className="ludo-board">
      {/* Board Header */}
      <div className="board-header">
        <h2 className="board-title">Ludo Game</h2>
        <div className="current-player-display">
          <span className="current-player-label">Current Player:</span>
          <span 
            className={`current-player-color ${currentPlayer?.color?.toLowerCase() || 'none'}`}
          >
            {currentPlayer?.color || 'None'}
          </span>
        </div>
      </div>

      {/* Main Board Container - 15x15 CSS Grid */}
      <div 
        className="board-container grid-board"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(15, 1fr)',
          gridTemplateRows: 'repeat(15, 1fr)',
          gap: '1px',
          aspectRatio: '1',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '10px',
          background: '#2c3e50',
          borderRadius: '10px'
        }}
      >
        {renderBoardTiles()}
        {renderTokens()}
      </div>

      {/* Game Controls */}
      <div className="game-controls">
        {/* Dice Roll Area */}
        <div className="dice-area">
          <h3>Dice Roll Area</h3>
          <button 
            className="dice-roll-button"
            onClick={handleDiceRoll}
            disabled={!currentPlayer || gameState?.isGameOver}
          >
            🎲 Roll Dice
          </button>
          
          {/* Display last dice roll if available */}
          {gameState?.lastDiceRoll && (
            <div className="last-dice-roll">
              <span>Last Roll: {gameState.lastDiceRoll.value}</span>
            </div>
          )}
        </div>

        {/* Game Status */}
        <div className="game-status">
          <h3>Game Status</h3>
          <div className="status-info">
            <div className="turn-count">Turn: {gameState?.turnCount || 0}</div>
            
            {gameState?.isGameOver ? (
              <div className="game-over">
                🏆 Game Over! 
                Winners: {gameState.winners?.join(', ') || 'None'}
              </div>
            ) : (
              <div className="game-active">Game in Progress</div>
            )}
          </div>
        </div>

        {/* Player Status Overview */}
        <div className="players-overview">
          <h3>Players Status</h3>
          <div className="players-grid">
            {gameState?.players?.map((player, index) => (
              <div 
                key={player.id} 
                className={`player-status ${player.color?.toLowerCase()} ${
                  index === gameState.currentPlayerIndex ? 'active' : ''
                }`}
              >
                <span className="player-name">{player.color}</span>
                <div className="player-tokens-info">
                  <span>Base: {player.tokens?.filter(t => !t.isOut).length || 0}</span>
                  <span>Out: {player.tokens?.filter(t => t.isOut && !t.isCompleted).length || 0}</span>
                  <span>Home: {player.tokens?.filter(t => t.isCompleted).length || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;