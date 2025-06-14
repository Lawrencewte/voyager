// js/utils/state-manager.js - Cleaned up without undo functionality
import { angelCards, demonCards } from '../models/card';

export class StateManager {
  static getInitialState() {
    return {
      players: [],
      currentPlayerIndex: 0,
      turnNumber: 1,
      lastRoll: 0,
      isRolling: false,
      currentCard: null,
      answeredQuestions: new Set(),
      claimedHelpers: new Set(),
      angelDeck: this.shuffleDeck([...angelCards]),
      demonDeck: this.shuffleDeck([...demonCards]),
      angelDiscard: [],
      demonDiscard: [],
      selectedLocation: null, // Track selected location for trivia
    };
  }

  static initializeWithConfig(config) {
    const initialState = this.getInitialState();
    
    // Add any config-specific initialization here
    if (config.angelCards) {
      initialState.angelDeck = this.shuffleDeck([...config.angelCards]);
    }
    if (config.demonCards) {
      initialState.demonDeck = this.shuffleDeck([...config.demonCards]);
    }

    // Set initial selected location if starting location is a trivia location
    if (config.boardPositions && config.boardPositions[0] && config.boardPositions[0].type === 'location') {
      initialState.selectedLocation = config.boardPositions[0].name;
    }

    return initialState;
  }

  static updateState(currentState, updates) {
    const newState = { ...currentState };

    // Apply updates with proper Set handling
    Object.keys(updates).forEach(key => {
      if (key === 'answeredQuestions' || key === 'claimedHelpers') {
        // For Sets, directly assign the new Set object
        newState[key] = updates[key];
      } else {
        newState[key] = updates[key];
      }
    });
    
    // Validate state
    return this.validateState(newState);
  }

  static validateState(state) {
    const validatedState = { ...state };

    // Ensure arrays exist
    if (!Array.isArray(validatedState.players)) {
      validatedState.players = [];
    }
    if (!Array.isArray(validatedState.angelDeck)) {
      validatedState.angelDeck = [...angelCards];
    }
    if (!Array.isArray(validatedState.demonDeck)) {
      validatedState.demonDeck = [...demonCards];
    }

    // Ensure Sets exist - but don't recreate them if they're already Sets
    if (!(validatedState.answeredQuestions instanceof Set)) {
      validatedState.answeredQuestions = new Set();
    }
    if (!(validatedState.claimedHelpers instanceof Set)) {
      validatedState.claimedHelpers = new Set();
    }

    // Validate player index
    if (validatedState.currentPlayerIndex >= validatedState.players.length) {
      validatedState.currentPlayerIndex = 0;
    }
    if (validatedState.currentPlayerIndex < 0) {
      validatedState.currentPlayerIndex = 0;
    }

    // Validate numeric values
    if (typeof validatedState.turnNumber !== 'number' || validatedState.turnNumber < 1) {
      validatedState.turnNumber = 1;
    }
    if (typeof validatedState.lastRoll !== 'number' || validatedState.lastRoll < 0) {
      validatedState.lastRoll = 0;
    }

    return validatedState;
  }

  static shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static addPlayer(state, playerData) {
    if (state.players.length >= 6) {
      throw new Error('Maximum 6 players allowed');
    }

    const newPlayer = {
      id: state.players.length + 1,
      name: playerData.name || `Player ${state.players.length + 1}`,
      position: 0,
      sacrificePoints: 0,
      livestock: 0,
      coins: 0,
      helpers: {},
      color: playerData.color || '#FF4444',
      shape: playerData.shape || '⭐',
      ...playerData
    };

    return this.updateState(state, {
      players: [...state.players, newPlayer]
    });
  }

  static removePlayer(state, playerId) {
    if (state.players.length <= 1) {
      throw new Error('Need at least one player');
    }

    const playerIndex = state.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      throw new Error('Player not found');
    }

    const newPlayers = state.players.filter(p => p.id !== playerId);
    let newCurrentPlayerIndex = state.currentPlayerIndex;

    if (playerIndex <= state.currentPlayerIndex && newCurrentPlayerIndex > 0) {
      newCurrentPlayerIndex--;
    }
    if (newCurrentPlayerIndex >= newPlayers.length) {
      newCurrentPlayerIndex = 0;
    }

    return this.updateState(state, {
      players: newPlayers,
      currentPlayerIndex: newCurrentPlayerIndex
    });
  }

  static updatePlayerStats(state, playerId, stats) {
    const updatedPlayers = state.players.map(player => {
      if (player.id === playerId) {
        return { ...player, ...stats };
      }
      return player;
    });

    return this.updateState(state, { players: updatedPlayers });
  }

  static movePlayer(state, playerId, newPosition, boardSize = 26) {
    const updatedPlayers = state.players.map(player => {
      if (player.id === playerId) {
        const oldPosition = player.position;
        const normalizedPosition = newPosition % boardSize;
        let bonusSP = 0;

        // Check if passed start (position 0)
        if (normalizedPosition < oldPosition || newPosition >= boardSize) {
          bonusSP = 5; // Passing start bonus
        }

        return {
          ...player,
          position: normalizedPosition,
          sacrificePoints: player.sacrificePoints + bonusSP
        };
      }
      return player;
    });

    return this.updateState(state, { players: updatedPlayers });
  }

  static moveCurrentPlayer(state, spaces, config) {
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer) {
      throw new Error('No current player');
    }

    const boardSize = config.boardPositions ? config.boardPositions.length : 26;
    const oldPosition = currentPlayer.position;
    const newPosition = (currentPlayer.position + spaces) % boardSize;
    
    // Check if passed start
    const passedStart = newPosition < oldPosition || (oldPosition + spaces) >= boardSize;
    const bonusSP = passedStart ? 5 : 0;

    const updatedPlayers = state.players.map((player, index) => 
      index === state.currentPlayerIndex 
        ? { 
            ...player, 
            position: newPosition,
            sacrificePoints: player.sacrificePoints + bonusSP
          }
        : player
    );

    // Update selected location for auto-loading trivia
    let selectedLocation = state.selectedLocation;
    if (config.boardPositions && config.boardPositions[newPosition]) {
      const location = config.boardPositions[newPosition];
      if (location.type === 'location') {
        selectedLocation = location.name;
      } else {
        selectedLocation = null; // Clear trivia for special spaces
      }
    }

    return this.updateState(state, { 
      players: updatedPlayers,
      selectedLocation
    });
  }

  static drawCard(state, cardType) {
    const deckKey = cardType === 'angel' ? 'angelDeck' : 'demonDeck';
    const discardKey = cardType === 'angel' ? 'angelDiscard' : 'demonDiscard';
    
    const deck = state[deckKey];
    const discard = state[discardKey];

    if (deck.length === 0) {
      if (discard.length === 0) {
        throw new Error(`No ${cardType} cards available`);
      }
      
      // Reshuffle discard pile
      const newDeck = this.shuffleDeck([...discard]);
      const drawnCard = newDeck.pop();
      
      return this.updateState(state, {
        [deckKey]: newDeck,
        [discardKey]: [],
        currentCard: { ...drawnCard, type: cardType }
      });
    }

    const newDeck = [...deck];
    const drawnCard = newDeck.pop();
    const newDiscard = [...discard, drawnCard];

    return this.updateState(state, {
      [deckKey]: newDeck,
      [discardKey]: newDiscard,
      currentCard: { ...drawnCard, type: cardType }
    });
  }

  static answerQuestion(state, characterName, spAmount, questionId) {
    if (state.answeredQuestions.has(questionId)) {
      throw new Error('Question already answered');
    }

    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer) {
      throw new Error('No current player');
    }

    const updatedPlayers = state.players.map((player, index) => {
      if (index === state.currentPlayerIndex) {
        const updatedHelpers = { ...player.helpers };
        
        // Add helper point only if not already claimed
        if (!state.claimedHelpers.has(characterName)) {
          if (!updatedHelpers[characterName]) {
            updatedHelpers[characterName] = 0;
          }
          updatedHelpers[characterName]++;
        }

        return {
          ...player,
          sacrificePoints: player.sacrificePoints + spAmount,
          helpers: updatedHelpers
        };
      }
      return player;
    });

    const newAnsweredQuestions = new Set(state.answeredQuestions);
    newAnsweredQuestions.add(questionId);

    const newClaimedHelpers = new Set(state.claimedHelpers);
    const updatedPlayer = updatedPlayers[state.currentPlayerIndex];
    if (updatedPlayer.helpers[characterName] === 3 && !newClaimedHelpers.has(characterName)) {
      newClaimedHelpers.add(characterName);
    }

    return this.updateState(state, {
      players: updatedPlayers,
      answeredQuestions: newAnsweredQuestions,
      claimedHelpers: newClaimedHelpers
    });
  }

  static nextTurn(state, config) {
    const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    const nextTurnNumber = nextPlayerIndex === 0 ? state.turnNumber + 1 : state.turnNumber;

    // Update selected location for the new current player
    let selectedLocation = state.selectedLocation;
    if (state.players[nextPlayerIndex] && config.boardPositions) {
      const newCurrentPlayer = state.players[nextPlayerIndex];
      const location = config.boardPositions[newCurrentPlayer.position];
      if (location && location.type === 'location') {
        selectedLocation = location.name;
      } else {
        selectedLocation = null;
      }
    }

    return this.updateState(state, {
      currentPlayerIndex: nextPlayerIndex,
      turnNumber: nextTurnNumber,
      lastRoll: 0,
      selectedLocation
    });
  }

  static setSelectedLocation(state, locationName) {
    return this.updateState(state, {
      selectedLocation: locationName
    });
  }

  static handleAttack(state, attackType, damage) {
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer) {
      throw new Error('No current player');
    }

    const resourceType = attackType === 'wolves' ? 'livestock' : 'coins';
    const resourceLoss = Math.min(currentPlayer[resourceType], damage);
    const spLoss = Math.min(currentPlayer.sacrificePoints, damage);

    const updatedPlayers = state.players.map((player, index) => {
      if (index === state.currentPlayerIndex) {
        return {
          ...player,
          [resourceType]: Math.max(0, player[resourceType] - damage),
          sacrificePoints: Math.max(0, player.sacrificePoints - damage)
        };
      }
      return player;
    });

    return this.updateState(state, { players: updatedPlayers });
  }

  static rollDice(state, config) {
    if (state.isRolling) {
      return state; // Already rolling
    }

    // Start rolling animation
    const rollingState = this.updateState(state, { isRolling: true });

    // This would typically be handled by the component with setTimeout
    // Return the rolling state immediately
    return rollingState;
  }

  static completeDiceRoll(state, roll, config) {
    // Move the current player and update related state
    const movedState = this.moveCurrentPlayer(state, roll, config);
    
    return this.updateState(movedState, {
      lastRoll: roll,
      isRolling: false
    });
  }

  static checkWinCondition(state) {
    const currentPlayer = state.players[state.currentPlayerIndex];
    return currentPlayer && currentPlayer.sacrificePoints >= 40;
  }

  static getPlayersAtPosition(state, position) {
    return state.players.filter(player => player.position === position);
  }

  static getCurrentPlayer(state) {
    return state.players[state.currentPlayerIndex];
  }

  static getCurrentLocation(state, config) {
    const currentPlayer = this.getCurrentPlayer(state);
    if (!currentPlayer || !config.boardPositions) {
      return null;
    }
    return config.boardPositions[currentPlayer.position];
  }

  static getLocationAtPosition(config, position) {
    if (!config.boardPositions || position < 0 || position >= config.boardPositions.length) {
      return null;
    }
    return config.boardPositions[position];
  }

  static saveGame(state, storageKey = 'voyager_game_state') {
    try {
      const serializedState = {
        ...state,
        answeredQuestions: Array.from(state.answeredQuestions),
        claimedHelpers: Array.from(state.claimedHelpers)
      };
      
      // In React Native, you would use AsyncStorage here
      // For now, we'll use a placeholder
      console.log('Game state saved:', serializedState);
      return true;
    } catch (error) {
      console.error('Failed to save game state:', error);
      return false;
    }
  }

  static loadGame(storageKey = 'voyager_game_state') {
    try {
      // In React Native, you would use AsyncStorage here
      // For now, we'll return null to indicate no saved game
      console.log('Loading game state...');
      return null;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  }

  static exportGameState(state) {
    return {
      ...state,
      answeredQuestions: Array.from(state.answeredQuestions),
      claimedHelpers: Array.from(state.claimedHelpers),
      timestamp: new Date().toISOString()
    };
  }

  static importGameState(exportedState) {
    if (!exportedState) {
      throw new Error('No state to import');
    }

    const importedState = {
      ...exportedState,
      answeredQuestions: new Set(exportedState.answeredQuestions || []),
      claimedHelpers: new Set(exportedState.claimedHelpers || [])
    };

    delete importedState.timestamp;
    return this.validateState(importedState);
  }

  static resetGame() {
    return this.getInitialState();
  }

  static cloneState(state) {
    return {
      ...state,
      players: state.players.map(player => ({ ...player, helpers: { ...player.helpers } })),
      answeredQuestions: new Set(state.answeredQuestions),
      claimedHelpers: new Set(state.claimedHelpers),
      angelDeck: [...state.angelDeck],
      demonDeck: [...state.demonDeck],
      angelDiscard: [...state.angelDiscard],
      demonDiscard: [...state.demonDiscard]
    };
  }
}

export default StateManager;