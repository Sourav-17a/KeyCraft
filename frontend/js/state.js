// KeyCraft - State Management & Persistence (Local Storage & API Sync)
(function (global) {
  'use strict';

  const state = {
    mode: 'learn', // 'learn' | 'practice' | 'test'
    theme: 'dark', // 'dark' (carbon) | 'light' (paper) | 'sage' | 'nord'
    lastNightTheme: 'dark',
    soundEnabled: true,
    soundProfile: 'scissor', // 'scissor' | 'tactile' | 'creamy' | 'typewriter'
    deckVisible: true,
    showFingerZones: true,
    showHeatmap: false,
    paceWpm: 0, // 0 | 40 | 60 | 80 | 100
    caretStyle: 'line', // 'line' | 'block' | 'underline'
    fontSize: 'M', // 'M' | 'L' | 'XL'
    homeRowChecked: {},
    totalPracticeSeconds: 0,
    ghostInterval: null,
    ghostIndex: -1,

    // Learn mode state
    selectedFingerGuide: 'all',
    lessonId: 1,
    lessonStep: 0,
    completedLessons: {},

    // Practice mode state
    practiceCat: 'words', // 'words' | 'quotes' | 'code' | 'numbers' | 'weak' | 'custom'
    practicePunct: false,
    strictMode: false,
    customText: 'Practice makes permanent: light, rhythmic keystrokes build effortless speed on a laptop keyboard.',

    // Speed Test state
    testType: 'time', // 'time' | 'words'
    testDuration: 30, // seconds
    testWordCount: 25,
    testPunct: false,
    testNums: false,

    // Active Session Typing State
    targetText: '',
    typedChars: [],
    currentIndex: 0,
    isRunning: false,
    isFinished: false,
    startTime: null,
    elapsedSeconds: 0,
    timerInterval: null,
    totalKeystrokes: 0,
    errorKeystrokes: 0,
    currentStreak: 0,
    wpmHistoryBySecond: [],
    errorsThisSecond: 0,

    // Persistent Analytics
    keyStats: {}, // { 'a': { hits: 10, misses: 2 } }
    sessionHistory: [], // [{ mode, wpm, raw, acc, ts }]

    // Keyboard shortcut tracker
    tabPressedAt: 0
  };

  const STORAGE_KEY = 'keycraft_state_v1';

  function loadSavedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.keyStats) state.keyStats = parsed.keyStats;
        if (parsed.sessionHistory) state.sessionHistory = parsed.sessionHistory;
        if (parsed.completedLessons) state.completedLessons = parsed.completedLessons;
        if (parsed.theme) state.theme = parsed.theme;
        if (typeof parsed.soundEnabled === 'boolean') state.soundEnabled = parsed.soundEnabled;
        if (parsed.soundProfile) state.soundProfile = parsed.soundProfile;
        if (typeof parsed.totalPracticeSeconds === 'number') state.totalPracticeSeconds = parsed.totalPracticeSeconds;
      }
    } catch (e) {
      console.warn('KeyCraft: LocalStorage unavailable or sandboxed', e);
    }
  }

  function savePersistentState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        keyStats: state.keyStats,
        sessionHistory: state.sessionHistory.slice(0, 40),
        completedLessons: state.completedLessons,
        theme: state.theme,
        soundEnabled: state.soundEnabled,
        soundProfile: state.soundProfile,
        totalPracticeSeconds: state.totalPracticeSeconds
      }));
    } catch (e) {
      console.warn('KeyCraft: Could not write to LocalStorage', e);
    }
  }

  // Backend API Sync (Async fire-and-forget for Vercel/Node backend)
  async function syncSessionToBackend(sessionData) {
    try {
      await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
    } catch (e) {
      // Backend may be offline or static host, silently ignore
    }
  }

  global.KeyCraftState = {
    state,
    loadSavedState,
    savePersistentState,
    syncSessionToBackend
  };
})(typeof window !== 'undefined' ? window : this);
