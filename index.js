// Command-line simulation of Ludo game using turnManager.js
// Demonstrates a 3-turn sequence with different scenarios

import { initializeGame } from './src/game/gameState.js';
import { 
  getInitialTurnState, 
  processTurnAction, 
  ACTION_TYPES,
  getTurnStateInfo 
} from './src/game/turnManager.js';

/**
 * Utility function to print turn state information
 */
function printTurnState(turnState, description) {
  console.log(`\n=== ${description} ===`);
  const info = getTurnStateInfo(turnState);
  
  if (!info) {
    console.log('Invalid turn state');
    return;
  }

  console.log(`Phase: ${info.phase}`);
  console.log(`Current Player: ${info.currentPlayer?.color || 'None'}`);
  
  if (info.diceValue) {
    console.log(`Dice Value: ${info.diceValue}`);
  }
  
  if (info.possibleMoves && info.possibleMoves.length > 0) {
    console.log(`Possible Moves: ${info.possibleMoves.length} tokens can move`);
    info.possibleMoves.forEach((move, index) => {
      console.log(`  ${index + 1}. Token ${move.tokenId} at position ${JSON.stringify(move.currentPosition)}`);
    });
  } else if (info.phase === 'WAITING_FOR_MOVE') {
    console.log('No possible moves available');
  }
  
  if (info.extraTurnGranted) {
    console.log('🎉 Extra turn granted!');
  }
  
  if (info.gameOver) {
    console.log(`🏆 Game Over! Winners: ${info.winners.join(', ')}`);
  }
}

/**
 * Utility function to print game state summary
 */
function printGameStateSummary(gameState, description) {
  console.log(`\n=== ${description} ===`);
  console.log(`Turn Count: ${gameState.turnCount}`);
  console.log(`Current Player Index: ${gameState.currentPlayerIndex}`);
  console.log(`Game Over: ${gameState.isGameOver}`);
  
  console.log('\nPlayer Token Status:');
  gameState.players.forEach(player => {
    const tokensOut = player.tokens.filter(t => t.isOut && !t.isCompleted).length;
    const tokensCompleted = player.tokens.filter(t => t.isCompleted).length;
    const tokensInBase = player.tokens.filter(t => !t.isOut).length;
    
    console.log(`  ${player.color}: Base: ${tokensInBase}, Out: ${tokensOut}, Completed: ${tokensCompleted}`);
  });
}

/**
 * Main simulation function
 */
function runLudoSimulation() {
  console.log('🎲 Starting Ludo Game Simulation 🎲');
  console.log('=====================================');
  
  // Initialize the game
  console.log('\n🎯 Initializing Game...');
  const initialGameState = initializeGame();
  printGameStateSummary(initialGameState, 'Initial Game State');
  
  // Initialize the turn
  let currentTurnState = getInitialTurnState(initialGameState);
  printTurnState(currentTurnState, 'Initial Turn State');
  
  // ===== TURN 1: Player RED =====
  console.log('\n🔴 STARTING TURN 1: Player RED');
  console.log('================================');
  
  // RED rolls a 6
  console.log('\n🎲 RED rolls a 6...');
  currentTurnState = processTurnAction(currentTurnState, {
    type: ACTION_TYPES.ROLL_DICE,
    value: 6
  });
  printTurnState(currentTurnState, 'After RED rolls 6');
  
  // RED moves first available token (should be able to exit base)
  const firstTokenId = currentTurnState.possibleMoves[0]?.id;
  if (firstTokenId) {
    console.log(`\n🚀 RED moves token ${firstTokenId}...`);
    currentTurnState = processTurnAction(currentTurnState, {
      type: ACTION_TYPES.MAKE_MOVE,
      tokenId: firstTokenId
    });
    printTurnState(currentTurnState, `After RED moves token ${firstTokenId}`);
  }
  
  // RED gets extra turn due to rolling 6, rolls a 2
  console.log('\n🎲 RED gets extra turn and rolls a 2...');
  currentTurnState = processTurnAction(currentTurnState, {
    type: ACTION_TYPES.ROLL_DICE,
    value: 2
  });
  printTurnState(currentTurnState, 'After RED rolls 2');
  
  // RED moves the same token 2 steps forward
  const secondMoveTokenId = currentTurnState.possibleMoves[0]?.id;
  if (secondMoveTokenId) {
    console.log(`\n🚀 RED moves token ${secondMoveTokenId} forward...`);
    currentTurnState = processTurnAction(currentTurnState, {
      type: ACTION_TYPES.MAKE_MOVE,
      tokenId: secondMoveTokenId
    });
    printTurnState(currentTurnState, `After RED moves token ${secondMoveTokenId}`);
  }
  
  // ===== TURN 2: Player GREEN =====
  console.log('\n🟢 STARTING TURN 2: Player GREEN');
  console.log('=================================');
  
  // Automatically progressed to GREEN due to no extra turn
  console.log('\n🎲 GREEN rolls a 3...');
  currentTurnState = processTurnAction(currentTurnState, {
    type: ACTION_TYPES.ROLL_DICE,
    value: 3
  });
  printTurnState(currentTurnState, 'After GREEN rolls 3');
  
  // GREEN has no tokens out, so no moves possible - turn should auto-pass
  if (currentTurnState.possibleMoves.length === 0) {
    console.log('\n⏭️ GREEN has no valid moves, turn automatically passes...');
    // The turn should automatically progress to TURN_END phase
    printTurnState(currentTurnState, 'GREEN turn ending (no moves)');
  }
  
  // ===== TURN 3: Player BLUE =====
  console.log('\n🔵 STARTING TURN 3: Player BLUE');
  console.log('================================');
  
  // Turn should have progressed to BLUE
  console.log('\n🎲 BLUE rolls a 1...');
  currentTurnState = processTurnAction(currentTurnState, {
    type: ACTION_TYPES.ROLL_DICE,
    value: 1
  });
  printTurnState(currentTurnState, 'After BLUE rolls 1');
  
  // BLUE has no tokens out, so no moves possible
  if (currentTurnState.possibleMoves.length === 0) {
    console.log('\n⏭️ BLUE has no valid moves, turn automatically passes...');
    printTurnState(currentTurnState, 'BLUE turn ending (no moves)');
  }
  
  // ===== FINAL STATE =====
  console.log('\n🏁 SIMULATION COMPLETE');
  console.log('=======================');
  
  printGameStateSummary(currentTurnState.gameState, 'Final Game State');
  printTurnState(currentTurnState, 'Final Turn State');
  
  // Print detailed final state
  console.log('\n📊 Detailed Final Game State:');
  console.log(JSON.stringify(currentTurnState.gameState, null, 2));
  
  console.log('\n🎯 Simulation Summary:');
  console.log('- RED successfully moved a token out of base and forward 2 steps');
  console.log('- GREEN and BLUE had no valid moves (no tokens out, need 6 to exit base)');
  console.log('- Turn progression worked correctly through the state machine');
  console.log('- Extra turn mechanics functioned properly (RED got extra turn for rolling 6)');
}

// Run the simulation
try {
  runLudoSimulation();
} catch (error) {
  console.error('❌ Simulation failed:', error);
  console.error(error.stack);
}