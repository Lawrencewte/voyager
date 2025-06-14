// js/components/player-manager.js - Updated with auto-loading trivia support
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

const PlayerManager = ({ 
  gameState, 
  onUpdateGameState, 
  onAddPlayer, 
  onRemovePlayer, 
  onRollDice, 
  onEndTurn, 
  onNewGame,
  config, 
  showOnlyControls = false,    // Add this
  showOnlyPlayers = false  // Add this
}) => {
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FF4444');
  const [selectedShape, setSelectedShape] = useState('⭐');
  
  // Refs for auto-scrolling
  const playersScrollViewRef = useRef(null);
  const playerRefs = useRef({});

  const colors = [
    '#FF4444', '#4444FF', '#44FF44', '#FFAA00', '#FF6B6B', '#4ECDC4',
    '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD',
    '#00D2D3', '#FF6348', '#2ED573', '#FFA502'
  ];

  const shapes = [
    '⭐', '🎯', '🛡️', '⚔️', '👑', '🏺', '📿', '🕊️',
    '🔥', '💎', '🌟', '🏆', '🎪', '🎭', '🎨', '🎵'
  ];

  const handleAddPlayer = () => {
    if (gameState.players.length >= 6) {
      Alert.alert('Maximum Players', 'Maximum 6 players allowed!');
      return;
    }
    setShowPlayerModal(true);
  };

  const confirmAddPlayer = () => {
    const playerName = newPlayerName.trim() || `Player ${gameState.players.length + 1}`;
    
    if (gameState.players.some(p => p.name === playerName)) {
      Alert.alert('Duplicate Name', 'A player with this name already exists!');
      return;
    }

    onAddPlayer({
      name: playerName,
      color: selectedColor,
      shape: selectedShape
    });

    setNewPlayerName('');
    setSelectedColor('#FF4444');
    setSelectedShape('⭐');
    setShowPlayerModal(false);
  };

  const updatePlayerStat = (playerIndex, stat, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    const updatedPlayers = gameState.players.map((player, index) =>
      index === playerIndex ? { ...player, [stat]: numValue } : player
    );

    onUpdateGameState({ players: updatedPlayers });

    if (stat === 'sacrificePoints' && numValue >= 40) {
      setTimeout(() => {
        Alert.alert('Winner!', `🎉 ${gameState.players[playerIndex].name} wins! 🎉`);
      }, 100);
    }
  };

  const handleRollDice = () => {
    if (gameState.isRolling || gameState.players.length === 0) return;
    onRollDice();
  };

  const handleEndTurn = () => {
    if (gameState.players.length === 0) return;
    onEndTurn();
  };

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const currentLocation = config?.boardPositions?.[currentPlayer?.position];

  // Auto-scroll to current player when turn changes
  useEffect(() => {
    if (gameState.players.length > 0 && playersScrollViewRef.current && gameState.currentPlayerIndex !== undefined) {
      const currentPlayerId = gameState.players[gameState.currentPlayerIndex]?.id;
      const currentPlayerRef = playerRefs.current[currentPlayerId];
      
      if (currentPlayerRef) {
        // Small delay to ensure the UI has updated
        setTimeout(() => {
          currentPlayerRef.measureLayout(
            playersScrollViewRef.current.getInnerViewNode(),
            (x, y, width, height) => {
              playersScrollViewRef.current?.scrollTo({
                y: Math.max(0, y - 50), // Scroll with some padding above
                animated: true
              });
            },
            () => {
              // Fallback if measureLayout fails - scroll to approximate position
              const playerHeight = 120; // Approximate height of each player section
              const scrollPosition = gameState.currentPlayerIndex * playerHeight;
              playersScrollViewRef.current?.scrollTo({
                y: Math.max(0, scrollPosition - 50),
                animated: true
              });
            }
          );
        }, 100);
      }
    }
  }, [gameState.currentPlayerIndex, gameState.players.length]);

  // Clear player refs when players change
  useEffect(() => {
    const currentPlayerIds = new Set(gameState.players.map(p => p.id));
    // Remove refs for players that no longer exist
    Object.keys(playerRefs.current).forEach(playerId => {
      if (!currentPlayerIds.has(parseInt(playerId))) {
        delete playerRefs.current[playerId];
      }
    });
  }, [gameState.players]);

  return (
    <View style={styles.container}>
      {/* Show controls section only if showOnlyControls is true or neither flag is set */}
      {(showOnlyControls || (!showOnlyControls && !showOnlyPlayers)) && (
        <>
          <Text style={styles.panelTitle}>🎮 Game Controls</Text>
          
          {/* Control Buttons */}
          <View style={styles.controlButtons}>
            <TouchableOpacity style={styles.controlButton} onPress={onNewGame}>
              <Text style={styles.controlButtonText}>New Game</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={handleAddPlayer}>
              <Text style={styles.controlButtonText}>Add Player</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={onRemovePlayer}>
              <Text style={styles.controlButtonText}>Remove Player</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={() => setShowRulesModal(true)}>
              <Text style={styles.controlButtonText}>Rules</Text>
            </TouchableOpacity>
          </View>

          {/* Current Turn Info */}
          <View style={styles.turnInfo}>
            <Text style={styles.turnTitle}>Current Turn</Text>
            <Text style={styles.currentPlayerText}>{currentPlayer?.name || 'No Players'}</Text>
            <Text style={styles.turnNumber}>Turn {gameState.turnNumber}</Text>
          </View>

          {/* Dice Container */}
          <View style={styles.diceContainer}>
            <TouchableOpacity 
              style={[styles.dice, gameState.isRolling && styles.rollingDice]} 
              onPress={handleRollDice}
              disabled={gameState.isRolling || gameState.players.length === 0}
            >
              <Text style={styles.diceText}>
                {gameState.lastRoll || '🎲'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.rollButton, 
                (gameState.isRolling || gameState.players.length === 0) && styles.disabledButton
              ]} 
              onPress={handleRollDice}
              disabled={gameState.isRolling || gameState.players.length === 0}
            >
              <Text style={styles.rollButtonText}>Roll Dice</Text>
            </TouchableOpacity>
            {gameState.lastRoll > 0 && (
              <Text style={styles.lastRoll}>Rolled: {gameState.lastRoll}</Text>
            )}
          </View>

          {/* Current Location */}
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Current Location</Text>
            <Text style={styles.currentLocation}>{currentLocation?.name || 'Your Village'}</Text>
            <Text style={styles.locationDescription}>
              {currentLocation?.description || 'Starting space - collect 5 SP when passing'}
            </Text>
          </View>

          {/* End Turn Button */}
          <TouchableOpacity 
            style={[styles.endTurnButton, gameState.players.length === 0 && styles.disabledButton]} 
            onPress={handleEndTurn}
            disabled={gameState.players.length === 0}
          >
            <Text style={styles.endTurnButtonText}>End Turn</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Show players section only if showOnlyPlayers is true or neither flag is set */}
      {(showOnlyPlayers || (!showOnlyControls && !showOnlyPlayers)) && (
        <>
          {/* Only show title if this is a dedicated players panel */}
          {showOnlyPlayers && <Text style={styles.panelTitle}>👥 Players</Text>}
          
          {/* Players List */}
          <ScrollView 
            ref={playersScrollViewRef}
            style={styles.playersScrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.playersScrollContent}
          >
            {!showOnlyPlayers && <Text style={styles.playersTitle}>👥 Players</Text>}
            {gameState.players.length === 0 ? (
              <View style={styles.noPlayersContainer}>
                <Text style={styles.noPlayersText}>No players yet. Add a player to start!</Text>
              </View>
            ) : (
              gameState.players.map((player, index) => (
                <View 
                  key={player.id} 
                  ref={(ref) => {
                    if (ref) {
                      playerRefs.current[player.id] = ref;
                    }
                  }}
                  style={[
                    styles.playerSection,
                    index === gameState.currentPlayerIndex && styles.activePlayerSection
                  ]}
                >
                  <View style={styles.playerHeader}>
                    <View style={[styles.playerColorIndicator, { backgroundColor: player.color }]} />
                    <Text style={styles.playerName}>{player.name}</Text>
                    {player.shape && (
                      <Text style={styles.playerShape}>{player.shape}</Text>
                    )}
                  </View>

                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Position:</Text>
                    <Text style={styles.statValue} numberOfLines={1} ellipsizeMode="tail">
                      {config?.boardPositions?.[player.position]?.name || 'Unknown'}
                    </Text>
                  </View>

                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>SP:</Text>
                    <TextInput
                      style={styles.statInput}
                      value={player.sacrificePoints.toString()}
                      onChangeText={(value) => updatePlayerStat(index, 'sacrificePoints', value)}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Livestock:</Text>
                    <TextInput
                      style={styles.statInput}
                      value={player.livestock.toString()}
                      onChangeText={(value) => updatePlayerStat(index, 'livestock', value)}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Coins:</Text>
                    <TextInput
                      style={styles.statInput}
                      value={player.coins.toString()}
                      onChangeText={(value) => updatePlayerStat(index, 'coins', value)}
                      keyboardType="numeric"
                    />
                  </View>

                  {/* Helpers Section - Simplified for space */}
                  <View style={styles.helperSection}>
                    <Text style={styles.helperTitle}>Helpers:</Text>
                    <View style={styles.helperList}>
                      {Object.keys(player.helpers).length > 0 ? (
                        Object.keys(player.helpers).map(helperName => (
                          <View key={helperName} style={styles.helperItem}>
                            <Text style={styles.helperName} numberOfLines={1}>{helperName}</Text>
                            <Text style={styles.helperPoints}>
                              {player.helpers[helperName]}/3 {player.helpers[helperName] >= 3 ? '✅' : ''}
                            </Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.noHelpersText}>No helpers yet</Text>
                      )}
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </>
      )}

      {/* Modals - always show regardless of flags */}
      {/* Player Creation Modal */}
      <Modal
        visible={showPlayerModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPlayerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎭 Add New Player</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Player Name:</Text>
              <TextInput
                style={styles.textInput}
                value={newPlayerName}
                onChangeText={setNewPlayerName}
                placeholder="Enter your name..."
                maxLength={15}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Choose Marker Color:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.colorPicker}>
                  {colors.map(color => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color && styles.selectedOption
                      ]}
                      onPress={() => setSelectedColor(color)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Choose Marker Shape:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.shapePicker}>
                  {shapes.map(shape => (
                    <TouchableOpacity
                      key={shape}
                      style={[
                        styles.shapeOption,
                        selectedShape === shape && styles.selectedShapeOption
                      ]}
                      onPress={() => setSelectedShape(shape)}
                    >
                      <Text style={styles.shapeText}>{shape}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPlayerModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmAddPlayer}
              >
                <Text style={styles.modalButtonText}>Add Player</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rules Modal */}
      <Modal
        visible={showRulesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRulesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.rulesModalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.rulesTitle}>🎯 Voyager Game Rules</Text>
              
              <View style={styles.rulesSection}>
                <Text style={styles.rulesSectionTitle}>🎯 Objective</Text>
                <Text style={styles.rulesText}>
                  You're an Israelite journeying to Jerusalem to make your annual sacrifice. After disaster strikes your prepared offerings, you must earn new sacrificial offerings along the way. <Text style={styles.bold}>First player to reach 40 Sacrifice Points wins!</Text>
                </Text>
              </View>

              <View style={styles.rulesSection}>
                <Text style={styles.rulesSectionTitle}>🎲 Basic Gameplay</Text>
                <Text style={styles.rulesText}>
                  • Players start at "Your Village" with 0 Sacrifice Points (SP){'\n'}
                  • Roll the die to move around the board clockwise{'\n'}
                  • Answer trivia questions at biblical locations to earn SP{'\n'}
                  • Redeem SP for livestock and coins as offerings{'\n'}
                  • Pass "Your Village" to gain 5 SP
                </Text>
              </View>

              <View style={styles.rulesSection}>
                <Text style={styles.rulesSectionTitle}>📚 Trivia Questions</Text>
                <Text style={styles.rulesText}>
                  • <Text style={styles.bold}>Correct Answer:</Text> 3 SP{'\n'}
                  • <Text style={styles.bold}>With Helper Hint:</Text> 2 SP (if you have that character as a helper){'\n'}
                  • <Text style={styles.bold}>Don't Know:</Text> 1 SP{'\n'}
                  • Each question can only be answered once per game{'\n'}
                  • Answered questions become greyed out
                </Text>
              </View>

              <View style={styles.rulesSection}>
                <Text style={styles.rulesSectionTitle}>👥 Helpers</Text>
                <Text style={styles.rulesText}>
                  Answer 3 questions from the same biblical character to recruit them as a Helper. Helpers provide hints for questions at their locations. Only one player can have each Helper - first to recruit them claims them permanently.
                </Text>
              </View>

              <View style={styles.rulesSection}>
                <Text style={styles.rulesSectionTitle}>⚡ Special Spaces</Text>
                <Text style={styles.rulesText}>
                  • <Text style={styles.bold}>🐺 Wolves Attack:</Text> Roll die, lose that many livestock and SP{'\n'}
                  • <Text style={styles.bold}>⚔️ Bandits Attack:</Text> Roll die, lose that many coins and SP{'\n'}
                  • <Text style={styles.bold}>👼 Angel Cards:</Text> Beneficial effects and blessings{'\n'}
                  • <Text style={styles.bold}>👹 Demon Cards:</Text> Challenges and setbacks
                </Text>
              </View>

              <View style={styles.rulesSection}>
                <Text style={styles.rulesSectionTitle}>🏆 Winning</Text>
                <Text style={styles.rulesText}>
                  First player to accumulate <Text style={styles.bold}>40 Sacrifice Points</Text> wins the game! Plan your journey wisely and may the Lord bless your pilgrimage!
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeRulesButton}
              onPress={() => setShowRulesModal(false)}
            >
              <Text style={styles.closeRulesButtonText}>Close Rules</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const isSmallScreen = width < 768;
const scaleFactor = isSmallScreen ? 0.8 : 1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15 * scaleFactor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  panelTitle: {
    fontSize: Math.max(16, 18 * scaleFactor),
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 15 * scaleFactor,
    borderBottomWidth: 2,
    borderBottomColor: '#8B4513',
    paddingBottom: 8 * scaleFactor,
  },
  controlButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15 * scaleFactor,
    gap: 8 * scaleFactor,
  },
  controlButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10 * scaleFactor,
    paddingHorizontal: 12 * scaleFactor,
    borderRadius: 6,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  controlButtonText: {
    color: 'white',
    fontSize: Math.max(11, 12 * scaleFactor),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  turnInfo: {
    backgroundColor: '#FFD700',
    padding: 12 * scaleFactor,
    borderRadius: 8,
    marginBottom: 15 * scaleFactor,
    borderWidth: 2,
    borderColor: '#8B4513',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  turnTitle: {
    fontSize: Math.max(14, 16 * scaleFactor),
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 5 * scaleFactor,
  },
  currentPlayerText: {
    fontSize: Math.max(12, 14 * scaleFactor),
    color: '#8B4513',
    marginBottom: 3 * scaleFactor,
  },
  turnNumber: {
    fontSize: Math.max(10, 11 * scaleFactor),
    color: '#8B4513',
  },
  diceContainer: {
    alignItems: 'center',
    marginBottom: 15 * scaleFactor,
  },
  dice: {
    width: 60 * scaleFactor,
    height: 60 * scaleFactor,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#8B4513',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8 * scaleFactor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  rollingDice: {
    transform: [{ rotate: '45deg' }],
  },
  diceText: {
    fontSize: Math.max(24, 28 * scaleFactor),
    fontWeight: 'bold',
    color: '#8B4513',
  },
  rollButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10 * scaleFactor,
    paddingHorizontal: 20 * scaleFactor,
    borderRadius: 8,
    marginBottom: 8 * scaleFactor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  rollButtonText: {
    color: 'white',
    fontSize: Math.max(12, 14 * scaleFactor),
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  lastRoll: {
    fontSize: Math.max(10, 12 * scaleFactor),
    fontWeight: 'bold',
    color: '#8B4513',
  },
  locationInfo: {
    backgroundColor: '#e8f5e8',
    padding: 12 * scaleFactor,
    borderRadius: 8,
    marginBottom: 15 * scaleFactor,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  locationTitle: {
    fontSize: Math.max(12, 14 * scaleFactor),
    fontWeight: 'bold',
    color: '#2d5a2d',
    marginBottom: 5 * scaleFactor,
  },
  currentLocation: {
    fontSize: Math.max(11, 13 * scaleFactor),
    color: '#2d5a2d',
    marginBottom: 3 * scaleFactor,
    fontWeight: '600',
  },
  locationDescription: {
    fontSize: Math.max(9, 11 * scaleFactor),
    color: '#2d5a2d',
    fontStyle: 'italic',
    lineHeight: Math.max(12, 14 * scaleFactor),
  },
  endTurnButton: {
    backgroundColor: '#2196F3',
    padding: 12 * scaleFactor,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15 * scaleFactor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  endTurnButtonText: {
    color: 'white',
    fontSize: Math.max(12, 14 * scaleFactor),
    fontWeight: 'bold',
  },
  playersScrollView: {
    flex: 1,
  },
  playersScrollContent: {
    paddingBottom: 20 * scaleFactor, // Add some bottom padding for better scrolling
  },
  playersTitle: {
    fontSize: Math.max(14, 16 * scaleFactor),
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 10 * scaleFactor,
    textAlign: 'center',
  },
  noPlayersContainer: {
    padding: 20 * scaleFactor,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  noPlayersText: {
    fontSize: Math.max(12, 14 * scaleFactor),
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  playerSection: {
    marginBottom: 12 * scaleFactor,
    padding: 12 * scaleFactor,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activePlayerSection: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e8',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.2,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8 * scaleFactor,
  },
  playerColorIndicator: {
    width: 18 * scaleFactor,
    height: 18 * scaleFactor,
    borderRadius: 9 * scaleFactor,
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 8 * scaleFactor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  playerName: {
    fontSize: Math.max(12, 14 * scaleFactor),
    fontWeight: 'bold',
    color: '#8B4513',
    flex: 1,
  },
  playerShape: {
    fontSize: Math.max(14, 16 * scaleFactor),
    marginLeft: 8 * scaleFactor,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4 * scaleFactor,
  },
  statLabel: {
    fontSize: Math.max(10, 12 * scaleFactor),
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  statValue: {
    fontSize: Math.max(10, 12 * scaleFactor),
    color: '#333',
    flex: 1,
    textAlign: 'right',
    fontWeight: '600',
  },
  statInput: {
    width: 60 * scaleFactor,
    padding: 6 * scaleFactor,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    textAlign: 'center',
    fontSize: Math.max(10, 12 * scaleFactor),
    backgroundColor: 'white',
    fontWeight: 'bold',
  },
  helperSection: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 8 * scaleFactor,
    borderRadius: 8,
    marginTop: 8 * scaleFactor,
  },
  helperTitle: {
    fontSize: Math.max(10, 12 * scaleFactor),
    fontWeight: 'bold',
    marginBottom: 6 * scaleFactor,
    color: '#333',
  },
  helperList: {
    maxHeight: 60 * scaleFactor,
  },
  helperItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2 * scaleFactor,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  helperName: {
    fontSize: Math.max(9, 11 * scaleFactor),
    flex: 1,
    color: '#333',
    marginRight: 8,
  },
  helperPoints: {
    fontSize: Math.max(9, 11 * scaleFactor),
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  noHelpersText: {
    fontSize: Math.max(9, 11 * scaleFactor),
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    paddingVertical: 8 * scaleFactor,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fefefe',
    borderRadius: 15,
    padding: 20 * scaleFactor,
    width: isSmallScreen ? '95%' : '90%',
    maxWidth: 500,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  rulesModalContent: {
    backgroundColor: '#fefefe',
    borderRadius: 15,
    padding: 25 * scaleFactor,
    width: isSmallScreen ? '95%' : '90%',
    maxWidth: 600,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: Math.max(18, 20 * scaleFactor),
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 20 * scaleFactor,
    borderBottomWidth: 2,
    borderBottomColor: '#8B4513',
    paddingBottom: 10 * scaleFactor,
  },
  formGroup: {
    marginBottom: 15 * scaleFactor,
  },
  label: {
    fontSize: Math.max(12, 14 * scaleFactor),
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 5 * scaleFactor,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10 * scaleFactor,
    fontSize: Math.max(14, 16 * scaleFactor),
    backgroundColor: 'white',
  },
  colorPicker: {
    flexDirection: 'row',
    gap: 10 * scaleFactor,
    paddingVertical: 10 * scaleFactor,
  },
  colorOption: {
    width: 35 * scaleFactor,
    height: 35 * scaleFactor,
    borderRadius: 17.5 * scaleFactor,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  selectedOption: {
    borderColor: '#8B4513',
    borderWidth: 4,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  shapePicker: {
    flexDirection: 'row',
    gap: 10 * scaleFactor,
    paddingVertical: 10 * scaleFactor,
  },
  shapeOption: {
    width: 45 * scaleFactor,
    height: 45 * scaleFactor,
    borderWidth: 3,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  selectedShapeOption: {
    borderColor: '#8B4513',
    borderWidth: 4,
    backgroundColor: '#e8f5e8',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  shapeText: {
    fontSize: Math.max(16, 20 * scaleFactor),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20 * scaleFactor,
    gap: 10 * scaleFactor,
  },
  modalButton: {
    paddingVertical: 12 * scaleFactor,
    paddingHorizontal: 20 * scaleFactor,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: 'white',
    fontSize: Math.max(14, 16 * scaleFactor),
    fontWeight: 'bold',
  },
  // Rules Modal Styles
  rulesTitle: {
    fontSize: Math.max(20, 24 * scaleFactor),
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 20 * scaleFactor,
    borderBottomWidth: 3,
    borderBottomColor: '#8B4513',
    paddingBottom: 15 * scaleFactor,
  },
  rulesSection: {
    marginBottom: 18 * scaleFactor,
  },
  rulesSectionTitle: {
    fontSize: Math.max(16, 18 * scaleFactor),
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8 * scaleFactor,
    borderLeftWidth: 4,
    borderLeftColor: '#8B4513',
    paddingLeft: 10 * scaleFactor,
  },
  rulesText: {
    fontSize: Math.max(12, 14 * scaleFactor),
    lineHeight: Math.max(16, 20 * scaleFactor),
    color: '#333',
    marginBottom: 6 * scaleFactor,
  },
  bold: {
    fontWeight: 'bold',
  },
  closeRulesButton: {
    backgroundColor: '#8B4513',
    padding: 15 * scaleFactor,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20 * scaleFactor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  closeRulesButtonText: {
    color: 'white',
    fontSize: Math.max(14, 16 * scaleFactor),
    fontWeight: 'bold',
  },
});

export default PlayerManager;