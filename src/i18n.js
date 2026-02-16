import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import translationDE from './locales/de/translation.json';
import translationPT from './locales/pt/translation.json';

// the translations
const savedLanguage = localStorage.getItem('language') || 'de';

const resources = {
  de: {
    translation: translationDE
  },
  pt: {
    translation: translationPT
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'de', // fallback language
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
