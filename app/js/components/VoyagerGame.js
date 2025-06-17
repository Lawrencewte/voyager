// js/voyager-game.js - Complete fixed version with enhanced Wolves/Bandits attacks and proper JSX
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        // Pass the updated player data and location index to ensure position is preserved
        handleSpecialSpaceAtPosition(location, targetLocationIndex);
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
          // Pass the location and position to ensure we're working with correct data
          handleSpecialSpaceAtPosition(location, newPosition);
        }
      }, 100); // Brief delay to ensure state update is complete
    }, 1000);
  };

  // ENHANCED: New function to handle special spaces while preserving position
  const handleSpecialSpaceAtPosition = (location, positionIndex) => {
    // Get current state to ensure we have the latest data
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Double-check that player is actually at this position
    if (currentPlayer.position !== positionIndex) {
      console.warn(`Position mismatch: player at ${currentPlayer.position}, handling ${positionIndex}`);
      return;
    }

    switch(location.name) {
      case "🐺 WOLVES ATTACK":
      case "🐺 Wolves Attack":
      case "Wolves Attack":
        initiateWolvesAttack(positionIndex);
        break;
      case "⚔️ BANDITS ATTACK":
      case "⚔️ Bandits Attack":
      case "Bandits Attack":
        initiateBanditsAttack(positionIndex);
        break;
      case "👼 ANGEL CARD":
        drawCard('angel');
        break;
      case "👹 DEMON CARD":
        drawCard('demon');
        break;
    }
  };

  // NEW: Enhanced Wolves attack implementation
  const initiateWolvesAttack = (expectedPosition) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Verify player is still at the expected position
    if (currentPlayer.position !== expectedPosition) {
      console.warn(`Position changed during wolves attack. Expected: ${expectedPosition}, Actual: ${currentPlayer.position}`);
    }
    
    // Set up attack state
    setAttackState({
      isActive: true,
      type: 'wolves',
      isRolling: false,
      attackRoll: null,
      damage: null,
      expectedPosition
    });
  };

  const performWolvesAttackRoll = () => {
    // Set rolling state to show dice animation
    setAttackState(prev => ({ ...prev, isRolling: true }));

    // Simulate dice roll animation
    setTimeout(() => {
      const attackRoll = Math.floor(Math.random() * 6) + 1;
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      
      const livestockLoss = Math.min(currentPlayer.livestock, attackRoll);
      const spLoss = Math.min(currentPlayer.sacrificePoints, attackRoll);
      
      // CRITICAL FIX: Only update resources, NEVER touch position
      const updatedPlayers = gameState.players.map((player, index) =>
        index === gameState.currentPlayerIndex
          ? {
              ...player,
              // DO NOT MODIFY POSITION - only update resources
              livestock: Math.max(0, player.livestock - attackRoll),
              sacrificePoints: Math.max(0, player.sacrificePoints - attackRoll)
              // position is intentionally NOT included here
            }
          : player
      );

      // Update game state without touching position
      updateGameState({
        players: updatedPlayers,
        lastRoll: attackRoll
      });

      // Update attack state with results
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
    }, 1000); // 1 second delay to show dice rolling animation
  };

  // NEW: Enhanced Bandits attack implementation
  const initiateBanditsAttack = (expectedPosition) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Verify player is still at the expected position
    if (currentPlayer.position !== expectedPosition) {
      console.warn(`Position changed during bandits attack. Expected: ${expectedPosition}, Actual: ${currentPlayer.position}`);
    }
    
    // Set up attack state
    setAttackState({
      isActive: true,
      type: 'bandits',
      isRolling: false,
      attackRoll: null,
      damage: null,
      expectedPosition
    });
  };

  const performBanditsAttackRoll = () => {
    // Set rolling state to show dice animation
    setAttackState(prev => ({ ...prev, isRolling: true }));

    // Simulate dice roll animation
    setTimeout(() => {
      const attackRoll = Math.floor(Math.random() * 6) + 1;
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      
      const coinsLoss = Math.min(currentPlayer.coins, attackRoll);
      const spLoss = Math.min(currentPlayer.sacrificePoints, attackRoll);
      
      // CRITICAL FIX: Only update resources, NEVER touch position
      const updatedPlayers = gameState.players.map((player, index) =>
        index === gameState.currentPlayerIndex
          ? {
              ...player,
              // DO NOT MODIFY POSITION - only update resources
              coins: Math.max(0, player.coins - attackRoll),
              sacrificePoints: Math.max(0, player.sacrificePoints - attackRoll)
              // position is intentionally NOT included here
            }
          : player
      );

      // Update game state without touching position
      updateGameState({
        players: updatedPlayers,
        lastRoll: attackRoll
      });

      // Update attack state with results
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
    }, 1000); // 1 second delay to show dice rolling animation
  };

  // NEW: Dismiss attack modal
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

  // Legacy function kept for compatibility but redirects to position-aware version
  const handleSpecialSpace = (location) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer) {
      handleSpecialSpaceAtPosition(location, currentPlayer.position);
    }
  };

  // Legacy attack function redirects to new position-aware versions
  const handleAttack = (resourceType, attackerName) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer) return;

    if (resourceType === 'livestock') {
      initiateWolvesAttack(currentPlayer.position);
    } else if (resourceType === 'coins') {
      initiateBanditsAttack(currentPlayer.position);
    }
  };

  const drawCard = (cardType) => {
    const deck = cardType === 'angel' ? gameState.angelDeck : gameState.demonDeck;
    
    if (deck.length === 0) {
      Alert.alert('No Cards', `No ${cardType} cards available!`);
      return;
    }

    const cardIndex = Math.floor(Math.random() * deck.length);
    const card = deck[cardIndex];
    
    updateGameState({
      currentCard: { ...card, type: cardType },
      [cardType === 'angel' ? 'angelDeck' : 'demonDeck']: deck.filter((_, index) => index !== cardIndex)
    });
  };

  const endTurn = () => {
    if (gameState.players.length === 0) return;

    // Exit manual move mode and dismiss any active attacks when ending turn
    setManualMoveMode(false);
    dismissAttack();

    const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    const nextTurnNumber = nextPlayerIndex === 0 ? gameState.turnNumber + 1 : gameState.turnNumber;
    
    // Determine selected location for the new current player
    let selectedLocation = null;
    if (gameState.players[nextPlayerIndex]) {
      const nextPlayer = gameState.players[nextPlayerIndex];
      const location = gameConfig.boardPositions[nextPlayer.position];
      if (location && location.type === 'location') {
        selectedLocation = location.name;
      }
    }

    updateGameState({
      currentPlayerIndex: nextPlayerIndex,
      turnNumber: nextTurnNumber,
      selectedLocation
    });
  };

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

  // NEW: Attack Modal Component
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
      </View>

      <View style={baseStyles.centerPanel}>
        <View style={baseStyles.gameBoardContainer}>
          <GameBoard
            gameState={gameState}
            config={gameConfig}
            onLocationSelect={handleLocationSelect}
            onUpdateGameState={updateGameState}
            onPlayerMove={manualMoveMode ? handlePlayerMove : null}
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

      {/* Attack Modal - NEW */}
      <AttackModal />

      {/* Theme Selector Modal */}
      <ThemeSelector />
    </View>
  );
};

export default VoyagerGame;