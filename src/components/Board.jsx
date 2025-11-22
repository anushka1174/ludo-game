// Main Ludo board visualization component

import React from 'react';
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

      {/* Main Board Container */}
      <div className="board-container">
        {/* Top Row - Green Base and Track */}
        <div className="board-row board-top">
          <div className="base-area green-base">
            <h3>Base Area (Green)</h3>
            <div className="token-slots">
              <div className="token-slot"></div>
              <div className="token-slot"></div>
              <div className="token-slot"></div>
              <div className="token-slot"></div>
            </div>
          </div>
          
          <div className="track-section top-track">
            <div className="track-tiles">
              {/* Placeholder for top track tiles */}
              <div className="track-row">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={`top-${i}`} className="track-tile"></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="base-area blue-base">
            <h3>Base Area (Blue)</h3>
            <div className="token-slots">
              <div className="token-slot"></div>
              <div className="token-slot"></div>
              <div className="token-slot"></div>
              <div className="token-slot"></div>
            </div>
          </div>
        </div>

        {/* Middle Row - Side Tracks, Home Paths, and Center */}
        <div className="board-row board-middle">
          <div className="track-section left-track">
            <div className="track-tiles vertical">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={`left-${i}`} className="track-tile"></div>
              ))}
            </div>
          </div>
          
          <div className="center-section">
            {/* Home Paths */}
            <div className="home-paths">
              <div className="home-path red-home">
                <span>Home Path (Red)</span>
                <div className="home-tiles">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={`red-home-${i}`} className="home-tile"></div>
                  ))}
                </div>
              </div>
              
              <div className="home-path green-home">
                <span>Home Path (Green)</span>
                <div className="home-tiles">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={`green-home-${i}`} className="home-tile"></div>
                  ))}
                </div>
              </div>
              
              <div className="center-area">
                <div className="center-triangle">
                  <span>Center</span>
                </div>
              </div>
              
              <div className="home-path blue-home">
                <span>Home Path (Blue)</span>
                <div className="home-tiles">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={`blue-home-${i}`} className="home-tile"></div>
                  ))}
                </div>
              </div>
              
              <div className="home-path yellow-home">
                <span>Home Path (Yellow)</span>
                <div className="home-tiles">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={`yellow-home-${i}`} className="home-tile"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="track-section right-track">
            <div className="track-tiles vertical">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={`right-${i}`} className="track-tile"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row - Yellow Base and Track */}
        <div className="board-row board-bottom">
          <div className="base-area red-base">
            <h3>Base Area (Red)</h3>
            <div className="token-slots">
              <div className="token-slot"></div>
              <div className="token-slot"></div>
              <div className="token-slot"></div>
              <div className="token-slot"></div>
            </div>
          </div>
          
          <div className="track-section bottom-track">
            <div className="track-tiles">
              {/* Placeholder for bottom track tiles */}
              <div className="track-row">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={`bottom-${i}`} className="track-tile"></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="base-area yellow-base">
            <h3>Base Area (Yellow)</h3>
            <div className="token-slots">
              <div className="token-slot"></div>
              <div className="token-slot"></div>
              <div className="token-slot"></div>
              <div className="token-slot"></div>
            </div>
          </div>
        </div>
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