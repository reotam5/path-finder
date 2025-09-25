import { createContext } from 'react';
import type { Language, Translations } from './translations';

export interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);