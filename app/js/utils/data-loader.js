// js/utils/data-loader.js

export class DataLoader {
  static async loadThemeConfig(themeName = 'biblical') {
    try {
      switch (themeName) {
        case 'biblical':
          return await this.loadBiblicalTheme();
        case 'medieval':
          return await this.loadMedievalTheme();
        default:
          console.warn(`Unknown theme: ${themeName}, loading biblical theme`);
          return await this.loadBiblicalTheme();
      }
    } catch (error) {
      console.error('Failed to load theme config:', error);
      return this.getDefaultConfig();
    }
  }

  static async loadBiblicalTheme() {
    // In a real React Native app, you would load this from a JSON file
    // For now, we'll return the hardcoded biblical theme
    return {
      name: 'biblical',
      title: 'Biblical Journey',
      description: 'Journey through biblical locations and characters',
      boardPositions: this.getBiblicalBoardPositions(),
      triviaDatabase: this.getBiblicalTriviaDatabase(),
      angelCards: this.getAngelCards(),
      demonCards: this.getDemonCards(),
      theme: {
        primaryColor: '#8B4513',
        secondaryColor: '#FFD700',
        backgroundColor: '#2E8B57',
        textColor: '#333333',
        boardBackground: '#F5F5DC',
        boardBorder: '#8B4513'
      }
    };
  }

  static async loadMedievalTheme() {
    return {
      name: 'medieval',
      title: 'Medieval Quest',
      description: 'Journey through medieval lands and encounter legendary figures',
      boardPositions: this.getMedievalBoardPositions(),
      triviaDatabase: this.getMedievalTriviaDatabase(),
      blessingCards: this.getMedievalBlessingCards(),
      curseCards: this.getMedievalCurseCards(),
      theme: {
        primaryColor: '#2E8B57',
        secondaryColor: '#4682B4',
        accentColor: '#8B4513',
        backgroundColor: '#F5F5DC',
        textColor: '#333333',
        borderColor: '#8B4513'
      },
      specialSpaces: {
        positive: { symbol: '⚔️', name: "Knight's Blessing", gradient: 'linear-gradient(135deg, #FFD700, #FFA500)' },
        negative: { symbol: '🌙', name: 'Curse Card', gradient: 'linear-gradient(135deg, #8B0000, #DC143C)' },
        wolves: { symbol: '🐺', name: 'Wolf Pack Attack', gradient: 'linear-gradient(135deg, #654321, #8B4513)' },
        bandits: { symbol: '⚔️', name: 'Brigand Attack', gradient: 'linear-gradient(135deg, #2F4F4F, #708090)' }
      },
      game: {
        title: 'VOYAGER',
        subtitle: 'Journey to Jerusalem',
        description: 'First to 40 Sacrifice Points wins! Answer biblical trivia, redeem for offerings, but beware of bandits and wolves!',
        victoryCondition: 40,
        victoryResource: 'Sacrifice Points',
        passStartBonus: 5,
        resources: {
          primary: 'sacrificePoints',
          secondary: ['livestock', 'coins'],
          helpers: 'helpers'
        }
      }
    };
  }

  static getDefaultConfig() {
    return {
      name: 'default',
      title: 'Voyager Game',
      description: 'A journey through time and space',
      boardPositions: this.getBiblicalBoardPositions(),
      triviaDatabase: {},
      angelCards: [],
      demonCards: [],
      theme: {
        primaryColor: '#8B4513',
        secondaryColor: '#FFD700',
        backgroundColor: '#2E8B57',
        textColor: '#333333',
        boardBackground: '#F5F5DC',
        boardBorder: '#8B4513'
      }
    };
  }

  static getBiblicalBoardPositions() {
    return [
      { name: "Your Village", type: "start", description: "Starting space - collect 5 SP when passing" },
      { name: "Haran", type: "location", description: "Transition point, covenant calling" },
      { name: "Shechem", type: "location", description: "Covenant choice and renewal" },
      { name: "🐺 WOLVES ATTACK", type: "special", description: "Roll die, lose livestock and SP" },
      { name: "Bethel", type: "location", description: "Divine encounters, transformation" },
      { name: "Hebron", type: "location", description: "First land purchase, kingship" },
      { name: "Egypt (Goshen)", type: "location", description: "National formation, divine providence" },
      { name: "Mount Sinai", type: "location", description: "Law-giving, divine encounter" },
      { name: "Jordan River", type: "location", description: "Promise fulfillment, transformation" },
      { name: "👼 ANGEL CARD", type: "special", description: "Draw an Angel card for blessings" },
      { name: "Jericho", type: "location", description: "Divine warfare, faith demonstration" },
      { name: "Gilgal", type: "location", description: "Covenant renewal, leadership" },
      { name: "Shiloh", type: "location", description: "Central worship, prophetic calling" },
      { name: "Ramah", type: "location", description: "Prophetic authority, kingship" },
      { name: "Jerusalem", type: "location", description: "Ultimate destination, Temple" },
      { name: "En-gedi", type: "location", description: "Divine mercy, character formation" },
      { name: "⚔️ BANDITS ATTACK", type: "special", description: "Roll die, lose coins and SP" },
      { name: "Mount Carmel", type: "location", description: "Divine vindication, false worship" },
      { name: "Brook Cherith", type: "location", description: "Divine provision, faith testing" },
      { name: "Damascus", type: "location", description: "God's international sovereignty" },
      { name: "Nineveh", type: "location", description: "Universal mercy, repentance" },
      { name: "Babylon", type: "location", description: "Judgment, faithfulness, sovereignty" },
      { name: "👹 DEMON CARD", type: "special", description: "Draw a Demon card for challenges" },
      { name: "Shushan", type: "location", description: "Divine protection, deliverance" },
      { name: "Land of Uz", type: "location", description: "Faith through suffering" },
      { name: "Fiery Furnace", type: "location", description: "Divine protection, faith testimony" }
    ];
  }

  static getMedievalBoardPositions() {
    return [
      { name: "Village Square", type: "start", description: "Starting space - collect 5 gold when passing", category: "village" },
      { name: "Castle Walls", type: "location", description: "Fortified stronghold, center of feudal power", category: "castle" },
      { name: "Monastery", type: "location", description: "Center of learning and faith", category: "monastery" },
      { name: "🐺 WOLF PACK ATTACK", type: "special", description: "Roll die, lose provisions and gold", category: "danger" },
      { name: "Royal Court", type: "location", description: "Seat of royal power and intrigue", category: "castle" },
      { name: "Cathedral", type: "location", description: "Grand house of worship and pilgrimage", category: "monastery" },
      { name: "Merchant's Guild", type: "location", description: "Center of trade and commerce", category: "village" },
      { name: "Forest of Sherwood", type: "location", description: "Legendary woodland realm", category: "forest" },
      { name: "Canterbury", type: "location", description: "Famous pilgrimage destination", category: "monastery" },
      { name: "⚔️ KNIGHT'S BLESSING", type: "special", description: "Draw a Blessing card for divine favor", category: "blessing" },
      { name: "Tower of London", type: "location", description: "Royal fortress and prison", category: "castle" },
      { name: "Oxford University", type: "location", description: "Center of medieval learning", category: "monastery" },
      { name: "Market Square", type: "location", description: "Bustling center of trade", category: "village" },
      { name: "York Minster", type: "location", description: "Great northern cathedral", category: "monastery" },
      { name: "Camelot", type: "location", description: "Legendary court of King Arthur", category: "castle" },
      { name: "Robin Hood's Hideout", type: "location", description: "Secret refuge in the greenwood", category: "forest" },
      { name: "⚔️ BRIGAND ATTACK", type: "special", description: "Roll die, lose gold and provisions", category: "danger" },
      { name: "Westminster Abbey", type: "location", description: "Royal abbey and coronation site", category: "monastery" },
      { name: "Glastonbury Abbey", type: "location", description: "Ancient abbey of mystical legend", category: "monastery" },
      { name: "Warwick Castle", type: "location", description: "Mighty fortress of the realm", category: "castle" },
      { name: "Stratford-upon-Avon", type: "location", description: "Market town and birthplace of legends", category: "village" },
      { name: "Windsor Castle", type: "location", description: "Royal residence and seat of power", category: "castle" },
      { name: "🌙 DARK SORCERY", type: "special", description: "Draw a Curse card for mystical challenges", category: "trial" },
      { name: "Edinburgh Castle", type: "location", description: "Scottish royal fortress", category: "castle" },
      { name: "Tintagel Castle", type: "location", description: "Legendary birthplace of Arthur", category: "castle" },
      { name: "Isle of Avalon", type: "location", description: "Mystical island of healing and legend", category: "forest" }
    ];
  }

  static getBiblicalTriviaDatabase() {
    return {
      "Haran": {
      "significance": "Transition point, covenant calling",
      "characters": {
        "Abraham": [
          { "q": "How old was Abraham when he departed from Haran to go to the land of Canaan?", "a": "Seventy and five years old (Genesis 12:4)" },
          { "q": "What did the LORD promise Abraham when he called him to leave Haran?", "a": "To make of him a great nation, bless him, make his name great, and bless all families of the earth through him (Genesis 12:1-3)" },
          { "q": "Who died in Haran before Abraham departed for Canaan?", "a": "Terah, Abraham's father (Genesis 11:32)" },
          { "q": "What was Abraham's name before God changed it?", "a": "Abram (Genesis 17:5)" },
          { "q": "From which city did Terah take his family before settling in Haran?", "a": "Ur of the Chaldees (Genesis 11:31)" }
        ],
        "Sarah": [
          { "q": "What was Sarah's name before God changed it?", "a": "Sarai (Genesis 17:15)" },
          { "q": "How old was Sarah when she bore Isaac, long after leaving Haran?", "a": "Ninety years old (Genesis 21:5)" },
          { "q": "What relationship did Sarah have to Abraham besides being his wife?", "a": "She was his sister (his father's daughter but not his mother's daughter) (Genesis 20:12)" },
          { "q": "What did Sarah do when she heard the promise of a son would be fulfilled?", "a": "She laughed within herself (Genesis 18:12)" },
          { "q": "How did Abraham describe Sarah to Abimelech regarding their relationship?", "a": "She is my sister (Genesis 20:2)" }
        ],
        "Jacob": [
          { "q": "Why did Jacob flee to Haran from his father's house?", "a": "Because Esau hated him and planned to kill him after Jacob stole the blessing (Genesis 27:41-43)" },
          { "q": "Who was Jacob seeking to find when he arrived in Haran?", "a": "Laban, his mother's brother (Genesis 28:2)" },
          { "q": "How many years did Jacob serve Laban in Haran?", "a": "Twenty years (Genesis 31:41)" },
          { "q": "Which two sisters did Jacob marry while in Haran?", "a": "Leah and Rachel (Genesis 29:16-28)" },
          { "q": "How many children were born to Jacob while he was in Haran?", "a": "Eleven sons and one daughter (Genesis 29:32-30:24, 35:26)" }
        ],
        "Laban": [
          { "q": "What was Laban's relationship to Jacob?", "a": "Jacob's mother's brother (his uncle) (Genesis 29:10)" },
          { "q": "How did Laban deceive Jacob on his wedding night?", "a": "He gave him Leah instead of Rachel (Genesis 29:23-25)" },
          { "q": "How many times did Laban change Jacob's wages?", "a": "Ten times (Genesis 31:7)" },
          { "q": "What did Laban call the heap of stones when he and Jacob made their covenant?", "a": "Jegarsahadutha (Genesis 31:47)" },
          { "q": "What did Laban give as dowry to each of his daughters?", "a": "A handmaid (Zilpah to Leah, Bilhah to Rachel) (Genesis 29:24, 29:29)" }
        ],
        "Rachel": [
          { "q": "Where was Rachel when Jacob first met her near Haran?", "a": "At a well with her father's sheep (Genesis 29:9)" },
          { "q": "What was Rachel's occupation when Jacob met her?", "a": "A shepherdess (Genesis 29:9)" },
          { "q": "How many years did Jacob serve for Rachel?", "a": "Fourteen years (seven for each time) (Genesis 29:18, 29:30)" },
          { "q": "What did Rachel steal from her father when leaving Haran?", "a": "The images (idols/teraphim) (Genesis 31:19)" },
          { "q": "Which two sons did Rachel bear to Jacob?", "a": "Joseph and Benjamin (Genesis 30:22-24, 35:16-18)" }
        ],
        "Leah": [
          { "q": "How is Leah described in comparison to her sister Rachel?", "a": "Tender eyed, while Rachel was beautiful and well favoured (Genesis 29:17)" },
          { "q": "Which son of Leah became the father of the priestly tribe?", "a": "Levi (Genesis 29:34)" },
          { "q": "How many sons did Leah bear to Jacob in Haran?", "a": "Six sons: Reuben, Simeon, Levi, Judah, Issachar, and Zebulun (Genesis 29:32-35, 30:17-20)" },
          { "q": "What did Leah say when her first son was born?", "a": "Surely the LORD hath looked upon my affliction; now therefore my husband will love me (Genesis 29:32)" },
          { "q": "What did Leah name her fourth son and why?", "a": "Judah, saying 'Now will I praise the LORD' (Genesis 29:35)" }
        ]
      }
    },
    "Shechem": {
      "significance": "Covenant choice and renewal",
      "characters": {
        "Abraham": [
          { "q": "What did Abraham build at Shechem when he first entered Canaan?", "a": "An altar unto the LORD (Genesis 12:7)" },
          { "q": "What promise did the LORD give Abraham at Shechem?", "a": "Unto thy seed will I give this land (Genesis 12:7)" },
          { "q": "Which tree is mentioned in connection with Abraham's time at Shechem?", "a": "The plain of Moreh (Genesis 12:6)" },
          { "q": "To whom did the LORD appear at Shechem?", "a": "Unto Abram (Genesis 12:7)" },
          { "q": "What was the condition of the land when Abraham arrived at Shechem?", "a": "The Canaanite was then in the land (Genesis 12:6)" }
        ],
        "Jacob": [
          { "q": "What did Jacob purchase at Shechem when he returned to Canaan?", "a": "A parcel of a field for an hundred pieces of money (Genesis 33:19)" },
          { "q": "What did Jacob build at Shechem and what did he call it?", "a": "An altar, and called it El-elohe-Israel (Genesis 33:20)" },
          { "q": "What tragic event involving Jacob's daughter occurred at Shechem?", "a": "Dinah was defiled by Shechem the son of Hamor (Genesis 34:2)" },
          { "q": "How did Simeon and Levi respond to the defilement of their sister at Shechem?", "a": "They slew all the males of the city (Genesis 34:25-26)" },
          { "q": "What did Jacob bury under the oak at Shechem?", "a": "All the strange gods and all their earrings (Genesis 35:4)" }
        ],
        "Joshua": [
          { "q": "What important ceremony did Joshua conduct at Shechem?", "a": "He gathered all the tribes of Israel and presented them before God (Joshua 24:1)" },
          { "q": "What choice did Joshua present to the people at Shechem?", "a": "Choose you this day whom ye will serve (Joshua 24:15)" },
          { "q": "What was Joshua's famous declaration to the people at Shechem?", "a": "As for me and my house, we will serve the LORD (Joshua 24:15)" },
          { "q": "What covenant did the people make at Shechem under Joshua's leadership?", "a": "The LORD our God will we serve, and his voice will we obey (Joshua 24:24-25)" },
          { "q": "Where did Joshua set up a great stone as a witness at Shechem?", "a": "Under an oak, that was by the sanctuary of the LORD (Joshua 24:26)" }
        ]
      }
    },
    "Bethel": {
      "significance": "Divine encounters, transformation",
      "characters": {
        "Abraham": [
          { "q": "What did Abraham build at Bethel on his journey through Canaan?", "a": "An altar unto the LORD (Genesis 12:8)" },
          { "q": "Where did Abraham pitch his tent in relation to Bethel and Ai?", "a": "Having Bethel on the west, and Hai on the east (Genesis 12:8)" },
          { "q": "What did Abraham do at the altar he built near Bethel?", "a": "Called upon the name of the LORD (Genesis 12:8)" },
          { "q": "To where did Abraham return after his time in Egypt?", "a": "Unto the place of the altar, which he had made there at the first (Genesis 13:3)" },
          { "q": "What did Abraham do when he returned to the altar at Bethel?", "a": "Called on the name of the LORD (Genesis 13:4)" }
        ],
        "Jacob": [
          { "q": "What did Jacob see in his dream at Bethel?", "a": "A ladder set up on the earth, and the top of it reached to heaven: and behold the angels of God ascending and descending on it (Genesis 28:12)" },
          { "q": "What did Jacob call the place after his dream?", "a": "Beth-el (saying this is none other but the house of God) (Genesis 28:19)" },
          { "q": "What did Jacob set up as a pillar at Bethel?", "a": "The stone that he had put for his pillows (Genesis 28:18)" },
          { "q": "What vow did Jacob make at Bethel?", "a": "If God will be with me, and will keep me in this way that I go, and will give me bread to eat, and raiment to put on, so that I come again to my father's house in peace; then shall the LORD be my God (Genesis 28:20-22)" },
          { "q": "What did Jacob pour on the stone pillar at Bethel?", "a": "Oil upon the top of it (Genesis 28:18)" }
        ],
        "Samuel": [
          { "q": "What was Bethel in relation to Samuel's circuit as judge?", "a": "One of the places he went to in circuit to judge Israel (1 Samuel 7:16)" },
          { "q": "How often did Samuel go to Bethel in his duties as judge?", "a": "From year to year (1 Samuel 7:16)" },
          { "q": "What did Samuel do at Bethel during his circuit?", "a": "Judged Israel (1 Samuel 7:17)" },
          { "q": "Along with which other cities did Samuel judge Israel?", "a": "Gilgal and Mizpeh (1 Samuel 7:16)" },
          { "q": "Where was Samuel's house located in relation to his circuit?", "a": "In Ramah; for there was his house; and there he judged Israel (1 Samuel 7:17)" }
        ]
      }
    },
    "Hebron": {
      "significance": "First land purchase, kingship",
      "characters": {
        "Abraham": [
          { "q": "By which name was Hebron known in Abraham's time?", "a": "Kirjath-arba (Genesis 23:2)" },
          { "q": "What did Abraham purchase at Hebron?", "a": "The field of Ephron, which was in Machpelah, with the cave which was therein (Genesis 23:17-18)" },
          { "q": "From whom did Abraham buy the cave and field at Hebron?", "a": "Ephron the Hittite (Genesis 23:8-9)" },
          { "q": "How much did Abraham pay for the cave of Machpelah?", "a": "Four hundred shekels of silver (Genesis 23:15-16)" },
          { "q": "Who was buried in the cave Abraham purchased at Hebron?", "a": "Sarah his wife (Genesis 23:19)" }
        ],
        "Sarah": [
          { "q": "How old was Sarah when she died at Hebron?", "a": "An hundred and seven and twenty years old (Genesis 23:1)" },
          { "q": "Where was Sarah when she died?", "a": "In Kirjath-arba; the same is Hebron in the land of Canaan (Genesis 23:2)" },
          { "q": "What did Abraham do when Sarah died?", "a": "Abraham came to mourn for Sarah, and to weep for her (Genesis 23:2)" },
          { "q": "In what manner did Abraham purchase Sarah's burial place?", "a": "He weighed to Ephron the silver...current money with the merchant (Genesis 23:17-20)" },
          { "q": "Where was Sarah buried?", "a": "In the cave of the field of Machpelah before Mamre (Genesis 23:19)" }
        ],
        "Isaac": [
          { "q": "Who else was buried with Sarah in the cave at Hebron?", "a": "Abraham his father (Genesis 25:9)" },
          { "q": "Which two sons buried Isaac at Hebron?", "a": "Esau and Jacob (Genesis 35:29)" },
          { "q": "How old was Isaac when he died?", "a": "An hundred and fourscore years old (Genesis 35:28)" },
          { "q": "Where did Isaac dwell before his death?", "a": "In Mamre, unto the city of Arbah, which is Hebron (Genesis 35:27)" },
          { "q": "With whom was Isaac buried in the cave of Machpelah?", "a": "In the cave that Abraham bought...for a possession of a buryingplace (Genesis 35:29)" }
        ],
        "Rebecca": [
          { "q": "Where was Rebecca buried?", "a": "In the cave that is in the field of Machpelah (Genesis 49:31)" },
          { "q": "Who buried Rebecca at Hebron?", "a": "There they buried...Rebekah (Genesis 49:31)" },
          { "q": "With whom is Rebecca buried in the cave of Machpelah?", "a": "Abraham and Sarah his wife...Isaac and Rebekah his wife (Genesis 49:31)" },
          { "q": "What relationship did Rebecca have to Isaac?", "a": "She was his wife (Genesis 24:67)" },
          { "q": "How did Rebecca become Isaac's wife?", "a": "Isaac brought her into his mother Sarah's tent, and took Rebekah, and she became his wife (Genesis 24:58-67)" }
        ],
        "David": [
          { "q": "Where was David first anointed as king?", "a": "In Hebron (2 Samuel 2:4)" },
          { "q": "How long did David reign in Hebron?", "a": "Seven years and six months (2 Samuel 5:5)" },
          { "q": "Over which tribe did David first rule from Hebron?", "a": "Over the house of Judah (2 Samuel 2:4)" },
          { "q": "Who anointed David king in Hebron?", "a": "The men of Judah (2 Samuel 2:4)" },
          { "q": "To which city did David move his capital from Hebron?", "a": "To Jerusalem (2 Samuel 5:6-7)" }
        ]
      }
    },
    "Egypt (Goshen)": {
      "significance": "National formation, divine providence",
      "characters": {
        "Joseph": [
          { "q": "How old was Joseph when he was brought down to Egypt?", "a": "Seventeen years old when sold; thirty when he stood before Pharaoh (Genesis 37:2, 41:46)" },
          { "q": "Who bought Joseph in Egypt?", "a": "Potiphar, an officer of Pharaoh, captain of the guard (Genesis 39:1)" },
          { "q": "What did Pharaoh make Joseph ruler over?", "a": "All the land of Egypt (Genesis 41:43)" },
          { "q": "What did Joseph's brothers do when they first saw him in Egypt?", "a": "They bowed down themselves before him with their faces to the earth (Genesis 42:6)" },
          { "q": "In which part of Egypt did Joseph settle his family?", "a": "In the land of Rameses, in the best of the land (Genesis 47:11)" }
        ],
        "Jacob": [
          { "q": "How old was Jacob when he went down to Egypt?", "a": "An hundred and thirty years old (Genesis 47:9)" },
          { "q": "What did God tell Jacob about going down to Egypt?", "a": "Fear not to go down into Egypt; for I will there make of thee a great nation: I will go down with thee into Egypt (Genesis 46:3-4)" },
          { "q": "How many souls of Jacob's family went down to Egypt?", "a": "Threescore and ten souls (seventy) (Genesis 46:27)" },
          { "q": "What did Jacob do when he met Pharaoh?", "a": "Jacob blessed Pharaoh (Genesis 47:7, 47:10)" },
          { "q": "How many years did Jacob live in Egypt?", "a": "Seventeen years (Genesis 47:28)" }
        ],
        "Moses": [
          { "q": "Who found Moses in the river in Egypt?", "a": "The daughter of Pharaoh (Exodus 2:5)" },
          { "q": "What did Moses do to the Egyptian who was beating a Hebrew?", "a": "He slew the Egyptian, and hid him in the sand (Exodus 2:12)" },
          { "q": "To where did Moses flee from Egypt?", "a": "To the land of Midian (Exodus 2:15)" },
          { "q": "Who appeared to Moses to send him back to Egypt?", "a": "The angel of the LORD in a flame of fire out of the midst of a bush (Exodus 3:2, 3:10)" },
          { "q": "What signs did God give Moses to perform in Egypt?", "a": "His rod became a serpent, his hand became leprous, and he could turn water into blood (Exodus 4:2-9)" }
        ],
        "Israelites": [
          { "q": "How long did the children of Israel dwell in Egypt?", "a": "Four hundred and thirty years (Exodus 12:40)" },
          { "q": "What happened to the Israelites' population in Egypt?", "a": "The children of Israel were fruitful, and increased abundantly, and multiplied (Exodus 1:7)" },
          { "q": "What did the new king of Egypt make the Israelites do?", "a": "They did set over them taskmasters to afflict them with their burdens (Exodus 1:11)" },
          { "q": "What did Pharaoh command to be done to Hebrew male babies?", "a": "Every son that is born ye shall cast into the river (Exodus 1:22)" },
          { "q": "On what night did the Israelites leave Egypt?", "a": "It is a night to be much observed unto the LORD for bringing them out from the land of Egypt (Exodus 12:42)" }
        ]
      }
    },
    "Mount Sinai": {
      "significance": "Law-giving, divine encounter",
      "characters": {
        "Moses": [
          { "q": "What did Moses see in the burning bush at Mount Sinai?", "a": "The angel of the LORD appeared unto him in a flame of fire out of the midst of a bush (Exodus 3:2)" },
          { "q": "What did God tell Moses to remove at Mount Sinai?", "a": "Put off thy shoes from off thy feet, for the place whereon thou standest is holy ground (Exodus 3:5)" },
          { "q": "How long was Moses on Mount Sinai receiving the law?", "a": "Forty days and forty nights (Exodus 24:18)" },
          { "q": "What did Moses' face look like when he came down from Mount Sinai?", "a": "The skin of his face shone while he talked with him (Exodus 34:29)" },
          { "q": "On what did God write the Ten Commandments at Mount Sinai?", "a": "Two tables of stone, written with the finger of God (Exodus 31:18)" }
        ],
        "Aaron": [
          { "q": "Who went up Mount Sinai with Moses?", "a": "Moses, and Aaron, Nadab, and Abihu, and seventy of the elders of Israel (Exodus 24:9)" },
          { "q": "What did Aaron make while Moses was on Mount Sinai?", "a": "A molten calf (Exodus 32:4)" },
          { "q": "What excuse did Aaron give Moses about the golden calf?", "a": "I cast it into the fire, and there came out this calf (Exodus 32:22-24)" },
          { "q": "What did Aaron say when the people asked him to make gods?", "a": "Break off the golden earrings...and bring them unto me (Exodus 32:2)" },
          { "q": "How did Moses react when he saw what Aaron had done?", "a": "Moses' anger waxed hot, and he cast the tables out of his hands, and brake them (Exodus 32:19)" }
        ],
        "Israelites": [
          { "q": "What did the Israelites hear when God spoke from Mount Sinai?", "a": "Thunders and lightnings, and a thick cloud upon the mount, and the voice of the trumpet exceeding loud (Exodus 19:16)" },
          { "q": "What did the Israelites say to Moses about hearing God's voice?", "a": "Speak thou with us, and we will hear: but let not God speak with us, lest we die (Exodus 20:19)" },
          { "q": "How did the Israelites prepare to meet God at Mount Sinai?", "a": "Moses sanctified the people; and they washed their clothes (Exodus 19:10, 19:14)" },
          { "q": "What was forbidden for the Israelites regarding Mount Sinai?", "a": "Whosoever toucheth the mount shall be surely put to death (Exodus 19:12)" },
          { "q": "What did the Israelites promise about keeping God's commandments?", "a": "All that the LORD hath said will we do, and be obedient (Exodus 24:3)" }
        ],
        "Elijah": [
          { "q": "How long did Elijah travel to reach Mount Sinai?", "a": "Forty days and forty nights (1 Kings 19:8)" },
          { "q": "What sustained Elijah on his journey to Mount Sinai?", "a": "An angel touched him, and gave him a cake baken on the coals, and a cruse of water (1 Kings 19:6-8)" },
          { "q": "Where did Elijah lodge at Mount Sinai?", "a": "In a cave (1 Kings 19:9)" },
          { "q": "How did God speak to Elijah at Mount Sinai?", "a": "A still small voice (1 Kings 19:12)" },
          { "q": "What question did God ask Elijah at Mount Sinai?", "a": "What doest thou here, Elijah? (1 Kings 19:9, 19:13)" }
        ]
      }
    },
    "Jordan River": {
      "significance": "Promise fulfillment, transformation",
      "characters": {
        "Jacob": [
          { "q": "What happened to Jacob at the ford of Jabbok by the Jordan?", "a": "There wrestled a man with him until the breaking of the day (Genesis 32:24)" },
          { "q": "What was Jacob's name changed to after wrestling by the Jordan?", "a": "Israel: for as a prince hast thou power with God and with men, and hast prevailed (Genesis 32:28)" },
          { "q": "What did the angel touch on Jacob's body during the wrestling?", "a": "The hollow of Jacob's thigh (Genesis 32:25)" },
          { "q": "What did Jacob call the place where he wrestled with the angel?", "a": "Peniel: for I have seen God face to face, and my life is preserved (Genesis 32:30)" },
          { "q": "How did Jacob's thigh affect him after the wrestling?", "a": "Jacob halted upon his thigh (Genesis 32:31)" }
        ],
        "Joshua": [
          { "q": "What did God tell Joshua about crossing the Jordan?", "a": "Arise, go over this Jordan, thou, and all this people, unto the land which I do give to them (Joshua 1:2)" },
          { "q": "What happened to the Jordan River when the priests' feet touched it?", "a": "The waters which came down from above stood and rose up upon an heap (Joshua 3:15-16)" },
          { "q": "What did Joshua command to be taken from the Jordan?", "a": "Take you twelve stones out of the midst of Jordan (Joshua 4:3)" },
          { "q": "How many stones were taken from the Jordan?", "a": "Twelve stones (Joshua 4:8)" },
          { "q": "What did the stopping of Jordan's waters remind Joshua of?", "a": "As the LORD your God did to the Red sea, which he dried up from before us (Joshua 4:23)" }
        ],
        "Elijah": [
          { "q": "What did Elijah do to the waters of Jordan?", "a": "He took his mantle, and wrapped it together, and smote the waters (2 Kings 2:8)" },
          { "q": "With what did Elijah strike the Jordan?", "a": "His mantle (2 Kings 2:8)" },
          { "q": "Who crossed the Jordan with Elijah on dry ground?", "a": "Elisha (2 Kings 2:8)" },
          { "q": "What happened after Elijah struck the Jordan with his mantle?", "a": "They were divided hither and thither, so that they two went over on dry ground (2 Kings 2:8)" },
          { "q": "Where was Elijah taken up from near the Jordan?", "a": "As they still went on, and talked, that, behold, there appeared a chariot of fire (2 Kings 2:11)" }
        ],
        "Elisha": [
          { "q": "What did Elisha do to cross back over Jordan after Elijah was taken up?", "a": "He took the mantle of Elijah that fell from him, and smote the waters (2 Kings 2:14)" },
          { "q": "What did Elisha strike the Jordan with?", "a": "The mantle of Elijah that fell from him (2 Kings 2:14)" },
          { "q": "What did Elisha say when he struck the Jordan?", "a": "Where is the LORD God of Elijah? (2 Kings 2:14)" },
          { "q": "Who saw Elisha cross the Jordan after Elijah was taken?", "a": "The sons of the prophets which were to view at Jericho (2 Kings 2:15)" },
          { "q": "What did the sons of the prophets say when they saw Elisha cross Jordan?", "a": "The spirit of Elijah doth rest on Elisha (2 Kings 2:15)" }
        ]
      }
    },
    "Jericho": {
      "significance": "Divine warfare, faith demonstration",
      "characters": {
        "Rahab": [
          { "q": "What was Rahab's profession in Jericho?", "a": "An harlot (Joshua 2:1)" },
          { "q": "Where was Rahab's house located in Jericho?", "a": "Upon the town wall, and she dwelt upon the wall (Joshua 2:15)" },
          { "q": "What did Rahab let down to help the spies escape?", "a": "A cord through the window (Joshua 2:15)" },
          { "q": "What sign did Rahab put in her window?", "a": "This line of scarlet thread in the window (Joshua 2:18)" },
          { "q": "What did Joshua promise Rahab about her family?", "a": "Whosoever shall be with thee in the house, his blood shall be on our head (Joshua 2:14)" }
        ],
        "Joshua": [
          { "q": "How many men did Joshua send to spy out Jericho?", "a": "Two men (Joshua 2:1)" },
          { "q": "How many days did the Israelites march around Jericho?", "a": "Seven days (Joshua 6:3-4)" },
          { "q": "How many times did they march around Jericho on the seventh day?", "a": "Seven times (Joshua 6:4)" },
          { "q": "What did Joshua command the people not to do in Jericho?", "a": "Keep yourselves from the accursed thing, lest ye make yourselves accursed (Joshua 6:18)" },
          { "q": "What happened to the walls of Jericho?", "a": "The wall fell down flat (Joshua 6:20)" }
        ],
        "Elisha": [
          { "q": "What did the men of Jericho say about their city to Elisha?", "a": "Behold, I pray thee, the situation of this city is pleasant...but the water is naught (2 Kings 2:19)" },
          { "q": "What did Elisha ask for to heal the waters of Jericho?", "a": "Bring me a new cruse, and put salt therein (2 Kings 2:20)" },
          { "q": "Where did Elisha throw the salt in Jericho?", "a": "He went forth unto the spring of the waters, and cast the salt in there (2 Kings 2:21)" },
          { "q": "What did Elisha say about the waters of Jericho?", "a": "Thus saith the LORD, I have healed these waters; there shall not be from thence any more death or barren land (2 Kings 2:21)" },
          { "q": "What happened to the waters of Jericho after Elisha healed them?", "a": "So the waters were healed unto this day, according to the saying of Elisha (2 Kings 2:22)" }
        ]
      }
    },
    "Gilgal": {
      "significance": "Covenant renewal, leadership",
      "characters": {
        "Joshua": [
          { "q": "What did Joshua set up at Gilgal?", "a": "Those twelve stones, which they took out of Jordan, did Joshua pitch in Gilgal (Joshua 4:20)" },
          { "q": "What did the twelve stones at Gilgal represent?", "a": "When your children shall ask...What mean these stones? (Joshua 4:21-22)" },
          { "q": "What did Joshua do to the men of Israel at Gilgal?", "a": "At that time the LORD said unto Joshua, Make thee sharp knives, and circumcise again the children of Israel (Joshua 5:2-3)" },
          { "q": "Why was the place called Gilgal?", "a": "This day have I rolled away the reproach of Egypt from off you (Joshua 5:9)" },
          { "q": "What did the Israelites eat at Gilgal after the manna ceased?", "a": "They did eat of the old corn of the land...unleavened cakes, and parched corn (Joshua 5:11-12)" }
        ],
        "Samuel": [
          { "q": "What was Gilgal in relation to Samuel's duties?", "a": "He went from year to year in circuit to Beth-el, and Gilgal, and Mizpeh, and judged Israel (1 Samuel 7:16)" },
          { "q": "What did Samuel do yearly at Gilgal?", "a": "Judged Israel in all those places (1 Samuel 7:16)" },
          { "q": "Where did Samuel build an altar to the LORD?", "a": "There also he built an altar unto the LORD (1 Samuel 7:17)" },
          { "q": "How often did Samuel visit Gilgal in his circuit?", "a": "From year to year (1 Samuel 7:16)" },
          { "q": "What other cities did Samuel visit along with Gilgal?", "a": "Beth-el, and Mizpeh (1 Samuel 7:16)" }
        ],
        "Saul": [
          { "q": "Where did the people renew Saul's kingdom?", "a": "Then said Samuel to the people, Come, and let us go to Gilgal, and renew the kingdom there (1 Samuel 11:14)" },
          { "q": "What did they do at Gilgal regarding Saul's kingship?", "a": "There they made Saul king before the LORD in Gilgal (1 Samuel 11:15)" },
          { "q": "What sacrifices were offered at Gilgal for Saul?", "a": "There they sacrificed sacrifices of peace offerings before the LORD (1 Samuel 11:15)" },
          { "q": "How did the people rejoice at Gilgal with Saul?", "a": "There Saul and all the men of Israel rejoiced greatly (1 Samuel 11:15)" },
          { "q": "What did Samuel do at Gilgal before the people?", "a": "Behold, here I am: witness against me before the LORD (1 Samuel 12:3)" }
        ]
      }
    },
    "Shiloh": {
      "significance": "Central worship, prophetic calling",
      "characters": {
        "Eli": [
          { "q": "What was Eli's position at Shiloh?", "a": "A priest of the LORD (1 Samuel 1:9)" },
          { "q": "Where did Eli sit when he saw Hannah praying?", "a": "Upon a seat by a post of the temple of the LORD (1 Samuel 1:9)" },
          { "q": "What did Eli think about Hannah when he first saw her praying?", "a": "Eli thought she had been drunken (1 Samuel 1:13)" },
          { "q": "What blessing did Eli give to Hannah at Shiloh?", "a": "Go in peace: and the God of Israel grant thee thy petition that thou hast asked of him (1 Samuel 1:17)" },
          { "q": "What did God tell Samuel about Eli's house at Shiloh?", "a": "In that day I will perform against Eli all things which I have spoken concerning his house (1 Samuel 3:12-13)" }
        ],
        "Hannah": [
          { "q": "Why did Hannah go to Shiloh to pray?", "a": "She was barren and in bitterness of soul, and prayed unto the LORD, and wept sore (1 Samuel 1:10-11)" },
          { "q": "What vow did Hannah make at Shiloh?", "a": "If thou wilt give unto thine handmaid a man child, then I will give him unto the LORD all the days of his life (1 Samuel 1:11)" },
          { "q": "How did Hannah pray at Shiloh?", "a": "Hannah spake in her heart; only her lips moved, but her voice was not heard (1 Samuel 1:13)" },
          { "q": "What did Hannah do with Samuel at Shiloh?", "a": "For this child I prayed; and the LORD hath given me my petition...therefore also I have lent him to the LORD (1 Samuel 1:28)" },
          { "q": "What song did Hannah sing at Shiloh?", "a": "My heart rejoiceth in the LORD, mine horn is exalted in the LORD (1 Samuel 2:1-10)" }
        ],
        "Samuel": [
          { "q": "How old was Samuel when he was brought to Shiloh?", "a": "When the child was weaned (1 Samuel 1:24)" },
          { "q": "What did Samuel wear while serving at Shiloh?", "a": "A linen ephod (1 Samuel 2:18)" },
          { "q": "Who called to Samuel at Shiloh in the night?", "a": "The LORD called Samuel (1 Samuel 3:4)" },
          { "q": "How many times did the LORD call Samuel at Shiloh?", "a": "Three times before Samuel knew that the LORD had called him (1 Samuel 3:8)" },
          { "q": "What did the LORD reveal to Samuel at Shiloh?", "a": "Behold, I will do a thing in Israel, at which both the ears of every one that heareth it shall tingle (1 Samuel 3:11-14)" }
        ]
      }
    },
    "Ramah": {
      "significance": "Prophetic authority, kingship",
      "characters": {
        "Samuel": [
          { "q": "Where was Samuel's house located?", "a": "His house was in Ramah (1 Samuel 7:17)" },
          { "q": "What did Samuel build at Ramah?", "a": "There he built an altar unto the LORD (1 Samuel 7:17)" },
          { "q": "Where did Samuel judge Israel when he was at home?", "a": "There he judged Israel (1 Samuel 7:17)" },
          { "q": "From where did Samuel anoint Saul as king?", "a": "Then Samuel took a vial of oil, and poured it upon his head (1 Samuel 10:1)" },
          { "q": "Where did Samuel return to live after anointing Saul?", "a": "His return was to Ramah; for there was his house (1 Samuel 7:17)" }
        ],
        "Saul": [
          { "q": "Where did Samuel anoint Saul?", "a": "Samuel took Saul and his servant, and brought them into the parlour (1 Samuel 10:1)" },
          { "q": "What did Samuel pour on Saul's head at Ramah?", "a": "A vial of oil (1 Samuel 10:1)" },
          { "q": "What did Samuel tell Saul about God's choice at Ramah?", "a": "Is it not because the LORD hath anointed thee to be captain over his inheritance? (1 Samuel 10:1)" },
          { "q": "To where did Saul go after being anointed at Ramah?", "a": "When they came thither to the hill, behold, a company of prophets met him (1 Samuel 10:9-10)" },
          { "q": "What happened to Saul when he left Samuel at Ramah?", "a": "God gave him another heart: and all those signs came to pass that day (1 Samuel 10:9)" }
        ],
        "David": [
          { "q": "To whom did David flee when escaping from Saul?", "a": "David fled, and escaped, and came to Samuel to Ramah (1 Samuel 19:18)" },
          { "q": "Where did Samuel take David for protection?", "a": "He and Samuel went and dwelt in Naioth (1 Samuel 19:18)" },
          { "q": "What happened to Saul's messengers when they came to Ramah?", "a": "The Spirit of God was upon the messengers of Saul, and they also prophesied (1 Samuel 19:20)" },
          { "q": "What happened to Saul himself when he came to Ramah?", "a": "The Spirit of God was upon him also, and he went on, and prophesied (1 Samuel 19:23)" },
          { "q": "How long did Saul prophesy at Ramah?", "a": "He stripped off his clothes also, and prophesied before Samuel...and lay down naked all that day and all that night (1 Samuel 19:24)" }
        ]
      }
    },
    "Jerusalem": {
      "significance": "Ultimate destination, Temple",
      "characters": {
        "Abraham": [
          { "q": "To what land did God tell Abraham to take Isaac?", "a": "Into the land of Moriah (Genesis 22:2)" },
          { "q": "On which mountain did Abraham offer Isaac?", "a": "Upon one of the mountains which I will tell thee of (Genesis 22:2)" },
          { "q": "What did Abraham call the place where he offered Isaac?", "a": "Jehovah-jireh: as it is said to this day, In the mount of the LORD it shall be seen (Genesis 22:14)" },
          { "q": "What did Abraham see caught in the thicket?", "a": "A ram caught in a thicket by his horns (Genesis 22:13)" },
          { "q": "What did the angel of the LORD call to Abraham from?", "a": "The angel of the LORD called unto Abraham out of heaven the second time (Genesis 22:11)" }
        ],
        "David": [
          { "q": "What did David capture to make it his capital?", "a": "The strong hold of Zion: the same is the city of David (2 Samuel 5:7)" },
          { "q": "What did David call Jerusalem after he captured it?", "a": "The city of David (2 Samuel 5:9)" },
          { "q": "Where did David bring the ark of the covenant?", "a": "So David brought up the ark of the LORD unto the city of David with gladness (2 Samuel 6:12)" },
          { "q": "What did David purchase from Araunah in Jerusalem?", "a": "So David bought the threshingfloor and the oxen for fifty shekels of silver (2 Samuel 24:24)" },
          { "q": "Where did David want to build a house for the LORD?", "a": "See now, I dwell in an house of cedar, but the ark of God dwelleth within curtains (2 Samuel 7:2)" }
        ],
        "Solomon": [
          { "q": "Where did Solomon build the temple?", "a": "In mount Moriah, where the LORD appeared unto David his father (1 Kings 6:1)" },
          { "q": "How long did it take Solomon to build the temple?", "a": "Seven years (1 Kings 6:38)" },
          { "q": "What did Solomon place in the Most Holy Place?", "a": "The priests brought in the ark of the covenant of the LORD unto his place (1 Kings 8:6)" },
          { "q": "What filled the temple when Solomon dedicated it?", "a": "The cloud filled the house of the LORD (1 Kings 8:10-11)" },
          { "q": "What did Solomon offer at the dedication of the temple?", "a": "Two and twenty thousand oxen, and an hundred and twenty thousand sheep (1 Kings 8:63)" }
        ]
      }
    },
    "En-gedi": {
      "significance": "Divine mercy, character formation",
      "characters": {
        "David": [
          { "q": "Where did David hide from Saul in En-gedi?", "a": "David went up from thence, and dwelt in strong holds at En-gedi (1 Samuel 24:3)" },
          { "q": "What was Saul doing when David found him in the cave?", "a": "Saul went in to cover his feet (1 Samuel 24:3)" },
          { "q": "What did David cut from Saul in the cave?", "a": "David arose, and cut off the skirt of Saul's robe privily (1 Samuel 24:4)" },
          { "q": "What did David's heart do after he cut Saul's robe?", "a": "David's heart smote him, because he had cut off Saul's skirt (1 Samuel 24:5)" },
          { "q": "How did David address Saul when he came out of the cave?", "a": "My lord the king...bowed himself with his face to the earth, and did obeisance (1 Samuel 24:8)" }
        ],
        "Saul": [
          { "q": "How many men did Saul take to seek David at En-gedi?", "a": "Three thousand chosen men out of all Israel (1 Samuel 24:2)" },
          { "q": "What did Saul go into the cave to do?", "a": "Saul went in to cover his feet (1 Samuel 24:3)" },
          { "q": "What did David show Saul to prove he could have killed him?", "a": "Moreover, my father, see, yea, see the skirt of thy robe in my hand (1 Samuel 24:11)" },
          { "q": "How did Saul respond when David showed him mercy?", "a": "Saul lifted up his voice, and wept (1 Samuel 24:16)" },
          { "q": "What did Saul ask David to swear at En-gedi?", "a": "Swear now therefore unto me by the LORD, that thou wilt not cut off my seed after me (1 Samuel 24:21)" }
        ]
      }
    },
    "Mount Carmel": {
      "significance": "Divine vindication, false worship",
      "characters": {
        "Elijah": [
          { "q": "How many prophets of Baal did Elijah challenge on Mount Carmel?", "a": "Four hundred and fifty (1 Kings 18:22)" },
          { "q": "What did Elijah have poured on his sacrifice?", "a": "Fill four barrels with water, and pour it on the burnt sacrifice, and on the wood (1 Kings 18:33-34)" },
          { "q": "How many times did Elijah have water poured on the sacrifice?", "a": "And he said, Do it the second time...And he said, Do it the third time (1 Kings 18:34)" },
          { "q": "What did Elijah say when he called on the LORD?", "a": "LORD God of Abraham, Isaac, and of Israel, let it be known this day that thou art God in Israel (1 Kings 18:36-37)" },
          { "q": "What happened to the fire that came down on Mount Carmel?", "a": "The fire of the LORD fell, and consumed the burnt sacrifice, and the wood, and the stones, and the dust, and licked up the water (1 Kings 18:38)" }
        ],
        "Prophets of Baal": [
          { "q": "How many prophets of Baal were on Mount Carmel?", "a": "Four hundred and fifty prophets of Baal, and the prophets of the groves four hundred (1 Kings 18:19)" },
          { "q": "What did the prophets of Baal do to call on their god?", "a": "They cut themselves after their manner with knives and lancets, till the blood gushed out upon them (1 Kings 18:28)" },
          { "q": "How long did the prophets of Baal cry out to their god?", "a": "From morning even until noon...until the time of the offering of the evening sacrifice (1 Kings 18:26, 18:29)" },
          { "q": "What did Elijah mock the prophets of Baal about?", "a": "Cry aloud: for he is a god; either he is talking, or he is pursuing, or he is in a journey, or peradventure he sleepeth (1 Kings 18:27)" },
          { "q": "What happened to the prophets of Baal after the contest?", "a": "Elijah said unto them, Take the prophets of Baal; let not one of them escape. And they took them...and slew them (1 Kings 18:40)" }
        ],
        "Ahab": [
          { "q": "What did Ahab call Elijah when he met him?", "a": "Art thou he that troubleth Israel? (1 Kings 18:17)" },
          { "q": "What did Elijah tell Ahab to do regarding the prophets?", "a": "Now therefore send, and gather to me all Israel unto mount Carmel, and the prophets of Baal (1 Kings 18:19)" },
          { "q": "What did Ahab do after the contest on Mount Carmel?", "a": "Ahab went up to eat and to drink (1 Kings 18:42)" },
          { "q": "What did Elijah tell Ahab about rain?", "a": "Get thee up, eat and drink; for there is a sound of abundance of rain (1 Kings 18:41)" },
          { "q": "How did Ahab travel from Mount Carmel?", "a": "Ahab rode, and went to Jezreel (1 Kings 18:45-46)" }
        ]
      }
    },
    "Brook Cherith": {
      "significance": "Divine provision, faith testing",
      "characters": {
        "Elijah": [
          { "q": "Who told Elijah to go to the brook Cherith?", "a": "The word of the LORD came unto him, saying (1 Kings 17:2-3)" },
          { "q": "What did God promise Elijah at the brook Cherith?", "a": "Thou shalt drink of the brook; and I have commanded the ravens to feed thee there (1 Kings 17:4)" },
          { "q": "What brought Elijah food at the brook Cherith?", "a": "The ravens (1 Kings 17:6)" },
          { "q": "What did the ravens bring Elijah?", "a": "The ravens brought him bread and flesh in the morning, and bread and flesh in the evening (1 Kings 17:6)" },
          { "q": "What happened to the brook Cherith?", "a": "The brook dried up, because there had been no rain in the land (1 Kings 17:7)" }
        ],
        "Ravens": [
          { "q": "How often did the ravens bring food to Elijah?", "a": "In the morning, and...in the evening (1 Kings 17:6)" },
          { "q": "What did the ravens bring Elijah in the morning?", "a": "Bread and flesh in the morning (1 Kings 17:6)" },
          { "q": "What did the ravens bring Elijah in the evening?", "a": "Bread and flesh in the evening (1 Kings 17:6)" },
          { "q": "Who commanded the ravens to feed Elijah?", "a": "I have commanded the ravens to feed thee there (1 Kings 17:4)" },
          { "q": "From where did the ravens get Elijah's food?", "a": "(Scripture does not specify the source) (1 Kings 17:6)" }
        ]
      }
    },
    "Damascus": {
      "significance": "God's international sovereignty",
      "characters": {
        "Abraham": [
          { "q": "How far did Abraham pursue the kings who took Lot?", "a": "He pursued them unto Dan...unto Hobah, which is on the left hand of Damascus (Genesis 14:15)" },
          { "q": "Who was Abraham's steward from Damascus?", "a": "This Eliezer of Damascus (Genesis 15:2)" },
          { "q": "What did Abraham think about his heir before Isaac was born?", "a": "Lord GOD, what wilt thou give me, seeing I go childless, and the steward of my house is this Eliezer of Damascus? (Genesis 15:3)" },
          { "q": "What was the name of Abraham's servant from Damascus?", "a": "Eliezer of Damascus (Genesis 15:2)" },
          { "q": "What did Abraham recover when he pursued the enemy to Damascus?", "a": "He brought back all the goods, and also brought again his brother Lot, and his goods, and the women also, and the people (Genesis 14:16)" }
        ],
        "David": [
          { "q": "What did David do when the Syrians of Damascus came to help Hadadezer?", "a": "David slew of the Syrians two and twenty thousand men (2 Samuel 8:5)" },
          { "q": "How many Syrians did David slay in Damascus?", "a": "Two and twenty thousand men (2 Samuel 8:5)" },
          { "q": "Where did David put garrisons after defeating Damascus?", "a": "Then David put garrisons in Syria of Damascus (2 Samuel 8:6)" },
          { "q": "What tribute did Damascus bring to David?", "a": "The Syrians became servants to David, and brought gifts (2 Samuel 8:6)" },
          { "q": "What did the LORD do for David in Damascus?", "a": "The LORD preserved David whithersoever he went (2 Samuel 8:6)" }
        ],
        "Naaman": [
          { "q": "What was Naaman's position in Damascus?", "a": "Captain of the host of the king of Syria (2 Kings 5:1)" },
          { "q": "What disease did Naaman have?", "a": "He was a leper (2 Kings 5:1)" },
          { "q": "Who told Naaman about the prophet in Israel?", "a": "A little maid that waited on Naaman's wife (2 Kings 5:2-3)" },
          { "q": "What rivers did Naaman mention from Damascus?", "a": "Are not Abana and Pharpar, rivers of Damascus, better than all the waters of Israel? (2 Kings 5:12)" },
          { "q": "What did Naaman take from Israel back to Damascus?", "a": "Two mules' burden of earth (2 Kings 5:17)" }
        ],
        "Elisha": [
          { "q": "Who did the LORD tell Elijah to anoint as king over Syria in Damascus?", "a": "Hazael (1 Kings 19:15)" },
          { "q": "What did Elisha tell Hazael about Ben-hadad in Damascus?", "a": "Go, say unto him, Thou mayest certainly recover: howbeit the LORD hath shewed me that he shall surely die (2 Kings 8:10)" },
          { "q": "What did Elisha tell Hazael he would do to Israel?", "a": "Thou wilt...rip up their women with child (2 Kings 8:12)" },
          { "q": "How did Hazael become king of Damascus?", "a": "He took a thick cloth, and dipped it in water, and spread it on his face, so that he died (2 Kings 8:15)" }
        ]
      }
    },
    "Nineveh": {
      "significance": "Universal mercy, repentance",
      "characters": {
        "Jonah": [
          { "q": "Where did the LORD tell Jonah to go and preach?", "a": "Arise, go to Nineveh, that great city, and cry against it (Jonah 1:2)" },
          { "q": "What did Jonah do instead of going to Nineveh?", "a": "Jonah rose up to flee unto Tarshish from the presence of the LORD (Jonah 1:3)" },
          { "q": "What did Jonah preach to Nineveh?", "a": "Yet forty days, and Nineveh shall be overthrown (Jonah 3:4)" },
          { "q": "How did the people of Nineveh respond to Jonah's preaching?", "a": "So the people of Nineveh believed God, and proclaimed a fast, and put on sackcloth (Jonah 3:5)" },
          { "q": "What was Jonah's attitude about Nineveh's repentance?", "a": "But it displeased Jonah exceedingly, and he was very angry (Jonah 4:1)" }
        ],
        "King of Nineveh": [
          { "q": "What did the king of Nineveh do when he heard Jonah's message?", "a": "He arose from his throne, and he laid his robe from him, and covered him with sackcloth, and sat in ashes (Jonah 3:6)" },
          { "q": "What decree did the king of Nineveh make?", "a": "Let neither man nor beast, herd nor flock, taste any thing: let them not feed, nor drink water (Jonah 3:7-8)" },
          { "q": "What did the king hope God would do for Nineveh?", "a": "Who can tell if God will turn and repent, and turn away from his fierce anger, that we perish not? (Jonah 3:9)" },
          { "q": "What did the king of Nineveh put on when he repented?", "a": "Covered him with sackcloth, and sat in ashes (Jonah 3:6)" },
          { "q": "What did the king command all people and animals to do?", "a": "Let them be covered with sackcloth, both man and beast, and cry mightily unto God (Jonah 3:8)" }
        ]
      }
    },
    "Babylon": {
      "significance": "Judgment, faithfulness, sovereignty",
      "characters": {
        "Nebuchadnezzar": [
          { "q": "What did Nebuchadnezzar take from Jerusalem to Babylon?", "a": "Part of the vessels of the house of God (Daniel 1:2)" },
          { "q": "What did Nebuchadnezzar command his chief eunuch to do?", "a": "Bring certain of the children of Israel, and of the king's seed, and of the princes (Daniel 1:3)" },
          { "q": "What did Nebuchadnezzar see in his dream that troubled him?", "a": "Nebuchadnezzar dreamed dreams, wherewith his spirit was troubled, and his sleep brake from him (Daniel 2:1)" },
          { "q": "What happened to Nebuchadnezzar for seven years?", "a": "He was driven from men, and did eat grass as oxen (Daniel 4:32-33)" },
          { "q": "What did Nebuchadnezzar declare about the God of Daniel?", "a": "Now I Nebuchadnezzar praise and extol and honour the King of heaven (Daniel 4:34-37)" }
        ],
        "Daniel": [
          { "q": "What did Daniel refuse to eat in Babylon?", "a": "Daniel purposed in his heart that he would not defile himself with the portion of the king's meat (Daniel 1:8)" },
          { "q": "What test did Daniel propose to the prince of eunuchs?", "a": "Prove thy servants, I beseech thee, ten days; and let them give us pulse to eat, and water to drink (Daniel 1:12-13)" },
          { "q": "What ability did God give Daniel in Babylon?", "a": "God gave them knowledge and skill in all learning and wisdom: and Daniel had understanding in all visions and dreams (Daniel 1:17)" },
          { "q": "How many times a day did Daniel pray toward Jerusalem?", "a": "He kneeled upon his knees three times a day, and prayed (Daniel 6:10)" },
          { "q": "What happened to Daniel when he was thrown into the lions' den?", "a": "My God hath sent his angel, and hath shut the lions' mouths, that they have not hurt me (Daniel 6:22)" }
        ],
        "Shadrach, Meshach, Abednego": [
          { "q": "What were the Hebrew names of Shadrach, Meshach, and Abednego?", "a": "Hananiah, Mishael, and Azariah (Daniel 1:6-7)" },
          { "q": "What did they refuse to do in Babylon?", "a": "They serve not thy gods, nor worship the golden image which thou hast set up (Daniel 3:12)" },
          { "q": "What did Nebuchadnezzar threaten to do to them?", "a": "Ye shall be cast the same hour into the midst of a burning fiery furnace (Daniel 3:15)" },
          { "q": "What did they say about God's ability to deliver them?", "a": "Our God whom we serve is able to deliver us from the burning fiery furnace (Daniel 3:17)" },
          { "q": "Who did Nebuchadnezzar see walking in the fiery furnace with them?", "a": "The form of the fourth is like the Son of God (Daniel 3:25)" }
        ]
      }
    },
    "Shushan": {
      "significance": "Divine protection, deliverance",
      "characters": {
        "Esther": [
          { "q": "What was Esther's Hebrew name?", "a": "Hadassah (Esther 2:7)" },
          { "q": "How did Esther become queen in Shushan?", "a": "The king loved Esther above all the women...so that he set the royal crown upon her head (Esther 2:17)" },
          { "q": "What did Esther risk by going to the king uninvited?", "a": "Whosoever...shall come unto the king into the inner court, who is not called, there is one law of his to put him to death (Esther 4:11)" },
          { "q": "What did Esther ask the Jews to do before she went to the king?", "a": "Go, gather together all the Jews that are present in Shushan, and fast ye for me (Esther 4:16)" },
          { "q": "What banquet did Esther prepare in Shushan?", "a": "Let the king and Haman come this day unto the banquet that I have prepared for him (Esther 5:4)" }
        ],
        "Mordecai": [
          { "q": "What was Mordecai's relationship to Esther?", "a": "For Mordecai had taken her for his own daughter (Esther 2:7)" },
          { "q": "What did Mordecai refuse to do that angered Haman?", "a": "Mordecai bowed not, nor did him reverence (Esther 3:2)" },
          { "q": "What conspiracy did Mordecai uncover in Shushan?", "a": "Mordecai sat in the king's gate, two of the king's chamberlains...sought to lay hand on the king Ahasuerus (Esther 2:21-22)" },
          { "q": "What honor did the king give Mordecai in Shushan?", "a": "Let the royal apparel be brought which the king useth to wear...and bring him on horseback through the street of the city (Esther 6:10-11)" },
          { "q": "What position did Mordecai receive after Haman's death?", "a": "The king took off his ring, which he had taken from Haman, and gave it unto Mordecai (Esther 8:2)" }
        ],
        "Haman": [
          { "q": "What position did Haman hold in Shushan?", "a": "After these things did king Ahasuerus promote Haman...and set his seat above all the princes (Esther 3:1)" },
          { "q": "What did Haman plan to do to the Jews?", "a": "To destroy, to kill, and to cause to perish, all Jews, both young and old, little children and women, in one day (Esther 3:13)" },
          { "q": "What did Haman build for Mordecai?", "a": "Let a gallows be made of fifty cubits high, and to morrow speak thou unto the king that Mordecai may be hanged thereon (Esther 5:14)" },
          { "q": "What happened to Haman at Esther's banquet?", "a": "So they hanged Haman on the gallows that he had prepared for Mordecai (Esther 7:10)" },
          { "q": "What lots did Haman cast to choose the day to destroy the Jews?", "a": "They cast Pur, that is, the lot, before Haman from day to day, and from month to month (Esther 3:7)" }
        ],
        "King Ahasuerus": [
          { "q": "Over how many provinces did Ahasuerus reign from Shushan?", "a": "From India even unto Ethiopia, over an hundred and seven and twenty provinces (Esther 1:1)" },
          { "q": "What did Ahasuerus do to Queen Vashti?", "a": "That Vashti come not before king Ahasuerus; and let the king give her royal estate unto another (Esther 1:19)" },
          { "q": "What did Ahasuerus extend to Esther when she came uninvited?", "a": "The king held out to Esther the golden sceptre that was in his hand (Esther 5:2)" },
          { "q": "What did Ahasuerus ask Haman to do for Mordecai?", "a": "What shall be done unto the man whom the king delighteth to honour? (Esther 6:6, 6:10)" },
          { "q": "What ring did Ahasuerus give to Mordecai?", "a": "The king took off his ring, which he had taken from Haman, and gave it unto Mordecai (Esther 8:2)" }
        ]
      }
    },
    "Land of Uz": {
      "significance": "Faith through suffering",
      "characters": {
        "Job": [
          { "q": "How is Job described in the land of Uz?", "a": "That man was perfect and upright, and one that feared God, and eschewed evil (Job 1:1)" },
          { "q": "How many sons and daughters did Job have in the land of Uz?", "a": "There were born unto him seven sons and three daughters (Job 1:2)" },
          { "q": "What animals did Job possess in the land of Uz?", "a": "Seven thousand sheep, and three thousand camels, and five hundred yoke of oxen, and five hundred she asses (Job 1:3)" },
          { "q": "What did Job do regularly for his children?", "a": "Job sent and sanctified them, and rose up early in the morning, and offered burnt offerings according to the number of them all (Job 1:5)" },
          { "q": "What was Job's response when he lost everything?", "a": "The LORD gave, and the LORD hath taken away; blessed be the name of the LORD (Job 1:21)" }
        ],
        "Eliphaz": [
          { "q": "From where did Eliphaz come to visit Job?", "a": "Eliphaz the Temanite (Job 2:11)" },
          { "q": "What did Eliphaz and Job's friends do when they first saw Job?", "a": "They lifted up their voice, and wept; and they rent every one his mantle, and sprinkled dust upon their heads (Job 2:12)" },
          { "q": "How long did Eliphaz sit with Job before speaking?", "a": "So they sat down with him upon the ground seven days and seven nights, and none spake a word unto him (Job 2:13)" },
          { "q": "What did Eliphaz say about Job's suffering?", "a": "Remember, I pray thee, who ever perished, being innocent? (Job 4:7-8)" },
          { "q": "What vision did Eliphaz claim to have received?", "a": "Now a thing was secretly brought to me, and mine ear received a little thereof (Job 4:12-16)" }
        ],
        "Bildad": [
          { "q": "How is Bildad identified when he comes to Job?", "a": "Bildad the Shuhite (Job 2:11)" },
          { "q": "What did Bildad say about God's justice?", "a": "Doth God pervert judgment? or doth the Almighty pervert justice? (Job 8:3)" },
          { "q": "What did Bildad say happened to Job's children?", "a": "If thy children have sinned against him, and he have cast them away for their transgression (Job 8:4)" },
          { "q": "What did Bildad tell Job to do?", "a": "If thou wouldest seek unto God betimes, and make thy supplication to the Almighty (Job 8:5-6)" },
          { "q": "What did Bildad say about the wicked?", "a": "So are the paths of all that forget God; and the hypocrite's hope shall perish (Job 8:13)" }
        ],
        "Zophar": [
          { "q": "From where did Zophar come to visit Job?", "a": "Zophar the Naamathite (Job 2:11)" },
          { "q": "What did Zophar say about Job's words?", "a": "Should not the multitude of words be answered? and should a man full of talk be justified? (Job 11:2-3)" },
          { "q": "What did Zophar say Job deserved?", "a": "Know therefore that God exacteth of thee less than thine iniquity deserveth (Job 11:6)" },
          { "q": "What did Zophar say about God's knowledge?", "a": "Canst thou by searching find out God? canst thou find out the Almighty unto perfection? (Job 11:7-8)" },
          { "q": "What did Zophar promise Job if he repented?", "a": "If thou prepare thine heart, and stretch out thine hands toward him...then shalt thou lift up thy face without spot (Job 11:13-15)" }
        ]
      }
    },
    "Fiery Furnace": {
      "significance": "Divine protection, faith testimony",
      "characters": {
        "Shadrach": [
          { "q": "What was Shadrach's Hebrew name?", "a": "Hananiah (Daniel 1:6-7)" },
          { "q": "What position did Shadrach hold in Babylon?", "a": "Daniel requested of the king, and he set Shadrach, Meshach, and Abednego, over the affairs of the province of Babylon (Daniel 2:49)" },
          { "q": "What did Shadrach refuse to worship?", "a": "They serve not thy gods, nor worship the golden image which thou hast set up (Daniel 3:12)" },
          { "q": "What happened to Shadrach in the fiery furnace?", "a": "Upon whose bodies the fire had no power, nor was an hair of their head singed (Daniel 3:27)" },
          { "q": "What did Shadrach say about serving other gods?", "a": "But if not, be it known unto thee, O king, that we will not serve thy gods (Daniel 3:18)" }
        ],
        "Meshach": [
          { "q": "What was Meshach's Hebrew name?", "a": "Mishael (Daniel 1:6-7)" },
          { "q": "Along with whom was Meshach appointed over affairs of Babylon?", "a": "He set Shadrach, Meshach, and Abednego, over the affairs of the province of Babylon (Daniel 2:49)" },
          { "q": "What accusation was brought against Meshach?", "a": "There are certain Jews whom thou hast set over the affairs of the province of Babylon...these men, O king, have not regarded thee (Daniel 3:12)" },
          { "q": "How did the fire affect Meshach?", "a": "Neither were their coats changed, nor the smell of fire had passed on them (Daniel 3:27)" },
          { "q": "What did Meshach declare about God's power to deliver?", "a": "Our God whom we serve is able to deliver us from the burning fiery furnace (Daniel 3:17)" }
        ],
        "Abednego": [
          { "q": "What was Abednego's Hebrew name?", "a": "Azariah (Daniel 1:6-7)" },
          { "q": "What administration was Abednego placed over?", "a": "Over the affairs of the province of Babylon (Daniel 2:49)" },
          { "q": "What music was played when Abednego was supposed to worship the image?", "a": "At what time ye hear the sound of the cornet, flute, harp, sackbut, psaltery, dulcimer, and all kinds of musick (Daniel 3:7)" },
          { "q": "What did the fire not do to Abednego?", "a": "Upon whose bodies the fire had no power, nor was an hair of their head singed, neither were their coats changed, nor the smell of fire had passed on them (Daniel 3:27)" },
          { "q": "What did Abednego say about worshipping the golden image?", "a": "We will not serve thy gods, nor worship the golden image which thou hast set up (Daniel 3:18)" }
        ]
      }
    }
  };
  }

  static getMedievalTriviaDatabase() {
    return {
      "Castle Walls": {
        "significance": "Fortified stronghold, center of feudal power",
        "characters": {
          "William the Conqueror": [
            {
              "q": "In what year did William the Conqueror defeat King Harold at the Battle of Hastings?",
              "a": "1066"
            },
            {
              "q": "What famous tapestry depicts William's conquest of England?",
              "a": "The Bayeux Tapestry"
            },
            {
              "q": "What was William's title before he became King of England?",
              "a": "Duke of Normandy"
            },
            {
              "q": "What system of land tenure did William establish in England?",
              "a": "The feudal system"
            },
            {
              "q": "What great survey did William commission to record English lands and resources?",
              "a": "The Domesday Book"
            }
          ],
          "King Arthur": [
            {
              "q": "What was the name of King Arthur's legendary sword?",
              "a": "Excalibur"
            },
            {
              "q": "Who was Arthur's trusted wizard and advisor?",
              "a": "Merlin"
            },
            {
              "q": "What was the name of Arthur's legendary court?",
              "a": "Camelot"
            },
            {
              "q": "What shape was the table around which Arthur's knights gathered?",
              "a": "Round"
            },
            {
              "q": "Who was Arthur's queen?",
              "a": "Guinevere"
            }
          ],
          "Richard the Lionheart": [
            {
              "q": "Which Crusade was Richard the Lionheart famous for leading?",
              "a": "The Third Crusade"
            },
            {
              "q": "Who was Richard's main opponent during the Third Crusade?",
              "a": "Saladin"
            },
            {
              "q": "How much time did Richard actually spend in England during his reign?",
              "a": "About six months"
            },
            {
              "q": "Where was Richard captured and held for ransom on his way back from the Crusades?",
              "a": "Austria"
            },
            {
              "q": "What was the enormous ransom paid for Richard's release?",
              "a": "150,000 marks of silver"
            }
          ]
        }
      },
      "Monastery": {
        "significance": "Center of learning and faith",
        "characters": {
          "Thomas Becket": [
            {
              "q": "Which king had Thomas Becket murdered in Canterbury Cathedral?",
              "a": "Henry II"
            },
            {
              "q": "What position did Thomas Becket hold that led to his conflict with the king?",
              "a": "Archbishop of Canterbury"
            },
            {
              "q": "In what year was Thomas Becket murdered?",
              "a": "1170"
            },
            {
              "q": "What famous quote is attributed to Henry II regarding Becket?",
              "a": "Will no one rid me of this turbulent priest?"
            },
            {
              "q": "How long after his death was Thomas Becket canonized as a saint?",
              "a": "Three years"
            }
          ],
          "Geoffrey Chaucer": [
            {
              "q": "What is Geoffrey Chaucer's most famous work?",
              "a": "The Canterbury Tales"
            },
            {
              "q": "To which shrine were Chaucer's pilgrims traveling?",
              "a": "Thomas Becket's shrine at Canterbury"
            },
            {
              "q": "In what language did Chaucer write most of his works?",
              "a": "Middle English"
            },
            {
              "q": "What was Chaucer's profession besides writing?",
              "a": "Civil servant and diplomat"
            },
            {
              "q": "How many tales were planned for The Canterbury Tales?",
              "a": "120 tales (though only 24 were completed)"
            }
          ]
        }
      },
      "Royal Court": {
        "significance": "Seat of royal power and intrigue",
        "characters": {
          "Eleanor of Aquitaine": [
            {
              "q": "Eleanor of Aquitaine was queen consort to which two kings?",
              "a": "Louis VII of France and Henry II of England"
            },
            {
              "q": "Which famous Crusade did Eleanor participate in?",
              "a": "The Second Crusade"
            },
            {
              "q": "Which of Eleanor's sons became King of England?",
              "a": "Richard the Lionheart and later John Lackland"
            },
            {
              "q": "What was Eleanor's role in the development of courtly love?",
              "a": "She patronized troubadours and promoted the ideals of chivalric romance"
            },
            {
              "q": "How long was Eleanor imprisoned by Henry II?",
              "a": "Sixteen years"
            }
          ],
          "Henry II": [
            {
              "q": "What legal reforms did Henry II implement in England?",
              "a": "Common law and royal courts"
            },
            {
              "q": "What was the conflict between Henry II and Thomas Becket about?",
              "a": "The jurisdiction of church courts versus royal courts"
            },
            {
              "q": "Which empire did Henry II rule over?",
              "a": "The Angevin Empire"
            },
            {
              "q": "What happened to Henry II's sons?",
              "a": "They frequently rebelled against him"
            },
            {
              "q": "What was Henry II's relationship to William the Conqueror?",
              "a": "He was William's great-grandson"
            }
          ]
        }
      },
      "Canterbury": {
        "significance": "Famous pilgrimage destination",
        "characters": {
          "Thomas Becket": [
            {
              "q": "Where was Thomas Becket murdered?",
              "a": "Canterbury Cathedral"
            },
            {
              "q": "What miracle stories were associated with Thomas Becket's shrine?",
              "a": "Healing of the sick and blind"
            },
            {
              "q": "How did pilgrims show devotion at Becket's shrine?",
              "a": "They crawled on their knees and left offerings"
            },
            {
              "q": "What happened to Becket's shrine during the Reformation?",
              "a": "It was destroyed by Henry VIII"
            },
            {
              "q": "What was the Canterbury pilgrimage route called?",
              "a": "The Pilgrim's Way"
            }
          ],
          "Geoffrey Chaucer": [
            {
              "q": "How many pilgrims are in Chaucer's Canterbury Tales?",
              "a": "29 pilgrims plus the narrator"
            },
            {
              "q": "From where do Chaucer's pilgrims depart?",
              "a": "The Tabard Inn in Southwark"
            },
            {
              "q": "What prize was offered for the best tale?",
              "a": "A free meal at the inn"
            },
            {
              "q": "Which tale is considered the most bawdy and humorous?",
              "a": "The Miller's Tale"
            },
            {
              "q": "What social classes are represented in the Canterbury Tales?",
              "a": "All levels from nobility to peasants"
            }
          ]
        }
      },
      "Camelot": {
        "significance": "Legendary court of King Arthur",
        "characters": {
          "King Arthur": [
            {
              "q": "How did Arthur prove his right to be king?",
              "a": "By pulling the sword from the stone"
            },
            {
              "q": "What was the name of Arthur's father?",
              "a": "Uther Pendragon"
            },
            {
              "q": "What was the quest that Arthur's knights undertook?",
              "a": "The quest for the Holy Grail"
            },
            {
              "q": "Who betrayed Arthur and caused his downfall?",
              "a": "Mordred, his illegitimate son"
            },
            {
              "q": "Where was Arthur taken to heal from his final wounds?",
              "a": "The Isle of Avalon"
            }
          ],
          "Sir Lancelot": [
            {
              "q": "What was Lancelot's greatest achievement as a knight?",
              "a": "Being the greatest knight of the Round Table"
            },
            {
              "q": "What was Lancelot's tragic flaw?",
              "a": "His love for Queen Guinevere"
            },
            {
              "q": "What prevented Lancelot from achieving the Holy Grail?",
              "a": "His adultery with Guinevere"
            },
            {
              "q": "Who was Lancelot's son who achieved the Grail?",
              "a": "Sir Galahad"
            },
            {
              "q": "How did Lancelot end his days?",
              "a": "As a hermit monk"
            }
          ],
          "Merlin": [
            {
              "q": "What was Merlin's role in Arthur's birth?",
              "a": "He helped Uther Pendragon disguise himself to conceive Arthur"
            },
            {
              "q": "What happened to Merlin in most versions of the legend?",
              "a": "He was trapped by the Lady of the Lake or Morgan le Fay"
            },
            {
              "q": "What magical construction was Merlin credited with?",
              "a": "Stonehenge"
            },
            {
              "q": "What was Merlin's prophecy about Arthur?",
              "a": "That he would unite Britain and return in its darkest hour"
            },
            {
              "q": "What was Merlin's relationship to Arthur besides being his advisor?",
              "a": "He was his magical protector and mentor"
            }
          ]
        }
      },
      "Robin Hood's Hideout": {
        "significance": "Secret refuge in the greenwood",
        "characters": {
          "Robin Hood": [
            {
              "q": "What was Robin Hood's motto regarding wealth?",
              "a": "Rob from the rich and give to the poor"
            },
            {
              "q": "In which forest did Robin Hood make his home?",
              "a": "Sherwood Forest"
            },
            {
              "q": "Who was Robin Hood's main enemy?",
              "a": "The Sheriff of Nottingham"
            },
            {
              "q": "What was the name of Robin Hood's love interest?",
              "a": "Maid Marian"
            },
            {
              "q": "What weapon was Robin Hood most famous for using?",
              "a": "The longbow"
            }
          ],
          "Little John": [
            {
              "q": "How did Little John get his name?",
              "a": "Ironically, because he was actually very tall"
            },
            {
              "q": "What was Little John's role in Robin's band?",
              "a": "His second-in-command and closest friend"
            },
            {
              "q": "How did Robin Hood and Little John first meet?",
              "a": "They fought with staffs on a narrow bridge"
            },
            {
              "q": "What was Little John's weapon of choice?",
              "a": "A quarterstaff"
            },
            {
              "q": "What happened to Little John after Robin's death?",
              "a": "He continued leading the remaining Merry Men"
            }
          ],
          "Friar Tuck": [
            {
              "q": "What was unusual about Friar Tuck for a man of the cloth?",
              "a": "He was a skilled fighter and archer"
            },
            {
              "q": "What role did Friar Tuck serve for the Merry Men?",
              "a": "Their chaplain and spiritual advisor"
            },
            {
              "q": "How did Friar Tuck join Robin's band?",
              "a": "After Robin carried him across a river"
            },
            {
              "q": "What weapon did Friar Tuck prefer?",
              "a": "A sword and buckler"
            },
            {
              "q": "What was Friar Tuck's personality like?",
              "a": "Jovial, fond of food and drink, but fierce in battle"
            }
          ]
        }
      }
    };
  }

  static getAngelCards() {
    return [
      { title: "Abraham's Visitors", scripture: "Genesis 18:1-2", effect: "Gain 3 SP immediately and choose any character to gain 1 point with. Divine visitors bring blessing and revelation.", symbol: "👼" },
      { title: "Angel of the Sacrifice", scripture: "Genesis 22:11-12", effect: "When you would lose SP from any source, this card prevents all loss. Discard after use.", symbol: "🛡️" },
      { title: "Hagar's Comforter", scripture: "Genesis 21:17-19", effect: "Gain 2 SP and recover 1 livestock. The angel provides water in the wilderness.", symbol: "🌊" },
      { title: "Lot's Deliverers", scripture: "Genesis 19:15-16", effect: "Move immediately to any location on the board. Angels lead you to safety before judgment falls.", symbol: "🏃" },
      { title: "Jacob's Ladder", scripture: "Genesis 28:12", effect: "Gain 4 SP. The connection between heaven and earth brings great blessing.", symbol: "🪜" },
      { title: "Burning Bush Angel", scripture: "Exodus 3:2", effect: "Gain 1 Helper immediately from any character, regardless of your points with them. Divine calling transcends normal requirements.", symbol: "🔥" },
      { title: "Balaam's Rebuke", scripture: "Numbers 22:31", effect: "Look at the next character you will encounter. Choose whether to proceed or move to a different location.", symbol: "👁️" },
      { title: "Captain of the Host", scripture: "Joshua 5:14", effect: "Your next encounter with wolves or bandits is automatically won without rolling. Divine authority commands victory.", symbol: "⚔️" },
      { title: "Gideon's Fire", scripture: "Judges 6:21", effect: "For your next 3 turns, gain +1 SP for every correct answer (4 total instead of 3).", symbol: "🔥" },
      { title: "Samson's Announcer", scripture: "Judges 13:3", effect: "Choose a character you have 0-1 points with. Gain 2 points with them immediately. Great purposes require divine announcement.", symbol: "👶" },
      { title: "Elijah's Provider", scripture: "1 Kings 19:5", effect: "Gain 3 SP and recover all lost livestock and coins. God's provision sustains His prophets.", symbol: "🍞" },
      { title: "Elisha's Army", scripture: "2 Kings 6:17", effect: "Immunity to all Demon card effects for the next 4 turns. The mountain is full of horses and chariots of fire.", symbol: "🐎" },
      { title: "Assyrian Destroyer", scripture: "2 Kings 19:35", effect: "All other players lose 2 SP. The angel of the LORD protects His people while judging enemies.", symbol: "⚔️" },
      { title: "Daniel's Guardian", scripture: "Daniel 6:22", effect: "Wolves cannot attack you for the rest of the game. Your faithfulness shuts the lions' mouths.", symbol: "🦁" },
      { title: "Fourth in the Fire", scripture: "Daniel 3:25", effect: "When you would lose SP or offerings, roll a die. On 4-6, you lose nothing. Keep this card permanently.", symbol: "🔥" },
      { title: "Gabriel's Revelation", scripture: "Daniel 8:16", effect: "Look at any other player's SP total, livestock, coins, and helpers. Gain 2 SP from divine insight.", symbol: "📜" },
      { title: "Michael's Protection", scripture: "Daniel 10:13", effect: "Choose another player. They cannot affect you negatively for 3 turns. The prince of Israel defends his people.", symbol: "👑" },
      { title: "Prison Breaker", scripture: "Acts 12:7", effect: "If you land on a space that would cause you to lose a turn or miss moves, ignore the effect. Discard after use.", symbol: "🔗" },
      { title: "Philip's Guide", scripture: "Acts 8:26", effect: "On your next turn, move to any location instead of rolling. Divine guidance leads to great opportunities.", symbol: "🌟" },
      { title: "Birth Announcement", scripture: "Luke 2:13", effect: "All players gain 2 SP. The greatest news brings joy to all people.", symbol: "✨" }
    ];
  }

  static getDemonCards() {
    return [
      { title: "Ancient Serpent", scripture: "Genesis 3:1", effect: "You surely do not need those offerings. Lose half your livestock and half your coins (rounded down). The first lie still deceives.", symbol: "🐍" },
      { title: "Spirit of Murder", scripture: "Genesis 4:7", effect: "Choose another player. They lose 3 SP and you steal 1 SP from them. Sin desires to master and destroy.", symbol: "🗡️" },
      { title: "Evil Spirit of Saul", scripture: "1 Samuel 16:14", effect: "For your next 3 turns, roll a die before answering questions. On 1-3, you cannot use Helper hints or earn Helper points.", symbol: "👑" },
      { title: "Satan's Test of Job", scripture: "Job 1:19", effect: "Lose 2 livestock, 2 coins, and 1 Helper of your choice. Sometimes the righteous suffer to prove their faith.", symbol: "🌪️" },
      { title: "Temptation of Appetite", scripture: "Matthew 4:3", effect: "Turn these stones to bread. Pay 4 SP immediately or lose your next turn. Physical needs distract from spiritual purpose.", symbol: "🍞" },
      { title: "Temptation of Pride", scripture: "Matthew 4:6", effect: "Cast yourself down! Choose: either lose 4 SP or take double damage from your next wolf/bandit encounter.", symbol: "🏔️" },
      { title: "Temptation of Power", scripture: "Matthew 4:9", effect: "All these kingdoms will I give you. Gain 8 SP, but lose all your Helpers. Worldly success costs spiritual relationships.", symbol: "👑" },
      { title: "Legion of Torment", scripture: "Mark 5:9", effect: "My name is Legion, for we are many. Roll two dice and lose that many SP. Spiritual oppression multiplies suffering.", symbol: "👥" },
      { title: "Mute Spirit", scripture: "Matthew 9:32", effect: "You cannot use any Helper hints for your next 3 turns. The spirit of silence prevents testimony and wisdom.", symbol: "🤐" },
      { title: "Blinding Spirit", scripture: "Matthew 12:22", effect: "For your next 2 questions, you cannot see what location you're on when answering. Spiritual blindness hides truth.", symbol: "👁️" },
      { title: "False Prophet Spirit", scripture: "Acts 16:16", effect: "Gain insight into coming doom. All other players lose 2 SP. False prophecy brings confusion and fear.", symbol: "🔮" },
      { title: "Convulsing Spirit", scripture: "Mark 9:18", effect: "Skip your next turn and lose 2 livestock. This kind requires prayer and fasting to overcome.", symbol: "⚡" },
      { title: "Spirit of Eighteen Years", scripture: "Luke 13:16", effect: "For the next 3 turns, you can only earn half SP from correct answers (rounded down). Satan's bonds limit progress.", symbol: "⛓️" },
      { title: "Unclean Spirit", scripture: "Mark 1:23", effect: "Let us alone! You cannot gain Helper points with any character for your next 2 turns. Demons resist holy fellowship.", symbol: "🌊" },
      { title: "Spirit of Greed", scripture: "Acts 19:24", effect: "All players must pay you 1 coin or lose 3 SP. Your choice which they do. False profits exploit God's people.", symbol: "💰" },
      { title: "Deceiving Spirit", scripture: "Acts 19:13", effect: "Jesus I know, Paul I know, but who are you? Lose all points with one Helper of your choice. False authority brings shame.", symbol: "🎭" },
      { title: "Messenger of Satan", scripture: "2 Corinthians 12:7", effect: "Keep this card. At the start of each turn, lose 1 SP, but gain +1 to trivia rolls. Weakness can teach dependence on grace.", symbol: "🌵" },
      { title: "The Great Dragon", scripture: "Revelation 12:9", effect: "All players lose their most valuable resource (count SP value: livestock + coins). The deceiver wages war against all saints.", symbol: "🐉" },
      { title: "Beast of Persecution", scripture: "Revelation 13:7", effect: "Choose a player. They cannot earn SP for 2 turns and you steal 1 of their Helpers. Power wars against the saints.", symbol: "👹" },
      { title: "Lake of Fire", scripture: "Revelation 20:10", effect: "All players must sacrifice 5 SP or lose all their livestock. The final judgment demands everything.", symbol: "🔥" }
    ];
  }

  static getMedievalBlessingCards() {
    return [
      {
        title: "Divine Right of Kings",
        scripture: "Medieval Blessing",
        effect: "Gain 4 gold immediately and become immune to Brigand attacks for 3 turns. Royal authority protects the faithful.",
        symbol: "👑"
      },
      {
        title: "Knight's Oath",
        scripture: "Code of Chivalry",
        effect: "Gain 3 gold and choose any character to gain 2 points with. Honor and valor open all doors.",
        symbol: "⚔️"
      },
      {
        title: "Pilgrim's Grace",
        scripture: "Canterbury Tales",
        effect: "Move immediately to any monastery location on the board. Divine guidance leads the faithful to wisdom.",
        symbol: "🛤️"
      },
      {
        title: "Scholar's Wisdom",
        scripture: "Oxford Manuscript",
        effect: "For your next 3 turns, gain +1 gold for every correct answer (4 total instead of 3). Knowledge is power.",
        symbol: "📚"
      },
      {
        title: "Merchant's Fortune",
        scripture: "Guild Charter",
        effect: "Gain 2 gold and recover all lost provisions. Prosperity follows the industrious.",
        symbol: "💰"
      },
      {
        title: "Abbot's Blessing",
        scripture: "Monastic Rule",
        effect: "Immunity to all Dark Sorcery effects for the next 4 turns. Sacred protection shields the devout.",
        symbol: "✝️"
      },
      {
        title: "Royal Pardon",
        scripture: "Royal Decree",
        effect: "When you would lose gold from any source, this card prevents all loss. Discard after use.",
        symbol: "📜"
      },
      {
        title: "Round Table Fellowship",
        scripture: "Arthurian Legend",
        effect: "All players gain 2 gold. The greatest virtue brings benefit to all.",
        symbol: "⭕"
      },
      {
        title: "Merlin's Magic",
        scripture: "Ancient Prophecy",
        effect: "Look at any other player's gold total, provisions, and helpers. Gain 2 gold from mystical insight.",
        symbol: "🔮"
      },
      {
        title: "Holy Grail Vision",
        scripture: "Quest Legend",
        effect: "Gain 5 gold. The ultimate quest brings the greatest reward.",
        symbol: "🏆"
      }
    ];
  }

  static getMedievalCurseCards() {
    return [
      {
        title: "Black Death",
        scripture: "Plague Chronicle",
        effect: "All players lose half their provisions (rounded down). The great pestilence spares none.",
        symbol: "💀"
      },
      {
        title: "Norman Invasion",
        scripture: "Saxon Chronicle",
        effect: "Lose 3 gold and 2 provisions. Foreign conquest brings suffering to the land.",
        symbol: "⚔️"
      },
      {
        title: "Excommunication",
        scripture: "Papal Bull",
        effect: "For your next 3 turns, you cannot use Helper hints or earn Helper points. Spiritual exile cuts deep.",
        symbol: "⛪"
      },
      {
        title: "Dragon's Wrath",
        scripture: "Beowulf Legend",
        effect: "Roll two dice and lose that much gold. Ancient evil brings great destruction.",
        symbol: "🐉"
      },
      {
        title: "Famine and Want",
        scripture: "Manor Records",
        effect: "Pay 4 gold immediately or lose your next turn. Starvation weakens even the strong.",
        symbol: "🌾"
      },
      {
        title: "Civil War",
        scripture: "War of the Roses",
        effect: "Choose: either lose 4 gold or take double damage from your next Wolf Pack encounter.",
        symbol: "🌹"
      },
      {
        title: "Corrupt Sheriff",
        scripture: "Robin Hood Ballad",
        effect: "All players must pay you 1 provision or lose 3 gold. Tyranny exploits the innocent.",
        symbol: "🏛️"
      },
      {
        title: "Viking Raid",
        scripture: "Norse Saga",
        effect: "All other players lose 2 gold. The northern reavers take what they will.",
        symbol: "🛡️"
      },
      {
        title: "Witch's Curse",
        scripture: "Folk Tale",
        effect: "For the next 3 turns, you can only earn half gold from correct answers (rounded down). Dark magic hinders progress.",
        symbol: "🌙"
      },
      {
        title: "Peasant Revolt",
        scripture: "Wat Tyler's Rebellion",
        effect: "Choose a player. They cannot earn gold for 2 turns and you steal 1 of their Helpers. Revolution upends order.",
        symbol: "⚒️"
      }
    ];
  }

  static async validateConfig(config) {
    const requiredFields = ['name', 'title', 'boardPositions', 'triviaDatabase'];
    const missingFields = requiredFields.filter(field => !config[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required config fields: ${missingFields.join(', ')}`);
    }

    if (!Array.isArray(config.boardPositions) || config.boardPositions.length === 0) {
      throw new Error('Board positions must be a non-empty array');
    }

    if (typeof config.triviaDatabase !== 'object') {
      throw new Error('Trivia database must be an object');
    }

    return true;
  }

  static async saveCustomConfig(config, filename) {
    try {
      await this.validateConfig(config);
      
      // In React Native, you would save to device storage
      console.log(`Saving custom config to ${filename}:`, config);
      return true;
    } catch (error) {
      console.error('Failed to save custom config:', error);
      throw error;
    }
  }

  static async loadCustomConfig(filename) {
    try {
      // In React Native, you would load from device storage
      console.log(`Loading custom config from ${filename}`);
      return null; // Placeholder
    } catch (error) {
      console.error('Failed to load custom config:', error);
      throw error;
    }
  }

  static getAvailableThemes() {
    return [
      {
        name: 'biblical',
        title: 'Biblical Journey',
        description: 'Journey through biblical locations and characters',
        preview: '⛪'
      },
      {
        name: 'medieval',
        title: 'Medieval Quest',
        description: 'Journey through medieval lands and legends',
        preview: '🏰'
      }
    ];
  }
}

export default { DataLoader };