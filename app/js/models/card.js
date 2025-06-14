// js/models/card.js
export class Card {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.title = data.title || '';
    this.type = data.type || 'angel'; // 'angel' or 'demon'
    this.scripture = data.scripture || '';
    this.effect = data.effect || '';
    this.symbol = data.symbol || '👼';
    this.isPermanent = data.isPermanent || false;
    this.duration = data.duration || 0; // turns, 0 = instant
    this.category = data.category || '';
    this.rarity = data.rarity || 'common'; // common, uncommon, rare, legendary
    this.flavorText = data.flavorText || '';
    this.mechanicalEffect = data.mechanicalEffect || null; // For programmatic effects
    this.requirements = data.requirements || {}; // Conditions for card use
    this.restrictions = data.restrictions || {}; // Limitations on card use
    this.timesDrawn = data.timesDrawn || 0;
    this.timesUsed = data.timesUsed || 0;
    this.averageImpact = data.averageImpact || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.lastDrawn = data.lastDrawn || null;
    this.lastUsed = data.lastUsed || null;
  }

  generateId() {
    return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static fromJSON(json) {
    return new Card(json);
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      type: this.type,
      scripture: this.scripture,
      effect: this.effect,
      symbol: this.symbol,
      isPermanent: this.isPermanent,
      duration: this.duration,
      category: this.category,
      rarity: this.rarity,
      flavorText: this.flavorText,
      mechanicalEffect: this.mechanicalEffect,
      requirements: this.requirements,
      restrictions: this.restrictions,
      timesDrawn: this.timesDrawn,
      timesUsed: this.timesUsed,
      averageImpact: this.averageImpact,
      createdAt: this.createdAt,
      lastDrawn: this.lastDrawn,
      lastUsed: this.lastUsed,
    };
  }

  isAngel() {
    return this.type === 'angel';
  }

  isDemon() {
    return this.type === 'demon';
  }

  isInstant() {
    return this.duration === 0 && !this.isPermanent;
  }

  isTemporary() {
    return this.duration > 0;
  }

  hasEffect() {
    return this.effect.trim().length > 0;
  }

  hasMechanicalEffect() {
    return this.mechanicalEffect !== null && 
           typeof this.mechanicalEffect === 'object';
  }

  getRarityInfo() {
    const rarityData = {
      common: {
        color: '#CCCCCC',
        weight: 70,
        label: 'Common',
        description: 'Basic effects'
      },
      uncommon: {
        color: '#4CAF50',
        weight: 20,
        label: 'Uncommon',
        description: 'Moderate effects'
      },
      rare: {
        color: '#2196F3',
        weight: 8,
        label: 'Rare',
        description: 'Powerful effects'
      },
      legendary: {
        color: '#FF9800',
        weight: 2,
        label: 'Legendary',
        description: 'Game-changing effects'
      }
    };

    return rarityData[this.rarity] || rarityData.common;
  }

  getRarityColor() {
    return this.getRarityInfo().color;
  }

  getTypeColor() {
    return this.isAngel() ? '#FFD700' : '#8B0000';
  }

  getBackgroundGradient() {
    if (this.isAngel()) {
      return ['#FFD700', '#FFF8DC'];
    } else {
      return ['#8B0000', '#2F0000'];
    }
  }

  getTextColor() {
    return this.isAngel() ? '#8B4513' : '#FFD700';
  }

  getBorderColor() {
    return this.isAngel() ? '#DAA520' : '#4B0000';
  }

  markAsDrawn(playerId = null) {
    this.timesDrawn++;
    this.lastDrawn = new Date().toISOString();
    
    if (playerId) {
      // Could track which player drew it
      this.lastDrawnBy = playerId;
    }
  }

  markAsUsed(playerId = null, impact = 0) {
    this.timesUsed++;
    this.lastUsed = new Date().toISOString();
    
    // Update average impact
    if (impact !== 0) {
      this.averageImpact = ((this.averageImpact * (this.timesUsed - 1)) + impact) / this.timesUsed;
    }
    
    if (playerId) {
      this.lastUsedBy = playerId;
    }
  }

  canBeUsedBy(player, gameState) {
    // Check requirements
    if (this.requirements.minSP && player.sacrificePoints < this.requirements.minSP) {
      return { canUse: false, reason: `Requires at least ${this.requirements.minSP} SP` };
    }

    if (this.requirements.minHelpers && player.getAllHelpers().length < this.requirements.minHelpers) {
      return { canUse: false, reason: `Requires at least ${this.requirements.minHelpers} helpers` };
    }

    if (this.requirements.specificHelper) {
      if (!player.hasHelper(this.requirements.specificHelper)) {
        return { canUse: false, reason: `Requires ${this.requirements.specificHelper} as helper` };
      }
    }

    if (this.requirements.minTurn && gameState.turnNumber < this.requirements.minTurn) {
      return { canUse: false, reason: `Can only be used after turn ${this.requirements.minTurn}` };
    }

    // Check restrictions
    if (this.restrictions.maxUsesPerGame) {
      const usesThisGame = gameState.cardsUsedThisGame?.filter(card => card.id === this.id)?.length || 0;
      if (usesThisGame >= this.restrictions.maxUsesPerGame) {
        return { canUse: false, reason: 'Maximum uses per game reached' };
      }
    }

    if (this.restrictions.oncePerPlayer) {
      const playerUsedBefore = gameState.cardsUsedByPlayer?.[player.id]?.includes(this.id) || false;
      if (playerUsedBefore) {
        return { canUse: false, reason: 'Can only be used once per player' };
      }
    }

    if (this.restrictions.notOnSpecialSpace && gameState.currentLocation?.type === 'special') {
      return { canUse: false, reason: 'Cannot be used on special spaces' };
    }

    return { canUse: true };
  }

  getEffectPreview(player, gameState) {
    // Generate a preview of what this card would do
    if (!this.hasMechanicalEffect()) {
      return this.effect;
    }

    const effect = this.mechanicalEffect;
    let preview = this.effect;

    // Replace placeholders with actual values
    if (effect.spGain) {
      preview = preview.replace(/\{\{spGain\}\}/, effect.spGain);
    }

    if (effect.spLoss) {
      preview = preview.replace(/\{\{spLoss\}\}/, effect.spLoss);
    }

    if (effect.percentage) {
      const value = Math.floor(player.sacrificePoints * effect.percentage);
      preview = preview.replace(/\{\{calculatedValue\}\}/, value);
    }

    return preview;
  }

  executeEffect(player, gameState, targetPlayer = null) {
    if (!this.hasMechanicalEffect()) {
      // Manual effect - return description for manual implementation
      return {
        type: 'manual',
        description: this.effect,
        card: this
      };
    }

    const effect = this.mechanicalEffect;
    const results = {
      type: 'automatic',
      changes: [],
      messages: [],
      card: this
    };

    // Process different effect types
    if (effect.spGain) {
      player.addSacrificePoints(effect.spGain);
      results.changes.push({ 
        player: player.id, 
        type: 'spGain', 
        amount: effect.spGain 
      });
      results.messages.push(`${player.name} gained ${effect.spGain} SP`);
    }

    if (effect.spLoss) {
      player.removeSacrificePoints(effect.spLoss);
      results.changes.push({ 
        player: player.id, 
        type: 'spLoss', 
        amount: effect.spLoss 
      });
      results.messages.push(`${player.name} lost ${effect.spLoss} SP`);
    }

    if (effect.livestockGain) {
      player.addLivestock(effect.livestockGain);
      results.changes.push({ 
        player: player.id, 
        type: 'livestockGain', 
        amount: effect.livestockGain 
      });
      results.messages.push(`${player.name} gained ${effect.livestockGain} livestock`);
    }

    if (effect.coinsGain) {
      player.addCoins(effect.coinsGain);
      results.changes.push({ 
        player: player.id, 
        type: 'coinsGain', 
        amount: effect.coinsGain 
      });
      results.messages.push(`${player.name} gained ${effect.coinsGain} coins`);
    }

    if (effect.percentage) {
      const amount = Math.floor(player.sacrificePoints * effect.percentage);
      if (effect.percentageType === 'gain') {
        player.addSacrificePoints(amount);
        results.changes.push({ 
          player: player.id, 
          type: 'spGain', 
          amount: amount 
        });
        results.messages.push(`${player.name} gained ${amount} SP (${Math.round(effect.percentage * 100)}%)`);
      } else if (effect.percentageType === 'loss') {
        player.removeSacrificePoints(amount);
        results.changes.push({ 
          player: player.id, 
          type: 'spLoss', 
          amount: amount 
        });
        results.messages.push(`${player.name} lost ${amount} SP (${Math.round(effect.percentage * 100)}%)`);
      }
    }

    if (effect.moveToLocation !== undefined) {
      const oldPosition = player.position;
      player.position = effect.moveToLocation;
      results.changes.push({ 
        player: player.id, 
        type: 'move', 
        from: oldPosition, 
        to: effect.moveToLocation 
      });
      results.messages.push(`${player.name} moved to a new location`);
    }

    if (effect.addHelper) {
      player.addHelperPoint(effect.addHelper);
      if (player.hasHelper(effect.addHelper)) {
        results.changes.push({ 
          player: player.id, 
          type: 'helperGained', 
          helper: effect.addHelper 
        });
        results.messages.push(`${player.name} recruited ${effect.addHelper} as a helper!`);
      } else {
        results.changes.push({ 
          player: player.id, 
          type: 'helperProgress', 
          helper: effect.addHelper 
        });
        results.messages.push(`${player.name} gained progress with ${effect.addHelper}`);
      }
    }

    if (effect.affectAllPlayers) {
      // Apply effect to all other players
      gameState.players.forEach(otherPlayer => {
        if (otherPlayer.id !== player.id) {
          // Apply the same logic but to other players
          // This would need to be implemented based on specific effects
        }
      });
    }

    // Add temporary effects
    if (this.isTemporary()) {
      player.addActiveEffect({
        cardId: this.id,
        cardTitle: this.title,
        duration: this.duration,
        effect: effect
      });
      results.messages.push(`${this.title} will last for ${this.duration} turns`);
    }

    this.markAsUsed(player.id, results.changes.length);
    
    return results;
  }

  getStatistics() {
    return {
      timesDrawn: this.timesDrawn,
      timesUsed: this.timesUsed,
      useRate: this.timesDrawn > 0 ? Math.round((this.timesUsed / this.timesDrawn) * 100) : 0,
      averageImpact: Math.round(this.averageImpact * 100) / 100,
      rarity: this.rarity,
      type: this.type,
      isPopular: this.timesDrawn > 10,
      isEffective: this.averageImpact > 0,
      lastActivity: this.lastDrawn || this.lastUsed
    };
  }

  clone() {
    return new Card(this.toJSON());
  }

  validate() {
    const errors = [];

    if (!this.title || this.title.trim().length === 0) {
      errors.push('Card title is required');
    }

    if (this.title.length > 100) {
      errors.push('Card title too long (max 100 characters)');
    }

    if (!['angel', 'demon'].includes(this.type)) {
      errors.push('Card type must be "angel" or "demon"');
    }

    if (!this.effect || this.effect.trim().length === 0) {
      errors.push('Card effect is required');
    }

    if (this.effect.length > 500) {
      errors.push('Card effect too long (max 500 characters)');
    }

    if (!['common', 'uncommon', 'rare', 'legendary'].includes(this.rarity)) {
      errors.push('Invalid rarity level');
    }

    if (this.duration < 0) {
      errors.push('Duration cannot be negative');
    }

    if (this.duration > 10) {
      errors.push('Duration too long (max 10 turns)');
    }

    // Validate mechanical effects
    if (this.mechanicalEffect) {
      if (typeof this.mechanicalEffect !== 'object') {
        errors.push('Mechanical effect must be an object');
      }
    }

    // Validate requirements
    if (this.requirements) {
      if (this.requirements.minSP && this.requirements.minSP < 0) {
        errors.push('Minimum SP requirement cannot be negative');
      }
      if (this.requirements.minHelpers && this.requirements.minHelpers < 0) {
        errors.push('Minimum helpers requirement cannot be negative');
      }
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
      throw new Error('Invalid card export data');
    }

    const { exportedAt, version, ...cardData } = exportedData;
    return new Card(cardData);
  }

  static createAngel(title, effect, options = {}) {
    return new Card({
      title,
      effect,
      type: 'angel',
      symbol: '👼',
      ...options
    });
  }

  static createDemon(title, effect, options = {}) {
    return new Card({
      title,
      effect,
      type: 'demon',
      symbol: '👹',
      ...options
    });
  }

  static bulkCreate(cardsData, defaultType = 'angel') {
    return cardsData.map(data => new Card({
      type: defaultType,
      symbol: defaultType === 'angel' ? '👼' : '👹',
      ...data
    }));
  }

  getAge() {
    const created = new Date(this.createdAt);
    const now = new Date();
    return Math.floor((now - created) / (1000 * 60 * 60 * 24));
  }

  isNew() {
    return this.getAge() <= 7;
  }

  isUnused() {
    return this.timesUsed === 0;
  }

  isPopular() {
    return this.timesDrawn > 10 && this.timesUsed > 5;
  }

  reset() {
    // Reset usage statistics
    this.timesDrawn = 0;
    this.timesUsed = 0;
    this.averageImpact = 0;
    this.lastDrawn = null;
    this.lastUsed = null;
  }
}

// Export pre-built card sets
export const angelCards = [
  new Card({ title: "Abraham's Visitors", scripture: "Genesis 18:1-2", effect: "Gain 3 SP immediately and choose any character to gain 1 point with. Divine visitors bring blessing and revelation.", symbol: "👼" }),
  new Card({ title: "Angel of the Sacrifice", scripture: "Genesis 22:11-12", effect: "When you would lose SP from any source, this card prevents all loss. Discard after use.", symbol: "🛡️" }),
  new Card({ title: "Hagar's Comforter", scripture: "Genesis 21:17-19", effect: "Gain 2 SP and recover 1 livestock. The angel provides water in the wilderness.", symbol: "🌊" }),
  new Card({ title: "Lot's Deliverers", scripture: "Genesis 19:15-16", effect: "Move immediately to any location on the board. Angels lead you to safety before judgment falls.", symbol: "🏃" }),
  new Card({ title: "Jacob's Ladder", scripture: "Genesis 28:12", effect: "Gain 4 SP. The connection between heaven and earth brings great blessing.", symbol: "🪜" }),
  new Card({ title: "Burning Bush Angel", scripture: "Exodus 3:2", effect: "Gain 1 Helper immediately from any character, regardless of your points with them. Divine calling transcends normal requirements.", symbol: "🔥" }),
  new Card({ title: "Balaam's Rebuke", scripture: "Numbers 22:31", effect: "Look at the next character you will encounter. Choose whether to proceed or move to a different location.", symbol: "👁️" }),
  new Card({ title: "Captain of the Host", scripture: "Joshua 5:14", effect: "Your next encounter with wolves or bandits is automatically won without rolling. Divine authority commands victory.", symbol: "⚔️" }),
  new Card({ title: "Gideon's Fire", scripture: "Judges 6:21", effect: "For your next 3 turns, gain +1 SP for every correct answer (4 total instead of 3).", symbol: "🔥", duration: 3 }),
  new Card({ title: "Samson's Announcer", scripture: "Judges 13:3", effect: "Choose a character you have 0-1 points with. Gain 2 points with them immediately. Great purposes require divine announcement.", symbol: "👶" }),
  new Card({ title: "Elijah's Provider", scripture: "1 Kings 19:5", effect: "Gain 3 SP and recover all lost livestock and coins. God's provision sustains His prophets.", symbol: "🍞" }),
  new Card({ title: "Elisha's Army", scripture: "2 Kings 6:17", effect: "Immunity to all Demon card effects for the next 4 turns. The mountain is full of horses and chariots of fire.", symbol: "🐎", duration: 4 }),
  new Card({ title: "Assyrian Destroyer", scripture: "2 Kings 19:35", effect: "All other players lose 2 SP. The angel of the LORD protects His people while judging enemies.", symbol: "⚔️" }),
  new Card({ title: "Daniel's Guardian", scripture: "Daniel 6:22", effect: "Wolves cannot attack you for the rest of the game. Your faithfulness shuts the lions' mouths.", symbol: "🦁", isPermanent: true }),
  new Card({ title: "Fourth in the Fire", scripture: "Daniel 3:25", effect: "When you would lose SP or offerings, roll a die. On 4-6, you lose nothing. Keep this card permanently.", symbol: "🔥", isPermanent: true }),
  new Card({ title: "Gabriel's Revelation", scripture: "Daniel 8:16", effect: "Look at any other player's SP total, livestock, coins, and helpers. Gain 2 SP from divine insight.", symbol: "📜" }),
  new Card({ title: "Michael's Protection", scripture: "Daniel 10:13", effect: "Choose another player. They cannot affect you negatively for 3 turns. The prince of Israel defends his people.", symbol: "👑", duration: 3 }),
  new Card({ title: "Prison Breaker", scripture: "Acts 12:7", effect: "If you land on a space that would cause you to lose a turn or miss moves, ignore the effect. Discard after use.", symbol: "🔗" }),
  new Card({ title: "Philip's Guide", scripture: "Acts 8:26", effect: "On your next turn, move to any location instead of rolling. Divine guidance leads to great opportunities.", symbol: "🌟" }),
  new Card({ title: "Birth Announcement", scripture: "Luke 2:13", effect: "All players gain 2 SP. The greatest news brings joy to all people.", symbol: "✨" })
];

export const demonCards = [
  new Card({ title: "Ancient Serpent", type: "demon", scripture: "Genesis 3:1", effect: "You surely do not need those offerings. Lose half your livestock and half your coins (rounded down). The first lie still deceives.", symbol: "🐍" }),
  new Card({ title: "Spirit of Murder", type: "demon", scripture: "Genesis 4:7", effect: "Choose another player. They lose 3 SP and you steal 1 SP from them. Sin desires to master and destroy.", symbol: "🗡️" }),
  new Card({ title: "Evil Spirit of Saul", type: "demon", scripture: "1 Samuel 16:14", effect: "For your next 3 turns, roll a die before answering questions. On 1-3, you cannot use Helper hints or earn Helper points.", symbol: "👑", duration: 3 }),
  new Card({ title: "Satan's Test of Job", type: "demon", scripture: "Job 1:19", effect: "Lose 2 livestock, 2 coins, and 1 Helper of your choice. Sometimes the righteous suffer to prove their faith.", symbol: "🌪️" }),
  new Card({ title: "Temptation of Appetite", type: "demon", scripture: "Matthew 4:3", effect: "Turn these stones to bread. Pay 4 SP immediately or lose your next turn. Physical needs distract from spiritual purpose.", symbol: "🍞" }),
  new Card({ title: "Temptation of Pride", type: "demon", scripture: "Matthew 4:6", effect: "Cast yourself down! Choose: either lose 4 SP or take double damage from your next wolf/bandit encounter.", symbol: "🏔️" }),
  new Card({ title: "Temptation of Power", type: "demon", scripture: "Matthew 4:9", effect: "All these kingdoms will I give you. Gain 8 SP, but lose all your Helpers. Worldly success costs spiritual relationships.", symbol: "👑" }),
  new Card({ title: "Legion of Torment", type: "demon", scripture: "Mark 5:9", effect: "My name is Legion, for we are many. Roll two dice and lose that many SP. Spiritual oppression multiplies suffering.", symbol: "👥" }),
  new Card({ title: "Mute Spirit", type: "demon", scripture: "Matthew 9:32", effect: "You cannot use any Helper hints for your next 3 turns. The spirit of silence prevents testimony and wisdom.", symbol: "🤐", duration: 3 }),
  new Card({ title: "Blinding Spirit", type: "demon", scripture: "Matthew 12:22", effect: "For your next 2 questions, you cannot see what location you're on when answering. Spiritual blindness hides truth.", symbol: "👁️", duration: 2 }),
  new Card({ title: "False Prophet Spirit", type: "demon", scripture: "Acts 16:16", effect: "Gain insight into coming doom. All other players lose 2 SP. False prophecy brings confusion and fear.", symbol: "🔮" }),
  new Card({ title: "Convulsing Spirit", type: "demon", scripture: "Mark 9:18", effect: "Skip your next turn and lose 2 livestock. This kind requires prayer and fasting to overcome.", symbol: "⚡" }),
  new Card({ title: "Spirit of Eighteen Years", type: "demon", scripture: "Luke 13:16", effect: "For the next 3 turns, you can only earn half SP from correct answers (rounded down). Satan's bonds limit progress.", symbol: "⛓️", duration: 3 }),
  new Card({ title: "Unclean Spirit", type: "demon", scripture: "Mark 1:23", effect: "Let us alone! You cannot gain Helper points with any character for your next 2 turns. Demons resist holy fellowship.", symbol: "🌊", duration: 2 }),
  new Card({ title: "Spirit of Greed", type: "demon", scripture: "Acts 19:24", effect: "All players must pay you 1 coin or lose 3 SP. Your choice which they do. False profits exploit God's people.", symbol: "💰" }),
  new Card({ title: "Deceiving Spirit", type: "demon", scripture: "Acts 19:13", effect: "Jesus I know, Paul I know, but who are you? Lose all points with one Helper of your choice. False authority brings shame.", symbol: "🎭" }),
  new Card({ title: "Messenger of Satan", type: "demon", scripture: "2 Corinthians 12:7", effect: "Keep this card. At the start of each turn, lose 1 SP, but gain +1 to trivia rolls. Weakness can teach dependence on grace.", symbol: "🌵", isPermanent: true }),
  new Card({ title: "The Great Dragon", type: "demon", scripture: "Revelation 12:9", effect: "All players lose their most valuable resource (count SP value: livestock + coins). The deceiver wages war against all saints.", symbol: "🐉" }),
  new Card({ title: "Beast of Persecution", type: "demon", scripture: "Revelation 13:7", effect: "Choose a player. They cannot earn SP for 2 turns and you steal 1 of their Helpers. Power wars against the saints.", symbol: "👹", duration: 2 }),
  new Card({ title: "Lake of Fire", type: "demon", scripture: "Revelation 20:10", effect: "All players must sacrifice 5 SP or lose all their livestock. The final judgment demands everything.", symbol: "🔥" })
];

// Utility functions for card management
export const CardUtils = {
  shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  createDeck(cards, includeRarity = true) {
    if (!includeRarity) {
      return this.shuffleDeck(cards);
    }

    // Weight cards by rarity
    const weightedDeck = [];
    cards.forEach(card => {
      const weight = card.getRarityInfo().weight;
      const copies = Math.ceil(weight / 10); // More copies for common cards
      for (let i = 0; i < copies; i++) {
        weightedDeck.push(card.clone());
      }
    });

    return this.shuffleDeck(weightedDeck);
  },

  filterByType(cards, type) {
    return cards.filter(card => card.type === type);
  },

  filterByRarity(cards, rarity) {
    return cards.filter(card => card.rarity === rarity);
  },

  searchCards(cards, searchTerm) {
    const lowerTerm = searchTerm.toLowerCase();
    return cards.filter(card => 
      card.title.toLowerCase().includes(lowerTerm) ||
      card.effect.toLowerCase().includes(lowerTerm) ||
      card.scripture.toLowerCase().includes(lowerTerm) ||
      card.category.toLowerCase().includes(lowerTerm)
    );
  },

  getCardsByCategory(cards, category) {
    return cards.filter(card => card.category === category);
  },

  getRandomCard(cards, type = null) {
    let filteredCards = cards;
    if (type) {
      filteredCards = this.filterByType(cards, type);
    }
    
    if (filteredCards.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * filteredCards.length);
    return filteredCards[randomIndex];
  },

  validateDeck(cards) {
    const errors = [];
    
    if (!Array.isArray(cards)) {
      errors.push('Deck must be an array');
      return { isValid: false, errors };
    }

    if (cards.length === 0) {
      errors.push('Deck cannot be empty');
    }

    cards.forEach((card, index) => {
      if (!(card instanceof Card)) {
        errors.push(`Item ${index} is not a valid Card instance`);
      } else {
        const validation = card.validate();
        if (!validation.isValid) {
          errors.push(`Card "${card.title}" at index ${index}: ${validation.errors.join(', ')}`);
        }
      }
    });

    const angelCards = this.filterByType(cards, 'angel');
    const demonCards = this.filterByType(cards, 'demon');

    if (angelCards.length === 0 && demonCards.length === 0) {
      errors.push('Deck must contain at least one Angel or Demon card');
    }

    return {
      isValid: errors.length === 0,
      errors,
      stats: {
        total: cards.length,
        angels: angelCards.length,
        demons: demonCards.length,
        permanent: cards.filter(card => card.isPermanent).length,
        temporary: cards.filter(card => card.isTemporary()).length,
        instant: cards.filter(card => card.isInstant()).length
      }
    };
  },

  exportDeck(cards, name = 'Custom Deck') {
    return {
      name,
      cards: cards.map(card => card.export()),
      createdAt: new Date().toISOString(),
      version: '2.0.0'
    };
  },

  importDeck(deckData) {
    if (!deckData || !deckData.cards) {
      throw new Error('Invalid deck data');
    }

    const cards = deckData.cards.map(cardData => Card.import(cardData));
    const validation = this.validateDeck(cards);
    
    if (!validation.isValid) {
      throw new Error(`Invalid deck: ${validation.errors.join(', ')}`);
    }

    return {
      name: deckData.name || 'Imported Deck',
      cards,
      importedAt: new Date().toISOString()
    };
  }
};
export default { angelCards, demonCards };
