// js/models/location.js
export class Location {
  constructor(data) {
    this.name = data.name || '';
    this.type = data.type || 'location'; // 'location', 'special', 'start'
    this.description = data.description || '';
    this.significance = data.significance || '';
    this.category = data.category || 'kingdom';
    this.characters = data.characters || {};
    this.position = data.position || 0;
  }

  static fromJSON(json) {
    return new Location(json);
  }

  toJSON() {
    return {
      name: this.name,
      type: this.type,
      description: this.description,
      significance: this.significance,
      category: this.category,
      characters: this.characters,
      position: this.position,
    };
  }

  hasCharacter(characterName) {
    return this.characters.hasOwnProperty(characterName);
  }

  getCharacters() {
    return Object.keys(this.characters);
  }

  getQuestions(characterName) {
    return this.characters[characterName] || [];
  }

  addCharacter(characterName, questions = []) {
    this.characters[characterName] = questions;
  }

  addQuestion(characterName, question) {
    if (!this.characters[characterName]) {
      this.characters[characterName] = [];
    }
    this.characters[characterName].push(question);
  }

  removeCharacter(characterName) {
    delete this.characters[characterName];
  }

  removeQuestion(characterName, questionIndex) {
    if (this.characters[characterName] && this.characters[characterName][questionIndex]) {
      this.characters[characterName].splice(questionIndex, 1);
      
      // Remove character if no questions remain
      if (this.characters[characterName].length === 0) {
        delete this.characters[characterName];
      }
    }
  }

  isSpecialSpace() {
    return this.type === 'special';
  }

  isStartSpace() {
    return this.type === 'start';
  }

  isLocationSpace() {
    return this.type === 'location';
  }

  getTotalQuestions() {
    return Object.values(this.characters).reduce((total, questions) => total + questions.length, 0);
  }

  getCharacterCount() {
    return Object.keys(this.characters).length;
  }

  searchQuestions(searchTerm) {
    const results = [];
    const lowerSearchTerm = searchTerm.toLowerCase();

    Object.keys(this.characters).forEach(characterName => {
      this.characters[characterName].forEach((question, index) => {
        if (question.q.toLowerCase().includes(lowerSearchTerm) || 
            question.a.toLowerCase().includes(lowerSearchTerm)) {
          results.push({
            character: characterName,
            questionIndex: index,
            question: question
          });
        }
      });
    });

    return results;
  }

  getLocationTypeStyle() {
    const typeStyles = {
      start: { backgroundColor: '#4CAF50', color: 'white' },
      location: { backgroundColor: 'white', color: '#333' },
      special: { backgroundColor: '#FF6B6B', color: 'white' }
    };

    return typeStyles[this.type] || typeStyles.location;
  }

  getCategoryColor() {
    const categoryColors = {
      creation: '#FFD93D',
      patriarchs: '#FF6B6B',
      exodus: '#4ECDC4',
      conquest: '#45B7D1',
      kingdom: '#96CEB4',
      prophets: '#DDA0DD',
      exile: '#FFEAA7',
      beginning: '#FFD93D',
      early: '#FF6B6B',
      middle: '#4ECDC4',
      end: '#45B7D1'
    };

    return categoryColors[this.category] || categoryColors.kingdom;
  }

  getSpecialSpaceType() {
    if (!this.isSpecialSpace()) return null;

    if (this.name.includes('WOLVES')) return 'wolves';
    if (this.name.includes('BANDITS')) return 'bandits';
    if (this.name.includes('ANGEL')) return 'angel';
    if (this.name.includes('DEMON')) return 'demon';
    
    return 'generic';
  }

  clone() {
    return new Location(this.toJSON());
  }

  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push('Location name is required');
    }

    if (!['start', 'location', 'special'].includes(this.type)) {
      errors.push('Invalid location type');
    }

    if (!this.description || this.description.trim().length === 0) {
      errors.push('Location description is required');
    }

    // Validate characters and questions
    Object.keys(this.characters).forEach(characterName => {
      if (!characterName || characterName.trim().length === 0) {
        errors.push('Character names cannot be empty');
      }

      const questions = this.characters[characterName];
      if (!Array.isArray(questions)) {
        errors.push(`Questions for ${characterName} must be an array`);
      } else {
        questions.forEach((question, index) => {
          if (!question.q || question.q.trim().length === 0) {
            errors.push(`Question ${index + 1} for ${characterName} is missing question text`);
          }
          if (!question.a || question.a.trim().length === 0) {
            errors.push(`Question ${index + 1} for ${characterName} is missing answer text`);
          }
        });
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
      throw new Error('Invalid location export data');
    }

    const { exportedAt, version, ...locationData } = exportedData;
    return new Location(locationData);
  }
}
// At the end of your location.js file, add:
export default Location; // or whatever your main class/object is