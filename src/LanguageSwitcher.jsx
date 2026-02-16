import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage('de')}
        className={`text-3xl transition-all hover:scale-110 ${
          i18n.language === 'de' 
            ? 'scale-110 drop-shadow-lg' 
            : 'opacity-50 hover:opacity-100'
        }`}
        title="Deutsch"
      >
        🇩🇪
      </button>
      <button
        onClick={() => changeLanguage('pt')}
        className={`text-3xl transition-all hover:scale-110 ${
          i18n.language === 'pt' 
            ? 'scale-110 drop-shadow-lg' 
            : 'opacity-50 hover:opacity-100'
        }`}
        title="Português"
      >
        🇵🇹
      </button>
    </div>
  );
};

export default LanguageSwitcher;
