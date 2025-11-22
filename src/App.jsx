// Main application component - State manager and controller for Ludo game

import React, { useState, useCallback } from 'react';
import { initializeGame } from './game/gameState.js';
import { 
  getInitialTurnState, 
  processTurnAction, 
  TURN_PHASES 
} from './game/turnManager.js';
import Board from './components/Board.jsx';
import './App.css';

/**
 * App component - Main application state manager and controller
 */
function App() {
  // Initialize game state using the game logic modules
  const [turnState, setTurnState] = useState(() => {
    const gameState = initializeGame();
    return getInitialTurnState(gameState);
  });

  /**
   * Action dispatcher - Handles all game actions and state updates
   * @param {Object} action - Action object with type and optional payload
   */
  const handleAction = useCallback((action) => {
    if (!action || !action.type) {
      console.warn('Invalid action received:', action);
      return;
    }

    try {
      // Process the action through the turn manager
      const newTurnState = processTurnAction(turnState, action);
      
      // Update the component state
      setTurnState(newTurnState);
      
      // Log action for debugging (can be removed in production)
      console.log('Action processed:', action, 'New state:', newTurnState);
      
    } catch (error) {
      console.error('Error processing action:', action, error);
      // In a production app, you might want to show an error message to the user
    }
  }, [turnState]);

  /**
   * Reset game to initial state
   */
  const handleResetGame = useCallback(() => {
    const gameState = initializeGame();
    const initialTurnState = getInitialTurnState(gameState);
    setTurnState(initialTurnState);
  }, []);

  /**
   * Get current phase for debugging/development
   */
  const currentPhase = turnState?.phase || 'UNKNOWN';
  const isGameOver = turnState?.gameState?.isGameOver || false;

  return (
    <div className="app">
      {/* App Header */}
      <header className="app-header">
        <div className="app-title">
          <h1>🎲 Ludo Game</h1>
          <p>Classic 4-Player Board Game</p>
        </div>
        
        {/* Development Info */}
        <div className="app-debug-info">
          <span className="current-phase">Phase: {currentPhase}</span>
          <button 
            className="reset-button"
            onClick={handleResetGame}
            title="Start New Game"
          >
            🔄 Reset Game
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="app-main">
        <Board 
          gameState={turnState.gameState}
          turnState={turnState}
          onAction={handleAction}
        />
      </main>

      {/* Game Over Modal/Overlay */}
      {isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2>🏆 Game Over!</h2>
            <div className="winners-list">
              {turnState.gameState.winners && turnState.gameState.winners.length > 0 ? (
                <>
                  <p>Congratulations to the winners:</p>
                  <ul>
                    {turnState.gameState.winners.map((winner, index) => (
                      <li key={winner} className={`winner winner-${winner}`}>
                        {winner.toUpperCase()} Player
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>No winners declared</p>
              )}
            </div>
            <div className="game-over-actions">
              <button 
                className="new-game-button"
                onClick={handleResetGame}
              >
                🎮 Start New Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>Built with React & Vite | Turn-based Ludo Game</p>
          <div className="game-stats">
            <span>Turn: {turnState?.gameState?.turnCount || 0}</span>
            <span>•</span>
            <span>Players: {turnState?.gameState?.players?.length || 0}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
