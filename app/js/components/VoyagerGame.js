// js/voyager-game.js - CORRECTED VERSION with all attack functions properly defined

import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CardChoiceModal from '../components/CardChoiceModal';
import { CardEffectsProcessor, angelCardsWithEffects, demonCardsWithEffects } from '../utils/card-effects';
import { DataLoader } from '../utils/data-loader';
import { StateManager } from '../utils/state-manager';
import { ThemeManager } from '../utils/theme-manager';
import CardSystem from './card-system';
import GameBoard from './game-board';
import PlayerManager from './player-manager';
import TriviaPanel from './trivia-panel';


// GET DIMENSIONS
const { width, height } = Dimensions.get('window');



// Advanced responsive approach with breakpoints
const isVeryLargeScreen = width > 1600;
const isLargeScreen = width > 1200;
const isMediumScreen = width > 900;

let gameBoardPercentage, sidePanelPercentage;

if (isVeryLargeScreen) {
  gameBoardPercentage = 0.45; // 45% for game board
  sidePanelPercentage = 0.55 / 3; // Remaining 55% split equally
} else if (isLargeScreen) {
  gameBoardPercentage = 0.50; // 50% for game board
  sidePanelPercentage = 0.50 / 3; // Remaining 50% split equally
} else if (isMediumScreen) {
  gameBoardPercentage = 0.55; // 55% for game board
  sidePanelPercentage = 0.45 / 3; // Remaining 45% split equally
} else {
  gameBoardPercentage = 0.60; // 60% for game board on small screens
  sidePanelPercentage = 0.40 / 3; // Remaining 40% split equally
}

const baseStyles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2E8B57',
    padding: 8,
    gap: 2,
  },
  leftPanel: {
    width: Math.max(250, width * sidePanelPercentage),
    minWidth: 250,
    flexShrink: 0,
  },
  gameBoardContainer: {
    position: 'relative', // This allows absolute positioning of child components
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerPanel: {
    width: Math.max(400, width * gameBoardPercentage),
    minWidth: 400,
    flexShrink: 0,
    right: 20,
  },
  rightPanel: {
    width: Math.max(280, width * sidePanelPercentage),
    minWidth: 280,
    flexShrink: 0,
    right: 40,
  },
  playersPanel: {
    width: Math.max(240, width * sidePanelPercentage),
    minWidth: 240,
    flexShrink: 0,
    right: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E8B57',
  },
  loadingText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fefefe',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#8B4513',
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bodyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Manual move mode styles
  activeMoveButton: {
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  // Attack modal styles
  attackModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  attackModalContent: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    minWidth: 350,
    maxWidth: 450,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 25,
  },
  wolvesModal: {
    backgroundColor: '#654321',
    borderColor: '#8B4513',
    borderWidth: 4,
  },
  banditsModal: {
    backgroundColor: '#2F4F4F',
    borderColor: '#708090',
    borderWidth: 4,
  },
  attackEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  attackTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  attackDescription: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
    opacity: 0.9,
  },
  playerInfo: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 8,
  },
  attackButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'white',
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  attackButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  diceRolling: {
    fontSize: 48,
    color: 'white',
    marginVertical: 20,
  },
  attackResults: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
    width: '100%',
  },
  rollResult: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  damageText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
  },
  continueButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderColor: 'white',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 15,
  },
});

const VoyagerGame = () => {
  const [gameState, setGameState] = useState(StateManager.getInitialState());
  const [gameConfig, setGameConfig] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('biblical');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [manualMoveMode, setManualMoveMode] = useState(false); // Manual move mode state
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [choiceModalCard, setChoiceModalCard] = useState(null);

  const cardArrays = { angelCardsWithEffects, demonCardsWithEffects }; // This "uses" the imports

  const handleCardChoice = (choice) => {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  
  if (choice.type === 'teleport') {
    // Handle teleportation
    const updatedPlayers = gameState.players.map((player, index) =>
      index === gameState.currentPlayerIndex
        ? { ...player, position: choice.location }
        : player
    );
    
    const location = gameConfig.boardPositions[choice.location];
    const selectedLocation = location && location.type === 'location' ? location.name : null;
    
    updateGameState({
      players: updatedPlayers,
      selectedLocation
    });
    
    Alert.alert(
      '🏃 Divine Transport!',
      `${currentPlayer.name} has been transported to ${gameConfig.boardPositions[choice.location].name}!`
    );
    
  } else if (choice.type === 'helper') {
    // Handle helper choice + SP gain
    const updatedPlayers = gameState.players.map((player, index) => {
      if (index === gameState.currentPlayerIndex) {
        const updatedHelpers = { ...player.helpers };
        updatedHelpers[choice.helper] = (updatedHelpers[choice.helper] || 0) + 1;
        
        return {
          ...player,
          sacrificePoints: player.sacrificePoints + choice.spGain,
          helpers: updatedHelpers
        };
      }
      return player;
    });
    
    updateGameState({ players: updatedPlayers });
    
    Alert.alert(
      '👼 Divine Blessing!',
      `${currentPlayer.name} gained ${choice.spGain} SP and 1 point with ${choice.helper}!`
    );
  }
  
  setShowChoiceModal(false);
  setChoiceModalCard(null);
};
  // NEW: Attack state management
  const [attackState, setAttackState] = useState({
    isActive: false,
    type: null, // 'wolves' or 'bandits'
    isRolling: false,
    attackRoll: null,
    damage: null,
    expectedPosition: null
  });

  // Get current theme and styles
  const theme = ThemeManager.getCurrentTheme(currentTheme);
  const styles = gameConfig ? ThemeManager.getStyles(currentTheme) : baseStyles;

  useEffect(() => {
    initializeGame();
  }, []);

  // Auto-update trivia when current player's position changes
  useEffect(() => {
    if (gameConfig && gameState.players.length > 0) {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      if (currentPlayer) {
        const location = gameConfig.boardPositions[currentPlayer.position];
        if (location && location.type === 'location') {
          // Auto-load trivia for the location the player landed on
          updateGameState({ selectedLocation: location.name });
        } else {
          // Clear trivia panel for special spaces
          updateGameState({ selectedLocation: null });
        }
      }
    }
  }, [gameState.currentPlayerIndex, gameState.players, gameConfig]);

  // Auto-update trivia when any player moves (after dice roll)
  useEffect(() => {
    if (gameConfig && gameState.players.length > 0) {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      if (currentPlayer) {
        const location = gameConfig.boardPositions[currentPlayer.position];
        if (location && location.type === 'location') {
          updateGameState({ selectedLocation: location.name });
        }
      }
    }
  }, [gameState.players.map(p => p.position).join(','), gameConfig]);

  const initializeGame = async (themeName = currentTheme) => {
    try {
      // Load game configuration
      const config = await DataLoader.loadThemeConfig(themeName);
      setGameConfig(config);
      
      // Initialize state with config
      const initialState = StateManager.initializeWithConfig(config);
      setGameState(initialState);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to initialize game:', error);
      Alert.alert('Error', 'Failed to load game configuration');
      setLoading(false);
    }
  };

  // Function to change theme
  const changeTheme = (newTheme) => {
    setCurrentTheme(newTheme);
    setShowThemeSelector(false);
    
    // Reload config for new theme
    initializeGame(newTheme);
    
    Alert.alert(
      'Theme Changed', 
      `Switched to ${newTheme === 'biblical' ? 'Biblical' : 'Medieval'} theme!`
    );
  };

  // FIXED: Enhanced updateGameState function to preserve Map/Set objects
  const updateGameState = (updates) => {
    setGameState(prevState => {
      // CRITICAL FIX: Ensure Map/Set objects are preserved during updates
      const processedUpdates = { ...updates };
      
      // If updates contain Sets or Maps, preserve them properly
      Object.keys(processedUpdates).forEach(key => {
        if (key === 'answeredQuestions' || key === 'claimedHelpers') {
          if (!(processedUpdates[key] instanceof Set)) {
            if (Array.isArray(processedUpdates[key])) {
              processedUpdates[key] = new Set(processedUpdates[key]);
            }
          }
        } else if (key === 'questionHistory') {
          if (!(processedUpdates[key] instanceof Map)) {
            if (Array.isArray(processedUpdates[key])) {
              processedUpdates[key] = new Map(processedUpdates[key]);
            }
          }
        }
      });
      
      const newState = StateManager.updateState(prevState, processedUpdates);
      return newState;
    });
  };

  // FIXED: Improved manual player movement function
  const handlePlayerMove = (targetLocationIndex) => {
    if (!manualMoveMode || gameState.players.length === 0) return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const oldPosition = currentPlayer.position;
    
    // Check if moving to a different location
    if (targetLocationIndex === oldPosition) {
      setManualMoveMode(false); // Exit manual move mode if clicking current location
      return;
    }

    // Calculate if player passed start
    let passedStart = false;
    let sacrificePointsBonus = 0;
    
    // Check for passing start (position 0) - simplified logic for manual movement
    if (targetLocationIndex === 0 || (oldPosition > targetLocationIndex && targetLocationIndex < oldPosition)) {
      // Player chose to go to start or went "backwards" which we'll treat as passing start
      passedStart = true;
      sacrificePointsBonus = 5;
    }

    // CRITICAL FIX: Update player position FIRST and store in state immediately
    const updatedPlayers = gameState.players.map((player, index) =>
      index === gameState.currentPlayerIndex
        ? {
            ...player,
            position: targetLocationIndex,  // Position set FIRST
            sacrificePoints: player.sacrificePoints + sacrificePointsBonus
          }
        : player
    );

    // Determine selected location for auto-loading trivia
    const location = gameConfig.boardPositions[targetLocationIndex];
    const selectedLocation = location && location.type === 'location' ? location.name : null;

    // CRITICAL: Update state immediately with new position
    updateGameState({
      players: updatedPlayers,
      selectedLocation
    });

    // Show bonus message if passed start
    if (passedStart) {
      Alert.alert('Passed Start!', `${currentPlayer.name} gained 5 SP!`);
    }

    // Exit manual move mode
    setManualMoveMode(false);

    // CRITICAL FIX: Handle special spaces AFTER position is confirmed in state
    setTimeout(() => {
      if (location.type === 'special') {
        // FIXED: Use the correct function name
        handleSpecialSpace(location, targetLocationIndex, updatedPlayers[gameState.currentPlayerIndex]);
      }
    }, 100); // Brief delay to ensure state update is complete
  };

  // Toggle manual move mode
  const toggleManualMoveMode = () => {
    if (gameState.players.length === 0) {
      Alert.alert('No Players', 'Add a player first!');
      return;
    }
    
    if (gameState.isRolling || attackState.isActive) {
      Alert.alert('Wait', 'Wait for current action to complete!');
      return;
    }

    setManualMoveMode(!manualMoveMode);
    
    if (!manualMoveMode) {
      Alert.alert(
        'Manual Move Mode', 
        `Click any location on the board to move ${gameState.players[gameState.currentPlayerIndex]?.name}'s piece there.`,
        [{ text: 'OK' }]
      );
    }
  };

  // FIXED: Improved dice roll function with proper position handling
  const rollDice = () => {
    if (gameState.isRolling || gameState.players.length === 0 || attackState.isActive) return;

    // Exit manual move mode when rolling dice
    setManualMoveMode(false);

    updateGameState({ isRolling: true });

    // Simulate dice roll animation delay
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      
      // CRITICAL FIX: Calculate and set position FIRST
      const oldPosition = currentPlayer.position;
      const newPosition = (currentPlayer.position + roll) % gameConfig.boardPositions.length;
      const passedStart = newPosition < oldPosition || (oldPosition + roll) >= gameConfig.boardPositions.length;
      
      let sacrificePointsBonus = 0;
      if (passedStart) {
        sacrificePointsBonus = 5;
        Alert.alert('Passed Start!', `${currentPlayer.name} gained 5 SP!`);
      }

      // CRITICAL: Update player position and state immediately
      const updatedPlayers = gameState.players.map((player, index) => 
        index === gameState.currentPlayerIndex 
          ? { 
              ...player, 
              position: newPosition,  // Position set FIRST
              sacrificePoints: player.sacrificePoints + sacrificePointsBonus
            }
          : player
      );

      // Determine selected location for auto-loading trivia
      const location = gameConfig.boardPositions[newPosition];
      const selectedLocation = location && location.type === 'location' ? location.name : null;

      // CRITICAL: Update state with new position immediately
      updateGameState({
        lastRoll: roll,
        isRolling: false,
        players: updatedPlayers,
        selectedLocation
      });

      // CRITICAL FIX: Handle special spaces AFTER position is confirmed in state
      setTimeout(() => {
        if (location.type === 'special') {
          // FIXED: Use correct function name and pass updated player
          handleSpecialSpace(location, newPosition, updatedPlayers[gameState.currentPlayerIndex]);
        }
      }, 100); // Brief delay to ensure state update is complete
    }, 1000);
  };

  // FIXED: Consolidated special space handling function
  const handleSpecialSpace = (location, position, playerAtPosition) => {
    console.log('Handling special space:', location.name, 'at position:', position);
    
    switch(location.name) {
      case "🐺 WOLVES ATTACK":
        initiateWolvesAttack(playerAtPosition, position);
        break;
        
      case "⚔️ BANDITS ATTACK":
        initiateBanditsAttack(playerAtPosition, position);
        break;
        
      case "👼 ANGEL CARD":
        drawCard('angel');
        break;
        
      case "👹 DEMON CARD":
        drawCard('demon');
        break;
        
      default:
        console.log('Unknown special space:', location.name);
    }
  };

  // FIXED: Wolves attack implementation
  // UPDATED ATTACK FUNCTIONS WITH IMMUNITY CHECKS

// First, add this import at the top of your VoyagerGame.js file:

// UPDATED: Wolves attack with immunity check
const initiateWolvesAttack = (player, position) => {
  console.log('Initiating wolves attack for player:', player.name, 'at position:', position);
  
  // CHECK FOR ATTACK IMMUNITY FIRST
  if (CardEffectsProcessor.hasActiveCard(player, 'attack_immunity')) {
    console.log('Player has attack immunity - blocking wolves attack');
    
    const { player: updatedPlayer, cardUsed } = CardEffectsProcessor.useActiveCard(player, 'attack_immunity');
    
    // Update player state to remove the used immunity card
    const updatedPlayers = gameState.players.map((p, index) => 
      index === gameState.currentPlayerIndex ? updatedPlayer : p
    );
    
    updateGameState({ players: updatedPlayers });
    
    // Show immunity message
    Alert.alert(
      `${cardUsed.symbol} ${cardUsed.title}`,
      `Divine protection activated! The wolves flee in terror before ${player.name}! The pack disperses into the wilderness.`
    );
    
    return; // Skip normal attack completely
  }
  
  // Continue with normal attack if no immunity
  setAttackState({
    isActive: true,
    type: 'wolves',
    isRolling: false,
    attackRoll: null,
    damage: null,
    expectedPosition: position
  });
};

const performWolvesAttackRoll = () => {
  setAttackState(prev => ({ ...prev, isRolling: true }));

  setTimeout(() => {
    const attackRoll = Math.floor(Math.random() * 6) + 1;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    const livestockLoss = Math.min(currentPlayer.livestock, attackRoll);
    const spLoss = Math.min(currentPlayer.sacrificePoints, attackRoll);
    
    // CRITICAL: Update only resources, never position
    const updatedPlayers = gameState.players.map((player, index) =>
      index === gameState.currentPlayerIndex
        ? {
            ...player,
            livestock: Math.max(0, player.livestock - attackRoll),
            sacrificePoints: Math.max(0, player.sacrificePoints - attackRoll)
            // position is intentionally NOT modified
          }
        : player
    );

    updateGameState({
      players: updatedPlayers,
      lastRoll: attackRoll
    });

    setAttackState(prev => ({
      ...prev,
      isRolling: false,
      attackRoll,
      damage: {
        livestock: livestockLoss,
        sp: spLoss,
        remaining: {
          livestock: Math.max(0, currentPlayer.livestock - attackRoll),
          sp: Math.max(0, currentPlayer.sacrificePoints - attackRoll)
        }
      }
    }));
  }, 1000);
};

// UPDATED: Bandits attack with immunity check
const initiateBanditsAttack = (player, position) => {
  console.log('Initiating bandits attack for player:', player.name, 'at position:', position);
  
  // CHECK FOR ATTACK IMMUNITY FIRST
  if (CardEffectsProcessor.hasActiveCard(player, 'attack_immunity')) {
    console.log('Player has attack immunity - blocking bandits attack');
    
    const { player: updatedPlayer, cardUsed } = CardEffectsProcessor.useActiveCard(player, 'attack_immunity');
    
    // Update player state to remove the used immunity card
    const updatedPlayers = gameState.players.map((p, index) => 
      index === gameState.currentPlayerIndex ? updatedPlayer : p
    );
    
    updateGameState({ players: updatedPlayers });
    
    // Show immunity message
    Alert.alert(
      `${cardUsed.symbol} ${cardUsed.title}`,
      `Divine authority manifested! The bandits are struck with supernatural fear and scatter before ${player.name}! Your goods remain safe.`
    );
    
    return; // Skip normal attack completely
  }
  
  // Continue with normal attack if no immunity
  setAttackState({
    isActive: true,
    type: 'bandits',
    isRolling: false,
    attackRoll: null,
    damage: null,
    expectedPosition: position
  });
};

const performBanditsAttackRoll = () => {
  setAttackState(prev => ({ ...prev, isRolling: true }));

  setTimeout(() => {
    const attackRoll = Math.floor(Math.random() * 6) + 1;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    const coinsLoss = Math.min(currentPlayer.coins, attackRoll);
    const spLoss = Math.min(currentPlayer.sacrificePoints, attackRoll);
    
    // CRITICAL: Update only resources, never position
    const updatedPlayers = gameState.players.map((player, index) =>
      index === gameState.currentPlayerIndex
        ? {
            ...player,
            coins: Math.max(0, player.coins - attackRoll),
            sacrificePoints: Math.max(0, player.sacrificePoints - attackRoll)
            // position is intentionally NOT modified
          }
        : player
    );

    updateGameState({
      players: updatedPlayers,
      lastRoll: attackRoll
    });

    setAttackState(prev => ({
      ...prev,
      isRolling: false,
      attackRoll,
      damage: {
        coins: coinsLoss,
        sp: spLoss,
        remaining: {
          coins: Math.max(0, currentPlayer.coins - attackRoll),
          sp: Math.max(0, currentPlayer.sacrificePoints - attackRoll)
        }
      }
    }));
  }, 1000);
};

// UNCHANGED: Dismiss attack function
const dismissAttack = () => {
  setAttackState({
    isActive: false,
    type: null,
    isRolling: false,
    attackRoll: null,
    damage: null,
    expectedPosition: null
  });
};

// OPTIONAL: Add this helper function for testing immunity cards
const testImmunityCard = () => {
  // This function can be used to manually give a player an immunity card for testing
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  
  if (!currentPlayer) {
    Alert.alert('No Player', 'Add a player first!');
    return;
  }
  
  const immunityCard = {
    id: 'test_immunity',
    title: "Captain of the Host",
    symbol: "⚔️",
    effect: "Your next encounter with wolves or bandits is automatically won without rolling. Divine authority commands victory.",
    effectData: {
      type: 'attack_immunity',
      usesRemaining: 1,
      description: 'Auto-win next attack'
    },
    drawnAt: gameState.turnNumber
  };
  
  const updatedPlayers = gameState.players.map((player, index) => {
    if (index === gameState.currentPlayerIndex) {
      const activeCards = player.activeCards || [];
      return {
        ...player,
        activeCards: [...activeCards, immunityCard]
      };
    }
    return player;
  });
  
  updateGameState({ players: updatedPlayers });
  
  Alert.alert(
    '⚔️ Test Immunity Card Added!',
    `${currentPlayer.name} now has attack immunity for testing. Try landing on a wolves or bandits space!`
  );
};

// DEBUGGING: Enhanced logging version (use this if you need to debug)
const debugInitiateWolvesAttack = (player, position) => {
  console.log('🐺 DEBUG: Initiating wolves attack for player:', player.name, 'at position:', position);
  console.log('🐺 DEBUG: Player active cards:', player.activeCards);
  
  // Check for immunity with detailed logging
  const hasImmunity = CardEffectsProcessor.hasActiveCard(player, 'attack_immunity');
  console.log('🐺 DEBUG: Player has immunity?', hasImmunity);
  
  if (hasImmunity) {
    console.log('🐺 DEBUG: Processing immunity card usage...');
    
    const { player: updatedPlayer, cardUsed } = CardEffectsProcessor.useActiveCard(player, 'attack_immunity');
    console.log('🐺 DEBUG: Card used:', cardUsed);
    console.log('🐺 DEBUG: Player after card use:', updatedPlayer);
    
    const updatedPlayers = gameState.players.map((p, index) => 
      index === gameState.currentPlayerIndex ? updatedPlayer : p
    );
    
    updateGameState({ players: updatedPlayers });
    
    Alert.alert(
      `${cardUsed.symbol} ${cardUsed.title}`,
      `DEBUG: Divine protection activated! The wolves flee in terror before ${player.name}!`
    );
    
    return;
  }
  
  console.log('🐺 DEBUG: No immunity, proceeding with normal attack...');
  
  setAttackState({
    isActive: true,
    type: 'wolves',
    isRolling: false,
    attackRoll: null,
    damage: null,
    expectedPosition: position
  });
};

// TESTING CHECKLIST:
/*
1. Make sure you have imported CardEffectsProcessor at the top of your file
2. Test with a player who has no immunity card - should work normally
3. Use testImmunityCard() to give a player immunity, then test attack - should block attack
4. Verify that the immunity card is removed from player's activeCards after use
5. Test that immunity works for both wolves and bandits
6. Check console logs to see the immunity check process

To test:
1. Add a player
2. Call testImmunityCard() to give them immunity
3. Move them to wolves/bandits space (position 3 or 16)
4. Watch the immunity card activate and disappear
*/
// FIXED drawCard function - preserves player position
const drawCard = (cardType) => {
  const deck = cardType === 'angel' ? gameState.angelDeck : gameState.demonDeck;
  
  if (deck.length === 0) {
    Alert.alert('No Cards', `No ${cardType} cards available!`);
    return;
  }

  const cardIndex = Math.floor(Math.random() * deck.length);
  const card = deck[cardIndex];
  
  // Update deck first
  const updatedDeck = deck.filter((_, index) => index !== cardIndex);
  
  // CRITICAL FIX: Only update the deck and current card - DO NOT pass entire gameState
  const deckUpdate = {
    currentCard: { ...card, type: cardType },
    [cardType === 'angel' ? 'angelDeck' : 'demonDeck']: updatedDeck
  };
  
  updateGameState(deckUpdate); // Only update what's needed
  
  // Process card effect with current state
  setTimeout(() => {
    console.log('Processing card effect for:', card.title);
    
    if (card.effectType) {
      // FIXED: Use current gameState, not a reconstructed one
      CardEffectsProcessor.processCardEffect(
        card, 
        gameState, // Use the current state from the component
        (stateUpdates) => {
          // CRITICAL: Only update what the card effect changes
          updateGameState(stateUpdates);
        },
        (choiceCard) => {
          setChoiceModalCard(choiceCard);
          setShowChoiceModal(true);
        }
      );
    } else {
      console.warn('Card missing effectType:', card.title);
      Alert.alert(
        `${card.symbol} ${card.title}`,
        `${card.effect}\n\n(Effect not yet implemented)`
      );
    }
  }, 1500);
};

// Add this to your VoyagerGame.js - Enhanced endTurn function with card updates
const endTurn = () => {
  if (gameState.players.length === 0) return;

  // Exit manual move mode and dismiss any active attacks when ending turn
  setManualMoveMode(false);
  dismissAttack();

  const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
  const nextTurnNumber = nextPlayerIndex === 0 ? gameState.turnNumber + 1 : gameState.turnNumber;
  
  // CRITICAL FIX: Update active cards for all players at end of turn
  const updatedPlayers = gameState.players.map((player, index) => {
    if (!player.activeCards || player.activeCards.length === 0) {
      return player;
    }

    // Process each active card
    const updatedActiveCards = player.activeCards.map(card => {
      // Only decrease uses for turn-based cards (not permanent or one-time use cards)
      if (card.effectData.usesRemaining > 1 && card.effectData.usesRemaining < 999) {
        return {
          ...card,
          effectData: {
            ...card.effectData,
            usesRemaining: card.effectData.usesRemaining - 1
          }
        };
      }
      return card;
    }).filter(card => {
      // Remove cards that have no uses remaining (except permanent cards)
      return card.effectData.usesRemaining > 0 || card.effectData.usesRemaining === 999;
    });

    // Apply turn-based effects for cards like "Messenger of Satan"
    let updatedPlayer = { ...player, activeCards: updatedActiveCards };
    
    // Check for turn-based negative effects
    updatedActiveCards.forEach(card => {
      if (card.effectData.type === 'thorn_flesh') {
        updatedPlayer.sacrificePoints = Math.max(0, updatedPlayer.sacrificePoints - 1);
      }
    });

    return updatedPlayer;
  });
  
  // Determine selected location for the new current player
  let selectedLocation = null;
  if (updatedPlayers[nextPlayerIndex]) {
    const nextPlayer = updatedPlayers[nextPlayerIndex];
    const location = gameConfig.boardPositions[nextPlayer.position];
    if (location && location.type === 'location') {
      selectedLocation = location.name;
    }
  }

  updateGameState({
    players: updatedPlayers,
    currentPlayerIndex: nextPlayerIndex,
    turnNumber: nextTurnNumber,
    selectedLocation
  });

  // Show notification if cards expired
  const expiredCards = gameState.players.flatMap(player => 
    (player.activeCards || []).filter(card => 
      card.effectData.usesRemaining === 1 && card.effectData.usesRemaining < 999
    )
  );

  if (expiredCards.length > 0) {
    setTimeout(() => {
      Alert.alert(
        '⏰ Card Effects Expired',
        `The following card effects have ended: ${expiredCards.map(card => card.title).join(', ')}`
      );
    }, 500);
  }
};

// ALSO ADD: Function to manually update a specific player's active cards
const updatePlayerActiveCards = (playerIndex, newActiveCards) => {
  const updatedPlayers = gameState.players.map((player, index) => {
    if (index === playerIndex) {
      return {
        ...player,
        activeCards: newActiveCards
      };
    }
    return player;
  });

  updateGameState({ players: updatedPlayers });
};

// In VoyagerGame.js, update your addPlayer function:

const addPlayer = (playerData) => {
  if (gameState.players.length >= 6) {
    Alert.alert('Maximum Players', 'Maximum 6 players allowed!');
    return;
  }

  const newPlayer = {
    id: gameState.players.length + 1,
    name: playerData.name || `Player ${gameState.players.length + 1}`,
    position: 0,
    sacrificePoints: 0,
    livestock: 0,
    coins: 0,
    helpers: {},
    activeCards: [], // MAKE SURE THIS IS INCLUDED
    color: playerData.color,
    shape: playerData.shape
  };

  const updatedPlayers = [...gameState.players, newPlayer];
  
  // Set selected location for auto-loading trivia if this is the first player
  let selectedLocation = gameState.selectedLocation;
  if (gameState.players.length === 0 && gameConfig.boardPositions[0].type === 'location') {
    selectedLocation = gameConfig.boardPositions[0].name;
  }

  updateGameState({
    players: updatedPlayers,
    selectedLocation
  });
};

  const removePlayer = () => {
    if (gameState.players.length <= 1) {
      Alert.alert('Minimum Players', 'Need at least one player!');
      return;
    }

    const newPlayers = gameState.players.slice(0, -1);
    const newCurrentPlayerIndex = gameState.currentPlayerIndex >= newPlayers.length 
      ? 0 
      : gameState.currentPlayerIndex;

    // Update selected location for the new current player
    let selectedLocation = null;
    if (newPlayers.length > 0 && newPlayers[newCurrentPlayerIndex]) {
      const location = gameConfig.boardPositions[newPlayers[newCurrentPlayerIndex].position];
      if (location && location.type === 'location') {
        selectedLocation = location.name;
      }
    }

    updateGameState({
      players: newPlayers,
      currentPlayerIndex: newCurrentPlayerIndex,
      selectedLocation
    });
  };

  const answerQuestion = (characterName, spAmount, questionId) => {
    if (gameState.answeredQuestions.has(questionId)) {
      Alert.alert('Already Answered', 'This question has already been answered!');
      return;
    }

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const updatedPlayers = gameState.players.map((player, index) => {
      if (index === gameState.currentPlayerIndex) {
        const updatedHelpers = { ...player.helpers };
        
        // Add helper point only if not already claimed
        if (!gameState.claimedHelpers.has(characterName)) {
          if (!updatedHelpers[characterName]) {
            updatedHelpers[characterName] = 0;
          }
          updatedHelpers[characterName]++;
          
          if (updatedHelpers[characterName] === 3) {
            Alert.alert('Helper Recruited!', `${player.name} has recruited ${characterName} as a Helper!`);
          }
        }

        return {
          ...player,
          sacrificePoints: player.sacrificePoints + spAmount,
          helpers: updatedHelpers
        };
      }
      return player;
    });

    const newAnsweredQuestions = new Set(gameState.answeredQuestions);
    newAnsweredQuestions.add(questionId);

    const newClaimedHelpers = new Set(gameState.claimedHelpers);
    if (!newClaimedHelpers.has(characterName) && 
        updatedPlayers[gameState.currentPlayerIndex].helpers[characterName] === 3) {
      newClaimedHelpers.add(characterName);
    }

    updateGameState({
      players: updatedPlayers,
      answeredQuestions: newAnsweredQuestions,
      claimedHelpers: newClaimedHelpers
    });

    // Check win condition
    if (updatedPlayers[gameState.currentPlayerIndex].sacrificePoints >= 40) {
      Alert.alert('Winner!', `🎉 ${updatedPlayers[gameState.currentPlayerIndex].name} wins! 🎉`);
    }
  };

  const handleLocationSelect = (locationName) => {
    // Manual location selection for trivia browsing
    updateGameState({ selectedLocation: locationName });
  };

  const newGame = () => {
    Alert.alert(
      'New Game',
      'Start a new game? This will remove all players and reset the turn count.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'New Game', 
          onPress: () => {
            // Reset game state to remove all players and reset turn
            setManualMoveMode(false); // Reset manual move mode
            dismissAttack(); // Clear any active attacks
            updateGameState({
              players: [],
              currentPlayerIndex: 0,
              turnNumber: 1,
              lastRoll: 0,
              isRolling: false,
              currentCard: null,
              selectedLocation: null,
              answeredQuestions: new Set(),
              claimedHelpers: new Set()
            });
            
            Alert.alert('New Game Started!', 'All players removed and turn count reset. Add players to begin!');
          }
        }
      ]
    );
  };

  // FIXED: Attack Modal Component with better player info display
  const AttackModal = () => {
    if (!attackState.isActive) return null;

    const isWolves = attackState.type === 'wolves';
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    return (
      <View style={baseStyles.attackModalOverlay}>
        <View style={[
          baseStyles.attackModalContent,
          isWolves ? baseStyles.wolvesModal : baseStyles.banditsModal
        ]}>
          <Text style={baseStyles.attackEmoji}>
            {isWolves ? '🐺' : '⚔️'}
          </Text>
          
          <Text style={baseStyles.attackTitle}>
            {isWolves ? 'Wolves Attack!' : 'Bandits Attack!'}
          </Text>

          {!attackState.damage && (
            <>
              <Text style={baseStyles.attackDescription}>
                {isWolves 
                  ? 'Wild wolves emerge from the wilderness, threatening your livestock and supplies!'
                  : 'Highway bandits block your path, demanding your coins and provisions!'
                }
              </Text>

              <Text style={baseStyles.playerInfo}>
                {currentPlayer.name} has:{'\n'}
                {isWolves ? `🐄 ${currentPlayer.livestock} livestock` : `🪙 ${currentPlayer.coins} coins`}{'\n'}
                ⭐ {currentPlayer.sacrificePoints} SP
              </Text>

              {!attackState.isRolling && (
                <TouchableOpacity
                  style={baseStyles.attackButton}
                  onPress={isWolves ? performWolvesAttackRoll : performBanditsAttackRoll}
                >
                  <Text style={baseStyles.attackButtonText}>
                    Roll for Defense!
                  </Text>
                </TouchableOpacity>
              )}

              {attackState.isRolling && (
                <Text style={baseStyles.diceRolling}>🎲</Text>
              )}
            </>
          )}

          {attackState.damage && (
            <>
              <Text style={baseStyles.rollResult}>
                Rolled {attackState.attackRoll}!
              </Text>
              
              <View style={baseStyles.attackResults}>
                <Text style={[baseStyles.damageText, { fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }]}>
                  Attack Results:
                </Text>
                
                <Text style={baseStyles.damageText}>
                  You lost:{'\n'}
                  • {attackState.damage[isWolves ? 'livestock' : 'coins']} {isWolves ? 'livestock' : 'coins'}{'\n'}
                  • {attackState.damage.sp} SP
                </Text>
                
                <Text style={[baseStyles.damageText, { marginTop: 10 }]}>
                  Remaining:{'\n'}
                  • {attackState.damage.remaining[isWolves ? 'livestock' : 'coins']} {isWolves ? 'livestock' : 'coins'}{'\n'}
                  • {attackState.damage.remaining.sp} SP
                </Text>
              </View>

              <TouchableOpacity
                style={baseStyles.continueButton}
                onPress={dismissAttack}
              >
                <Text style={baseStyles.attackButtonText}>
                  Continue Journey
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  // FIXED: Theme Selector Component with properly closed JSX tags
  const ThemeSelector = () => {
    const biblicalTheme = ThemeManager.getCurrentTheme('biblical');
    const medievalTheme = ThemeManager.getCurrentTheme('medieval');

    return (
      <Modal visible={showThemeSelector} transparent animationType="slide">
        <View style={baseStyles.modalOverlay}>
          <View style={[baseStyles.modalContent, { maxHeight: '80%' }]}>
            <Text style={baseStyles.modalTitle}>Select Game Theme</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Biblical Theme Option */}
              <TouchableOpacity
                style={[
                  baseStyles.card,
                  { 
                    backgroundColor: biblicalTheme.colors.surface,
                    borderWidth: currentTheme === 'biblical' ? 3 : 1,
                    borderColor: currentTheme === 'biblical' ? biblicalTheme.colors.success : '#ddd',
                    marginBottom: 15
                  }
                ]}
                onPress={() => changeTheme('biblical')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ fontSize: 24, marginRight: 10 }}>📖</Text>
                  <Text style={[baseStyles.heading3, { color: biblicalTheme.colors.primary }]}>
                    Biblical Theme {currentTheme === 'biblical' ? '✓' : ''}
                  </Text>
                </View>
                
                <Text style={[baseStyles.bodyText, { marginBottom: 10 }]}>
                  Journey through biblical lands with locations like Bethel, Jerusalem, and Mount Sinai. 
                  Answer trivia about biblical characters and their stories.
                </Text>
                
                {/* Color preview */}
                <View style={{ flexDirection: 'row', gap: 5, marginTop: 10 }}>
                  <View style={{ 
                    width: 20, height: 20, 
                    backgroundColor: biblicalTheme.colors.background,
                    borderRadius: 3 
                  }} />
                  <View style={{ 
                    width: 20, height: 20, 
                    backgroundColor: biblicalTheme.colors.boardBackground,
                    borderRadius: 3,
                    borderWidth: 1,
                    borderColor: '#ccc'
                  }} />
                </View>
              </TouchableOpacity>

              {/* Medieval Theme Option */}
              <TouchableOpacity
                style={[
                  baseStyles.card,
                  { 
                    backgroundColor: medievalTheme.colors.surface,
                    borderWidth: currentTheme === 'medieval' ? 3 : 1,
                    borderColor: currentTheme === 'medieval' ? medievalTheme.colors.success : '#ddd',
                    marginBottom: 15
                  }
                ]}
                onPress={() => changeTheme('medieval')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ fontSize: 24, marginRight: 10 }}>🏰</Text>
                  <Text style={[baseStyles.heading3, { color: medievalTheme.colors.primary }]}>
                    Medieval Theme {currentTheme === 'medieval' ? '✓' : ''}
                  </Text>
                </View>
                
                <Text style={[baseStyles.bodyText, { marginBottom: 10 }]}>
                  Explore medieval lands with castles, villages, and monasteries. 
                  Experience the darker atmosphere of the Middle Ages.
                </Text>
                
                {/* Color preview */}
                <View style={{ flexDirection: 'row', gap: 5, marginTop: 10 }}>
                  <View style={{ 
                    width: 20, height: 20, 
                    backgroundColor: medievalTheme.colors.primary,
                    borderRadius: 3 
                  }} />
                  <View style={{ 
                    width: 20, height: 20, 
                    backgroundColor: medievalTheme.colors.secondary,
                    borderRadius: 3 
                  }} />
                  <View style={{ 
                    width: 20, height: 20, 
                    backgroundColor: medievalTheme.colors.background,
                    borderRadius: 3 
                  }} />
                  <View style={{ 
                    width: 20, height: 20, 
                    backgroundColor: medievalTheme.colors.boardBackground,
                    borderRadius: 3,
                    borderWidth: 1,
                    borderColor: '#ccc'
                  }} />
                </View>
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity
              style={[baseStyles.secondaryButton, { marginTop: 15 }]}
              onPress={() => setShowThemeSelector(false)}
            >
              <Text style={baseStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading || !gameConfig) {
    return (
      <View style={[baseStyles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={baseStyles.loadingText}>
          Loading {currentTheme === 'biblical' ? 'Biblical' : 'Medieval'} Game...
        </Text>
      </View>
    );
  }

  return (
    <View style={[baseStyles.gameContainer, { backgroundColor: theme.colors.background }]}>
      <View style={baseStyles.leftPanel}>
        <PlayerManager
          gameState={gameState}
          onUpdateGameState={updateGameState}
          onAddPlayer={addPlayer}
          onRemovePlayer={removePlayer}
          onRollDice={rollDice}
          onEndTurn={endTurn}
          onNewGame={newGame}
          onShowThemeSelector={() => setShowThemeSelector(true)}
          onToggleManualMove={toggleManualMoveMode}
          manualMoveMode={manualMoveMode}
          config={gameConfig}
          currentTheme={currentTheme}
          showOnlyControls={true}

        />
        <CardChoiceModal
      visible={showChoiceModal}
      card={choiceModalCard}
      gameState={gameState}
      gameConfig={gameConfig}
      onChoice={handleCardChoice}
      onCancel={() => {
        setShowChoiceModal(false);
        setChoiceModalCard(null);
      }}
    />
      </View>

      <View style={baseStyles.centerPanel}>
        <View style={baseStyles.gameBoardContainer}>
          <GameBoard
            gameState={gameState}
            config={gameConfig}
            onLocationSelect={handleLocationSelect}
            onUpdateGameState={updateGameState}
            onPlayerMove={manualMoveMode ? handlePlayerMove : null}
            onSpecialSpaceActivate={handleSpecialSpace} // FIXED: Now properly connected
            currentTheme={currentTheme}
          />
          
          {/* CardSystem positioned relative to the game board */}
          <CardSystem
            gameState={gameState}
            onUpdateGameState={updateGameState}
            onDrawCard={drawCard}
            currentTheme={currentTheme}
          />
        </View>
      </View>

      <View style={baseStyles.rightPanel}>
        <TriviaPanel
          gameState={gameState}
          config={gameConfig}
          selectedLocation={gameState.selectedLocation}
          onAnswerQuestion={answerQuestion}
          currentTheme={currentTheme}
        />
      </View>

      <View style={baseStyles.playersPanel}>
        <PlayerManager
          gameState={gameState}
          onUpdateGameState={updateGameState}
          config={gameConfig}
          currentTheme={currentTheme}
          showOnlyPlayers={true}
        />
      </View>

      {/* Attack Modal - FIXED */}
      <AttackModal />

      {/* Theme Selector Modal */}
      <ThemeSelector />
    </View>
  );
};

export default VoyagerGame;