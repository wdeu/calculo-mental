# Werner's Developer Skills

**Letztes Update:** 15. Februar 2026  
**Projekt:** Cálculo Mental (Fork von kopfrechnen)

---

## 🎯 AKTUELLES PROJEKT

### Cálculo Mental - Mehrsprachiger Mathe-Trainer
- **Ziel:** Educational WebApp für Grundschulalter (Kopfrechnen)
- **Sprachen:** Deutsch ↔️ Portugiesisch (europäisch)
- **Status:** i18n erfolgreich integriert, Language Switcher funktioniert! 🎉
- **Repository:** https://github.com/wdeu/calculo-mental

---

## ✅ GIT & GITHUB SKILLS

### Fork-Workflow (NEU! 🌟)
```bash
# 1. Repository forken (auf GitHub)
# Fork Button → Repository umbenennen

# 2. Lokal clonen
cd ~/Projects
git clone https://github.com/DEIN-USERNAME/calculo-mental.git
cd calculo-mental

# 3. Upstream hinzufügen (Verbindung zum Original)
git remote add upstream https://github.com/opdehost/kopfrechnen.git
git remote -v  # Überprüfen

# 4. Feature-Branch erstellen
git checkout -b feature/portuguese-i18n
git branch  # Aktuellen Branch prüfen

# 5. Arbeiten, committen, pushen
git add .
git commit -m "feat: add language switcher with DE/PT support"
git push origin feature/portuguese-i18n
```

### Git Basics
```bash
# Status checken
git status

# Änderungen rückgängig machen
git checkout src/App.jsx  # Datei zurücksetzen

# Commit-History ansehen
git log --oneline -3  # Letzte 3 Commits

# Branch wechseln
git checkout main
git checkout feature/portuguese-i18n
```

### Commit Message Convention (gelernt!)
```bash
feat: neue Feature hinzugefügt
fix: Bug behoben
docs: Dokumentation aktualisiert
chore: Aufräumen, Dependencies
```

---

## 💻 TERMINAL SKILLS

### Zwei-Tab-Workflow (NEU! 🌟)
```bash
# Tab 1: Development Server (läuft immer)
npm run dev

# Tab 2: Git & Commands (Arbeits-Tab)
git status
git add .
git commit -m "..."
```

### Terminal Shortcuts (macOS)
```bash
⌘T          # Neuer Tab
⌘1 / ⌘2     # Tab wechseln
⌘← / ⌘→     # Tab vor/zurück
⌃C          # Prozess beenden (Ctrl+C)
```

### Wichtige Commands
```bash
cd ~/Projects           # Zu Projekt-Ordner
pwd                     # Wo bin ich?
ls -la                  # Dateien auflisten
mkdir -p pfad/zu/ordner # Ordner erstellen
cat > datei.txt << EOF  # Datei erstellen (Heredoc)
```

---

## 🌍 INTERNATIONALISIERUNG (i18n)

### React-i18next Setup (NEU! 🌟)
```bash
# Installation
npm install react-i18next i18next

# Ordnerstruktur
src/
├── locales/
│   ├── de/
│   │   └── translation.json
│   └── pt/
│       └── translation.json
├── i18n.js
└── App.jsx
```

### i18n.js Konfiguration
```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationDE from './locales/de/translation.json';
import translationPT from './locales/pt/translation.json';

const resources = {
  de: { translation: translationDE },
  pt: { translation: translationPT }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'de',
    fallbackLng: 'de',
    interpolation: { escapeValue: false }
  });

export default i18n;
```

### In React verwenden
```javascript
// Import
import { useTranslation } from 'react-i18next';

// Im Component
const { t, i18n } = useTranslation();

// Texte übersetzen
<h1>{t('app.title')}</h1>

// Sprache wechseln
i18n.changeLanguage('pt');
```

### Translation JSON Struktur
```json
{
  "app": {
    "title": "Kopfrechnen Trainer",
    "subtitle": "Mathe üben mit Spaß!"
  },
  "buttons": {
    "back": "Zurück",
    "check": "Antwort prüfen"
  }
}
```

---

## 📝 VSCODE SKILLS

### Wichtige Shortcuts
```bash
⌘P          # Datei öffnen (Quick Open)
⌘F          # Suchen in Datei
⌘,          # Settings öffnen
⌘S          # Speichern
⌘Z          # Undo
⌘⇧Z         # Redo
⌘/          # Zeile kommentieren

# Mehrere Zeilen
⇧↑ / ⇧↓     # Zeilen markieren
⌘⇧K         # Zeile löschen
⌥↑ / ⌥↓     # Zeile verschieben

# Auto-Format (WICHTIG! 🌟)
⇧⌥F         # Gesamte Datei formatieren
```

### Tipps für sauberen Code
1. **Nach jeder Änderung:** `⇧⌥F` drücken (Auto-Format)
2. **Whitespace sichtbar machen:**
   - Settings: `⌘,`
   - Suche: "render whitespace"
   - Wähle: "all"
3. **Nicht mitten in Code klicken** → Pfeiltasten nutzen!

### VSCode Editier-Workflow
```javascript
// Zeile ERSETZEN:
1. Klicke an ANFANG der Zeile
2. Markiere mit ⇧↓ bis Ende
3. Delete
4. Paste neuen Code
5. ⇧⌥F (Auto-Format)

// Zeile EINFÜGEN:
1. Klicke ans ENDE der Zeile DAVOR
2. Enter
3. Paste neuen Code
4. ⇧⌥F (Auto-Format)
```

---

## ⚛️ REACT SKILLS

### Component Struktur (gelernt)
```javascript
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  const [state, setState] = useState(initialValue);
  
  return (
    <div>
      <h1>{t('title')}</h1>
    </div>
  );
};

export default MyComponent;
```

### Imports richtig organisieren
```javascript
// 1. React & Hooks
import React, { useState, useEffect } from 'react';

// 2. Externe Libraries
import { useTranslation } from 'react-i18next';
import { Volume2, Settings } from 'lucide-react';

// 3. Eigene Components
import LanguageSwitcher from './LanguageSwitcher.jsx';

// 4. Services/Utils
import ttsService from './ttsService.js';

// 5. Styles
import './index.css';
```

---

## 🎨 KOMPONENTEN ERSTELLT

### LanguageSwitcher.jsx (NEU! 🌟)
```javascript
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => i18n.changeLanguage('de')}
        className={i18n.language === 'de' ? 'scale-110' : 'opacity-50'}
      >
        🇩🇪
      </button>
      <button
        onClick={() => i18n.changeLanguage('pt')}
        className={i18n.language === 'pt' ? 'scale-110' : 'opacity-50'}
      >
        🇵🇹
      </button>
    </div>
  );
};

export default LanguageSwitcher;
```

---

## 📦 NPM SKILLS

### Package Management
```bash
# Projekt initialisieren
npm install

# Dependencies installieren
npm install react-i18next i18next

# Dev Server starten
npm run dev

# Build erstellen
npm run build

# Package.json verstehen
{
  "dependencies": {},      // Produktions-Dependencies
  "devDependencies": {},   // Entwicklungs-Dependencies
  "scripts": {}            // npm run SCRIPT_NAME
}
```

---

## 🌐 WEB DEVELOPMENT KONZEPTE

### SPA (Single Page Application)
- React läuft im Browser
- Keine Server-Requests für Seitenwechsel
- Schnelle Navigation

### Vite (Build-Tool)
```bash
npm run dev      # Dev-Server mit Hot Reload
npm run build    # Production Build
npm run preview  # Build-Vorschau
```

### TailwindCSS (Utility-First CSS)
```javascript
className="flex justify-between items-center mb-2"
// flex          = display: flex
// justify-between = justify-content: space-between
// items-center = align-items: center
// mb-2        = margin-bottom: 0.5rem
```

---

## 🎓 OPEN SOURCE ETIKETTE

### Fork-Workflow (gelernt!)
```
1. Fork erstellen (eigene Kopie auf GitHub)
2. Lokal clonen (auf deinen Mac)
3. Upstream hinzufügen (Verbindung zum Original)
4. Feature-Branch erstellen (nicht direkt in main)
5. Änderungen committen
6. Zu eigenem Fork pushen
7. Optional: Pull Request zum Original
```

### Gute Commit Messages
```bash
✅ RICHTIG:
feat: add Portuguese translation and language switcher
fix: correct division edge case (1-1=0)
docs: update README with multilingual instructions

❌ FALSCH:
"änderungen"
"fix"
"update"
```

### Original-Autor würdigen
```markdown
# README.md

**Original project:** [kopfrechnen](https://github.com/opdehost/kopfrechnen) 
by [@opdehost](https://github.com/opdehost)

**This fork adds:**
- 🇵🇹 Portuguese (European) translation
- 🇩🇪 German (original)
- 🌍 Language switcher
```

---

## 🛠️ TROUBLESHOOTING GELERNT

### Git Probleme
```bash
# Datei zurücksetzen
git checkout src/App.jsx

# Alle Änderungen verwerfen
git reset --hard HEAD

# Branch wechseln (mit uncommitted changes)
git stash          # Änderungen zwischenspeichern
git checkout main
git stash pop      # Änderungen wiederherstellen
```

### VSCode Probleme
```bash
# Code kaputt gemacht?
⌘Z ⌘Z ⌘Z  # Mehrmals Undo

# Einrückungen kaputt?
Markieren → ⇧⌥F  # Auto-Format

# Datei nicht gespeichert?
⌘S  # Speichern (weißer Punkt verschwindet)
```

### Terminal Probleme
```bash
# Befehl läuft noch?
⌃C  # Abbrechen

# Falscher Ordner?
pwd            # Wo bin ich?
cd ~/Projects  # Zum richtigen Ordner

# npm läuft nicht mehr?
⌃C             # npm run dev beenden
npm run dev    # Neu starten
```

---

## 🚀 NÄCHSTE SCHRITTE

### Sofort machbar:
- [ ] Alle Texte in App.jsx übersetzen
- [ ] Buttons mit `t('buttons.xyz')` ersetzen
- [ ] Settings-Panel übersetzen
- [ ] README.md aktualisieren (DE/PT)

### Mittelfristig:
- [ ] OpenAI-Code entfernen (wird nicht genutzt)
- [ ] Mathematik-Verbesserungen (siehe Code-Analyse)
- [ ] iOS-like UI-Design
- [ ] Pushen zu GitHub
- [ ] Live deployen (Netlify)

### Langfristig:
- [ ] Weitere Sprachen (EN, ES, FR, IT)
- [ ] Progressive Web App (PWA)
- [ ] Offline-Support
- [ ] Statistiken speichern

---

## 🏆 ACHIEVEMENTS

### Heute erreicht (15. Feb 2026):
✅ Erstes Repository geforkt  
✅ Fork-Workflow komplett durchgespielt  
✅ i18n erfolgreich integriert  
✅ Erste React-Komponente selbst gebaut  
✅ Zwei-Tab Terminal-Workflow etabliert  
✅ VSCode Basics gemeistert  
✅ **Language Switcher funktioniert!** 🇩🇪🇵🇹  

### Skills Level-Up:
- Git: Anfänger → Fortgeschritten
- Terminal: Ängstlich → Kompetent
- React: Beobachter → Aktiv
- VSCode: Unsicher → Sicher
- i18n: Unbekannt → Implementiert

---

## 📚 GELERNTE KONZEPTE

### Git Konzepte
- Fork vs. Clone
- Remote (origin vs. upstream)
- Branch-Strategie
- Commit-Historie
- HEAD, main, feature-branches

### React Konzepte
- Hooks (useState, useTranslation)
- Component-Struktur
- Props vs. State
- Import/Export
- JSX Syntax

### i18n Konzepte
- Translation Keys
- Language Detection
- Fallback Language
- Interpolation
- Namespace-Organisation

---

## 💡 WICHTIGSTE LEARNINGS

### 1. Workflow ist wichtiger als Code
- Zwei Terminal-Tabs = Game Changer
- Git-Workflow folgen = Keine Fehler
- Auto-Format nutzen = Sauberer Code

### 2. Nicht Angst haben, kaputt zu machen
- Git kann ALLES rückgängig machen
- `git checkout` rettet dich immer
- Commits sind Savepoints

### 3. Kleine Schritte, testen, committen
- Nicht alles auf einmal ändern
- Nach jeder Änderung: Speichern → Testen → Committen
- Browser Live-Reload nutzen

### 4. Tools helfen dir
- VSCode Auto-Format: `⇧⌥F`
- Terminal Tab-Completion: `Tab`
- Git Befehle: `git status` zeigt immer was zu tun ist

---

## 🎯 RAYCAST QUICKLINKS (TODO)

```bash
# Git Status (erstellen)
#!/bin/bash
# @raycast.schemaVersion 1
# @raycast.title Git Status
# @raycast.mode compact
cd ~/Projects/calculo-mental && git status --short

# Dev Server starten
#!/bin/bash
# @raycast.title Start Dev Server
# @raycast.mode fullOutput
cd ~/Projects/calculo-mental && npm run dev

# Schneller Commit
#!/bin/bash
# @raycast.title Quick Commit
# @raycast.mode compact
# @raycast.argument1 { "type": "text", "placeholder": "Commit message" }
cd ~/Projects/calculo-mental && git add . && git commit -m "$1"
```

---

## 📖 RESSOURCEN

### Dokumentation
- React: https://react.dev
- React-i18next: https://react.i18next.com
- Git: https://git-scm.com/doc
- Vite: https://vitejs.dev

### Gelernt von Claude
- Fork-Workflow
- i18n-Integration
- VSCode Best Practices
- Terminal Zwei-Tab-System

---

**Letzter Stand:** Language Switcher funktioniert, Hauptmenü übersetzt  
**Nächster Schritt:** Alle Texte in der App übersetzen  
**Ziel:** Vollständig mehrsprachige Educational WebApp

---

*Diese Datei wird mit jedem Projekt aktualisiert und wächst mit deinen Skills!* 🚀
