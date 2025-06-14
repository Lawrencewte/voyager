// js/models/question.js
export class Question {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.text = data.text || data.q || '';
    this.answer = data.answer || data.a || '';
    this.character = data.character || '';
    this.location = data.location || '';
    this.difficulty = data.difficulty || 'medium'; // easy, medium, hard
    this.scripture = data.scripture || '';
    this.category = data.category || '';
    this.points = data.points || 3;
    this.hints = data.hints || [];
    this.tags = data.tags || [];
    this.isAnswered = data.isAnswered || false;
    this.answeredBy = data.answeredBy || null;
    this.answeredAt = data.answeredAt || null;
    this.answerType = data.answerType || 'correct'; // 'correct', 'helper', 'unknown'
    this.timesAttempted = data.timesAttempted || 0;
    this.successRate = data.successRate || 0;
    this.averageTime = data.averageTime || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.lastModified = data.lastModified || new Date().toISOString();
  }

  generateId() {
    return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static fromJSON(json) {
    return new Question(json);
  }

  toJSON() {
    return {
      id: this.id,
      text: this.text,
      answer: this.answer,
      character: this.character,
      location: this.location,
      difficulty: this.difficulty,
      scripture: this.scripture,
      category: this.category,
      points: this.points,
      hints: this.hints,
      tags: this.tags,
      isAnswered: this.isAnswered,
      answeredBy: this.answeredBy,
      answeredAt: this.answeredAt,
      answerType: this.answerType,
      timesAttempted: this.timesAttempted,
      successRate: this.successRate,
      averageTime: this.averageTime,
      createdAt: this.createdAt,
      lastModified: this.lastModified,
    };
  }

  markAsAnswered(playerId, answerType = 'correct', responseTime = 0) {
    this.isAnswered = true;
    this.answeredBy = playerId;
    this.answeredAt = new Date().toISOString();
    this.answerType = answerType;
    this.timesAttempted++;
    
    // Update success rate
    const wasCorrect = answerType === 'correct' || answerType === 'helper';
    if (wasCorrect) {
      this.successRate = ((this.successRate * (this.timesAttempted - 1)) + 1) / this.timesAttempted;
    } else {
      this.successRate = (this.successRate * (this.timesAttempted - 1)) / this.timesAttempted;
    }
    
    // Update average response time
    if (responseTime > 0) {
      this.averageTime = ((this.averageTime * (this.timesAttempted - 1)) + responseTime) / this.timesAttempted;
    }
    
    this.lastModified = new Date().toISOString();
  }

  markAsUnanswered() {
    this.isAnswered = false;
    this.answeredBy = null;
    this.answeredAt = null;
    this.answerType = 'correct';
    this.lastModified = new Date().toISOString();
  }

  addHint(hint) {
    if (typeof hint === 'string') {
      this.hints.push({
        text: hint,
        addedAt: new Date().toISOString(),
        id: Date.now()
      });
    } else {
      this.hints.push({
        ...hint,
        addedAt: new Date().toISOString(),
        id: hint.id || Date.now()
      });
    }
    this.lastModified = new Date().toISOString();
  }

  removeHint(hintId) {
    this.hints = this.hints.filter(hint => 
      (typeof hint === 'string' ? false : hint.id !== hintId)
    );
    this.lastModified = new Date().toISOString();
  }

  getHints() {
    return this.hints.map(hint => 
      typeof hint === 'string' ? { text: hint, id: null } : hint
    );
  }

  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.lastModified = new Date().toISOString();
    }
  }

  removeTag(tag) {
    this.tags = this.tags.filter(t => t !== tag);
    this.lastModified = new Date().toISOString();
  }

  hasTag(tag) {
    return this.tags.includes(tag);
  }

  getDifficultyInfo() {
    const difficultyData = {
      easy: {
        multiplier: 0.8,
        color: '#4CAF50',
        label: 'Easy',
        description: 'Basic knowledge question'
      },
      medium: {
        multiplier: 1.0,
        color: '#FF9800',
        label: 'Medium',
        description: 'Standard difficulty question'
      },
      hard: {
        multiplier: 1.5,
        color: '#f44336',
        label: 'Hard',
        description: 'Advanced knowledge required'
      },
      expert: {
        multiplier: 2.0,
        color: '#9C27B0',
        label: 'Expert',
        description: 'Deep theological knowledge'
      }
    };

    return difficultyData[this.difficulty] || difficultyData.medium;
  }

  getDifficultyMultiplier() {
    return this.getDifficultyInfo().multiplier;
  }

  getAdjustedPoints() {
    return Math.round(this.points * this.getDifficultyMultiplier());
  }

  getHelperPoints() {
    // Helper answers give slightly fewer points
    return Math.max(1, Math.round(this.getAdjustedPoints() * 0.67));
  }

  getUnknownPoints() {
    // Unknown answers give minimal points
    return 1;
  }

  getPointsForAnswerType(answerType) {
    switch (answerType) {
      case 'correct':
        return this.getAdjustedPoints();
      case 'helper':
        return this.getHelperPoints();
      case 'unknown':
        return this.getUnknownPoints();
      default:
        return 0;
    }
  }

  isValid() {
    return this.text.trim().length > 0 && 
           this.answer.trim().length > 0 &&
           this.character.trim().length > 0;
  }

  getUniqueId() {
    return `${this.location}-${this.character}-${this.id}`;
  }

  getDisplayText() {
    // Clean up question text for display
    let displayText = this.text.trim();
    
    // Ensure question ends with question mark
    if (!displayText.endsWith('?')) {
      displayText += '?';
    }
    
    return displayText;
  }

  getDisplayAnswer() {
    // Clean up answer text for display
    return this.answer.trim();
  }

  getScriptureReference() {
    if (!this.scripture) return null;
    
    // Extract book, chapter, and verse from scripture reference
    const match = this.scripture.match(/^([^0-9]+)\s*(\d+):?(\d+)?/);
    if (match) {
      return {
        book: match[1].trim(),
        chapter: parseInt(match[2]),
        verse: match[3] ? parseInt(match[3]) : null,
        full: this.scripture
      };
    }
    
    return { full: this.scripture };
  }

  getKeywords() {
    // Extract potential keywords from question and answer
    const text = `${this.text} ${this.answer}`.toLowerCase();
    const words = text.match(/\b[a-z]{3,}\b/g) || [];
    
    // Filter out common words
    const commonWords = ['the', 'and', 'was', 'his', 'that', 'said', 'who', 'what', 'when', 'where', 'how', 'why', 'did', 'had', 'has', 'have', 'were', 'been', 'they', 'them', 'their', 'will', 'with', 'from', 'this', 'that', 'would', 'could', 'should'];
    
    return [...new Set(words.filter(word => !commonWords.includes(word)))];
  }

  search(searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const score = {
      text: 0,
      answer: 0,
      character: 0,
      scripture: 0,
      tags: 0,
      total: 0
    };

    // Search in question text
    if (this.text.toLowerCase().includes(lowerSearchTerm)) {
      score.text = this.text.toLowerCase().split(lowerSearchTerm).length - 1;
    }

    // Search in answer
    if (this.answer.toLowerCase().includes(lowerSearchTerm)) {
      score.answer = this.answer.toLowerCase().split(lowerSearchTerm).length - 1;
    }

    // Search in character name
    if (this.character.toLowerCase().includes(lowerSearchTerm)) {
      score.character = 10; // Higher weight for character matches
    }

    // Search in scripture
    if (this.scripture.toLowerCase().includes(lowerSearchTerm)) {
      score.scripture = 5;
    }

    // Search in tags
    score.tags = this.tags.filter(tag => 
      tag.toLowerCase().includes(lowerSearchTerm)
    ).length * 3;

    score.total = score.text + score.answer + score.character + score.scripture + score.tags;
    
    return {
      matches: score.total > 0,
      score: score,
      question: this
    };
  }

  getRelatedQuestions(allQuestions, limit = 5) {
    const related = [];
    const myKeywords = this.getKeywords();
    
    allQuestions.forEach(question => {
      if (question.id === this.id) return;
      
      let relevanceScore = 0;
      
      // Same character
      if (question.character === this.character) {
        relevanceScore += 10;
      }
      
      // Same location
      if (question.location === this.location) {
        relevanceScore += 5;
      }
      
      // Same difficulty
      if (question.difficulty === this.difficulty) {
        relevanceScore += 2;
      }
      
      // Shared keywords
      const questionKeywords = question.getKeywords();
      const sharedKeywords = myKeywords.filter(keyword => 
        questionKeywords.includes(keyword)
      );
      relevanceScore += sharedKeywords.length;
      
      // Shared tags
      const sharedTags = this.tags.filter(tag => 
        question.tags.includes(tag)
      );
      relevanceScore += sharedTags.length * 3;
      
      if (relevanceScore > 0) {
        related.push({
          question,
          relevanceScore
        });
      }
    });
    
    return related
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)
      .map(item => item.question);
  }

  getStatistics() {
    return {
      timesAttempted: this.timesAttempted,
      successRate: Math.round(this.successRate * 100),
      averageResponseTime: Math.round(this.averageTime),
      difficulty: this.difficulty,
      points: this.getAdjustedPoints(),
      lastAnswered: this.answeredAt,
      isPopular: this.timesAttempted > 5,
      isEasy: this.successRate > 0.8,
      isHard: this.successRate < 0.4
    };
  }

  clone() {
    return new Question(this.toJSON());
  }

  validate() {
    const errors = [];

    if (!this.text || this.text.trim().length === 0) {
      errors.push('Question text is required');
    }

    if (this.text.length > 500) {
      errors.push('Question text too long (max 500 characters)');
    }

    if (!this.answer || this.answer.trim().length === 0) {
      errors.push('Answer text is required');
    }

    if (this.answer.length > 1000) {
      errors.push('Answer text too long (max 1000 characters)');
    }

    if (!this.character || this.character.trim().length === 0) {
      errors.push('Character name is required');
    }

    if (!['easy', 'medium', 'hard', 'expert'].includes(this.difficulty)) {
      errors.push('Invalid difficulty level');
    }

    if (this.points < 1 || this.points > 10) {
      errors.push('Points must be between 1 and 10');
    }

    // Validate hints
    this.hints.forEach((hint, index) => {
      if (typeof hint === 'string') {
        if (hint.trim().length === 0) {
          errors.push(`Hint ${index + 1} cannot be empty`);
        }
      } else if (typeof hint === 'object') {
        if (!hint.text || hint.text.trim().length === 0) {
          errors.push(`Hint ${index + 1} text cannot be empty`);
        }
      }
    });

    // Validate tags
    this.tags.forEach((tag, index) => {
      if (typeof tag !== 'string' || tag.trim().length === 0) {
        errors.push(`Tag ${index + 1} must be a non-empty string`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  export() {
    return {
      ...this.toJSON(),
      exportedAt: new Date().toISOString(),
      version: '2.0.0'
    };
  }

  static import(exportedData) {
    if (!exportedData || typeof exportedData !== 'object') {
      throw new Error('Invalid question export data');
    }

    const { exportedAt, version, ...questionData } = exportedData;
    return new Question(questionData);
  }

  static createFromSimple(questionText, answerText, character, location = '') {
    return new Question({
      text: questionText,
      answer: answerText,
      character: character,
      location: location
    });
  }

  static parseFromString(questionString, character, location = '') {
    // Parse questions in format: "Q: Question text? A: Answer text"
    const match = questionString.match(/^Q:\s*(.+?)\?\s*A:\s*(.+)$/i);
    if (match) {
      return new Question({
        text: match[1].trim() + '?',
        answer: match[2].trim(),
        character: character,
        location: location
      });
    }
    
    throw new Error('Invalid question format. Use: "Q: Question? A: Answer"');
  }

  static bulkCreate(questionsData, character, location = '') {
    return questionsData.map(data => {
      if (typeof data === 'string') {
        return Question.parseFromString(data, character, location);
      } else if (data.q && data.a) {
        return new Question({
          text: data.q,
          answer: data.a,
          character: character,
          location: location,
          ...data
        });
      } else {
        return new Question({
          character: character,
          location: location,
          ...data
        });
      }
    });
  }

  updateDifficulty(newDifficulty) {
    if (['easy', 'medium', 'hard', 'expert'].includes(newDifficulty)) {
      this.difficulty = newDifficulty;
      this.lastModified = new Date().toISOString();
    }
  }

  updateText(newText) {
    this.text = newText.trim();
    this.lastModified = new Date().toISOString();
  }

  updateAnswer(newAnswer) {
    this.answer = newAnswer.trim();
    this.lastModified = new Date().toISOString();
  }

  addScripture(scripture) {
    this.scripture = scripture.trim();
    this.lastModified = new Date().toISOString();
  }

  setCategory(category) {
    this.category = category.trim();
    this.lastModified = new Date().toISOString();
  }

  setPoints(points) {
    if (points >= 1 && points <= 10) {
      this.points = points;
      this.lastModified = new Date().toISOString();
    }
  }

  reset() {
    // Reset answer state but keep the question data
    this.isAnswered = false;
    this.answeredBy = null;
    this.answeredAt = null;
    this.answerType = 'correct';
    this.lastModified = new Date().toISOString();
  }

  getAge() {
    // Return age in days
    const created = new Date(this.createdAt);
    const now = new Date();
    return Math.floor((now - created) / (1000 * 60 * 60 * 24));
  }

  isRecent() {
    return this.getAge() <= 7; // Created within last week
  }

  needsReview() {
    // Questions that might need review
    return this.timesAttempted > 10 && this.successRate < 0.3;
  }

  isTooEasy() {
    return this.timesAttempted > 5 && this.successRate > 0.9;
  }
}
// At the end of your question.js file, add:
export default Question; // or whatever your main class/object is