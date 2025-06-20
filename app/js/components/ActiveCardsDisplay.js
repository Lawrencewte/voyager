// Enhanced ActiveCardsDisplay.js with pop-up functionality and null safety
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ActiveCardsDisplay = ({ player, onUseCard }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);

  // Add null safety check for player and activeCards
  if (!player || !player.activeCards || player.activeCards.length === 0) {
    return null;
  }

  const handleCardPress = (card) => {
    setSelectedCard(card);
    setShowCardModal(true);
  };

  const handleUseCard = () => {
    if (selectedCard && onUseCard) {
      onUseCard(selectedCard);
    }
    setShowCardModal(false);
    setSelectedCard(null);
  };

  const closeModal = () => {
    setShowCardModal(false);
    setSelectedCard(null);
  };

  // Fixed getCardTypeColor function with comprehensive null checks
  const getCardTypeColor = (card) => {
    // Add comprehensive null/undefined checks
    if (!card || typeof card !== 'object') {
      console.warn('Invalid card object passed to getCardTypeColor:', card);
      return '#9C27B0'; // Default purple
    }

    // Check if card has id property and it's a string
    if (card.id && typeof card.id === 'string' && card.id.includes('angel')) {
      return '#FFD700';
    }

    // Safe access to effectData with optional chaining
    const effectType = card.effectData?.type;
    
    switch (effectType) {
      case 'attack_immunity':
        return '#4CAF50';
      case 'demon_immunity':
        return '#2196F3';
      case 'trivia_bonus':
        return '#FF9800';
      case 'thorn_flesh':
        return '#F44336';
      default:
        return '#9C27B0'; // Default purple
    }
  };

  return (
    <>
      <View style={styles.activeCardsSection}>
        <Text style={styles.activeCardsTitle}>Active Cards:</Text>
        {player.activeCards.map((card, index) => {
          // Add null check for each card in the map
          if (!card) {
            console.warn(`Null card found at index ${index}`);
            return null;
          }

          return (
            <TouchableOpacity
              key={`${card.id || 'unknown'}-${index}`}
              style={[
                styles.activeCard,
                { borderLeftColor: getCardTypeColor(card), borderLeftWidth: 4 }
              ]}
              onPress={() => handleCardPress(card)}
            >
              <Text style={styles.activeCardSymbol}>{card.symbol || '❓'}</Text>
              <View style={styles.activeCardInfo}>
                <Text style={styles.activeCardTitle}>{card.title || 'Unknown Card'}</Text>
                <Text style={styles.activeCardUses}>
                  {card.effectData?.usesRemaining === 999 ? 'Permanent' : 
                   `${card.effectData?.usesRemaining || 0} use${(card.effectData?.usesRemaining || 0) !== 1 ? 's' : ''} left`}
                </Text>
                <Text style={styles.activeCardDescription} numberOfLines={2}>
                  {card.effectData?.description || 'Tap for details'}
                </Text>
              </View>
              <View style={styles.cardStatusIndicator}>
                {card.effectData?.usesRemaining === 999 && (
                  <Text style={styles.permanentIndicator}>∞</Text>
                )}
                {card.effectData?.usesRemaining === 1 && card.effectData?.usesRemaining !== 999 && (
                  <Text style={styles.lastUseIndicator}>!</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }).filter(Boolean)} {/* Filter out null elements */}
      </View>

      {/* Card Detail Modal */}
      <Modal
        visible={showCardModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.cardModalContent,
            { borderColor: getCardTypeColor(selectedCard) }
          ]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.cardModalHeader}>
                <Text style={styles.cardModalSymbol}>{selectedCard?.symbol || '❓'}</Text>
                <Text style={styles.cardModalTitle}>{selectedCard?.title || 'Unknown Card'}</Text>
              </View>

              <Text style={styles.cardModalEffect}>{selectedCard?.effect || 'No effect description available'}</Text>

              <View style={styles.cardDetailsContainer}>
                <View style={styles.cardDetailRow}>
                  <Text style={styles.detailLabel}>Type:</Text>
                  <Text style={styles.detailValue}>
                    {selectedCard?.effectData?.type?.replace(/_/g, ' ').toUpperCase() || 'Unknown'}
                  </Text>
                </View>

                <View style={styles.cardDetailRow}>
                  <Text style={styles.detailLabel}>Uses Remaining:</Text>
                  <Text style={styles.detailValue}>
                    {selectedCard?.effectData?.usesRemaining === 999 ? 'Permanent' : 
                     selectedCard?.effectData?.usesRemaining || 0}
                  </Text>
                </View>

                <View style={styles.cardDetailRow}>
                  <Text style={styles.detailLabel}>Drawn at Turn:</Text>
                  <Text style={styles.detailValue}>{selectedCard?.drawnAt || 'Unknown'}</Text>
                </View>

                {selectedCard?.effectData?.description && (
                  <View style={styles.cardDetailRow}>
                    <Text style={styles.detailLabel}>Description:</Text>
                    <Text style={styles.detailValue}>{selectedCard.effectData.description}</Text>
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              
              {(selectedCard?.effectData?.usesRemaining || 0) > 0 && (
                <TouchableOpacity style={styles.useButton} onPress={handleUseCard}>
                  <Text style={styles.buttonText}>Use Card</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  activeCardsSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeCardsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#8B4513',
  },
  activeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  activeCardSymbol: {
    fontSize: 16,
    marginRight: 10,
  },
  activeCardInfo: {
    flex: 1,
  },
  activeCardTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  activeCardUses: {
    fontSize: 9,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  activeCardDescription: {
    fontSize: 8,
    color: '#888',
    fontStyle: 'italic',
  },
  cardStatusIndicator: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permanentIndicator: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  lastUseIndicator: {
    fontSize: 16,
    color: '#FF5722',
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardModalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  cardModalHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  cardModalSymbol: {
    fontSize: 48,
    marginBottom: 10,
  },
  cardModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
  },
  cardModalEffect: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  cardDetailsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B4513',
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  closeButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  useButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ActiveCardsDisplay;