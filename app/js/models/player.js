// js/models/player.js
export class Player {
  constructor(data) {
    this.id = data.id || Date.now();
    this.name = data.name || 'Unknown Player';
    this.position = data.position || 0;
    this.sacrificePoints = data.sacrificePoints || 0;
    this.livestock = data.livestock || 0;
    this.coins = data.coins || 0;
    this.helpers = data.helpers || {};
    this.color = data.color || '#FF4444';
    this.shape = data.shape || '⭐';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.lastUpdated = data.lastUpdated || new Date().toISOString();
    this.achievements = data.achievements || [];
    this.statistics = data.statistics || this.getDefaultStatistics();
    this.activeEffects = data.activeEffects || [];
    this.turnHistory = data.turnHistory || [];
  }

  static fromJSON(json) {
    return new Player(json);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      position: this.position,
      sacrificePoints: this.sacrificePoints,
      livestock: this.livestock,
      coins: this.coins,
      helpers: this.helpers,
      color: this.color,
      shape: this.shape,
      createdAt: this.createdAt,
      lastUpdated: this.lastUpdated,
      achievements: this.achievements,
      statistics: this.statistics,
      activeEffects: this.activeEffects,
      turnHistory: this.turnHistory,
    };
  }

  getDefaultStatistics() {
    return {
      questionsAnswered: 0,
      questionsCorrect: 0,
      questionsWithHelper: 0,
      questionsUnknown: 0,
      totalSPEarned: 0,
      totalSPLost: 0,
      helpersRecruited: 0,
      cardsDrawn: 0,
      angelCardsDrawn: 0,
      demonCardsDrawn: 0,
      specialSpacesLanded: 0,
      turnsPlayed: 0,
      gamesWon: 0,
      gamesPlayed: 0,
    };
  }

  updateStats(stats) {
    Object.keys(stats).forEach(key => {
      if (this.hasOwnProperty(key) && typeof stats[key] === 'number') {
        this[key] = Math.max(0, stats[key]);
      }
    });
    this.lastUpdated = new Date().toISOString();
  }

  addSacrificePoints(amount) {
    this.sacrificePoints = Math.max(0, this.sacrificePoints + amount);
    this.statistics.totalSPEarned += Math.max(0, amount);
    this.lastUpdated = new Date().toISOString();
    return this.sacrificePoints;
  }

  removeSacrificePoints(amount) {
    const actualLoss = Math.min(this.sacrificePoints, amount);
    this.sacrificePoints = Math.max(0, this.sacrificePoints - amount);
    this.statistics.totalSPLost += actualLoss;
    this.lastUpdated = new Date().toISOString();
    return this.sacrificePoints;
  }

  addLivestock(amount) {
    this.livestock = Math.max(0, this.livestock + amount);
    this.lastUpdated = new Date().toISOString();
    return this.livestock;
  }

  removeLivestock(amount) {
    this.livestock = Math.max(0, this.livestock - amount);
    this.lastUpdated = new Date().toISOString();
    return this.livestock;
  }

  addCoins(amount) {
    this.coins = Math.max(0, this.coins + amount);
    this.lastUpdated = new Date().toISOString();
    return this.coins;
  }

  removeCoins(amount) {
    this.coins = Math.max(0, this.coins - amount);
    this.lastUpdated = new Date().toISOString();
    return this.coins;
  }

  addHelperPoint(characterName) {
    if (!this.helpers[characterName]) {
      this.helpers[characterName] = 0;
    }
    this.helpers[characterName] = Math.min(10, this.helpers[characterName] + 1);
    
    // Check if helper was just recruited
    if (this.helpers[characterName] === 3) {
      this.statistics.helpersRecruited++;
      this.addAchievement(`Helper Recruited: ${characterName}`);
    }
    
    this.lastUpdated = new Date().toISOString();
    return this.helpers[characterName];
  }

  removeHelperPoint(characterName) {
    if (this.helpers[characterName]) {
      this.helpers[characterName] = Math.max(0, this.helpers[characterName] - 1);
      if (this.helpers[characterName] === 0) {
        delete this.helpers[characterName];
      }
    }
    this.lastUpdated = new Date().toISOString();
    return this.helpers[characterName] || 0;
  }

  removeHelper(characterName) {
    delete this.helpers[characterName];
    this.lastUpdated = new Date().toISOString();
  }

  hasHelper(characterName) {
    return (this.helpers[characterName] || 0) >= 3;
  }

  getHelperPoints(characterName) {
    return this.helpers[characterName] || 0;
  }

  getAllHelpers() {
    return Object.keys(this.helpers).filter(name => this.helpers[name] >= 3);
  }

  getHelperProgress() {
    const progress = {};
    Object.keys(this.helpers).forEach(name => {
      progress[name] = {
        points: this.helpers[name],
        isHelper: this.helpers[name] >= 3,
        progress: Math.min(100, (this.helpers[name] / 3) * 100)
      };
    });
    return progress;
  }

  moveToPosition(newPosition, boardSize = 26) {
    const oldPosition = this.position;
    this.position = newPosition % boardSize;
    this.lastUpdated = new Date().toISOString();
    
    // Add to turn history
    this.turnHistory.push({
      from: oldPosition,
      to: this.position,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 moves
    if (this.turnHistory.length > 50) {
      this.turnHistory = this.turnHistory.slice(-50);
    }
    
    // Check if passed start
    const passedStart = this.position < oldPosition || newPosition >= boardSize;
    if (passedStart) {
      this.addSacrificePoints(5);
      return true;
    }
    return false;
  }

  answerQuestion(isCorrect, usedHelper = false) {
    this.statistics.questionsAnswered++;
    
    if (isCorrect) {
      this.statistics.questionsCorrect++;
      if (usedHelper) {
        this.statistics.questionsWithHelper++;
      }
    } else {
      this.statistics.questionsUnknown++;
    }
    
    this.lastUpdated = new Date().toISOString();
  }

  drawCard(cardType) {
    this.statistics.cardsDrawn++;
    if (cardType === 'angel') {
      this.statistics.angelCardsDrawn++;
    } else if (cardType === 'demon') {
      this.statistics.demonCardsDrawn++;
    }
    this.lastUpdated = new Date().toISOString();
  }

  landOnSpecialSpace() {
    this.statistics.specialSpacesLanded++;
    this.lastUpdated = new Date().toISOString();
  }

  endTurn() {
    this.statistics.turnsPlayed++;
    this.lastUpdated = new Date().toISOString();
  }

  winGame() {
    this.statistics.gamesWon++;
    this.statistics.gamesPlayed++;
    this.addAchievement('Game Victory!');
    this.lastUpdated = new Date().toISOString();
  }

  loseGame() {
    this.statistics.gamesPlayed++;
    this.lastUpdated = new Date().toISOString();
  }

  addAchievement(achievement) {
    const achievementObj = {
      title: achievement,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    
    this.achievements.push(achievementObj);
    
    // Keep only last 100 achievements
    if (this.achievements.length > 100) {
      this.achievements = this.achievements.slice(-100);
    }
  }

  addActiveEffect(effect) {
    this.activeEffects.push({
      ...effect,
      appliedAt: new Date().toISOString(),
      id: Date.now()
    });
  }

  removeActiveEffect(effectId) {
    this.activeEffects = this.activeEffects.filter(effect => effect.id !== effectId);
  }

  getActiveEffects() {
    return this.activeEffects.filter(effect => {
      // Remove expired effects
      if (effect.duration && effect.duration > 0) {
        const appliedTime = new Date(effect.appliedAt).getTime();
        const currentTime = new Date().getTime();
        const elapsedTurns = Math.floor((currentTime - appliedTime) / (1000 * 60)); // Rough turn estimation
        
        return elapsedTurns < effect.duration;
      }
      return true; // Permanent effects
    });
  }

  getTotalValue() {
    return this.sacrificePoints + this.livestock + this.coins;
  }

  getNetWorth() {
    // More sophisticated calculation including helpers
    const helperValue = this.getAllHelpers().length * 5;
    return this.sacrificePoints + this.livestock + this.coins + helperValue;
  }

  isWinner(winCondition = 40) {
    return this.sacrificePoints >= winCondition;
  }

  canAfford(cost) {
    return this.sacrificePoints >= cost;
  }

  spend(amount) {
    if (this.canAfford(amount)) {
      this.removeSacrificePoints(amount);
      return true;
    }
    return false;
  }

  getDisplayName() {
    return this.name.length > 15 ? this.name.substring(0, 12) + '...' : this.name;
  }

  getWinRate() {
    return this.statistics.gamesPlayed > 0 ? 
      Math.round((this.statistics.gamesWon / this.statistics.gamesPlayed) * 100) : 0;
  }

  getAccuracy() {
    return this.statistics.questionsAnswered > 0 ? 
      Math.round((this.statistics.questionsCorrect / this.statistics.questionsAnswered) * 100) : 0;
  }

  getPlayTime() {
    const created = new Date(this.createdAt);
    const updated = new Date(this.lastUpdated);
    return Math.floor((updated - created) / (1000 * 60)); // Minutes
  }

  getRank() {
    // Simple ranking based on multiple factors
    const winWeight = this.statistics.gamesWon * 100;
    const accuracyWeight = this.getAccuracy() * 2;
    const helperWeight = this.getAllHelpers().length * 10;
    const spWeight = this.statistics.totalSPEarned * 0.1;
    
    return Math.floor(winWeight + accuracyWeight + helperWeight + spWeight);
  }

  getRecentActivity() {
    return {
      lastPlayed: this.lastUpdated,
      recentMoves: this.turnHistory.slice(-5),
      recentAchievements: this.achievements.slice(-3),
      activeEffectsCount: this.getActiveEffects().length
    };
  }

  clone() {
    return new Player(this.toJSON());
  }

  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push('Player name is required');
    }

    if (this.name.length > 50) {
      errors.push('Player name too long (max 50 characters)');
    }

    if (this.sacrificePoints < 0) {
      errors.push('Sacrifice points cannot be negative');
    }

    if (this.livestock < 0) {
      errors.push('Livestock cannot be negative');
    }

    if (this.coins < 0) {
      errors.push('Coins cannot be negative');
    }

    if (this.position < 0) {
      errors.push('Position cannot be negative');
    }

    if (!this.color || !/^#[0-9A-Fa-f]{6}$/.test(this.color)) {
      errors.push('Invalid color format (must be hex color)');
    }

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
      throw new Error('Invalid player export data');
    }

    const { exportedAt, version, ...playerData } = exportedData;
    return new Player(playerData);
  }

  reset() {
    // Reset game state but keep identity and statistics
    this.position = 0;
    this.sacrificePoints = 0;
    this.livestock = 0;
    this.coins = 0;
    this.helpers = {};
    this.activeEffects = [];
    this.turnHistory = [];
    this.lastUpdated = new Date().toISOString();
  }
}
// At the end of your player.js file, add:
export default Player; // or whatever your main class/object is