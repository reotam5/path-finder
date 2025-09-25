import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import type { I18nContextType } from './context';
import { I18nContext } from './context';
import type { Language } from './translations';
import { defaultLanguage, translations } from './translations';

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage, fallback to browser language, then default
    const savedLanguage = localStorage.getItem('pathfinder-language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      return savedLanguage;
    }

    // Try to detect browser language
    const browserLanguage = navigator.language.split('-')[0] as Language;
    if (translations[browserLanguage]) {
      return browserLanguage;
    }

    return defaultLanguage;
  });

  // Save language to localStorage when it changes and update document title
  useEffect(() => {
    localStorage.setItem('pathfinder-language', language);
    document.title = translations[language].app.title;
  }, [language]);

  const contextValue: I18nContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

