// Example: Adding new translation keys to the system
// This file shows how to extend the translation system with new sections

import type { Translations } from './translations';

// Example of extending the Translations interface for new features
export interface ExtendedTranslations extends Translations {
  // Example: Adding help/tutorial section
  help: {
    title: string;
    startTutorial: string;
    skipTutorial: string;
    steps: {
      welcome: string;
      selectTool: string;
      drawWalls: string;
      chooseAlgorithm: string;
      runVisualization: string;
    };
  };

  // Example: Adding error messages
  errors: {
    noPathFound: string;
    algorithmFailed: string;
    invalidConfiguration: string;
  };

  // Example: Adding settings/preferences
  settings: {
    title: string;
    theme: string;
    animationSpeed: string;
    gridSize: string;
    accessibility: string;
  };
}

// Example English translations for the new sections
// NOTE: This is incomplete for demonstration purposes
export const extendedEnTranslations: Partial<ExtendedTranslations> = {
  // ... existing translations would be copied from the main translations file
  app: {
    title: 'Path Finding Visualizer',
    subtitle: 'Choose your tools and algorithm, then watch the pathfinding magic happen',
  },
  // ... (other existing sections would go here)

  // New sections
  help: {
    title: 'How to Use',
    startTutorial: 'Start Tutorial',
    skipTutorial: 'Skip Tutorial',
    steps: {
      welcome: 'Welcome to the Path Finding Visualizer!',
      selectTool: 'Select a tool from the drawing tools panel',
      drawWalls: 'Click and drag to draw walls on the grid',
      chooseAlgorithm: 'Choose your preferred pathfinding algorithm',
      runVisualization: 'Click "Find Path" to start the visualization',
    },
  },

  errors: {
    noPathFound: 'No path found between start and end points',
    algorithmFailed: 'Algorithm execution failed. Please try again.',
    invalidConfiguration: 'Invalid grid configuration detected',
  },

  settings: {
    title: 'Settings',
    theme: 'Theme',
    animationSpeed: 'Animation Speed',
    gridSize: 'Grid Size',
    accessibility: 'Accessibility Options',
  },
};

// Usage example in a React component:
/*
import { useTranslations } from '@/i18n';

const HelpModal = () => {
  const { t } = useTranslations() as { t: ExtendedTranslations };

  return (
    <div>
      <h2>{t.help.title}</h2>
      <p>{t.help.steps.welcome}</p>
      <button>{t.help.startTutorial}</button>
    </div>
  );
};
*/

// Note: To actually use extended translations, you would need to:
// 1. Replace the Translations interface in translations.ts
// 2. Update all language translation objects
// 3. Ensure type consistency across the application