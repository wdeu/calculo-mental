import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const flags = [
    { code: 'de', flag: '🇩🇪', title: 'Deutsch' },
    { code: 'pt', flag: '🇵🇹', title: 'Português' },
  ];

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {flags.map(({ code, flag, title }) => {
        const isActive = i18n.language === code;
        return (
          <button
            key={code}
            onClick={() => changeLanguage(code)}
            title={title}
            style={{
              fontSize: '1.75rem',
              lineHeight: 1,
              padding: '2px 4px',
              borderRadius: '8px',
              border: isActive ? '2px solid #8b5cf6' : '2px solid transparent',
              boxShadow: isActive ? 'inset 0 2px 4px rgba(0,0,0,0.3)' : 'none',
              transform: isActive ? 'translateY(1px)' : 'none',
              opacity: isActive ? 1 : 0.6,
              background: isActive ? 'rgba(139,92,246,0.08)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.opacity = '0.6';
            }}
          >
            {flag}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
