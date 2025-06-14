// js/components/game-board.js - Updated with auto-loading trivia support
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');
// Increase board size significantly for better visibility
const BOARD_SIZE = Math.min(width * 0.95, height * 0.95);

const GameBoard = ({ gameState, config, onLocationSelect, onUpdateGameState }) => {
  const handleLocationClick = (location, index) => {
    // If it's a trivia location, trigger auto-loading trivia
    if (location.type === 'location' && onLocationSelect) {
      onLocationSelect(location.name);
    }
    
    // Handle special spaces
    if (location.type === 'special') {
      handleSpecialSpace(location);
    }
  };

  const handleSpecialSpace = (location) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer) return;

    switch(location.name) {
      case "🐺 WOLVES ATTACK":
        handleAttack('livestock', '🐺 Wolves');
        break;
      case "⚔️ BANDITS ATTACK":
        handleAttack('coins', '⚔️ Bandits');
        break;
      case "👼 ANGEL CARD":
        // This would be handled by the parent component
        console.log("Angel card space clicked - draw an angel card!");
        break;
      case "👹 DEMON CARD":
        // This would be handled by the parent component
        console.log("Demon card space clicked - draw a demon card!");
        break;
    }
  };

  const handleAttack = (resourceType, attackerName) => {
    const attackRoll = Math.floor(Math.random() * 6) + 1;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    const resourceLoss = Math.min(currentPlayer[resourceType], attackRoll);
    const spLoss = Math.min(currentPlayer.sacrificePoints, attackRoll);
    
    const updatedPlayers = gameState.players.map((player, index) =>
      index === gameState.currentPlayerIndex
        ? {
            ...player,
            [resourceType]: Math.max(0, player[resourceType] - attackRoll),
            sacrificePoints: Math.max(0, player.sacrificePoints - attackRoll)
          }
        : player
    );

    onUpdateGameState({ players: updatedPlayers });

    // Use Alert in React Native or console for web development
    if (typeof alert !== 'undefined') {
      alert(`${attackerName} rolled ${attackRoll}! You lost ${resourceLoss} ${resourceType} and ${spLoss} SP.`);
    } else {
      console.log(`${attackerName} rolled ${attackRoll}! You lost ${resourceLoss} ${resourceType} and ${spLoss} SP.`);
    }
  };

  const renderLocation = (location, index) => {
    const position = getLocationPosition(index);
    const playersOnSpace = gameState.players.filter(p => p.position === index);
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.location,
          position,
          getLocationTypeStyle(location),
        ]}
        onPress={() => handleLocationClick(location, index)}
      >
        {location.type === 'special' ? (
          <Text style={styles.specialLocationText}>{location.name}</Text>
        ) : (
          <View style={styles.normalLocation}>
            <View style={[styles.locationHeader, getHeaderStyle(location)]}>
              <Text style={styles.locationHeaderText}>
                {location.type === 'start' ? 'START' : getLocationCategory(location.name)}
              </Text>
            </View>
            <Text style={styles.locationName}>{location.name}</Text>
            <Text style={styles.locationDescription}>{location.description}</Text>
          </View>
        )}
        
        {/* Render player markers */}
        {playersOnSpace.map((player, playerIndex) => (
          <View
            key={player.id}
            style={[
              styles.playerMarker,
              {
                backgroundColor: player.color,
                left: 8 + (playerIndex * 12),
                top: 8 + (playerIndex * 12),
              }
            ]}
          >
            <Text style={styles.playerMarkerText}>{player.shape || player.name.charAt(0)}</Text>
          </View>
        ))}
      </TouchableOpacity>
    );
  };

  const renderCenterArea = () => (
    <View style={styles.centerArea}>
      <Text style={styles.centerTitle}>VOYAGER</Text>
      <Text style={styles.centerSubtitle}>Journey to Jerusalem</Text>
      <Text style={styles.centerDescription}>
        First to 40 Sacrifice Points wins! Answer biblical trivia, redeem for offerings, but beware of bandits and wolves!
      </Text>
    </View>
  );

  if (!config || !config.boardPositions) {
    return (
      <View style={styles.gameBoard}>
        <View style={styles.centerArea}>
          <Text style={styles.centerTitle}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.gameBoard}>
      {config.boardPositions.map((location, index) => renderLocation(location, index))}
      {renderCenterArea()}
    </View>
  );
};

const getLocationPosition = (index) => {
  const positions = [
    // Top row - improved positioning
    { top: 0, left: 0, width: '14.28%', height: '14%' }, // top-left corner
    { top: 0, left: '14.28%', width: '14.28%', height: '14%' }, // top-1
    { top: 0, left: '28.56%', width: '14.28%', height: '14%' }, // top-2
    { top: 0, left: '42.84%', width: '14.28%', height: '14%' }, // top-3
    { top: 0, left: '57.12%', width: '14.28%', height: '14%' }, // top-4
    { top: 0, left: '71.4%', width: '14.28%', height: '14%' }, // top-5
    { top: 0, right: 0, width: '14.28%', height: '14%' }, // top-right corner
    
    // Right side - better proportions
    { top: '14%', right: 0, width: '14.28%', height: '12%' }, // right-1
    { top: '26%', right: 0, width: '14.28%', height: '12%' }, // right-2
    { top: '38%', right: 0, width: '14.28%', height: '12%' }, // right-3
    { top: '50%', right: 0, width: '14.28%', height: '12%' }, // right-4
    { top: '62%', right: 0, width: '14.28%', height: '12%' }, // right-5
    { top: '74%', right: 0, width: '14.28%', height: '12%' }, // right-6
    
    // Bottom row - improved positioning
    { bottom: 0, right: 0, width: '14.28%', height: '14%' }, // bottom-right corner
    { bottom: 0, right: '14.28%', width: '14.28%', height: '14%' }, // bottom-1
    { bottom: 0, right: '28.56%', width: '14.28%', height: '14%' }, // bottom-2
    { bottom: 0, right: '42.84%', width: '14.28%', height: '14%' }, // bottom-3
    { bottom: 0, right: '57.12%', width: '14.28%', height: '14%' }, // bottom-4
    { bottom: 0, right: '71.4%', width: '14.28%', height: '14%' }, // bottom-5
    { bottom: 0, left: 0, width: '14.28%', height: '14%' }, // bottom-left corner
    
    // Left side - better proportions
    { bottom: '14%', left: 0, width: '14.28%', height: '12%' }, // left-1
    { bottom: '26%', left: 0, width: '14.28%', height: '12%' }, // left-2
    { bottom: '38%', left: 0, width: '14.28%', height: '12%' }, // left-3
    { bottom: '50%', left: 0, width: '14.28%', height: '12%' }, // left-4
    { bottom: '62%', left: 0, width: '14.28%', height: '12%' }, // left-5
    { bottom: '74%', left: 0, width: '14.28%', height: '12%' }, // left-6
  ];

  return positions[index] || { top: 0, left: 0, width: '14.28%', height: '12%' };
};

const getLocationTypeStyle = (location) => {
  switch (location.type) {
    case 'special':
      if (location.name.includes('WOLVES')) return styles.wolvesSpace;
      if (location.name.includes('BANDITS')) return styles.banditsSpace;
      if (location.name.includes('ANGEL')) return styles.angelSpace;
      if (location.name.includes('DEMON')) return styles.demonSpace;
      return styles.specialSpace;
    default:
      return styles.normalLocationStyle;
  }
};

const getHeaderStyle = (location) => {
  const locationCategories = {
    'Your Village': styles.creationHeader,
    'Haran': styles.patriarchsHeader,
    'Shechem': styles.patriarchsHeader,
    'Bethel': styles.patriarchsHeader,
    'Hebron': styles.patriarchsHeader,
    'Egypt (Goshen)': styles.patriarchsHeader,
    'Mount Sinai': styles.exodusHeader,
    'Jordan River': styles.conquestHeader,
    'Jericho': styles.conquestHeader,
    'Gilgal': styles.conquestHeader,
    'Shiloh': styles.conquestHeader,
    'Ramah': styles.kingdomHeader,
    'Jerusalem': styles.kingdomHeader,
    'En-gedi': styles.kingdomHeader,
    'Mount Carmel': styles.prophetsHeader,
    'Brook Cherith': styles.prophetsHeader,
    'Damascus': styles.prophetsHeader,
    'Nineveh': styles.prophetsHeader,
    'Babylon': styles.exileHeader,
    'Shushan': styles.exileHeader,
    'Land of Uz': styles.exileHeader,
    'Fiery Furnace': styles.prophetsHeader,
  };

  return locationCategories[location.name] || styles.kingdomHeader;
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

const styles = StyleSheet.create({
  gameBoard: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#F5F5DC',
    borderWidth: 8,
    borderColor: '#8B4513',
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
  normalLocationStyle: {
    backgroundColor: 'white',
  },
  normalLocation: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
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
  specialSpace: {
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialLocationText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 13,
  },
  angelSpace: {
    backgroundColor: '#FFD700',
  },
  demonSpace: {
    backgroundColor: '#8B0000',
  },
  wolvesSpace: {
    backgroundColor: '#654321',
  },
  banditsSpace: {
    backgroundColor: '#2F4F4F',
  },
  centerArea: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '45%',
    height: '45%',
    backgroundColor: '#FFD700',
    borderWidth: 3,
    borderColor: '#8B4513',
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
    color: '#8B4513',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  centerSubtitle: {
    fontSize: Math.max(12, BOARD_SIZE * 0.018),
    color: '#654321',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  centerDescription: {
    fontSize: Math.max(10, BOARD_SIZE * 0.014),
    color: '#654321',
    textAlign: 'center',
    lineHeight: Math.max(12, BOARD_SIZE * 0.018),
    paddingHorizontal: 15,
  },
  playerMarker: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderRadius: 12.5,
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
  playerMarkerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Header styles with better contrast
  creationHeader: { backgroundColor: '#FFD93D' },
  patriarchsHeader: { backgroundColor: '#FF6B6B' },
  exodusHeader: { backgroundColor: '#4ECDC4' },
  conquestHeader: { backgroundColor: '#45B7D1' },
  kingdomHeader: { backgroundColor: '#96CEB4' },
  prophetsHeader: { backgroundColor: '#DDA0DD' },
  exileHeader: { backgroundColor: '#FFEAA7' },
});

export default GameBoard;