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
    // Token is on the board - use its position
    gridStyle.gridRowStart = token.position.row + 1;
    gridStyle.gridColumnStart = token.position.col + 1;
  } else {
    // Token is in base - don't render on main grid
    // Base tokens will be rendered separately in Board component
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

/**
 * BaseToken component - Renders tokens in base areas
 * @param {Object} props - Component props
 * @param {Object} props.token - Token object
 * @param {Function} props.onTokenClick - Click handler
 * @param {boolean} props.isMovable - Whether token can be moved
 * @param {number} props.basePosition - Position within base (0-3)
 */
export const BaseToken = ({ token, onTokenClick, isMovable = false, basePosition = 0 }) => {
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

  const handleClick = () => {
    if (onTokenClick && token?.id) {
      onTokenClick(token.id);
    }
  };

  if (!token) return null;

  const tokenColor = getTokenColor(token.id);
  const colorName = getColorName(token.id);

  // Position within 2x2 grid in base
  const gridRow = Math.floor(basePosition / 2) + 1;
  const gridCol = (basePosition % 2) + 1;

  return (
    <div
      className={`token base-token token-${colorName} ${
        isMovable ? 'movable' : ''
      }`}
      style={{
        gridRowStart: gridRow,
        gridColumnStart: gridCol,
        backgroundColor: tokenColor,
        border: `3px solid ${tokenColor}`,
        position: 'relative',
        zIndex: isMovable ? 15 : 10,
        cursor: isMovable ? 'pointer' : 'default'
      }}
      onClick={handleClick}
      title={`Token ${token.id}${isMovable ? ' - Click to move' : ''}`}
    >
      <div className="token-inner">
        <span className="token-id">{token.id}</span>
        {isMovable && <div className="movable-indicator">✨</div>}
      </div>
    </div>
  );
};

export default Token;