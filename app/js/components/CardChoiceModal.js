// Fixed CardChoiceModal.js with comprehensive choice handling
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CardChoiceModal = ({ 
  visible, 
  card, 
  gameState,
  gameConfig,
  onChoice, 
  onCancel 
}) => {
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  const availableHelpers = [
    'Abraham', 'Sarah', 'Moses', 'David', 'Daniel', 'Esther', 'Joshua', 'Samuel',
    'Elijah', 'Elisha', 'Isaiah', 'Jeremiah', 'Job', 'Noah', 'Joseph', 'Jacob',
    'Isaac', 'Rebecca', 'Rachel', 'Leah', 'Ruth', 'Hannah', 'Deborah', 'Gideon'
  ];
  
  const renderChoiceContent = () => {
    if (!card?.effectData) return null;

    // Handle teleportation choices
    if (card.effectData.type === 'teleport' || card.id === 'lots_deliverers' || card.id === 'philips_guide') {
      return (
        <View>
          <Text style={styles.choiceTitle}>Choose a location to move to:</Text>
          <ScrollView style={styles.choiceList}>
            {gameConfig?.boardPositions?.map((location, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.choiceOption,
                  selectedLocation === index && styles.selectedOption
                ]}
                onPress={() => setSelectedLocation(index)}
              >
                <Text style={styles.choiceText}>
                  {location.name} - {location.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }
    
    // Handle helper selection choices
    if (card.effectData.chooseHelper || card.effectData.type === 'instant_helper' || 
        card.effectData.type === 'helper_boost' || card.id === 'abrahams_visitors' || 
        card.id === 'samsons_announcer') {
      return (
        <View>
          <Text style={styles.choiceTitle}>Choose a character to gain points with:</Text>
          <ScrollView style={styles.choiceList}>
            {availableHelpers.map((helper) => (
              <TouchableOpacity
                key={helper}
                style={[
                  styles.choiceOption,
                  selectedHelper === helper && styles.selectedOption
                ]}
                onPress={() => setSelectedHelper(helper)}
              >
                <Text style={styles.choiceText}>{helper}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }

    // Handle player selection choices (for cards affecting other players)
    if (card.effectData.type === 'steal_sp' || card.effectData.type === 'player_inspect' || 
        card.effectData.type === 'player_protection' || card.effectData.type === 'persecution') {
      const otherPlayers = gameState.players.filter((_, index) => index !== gameState.currentPlayerIndex);
      
      return (
        <View>
          <Text style={styles.choiceTitle}>Choose a player:</Text>
          <ScrollView style={styles.choiceList}>
            {otherPlayers.map((player, index) => (
              <TouchableOpacity
                key={player.id}
                style={[
                  styles.choiceOption,
                  selectedPlayer === player.id && styles.selectedOption
                ]}
                onPress={() => setSelectedPlayer(player.id)}
              >
                <Text style={styles.choiceText}>
                  {player.name} - {player.sacrificePoints} SP
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }

    // Handle binary choices (pay SP or lose turn, etc.)
    if (card.effectData.type === 'pay_or_skip' || card.effectData.type === 'sp_or_vulnerability' || 
        card.effectData.type === 'power_trade' || card.effectData.type === 'final_judgment') {
      return (
        <View>
          <Text style={styles.choiceTitle}>Choose your response:</Text>
          <View style={styles.binaryChoiceContainer}>
            <TouchableOpacity
              style={[styles.binaryChoice, styles.option1]}
              onPress={() => {
                if (card.effectData.type === 'pay_or_skip') {
                  onChoice({ type: 'pay_sp', amount: card.effectData.spCost });
                } else if (card.effectData.type === 'sp_or_vulnerability') {
                  onChoice({ type: 'lose_sp', amount: card.effectData.spLoss });
                } else if (card.effectData.type === 'power_trade') {
                  onChoice({ type: 'accept_trade', spGain: card.effectData.spGain });
                } else if (card.effectData.type === 'final_judgment') {
                  onChoice({ type: 'pay_sp', amount: card.effectData.spCost });
                }
              }}
            >
              <Text style={styles.binaryChoiceText}>
                {card.effectData.type === 'pay_or_skip' ? `Pay ${card.effectData.spCost} SP` :
                 card.effectData.type === 'sp_or_vulnerability' ? `Lose ${card.effectData.spLoss} SP` :
                 card.effectData.type === 'power_trade' ? `Gain ${card.effectData.spGain} SP, Lose All Helpers` :
                 card.effectData.type === 'final_judgment' ? `Pay ${card.effectData.spCost} SP` : 'Option 1'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.binaryChoice, styles.option2]}
              onPress={() => {
                if (card.effectData.type === 'pay_or_skip') {
                  onChoice({ type: 'skip_turn' });
                } else if (card.effectData.type === 'sp_or_vulnerability') {
                  onChoice({ type: 'accept_vulnerability' });
                } else if (card.effectData.type === 'power_trade') {
                  onChoice({ type: 'decline_trade' });
                } else if (card.effectData.type === 'final_judgment') {
                  onChoice({ type: 'lose_livestock' });
                }
              }}
            >
              <Text style={styles.binaryChoiceText}>
                {card.effectData.type === 'pay_or_skip' ? 'Lose Next Turn' :
                 card.effectData.type === 'sp_or_vulnerability' ? 'Take Double Attack Damage' :
                 card.effectData.type === 'power_trade' ? 'Decline (No Effect)' :
                 card.effectData.type === 'final_judgment' ? 'Lose All Livestock' : 'Option 2'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.choiceTitle}>Card effect will be applied automatically.</Text>
        <TouchableOpacity
          style={styles.autoApplyButton}
          onPress={() => onChoice({ type: 'auto_apply' })}
        >
          <Text style={styles.autoApplyText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const handleConfirm = () => {
    if (card?.effectData?.type === 'teleport' && selectedLocation !== null) {
      onChoice({ type: 'teleport', location: selectedLocation });
    } else if ((card?.effectData?.chooseHelper || card?.effectData?.type === 'instant_helper' || 
               card?.effectData?.type === 'helper_boost') && selectedHelper) {
      onChoice({ 
        type: 'helper', 
        helper: selectedHelper, 
        spGain: card.effectData.spGain || 3,
        pointsGain: card.effectData.type === 'helper_boost' ? 2 : 1
      });
    } else if (selectedPlayer !== null) {
      onChoice({ 
        type: card.effectData.type, 
        targetPlayer: selectedPlayer,
        ...card.effectData
      });
    } else {
      onChoice({ type: 'auto_apply' });
    }
    
    // Reset selections
    setSelectedHelper(null);
    setSelectedLocation(null);
    setSelectedPlayer(null);
  };
  
  const hasValidSelection = selectedHelper !== null || selectedLocation !== null || selectedPlayer !== null ||
    card?.effectData?.type === 'pay_or_skip' || card?.effectData?.type === 'sp_or_vulnerability' ||
    card?.effectData?.type === 'power_trade' || card?.effectData?.type === 'final_judgment';
  
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.cardTitle}>{card?.symbol} {card?.title}</Text>
          <Text style={styles.cardEffect}>{card?.effect}</Text>
          
          {renderChoiceContent()}
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.confirmButton,
                !hasValidSelection && styles.disabledButton
              ]} 
              onPress={handleConfirm}
              disabled={!hasValidSelection}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#8B4513',
  },
  cardEffect: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  choiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  choiceList: {
    maxHeight: 200,
    marginBottom: 20,
  },
  choiceOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e8',
  },
  choiceText: {
    fontSize: 14,
    color: '#333',
  },
  binaryChoiceContainer: {
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
  },
  binaryChoice: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  option1: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  option2: {
    backgroundColor: '#fff3e0',
    borderColor: '#FF9800',
    borderWidth: 2,
  },
  binaryChoiceText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  autoApplyButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  autoApplyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    flex: 0.45,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flex: 0.45,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CardChoiceModal;