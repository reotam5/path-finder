import { useContext } from 'react';
import type { I18nContextType } from './context';
import { I18nContext } from './context';

// Custom hook to use translations
export const useTranslations = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within an I18nProvider');
  }
  return context;
};