import { Alert } from 'react-native';

// Complete Angel and Demon Card Effects Data

// CARD EFFECT TYPES
const CARD_EFFECT_TYPES = {
  IMMEDIATE: 'immediate',     // Happens right when card is drawn
  PERSISTENT: 'persistent',   // Stays with player until used/expires
  CHOICE: 'choice'           // Player makes a choice before effect applies
};

// COMPLETE ANGEL CARDS WITH EFFECTS
const angelCardsWithEffects = [
  {
    id: 'abrahams_visitors',
    title: "Abraham's Visitors",
    scripture: "Genesis 18:1-2",
    effect: "Gain 3 SP immediately and choose any character to gain 1 point with. Divine visitors bring blessing and revelation.",
    symbol: "👼",
    effectType: CARD_EFFECT_TYPES.CHOICE,
    effectData: {
      spGain: 3,
      chooseHelper: true
    }
  },
  {
    id: 'angel_of_sacrifice',
    title: "Angel of the Sacrifice",
    scripture: "Genesis 22:11-12",
    effect: "When you would lose SP from any source, this card prevents all loss. Discard after use.",
    symbol: "🛡️",
    effectType: CARD_EFFECT_TYPES.PERSISTENT,
    effectData: {
      type: 'sp_protection',
      usesRemaining: 1,
      description: 'Prevents SP loss'
    }
  },
  {
    id: 'hagars_comforter',
    title: "Hagar's Comforter",
    scripture: "Genesis 21:17-19",
    effect: "Gain 2 SP and recover 1 livestock. The angel provides water in the wilderness.",
    symbol: "🌊",
    effectType: CARD_EFFECT_TYPES.IMMEDIATE,
    effectData: {
      spGain: 2,
      livestockGain: 1
    }
  },
  {
    id: 'lots_deliverers',
    title: "Lot's Deliverers",
    scripture: "Genesis 19:15-16",
    effect: "Move immediately to any location on the board. Angels lead you to safety before judgment falls.",
    symbol: "🏃",
    effectType: CARD_EFFECT_TYPES.CHOICE,
    effectData: {
      type: 'teleport',
      description: 'Choose any location to move to'
    }
  },
  {
    id: 'jacobs_ladder',
    title: "Jacob's Ladder",
    scripture: "Genesis 28:12",
    effect: "Gain 4 SP. The connection between heaven and earth brings great blessing.",
    symbol: "🪜",
    effectType: CARD_EFFECT_TYPES.IMMEDIATE,
    effectData: {
      spGain: 4
    }
  },
  {
    id: 'burning_bush_angel',
    title: "Burning Bush Angel",
    scripture: "Exodus 3:2",
    effect: "Gain 1 Helper immediately from any character, regardless of your points with them. Divine calling transcends normal requirements.",
    symbol: "🔥",
    effectType: CARD_EFFECT_TYPES.CHOICE,
    effectData: {
      type: 'instant_helper',
      description: 'Choose any character to recruit as Helper'
    }
  },
  {
    id: 'balaams_rebuke',
    title: "Balaam's Rebuke",
    scripture: "Numbers 22:31",
    effect: "Look at the next character you will encounter. Choose whether to proceed or move to a different location.",
    symbol: "👁️",
    effectType: CARD_EFFECT_TYPES.PERSISTENT,
    effectData: {
      type: 'foresight',
      usesRemaining: 1,
      description: 'See next encounter'
    }
  },
  {
    id: 'captain_of_host',
    title: "Captain of the Host",
    scripture: "Joshua 5:14",
    effect: "Your next encounter with wolves or bandits is automatically won without rolling. Divine authority commands victory.",
    symbol: "⚔️",
    effectType: CARD_EFFECT_TYPES.PERSISTENT,
    effectData: {
      type: 'attack_immunity',
      usesRemaining: 1,
      description: 'Auto-win next attack'
    }
  },
  {
    id: 'gideons_fire',
    title: "Gideon's Fire",
    scripture: "Judges 6:21",
    effect: "For your next 3 turns, gain +1 SP for every correct answer (4 total instead of 3).",
    symbol: "🔥",
    effectType: CARD_EFFECT_TYPES.PERSISTENT,
    effectData: {
      type: 'trivia_bonus',
      usesRemaining: 3,
      description: '+1 SP per correct answer'
    }
  },
  {
    id: 'samsons_announcer',
    title: "Samson's Announcer",
    scripture: "Judges 13:3",
    effect: "Choose a character you have 0-1 points with. Gain 2 points with them immediately. Great purposes require divine announcement.",
    symbol: "👶",
    effectType: CARD_EFFECT_TYPES.CHOICE,
    effectData: {
      type: 'helper_boost',
      description: 'Choose character with 0-1 points to boost'
    }
  },
  {
    id: 'elijahs_provider',
    title: "Elijah's Provider",
    scripture: "1 Kings 19:5",
    effect: "Gain 3 SP and recover all lost livestock and coins. God's provision sustains His prophets.",
    symbol: "🍞",
    effectType: CARD_EFFECT_TYPES.IMMEDIATE,
    effectData: {
      spGain: 3,
      restoreResources: true
    }
  },
  {
    id: 'elishas_army',
    title: "Elisha's Army",
    scripture: "2 Kings 6:17",
    effect: "Immunity to all Demon card effects for the next 4 turns. The mountain is full of horses and chariots of fire.",
    symbol: "🐎",
    effectType: CARD_EFFECT_TYPES.PERSISTENT,
    effectData: {
      type: 'demon_immunity',
      usesRemaining: 4,
      description: 'Immune to demon cards'
    }
  },
  {
    id: 'assyrian_destroyer',
    title: "Assyrian Destroyer",
    scripture: "2 Kings 19:35",
    effect: "All other players lose 2 SP. The angel of the LORD protects His people while judging enemies.",
    symbol: "⚔️",
    effectType: CARD_EFFECT_TYPES.IMMEDIATE,
    effectData: {
      affectOthers: true,
      othersSpLoss: 2
    }
  },
  {
    id: 'daniels_guardian',
    title: "Daniel's Guardian",
    scripture: "Daniel 6:22",
    effect: "Wolves cannot attack you for the rest of the game. Your faithfulness shuts the lions' mouths.",
    symbol: "🦁",
    effectType: CARD_EFFECT_TYPES.PERSISTENT,
    effectData: {
      type: 'wolves_immunity',
      usesRemaining: 999, // Permanent
      description: 'Immune to wolves forever'
    }
  },
  {
    id: 'fourth_in_fire',
    title: "Fourth in the Fire",
    scripture: "Daniel 3:25",
    effect: "When you would lose SP or offerings, roll a die. On 4-6, you lose nothing. Keep this card permanently.",
    symbol: "🔥",
    effectType: CARD_EFFECT_TYPES.PERSISTENT,
    effectData: {
      type: 'damage_protection',
      usesRemaining: 999, // Permanent
      description: 'Roll to avoid losses'
    }
  },
  {
    id: 'gabriels_revelation',
    title: "Gabriel's Revelation",
    scripture: "Daniel 8:16",
    effect: "Look at any other player's SP total, livestock, coins, and helpers. Gain 2 SP from divine insight.",
    symbol: "📜",
    effectType: CARD_EFFECT_TYPES.CHOICE,
    effectData: {
      type: 'player_inspect',
      spGain: 2,
      description: 'Inspect another player'
    }
  },
  {
    id: 'michaels_protection',
    title: "Michael's Protection",
    scripture: "Daniel 10:13",
    effect: "Choose another player. They cannot affect you negatively for 3 turns. The prince of Israel defends his people.",
    symbol: "👑",
    effectType: CARD_EFFECT_TYPES.CHOICE,
    effectData: {
      type: 'player_protection',
      description: 'Block player interference for 3 turns'
    }
  },
  {
    id: 'prison_breaker',
    title: "Prison Breaker",
    scripture: "Acts 12:7",
    effect: "If you land on a space that would cause you to lose a turn or miss moves, ignore the effect. Discard after use.",
    symbol: "🔗",
    effectType: CARD_EFFECT_TYPES.PERSISTENT,
    effectData: {
      type: 'turn_protection',
      usesRemaining: 1,
      description: 'Ignore turn loss effects'
    }
  },
  {
    id: 'philips_guide',
    title: "Philip's Guide",
    scripture: "Acts 8:26",
    effect: "On your next turn, move to any location instead of rolling. Divine guidance leads to great opportunities.",
    symbol: "🌟",
    effectType: CARD_EFFECT_TYPES.PERSISTENT,
    effectData: {
      type: 'next_turn_teleport',
      usesRemaining: 1,
      description: 'Teleport next turn'
    }
  },
  {
    id: 'birth_announcement',
    title: "Birth Announcement",
    scripture: "Luke 2:13",
    effect: "All players gain 2 SP. The greatest news brings joy to all people.",
    symbol: "✨",
    effectType: CARD_EFFECT_TYPES.IMMEDIATE,
    effectData: {
      affectAll: true,
      allSpGain: 2
    }
  }
];

// COMPLETE DEMON CARDS WITH EFFECTS
const demonCardsWithEffects = [
  {
    id: 'ancient_serpent',
    title: "Ancient Serpent",
    scripture: "Genesis 3:1",
    effect: "You surely do not need those offerings. Lose half your livestock and half your coins (rounded down). The first lie still deceives.",
    symbol: "🐍",
    effectType: CARD_EFFECT_TYPES.IMMEDIATE,
    effectData: {
      livestockLoss: 'half',
      coinsLoss: 'half'
    }
  },
  {
    id: 'spirit_of_murder',
    title: "Spirit of Murder",
    scripture: "Genesis 4:7",
    effect: "Choose another player. They lose 3 SP and you steal 1 SP from them. Sin desires to master and destroy.",
    symbol: "🗡️",
    effectType: CARD_EFFECT_TYPES.CHOICE,
    effectData: {
      type: 'steal_sp',
      targetSpLoss: 3,
      selfSpGain: 1,
      description: 'Choose player to steal from'
    }
  },
  {
    id: 'evil_spirit_saul',
    title: "Evil Spirit of Saul",
    scripture: "1 Samuel 16:14",
    effect: "For your next 3 turns, roll a die before answering questions. On 1-3, you cannot use Helper hints or earn Helper points.",
    symbol: "👑",
    effectType: CARD_EFFECT_TYPES.PERSISTENT,
    effectData: {
      type: 'helper_interference',
      usesRemaining: 3,
      description: 'Roll to use helpers'
    }
  },
  {
    id: 'satans_test_job',
    title: "Satan's Test of Job",
    scripture: "Job 1:19",
    effect: "Lose 2 livestock, 2 coins, and 1 Helper of your choice. Sometimes the righteous suffer to prove their faith.",
    symbol: "🌪️",
    effectType: CARD_EFFECT_TYPES.CHOICE,
    effectData: {
      type: 'job_test',
      livestockLoss: 2,
      coinsLoss: 2,
      description: 'Choose helper to lose'
    }
  },
  {
    id: 'temptation_appetite',
    title: "Temptation of Appetite",
    scripture: "Matthew 4:3",
    effect: "Turn these stones to bread. Pay 4 SP immediately or lose your next turn. Physical needs distract from spiritual purpose.",
    symbol: "🍞",
    effectType: CARD_EFFECT_TYPES.CHOICE,
    effectData: {
      type: 'pay_or_skip',
      spCost: 4,
      description: 'Pay 4 SP or lose next turn'
    }
  },
  {
    id: 'temptation_pride',
    title: "Temptation of Pride",
    scripture: "Matthew 4:6",
    effect: "Cast yourself down! Choose: either lose 4 SP or take double damage from your next wolf/bandit encounter.",
    symbol: "🏔️",
    effectType: CARD_EFFECT_TYPES.CHOICE,
    effectData: {
      type: 'sp_or_vulnerability',
      spLoss: 4,
      description: 'Lose SP or double attack damage'
    }
  },
  {
    id: 'temptation_power',
    title: "Temptation of Power",
    scripture: "Matthew 4:9",
    effect: "All these kingdoms will I give you. Gain 8 SP, but lose all your Helpers. Worldly success costs spiritual relationships.",
    symbol: "👑",
    effectType: CARD_EFFECT_TYPES.CHOICE,
    effectData: {
      type: 'power_trade',
      spGain: 8,
      description: 'Gain 8 SP, lose all helpers'
    }
  },
  {
    id: 'legion_torment',
    title: "Legion of Torment",
    scripture: "Mark 5:9",
    effect: "My name is Legion, for we are many. Roll two dice and lose that many SP. Spiritual oppression multiplies suffering.",
    symbol: "👥",
    effectType: CARD_EFFECT_TYPES.IMMEDIATE,
    effectData: {
      rollTwoDice: true,
      spLoss: 'roll_result'
    }
  },
  {
    id: 'mute_spirit',
    title: "Mute Spirit",
    scripture: "Matthew 9:32",
    effect: "You cannot use any Helper hints for your next 3 turns. The spirit of silence prevents testimony and wisdom.",
    symbol: "🤐",
    effectType: CARD_EFFECT_TYPES.PERSISTENT,
    effectData: {
      type: 'mute_helpers',
      usesRemaining: 3,
      description: 'Cannot use helper hints'
    }
  },
  {
    id: 'blinding_spirit',
    title: "Blinding Spirit",
    scripture: "Matthew 12:22",
    effect: "For your next 2 questions, you cannot see what location you're on when answering. Spiritual blindness hides truth.",
    symbol: "👁️",
    effectType: CARD_EFFECT_TYPES.PERSISTENT,
    effectData: {
      type: 'location_blindness',
      usesRemaining: 2,
      description: 'Cannot see location for questions'
    }
  },
  {
    id: 'false_prophet_spirit',
    title: "False Prophet Spirit",
    scripture: "Acts 16:16",
    effect: "Gain insight into coming doom. All other players lose 2 SP. False prophecy brings confusion and fear.",
    symbol: "🔮",
    effectType: CARD_EFFECT_TYPES.IMMEDIATE,
    effectData: {
      affectOthers: true,
      othersSpLoss: 2
    }
  },
  {
    id: 'convulsing_spirit',
    title: "Convulsing Spirit",
    scripture: "Mark 9:18",
    effect: "Skip your next turn and lose 2 livestock. This kind requires prayer and fasting to overcome.",
    symbol: "⚡",
    effectType: CARD_EFFECT_TYPES.PERSISTENT,
    effectData: {
      type: 'skip_turn',
      usesRemaining: 1,
      livestockLoss: 2,
      description: 'Skip next turn'
    }
  },
  {
    id: 'spirit_eighteen_years',
    title: "Spirit of Eighteen Years",
    scripture: "Luke 13:16",
    effect: "For the next 3 turns, you can only earn half SP from correct answers (rounded down). Satan's bonds limit progress.",
    symbol: "⛓️",
    effectType: CARD_EFFECT_TYPES.PERSISTENT,
    effectData: {
      type: 'sp_reduction',
      usesRemaining: 3,
      description: 'Half SP from trivia'
    }
  },
  {
    id: 'unclean_spirit',
    title: "Unclean Spirit",
    scripture: "Mark 1:23",
    effect: "Let us alone! You cannot gain Helper points with any character for your next 2 turns. Demons resist holy fellowship.",
    symbol: "🌊",
    effectType: CARD_EFFECT_TYPES.PERSISTENT,
    effectData: {
      type: 'no_helper_points',
      usesRemaining: 2,
      description: 'Cannot gain helper points'
    }
  },
  {
    id: 'spirit_of_greed',
    title: "Spirit of Greed",
    scripture: "Acts 19:24",
    effect: "All players must pay you 1 coin or lose 3 SP. Your choice which they do. False profits exploit God's people.",
    symbol: "💰",
    effectType: CARD_EFFECT_TYPES.CHOICE,
    effectData: {
      type: 'greed_tax',
      coinDemand: 1,
      spAlternative: 3,
      description: 'Collect from all players'
    }
  },
  {
    id: 'deceiving_spirit',
    title: "Deceiving Spirit",
    scripture: "Acts 19:13",
    effect: "Jesus I know, Paul I know, but who are you? Lose all points with one Helper of your choice. False authority brings shame.",
    symbol: "🎭",
    effectType: CARD_EFFECT_TYPES.CHOICE,
    effectData: {
      type: 'lose_helper',
      description: 'Choose helper to lose all points with'
    }
  },
  {
    id: 'messenger_satan',
    title: "Messenger of Satan",
    scripture: "2 Corinthians 12:7",
    effect: "Keep this card. At the start of each turn, lose 1 SP, but gain +1 to trivia rolls. Weakness can teach dependence on grace.",
    symbol: "🌵",
    effectType: CARD_EFFECT_TYPES.PERSISTENT,
    effectData: {
      type: 'thorn_flesh',
      usesRemaining: 999, // Permanent
      description: 'Lose 1 SP per turn, +1 trivia'
    }
  },
  {
    id: 'great_dragon',
    title: "The Great Dragon",
    scripture: "Revelation 12:9",
    effect: "All players lose their most valuable resource (count SP value: livestock + coins). The deceiver wages war against all saints.",
    symbol: "🐉",
    effectType: CARD_EFFECT_TYPES.IMMEDIATE,
    effectData: {
      affectAll: true,
      loseValuableResource: true
    }
  },
  {
    id: 'beast_persecution',
    title: "Beast of Persecution",
    scripture: "Revelation 13:7",
    effect: "Choose a player. They cannot earn SP for 2 turns and you steal 1 of their Helpers. Power wars against the saints.",
    symbol: "👹",
    effectType: CARD_EFFECT_TYPES.CHOICE,
    effectData: {
      type: 'persecution',
      description: 'Block player SP and steal helper'
    }
  },
  {
    id: 'lake_of_fire',
    title: "Lake of Fire",
    scripture: "Revelation 20:10",
    effect: "All players must sacrifice 5 SP or lose all their livestock. The final judgment demands everything.",
    symbol: "🔥",
    effectType: CARD_EFFECT_TYPES.CHOICE,
    effectData: {
      type: 'final_judgment',
      spCost: 5,
      description: 'All players: pay SP or lose livestock'
    }
  }
];

// UPDATED CARD EFFECTS PROCESSOR (Enhanced to handle all new effects)
class CardEffectsProcessor {
  static processCardEffect(card, gameState, updateGameState, onShowChoiceModal) {
    console.log('Processing card effect:', card.title, card.effectType);
    
    switch (card.effectType) {
      case CARD_EFFECT_TYPES.IMMEDIATE:
        return this.processImmediateEffect(card, gameState, updateGameState);
      case CARD_EFFECT_TYPES.PERSISTENT:
        return this.processPersistentEffect(card, gameState, updateGameState);
      case CARD_EFFECT_TYPES.CHOICE:
        return this.processChoiceEffect(card, gameState, updateGameState, onShowChoiceModal);
      default:
        console.warn('Unknown card effect type:', card.effectType);
        return gameState;
    }
  }

  static processImmediateEffect(card, gameState, updateGameState) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const { effectData } = card;
    
    let updatedPlayers = [...gameState.players];
    const messages = [];

    // Handle current player effects
    if (effectData.spGain) {
      updatedPlayers[gameState.currentPlayerIndex] = {
        ...currentPlayer,
        sacrificePoints: currentPlayer.sacrificePoints + effectData.spGain
      };
      messages.push(`+${effectData.spGain} SP`);
    }

    if (effectData.livestockGain) {
      updatedPlayers[gameState.currentPlayerIndex] = {
        ...updatedPlayers[gameState.currentPlayerIndex],
        livestock: updatedPlayers[gameState.currentPlayerIndex].livestock + effectData.livestockGain
      };
      messages.push(`+${effectData.livestockGain} Livestock`);
    }

    if (effectData.coinsGain) {
      updatedPlayers[gameState.currentPlayerIndex] = {
        ...updatedPlayers[gameState.currentPlayerIndex],
        coins: updatedPlayers[gameState.currentPlayerIndex].coins + effectData.coinsGain
      };
      messages.push(`+${effectData.coinsGain} Coins`);
    }

    // Handle resource restoration
    if (effectData.restoreResources) {
      // For simplicity, restore to reasonable amounts (can be enhanced)
      updatedPlayers[gameState.currentPlayerIndex] = {
        ...updatedPlayers[gameState.currentPlayerIndex],
        livestock: Math.max(updatedPlayers[gameState.currentPlayerIndex].livestock, 5),
        coins: Math.max(updatedPlayers[gameState.currentPlayerIndex].coins, 3)
      };
      messages.push('Resources restored');
    }

    // Handle losses
    if (effectData.livestockLoss) {
      const loss = effectData.livestockLoss === 'half' 
        ? Math.floor(currentPlayer.livestock / 2)
        : effectData.livestockLoss;
      updatedPlayers[gameState.currentPlayerIndex] = {
        ...updatedPlayers[gameState.currentPlayerIndex],
        livestock: Math.max(0, updatedPlayers[gameState.currentPlayerIndex].livestock - loss)
      };
      messages.push(`-${loss} Livestock`);
    }

    if (effectData.coinsLoss) {
      const loss = effectData.coinsLoss === 'half' 
        ? Math.floor(currentPlayer.coins / 2)
        : effectData.coinsLoss;
      updatedPlayers[gameState.currentPlayerIndex] = {
        ...updatedPlayers[gameState.currentPlayerIndex],
        coins: Math.max(0, updatedPlayers[gameState.currentPlayerIndex].coins - loss)
      };
      messages.push(`-${loss} Coins`);
    }

    // Handle dice roll effects
    if (effectData.rollTwoDice && effectData.spLoss === 'roll_result') {
      const roll1 = Math.floor(Math.random() * 6) + 1;
      const roll2 = Math.floor(Math.random() * 6) + 1;
      const totalLoss = roll1 + roll2;
      
      updatedPlayers[gameState.currentPlayerIndex] = {
        ...updatedPlayers[gameState.currentPlayerIndex],
        sacrificePoints: Math.max(0, updatedPlayers[gameState.currentPlayerIndex].sacrificePoints - totalLoss)
      };
      messages.push(`Rolled ${roll1}+${roll2}=${totalLoss}, -${totalLoss} SP`);
    }

    // Handle effects on other players
    if (effectData.affectOthers && effectData.othersSpLoss) {
      updatedPlayers = updatedPlayers.map((player, index) => {
        if (index !== gameState.currentPlayerIndex) {
          return {
            ...player,
            sacrificePoints: Math.max(0, player.sacrificePoints - effectData.othersSpLoss)
          };
        }
        return player;
      });
      messages.push(`All others lose ${effectData.othersSpLoss} SP`);
    }

    // Handle effects on all players
    if (effectData.affectAll && effectData.allSpGain) {
      updatedPlayers = updatedPlayers.map(player => ({
        ...player,
        sacrificePoints: player.sacrificePoints + effectData.allSpGain
      }));
      messages.push(`All players gain ${effectData.allSpGain} SP`);
    }

    if (effectData.affectAll && effectData.loseValuableResource) {
      updatedPlayers = updatedPlayers.map(player => {
        const totalResources = player.livestock + player.coins;
        if (player.livestock >= player.coins) {
          return { ...player, livestock: 0 };
        } else {
          return { ...player, coins: 0 };
        }
      });
      messages.push('All players lose most valuable resource');
    }

    updateGameState({ players: updatedPlayers });
    
    Alert.alert(
      `${card.symbol} ${card.title}`,
      messages.length > 0 ? messages.join(', ') : 'Effect applied!'
    );
  }

// FIXED: Updated processPersistentEffect in card-effects.js
static processPersistentEffect(card, gameState, updateGameState) {
  console.log('Processing persistent effect for:', card.title);
  
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  
  if (!currentPlayer) {
    console.error('No current player found for persistent effect');
    return;
  }
  
  const updatedPlayers = gameState.players.map((player, index) => {
    if (index === gameState.currentPlayerIndex) {
      // CRITICAL FIX: Ensure activeCards array exists
      const activeCards = player.activeCards || [];
      
      const newCard = {
        id: card.id || `${card.title.replace(/\s/g, '_').toLowerCase()}_${Date.now()}`,
        title: card.title,
        symbol: card.symbol,
        effect: card.effect,
        effectData: { ...card.effectData },
        drawnAt: gameState.turnNumber
      };
      
      console.log('Adding persistent card to player:', newCard);
      
      // Handle immediate losses for persistent effects
      let updatedPlayer = { ...player };
      if (card.effectData.livestockLoss) {
        updatedPlayer.livestock = Math.max(0, player.livestock - card.effectData.livestockLoss);
      }
      if (card.effectData.coinsLoss) {
        updatedPlayer.coins = Math.max(0, player.coins - card.effectData.coinsLoss);
      }
      
      return {
        ...updatedPlayer,
        activeCards: [...activeCards, newCard] // FIXED: Properly add the card
      };
    }
    return player;
  });

  console.log('Updated players with persistent card:', updatedPlayers[gameState.currentPlayerIndex]);

  // CRITICAL FIX: Only update players, don't reset other game state
  updateGameState({ players: updatedPlayers });
  
  Alert.alert(
    `${card.symbol} ${card.title}`,
    `${currentPlayer.name} received: ${card.effectData.description}!`
  );
}

  static processChoiceEffect(card, gameState, updateGameState, onShowChoiceModal) {
    onShowChoiceModal(card, gameState, updateGameState);
  }

  // Enhanced helper methods
  static hasActiveCard(player, cardType) {
    return player.activeCards?.some(card => card.effectData.type === cardType) || false;
  }

  static useActiveCard(player, cardType) {
    if (!player.activeCards) return { player, cardUsed: null };
    
    const cardIndex = player.activeCards.findIndex(card => card.effectData.type === cardType);
    if (cardIndex === -1) return { player, cardUsed: null };
    
    const card = player.activeCards[cardIndex];
    const updatedCards = [...player.activeCards];
    
    if (card.effectData.usesRemaining > 1) {
      updatedCards[cardIndex] = {
        ...card,
        effectData: {
          ...card.effectData,
          usesRemaining: card.effectData.usesRemaining - 1
        }
      };
    } else {
      updatedCards.splice(cardIndex, 1);
    }
    
    return {
      player: { ...player, activeCards: updatedCards },
      cardUsed: card
    };
  }
}

export {
  angelCardsWithEffects, CARD_EFFECT_TYPES, CardEffectsProcessor, demonCardsWithEffects
};

