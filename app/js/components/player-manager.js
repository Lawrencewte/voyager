// js/components/player-manager.js - Enhanced with manual helper management
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// Add this import at the top with your other imports
import ActiveCardsDisplay from './ActiveCardsDisplay'; // Adjust the path as necessary  


const { width } = Dimensions.get('window');

const PlayerManager = ({ 
  gameState = {},
  onUpdateGameState = () => {},
  onAddPlayer = () => {},
  onRemovePlayer = () => {},
  onRollDice = () => {},
  onEndTurn = () => {},
  onNewGame = () => {},
  onShowThemeSelector = null,
  onToggleManualMove = null,
  manualMoveMode = false,
  config = {},
  currentTheme = 'biblical',
  showOnlyControls = false,
  showOnlyPlayers = false
}) => {
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showHelperModal, setShowHelperModal] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FF4444');
  const [selectedShape, setSelectedShape] = useState('⭐');
  const [newHelperName, setNewHelperName] = useState('');
  const [selectedHelper, setSelectedHelper] = useState('');
  
  // Refs for auto-scrolling
  const playersScrollViewRef = useRef(null);
  const playerRefs = useRef({});

  // Animation state for dice
  const rotateValue = useRef(new Animated.Value(0)).current;

  const colors = [
    '#FF4444', '#4444FF', '#44FF44', '#FFAA00', '#FF6B6B', '#4ECDC4',
    '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD',
    '#00D2D3', '#FF6348', '#2ED573', '#FFA502'
  ];

  const shapes = [
    '⭐', '🎯', '🛡️', '⚔️', '👑', '🏺', '📿', '🕊️',
    '🔥', '💎', '🌟', '🏆', '🎪', '🎭', '🎨', '🎵'
  ];

  // Available helpers for manual adding - comprehensive biblical character list
  const availableHelpers = [
    "Abraham", "Sarah", "Isaac", "Rebecca", "Jacob", "Rachel", "Leah", "Joseph",
    "Moses", "Aaron", "Miriam", "Joshua", "Caleb", "Rahab", "Deborah", "Gideon",
    "Samson", "Ruth", "Samuel", "Saul", "David", "Solomon", "Elijah", "Elisha",
    "Isaiah", "Jeremiah", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah",
    "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Ezra", "Nehemiah", "Esther", "Mordecai", "Job", "Noah", "Enoch", "Melchizedek",
    "Hagar", "Lot", "Laban", "Eli", "Hannah", "Nathan", "Bathsheba", "Absalom",
    "Joab", "Abigail", "Mary", "Martha", "Lazarus", "John the Baptist", "Peter",
    "Paul", "Barnabas", "Timothy", "Silas", "Luke", "Mark", "Matthew", "John",
    "James", "Andrew", "Philip", "Thomas", "Bartholomew", "Simon", "Judas Iscariot",
    "Matthias", "Stephen", "Philip the Evangelist", "Cornelius", "Lydia", "Priscilla",
    "Aquila", "Apollos", "Titus", "Philemon", "Onesimus"
  ].sort();

  // Safe access to gameState properties
  const players = gameState?.players || [];
  const currentPlayerIndex = gameState?.currentPlayerIndex || 0;
  const turnNumber = gameState?.turnNumber || 1;
  const lastRoll = gameState?.lastRoll || 0;
  const isRolling = gameState?.isRolling || false;

  const handleAddPlayer = () => {
    if (players.length >= 6) {
      Alert.alert('Maximum Players', 'Maximum 6 players allowed!');
      return;
    }
    setShowPlayerModal(true);
  };

  const confirmAddPlayer = () => {
    const playerName = newPlayerName.trim() || `Player ${players.length + 1}`;
    
    if (players.some(p => p?.name === playerName)) {
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

  // Manual helper management functions
  const openHelperModal = (playerIndex) => {
    setSelectedPlayerIndex(playerIndex);
    setSelectedHelper('');
    setNewHelperName('');
    setShowHelperModal(true);
  };

  const addHelperToPlayer = () => {
    if (!selectedHelper && !newHelperName.trim()) {
      Alert.alert('Select Helper', 'Please select a helper from the list or enter a custom name.');
      return;
    }

    const helperName = selectedHelper || newHelperName.trim();
    const player = players[selectedPlayerIndex];
    
    if (!player) return;

    // Update player helpers
    const updatedPlayers = players.map((p, index) => {
      if (index === selectedPlayerIndex) {
        const newHelpers = { ...p.helpers };
        if (!newHelpers[helperName]) {
          newHelpers[helperName] = 1;
        } else {
          newHelpers[helperName] = Math.min(10, newHelpers[helperName] + 1);
        }
        return { ...p, helpers: newHelpers };
      }
      return p;
    });

    onUpdateGameState({ 
      ...gameState, 
      players: updatedPlayers 
    });

    // Check if helper was just recruited
    const newPoints = (player.helpers[helperName] || 0) + 1;
    if (newPoints === 3) {
      Alert.alert('Helper Recruited!', `${player.name} has recruited ${helperName} as a Helper!`);
    }

    setSelectedHelper('');
    setNewHelperName('');
    setShowHelperModal(false);
  };

  const adjustHelperPoints = (playerIndex, helperName, adjustment) => {
    const player = players[playerIndex];
    if (!player || !player.helpers[helperName]) return;

    const updatedPlayers = players.map((p, index) => {
      if (index === playerIndex) {
        const newHelpers = { ...p.helpers };
        const newPoints = Math.max(0, Math.min(10, newHelpers[helperName] + adjustment));
        
        if (newPoints === 0) {
          delete newHelpers[helperName];
        } else {
          newHelpers[helperName] = newPoints;
        }
        
        return { ...p, helpers: newHelpers };
      }
      return p;
    });

    onUpdateGameState({ 
      ...gameState, 
      players: updatedPlayers 
    });
  };

  const removeHelper = (playerIndex, helperName) => {
    Alert.alert(
      'Remove Helper',
      `Remove ${helperName} as a helper for ${players[playerIndex]?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            const updatedPlayers = players.map((p, index) => {
              if (index === playerIndex) {
                const newHelpers = { ...p.helpers };
                delete newHelpers[helperName];
                return { ...p, helpers: newHelpers };
              }
              return p;
            });

            onUpdateGameState({ 
              ...gameState, 
              players: updatedPlayers 
            });
          }
        }
      ]
    );
  };

  // Position-safe player stat updates
  const updatePlayerStat = (playerIndex, stat, value) => {
    if (!players[playerIndex]) return;
    
    const numValue = Math.max(0, parseInt(value) || 0);
    
    const updatedPlayers = players.map((player, index) => {
      if (index === playerIndex) {
        return {
          ...player,
          [stat]: numValue
        };
      }
      return player;
    });

    onUpdateGameState({ 
      ...gameState, 
      players: updatedPlayers 
    });

    if (stat === 'sacrificePoints' && numValue >= 40) {
      setTimeout(() => {
        Alert.alert('Winner!', `🎉 ${players[playerIndex]?.name} wins! 🎉`);
      }, 100);
    }
  };

  const handleRollDice = () => {
    if (isRolling || players.length === 0) return;
    
    // Start dice animation
    rotateValue.setValue(0);
    Animated.timing(rotateValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    onRollDice();
  };

  const handleEndTurn = () => {
    if (players.length === 0) return;
    onEndTurn();
  };

  const handleNewGame = () => {
    Alert.alert(
      'New Game',
      'Start a new game? This will remove all players and reset the turn count.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'New Game', 
          onPress: () => {
            try {
              onUpdateGameState({
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
              
              setTimeout(() => {
                Alert.alert('New Game Started!', 'All players removed and turn count reset. Add players to begin!');
              }, 100);
              
            } catch (error) {
              console.error('Error resetting game:', error);
              Alert.alert('Error', 'Failed to reset game');
            }
          }
        }
      ]
    );
  };

  // Create interpolated rotation value for dice animation
  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  // Safe access to current player and location
  const currentPlayer = players[currentPlayerIndex] || null;
  const currentLocation = config?.boardPositions?.[currentPlayer?.position] || null;

  // Auto-scroll to current player when turn changes
  useEffect(() => {
    if (players.length > 0 && playersScrollViewRef.current && currentPlayerIndex !== undefined) {
      const currentPlayerId = players[currentPlayerIndex]?.id;
      const currentPlayerRef = playerRefs.current[currentPlayerId];
      
      if (currentPlayerRef) {
        setTimeout(() => {
          try {
            currentPlayerRef.measureLayout(
              playersScrollViewRef.current.getInnerViewNode(),
              (x, y, width, height) => {
                playersScrollViewRef.current?.scrollTo({
                  y: Math.max(0, y - 50),
                  animated: true
                });
              },
              () => {
                const playerHeight = 120;
                const scrollPosition = currentPlayerIndex * playerHeight;
                playersScrollViewRef.current?.scrollTo({
                  y: Math.max(0, scrollPosition - 50),
                  animated: true
                });
              }
            );
          } catch (error) {
            console.warn('Auto-scroll failed:', error);
          }
        }, 100);
      }
    }
  }, [currentPlayerIndex, players.length]);

  // Clear player refs when players change
  useEffect(() => {
    const currentPlayerIds = new Set(players.map(p => p?.id).filter(id => id != null));
    Object.keys(playerRefs.current).forEach(playerId => {
      if (!currentPlayerIds.has(parseInt(playerId))) {
        delete playerRefs.current[playerId];
      }
    });
  }, [players]);

  return (
    <View style={styles.container}>
      {/* Controls Section */}
      {(showOnlyControls || (!showOnlyControls && !showOnlyPlayers)) && (
        <>
          <Text style={styles.panelTitle}>🎮 Game Controls</Text>
          
          <View style={styles.controlButtons}>
            <TouchableOpacity style={styles.controlButton} onPress={handleNewGame}>
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
            
            {onShowThemeSelector && (
              <TouchableOpacity 
                style={[styles.controlButton, styles.themeButton]} 
                onPress={onShowThemeSelector}
              >
                <Text style={styles.controlButtonText}>
                  {currentTheme === 'biblical' ? '📖' : '🏰'} Theme
                </Text>
              </TouchableOpacity>
            )}

            {onToggleManualMove && (
              <TouchableOpacity 
                style={[
                  styles.controlButton, 
                  styles.manualMoveButton,
                  manualMoveMode && styles.manualMoveButtonActive
                ]} 
                onPress={onToggleManualMove}
              >
                <Text style={styles.controlButtonText}>
                  {manualMoveMode ? '🎯 Manual' : '🎲 Auto'} Move
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.turnInfo}>
            <Text style={styles.turnTitle}>Current Turn</Text>
            <Text style={styles.currentPlayerText}>{currentPlayer?.name || 'No Players'}</Text>
            <Text style={styles.turnNumber}>Turn {turnNumber}</Text>
          </View>

          <View style={styles.diceContainer}>
            <Animated.View 
              style={[
                styles.dice,
                { transform: [{ rotate: rotateInterpolate }] }
              ]}
            >
              <TouchableOpacity 
                style={styles.diceInner}
                onPress={handleRollDice}
                disabled={isRolling || players.length === 0}
              >
                <Text style={styles.diceText}>
                  {lastRoll || '🎲'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
            
            <TouchableOpacity 
              style={[
                styles.rollButton, 
                (isRolling || players.length === 0) && styles.disabledButton
              ]} 
              onPress={handleRollDice}
              disabled={isRolling || players.length === 0}
            >
              <Text style={styles.rollButtonText}>Roll Dice</Text>
            </TouchableOpacity>
            
            {lastRoll > 0 && (
              <Text style={styles.lastRoll}>Rolled: {lastRoll}</Text>
            )}
          </View>

          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Current Location</Text>
            <Text style={styles.currentLocation}>{currentLocation?.name || 'Your Village'}</Text>
            <Text style={styles.locationDescription}>
              {currentLocation?.description || 'Starting space - collect 5 SP when passing'}
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.endTurnButton, players.length === 0 && styles.disabledButton]} 
            onPress={handleEndTurn}
            disabled={players.length === 0}
          >
            <Text style={styles.endTurnButtonText}>End Turn</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Players Section */}
      {(showOnlyPlayers || (!showOnlyControls && !showOnlyPlayers)) && (
        <>
          {showOnlyPlayers && <Text style={styles.panelTitle}>👥 Players</Text>}
          
          <ScrollView 
            ref={playersScrollViewRef}
            style={styles.playersScrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.playersScrollContent}
          >
            {!showOnlyPlayers && <Text style={styles.playersTitle}>👥 Players</Text>}
            
            {players.length === 0 ? (
              <View style={styles.noPlayersContainer}>
                <Text style={styles.noPlayersText}>No players yet. Add a player to start!</Text>
              </View>
            ) : (
              players.map((player, index) => {
                if (!player) return null;
                
                return (
                  <View 
                    key={player.id || index} 
                    ref={(ref) => {
                      if (ref && player.id) {
                        playerRefs.current[player.id] = ref;
                      }
                    }}
                    style={[
                      styles.playerSection,
                      index === currentPlayerIndex && styles.activePlayerSection
                    ]}
                  >
                    <View style={styles.playerHeader}>
                      <View style={[
                        styles.playerColorIndicator, 
                        { backgroundColor: player.color || '#FF4444' }
                      ]} />
                      <Text style={styles.playerName}>{player.name || `Player ${index + 1}`}</Text>
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
                        value={(player.sacrificePoints || 0).toString()}
                        onChangeText={(value) => updatePlayerStat(index, 'sacrificePoints', value)}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Livestock:</Text>
                      <TextInput
                        style={styles.statInput}
                        value={(player.livestock || 0).toString()}
                        onChangeText={(value) => updatePlayerStat(index, 'livestock', value)}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Coins:</Text>
                      <TextInput
                        style={styles.statInput}
                        value={(player.coins || 0).toString()}
                        onChangeText={(value) => updatePlayerStat(index, 'coins', value)}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.helperSection}>
                      <View style={styles.helperHeader}>
                        <Text style={styles.helperTitle}>Helpers:</Text>
                        <TouchableOpacity 
                          style={styles.addHelperButton}
                          onPress={() => openHelperModal(index)}
                        >
                          <Text style={styles.addHelperButtonText}>+ Add</Text>
                        </TouchableOpacity>
                      </View>
                      
                      <ScrollView 
                        style={styles.helperList}
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                      >
                        {player.helpers && Object.keys(player.helpers).length > 0 ? (
                          Object.keys(player.helpers).map(helperName => (
                            <View key={helperName} style={styles.helperItem}>
                              <Text style={styles.helperName} numberOfLines={1}>{helperName}</Text>
                              <View style={styles.helperControls}>
                                <TouchableOpacity 
                                  style={styles.helperButton}
                                  onPress={() => adjustHelperPoints(index, helperName, -1)}
                                >
                                  <Text style={styles.helperButtonText}>-</Text>
                                </TouchableOpacity>
                                
                                <Text style={styles.helperPoints}>
                                  {player.helpers[helperName] || 0}/3 {(player.helpers[helperName] || 0) >= 3 ? '✅' : ''}
                                </Text>
                                
                                <TouchableOpacity 
                                  style={styles.helperButton}
                                  onPress={() => adjustHelperPoints(index, helperName, 1)}
                                >
                                  <Text style={styles.helperButtonText}>+</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                  style={styles.removeHelperButton}
                                  onPress={() => removeHelper(index, helperName)}
                                >
                                  <Text style={styles.removeHelperButtonText}>×</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ))
                        ) : (
                          <Text style={styles.noHelpersText}>No helpers yet</Text>
                        )}
                      </ScrollView>
                    </View>
                    {/* Active Cards Display - with error boundary */}
{player.activeCards && player.activeCards.length > 0 ? (
  <ActiveCardsDisplay 
    player={player} 
    onUseCard={(card) => {
      Alert.alert(
        `${card.symbol} ${card.title}`, 
        `${card.effect}\n\nUses remaining: ${card.effectData?.usesRemaining || 'Unknown'}`
      );
    }} 
  />
) : null}
                  </View>
                );
              })
            )}
          </ScrollView>
        </>
      )}

      {/* Helper Management Modal */}
      <Modal
        visible={showHelperModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHelperModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              👥 Add Helper to {players[selectedPlayerIndex]?.name}
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Select from Biblical Characters:</Text>
              <ScrollView style={styles.helperPickerContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.helperPicker}>
                  {availableHelpers.map(helper => (
                    <TouchableOpacity
                      key={helper}
                      style={[
                        styles.helperPickerOption,
                        selectedHelper === helper && styles.selectedHelperPickerOption
                      ]}
                      onPress={() => setSelectedHelper(helper)}
                    >
                      <Text style={[
                        styles.helperPickerText,
                        selectedHelper === helper && styles.selectedHelperPickerText
                      ]}>
                        {helper}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Or Enter Custom Helper Name:</Text>
              <TextInput
                style={styles.textInput}
                value={newHelperName}
                onChangeText={setNewHelperName}
                placeholder="Enter custom helper name..."
                maxLength={30}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowHelperModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={addHelperToPlayer}
              >
                <Text style={styles.modalButtonText}>Add Helper</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Choose Marker Shape:</Text>
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
                  Answer 3 questions from the same biblical character to recruit them as a Helper. Helpers provide hints for questions at their locations. Only one player can have each Helper - first to recruit them claims them permanently. You can also manually add helpers and adjust helper points using the player controls.
                </Text>
              </View>

              <View style={styles.rulesSection}>
                <Text style={styles.rulesSectionTitle}>⚡ Special Spaces</Text>
                <Text style={styles.rulesText}>
                  • <Text style={styles.bold}>🐺 Wolves Attack:</Text> Roll die, lose that many livestock and SP. You remain at the Wolves space.{'\n'}
                  • <Text style={styles.bold}>⚔️ Bandits Attack:</Text> Roll die, lose that many coins and SP. You remain at the Bandits space.{'\n'}
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
  themeButton: {
    backgroundColor: '#9C27B0',
    minWidth: '45%',
  },
  manualMoveButton: {
    backgroundColor: '#FF9800',
    minWidth: '45%',
  },
  manualMoveButtonActive: {
    backgroundColor: '#F57C00',
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
  diceInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: 20 * scaleFactor,
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
  helperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6 * scaleFactor,
  },
  helperTitle: {
    fontSize: Math.max(10, 12 * scaleFactor),
    fontWeight: 'bold',
    color: '#333',
  },
  addHelperButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 4 * scaleFactor,
    paddingHorizontal: 8 * scaleFactor,
    borderRadius: 4,
  },
  addHelperButtonText: {
    color: 'white',
    fontSize: Math.max(9, 10 * scaleFactor),
    fontWeight: 'bold',
  },
  helperList: {
    maxHeight: 80 * scaleFactor,
  },
  helperItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3 * scaleFactor,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  helperName: {
    fontSize: Math.max(9, 11 * scaleFactor),
    flex: 1,
    color: '#333',
    marginRight: 8,
  },
  helperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4 * scaleFactor,
  },
  helperButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 2 * scaleFactor,
    paddingHorizontal: 6 * scaleFactor,
    borderRadius: 3,
    minWidth: 20 * scaleFactor,
    alignItems: 'center',
  },
  helperButtonText: {
    color: 'white',
    fontSize: Math.max(8, 10 * scaleFactor),
    fontWeight: 'bold',
  },
  helperPoints: {
    fontSize: Math.max(9, 11 * scaleFactor),
    fontWeight: 'bold',
    color: '#4CAF50',
    minWidth: 40 * scaleFactor,
    textAlign: 'center',
  },
  removeHelperButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 2 * scaleFactor,
    paddingHorizontal: 6 * scaleFactor,
    borderRadius: 3,
    minWidth: 20 * scaleFactor,
    alignItems: 'center',
  },
  removeHelperButtonText: {
    color: 'white',
    fontSize: Math.max(8, 10 * scaleFactor),
    fontWeight: 'bold',
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
    flexWrap: 'wrap',
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
    flexWrap: 'wrap',
    gap: 10 * scaleFactor,
    paddingVertical: 10 * scaleFactor,
    justifyContent: 'space-between',
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
  // Helper Picker Styles
  helperPickerContainer: {
    maxHeight: 150 * scaleFactor,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  helperPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5 * scaleFactor,
    gap: 5 * scaleFactor,
  },
  helperPickerOption: {
    paddingVertical: 6 * scaleFactor,
    paddingHorizontal: 10 * scaleFactor,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: 'white',
    marginBottom: 5 * scaleFactor,
  },
  selectedHelperPickerOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e8',
    borderWidth: 2,
  },
  helperPickerText: {
    fontSize: Math.max(12, 14 * scaleFactor),
    color: '#333',
  },
  selectedHelperPickerText: {
    color: '#2d5a2d',
    fontWeight: 'bold',
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