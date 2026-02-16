import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  Settings,
  Award,
  Play,
  RotateCcw,
  Target,
} from "lucide-react";
import LevelSystem from "./levelSystem.js";
import LevelSelector from "./LevelSelector.jsx";
import ttsService from "./ttsService.js";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher.jsx';

const MathTrainerApp = () => {
  const { t, i18n } = useTranslation();
  const [levelSystem] = useState(() => new LevelSystem());
  const [settings, setSettings] = useState({
    operation: "+",
    difficulty: "medium",
    feedbackStyle: "encouraging",
    voiceURI: "",
    speechRate: 0.9,
    autoPlayNext: true,
    showEquation: true,
    kopfrechnenMode: true,
  });

  const [mode, setMode] = useState("menu"); // menu, levels, practice, quiz, results, level-practice
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Level system state
  const [currentLevelId, setCurrentLevelId] = useState(null);
  const [levelProblems, setLevelProblems] = useState([]);
  const [levelProblemIndex, setLevelProblemIndex] = useState(0);
  const [levelScore, setLevelScore] = useState({ correct: 0, total: 0 });
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [levelCompleteData, setLevelCompleteData] = useState(null);

  const inputRef = useRef(null);

  // Initialize TTS service when component mounts
  useEffect(() => {
    // Preload common phrases for better performance
    const initializeTTS = async () => {
      try {
        console.log("🔄 Initializing OpenAI TTS...");
        await ttsService.preloadCommonPhrases();
        console.log("✅ TTS initialized successfully");
      } catch (error) {
        console.warn("⚠️ TTS initialization failed, will use fallback:", error);
      }
    };

    initializeTTS();
  }, []);

  // Sync TTS language when i18n language changes
  useEffect(() => {
    ttsService.setLanguage(i18n.language);
  }, [i18n.language]);

  const difficultyRanges = {
    "+": {
      easy: { min: 1, max: 10 },
      medium: { min: 1, max: 20 },
      hard: { min: 10, max: 50 },
    },
    "-": {
      easy: { min: 1, max: 10 },
      medium: { min: 1, max: 20 },
      hard: { min: 10, max: 50 },
    },
    "*": {
      easy: { min: 1, max: 5 },
      medium: { min: 2, max: 10 },
      hard: { min: 5, max: 12 },
    },
    "/": {
      easy: { min: 1, max: 5 },
      medium: { min: 1, max: 10 },
      hard: { min: 1, max: 12 },
    },
  };

  const getFeedbackMessages = () => {
    return {
      encouraging: {
        correct: t('feedback.encouraging.correct', { returnObjects: true }),
        incorrect: t('feedback.encouraging.incorrect', { returnObjects: true }),
      },
      simple: {
        correct: t('feedback.simple.correct', { returnObjects: true }),
        incorrect: t('feedback.simple.incorrect', { returnObjects: true }),
      },
      playful: {
        correct: t('feedback.playful.correct', { returnObjects: true }),
        incorrect: t('feedback.playful.incorrect', { returnObjects: true }),
      },
      teacher: {
        correct: t('feedback.teacher.correct', { returnObjects: true }),
        incorrect: t('feedback.teacher.incorrect', { returnObjects: true }),
      },
    };
  };

  const generateProblem = () => {
    const { operation, difficulty } = settings;
    const range = difficultyRanges[operation][difficulty];

    let num1, num2, answer;

    if (operation === "/") {
      // For division, ensure whole number results
      num2 =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const multiplier =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      num1 = num2 * multiplier;
      answer = multiplier;
    } else if (operation === "-") {
      // For subtraction, ensure positive results (num1 >= 2 so num2 can be < num1)
      num1 =
        Math.floor(Math.random() * (range.max - Math.max(range.min, 2) + 1)) + Math.max(range.min, 2);
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      answer = num1 - num2;
    } else if (operation === "*") {
      num1 =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      num2 =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      answer = num1 * num2;
    } else {
      // addition
      num1 =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      num2 =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      answer = num1 + num2;
    }

    return { num1, num2, operation, answer };
  };

  const speakProblem = async (problem, inputRef) => {
    try {
      const operationWords = {
        "+": t('operations.plus'),
        "-": t('operations.minus'),
        "*": t('operations.times'),
        "/": t('operations.divided'),
      };

      const text = t('problem.question', {
        num1: problem.num1,
        operation: operationWords[problem.operation],
        num2: problem.num2,
      });

      console.log("🎤 Speaking problem:", text);

      // Use TTS with current language voice
      await ttsService.speak(text);

      // Focus input field after speech ends
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("❌ TTS failed for problem:", error);
    }
  };

  const speakFeedback = async (text, isCorrect) => {
    try {
      // Clean text from emojis for better TTS
      const cleanText = text.replace(
        /[🌟🎉⭐💪🌈😊🎯✓✗👑🎈🎊🚀🐰🐸🦊🐻📚📝✏️📖🤔📐🔢📏]/g,
        ""
      );

      console.log("🎤 Speaking feedback:", cleanText);

      // Use TTS with emotion for feedback
      await ttsService.speak(cleanText, isCorrect);

      // Auto-advance to next question after feedback if enabled
      if (settings.autoPlayNext) {
        setTimeout(() => {
          nextQuestion();
        }, 1500);
      }
    } catch (error) {
      console.error("❌ TTS failed for feedback:", error);
    }
  };

  const startPractice = () => {
    const problem = generateProblem();
    setCurrentProblem(problem);
    setMode("practice");
    setUserAnswer("");
    setFeedback(null);
    setTimeout(() => speakProblem(problem, inputRef), 300);
  };

  const startQuiz = () => {
    const questions = Array.from({ length: 10 }, () => generateProblem());
    setQuizQuestions(questions);
    setQuizIndex(0);
    setCurrentProblem(questions[0]);
    setMode("quiz");
    setScore({ correct: 0, total: 0 });
    setUserAnswer("");
    setFeedback(null);
    setTimeout(() => speakProblem(questions[0], inputRef), 300);
  };

  // Level System Functions
  const startLevelPractice = (levelId) => {
    const level = levelSystem.getLevel(levelId);
    if (!level) return;

    levelSystem.setCurrentLevel(levelId);
    setCurrentLevelId(levelId);

    const problems = levelSystem.generateProblems(levelId);
    setLevelProblems(problems);
    setLevelProblemIndex(0);
    setLevelScore({ correct: 0, total: 0 });

    if (problems.length > 0) {
      const firstProblem = parseProblem(problems[0]);
      setCurrentProblem(firstProblem);
      setMode("level-practice");
      setUserAnswer("");
      setFeedback(null);

      // Handle special level 9 with explanation
      if (levelId === "1-9") {
        speakLevelExplanation(level);
      } else {
        setTimeout(() => speakProblem(firstProblem, inputRef), 300);
      }
    }
  };

  const parseProblem = (problemStr) => {
    const match = problemStr.match(/(\d+)([\+\-\*\/])(\d+)/);
    if (!match) return null;

    const [, num1, operation, num2] = match;
    const n1 = parseInt(num1);
    const n2 = parseInt(num2);
    let answer;

    switch (operation) {
      case "+":
        answer = n1 + n2;
        break;
      case "-":
        answer = n1 - n2;
        break;
      case "*":
        answer = n1 * n2;
        break;
      case "/":
        answer = n1 / n2;
        break;
      default:
        return null;
    }

    return { num1: n1, num2: n2, operation, answer };
  };

  const speakLevelExplanation = (level) => {
    if ("speechSynthesis" in window && level.explanation) {
      const utterance = new SpeechSynthesisUtterance(level.explanation);
      utterance.lang = i18n.language === 'pt' ? 'pt-PT' : 'de-DE';
      utterance.rate = settings.speechRate;

      if (settings.voiceURI) {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(
          (v) => v.voiceURI === settings.voiceURI
        );
        if (selectedVoice) utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        setTimeout(() => {
          if (levelProblems.length > 0) {
            const firstProblem = parseProblem(levelProblems[0]);
            if (firstProblem) {
              speakProblem(firstProblem, inputRef);
            }
          }
        }, 1000);
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const checkAnswer = () => {
    const isCorrect = parseInt(userAnswer) === currentProblem.answer;
    const feedbackMessages = getFeedbackMessages();
    const messages =
      feedbackMessages[settings.feedbackStyle][
        isCorrect ? "correct" : "incorrect"
      ];
    const message = messages[Math.floor(Math.random() * messages.length)];

    setFeedback({
      isCorrect,
      message,
      correctAnswer: currentProblem.answer,
    });

    // In level practice, we always advance, so give appropriate feedback
    if (mode === "level-practice") {
      const encouragingMessage = isCorrect
        ? message
        : `${message} ${t('feedback.nextTask')}`;
      speakFeedback(encouragingMessage, isCorrect);
    } else {
      speakFeedback(message, isCorrect);
    }

    if (mode === "practice") {
      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
    } else if (mode === "level-practice") {
      // Record answer in level system
      levelSystem.recordAnswer(currentLevelId, isCorrect);
      setLevelScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
    } else if (mode === "quiz") {
      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
    }
  };

  const nextQuestion = () => {
    if (mode === "practice") {
      const problem = generateProblem();
      setCurrentProblem(problem);
      setUserAnswer("");
      setFeedback(null);
      setTimeout(() => speakProblem(problem, inputRef), 300);
    } else if (mode === "level-practice") {
      const nextIndex = levelProblemIndex + 1;
      if (nextIndex < levelProblems.length) {
        setLevelProblemIndex(nextIndex);
        const nextProblem = parseProblem(levelProblems[nextIndex]);
        setCurrentProblem(nextProblem);
        setUserAnswer("");
        setFeedback(null);
        setTimeout(() => speakProblem(nextProblem, inputRef), 300);
      } else {
        // Level completed - check if 80% or more answers were correct
        const finalScore = levelScore.correct + (feedback?.isCorrect ? 1 : 0);
        const accuracy = (finalScore / levelProblems.length) * 100;

        if (accuracy >= 80) {
          // Level passed with 80% or better
          const completionData = levelSystem.completeLevel(currentLevelId);
          setLevelCompleteData(completionData);
          setShowLevelComplete(true);
        } else {
          // Not all correct, restart level
          setLevelProblemIndex(0);
          const firstProblem = parseProblem(levelProblems[0]);
          setCurrentProblem(firstProblem);
          setLevelScore({ correct: 0, total: 0 });
          setUserAnswer("");
          setFeedback(null);
          setTimeout(() => speakProblem(firstProblem, inputRef), 300);
        }
      }
    } else if (mode === "quiz") {
      if (quizIndex < quizQuestions.length - 1) {
        const nextIdx = quizIndex + 1;
        setQuizIndex(nextIdx);
        setCurrentProblem(quizQuestions[nextIdx]);
        setUserAnswer("");
        setFeedback(null);
        setTimeout(() => speakProblem(quizQuestions[nextIdx], inputRef), 300);
      } else {
        setMode("results");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && userAnswer && !feedback) {
      checkAnswer();
    }
  };

  const operationSymbols = {
    "+": "+",
    "-": "-",
    "*": "×",
    "/": "÷",
  };

  if (mode === "menu") {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8'>
        <div className='max-w-2xl mx-auto'>
          <div className='bg-white rounded-3xl shadow-2xl p-8'>
            <div className="flex justify-between items-center mb-2">
              <h1 className='text-4xl font-bold text-purple-600'>
                {t('app.title')}
              </h1>
              <LanguageSwitcher />
            </div>
            <p className='text-center text-gray-600 mb-8'>
              {t('app.subtitle')} 🎓
            </p>

            {showSettings ? (
              <div className='space-y-6 mb-8'>
                <div>
                  <label className='flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition'>
                    <span className='text-sm font-semibold text-gray-700'>
                      {t('settings.showEquation')}
                    </span>
                    <input
                      type='checkbox'
                      checked={settings.showEquation}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          showEquation: e.target.checked,
                        })
                      }
                      className='w-5 h-5 text-purple-600 rounded'
                    />
                  </label>
                  <p className='text-xs text-gray-500 mt-1 ml-3'>
                    {t('settings.showEquationHint')}
                  </p>
                </div>

                <div>
                  <label className='flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition'>
                    <span className='text-sm font-semibold text-gray-700'>
                      {t('settings.mentalMathMode')}
                    </span>
                    <input
                      type='checkbox'
                      checked={settings.kopfrechnenMode}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          kopfrechnenMode: e.target.checked,
                        })
                      }
                      className='w-5 h-5 text-purple-600 rounded'
                    />
                  </label>
                  <p className='text-xs text-gray-500 mt-1 ml-3'>
                    {t('settings.mentalMathModeHint')}
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-semibold mb-2 text-gray-700'>
                    {t('settings.operation')}
                  </label>
                  <div className='grid grid-cols-4 gap-2'>
                    {["+", "-", "*", "/"].map((op) => (
                      <button
                        key={op}
                        onClick={() =>
                          setSettings({ ...settings, operation: op })
                        }
                        className={`py-3 px-4 rounded-lg text-2xl font-bold transition ${
                          settings.operation === op
                            ? "bg-purple-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {operationSymbols[op]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-semibold mb-2 text-gray-700'>
                    {t('settings.difficulty')}
                  </label>
                  <div className='grid grid-cols-3 gap-2'>
                    {["easy", "medium", "hard"].map((diff) => (
                      <button
                        key={diff}
                        onClick={() =>
                          setSettings({ ...settings, difficulty: diff })
                        }
                        className={`py-2 px-4 rounded-lg font-semibold transition ${
                          settings.difficulty === diff
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {t(`difficulties.${diff}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-semibold mb-2 text-gray-700'>
                    {t('settings.speechRate')}: {settings.speechRate.toFixed(1)}x
                  </label>
                  <input
                    type='range'
                    min='0.5'
                    max='1.5'
                    step='0.1'
                    value={settings.speechRate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        speechRate: parseFloat(e.target.value),
                      })
                    }
                    className='w-full'
                  />
                  <div className='flex justify-between text-xs text-gray-500 mt-1'>
                    <span>{t('settings.slow')}</span>
                    <span>{t('settings.normal')}</span>
                    <span>{t('settings.fast')}</span>
                  </div>
                </div>

                <div>
                  <label className='flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition'>
                    <span className='text-sm font-semibold text-gray-700'>
                      {t('settings.autoPlayNext')}
                    </span>
                    <input
                      type='checkbox'
                      checked={settings.autoPlayNext}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          autoPlayNext: e.target.checked,
                        })
                      }
                      className='w-5 h-5 text-purple-600 rounded'
                    />
                  </label>
                  <p className='text-xs text-gray-500 mt-1 ml-3'>
                    {t('settings.autoPlayNextHint')}
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-semibold mb-2 text-gray-700'>
                    {t('settings.feedbackStyle')}
                  </label>
                  <div className='grid grid-cols-2 gap-2'>
                    {[
                      { key: "encouraging", label: t('feedbackStyles.encouraging') },
                      { key: "simple", label: t('feedbackStyles.simple') },
                      { key: "playful", label: t('feedbackStyles.playful') },
                      { key: "teacher", label: t('feedbackStyles.teacher') },
                    ].map((style) => (
                      <button
                        key={style.key}
                        onClick={() =>
                          setSettings({ ...settings, feedbackStyle: style.key })
                        }
                        className={`py-2 px-4 rounded-lg font-semibold transition ${
                          settings.feedbackStyle === style.key
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            <div className='flex justify-center mb-6'>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition'
              >
                <Settings size={20} />
                {showSettings
                  ? t('menu.hideSettings')
                  : t('menu.settings')}
              </button>
            </div>

            <div className='space-y-4'>
              <button
                onClick={() => setMode("levels")}
                className='w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition shadow-lg'
              >
                <Target size={24} />
                {t('menu.levels')}
              </button>

              <button
                onClick={startPractice}
                className='w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition shadow-lg'
              >
                <Play size={24} />
                {t('menu.practice')}
              </button>

              <button
                onClick={startQuiz}
                className='w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition shadow-lg'
              >
                <Award size={24} />
                {t('menu.quiz')}
              </button>
            </div>

            {score.total > 0 && (
              <div className='mt-8 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200'>
                <p className='text-center text-lg font-semibold text-gray-700'>
                  {t('score.stats', {
                    correct: score.correct,
                    total: score.total,
                    percent: Math.round((score.correct / score.total) * 100),
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "levels") {
    return (
      <LevelSelector
        levelSystem={levelSystem}
        onLevelSelect={startLevelPractice}
        onBack={() => setMode("menu")}
      />
    );
  }

  if (mode === "results") {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8 flex items-center justify-center'>
        <div className='bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center'>
          <h2 className='text-3xl font-bold mb-4 text-purple-600'>
            {t('results.title')} 🎉
          </h2>
          <div className='mb-6'>
            <div className='text-6xl font-bold text-blue-600 mb-2'>
              {percentage}%
            </div>
            <p className='text-xl text-gray-700'>
              {t('results.score', { correct: score.correct, total: score.total })}
            </p>
          </div>

          <div className='mb-6 p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl'>
            <p className='text-lg font-semibold'>
              {percentage >= 90
                ? `🌟 ${t('results.perfect')}`
                : percentage >= 70
                ? `⭐ ${t('results.great')}`
                : percentage >= 50
                ? `👍 ${t('results.good')}`
                : `💪 ${t('results.keepPracticing')}`}
            </p>
          </div>

          <button
            onClick={() => {
              setMode("menu");
              setScore({ correct: 0, total: 0 });
            }}
            className='w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold text-lg transition'
          >
            {t('buttons.backToMenu')}
          </button>
        </div>
      </div>
    );
  }

  // Level completion modal
  if (showLevelComplete && levelCompleteData) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8 flex items-center justify-center'>
        <div className='bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center'>
          <h2 className='text-3xl font-bold mb-4 text-green-600'>
            {t('levelComplete.title')} 🎉
          </h2>
          <div className='mb-6'>
            <div className='text-6xl mb-4'>🏆</div>
            <p className='text-xl text-gray-700 mb-2'>
              {t('levelComplete.completed', { level: currentLevelId?.split("-")[1] })}
            </p>
            <div className='bg-yellow-100 border-2 border-yellow-300 rounded-xl p-4 mb-4'>
              <p className='text-lg font-bold text-yellow-800'>
                {t('levelComplete.unlockCode')} {levelCompleteData.unlockCode}
              </p>
              <p className='text-sm text-yellow-700'>{t('levelComplete.rememberCode')}</p>
            </div>
            {levelCompleteData.nextLevelUnlocked && (
              <p className='text-green-600 font-semibold'>
                {t('levelComplete.nextUnlocked', { level: levelCompleteData.nextLevelUnlocked.split("-")[1] })}
              </p>
            )}
          </div>
          <div className='space-y-3'>
            {levelCompleteData.nextLevelUnlocked && (
              <button
                onClick={() => {
                  setShowLevelComplete(false);
                  startLevelPractice(levelCompleteData.nextLevelUnlocked);
                }}
                className='w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-lg transition'
              >
                {t('buttons.nextLevel')}
              </button>
            )}
            <button
              onClick={() => {
                setShowLevelComplete(false);
                setMode("levels");
              }}
              className='w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-lg transition'
            >
              {t('buttons.levelSelection')}
            </button>
            <button
              onClick={() => {
                setShowLevelComplete(false);
                setMode("menu");
              }}
              className='w-full py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-bold text-lg transition'
            >
              {t('buttons.mainMenu')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8'>
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white rounded-3xl shadow-2xl p-8'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-purple-600'>
              {mode === "practice"
                ? t('modes.practice')
                : mode === "level-practice"
                ? t('modes.level', { level: currentLevelId?.split("-")[1] })
                : t('modes.quiz', { current: quizIndex + 1, total: 10 })}
            </h2>
            <button
              onClick={() => setMode("menu")}
              className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition'
            >
              {t('buttons.back')}
            </button>
          </div>

          {mode === "quiz" && (
            <div className='mb-4'>
              <div className='flex gap-1'>
                {quizQuestions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded ${
                      idx < quizIndex
                        ? "bg-green-500"
                        : idx === quizIndex
                        ? "bg-blue-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className='mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl'>
            <div className='flex items-center justify-center gap-4 mb-4'>
              <button
                onClick={() => speakProblem(currentProblem, inputRef)}
                className='p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition'
                title={t('buttons.readAloud')}
              >
                <Volume2 size={24} />
              </button>
              {settings.kopfrechnenMode ? (
                <div className='text-5xl font-bold text-purple-600'>
                  {t('problem.mentalMath')}
                </div>
              ) : settings.showEquation ? (
                <div className='text-5xl font-bold text-gray-800'>
                  {currentProblem.num1}{" "}
                  {operationSymbols[currentProblem.operation]}{" "}
                  {currentProblem.num2} = ?
                </div>
              ) : (
                <div className='text-4xl font-bold text-gray-500 italic'>
                  {t('problem.listenCarefully')} 👂
                </div>
              )}
            </div>
          </div>

          <div className='mb-6'>
            <input
              ref={inputRef}
              type='number'
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('problem.placeholder')}
              disabled={feedback !== null}
              className='w-full p-4 text-3xl text-center border-4 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-100'
            />
          </div>

          {!feedback ? (
            <button
              onClick={checkAnswer}
              disabled={!userAnswer}
              className='w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl font-bold text-xl transition shadow-lg disabled:cursor-not-allowed'
            >
              {t('buttons.check')}
            </button>
          ) : (
            <div className='space-y-4'>
              <div
                className={`p-6 rounded-xl text-center ${
                  feedback.isCorrect
                    ? "bg-gradient-to-r from-green-100 to-green-200 border-4 border-green-400"
                    : "bg-gradient-to-r from-red-100 to-red-200 border-4 border-red-400"
                }`}
              >
                <p className='text-2xl font-bold mb-2'>{feedback.message}</p>
                {!feedback.isCorrect && (
                  <p className='text-lg'>
                    {t('problem.correctAnswer')}{" "}
                    <span className='font-bold text-2xl'>
                      {feedback.correctAnswer}
                    </span>
                  </p>
                )}
              </div>

              <button
                onClick={nextQuestion}
                className='w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold text-xl transition shadow-lg flex items-center justify-center gap-2'
              >
                {mode === "quiz" && quizIndex === quizQuestions.length - 1 ? (
                  <>{t('buttons.showResults')}</>
                ) : settings.autoPlayNext ? (
                  <>
                    <RotateCcw size={24} />
                    {t('buttons.autoLoading')}
                  </>
                ) : (
                  <>
                    <RotateCcw size={24} />
                    {t('buttons.next')}
                  </>
                )}
              </button>
            </div>
          )}

          <div className='mt-6 p-4 bg-gray-50 rounded-xl'>
            {mode === "level-practice" ? (
              <div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-lg font-semibold text-gray-700'>
                    {t('score.question', { current: levelProblemIndex + 1, total: levelProblems.length })}
                  </span>
                  <span className='text-lg font-semibold text-gray-700'>
                    {t('score.correct')}: {levelScore.correct} | {t('score.total')}: {levelScore.total}
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                    style={{
                      width: `${
                        ((levelProblemIndex + 1) / levelProblems.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <p className='text-center text-base font-medium text-gray-600 mt-2'>
                  {t('score.successRate', { percent: 80 })}
                </p>
              </div>
            ) : (
              <p className='text-center text-gray-600'>
                {t('score.correct')}: {score.correct} | {t('score.total')}: {score.total}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathTrainerApp;
