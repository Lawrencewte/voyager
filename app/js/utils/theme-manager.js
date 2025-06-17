// js/utils/theme-manager.js - Enhanced with attack modal styling and responsive design
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export class ThemeManager {
  static themes = {
    biblical: {
      name: 'biblical',
      colors: {
        primary: '#8B4513',
        secondary: '#FFD700',
        background: '#2E8B57',
        surface: 'rgba(255, 255, 255, 0.95)',
        text: '#333333',
        textLight: '#666666',
        textDark: '#000000',
        textInverse: '#FFFFFF',
        boardBackground: '#F5F5DC',
        boardBorder: '#8B4513',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#f44336',
        info: '#2196F3',
        // Location category colors
        creation: '#FFD93D',
        patriarchs: '#FF6B6B',
        exodus: '#4ECDC4',
        conquest: '#45B7D1',
        kingdom: '#96CEB4',
        prophets: '#DDA0DD',
        exile: '#FFEAA7',
        // NEW: Special space colors for attacks
        angelSpace: '#FFD700',
        demonSpace: '#8B0000',
        wolvesSpace: '#654321',
        banditsSpace: '#2F4F4F',
        // NEW: Attack modal colors
        wolvesAttackBg: '#654321',
        wolvesAttackBorder: '#8B4513',
        banditsAttackBg: '#2F4F4F',
        banditsAttackBorder: '#708090'
      },
      fonts: {
        regular: 'System',
        bold: 'System',
        title: 'Georgia',
        body: 'System'
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32
      },
      borderRadius: {
        sm: 4,
        md: 8,
        lg: 15,
        xl: 20
      },
      shadows: {
        small: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        medium: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        },
        large: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 30,
          elevation: 15,
        },
        // NEW: Attack modal shadows
        attackModal: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 20 },
          shadowOpacity: 0.5,
          shadowRadius: 30,
          elevation: 25,
        }
      }
    },
    medieval: {
      name: 'medieval',
      colors: {
        primary: '#8B0000',
        secondary: '#FFD700',
        background: '#2F4F4F',
        surface: 'rgba(255, 255, 255, 0.9)',
        text: '#FFFFFF',
        textLight: '#CCCCCC',
        textDark: '#000000',
        textInverse: '#000000',
        boardBackground: '#DCDCDC',
        boardBorder: '#8B0000',
        success: '#228B22',
        warning: '#FF8C00',
        error: '#DC143C',
        info: '#4682B4',
        // Medieval location colors
        castle: '#8B0000',
        village: '#228B22',
        forest: '#006400',
        mountain: '#696969',
        monastery: '#4B0082',
        market: '#DAA520',
        battlefield: '#800000',
        // NEW: Medieval attack colors
        angelSpace: '#FFD700',
        demonSpace: '#8B0000',
        wolvesSpace: '#2F4F2F',
        banditsSpace: '#8B0000',
        wolvesAttackBg: '#2F4F2F',
        wolvesAttackBorder: '#556B2F',
        banditsAttackBg: '#8B0000',
        banditsAttackBorder: '#DC143C'
      },
      fonts: {
        regular: 'System',
        bold: 'System',
        title: 'serif',
        body: 'System'
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32
      },
      borderRadius: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12
      },
      shadows: {
        small: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 5,
        },
        medium: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 5,
          elevation: 8,
        },
        large: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.4,
          shadowRadius: 20,
          elevation: 15,
        },
        attackModal: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 20 },
          shadowOpacity: 0.6,
          shadowRadius: 30,
          elevation: 25,
        }
      }
    }
  };

  static getCurrentTheme(themeName = 'biblical') {
    return this.themes[themeName] || this.themes.biblical;
  }

  static getStyles(themeName = 'biblical') {
    const theme = this.getCurrentTheme(themeName);
    
    // Responsive scaling factors
    const isLargeScreen = width > 1200;
    const isMediumScreen = width > 768 && width <= 1200;
    const isSmallScreen = width <= 768;
    
    const scaleFactor = isLargeScreen ? 1 : isMediumScreen ? 0.85 : 0.7;
    
    return StyleSheet.create({
      // Container styles with better responsive design
      gameContainer: {
        flex: 1,
        flexDirection: isSmallScreen ? 'column' : 'row',
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md * scaleFactor,
        gap: theme.spacing.md * scaleFactor,
      },
      
      leftPanel: {
        width: isSmallScreen ? '100%' : Math.max(280, width * 0.22),
        maxWidth: isSmallScreen ? '100%' : 350,
        height: isSmallScreen ? 'auto' : '100%',
        marginBottom: isSmallScreen ? theme.spacing.md : 0,
      },
      
      centerPanel: {
        flex: isSmallScreen ? 0 : 1,
        width: isSmallScreen ? '100%' : 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: isSmallScreen ? 0 : 500,
        marginBottom: isSmallScreen ? theme.spacing.md : 0,
      },
      
      rightPanel: {
        width: isSmallScreen ? '100%' : Math.max(320, width * 0.25),
        maxWidth: isSmallScreen ? '100%' : 400,
        height: isSmallScreen ? 'auto' : '100%',
      },
      
      // Panel styles with better spacing
      panel: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md * scaleFactor,
        ...theme.shadows.medium,
        maxHeight: isSmallScreen ? 500 : '95vh',
        overflow: 'hidden',
      },
      
      panelTitle: {
        fontSize: Math.max(16, 18 * scaleFactor),
        fontWeight: 'bold',
        color: theme.colors.primary,
        textAlign: 'center',
        marginBottom: theme.spacing.md * scaleFactor,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary,
        paddingBottom: theme.spacing.sm * scaleFactor,
        fontFamily: theme.fonts.title,
      },
      
      // Button styles with responsive sizing
      primaryButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.sm * scaleFactor,
        paddingHorizontal: theme.spacing.md * scaleFactor,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        ...theme.shadows.small,
        minHeight: 44 * scaleFactor,
      },
      
      primaryButtonText: {
        color: theme.colors.textInverse,
        fontSize: Math.max(12, 14 * scaleFactor),
        fontWeight: 'bold',
        fontFamily: theme.fonts.bold,
      },
      
      secondaryButton: {
        backgroundColor: theme.colors.secondary,
        paddingVertical: theme.spacing.sm * scaleFactor,
        paddingHorizontal: theme.spacing.md * scaleFactor,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        ...theme.shadows.small,
        minHeight: 44 * scaleFactor,
      },
      
      secondaryButtonText: {
        color: theme.colors.textDark,
        fontSize: Math.max(12, 14 * scaleFactor),
        fontWeight: 'bold',
        fontFamily: theme.fonts.bold,
      },
      
      successButton: {
        backgroundColor: theme.colors.success,
        paddingVertical: theme.spacing.sm * scaleFactor,
        paddingHorizontal: theme.spacing.md * scaleFactor,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        ...theme.shadows.small,
        minHeight: 44 * scaleFactor,
      },
      
      warningButton: {
        backgroundColor: theme.colors.warning,
        paddingVertical: theme.spacing.sm * scaleFactor,
        paddingHorizontal: theme.spacing.md * scaleFactor,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        ...theme.shadows.small,
        minHeight: 44 * scaleFactor,
      },
      
      errorButton: {
        backgroundColor: theme.colors.error,
        paddingVertical: theme.spacing.sm * scaleFactor,
        paddingHorizontal: theme.spacing.md * scaleFactor,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        ...theme.shadows.small,
        minHeight: 44 * scaleFactor,
      },
      
      infoButton: {
        backgroundColor: theme.colors.info,
        paddingVertical: theme.spacing.sm * scaleFactor,
        paddingHorizontal: theme.spacing.md * scaleFactor,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        ...theme.shadows.small,
        minHeight: 44 * scaleFactor,
      },
      
      disabledButton: {
        backgroundColor: '#cccccc',
        paddingVertical: theme.spacing.sm * scaleFactor,
        paddingHorizontal: theme.spacing.md * scaleFactor,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        minHeight: 44 * scaleFactor,
      },
      
      buttonText: {
        color: theme.colors.textInverse,
        fontSize: Math.max(12, 14 * scaleFactor),
        fontWeight: 'bold',
        fontFamily: theme.fonts.bold,
      },
      
      // Text styles with responsive sizing
      heading1: {
        fontSize: Math.max(20, 24 * scaleFactor),
        fontWeight: 'bold',
        color: theme.colors.primary,
        fontFamily: theme.fonts.title,
        marginBottom: theme.spacing.md * scaleFactor,
      },
      
      heading2: {
        fontSize: Math.max(18, 20 * scaleFactor),
        fontWeight: 'bold',
        color: theme.colors.primary,
        fontFamily: theme.fonts.title,
        marginBottom: theme.spacing.sm * scaleFactor,
      },
      
      heading3: {
        fontSize: Math.max(16, 18 * scaleFactor),
        fontWeight: 'bold',
        color: theme.colors.primary,
        fontFamily: theme.fonts.bold,
        marginBottom: theme.spacing.sm * scaleFactor,
      },
      
      bodyText: {
        fontSize: Math.max(12, 14 * scaleFactor),
        color: theme.colors.text,
        fontFamily: theme.fonts.body,
        lineHeight: Math.max(16, 20 * scaleFactor),
      },
      
      smallText: {
        fontSize: Math.max(10, 12 * scaleFactor),
        color: theme.colors.textLight,
        fontFamily: theme.fonts.regular,
      },
      
      boldText: {
        fontWeight: 'bold',
        fontFamily: theme.fonts.bold,
      },
      
      italicText: {
        fontStyle: 'italic',
      },
      
      // Input styles with responsive sizing
      textInput: {
        borderWidth: 2,
        borderColor: theme.colors.textLight,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.sm * scaleFactor,
        fontSize: Math.max(14, 16 * scaleFactor),
        backgroundColor: 'white',
        color: theme.colors.text,
        fontFamily: theme.fonts.regular,
        minHeight: 44 * scaleFactor,
      },
      
      focusedInput: {
        borderColor: theme.colors.primary,
      },
      
      // Card styles with responsive design
      card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md * scaleFactor,
        marginBottom: theme.spacing.md * scaleFactor,
        ...theme.shadows.medium,
      },
      
      cardHeader: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.textLight,
        paddingBottom: theme.spacing.sm * scaleFactor,
        marginBottom: theme.spacing.sm * scaleFactor,
      },
      
      // Modal styles with responsive sizing
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      
      modalContent: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg * scaleFactor,
        maxWidth: isSmallScreen ? '95%' : '90%',
        maxHeight: isSmallScreen ? '90%' : '80%',
        width: isSmallScreen ? '95%' : Math.min(600, width * 0.8),
        ...theme.shadows.large,
      },
      
      modalTitle: {
        fontSize: Math.max(18, 20 * scaleFactor),
        fontWeight: 'bold',
        color: theme.colors.primary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg * scaleFactor,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary,
        paddingBottom: theme.spacing.sm * scaleFactor,
        fontFamily: theme.fonts.title,
      },

      // NEW: Attack Modal Styles
      attackModalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      },

      attackModalContent: {
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xl * scaleFactor,
        alignItems: 'center',
        minWidth: Math.max(350, 350 * scaleFactor),
        maxWidth: Math.max(450, 450 * scaleFactor),
        ...theme.shadows.attackModal,
      },

      wolvesModalContent: {
        backgroundColor: theme.colors.wolvesAttackBg,
        borderColor: theme.colors.wolvesAttackBorder,
        borderWidth: 4,
      },

      banditsModalContent: {
        backgroundColor: theme.colors.banditsAttackBg,
        borderColor: theme.colors.banditsAttackBorder,
        borderWidth: 4,
      },

      attackEmoji: {
        fontSize: Math.max(48, 64 * scaleFactor),
        marginBottom: theme.spacing.lg * scaleFactor,
      },

      attackTitle: {
        fontSize: Math.max(22, 28 * scaleFactor),
        fontWeight: 'bold',
        color: theme.colors.textInverse,
        marginBottom: theme.spacing.md * scaleFactor,
        textAlign: 'center',
        fontFamily: theme.fonts.title,
      },

      attackDescription: {
        fontSize: Math.max(14, 16 * scaleFactor),
        color: theme.colors.textInverse,
        textAlign: 'center',
        marginBottom: theme.spacing.lg * scaleFactor,
        lineHeight: Math.max(20, 24 * scaleFactor),
        opacity: 0.9,
        fontFamily: theme.fonts.body,
      },

      attackButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderColor: theme.colors.textInverse,
        borderWidth: 2,
        paddingVertical: theme.spacing.md * scaleFactor,
        paddingHorizontal: theme.spacing.xl * scaleFactor,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.lg * scaleFactor,
        minHeight: 50 * scaleFactor,
      },

      attackButtonText: {
        color: theme.colors.textInverse,
        fontSize: Math.max(16, 18 * scaleFactor),
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: theme.fonts.bold,
      },

      diceRolling: {
        fontSize: Math.max(36, 48 * scaleFactor),
        color: theme.colors.textInverse,
        marginVertical: theme.spacing.lg * scaleFactor,
      },

      attackResults: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: theme.spacing.lg * scaleFactor,
        borderRadius: theme.borderRadius.md,
        marginVertical: theme.spacing.lg * scaleFactor,
        width: '100%',
      },

      rollResult: {
        fontSize: Math.max(20, 24 * scaleFactor),
        fontWeight: 'bold',
        color: theme.colors.textInverse,
        textAlign: 'center',
        marginBottom: theme.spacing.md * scaleFactor,
        fontFamily: theme.fonts.title,
      },

      damageText: {
        fontSize: Math.max(14, 16 * scaleFactor),
        color: theme.colors.textInverse,
        lineHeight: Math.max(20, 24 * scaleFactor),
        fontFamily: theme.fonts.body,
      },

      continueButton: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderColor: theme.colors.textInverse,
        borderWidth: 2,
        paddingVertical: theme.spacing.sm * scaleFactor,
        paddingHorizontal: theme.spacing.xl * scaleFactor,
        borderRadius: theme.borderRadius.md,
        marginTop: theme.spacing.md * scaleFactor,
        minHeight: 44 * scaleFactor,
      },

      // Layout utilities
      row: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      
      column: {
        flexDirection: 'column',
      },
      
      spaceBetween: {
        justifyContent: 'space-between',
      },
      
      spaceAround: {
        justifyContent: 'space-around',
      },
      
      center: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      
      // Responsive spacing utilities
      marginXS: { margin: theme.spacing.xs * scaleFactor },
      marginSM: { margin: theme.spacing.sm * scaleFactor },
      marginMD: { margin: theme.spacing.md * scaleFactor },
      marginLG: { margin: theme.spacing.lg * scaleFactor },
      marginXL: { margin: theme.spacing.xl * scaleFactor },
      
      paddingXS: { padding: theme.spacing.xs * scaleFactor },
      paddingSM: { padding: theme.spacing.sm * scaleFactor },
      paddingMD: { padding: theme.spacing.md * scaleFactor },
      paddingLG: { padding: theme.spacing.lg * scaleFactor },
      paddingXL: { padding: theme.spacing.xl * scaleFactor },

      // NEW: Special Space Styling Helpers
      wolvesSpaceStyle: {
        backgroundColor: theme.colors.wolvesSpace,
        borderColor: theme.colors.wolvesAttackBorder,
      },

      banditsSpaceStyle: {
        backgroundColor: theme.colors.banditsSpace,
        borderColor: theme.colors.banditsAttackBorder,
      },

      angelSpaceStyle: {
        backgroundColor: theme.colors.angelSpace,
        borderColor: theme.colors.secondary,
      },

      demonSpaceStyle: {
        backgroundColor: theme.colors.demonSpace,
        borderColor: theme.colors.error,
      },
    });
  }

  // NEW: Helper functions for attack styling
  static getAttackModalStyle(themeName, attackType) {
    const theme = this.getCurrentTheme(themeName);
    const styles = this.getStyles(themeName);
    
    if (attackType === 'wolves') {
      return [styles.attackModalContent, styles.wolvesModalContent];
    } else if (attackType === 'bandits') {
      return [styles.attackModalContent, styles.banditsModalContent];
    }
    
    return styles.attackModalContent;
  }

  static getSpecialSpaceColors(themeName, spaceType) {
    const theme = this.getCurrentTheme(themeName);
    
    switch (spaceType) {
      case 'wolves':
        return {
          background: theme.colors.wolvesSpace,
          border: theme.colors.wolvesAttackBorder,
          text: theme.colors.textInverse
        };
      case 'bandits':
        return {
          background: theme.colors.banditsSpace,
          border: theme.colors.banditsAttackBorder,
          text: theme.colors.textInverse
        };
      case 'angel':
      case 'positive':
        return {
          background: theme.colors.angelSpace,
          border: theme.colors.secondary,
          text: theme.colors.textDark
        };
      case 'demon':
      case 'negative':
        return {
          background: theme.colors.demonSpace,
          border: theme.colors.error,
          text: theme.colors.textInverse
        };
      default:
        return {
          background: theme.colors.surface,
          border: theme.colors.primary,
          text: theme.colors.text
        };
    }
  }

  static getLocationPeriodColors(themeName, locationName) {
    const theme = this.getCurrentTheme(themeName);
    
    const locationCategories = {
      'Your Village': theme.colors.creation,
      'Haran': theme.colors.patriarchs,
      'Shechem': theme.colors.patriarchs,
      'Bethel': theme.colors.patriarchs,
      'Hebron': theme.colors.patriarchs,
      'Egypt (Goshen)': theme.colors.patriarchs,
      'Mount Sinai': theme.colors.exodus,
      'Jordan River': theme.colors.conquest,
      'Jericho': theme.colors.conquest,
      'Gilgal': theme.colors.conquest,
      'Shiloh': theme.colors.conquest,
      'Ramah': theme.colors.kingdom,
      'Jerusalem': theme.colors.kingdom,
      'En-gedi': theme.colors.kingdom,
      'Mount Carmel': theme.colors.prophets,
      'Brook Cherith': theme.colors.prophets,
      'Damascus': theme.colors.prophets,
      'Nineveh': theme.colors.prophets,
      'Babylon': theme.colors.exile,
      'Shushan': theme.colors.exile,
      'Land of Uz': theme.colors.exile,
      'Fiery Furnace': theme.colors.prophets,
    };

    return locationCategories[locationName] || theme.colors.kingdom;
  }

  // NEW: Responsive design helpers
  static getResponsiveSize(baseSize, scaleFactor = null) {
    if (scaleFactor === null) {
      const isLargeScreen = width > 1200;
      const isMediumScreen = width > 768 && width <= 1200;
      scaleFactor = isLargeScreen ? 1 : isMediumScreen ? 0.85 : 0.7;
    }
    
    return Math.max(baseSize * 0.7, baseSize * scaleFactor);
  }

  static isSmallScreen() {
    return width <= 768;
  }

  static isMediumScreen() {
    return width > 768 && width <= 1200;
  }

  static isLargeScreen() {
    return width > 1200;
  }

  // NEW: Animation timing helpers
  static getAnimationDuration(durationType = 'normal') {
    const durations = {
      fast: 300,
      normal: 500,
      slow: 800,
      attack: 1000, // For attack dice rolls
      movement: 800, // For player movement
    };
    
    return durations[durationType] || durations.normal;
  }
}

export default { ThemeManager };