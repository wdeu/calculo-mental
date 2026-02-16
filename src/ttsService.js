// Web Speech API TTS Service for Cálculo Mental
// Pure browser-based text-to-speech (no external dependencies)

class TTSService {
  constructor() {
    this.isAvailable = 'speechSynthesis' in window;
    this.currentLanguage = 'de-DE';
    
    if (!this.isAvailable) {
      console.warn('⚠️  Web Speech API not available in this browser');
    }
  }

  // Set language for TTS (de-DE or pt-PT)
  setLanguage(lang) {
    const languageMap = {
      'de': 'de-DE',
      'pt': 'pt-PT'
    };
    this.currentLanguage = languageMap[lang] || 'de-DE';
  }

  // Get best available voice for current language
  getBestVoice() {
    if (!this.isAvailable) return null;
    
    const voices = window.speechSynthesis.getVoices();
    const langVoices = voices.filter(voice => 
      voice.lang.startsWith(this.currentLanguage.split('-')[0])
    );

    // Prefer Google voices, then Microsoft, then any native voice
    return langVoices.find(v => v.name.includes('Google')) ||
           langVoices.find(v => v.name.includes('Microsoft')) ||
           langVoices.find(v => v.lang === this.currentLanguage) ||
           langVoices[0];
  }

  // Main speak method - returns Promise that resolves when speech ends
  speak(text, isCorrect = null) {
    return new Promise((resolve) => {
      if (!this.isAvailable) {
        console.warn('⚠️  Speech synthesis not available');
        resolve();
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.currentLanguage;
      utterance.rate = 0.9; // Slightly slower for clarity

      // Add emotion through pitch for feedback
      if (isCorrect !== null) {
        utterance.pitch = isCorrect ? 1.2 : 0.9; // Higher pitch for correct, lower for incorrect
      }

      // Set best available voice
      const bestVoice = this.getBestVoice();
      if (bestVoice) {
        utterance.voice = bestVoice;
        console.log(`🎤 Using voice: ${bestVoice.name} (${bestVoice.lang})`);
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  // Preload common phrases (for Web Speech API, this just ensures voices are loaded)
  async preloadCommonPhrases() {
    return new Promise((resolve) => {
      // Web Speech API loads voices asynchronously
      if (window.speechSynthesis.getVoices().length > 0) {
        resolve();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          resolve();
        };
      }
    });
  }

  // Stop any ongoing speech
  stop() {
    if (this.isAvailable) {
      window.speechSynthesis.cancel();
    }
  }
}

// Create singleton instance
const ttsService = new TTSService();

export default ttsService;
