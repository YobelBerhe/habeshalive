/**
 * HabeshaLive Color Theme System
 * Inspired by Ethiopian/Eritrean cultural colors
 */

export const habeshaTheme = {
  // Primary Colors - Ethiopian Gold
  primary: {
    DEFAULT: '#D4AF37',      // Ethiopian gold (main brand color)
    light: '#F4D03F',        // Lighter gold for hover states
    dark: '#B8860B',         // Dark gold for shadows/depth
    glow: '#FFD700',         // Bright gold for glowing effects
  },

  // Ethiopian Flag Colors
  flag: {
    green: '#078930',        // Ethiopian green
    yellow: '#FCDD09',       // Ethiopian yellow
    red: '#DA121A',          // Ethiopian red
  },

  // Background Colors - Coffee-inspired
  background: {
    darkest: '#0f0705',      // Deep espresso
    dark: '#1a0f0a',         // Dark roasted coffee
    medium: '#2d1810',       // Medium roast
    light: '#3d2318',        // Light coffee
    overlay: 'rgba(29, 24, 16, 0.8)',  // Glass overlay
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',      // Pure white
    secondary: '#E8D5B5',    // Cream/coffee color
    muted: '#A89270',        // Muted gold
    disabled: '#6B5D4F',     // Disabled state
  },

  // Semantic Colors
  semantic: {
    success: '#078930',      // Ethiopian green
    warning: '#FCDD09',      // Ethiopian yellow
    error: '#DA121A',        // Ethiopian red
    info: '#4A9EFF',         // Bright blue
  },

  // Status Colors
  status: {
    online: '#078930',       // Green for online
    offline: '#6B5D4F',      // Gray for offline
    busy: '#DA121A',         // Red for busy
    away: '#FCDD09',         // Yellow for away
  },

  // Gradients
  gradients: {
    hero: 'linear-gradient(135deg, #1a0f0a 0%, #2d1810 50%, #1a0f0a 100%)',
    gold: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
    goldReverse: 'linear-gradient(135deg, #F4D03F 0%, #D4AF37 100%)',
    card: 'linear-gradient(180deg, rgba(29, 24, 16, 0.8) 0%, rgba(45, 24, 16, 0.4) 100%)',
    overlay: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)',
    glow: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0) 70%)',
  },

  // Shadows
  shadows: {
    sm: '0 2px 4px rgba(212, 175, 55, 0.1)',
    md: '0 4px 8px rgba(212, 175, 55, 0.2)',
    lg: '0 8px 16px rgba(212, 175, 55, 0.3)',
    xl: '0 16px 32px rgba(212, 175, 55, 0.4)',
    glow: '0 0 20px rgba(212, 175, 55, 0.5)',
  },

  // Border Colors
  border: {
    subtle: 'rgba(212, 175, 55, 0.1)',
    light: 'rgba(212, 175, 55, 0.2)',
    medium: 'rgba(212, 175, 55, 0.3)',
    strong: 'rgba(212, 175, 55, 0.5)',
    solid: '#D4AF37',
  },

  // Glass/Blur Effects
  glass: {
    light: 'rgba(45, 24, 16, 0.3)',
    medium: 'rgba(45, 24, 16, 0.6)',
    dark: 'rgba(26, 15, 10, 0.8)',
  },
};

// Tailwind CSS Configuration Helper
export const tailwindColors = {
  'habesha-gold': {
    DEFAULT: '#D4AF37',
    light: '#F4D03F',
    dark: '#B8860B',
    glow: '#FFD700',
  },
  'habesha-green': '#078930',
  'habesha-yellow': '#FCDD09',
  'habesha-red': '#DA121A',
  'coffee': {
    darkest: '#0f0705',
    dark: '#1a0f0a',
    medium: '#2d1810',
    light: '#3d2318',
  },
  'cream': {
    DEFAULT: '#E8D5B5',
    dark: '#A89270',
  },
};

// CSS Variables for runtime theming
export const cssVariables = `
  :root {
    /* Primary Colors */
    --color-primary: 212, 175, 55;
    --color-primary-light: 244, 208, 63;
    --color-primary-dark: 184, 134, 11;
    
    /* Background */
    --color-bg-darkest: 15, 7, 5;
    --color-bg-dark: 26, 15, 10;
    --color-bg-medium: 45, 24, 16;
    --color-bg-light: 61, 35, 24;
    
    /* Text */
    --color-text-primary: 255, 255, 255;
    --color-text-secondary: 232, 213, 181;
    --color-text-muted: 168, 146, 112;
    
    /* Flag Colors */
    --color-flag-green: 7, 137, 48;
    --color-flag-yellow: 252, 221, 9;
    --color-flag-red: 218, 18, 26;
  }
`;

// Utility function to apply theme
export const applyTheme = () => {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = cssVariables;
    document.head.appendChild(style);
  }
};

export default habeshaTheme;
