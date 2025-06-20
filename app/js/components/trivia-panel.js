// js/components/trivia-panel.js - Updated without card effects
import { useEffect, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const TriviaPanel = ({ gameState, config, selectedLocation, onAnswerQuestion }) => {
  const [expandedCharacters, setExpandedCharacters] = useState(new Set());
  const [showAnswers, setShowAnswers] = useState(new Set());

  // Helper function to check if player has helpers from this location
  const hasLocationHelper = (currentPlayer, locationName, locationData) => {
    if (!currentPlayer || !locationData) return false;
    
    // Check if player has any character from this location as a helper (3+ points)
    const locationCharacters = Object.keys(locationData.characters);
    return locationCharacters.some(characterName => 
      currentPlayer.helpers[characterName] >= 3
    );
  };

  // Clear expanded characters when location changes
  useEffect(() => {
    setExpandedCharacters(new Set());
    setShowAnswers(new Set());
  }, [selectedLocation]);

  const toggleCharacterExpansion = (characterName) => {
    const newExpanded = new Set(expandedCharacters);
    if (newExpanded.has(characterName)) {
      newExpanded.delete(characterName);
    } else {
      newExpanded.add(characterName);
    }
    setExpandedCharacters(newExpanded);
  };

  const toggleAnswerVisibility = (questionKey) => {
    const newShowAnswers = new Set(showAnswers);
    if (newShowAnswers.has(questionKey)) {
      newShowAnswers.delete(questionKey);
    } else {
      newShowAnswers.add(questionKey);
    }
    setShowAnswers(newShowAnswers);
  };

  const handleAnswerQuestion = (characterName, spAmount, questionId, helperIsClaimed = false) => {
    if (gameState.answeredQuestions.has(questionId)) {
      Alert.alert('Already Answered', 'This question has already been answered!');
      return;
    }

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const locationData = config.triviaDatabase[selectedLocation];
    const hasAnyLocationHelper = hasLocationHelper(currentPlayer, selectedLocation, locationData);

    if (spAmount === 2 && !hasAnyLocationHelper) {
      Alert.alert('No Helper', 'You need a Helper from this location to use hints!');
      return;
    }

    // Call the parent's answer function
    onAnswerQuestion(characterName, spAmount, questionId);
  };

  const renderLocationTrivia = (locationName) => {
    const locationData = config.triviaDatabase[locationName];
    
    if (!locationData) {
      return (
        <View style={styles.noTrivia}>
          <Text style={styles.noTriviaText}>No trivia data available for this location.</Text>
        </View>
      );
    }

    return (
      <View>
        <View style={styles.triviaHeader}>
          <Text style={styles.triviaLocation}>{locationName}</Text>
          <Text style={styles.triviaSignificance}>{locationData.significance}</Text>
        </View>

        {Object.keys(locationData.characters).map(characterName => {
          const questions = locationData.characters[characterName];
          const isExpanded = expandedCharacters.has(characterName);
          
          return (
            <View key={characterName} style={styles.characterSection}>
              <TouchableOpacity
                style={styles.characterHeader}
                onPress={() => toggleCharacterExpansion(characterName)}
              >
                <Text style={styles.characterName}>{characterName}</Text>
                <Text style={styles.questionCount}>
                  {questions.length} questions {isExpanded ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.characterQuestions}>
                  {questions.map((question, index) => {
                    const questionId = `${locationName}-${characterName}-${index}`;
                    const isAnswered = gameState.answeredQuestions.has(questionId);
                    const questionKey = `${characterName}-${index}`;
                    const showAnswer = showAnswers.has(questionKey);
                    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
                    const hasRelevantHelper = hasLocationHelper(currentPlayer, locationName, locationData);
                    const helperIsClaimed = gameState.claimedHelpers.has(characterName);

                    return (
                      <View key={questionId} style={[styles.questionItem, isAnswered && styles.answeredQuestion]}>
                        <TouchableOpacity onPress={() => toggleAnswerVisibility(questionKey)}>
                          <Text style={[styles.questionText, isAnswered && styles.answeredQuestionText]}>
                            {question.q}
                          </Text>
                        </TouchableOpacity>

                        {showAnswer && (
                          <View style={styles.questionAnswer}>
                            <Text style={styles.answerText}>
                              <Text style={styles.answerLabel}>Answer: </Text>
                              {question.a}
                            </Text>
                          </View>
                        )}

                        {!isAnswered ? (
                          <View style={styles.answerButtons}>
                            <TouchableOpacity
                              style={[styles.answerButton, styles.correctButton]}
                              onPress={() => handleAnswerQuestion(characterName, 3, questionId)}
                            >
                              <Text style={styles.buttonText}>Correct (3 SP)</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[
                                styles.answerButton,
                                styles.helperButton,
                                !hasRelevantHelper && styles.disabledButton
                              ]}
                              onPress={() => handleAnswerQuestion(characterName, 2, questionId)}
                              disabled={!hasRelevantHelper}
                            >
                              <Text style={[styles.buttonText, !hasRelevantHelper && styles.disabledButtonText]}>
                                With Helper (2 SP)
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[styles.answerButton, styles.unknownButton]}
                              onPress={() => handleAnswerQuestion(characterName, 1, questionId, helperIsClaimed)}
                            >
                              <Text style={styles.buttonText}>Don't Know (1 SP)</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View style={styles.answeredSection}>
                            <Text style={styles.answeredText}>✓ Question answered</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.panelTitle}>📖 Biblical Trivia</Text>
      
      <View style={styles.triviaNote}>
        <Text style={styles.triviaNodeText}>
          💡 <Text style={styles.bold}>Study Tip:</Text> For unclear answers, review the cited scripture passages in your Bible for greater context and understanding!
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {selectedLocation ? (
          renderLocationTrivia(selectedLocation)
        ) : (
          <View style={styles.noTrivia}>
            <Text style={styles.noTriviaText}>
              Move your player to a location or click on a board location to view its trivia questions and characters
            </Text>
          </View>
        )}
      </ScrollView>

      
      
    </View>
  );
};

const isSmallScreen = width < 768;
const scaleFactor = isSmallScreen ? 0.85 : 1;

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
  triviaNote: {
    backgroundColor: '#e8f5e8',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 10,
    padding: 12 * scaleFactor,
    marginBottom: 15 * scaleFactor,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  triviaNodeText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#2d5a2d',
    fontSize: Math.max(11, 12 * scaleFactor),
    lineHeight: Math.max(14, 16 * scaleFactor),
  },
  bold: {
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  triviaHeader: {
    backgroundColor: '#8B4513',
    borderRadius: 10,
    padding: 15 * scaleFactor,
    marginBottom: 15 * scaleFactor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  triviaLocation: {
    fontSize: Math.max(18, 20 * scaleFactor),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5 * scaleFactor,
    textAlign: 'center',
  },
  triviaSignificance: {
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontSize: Math.max(12, 14 * scaleFactor),
    lineHeight: Math.max(16, 18 * scaleFactor),
  },
  characterSection: {
    marginBottom: 15 * scaleFactor,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  characterHeader: {
    backgroundColor: '#4CAF50',
    padding: 12 * scaleFactor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  characterName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: Math.max(14, 16 * scaleFactor),
    flex: 1,
  },
  questionCount: {
    color: 'white',
    fontSize: Math.max(12, 14 * scaleFactor),
    fontWeight: '600',
  },
  characterQuestions: {
    padding: 12 * scaleFactor,
    backgroundColor: '#f9f9f9',
  },
  questionItem: {
    marginBottom: 12 * scaleFactor,
    padding: 10 * scaleFactor,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  answeredQuestion: {
    opacity: 0.6,
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  questionText: {
    fontWeight: 'bold',
    marginBottom: 8 * scaleFactor,
    color: '#2d5a2d',
    fontSize: Math.max(12, 14 * scaleFactor),
    lineHeight: Math.max(16, 18 * scaleFactor),
  },
  answeredQuestionText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  questionAnswer: {
    backgroundColor: '#e8f5e8',
    padding: 8 * scaleFactor,
    borderRadius: 5,
    marginTop: 8 * scaleFactor,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  answerText: {
    fontStyle: 'italic',
    color: '#2d5a2d',
    fontSize: Math.max(11, 13 * scaleFactor),
    lineHeight: Math.max(15, 17 * scaleFactor),
  },
  answerLabel: {
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  answerButtons: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'space-between',
    marginTop: 10 * scaleFactor,
    gap: 6 * scaleFactor,
  },
  answerButton: {
    paddingVertical: 8 * scaleFactor,
    paddingHorizontal: 10 * scaleFactor,
    borderRadius: 6,
    flex: isSmallScreen ? 0 : 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  correctButton: {
    backgroundColor: '#4CAF50',
  },
  helperButton: {
    backgroundColor: '#2196F3',
  },
  unknownButton: {
    backgroundColor: '#FF9800',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: Math.max(10, 12 * scaleFactor),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledButtonText: {
    color: '#666',
  },
  answeredSection: {
    marginTop: 10 * scaleFactor,
    alignItems: 'center',
    padding: 8 * scaleFactor,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  answeredText: {
    fontSize: Math.max(11, 13 * scaleFactor),
    color: '#666',
    fontStyle: 'italic',
  },
  noTrivia: {
    padding: 30 * scaleFactor,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  noTriviaText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    fontSize: Math.max(12, 14 * scaleFactor),
    lineHeight: Math.max(16, 18 * scaleFactor),
  },
  // Development helper styles
  devLocationSelector: {
    marginTop: 10 * scaleFactor,
    paddingTop: 10 * scaleFactor,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  devSelectorTitle: {
    fontSize: Math.max(10, 12 * scaleFactor),
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8 * scaleFactor,
  },
  devLocationButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6 * scaleFactor,
    paddingHorizontal: 10 * scaleFactor,
    borderRadius: 12,
    marginRight: 6 * scaleFactor,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedDevLocationButton: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  devLocationButtonText: {
    fontSize: Math.max(9, 11 * scaleFactor),
    color: '#333',
    fontWeight: '500',
  },
  selectedDevLocationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TriviaPanel;