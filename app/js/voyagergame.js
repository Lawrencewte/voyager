// js/voyager-game.js - Updated with auto-loading trivia (undo feature removed)
import { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import CardSystem from './components/card-system';
import GameBoard from './components/game-board';
import PlayerManager from './components/player-manager';
import TriviaPanel from './components/trivia-panel';
import { DataLoader } from './utils/data-loader';
import { StateManager } from './utils/state-manager';
import { ThemeManager } from './utils/theme-manager';
const { width, height } = Dimensions.get('window');

// Define base styles outside the component with better proportions
const baseStyles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2E8B57',
    padding: 2,        // Reduced from 15
    gap: 2,             // Reduced from 15
  },
  leftPanel: {
    width: Math.max(240, width * 0.16),   // Smaller
    minWidth: 220,
  },
  centerPanel: {
    flex: 1,
    minWidth: 350,      // Reduced from 400
  },
  playersPanel: {
    width: Math.max(260, width * 0.18),   // Smaller
    minWidth: 240,
  },
  rightPanel: {
    width: Math.max(280, width * 0.20),   // Smaller
    minWidth: 260,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E8B57',
  },
});

const VoyagerGame = () => {
  const [gameState, setGameState] = useState(StateManager.getInitialState());
  const [gameConfig, setGameConfig] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('biblical');
  const [loading, setLoading] = useState(true);

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

  const initializeGame = async () => {
    try {
      // Load game configuration
      const config = await DataLoader.loadThemeConfig(currentTheme);
      setGameConfig(config);
      
      // Initialize state with config
      const initialState = StateManager.initializeWithConfig(config);
      setGameState(initialState);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to initialize game:', error);
      Alert.alert('Error', 'Failed to load game configuration');
    }
  };

  const updateGameState = (updates) => {
    setGameState(prevState => {
      const newState = StateManager.updateState(prevState, updates);
      return newState;
    });
  };

  const rollDice = () => {
    if (gameState.isRolling || gameState.players.length === 0) return;

    updateGameState({ isRolling: true });

    // Simulate dice roll animation delay
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      
      // Move player
      const oldPosition = currentPlayer.position;
      const newPosition = (currentPlayer.position + roll) % gameConfig.boardPositions.length;
      const passedStart = newPosition < oldPosition || (oldPosition + roll) >= gameConfig.boardPositions.length;
      
      let sacrificePointsBonus = 0;
      if (passedStart) {
        sacrificePointsBonus = 5;
        Alert.alert('Passed Start!', `${currentPlayer.name} gained 5 SP!`);
      }

      const updatedPlayers = gameState.players.map((player, index) => 
        index === gameState.currentPlayerIndex 
          ? { 
              ...player, 
              position: newPosition,
              sacrificePoints: player.sacrificePoints + sacrificePointsBonus
            }
          : player
      );

      // Determine selected location for auto-loading trivia
      const location = gameConfig.boardPositions[newPosition];
      const selectedLocation = location && location.type === 'location' ? location.name : null;

      updateGameState({
        lastRoll: roll,
        isRolling: false,
        players: updatedPlayers,
        selectedLocation
      });

      // Handle special spaces after a brief delay
      setTimeout(() => {
        if (location.type === 'special') {
          handleSpecialSpace(location);
        }
      }, 500);
    }, 1000);
  };

  const handleSpecialSpace = (location) => {
    switch(location.name) {
      case "🐺 WOLVES ATTACK":
        handleAttack('livestock', '🐺 Wolves');
        break;
      case "⚔️ BANDITS ATTACK":
        handleAttack('coins', '⚔️ Bandits');
        break;
      case "👼 ANGEL CARD":
        drawCard('angel');
        break;
      case "👹 DEMON CARD":
        drawCard('demon');
        break;
    }
  };

  const handleAttack = (resourceType, attackerName) => {
    const attackRoll = Math.floor(Math.random() * 6) + 1;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    const resourceLoss = Math.min(currentPlayer[resourceType], attackRoll);
    const spLoss = Math.min(currentPlayer.sacrificePoints, attackRoll);
    
    updateGameState({
      players: gameState.players.map((player, index) =>
        index === gameState.currentPlayerIndex
          ? {
              ...player,
              [resourceType]: Math.max(0, player[resourceType] - attackRoll),
              sacrificePoints: Math.max(0, player.sacrificePoints - attackRoll)
            }
          : player
      )
    });

    Alert.alert(
      `${attackerName} Attack!`,
      `Rolled ${attackRoll}! You lost ${resourceLoss} ${resourceType} and ${spLoss} SP.`
    );
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
      'Start a new game? This will reset all progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'New Game', 
          onPress: () => {
            const newState = StateManager.getInitialState();
            setGameState(newState);
            initializeGame();
          }
        }
      ]
    );
  };

  // Get theme styles, but fallback to base styles if theme isn't loaded yet
  const styles = gameConfig ? ThemeManager.getStyles(currentTheme) : baseStyles;

  if (loading || !gameConfig) {
    return (
      <View style={baseStyles.loadingContainer}>
        {/* Add loading spinner here */}
      </View>
    );
  }

  return (
    <View style={[baseStyles.gameContainer]}>
      <View style={baseStyles.leftPanel}>
        <PlayerManager
          gameState={gameState}
          onUpdateGameState={updateGameState}
          onAddPlayer={addPlayer}
          onRemovePlayer={removePlayer}
          onRollDice={rollDice}
          onEndTurn={endTurn}
          onNewGame={newGame}
          config={gameConfig}
          showOnlyControls={true}
        />
      </View>

      <View style={baseStyles.centerPanel}>
        <GameBoard
          gameState={gameState}
          config={gameConfig}
          onLocationSelect={handleLocationSelect}
          onUpdateGameState={updateGameState}
        />
      </View>

      <View style={baseStyles.playersPanel}>
        <PlayerManager
          gameState={gameState}
          onUpdateGameState={updateGameState}
          config={gameConfig}
          showOnlyPlayers={true}
        />
      </View>

      <View style={baseStyles.rightPanel}>
        <TriviaPanel
          gameState={gameState}
          config={gameConfig}
          selectedLocation={gameState.selectedLocation}
          onAnswerQuestion={answerQuestion}
        />
      </View>

      <CardSystem
        gameState={gameState}
        onUpdateGameState={updateGameState}
        onDrawCard={drawCard}
      />
    </View>
  );
};

export default VoyagerGame;