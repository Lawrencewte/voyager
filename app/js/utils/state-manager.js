// js/utils/state-manager.js - Enhanced with position-preserving attack handling, card effects removed

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
      // Basic card decks - simplified without effects
      angelDeck: this.shuffleDeck([...this.getBasicAngelCards()]),
      demonDeck: this.shuffleDeck([...this.getBasicDemonCards()]),
      angelDiscard: [],
      demonDiscard: [],
      selectedLocation: null,
      // Attack state management
      isAttackInProgress: false,
      attackState: {
        isActive: false,
        type: null,
        isRolling: false,
        attackRoll: null,
        damage: null,
        expectedPosition: null
      }
    };
  }

  // Basic card sets without complex effects
  static getBasicAngelCards() {
    return [
      { title: "Abraham's Visitors", scripture: "Genesis 18:1-2", effect: "Gain 3 SP immediately and choose any character to gain 1 point with. Divine visitors bring blessing and revelation.", symbol: "👼" },
      { title: "Angel of the Sacrifice", scripture: "Genesis 22:11-12", effect: "When you would lose SP from any source, this card prevents all loss. Discard after use.", symbol: "🛡️" },
      { title: "Hagar's Comforter", scripture: "Genesis 21:17-19", effect: "Gain 2 SP and recover 1 livestock. The angel provides water in the wilderness.", symbol: "🌊" },
      { title: "Lot's Deliverers", scripture: "Genesis 19:15-16", effect: "Move immediately to any location on the board. Angels lead you to safety before judgment falls.", symbol: "🏃" },
      { title: "Jacob's Ladder", scripture: "Genesis 28:12", effect: "Gain 4 SP. The connection between heaven and earth brings great blessing.", symbol: "🪜" },
      { title: "Burning Bush Angel", scripture: "Exodus 3:2", effect: "Gain 1 Helper immediately from any character, regardless of your points with them. Divine calling transcends normal requirements.", symbol: "🔥" },
      { title: "Balaam's Rebuke", scripture: "Numbers 22:31", effect: "Look at the next character you will encounter. Choose whether to proceed or move to a different location.", symbol: "👁️" },
      { title: "Captain of the Host", scripture: "Joshua 5:14", effect: "Your next encounter with wolves or bandits is automatically won without rolling. Divine authority commands victory.", symbol: "⚔️" },
      { title: "Gideon's Fire", scripture: "Judges 6:21", effect: "For your next 3 turns, gain +1 SP for every correct answer (4 total instead of 3).", symbol: "🔥" },
      { title: "Samson's Announcer", scripture: "Judges 13:3", effect: "Choose a character you have 0-1 points with. Gain 2 points with them immediately. Great purposes require divine announcement.", symbol: "👶" },
      { title: "Elijah's Provider", scripture: "1 Kings 19:5", effect: "Gain 3 SP and recover all lost livestock and coins. God's provision sustains His prophets.", symbol: "🍞" },
      { title: "Elisha's Army", scripture: "2 Kings 6:17", effect: "Immunity to all Demon card effects for the next 4 turns. The mountain is full of horses and chariots of fire.", symbol: "🐎" },
      { title: "Assyrian Destroyer", scripture: "2 Kings 19:35", effect: "All other players lose 2 SP. The angel of the LORD protects His people while judging enemies.", symbol: "⚔️" },
      { title: "Daniel's Guardian", scripture: "Daniel 6:22", effect: "Wolves cannot attack you for the rest of the game. Your faithfulness shuts the lions' mouths.", symbol: "🦁" },
      { title: "Fourth in the Fire", scripture: "Daniel 3:25", effect: "When you would lose SP or offerings, roll a die. On 4-6, you lose nothing. Keep this card permanently.", symbol: "🔥" },
      { title: "Gabriel's Revelation", scripture: "Daniel 8:16", effect: "Look at any other player's SP total, livestock, coins, and helpers. Gain 2 SP from divine insight.", symbol: "📜" },
      { title: "Michael's Protection", scripture: "Daniel 10:13", effect: "Choose another player. They cannot affect you negatively for 3 turns. The prince of Israel defends his people.", symbol: "👑" },
      { title: "Prison Breaker", scripture: "Acts 12:7", effect: "If you land on a space that would cause you to lose a turn or miss moves, ignore the effect. Discard after use.", symbol: "🔗" },
      { title: "Philip's Guide", scripture: "Acts 8:26", effect: "On your next turn, move to any location instead of rolling. Divine guidance leads to great opportunities.", symbol: "🌟" },
      { title: "Birth Announcement", scripture: "Luke 2:13", effect: "All players gain 2 SP. The greatest news brings joy to all people.", symbol: "✨" }
    ];
  }

  static getBasicDemonCards() {
    return [
      { title: "Ancient Serpent", scripture: "Genesis 3:1", effect: "You surely do not need those offerings. Lose half your livestock and half your coins (rounded down). The first lie still deceives.", symbol: "🐍" },
      { title: "Spirit of Murder", scripture: "Genesis 4:7", effect: "Choose another player. They lose 3 SP and you steal 1 SP from them. Sin desires to master and destroy.", symbol: "🗡️" },
      { title: "Evil Spirit of Saul", scripture: "1 Samuel 16:14", effect: "For your next 3 turns, roll a die before answering questions. On 1-3, you cannot use Helper hints or earn Helper points.", symbol: "👑" },
      { title: "Satan's Test of Job", scripture: "Job 1:19", effect: "Lose 2 livestock, 2 coins, and 1 Helper of your choice. Sometimes the righteous suffer to prove their faith.", symbol: "🌪️" },
      { title: "Temptation of Appetite", scripture: "Matthew 4:3", effect: "Turn these stones to bread. Pay 4 SP immediately or lose your next turn. Physical needs distract from spiritual purpose.", symbol: "🍞" },
      { title: "Temptation of Pride", scripture: "Matthew 4:6", effect: "Cast yourself down! Choose: either lose 4 SP or take double damage from your next wolf/bandit encounter.", symbol: "🏔️" },
      { title: "Temptation of Power", scripture: "Matthew 4:9", effect: "All these kingdoms will I give you. Gain 8 SP, but lose all your Helpers. Worldly success costs spiritual relationships.", symbol: "👑" },
      { title: "Legion of Torment", scripture: "Mark 5:9", effect: "My name is Legion, for we are many. Roll two dice and lose that many SP. Spiritual oppression multiplies suffering.", symbol: "👥" },
      { title: "Mute Spirit", scripture: "Matthew 9:32", effect: "You cannot use any Helper hints for your next 3 turns. The spirit of silence prevents testimony and wisdom.", symbol: "🤐" },
      { title: "Blinding Spirit", scripture: "Matthew 12:22", effect: "For your next 2 questions, you cannot see what location you're on when answering. Spiritual blindness hides truth.", symbol: "👁️" },
      { title: "False Prophet Spirit", scripture: "Acts 16:16", effect: "Gain insight into coming doom. All other players lose 2 SP. False prophecy brings confusion and fear.", symbol: "🔮" },
      { title: "Convulsing Spirit", scripture: "Mark 9:18", effect: "Skip your next turn and lose 2 livestock. This kind requires prayer and fasting to overcome.", symbol: "⚡" },
      { title: "Spirit of Eighteen Years", scripture: "Luke 13:16", effect: "For the next 3 turns, you can only earn half SP from correct answers (rounded down). Satan's bonds limit progress.", symbol: "⛓️" },
      { title: "Unclean Spirit", scripture: "Mark 1:23", effect: "Let us alone! You cannot gain Helper points with any character for your next 2 turns. Demons resist holy fellowship.", symbol: "🌊" },
      { title: "Spirit of Greed", scripture: "Acts 19:24", effect: "All players must pay you 1 coin or lose 3 SP. Your choice which they do. False profits exploit God's people.", symbol: "💰" },
      { title: "Deceiving Spirit", scripture: "Acts 19:13", effect: "Jesus I know, Paul I know, but who are you? Lose all points with one Helper of your choice. False authority brings shame.", symbol: "🎭" },
      { title: "Messenger of Satan", scripture: "2 Corinthians 12:7", effect: "Keep this card. At the start of each turn, lose 1 SP, but gain +1 to trivia rolls. Weakness can teach dependence on grace.", symbol: "🌵" },
      { title: "The Great Dragon", scripture: "Revelation 12:9", effect: "All players lose their most valuable resource (count SP value: livestock + coins). The deceiver wages war against all saints.", symbol: "🐉" },
      { title: "Beast of Persecution", scripture: "Revelation 13:7", effect: "Choose a player. They cannot earn SP for 2 turns and you steal 1 of their Helpers. Power wars against the saints.", symbol: "👹" },
      { title: "Lake of Fire", scripture: "Revelation 20:10", effect: "All players must sacrifice 5 SP or lose all their livestock. The final judgment demands everything.", symbol: "🔥" }
    ];
  }

  // Enhanced initializeWithConfig method
  static initializeWithConfig(config) {
    const initialState = this.getInitialState();
    
    // Use config cards if available, otherwise use basic cards
    if (config.angelCards) {
      initialState.angelDeck = this.shuffleDeck([...config.angelCards]);
    }
    if (config.demonCards) {
      initialState.demonDeck = this.shuffleDeck([...config.demonCards]);
    }

    if (config.boardPositions && config.boardPositions[0] && config.boardPositions[0].type === 'location') {
      initialState.selectedLocation = config.boardPositions[0].name;
    }

    return {
      ...initialState,
      config
    };
  }

  // Enhanced updateState method to handle Sets and Maps properly
  static updateState(currentState, updates) {
    const processedUpdates = { ...updates };
    
    // Handle Set and Map objects properly
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
    
    const newState = {
      ...currentState,
      ...processedUpdates
    };
    
    return this.validateState(newState);
  }

  // Updated validateState to use new card arrays
  static validateState(state) {
    const validatedState = { ...state };

    if (!Array.isArray(validatedState.players)) {
      validatedState.players = [];
    }
    // Use basic card arrays
    if (!Array.isArray(validatedState.angelDeck)) {
      validatedState.angelDeck = [...this.getBasicAngelCards()];
    }
    if (!Array.isArray(validatedState.demonDeck)) {
      validatedState.demonDeck = [...this.getBasicDemonCards()];
    }

    if (!(validatedState.answeredQuestions instanceof Set)) {
      validatedState.answeredQuestions = new Set();
    }
    if (!(validatedState.claimedHelpers instanceof Set)) {
      validatedState.claimedHelpers = new Set();
    }

    if (validatedState.currentPlayerIndex >= validatedState.players.length) {
      validatedState.currentPlayerIndex = 0;
    }
    if (validatedState.currentPlayerIndex < 0) {
      validatedState.currentPlayerIndex = 0;
    }

    if (typeof validatedState.turnNumber !== 'number' || validatedState.turnNumber < 1) {
      validatedState.turnNumber = 1;
    }
    if (typeof validatedState.lastRoll !== 'number' || validatedState.lastRoll < 0) {
      validatedState.lastRoll = 0;
    }

    // Validate attack state
    if (!validatedState.attackState || typeof validatedState.attackState !== 'object') {
      validatedState.attackState = {
        isActive: false,
        type: null,
        isRolling: false,
        attackRoll: null,
        damage: null,
        expectedPosition: null
      };
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

  // Player management
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

  // Updated drawCard to handle discard pile properly
  static drawCard(state, cardType) {
    const deckKey = cardType === 'angel' ? 'angelDeck' : 'demonDeck';
    const discardKey = cardType === 'angel' ? 'angelDiscard' : 'demonDiscard';
    
    const deck = state[deckKey];
    const discard = state[discardKey] || []; // Handle undefined discard pile

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
      selectedLocation,
      // Clear any active attacks when ending turn
      attackState: {
        isActive: false,
        type: null,
        isRolling: false,
        attackRoll: null,
        damage: null,
        expectedPosition: null
      },
      isAttackInProgress: false
    });
  }

  static setSelectedLocation(state, locationName) {
    return this.updateState(state, {
      selectedLocation: locationName
    });
  }

  // Attack state management functions
  static initiateAttack(state, attackType, expectedPosition) {
    return this.updateState(state, {
      isAttackInProgress: true,
      attackState: {
        isActive: true,
        type: attackType,
        isRolling: false,
        attackRoll: null,
        damage: null,
        expectedPosition
      }
    });
  }

  static startAttackRoll(state) {
    return this.updateState(state, {
      attackState: {
        ...state.attackState,
        isRolling: true
      }
    });
  }

  static completeAttackRoll(state, attackRoll, damage) {
    return this.updateState(state, {
      attackState: {
        ...state.attackState,
        isRolling: false,
        attackRoll,
        damage
      }
    });
  }

  static dismissAttack(state) {
    return this.updateState(state, {
      isAttackInProgress: false,
      attackState: {
        isActive: false,
        type: null,
        isRolling: false,
        attackRoll: null,
        damage: null,
        expectedPosition: null
      }
    });
  }

  // Position-preserving attack handlers
  static handleWolvesAttack(state, damage, expectedPosition = null) {
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer) {
      throw new Error('No current player');
    }

    // Optional position verification
    if (expectedPosition !== null && currentPlayer.position !== expectedPosition) {
      console.warn(`Position mismatch during wolves attack: expected ${expectedPosition}, actual ${currentPlayer.position}`);
    }

    const livestockLoss = Math.min(currentPlayer.livestock, damage);
    const spLoss = Math.min(currentPlayer.sacrificePoints, damage);

    const updatedPlayers = state.players.map((player, index) => {
      if (index === state.currentPlayerIndex) {
        return {
          ...player,
          // Do NOT modify position - only update resources
          livestock: Math.max(0, player.livestock - damage),
          sacrificePoints: Math.max(0, player.sacrificePoints - damage)
          // position is intentionally omitted to preserve current position
        };
      }
      return player;
    });

    return this.updateState(state, { 
      players: updatedPlayers,
      lastRoll: damage
      // Do not update selectedLocation or position-related state
    });
  }

  static handleBanditsAttack(state, damage, expectedPosition = null) {
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer) {
      throw new Error('No current player');
    }

    // Optional position verification
    if (expectedPosition !== null && currentPlayer.position !== expectedPosition) {
      console.warn(`Position mismatch during bandits attack: expected ${expectedPosition}, actual ${currentPlayer.position}`);
    }

    const coinsLoss = Math.min(currentPlayer.coins, damage);
    const spLoss = Math.min(currentPlayer.sacrificePoints, damage);

    const updatedPlayers = state.players.map((player, index) => {
      if (index === state.currentPlayerIndex) {
        return {
          ...player,
          // Do NOT modify position - only update resources
          coins: Math.max(0, player.coins - damage),
          sacrificePoints: Math.max(0, player.sacrificePoints - damage)
          // position is intentionally omitted to preserve current position
        };
      }
      return player;
    });

    return this.updateState(state, { 
      players: updatedPlayers,
      lastRoll: damage
      // Do not update selectedLocation or position-related state
    });
  }

  // Legacy attack function for backward compatibility
  static handleAttack(state, attackType, damage, expectedPosition = null) {
    if (attackType === 'wolves' || attackType === 'livestock') {
      return this.handleWolvesAttack(state, damage, expectedPosition);
    } else if (attackType === 'bandits' || attackType === 'coins') {
      return this.handleBanditsAttack(state, damage, expectedPosition);
    } else {
      throw new Error(`Unknown attack type: ${attackType}`);
    }
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

  // Position-safe player resource updates
  static updatePlayerResources(state, playerIndex, resourceUpdates) {
    const updatedPlayers = state.players.map((player, index) => {
      if (index === playerIndex) {
        // Only update specified resources, preserve position and other data
        const updatedPlayer = { ...player };
        Object.keys(resourceUpdates).forEach(resource => {
          if (resource !== 'position' && resource !== 'id') {
            updatedPlayer[resource] = resourceUpdates[resource];
          }
        });
        return updatedPlayer;
      }
      return player;
    });

    return this.updateState(state, { players: updatedPlayers });
  }

  // Safe current player resource update
  static updateCurrentPlayerResources(state, resourceUpdates) {
    return this.updatePlayerResources(state, state.currentPlayerIndex, resourceUpdates);
  }

  // Position validation helper
  static validatePlayerPosition(state, playerId, expectedPosition) {
    const player = state.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }
    
    if (player.position !== expectedPosition) {
      console.warn(`Position validation failed: Player ${playerId} expected at ${expectedPosition}, actually at ${player.position}`);
      return false;
    }
    
    return true;
  }

  static saveGame(state, storageKey = 'voyager_game_state') {
    try {
      const serializedState = {
        ...state,
        answeredQuestions: Array.from(state.answeredQuestions),
        claimedHelpers: Array.from(state.claimedHelpers)
      };
      
      // In React Native, you would use AsyncStorage here
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
      players: state.players.map(player => ({ 
        ...player, 
        helpers: { ...player.helpers }
      })),
      answeredQuestions: new Set(state.answeredQuestions),
      claimedHelpers: new Set(state.claimedHelpers),
      angelDeck: [...state.angelDeck],
      demonDeck: [...state.demonDeck],
      angelDiscard: [...(state.angelDiscard || [])], // Handle undefined discard
      demonDiscard: [...(state.demonDiscard || [])], // Handle undefined discard
      attackState: { ...state.attackState }
    };
  }
}

export default StateManager;