// js/components/game-board.js - Enhanced with attack space support
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeManager } from '../utils/theme-manager';

const { width, height } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width * 0.95, height * 0.95);
const PLAYER_MARKER_SIZE = 35;

const GameBoard = ({ 
  gameState, 
  config, 
  onLocationSelect, 
  onUpdateGameState, 
  onPlayerMove, 
  onSpecialSpaceActivate, // NEW: Callback for special space activation
  currentTheme = 'biblical'
}) => {
  const theme = ThemeManager.getCurrentTheme(currentTheme);
  const styles = ThemeManager.getStyles(currentTheme);
  
  // Create animated values for each player
  const playerAnimations = useRef({});

  // Initialize or update animated values when players change
  useEffect(() => {
    if (!gameState.players) return;

    gameState.players.forEach(player => {
      if (!playerAnimations.current[player.id]) {
        const initialPos = calculatePlayerMarkerPosition(player.position, player.id, gameState.players);
        
        playerAnimations.current[player.id] = {
          left: new Animated.Value(initialPos.left),
          top: new Animated.Value(initialPos.top),
          currentPosition: player.position,
        };
      }
    });

    // Clean up animations for removed players
    const currentPlayerIds = new Set(gameState.players.map(p => p.id));
    Object.keys(playerAnimations.current).forEach(playerId => {
      if (!currentPlayerIds.has(parseInt(playerId))) {
        delete playerAnimations.current[playerId];
      }
    });
  }, [gameState.players]);

  // Animate player movements when positions change
  useEffect(() => {
    if (!gameState.players) return;

    gameState.players.forEach(player => {
      const animation = playerAnimations.current[player.id];
      if (animation && animation.currentPosition !== player.position) {
        const newPos = calculatePlayerMarkerPosition(player.position, player.id, gameState.players);
        
        Animated.parallel([
          Animated.timing(animation.left, {
            toValue: newPos.left,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(animation.top, {
            toValue: newPos.top,
            duration: 800,
            useNativeDriver: false,
          }),
        ]).start();

        animation.currentPosition = player.position;
      }
    });
  }, [gameState.players.map(p => `${p.id}:${p.position}`).join(',')]);

  const calculatePlayerMarkerPosition = (locationIndex, playerId, allPlayers) => {
    const locationPos = getLocationPosition(locationIndex);
    
    let baseLeft, baseTop;
    
    if (locationPos.left !== undefined) {
      if (typeof locationPos.left === 'string') {
        baseLeft = BOARD_SIZE * (parseFloat(locationPos.left.replace('%', '')) / 100);
      } else {
        baseLeft = locationPos.left;
      }
    } else if (locationPos.right !== undefined) {
      if (typeof locationPos.right === 'string') {
        baseLeft = BOARD_SIZE * (1 - parseFloat(locationPos.right.replace('%', '')) / 100 - parseFloat(locationPos.width.replace('%', '')) / 100);
      } else {
        baseLeft = BOARD_SIZE * (1 - locationPos.right - parseFloat(locationPos.width.replace('%', '')) / 100);
      }
    }
    
    if (locationPos.top !== undefined) {
      if (typeof locationPos.top === 'string') {
        baseTop = BOARD_SIZE * (parseFloat(locationPos.top.replace('%', '')) / 100);
      } else {
        baseTop = locationPos.top;
      }
    } else if (locationPos.bottom !== undefined) {
      if (typeof locationPos.bottom === 'string') {
        baseTop = BOARD_SIZE * (1 - parseFloat(locationPos.bottom.replace('%', '')) / 100 - parseFloat(locationPos.height.replace('%', '')) / 100);
      } else {
        baseTop = BOARD_SIZE * (1 - locationPos.bottom - parseFloat(locationPos.height.replace('%', '')) / 100);
      }
    }
    
    const playersAtLocation = allPlayers.filter(p => p.position === locationIndex);
    const sortedPlayersAtLocation = playersAtLocation.sort((a, b) => a.id - b.id);
    const playerIndex = sortedPlayersAtLocation.findIndex(p => p.id === playerId);
    
    const totalPlayersAtLocation = playersAtLocation.length;
    let offsetX = 0;
    let offsetY = 0;
    
    if (totalPlayersAtLocation > 1) {
      const playersPerRow = Math.ceil(Math.sqrt(totalPlayersAtLocation));
      const row = Math.floor(playerIndex / playersPerRow);
      const col = playerIndex % playersPerRow;
      
      const horizontalSpacing = PLAYER_MARKER_SIZE * 0.6;
      const verticalSpacing = PLAYER_MARKER_SIZE * 0.6;
      
      offsetX = col * horizontalSpacing;
      offsetY = row * verticalSpacing;
      
      const totalWidth = (playersPerRow - 1) * horizontalSpacing;
      const actualRows = Math.ceil(totalPlayersAtLocation / playersPerRow);
      const totalHeight = (actualRows - 1) * verticalSpacing;
      
      offsetX -= totalWidth / 2;
      offsetY -= totalHeight / 2;
    }
    
    const locationWidth = BOARD_SIZE * (parseFloat(locationPos.width.replace('%', '')) / 100);
    const locationHeight = BOARD_SIZE * (parseFloat(locationPos.height.replace('%', '')) / 100);
    
    const centerX = baseLeft + (locationWidth / 2) - (PLAYER_MARKER_SIZE / 2);
    const centerY = baseTop + (locationHeight / 2) - (PLAYER_MARKER_SIZE / 2);
    
    return {
      left: centerX + offsetX,
      top: centerY + offsetY,
    };
  };

  const handleLocationClick = (location, index) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // PRIORITY 1: Manual movement (if enabled)
    if (currentPlayer && !gameState.isRolling && onPlayerMove) {
      onPlayerMove(index);
      return;
    }
    
    // PRIORITY 2: If it's a trivia location, trigger auto-loading trivia
    if (location.type === 'location' && onLocationSelect) {
      onLocationSelect(location.name);
      return;
    }
    
    // PRIORITY 3: Handle special spaces for testing/demonstration
    if (location.type === 'special' && onSpecialSpaceActivate && currentPlayer?.position === index) {
      onSpecialSpaceActivate(location, index);
    }
  };

  const getLocationStyle = (location, index) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const canMove = currentPlayer && !gameState.isRolling && onPlayerMove;
    
    const isClickable = canMove || location.type === 'location';
    const isCurrentPlayerHere = currentPlayer && currentPlayer.position === index;
    
    return [
      boardStyles.location,
      getLocationPosition(index),
      getLocationTypeStyle(location, theme),
      isClickable && boardStyles.clickableLocation,
      canMove && boardStyles.moveableLocation,
      isCurrentPlayerHere && location.type === 'special' && boardStyles.activeSpecialSpace,
    ];
  };

  const renderLocation = (location, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={getLocationStyle(location, index)}
        onPress={() => handleLocationClick(location, index)}
        activeOpacity={0.7}
      >
        {location.type === 'special' ? (
          <Text style={[boardStyles.specialLocationText, getSpecialTextStyle(location, theme)]}>
            {location.name}
          </Text>
        ) : (
          <View style={boardStyles.normalLocation}>
            <View style={[boardStyles.locationHeader, getHeaderStyle(location, theme)]}>
              <Text style={boardStyles.locationHeaderText}>
                {location.type === 'start' ? 'START' : getLocationCategory(location.name)}
              </Text>
            </View>
            <Text style={boardStyles.locationName}>{location.name}</Text>
            <Text style={boardStyles.locationDescription}>{location.description}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderAnimatedPlayerMarkers = () => {
    if (!gameState.players) return null;

    return gameState.players.map(player => {
      const animation = playerAnimations.current[player.id];
      if (!animation) return null;

      const isCurrentPlayer = player.id === gameState.players[gameState.currentPlayerIndex]?.id;

      return (
        <Animated.View
          key={player.id}
          style={[
            boardStyles.playerMarker,
            {
              backgroundColor: player.color,
              left: animation.left,
              top: animation.top,
              width: PLAYER_MARKER_SIZE,
              height: PLAYER_MARKER_SIZE,
              borderRadius: PLAYER_MARKER_SIZE / 2,
            },
            isCurrentPlayer && boardStyles.currentPlayerMarker,
          ]}
        >
          <Text style={boardStyles.playerMarkerText}>
            {player.shape || player.name.charAt(0)}
          </Text>
        </Animated.View>
      );
    });
  };

  const renderCenterArea = () => (
    <View style={[boardStyles.centerArea, { backgroundColor: theme.colors.secondary, borderColor: theme.colors.boardBorder }]}>
      <Text style={[boardStyles.centerTitle, { color: theme.colors.primary }]}>VOYAGER</Text>
      <Text style={[boardStyles.centerSubtitle, { color: theme.colors.primary }]}>Journey to Jerusalem</Text>
      <Text style={[boardStyles.centerDescription, { color: theme.colors.primary }]}>
        First to 40 Sacrifice Points wins! Answer biblical trivia, redeem for offerings, but beware of bandits and wolves!
      </Text>
      {gameState.players.length > 0 && onPlayerMove && (
        <Text style={[boardStyles.moveHint, { color: theme.colors.primary, backgroundColor: 'rgba(255,255,255,0.8)' }]}>
          Click any location to move {gameState.players[gameState.currentPlayerIndex]?.name}'s piece
        </Text>
      )}
      {gameState.players.length > 0 && gameState.players[gameState.currentPlayerIndex] && (
        <View style={boardStyles.currentPlayerInfo}>
          <Text style={[boardStyles.currentPlayerLabel, { color: theme.colors.primary }]}>Current Player:</Text>
          <View style={[boardStyles.currentPlayerDisplay, { borderColor: theme.colors.primary }]}>
            <View 
              style={[
                boardStyles.currentPlayerColor, 
                { backgroundColor: gameState.players[gameState.currentPlayerIndex].color }
              ]} 
            />
            <Text style={[boardStyles.currentPlayerName, { color: theme.colors.primary }]}>
              {gameState.players[gameState.currentPlayerIndex].name}
            </Text>
            <Text style={boardStyles.currentPlayerShape}>
              {gameState.players[gameState.currentPlayerIndex].shape}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  if (!config || !config.boardPositions) {
    return (
      <View style={[boardStyles.gameBoard, { backgroundColor: theme.colors.boardBackground, borderColor: theme.colors.boardBorder }]}>
        <View style={boardStyles.centerArea}>
          <Text style={boardStyles.centerTitle}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[boardStyles.gameBoard, { backgroundColor: theme.colors.boardBackground, borderColor: theme.colors.boardBorder }]}>
      {config.boardPositions.map((location, index) => renderLocation(location, index))}
      {renderCenterArea()}
      {renderAnimatedPlayerMarkers()}
    </View>
  );
};

// Helper functions
const getLocationPosition = (index) => {
  const positions = [
    // Top row
    { top: 0, left: 0, width: '14.28%', height: '14%' },
    { top: 0, left: '14.28%', width: '14.28%', height: '14%' },
    { top: 0, left: '28.56%', width: '14.28%', height: '14%' },
    { top: 0, left: '42.84%', width: '14.28%', height: '14%' },
    { top: 0, left: '57.12%', width: '14.28%', height: '14%' },
    { top: 0, left: '71.4%', width: '14.28%', height: '14%' },
    { top: 0, right: 0, width: '14.28%', height: '14%' },
    // Right side
    { top: '14%', right: 0, width: '14.28%', height: '12%' },
    { top: '26%', right: 0, width: '14.28%', height: '12%' },
    { top: '38%', right: 0, width: '14.28%', height: '12%' },
    { top: '50%', right: 0, width: '14.28%', height: '12%' },
    { top: '62%', right: 0, width: '14.28%', height: '12%' },
    { top: '74%', right: 0, width: '14.28%', height: '12%' },
    // Bottom row
    { bottom: 0, right: 0, width: '14.28%', height: '14%' },
    { bottom: 0, right: '14.28%', width: '14.28%', height: '14%' },
    { bottom: 0, right: '28.56%', width: '14.28%', height: '14%' },
    { bottom: 0, right: '42.84%', width: '14.28%', height: '14%' },
    { bottom: 0, right: '57.12%', width: '14.28%', height: '14%' },
    { bottom: 0, right: '71.4%', width: '14.28%', height: '14%' },
    { bottom: 0, left: 0, width: '14.28%', height: '14%' },
    // Left side
    { bottom: '14%', left: 0, width: '14.28%', height: '12%' },
    { bottom: '26%', left: 0, width: '14.28%', height: '12%' },
    { bottom: '38%', left: 0, width: '14.28%', height: '12%' },
    { bottom: '50%', left: 0, width: '14.28%', height: '12%' },
    { bottom: '62%', left: 0, width: '14.28%', height: '12%' },
    { bottom: '74%', left: 0, width: '14.28%', height: '12%' },
  ];

  return positions[index] || { top: 0, left: 0, width: '14.28%', height: '12%' };
};

const getLocationTypeStyle = (location, theme) => {
  if (location.type === 'special') {
    // ENHANCED: Better special space styling based on subtype
    if (location.subtype === 'wolves' || location.name.includes('WOLVES')) {
      return { backgroundColor: theme.colors.wolvesSpace || '#654321' };
    }
    if (location.subtype === 'bandits' || location.name.includes('BANDITS')) {
      return { backgroundColor: theme.colors.banditsSpace || '#2F4F4F' };
    }
    if (location.subtype === 'positive' || location.name.includes('ANGEL')) {
      return { backgroundColor: theme.colors.angelSpace || '#FFD700' };
    }
    if (location.subtype === 'negative' || location.name.includes('DEMON')) {
      return { backgroundColor: theme.colors.demonSpace || '#8B0000' };
    }
    return { backgroundColor: '#FF6B6B' };
  }
  return { backgroundColor: 'white' };
};

const getSpecialTextStyle = (location, theme) => {
  // White text for dark backgrounds, dark text for light backgrounds
  if (location.subtype === 'wolves' || location.subtype === 'bandits' || location.subtype === 'negative') {
    return { color: 'white' };
  }
  return { color: theme.colors.textDark };
};

const getHeaderStyle = (location, theme) => {
  const locationCategories = {
    'Your Village': { backgroundColor: theme.colors.creation || '#FFD93D' },
    'Haran': { backgroundColor: theme.colors.patriarchs || '#FF6B6B' },
    'Shechem': { backgroundColor: theme.colors.patriarchs || '#FF6B6B' },
    'Bethel': { backgroundColor: theme.colors.patriarchs || '#FF6B6B' },
    'Hebron': { backgroundColor: theme.colors.patriarchs || '#FF6B6B' },
    'Egypt (Goshen)': { backgroundColor: theme.colors.patriarchs || '#FF6B6B' },
    'Mount Sinai': { backgroundColor: theme.colors.exodus || '#4ECDC4' },
    'Jordan River': { backgroundColor: theme.colors.conquest || '#45B7D1' },
    'Jericho': { backgroundColor: theme.colors.conquest || '#45B7D1' },
    'Gilgal': { backgroundColor: theme.colors.conquest || '#45B7D1' },
    'Shiloh': { backgroundColor: theme.colors.conquest || '#45B7D1' },
    'Ramah': { backgroundColor: theme.colors.kingdom || '#96CEB4' },
    'Jerusalem': { backgroundColor: theme.colors.kingdom || '#96CEB4' },
    'En-gedi': { backgroundColor: theme.colors.kingdom || '#96CEB4' },
    'Mount Carmel': { backgroundColor: theme.colors.prophets || '#DDA0DD' },
    'Brook Cherith': { backgroundColor: theme.colors.prophets || '#DDA0DD' },
    'Damascus': { backgroundColor: theme.colors.prophets || '#DDA0DD' },
    'Nineveh': { backgroundColor: theme.colors.prophets || '#DDA0DD' },
    'Babylon': { backgroundColor: theme.colors.exile || '#FFEAA7' },
    'Shushan': { backgroundColor: theme.colors.exile || '#FFEAA7' },
    'Land of Uz': { backgroundColor: theme.colors.exile || '#FFEAA7' },
    'Fiery Furnace': { backgroundColor: theme.colors.prophets || '#DDA0DD' },
  };

  return locationCategories[location.name] || { backgroundColor: theme.colors.kingdom || '#96CEB4' };
};

const getLocationCategory = (locationName) => {
  const categories = {
    'Your Village': 'CREATION',
    'Haran': 'PATRIARCHS',
    'Shechem': 'PATRIARCHS',
    'Bethel': 'PATRIARCHS',
    'Hebron': 'PATRIARCHS',
    'Egypt (Goshen)': 'PATRIARCHS',
    'Mount Sinai': 'EXODUS',
    'Jordan River': 'CONQUEST',
    'Jericho': 'CONQUEST',
    'Gilgal': 'CONQUEST',
    'Shiloh': 'CONQUEST',
    'Ramah': 'KINGDOM',
    'Jerusalem': 'KINGDOM',
    'En-gedi': 'KINGDOM',
    'Mount Carmel': 'PROPHETS',
    'Brook Cherith': 'PROPHETS',
    'Damascus': 'PROPHETS',
    'Nineveh': 'PROPHETS',
    'Babylon': 'EXILE',
    'Shushan': 'EXILE',
    'Land of Uz': 'EXILE',
    'Fiery Furnace': 'PROPHETS',
  };

  return categories[locationName] || 'KINGDOM';
};

const boardStyles = StyleSheet.create({
  gameBoard: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    borderWidth: 8,
    position: 'relative',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  location: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 4,
  },
  normalLocation: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
  },
  clickableLocation: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  moveableLocation: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: '#4CAF50',
    borderWidth: 3,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  activeSpecialSpace: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderColor: '#FFC107',
    borderWidth: 3,
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 8,
  },
  locationHeader: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationHeaderText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  locationName: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginVertical: 2,
    lineHeight: 12,
  },
  locationDescription: {
    fontSize: 8,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 'auto',
    lineHeight: 9,
  },
  specialLocationText: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 13,
    color: 'white',
    flex: 1,
    textAlignVertical: 'center',
  },
  centerArea: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '45%',
    height: '45%',
    borderWidth: 3,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -BOARD_SIZE * 0.225 }, { translateY: -BOARD_SIZE * 0.225 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  centerTitle: {
    fontSize: Math.max(24, BOARD_SIZE * 0.04),
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  centerSubtitle: {
    fontSize: Math.max(12, BOARD_SIZE * 0.018),
    marginBottom: 12,
    fontStyle: 'italic',
  },
  centerDescription: {
    fontSize: Math.max(10, BOARD_SIZE * 0.014),
    textAlign: 'center',
    lineHeight: Math.max(12, BOARD_SIZE * 0.018),
    paddingHorizontal: 15,
    marginBottom: 8,
  },
  moveHint: {
    fontSize: Math.max(9, BOARD_SIZE * 0.012),
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentPlayerInfo: {
    alignItems: 'center',
    marginTop: 5,
  },
  currentPlayerLabel: {
    fontSize: Math.max(8, BOARD_SIZE * 0.011),
    fontWeight: 'bold',
    marginBottom: 3,
  },
  currentPlayerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  currentPlayerColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'white',
  },
  currentPlayerName: {
    fontSize: Math.max(10, BOARD_SIZE * 0.013),
    fontWeight: 'bold',
    marginRight: 4,
  },
  currentPlayerShape: {
    fontSize: Math.max(12, BOARD_SIZE * 0.015),
  },
  playerMarker: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 8,
  },
  currentPlayerMarker: {
    borderWidth: 3,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 12,
    transform: [{ scale: 1.1 }],
  },
  playerMarkerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default GameBoard;