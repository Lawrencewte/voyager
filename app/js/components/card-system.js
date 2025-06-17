// js/components/card-system.js - Fixed with board-relative positioning
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width * 0.95, height * 0.95);

const CardSystem = ({ gameState, onUpdateGameState, onDrawCard, boardPosition }) => {
  const handleDismissCard = () => {
    onUpdateGameState({ currentCard: null });
  };

  const renderCardModal = () => {
    if (!gameState.currentCard) return null;

    const card = gameState.currentCard;
    const isAngel = card.type === 'angel';

    return (
      <Modal
        visible={!!gameState.currentCard}
        animationType="fade"
        transparent={true}
        onRequestClose={handleDismissCard}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.cardModalContent,
            isAngel ? styles.angelCard : styles.demonCard
          ]}>
            <Text style={styles.cardSymbol}>{card.symbol}</Text>
            <Text style={[styles.cardTitle, !isAngel && { color: '#FFD700' }]}>{card.title}</Text>
            <Text style={[styles.cardScripture, !isAngel && { color: '#FFD700' }]}>{card.scripture}</Text>
            <View style={styles.cardEffect}>
              <Text style={[styles.cardEffectText, !isAngel && { color: '#FFD700' }]}>{card.effect}</Text>
            </View>
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={handleDismissCard}
            >
              <Text style={[styles.dismissButtonText, !isAngel && { color: '#FFD700' }]}>Continue Journey</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // Position the card deck in the center area, above the board center but below the title
  const getCardDeckPosition = () => {
    return {
      left: BOARD_SIZE * 0.42, // Center horizontally on the board
      top: BOARD_SIZE * 0.63,  // Position in upper area, below the center title
    };
  };

  const position = getCardDeckPosition();

  return (
    <>
      {/* Fixed position card deck above Bandit Attack space */}
      <View style={[styles.container, position]}>
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Card Drawing</Text>
          <View style={styles.deckContainer}>
            <TouchableOpacity
              style={[styles.deckMini, styles.angelDeckMini]}
              onPress={() => onDrawCard('angel')}
            >
              <Text style={styles.deckSymbol}>👼</Text>
              <Text style={styles.deckLabel}>Angel</Text>
              <Text style={styles.deckCount}>{gameState.angelDeck?.length || 20}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deckMini, styles.demonDeckMini]}
              onPress={() => onDrawCard('demon')}
            >
              <Text style={styles.deckSymbol}>👹</Text>
              <Text style={styles.deckLabel}>Demon</Text>
              <Text style={styles.deckCount}>{gameState.demonDeck?.length || 20}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Card Modal */}
      {renderCardModal()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
    // Position will be calculated dynamically
  },
  cardSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 15,
    borderWidth: 2,
    borderColor: '#8B4513',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#8B4513',
  },
  deckContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  deckMini: {
    width: 60,
    height: 85,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  angelDeckMini: {
    backgroundColor: '#FFD700',
    borderColor: '#DAA520',
  },
  demonDeckMini: {
    backgroundColor: '#8B0000',
    borderColor: '#4B0000',
  },
  deckSymbol: {
    fontSize: 20,
    marginBottom: 5,
  },
  deckLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 3,
  },
  deckCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardModalContent: {
    width: 350,
    height: 500,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  angelCard: {
    backgroundColor: '#FFD700',
    borderWidth: 4,
    borderColor: '#DAA520',
  },
  demonCard: {
    backgroundColor: '#8B0000',
    borderWidth: 4,
    borderColor: '#4B0000',
  },
  cardSymbol: {
    fontSize: 48,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#8B4513', // This will be overridden by conditional styling for demon cards
  },
  cardScripture: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
    color: '#8B4513', // This will be overridden by conditional styling for demon cards
  },
  cardEffect: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
    borderLeftWidth: 6,
    borderLeftColor: '#8B4513',
    flex: 1,
    justifyContent: 'center',
  },
  cardEffectText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: '#8B4513', // This will be overridden by conditional styling for demon cards
  },
  dismissButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 2,
    borderColor: '#8B4513',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513', // This will be overridden by conditional styling for demon cards
    textAlign: 'center',
  },
});

export default CardSystem;