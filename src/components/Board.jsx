// Main Ludo board visualization component

import React from 'react';
import Token, { BaseToken } from './Token.jsx';
import { getPossibleMoves } from '../game/gameLogic.js';
import { TURN_PHASES, ACTION_TYPES } from '../game/turnManager.js';
import './Board.css';

/**
 * Board component - Main container for the Ludo board visualization
 * @param {Object} props - Component props
 * @param {Object} props.gameState - Current game state object
 * @param {Function} props.onAction - Function to dispatch actions to game logic
 */
const Board = ({ gameState, onAction, turnState }) => {
  // Get current player information
  const currentPlayer = gameState?.players?.[gameState.currentPlayerIndex];
  
  // Extract move data from turnState
  const currentPhase = turnState?.phase || TURN_PHASES.WAITING_FOR_ROLL;
  const lastDiceValue = turnState?.currentDiceValue;
  const isWaitingForMove = currentPhase === TURN_PHASES.WAITING_FOR_MOVE;
  const isWaitingForRoll = currentPhase === TURN_PHASES.WAITING_FOR_ROLL;
  
  // Get possible moves if we're in the move phase
  const possibleMoves = isWaitingForMove && lastDiceValue 
    ? getPossibleMoves(gameState, lastDiceValue)
    : [];
  
  // Create set of movable token IDs for quick lookup
  const movableTokenIds = new Set(possibleMoves.map(token => token.id));
  
  // Handle dice roll action
  const handleDiceRoll = () => {
    if (onAction && isWaitingForRoll) {
      onAction({ type: ACTION_TYPES.ROLL_DICE });
    }
  };
  
  // Handle token click for move selection
  const handleTokenClick = (tokenId) => {
    console.log('Token clicked:', tokenId, 'Phase:', currentPhase);
    
    // Only handle clicks during move phase
    if (!isWaitingForMove) {
      console.log('Not waiting for move. Current phase:', currentPhase);
      return;
    }
    
    // Check if the clicked token is movable
    if (!movableTokenIds.has(tokenId)) {
      console.error('Invalid move: Token', tokenId, 'is not movable');
      console.log('Available moves:', Array.from(movableTokenIds));
      return;
    }
    
    // Valid move - dispatch the action
    if (onAction && lastDiceValue) {
      console.log('Making move:', tokenId, 'with dice value:', lastDiceValue);
      onAction({ 
        type: ACTION_TYPES.MAKE_MOVE, 
        tokenId: tokenId,
        diceValue: lastDiceValue 
      });
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
            <div className="tile-content">
              {/* Render base tokens for specific tiles */}
              {row >= 1 && row <= 4 && col >= 1 && col <= 4 && tileClass.includes('tile-base-green') && (
                <div className="base-token-area">
                  {renderBaseTokens(gameState?.players?.find(p => p.color === 'GREEN'))}
                </div>
              )}
              {row >= 1 && row <= 4 && col >= 10 && col <= 13 && tileClass.includes('tile-base-blue') && (
                <div className="base-token-area">
                  {renderBaseTokens(gameState?.players?.find(p => p.color === 'BLUE'))}
                </div>
              )}
              {row >= 10 && row <= 13 && col >= 10 && col <= 13 && tileClass.includes('tile-base-yellow') && (
                <div className="base-token-area">
                  {renderBaseTokens(gameState?.players?.find(p => p.color === 'YELLOW'))}
                </div>
              )}
              {row >= 10 && row <= 13 && col >= 1 && col <= 4 && tileClass.includes('tile-base-red') && (
                <div className="base-token-area">
                  {renderBaseTokens(gameState?.players?.find(p => p.color === 'RED'))}
                </div>
              )}
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
          const isMovable = movableTokenIds.has(token.id);
          
          tokens.push(
            <Token
              key={token.id}
              token={token}
              isMovable={isMovable}
              onTokenClick={handleTokenClick}
            />
          );
        }
      });
    });

    return tokens;
  };

  /**
   * Renders tokens in base area for a specific player
   * @param {Object} player - Player object
   * @returns {JSX.Element[]} Array of BaseToken components
   */
  const renderBaseTokens = (player) => {
    if (!player?.tokens) return [];
    
    const baseTokens = player.tokens.filter(token => !token.position && !token.isOut);
    
    return baseTokens.map((token, index) => {
      const isMovable = movableTokenIds.has(token.id);
      
      return (
        <BaseToken
          key={token.id}
          token={token}
          isMovable={isMovable}
          basePosition={index}
          onTokenClick={handleTokenClick}
        />
      );
    });
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
            disabled={!isWaitingForRoll || !currentPlayer || gameState?.isGameOver}
          >
            🎲 Roll Dice
          </button>
          
          {/* Display current phase */}
          <div className="turn-phase-info">
            <small>Phase: {currentPhase}</small>
          </div>
          
          {/* Display last dice roll if available */}
          {lastDiceValue && (
            <div className="last-dice-roll">
              <span>Last Roll: {lastDiceValue}</span>
            </div>
          )}
          
          {/* Show possible moves info */}
          {isWaitingForMove && possibleMoves.length > 0 && (
            <div className="move-instructions">
              <small>Click a highlighted token to move ({possibleMoves.length} moves available)</small>
            </div>
          )}
          
          {/* No moves available message */}
          {isWaitingForMove && possibleMoves.length === 0 && (
            <div className="no-moves-message">
              <small>No valid moves available</small>
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