// Token component for Ludo game pieces

import React from 'react';
import { COLORS } from '../game/constants.js';
import './Token.css';

/**
 * Token component - Renders individual game pieces
 * @param {Object} props - Component props
 * @param {Object} props.token - Token object with id, position, and state
 * @param {Function} props.onTokenClick - Callback when token is clicked
 * @param {boolean} props.isMovable - Whether this token can be moved in current turn
 */
const Token = ({ token, onTokenClick, isMovable = false }) => {
  /**
   * Determines the color of the token based on its ID
   * @param {string} tokenId - Token ID (e.g., 'R1', 'G3', 'B2', 'Y4')
   * @returns {string} Color hex code
   */
  const getTokenColor = (tokenId) => {
    if (!tokenId) return '#95a5a6';
    
    const colorPrefix = tokenId.charAt(0).toLowerCase();
    switch (colorPrefix) {
      case 'r': return COLORS.RED;
      case 'g': return COLORS.GREEN;
      case 'b': return COLORS.BLUE;
      case 'y': return COLORS.YELLOW;
      default: return '#95a5a6';
    }
  };

  /**
   * Gets the display color name for the token
   * @param {string} tokenId - Token ID
   * @returns {string} Color name
   */
  const getColorName = (tokenId) => {
    if (!tokenId) return 'gray';
    
    const colorPrefix = tokenId.charAt(0).toLowerCase();
    switch (colorPrefix) {
      case 'r': return 'red';
      case 'g': return 'green';
      case 'b': return 'blue';
      case 'y': return 'yellow';
      default: return 'gray';
    }
  };

  // Handle token click
  const handleClick = () => {
    if (onTokenClick && token?.id) {
      onTokenClick(token.id);
    }
  };

  // Don't render if token has no valid position and is not in base
  if (!token) return null;

  // Calculate grid position
  const gridStyle = {};
  if (token.position) {
    gridStyle.gridRowStart = token.position.row + 1;
    gridStyle.gridColumnStart = token.position.col + 1;
  } else {
    // Token is in base - don't show on main grid for now
    return null;
  }

  const tokenColor = getTokenColor(token.id);
  const colorName = getColorName(token.id);

  return (
    <div
      className={`token token-${colorName} ${
        token.isCompleted ? 'completed' : ''
      } ${
        token.isSafe ? 'safe' : ''
      } ${
        isMovable ? 'movable' : ''
      }`}
      style={{
        ...gridStyle,
        backgroundColor: tokenColor,
        border: `3px solid ${tokenColor}`,
        filter: token.isCompleted ? 'brightness(1.2) saturate(1.5)' : 'none',
        position: 'absolute',
        zIndex: isMovable ? 15 : 10,
        cursor: isMovable ? 'pointer' : 'default'
      }}
      onClick={handleClick}
      title={`Token ${token.id} ${
        token.isCompleted ? '(Completed)' : 
        token.isSafe ? '(Safe)' : ''
      }${isMovable ? ' - Click to move' : ''}`}
    >
      <div className="token-inner">
        <span className="token-id">{token.id}</span>
        {token.isSafe && <div className="safe-indicator">🛡️</div>}
        {token.isCompleted && <div className="completed-indicator">👑</div>}
        {isMovable && <div className="movable-indicator">✨</div>}
      </div>
    </div>
  );
};

export default Token;