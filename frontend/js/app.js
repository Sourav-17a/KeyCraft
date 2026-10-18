// KeyCraft - Main UI Controller, Event Wiring & Initialization
(function () {
  'use strict';

  const { LESSONS, FINGER_NAMES, FINGER_GUIDE_DETAILS, charToKeyInfo } = window.KeyCraftData;
  const { state, loadSavedState, savePersistentState } = window.KeyCraftState;
  const { playKeySound } = window.KeyCraftSound;
  const { buildKeyboardDOM, updateKeyboardHighlights, flashKeyOnDeck } = window.KeyCraftKeyboard;
  const {
    setDOMElements,
    getWeakestKeys,
    startNewPassage,
    handleCharacterInput,
    handleBackspace,
    drawWpmChart
  } = window.KeyCraftEngine;

  // DOM Elements Cache
  const el = {
    brandResetBtn: document.getElementById('brandResetBtn'),
    navLearnBtn: document.getElementById('navLearnBtn'),
    navPracticeBtn: document.getElementById('navPracticeBtn'),
    navTestBtn: document.getElementById('navTestBtn'),
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    soundLabel: document.getElementById('soundLabel'),
    kbdToggleBtn: document.getElementById('kbdToggleBtn'),
    kbdToggleLabel: document.getElementById('kbdToggleLabel'),
    statsModalBtn: document.getElementById('statsModalBtn'),
    headerBestWpm: document.getElementById('headerBestWpm'),
    themeCycleBtn: document.getElementById('themeCycleBtn'),
    themeNameLabel: document.getElementById('themeNameLabel'),

    learnToolbar: document.getElementById('learnToolbar'),
    lessonButtonsContainer: document.getElementById('lessonButtonsContainer'),
    lessonBadge: document.getElementById('lessonBadge'),
    lessonTitle: document.getElementById('lessonTitle'),
    lessonDesc: document.getElementById('lessonDesc'),
    activeFingerText: document.getElementById('activeFingerText'),
    nextKeyLarge: document.getElementById('nextKeyLarge'),

    practiceToolbar: document.getElementById('practiceToolbar'),
    togglePunctBtn: document.getElementById('togglePunctBtn'),
    toggleStrictBtn: document.getElementById('toggleStrictBtn'),
    customTextDrawer: document.getElementById('customTextDrawer'),
    customTextInput: document.getElementById('customTextInput'),
    applyCustomTextBtn: document.getElementById('applyCustomTextBtn'),

    testToolbar: document.getElementById('testToolbar'),
    testTypeTimeBtn: document.getElementById('testTypeTimeBtn'),
    testTypeWordsBtn: document.getElementById('testTypeWordsBtn'),
    timeDurationGroup: document.getElementById('timeDurationGroup'),
    wordCountGroup: document.getElementById('wordCountGroup'),
    testPunctBtn: document.getElementById('testPunctBtn'),
    testNumsBtn: document.getElementById('testNumsBtn'),

    primaryTimerLabel: document.getElementById('primaryTimerLabel'),
    liveProgressMetric: document.getElementById('liveProgressMetric'),
    liveWpmMetric: document.getElementById('liveWpmMetric'),
    liveAccMetric: document.getElementById('liveAccMetric'),
    liveStreakMetric: document.getElementById('liveStreakMetric'),
    capsLockWarning: document.getElementById('capsLockWarning'),
    restartPromptBtn: document.getElementById('restartPromptBtn'),
    nextPassageBtn: document.getElementById('nextPassageBtn'),

    typingArenaSection: document.getElementById('typingArenaSection'),
    hiddenTypingInput: document.getElementById('hiddenTypingInput'),
    promptContainer: document.getElementById('promptContainer'),
    wordsWrapper: document.getElementById('wordsWrapper'),
    unfocusedOverlay: document.getElementById('unfocusedOverlay'),

    resultsPanel: document.getElementById('resultsPanel'),
    resultModeSubtitle: document.getElementById('resultModeSubtitle'),
    resultHeadline: document.getElementById('resultHeadline'),
    retrySameBtn: document.getElementById('retrySameBtn'),
    practiceWeakFromResultBtn: document.getElementById('practiceWeakFromResultBtn'),
    nextFromResultBtn: document.getElementById('nextFromResultBtn'),
    resNetWpm: document.getElementById('resNetWpm'),
    resAccuracy: document.getElementById('resAccuracy'),
    resCharBreakdown: document.getElementById('resCharBreakdown'),
    resRawWpm: document.getElementById('resRawWpm'),
    resConsistency: document.getElementById('resConsistency'),
    resMissedKeysSummary: document.getElementById('resMissedKeysSummary'),
    wpmChartCanvas: document.getElementById('wpmChartCanvas'),

    keyboardDeckSection: document.getElementById('keyboardDeckSection'),
    fingerLegendToggleBtn: document.getElementById('fingerLegendToggleBtn'),
    heatmapToggleBtn: document.getElementById('heatmapToggleBtn'),
    fingerLegendBar: document.getElementById('fingerLegendBar'),
    laptopKeyboardWrap: document.getElementById('laptopKeyboardWrap'),
    keyboardRowsContainer: document.getElementById('keyboardRowsContainer'),
    footerSessionSummary: document.getElementById('footerSessionSummary'),

    statsModal: document.getElementById('statsModal'),
    closeStatsModalBtn: document.getElementById('closeStatsModalBtn'),
    modalBestWpm: document.getElementById('modalBestWpm'),
    modalAvgWpm: document.getElementById('modalAvgWpm'),
    modalAvgAcc: document.getElementById('modalAvgAcc'),
    drillWeakFromModalBtn: document.getElementById('drillWeakFromModalBtn'),
    modalWeakKeysList: document.getElementById('modalWeakKeysList'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    modalHistoryList: document.getElementById('modalHistoryList')
  };

  // Provide DOM elements to the engine
  setDOMElements(el);

  function applyTheme() {
    const html = document.documentElement;
    html.classList.remove('dark', 'sage', 'nord');
    if (state.theme === 'dark') {
      html.classList.add('dark');
      el.themeNameLabel.textContent = 'carbon';
      state.lastNightTheme = 'dark';
    } else if (state.theme === 'sage') {
      html.classList.add('sage');
      el.themeNameLabel.textContent = 'sage';
      state.lastNightTheme = 'sage';
    } else if (state.theme === 'nord') {
      html.classList.add('nord');
      el.themeNameLabel.textContent = 'nord';
      state.lastNightTheme = 'nord';
    } else {
      el.themeNameLabel.textContent = 'paper';
    }

    const isLight = state.theme === 'light';
    const lnIcon = document.getElementById('lightNightIcon');
    const lnLabel = document.getElementById('lightNightLabel');
    if (lnIcon) lnIcon.textContent = isLight ? '☀️' : '🌙';
    if (lnLabel) lnLabel.textContent = isLight ? 'Light' : 'Night';

    if (state.isFinished) {
      drawWpmChart();
    }
  }

  function fallbackCopyText(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Scorecard copied to clipboard!');
    } catch (e) {
      showToast('Ready: ' + text);
    }
  }

  function showToast(msg) {
    const banner = document.getElementById('toastBanner');
    const text = document.getElementById('toastMessage');
    if (!banner || !text) return;
    text.textContent = msg;
    banner.classList.remove('hidden');
    setTimeout(() => {
      banner.classList.add('hidden');
    }, 2200);
  }

  function renderLearnFingerGuide() {
    const g = FINGER_GUIDE_DETAILS[state.selectedFingerGuide] || FINGER_GUIDE_DETAILS.all;
    if (el.lessonBadge) el.lessonBadge.textContent = g.badge;
    if (el.lessonTitle) el.lessonTitle.textContent = g.title;
    if (el.lessonDesc) el.lessonDesc.textContent = g.desc;
    if (el.activeFingerText) el.activeFingerText.textContent = g.fingerLabel;
    if (el.nextKeyLarge) el.nextKeyLarge.textContent = g.anchor;

    const rHome = document.getElementById('reachHomeKeys');
    const rTop = document.getElementById('reachTopKeys');
    const rBot = document.getElementById('reachBottomKeys');
    const rNum = document.getElementById('reachNumKeys');
    if (rHome) rHome.textContent = g.home;
    if (rTop) rTop.textContent = g.top;
    if (rBot) rBot.textContent = g.bottom;
    if (rNum) rNum.textContent = g.num;

    document.querySelectorAll('.finger-guide-btn').forEach(btn => {
      const act = btn.dataset.finger === state.selectedFingerGuide;
      btn.className = `finger-guide-btn px-2 py-1 rounded-md text-xs font-mono transition-colors ${
        act ? 'accent-bg text-stone-950 font-semibold' : 'text-muted-custom hover:text-current'
      }`;
    });

    document.querySelectorAll('.hand-finger-bar').forEach(bar => {
      const act = state.selectedFingerGuide === 'all' || bar.dataset.finger === state.selectedFingerGuide;
      bar.style.opacity = act ? '1' : '0.35';
      bar.style.transform = (bar.dataset.finger === state.selectedFingerGuide) ? 'translateY(-3px)' : 'none';
    });

    updateKeyboardHighlights(el.activeFingerText, el.nextKeyLarge);
  }

  function updateHomeRowCheckUI() {
    const keys = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
    document.querySelectorAll('.hcheck-pill').forEach(pill => {
      const k = pill.dataset.hcheck;
      const done = !!state.homeRowChecked[k];
      pill.className = `hcheck-pill px-2.5 py-1 rounded border font-mono text-xs transition-all ${
        done ? 'accent-bg text-stone-950 font-bold border-transparent' : 'surface-card text-muted-custom'
      }`;
    });
    if (keys.every(k => state.homeRowChecked[k])) {
      showToast('All 8 Home Row keys anchored! Ready to practice.');
    }
  }

  function inspectSpecificKeyInLearn(rawKey) {
    const lower = rawKey ? rawKey.toLowerCase() : '';
    if (['a', 's', 'd', 'f', 'j', 'k', 'l', ';'].includes(lower)) {
      state.homeRowChecked[lower] = true;
      updateHomeRowCheckUI();
    }
    const info = charToKeyInfo[rawKey] || charToKeyInfo[lower];
    if (!info) return;
    state.selectedFingerGuide = info.finger;
    renderLearnFingerGuide();
    const g = FINGER_GUIDE_DETAILS[info.finger];
    const prettyKey = rawKey === ' ' ? 'Spacebar' : rawKey.length === 1 ? rawKey.toUpperCase() : rawKey;
    if (g) {
      if (el.lessonBadge) el.lessonBadge.textContent = `Key Pressed: [ ${prettyKey} ]`;
      if (el.lessonTitle) el.lessonTitle.textContent = `Use ${FINGER_NAMES[info.finger]} (Rest Anchor: ${g.anchor})`;
    }
    flashKeyOnDeck(rawKey, true);
    playKeySound(false, state.soundProfile, state.soundEnabled);
  }

  function renderLessonPills() {
    if (!el.lessonButtonsContainer) return;
    el.lessonButtonsContainer.innerHTML = '';
    LESSONS.forEach(lesson => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isCurrent = lesson.id === state.lessonId;
      const allStepsDone = [0, 1, 2].every(s => state.completedLessons[`${lesson.id}-${s}`]);

      btn.className = `px-2.5 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1 ${
        isCurrent ? 'accent-bg text-stone-950 font-semibold' : 'text-muted-custom hover:text-current'
      }`;
      btn.textContent = lesson.short + (allStepsDone ? ' ✓' : '');
      btn.addEventListener('click', () => {
        state.lessonId = lesson.id;
        state.lessonStep = 0;
        syncModeToolbars();
        startNewPassage(false, focusTypingArena);
      });
      el.lessonButtonsContainer.appendChild(btn);
    });
  }

  function syncModeToolbars() {
    document.querySelectorAll('.mode-tab').forEach(btn => {
      const active = btn.dataset.mode === state.mode;
      btn.className = `mode-tab px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
        active ? 'accent-bg text-stone-950 font-semibold shadow-xs' : 'text-muted-custom hover:text-current'
      }`;
    });

    el.learnToolbar.classList.toggle('hidden', state.mode !== 'learn');
    el.learnToolbar.classList.toggle('flex', state.mode === 'learn');
    el.practiceToolbar.classList.toggle('hidden', state.mode !== 'practice');
    el.practiceToolbar.classList.toggle('flex', state.mode === 'practice');
    el.testToolbar.classList.toggle('hidden', state.mode !== 'test');
    el.testToolbar.classList.toggle('flex', state.mode === 'test');

    if (state.mode === 'learn') {
      renderLearnFingerGuide();
    }

    if (state.mode === 'practice') {
      renderLessonPills();
      document.querySelectorAll('.lesson-step-btn').forEach(b => {
        const stepNum = Number(b.dataset.step);
        const done = state.completedLessons[`${state.lessonId}-${stepNum}`];
        const isAct = stepNum === state.lessonStep;
        b.className = `lesson-step-btn px-2 py-1 rounded text-xs font-mono transition-colors ${
          isAct ? 'accent-soft-bg accent-text font-semibold' : 'text-muted-custom hover:text-current'
        }`;
        const baseLabels = ['1. Keys', '2. Words', '3. Flow'];
        b.textContent = baseLabels[stepNum] + (done ? ' ✓' : '');
      });

      const drillsDrawer = document.getElementById('practiceDrillsDrawer');
      if (drillsDrawer) {
        drillsDrawer.classList.toggle('hidden', state.practiceCat !== 'drills');
        drillsDrawer.classList.toggle('flex', state.practiceCat === 'drills');
      }

      document.querySelectorAll('.pcat-btn').forEach(b => {
        const act = b.dataset.pcat === state.practiceCat;
        b.className = `pcat-btn px-2.5 py-1 rounded-md transition-colors ${
          act ? 'accent-bg text-stone-950 font-semibold' : 'text-muted-custom hover:text-current'
        }`;
      });
      el.customTextDrawer.classList.toggle('hidden', state.practiceCat !== 'custom');
      el.customTextDrawer.classList.toggle('flex', state.practiceCat === 'custom');
      el.togglePunctBtn.className = `px-2 py-1 rounded transition-colors ${
        state.practicePunct ? 'accent-text font-semibold' : 'text-muted-custom'
      }`;
      el.toggleStrictBtn.className = `px-2 py-1 rounded transition-colors ${
        state.strictMode ? 'accent-text font-semibold' : 'text-muted-custom'
      }`;
    }

    if (state.mode === 'test') {
      document.querySelectorAll('.testtype-btn').forEach(b => {
        const act = b.dataset.testtype === state.testType;
        b.className = `testtype-btn px-2.5 py-1 rounded-md transition-colors ${
          act ? 'accent-bg text-stone-950 font-semibold' : 'text-muted-custom hover:text-current'
        }`;
      });
      el.timeDurationGroup.classList.toggle('hidden', state.testType !== 'time');
      el.timeDurationGroup.classList.toggle('flex', state.testType === 'time');
      el.wordCountGroup.classList.toggle('hidden', state.testType !== 'words');
      el.wordCountGroup.classList.toggle('flex', state.testType === 'words');

      document.querySelectorAll('.dur-btn').forEach(b => {
        const act = Number(b.dataset.dur) === state.testDuration;
        b.className = `dur-btn px-2 py-1 rounded transition-colors ${
          act ? 'accent-soft-bg accent-text font-semibold' : 'text-muted-custom hover:text-current'
        }`;
      });
      document.querySelectorAll('.wcount-btn').forEach(b => {
        const act = Number(b.dataset.wcount) === state.testWordCount;
        b.className = `wcount-btn px-2 py-1 rounded transition-colors ${
          act ? 'accent-soft-bg accent-text font-semibold' : 'text-muted-custom hover:text-current'
        }`;
      });
      el.testPunctBtn.className = `px-2 py-1 rounded transition-colors ${
        state.testPunct ? 'accent-text font-semibold' : 'text-muted-custom'
      }`;
      el.testNumsBtn.className = `px-2 py-1 rounded transition-colors ${
        state.testNums ? 'accent-text font-semibold' : 'text-muted-custom'
      }`;
    }
  }

  function updateGlobalStatsUI() {
    const hist = state.sessionHistory;
    const best = hist.length > 0 ? Math.max(...hist.map(x => x.wpm)) : 0;
    const avgWpm = hist.length > 0 ? Math.round(hist.reduce((a, b) => a + b.wpm, 0) / hist.length) : 0;
    const avgAcc = hist.length > 0 ? Math.round(hist.reduce((a, b) => a + b.acc, 0) / hist.length) : 100;

    if (el.headerBestWpm) el.headerBestWpm.textContent = `best: ${best} wpm`;
    if (el.footerSessionSummary) {
      el.footerSessionSummary.textContent = `${hist.length} session${hist.length === 1 ? '' : 's'} completed · keep wrists neutral & eyes on screen`;
    }

    if (el.modalBestWpm) el.modalBestWpm.textContent = `${best} wpm`;
    if (el.modalAvgWpm) el.modalAvgWpm.textContent = `${avgWpm} wpm`;
    if (el.modalAvgAcc) el.modalAvgAcc.textContent = `${avgAcc}%`;

    const mins = Math.min(5, state.totalPracticeSeconds / 60);
    const goalText = document.getElementById('modalDailyGoalText');
    const goalBar = document.getElementById('modalDailyGoalBar');
    if (goalText) goalText.textContent = `${mins.toFixed(1)} / 5.0 min`;
    if (goalBar) goalBar.style.width = `${Math.min(100, Math.round((mins / 5) * 100))}%`;

    // Weak keys list in modal
    const weakKeys = getWeakestKeys(8);
    if (!el.modalWeakKeysList) return;
    if (weakKeys.length === 0) {
      el.modalWeakKeysList.innerHTML = '<span class="text-muted-custom">No problem keys recorded yet — type a few passages!</span>';
    } else {
      el.modalWeakKeysList.innerHTML = '';
      weakKeys.forEach(k => {
        const st = state.keyStats[k];
        const rate = Math.round((st.misses / (st.hits + st.misses)) * 100);
        const badge = document.createElement('span');
        badge.className = 'px-2.5 py-1 rounded-lg surface-elevated border font-mono text-xs flex items-center gap-1.5';
        badge.innerHTML = `<strong class="accent-text uppercase">${k}</strong> <span class="text-muted-custom">${rate}% miss</span>`;
        el.modalWeakKeysList.appendChild(badge);
      });
    }

    // Recent runs list in modal
    if (hist.length === 0) {
      el.modalHistoryList.innerHTML = '<div class="text-muted-custom py-2">No completed sessions yet.</div>';
    } else {
      el.modalHistoryList.innerHTML = '';
      hist.slice(0, 15).forEach(item => {
        const row = document.createElement('div');
        row.className = 'flex items-center justify-between p-2 rounded-lg surface-elevated border';
        row.innerHTML = `
          <span class="text-muted-custom">${item.ts} · ${item.mode}</span>
          <span class="font-semibold"><span class="accent-text">${item.wpm} wpm</span> · ${item.acc}%</span>
        `;
        el.modalHistoryList.appendChild(row);
      });
    }
  }

  function focusTypingArena() {
    if (document.activeElement === el.customTextInput) return;
    if (el.promptContainer) el.promptContainer.focus();
  }

  function advanceOrNewPassage() {
    if (state.mode === 'learn') {
      if (state.lessonStep < 2) {
        state.lessonStep++;
      } else if (state.lessonId < LESSONS.length) {
        state.lessonId++;
        state.lessonStep = 0;
      } else {
        state.lessonStep = 0;
      }
      syncModeToolbars();
    }
    startNewPassage(false, focusTypingArena);
  }

  function bindEvents() {
    // Mode Navigation Tabs
    [el.navLearnBtn, el.navPracticeBtn, el.navTestBtn].forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        state.mode = btn.dataset.mode;
        syncModeToolbars();
        startNewPassage(false, focusTypingArena);
      });
    });

    // Reset button
    if (el.brandResetBtn) {
      el.brandResetBtn.addEventListener('click', () => startNewPassage(false, focusTypingArena));
    }

    // Sound toggle
    if (el.soundToggleBtn) {
      el.soundToggleBtn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        el.soundLabel.textContent = `click: ${state.soundEnabled ? 'on' : 'off'}`;
        if (state.soundEnabled) playKeySound(false, state.soundProfile, true);
        savePersistentState();
      });
    }

    // Keyboard Deck toggle
    if (el.kbdToggleBtn) {
      el.kbdToggleBtn.addEventListener('click', () => {
        state.deckVisible = !state.deckVisible;
        el.keyboardDeckSection.classList.toggle('hidden', !state.deckVisible);
        el.kbdToggleLabel.textContent = `deck: ${state.deckVisible ? 'on' : 'off'}`;
      });
    }

    // Light / Night Quick Toggle
    const lnBtn = document.getElementById('lightNightToggleBtn');
    if (lnBtn) {
      lnBtn.addEventListener('click', () => {
        if (state.theme === 'light') {
          state.theme = state.lastNightTheme || 'dark';
        } else {
          state.theme = 'light';
        }
        applyTheme();
        savePersistentState();
      });
    }

    // Theme Palette Cycle
    if (el.themeCycleBtn) {
      el.themeCycleBtn.addEventListener('click', () => {
        const order = ['dark', 'light', 'sage', 'nord'];
        const nextIdx = (order.indexOf(state.theme) + 1) % order.length;
        state.theme = order[nextIdx];
        applyTheme();
        savePersistentState();
      });
    }

    // Sound Profile Switch
    const spBtn = document.getElementById('soundProfileBtn');
    const spLabel = document.getElementById('soundProfileLabel');
    if (spBtn && spLabel) {
      spBtn.addEventListener('click', () => {
        const profiles = ['scissor', 'tactile', 'creamy', 'typewriter'];
        const nextIdx = (profiles.indexOf(state.soundProfile) + 1) % profiles.length;
        state.soundProfile = profiles[nextIdx];
        spLabel.textContent = state.soundProfile;
        state.soundEnabled = true;
        el.soundLabel.textContent = 'click: on';
        playKeySound(false, state.soundProfile, true);
      });
    }

    // Ghost Pacemaker Caret
    const paceBtn = document.getElementById('paceCaretBtn');
    if (paceBtn) {
      paceBtn.addEventListener('click', () => {
        const paces = [0, 40, 60, 80, 100];
        const nextIdx = (paces.indexOf(state.paceWpm) + 1) % paces.length;
        state.paceWpm = paces[nextIdx];
        paceBtn.textContent = state.paceWpm === 0 ? 'pace: off' : `pace: ${state.paceWpm} wpm`;
        paceBtn.classList.toggle('accent-text', state.paceWpm > 0);
        startNewPassage(true, focusTypingArena);
      });
    }

    // Caret Style Cycle
    const caretBtn = document.getElementById('caretStyleBtn');
    if (caretBtn) {
      caretBtn.addEventListener('click', () => {
        const styles = ['line', 'block', 'underline'];
        const symbols = { line: '|', block: '█', underline: '_' };
        const nextIdx = (styles.indexOf(state.caretStyle) + 1) % styles.length;
        state.caretStyle = styles[nextIdx];
        caretBtn.textContent = `caret: ${symbols[state.caretStyle]}`;
        el.wordsWrapper.classList.remove('caret-block', 'caret-underline');
        if (state.caretStyle === 'block') el.wordsWrapper.classList.add('caret-block');
        if (state.caretStyle === 'underline') el.wordsWrapper.classList.add('caret-underline');
        focusTypingArena();
      });
    }

    // Text Size Cycle
    const sizeBtn = document.getElementById('fontSizeBtn');
    if (sizeBtn) {
      sizeBtn.addEventListener('click', () => {
        const sizes = ['M', 'L', 'XL'];
        const clsMap = {
          M: 'font-mono text-xl sm:text-2xl leading-[1.75] tracking-wide select-none transition-transform duration-150',
          L: 'font-mono text-2xl sm:text-3xl leading-[1.75] tracking-wide select-none transition-transform duration-150',
          XL: 'font-mono text-3xl sm:text-4xl leading-[1.75] tracking-wide select-none transition-transform duration-150'
        };
        const nextIdx = (sizes.indexOf(state.fontSize) + 1) % sizes.length;
        state.fontSize = sizes[nextIdx];
        sizeBtn.textContent = `size: ${state.fontSize}`;
        el.wordsWrapper.className = clsMap[state.fontSize];
        if (state.caretStyle === 'block') el.wordsWrapper.classList.add('caret-block');
        if (state.caretStyle === 'underline') el.wordsWrapper.classList.add('caret-underline');
        focusTypingArena();
      });
    }

    // Reset Home Row Check
    const resetHomeBtn = document.getElementById('resetHomeCheckBtn');
    if (resetHomeBtn) {
      resetHomeBtn.addEventListener('click', () => {
        state.homeRowChecked = {};
        updateHomeRowCheckUI();
      });
    }

    // Copy Scorecard
    if (el.retrySameBtn) el.retrySameBtn.addEventListener('click', () => startNewPassage(true, focusTypingArena));
    if (el.nextFromResultBtn) el.nextFromResultBtn.addEventListener('click', () => advanceOrNewPassage());
    const copyScoreBtn = document.getElementById('copyScorecardBtn');
    if (copyScoreBtn) {
      copyScoreBtn.addEventListener('click', () => {
        const summary = `keycraft. — ${el.resNetWpm.textContent} WPM | ${el.resAccuracy.textContent} Accuracy | ${el.resConsistency.textContent} Consistency (${el.resultModeSubtitle.textContent})`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(summary).then(() => {
            showToast('Scorecard copied to clipboard!');
          }).catch(() => {
            fallbackCopyText(summary);
          });
        } else {
          fallbackCopyText(summary);
        }
      });
    }

    // Finger Guide Buttons & SVG Hand Bars
    document.querySelectorAll('.finger-guide-btn, .hand-finger-bar').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedFingerGuide = btn.dataset.finger || 'all';
        renderLearnFingerGuide();
      });
    });

    const startPracBtn = document.getElementById('startPracticeFromLearnBtn');
    if (startPracBtn) {
      startPracBtn.addEventListener('click', () => {
        state.mode = 'practice';
        state.practiceCat = 'drills';
        syncModeToolbars();
        startNewPassage(false, focusTypingArena);
      });
    }

    // Lesson Step Buttons
    document.querySelectorAll('.lesson-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.lessonStep = Number(btn.dataset.step);
        syncModeToolbars();
        startNewPassage(false, focusTypingArena);
      });
    });

    // Practice Category Buttons
    document.querySelectorAll('.pcat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.practiceCat = btn.dataset.pcat;
        syncModeToolbars();
        startNewPassage(false, focusTypingArena);
      });
    });

    if (el.togglePunctBtn) {
      el.togglePunctBtn.addEventListener('click', () => {
        state.practicePunct = !state.practicePunct;
        syncModeToolbars();
        startNewPassage(false, focusTypingArena);
      });
    }

    if (el.toggleStrictBtn) {
      el.toggleStrictBtn.addEventListener('click', () => {
        state.strictMode = !state.strictMode;
        syncModeToolbars();
      });
    }

    if (el.applyCustomTextBtn) {
      el.applyCustomTextBtn.addEventListener('click', () => {
        const val = el.customTextInput.value.trim();
        if (val) {
          state.customText = val;
          startNewPassage(false, focusTypingArena);
        }
      });
    }

    // Speed Test Buttons
    document.querySelectorAll('.testtype-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.testType = btn.dataset.testtype;
        syncModeToolbars();
        startNewPassage(false, focusTypingArena);
      });
    });

    document.querySelectorAll('.dur-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.testDuration = Number(btn.dataset.dur);
        syncModeToolbars();
        startNewPassage(false, focusTypingArena);
      });
    });

    document.querySelectorAll('.wcount-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.testWordCount = Number(btn.dataset.wcount);
        syncModeToolbars();
        startNewPassage(false, focusTypingArena);
      });
    });

    if (el.testPunctBtn) {
      el.testPunctBtn.addEventListener('click', () => {
        state.testPunct = !state.testPunct;
        syncModeToolbars();
        startNewPassage(false, focusTypingArena);
      });
    }

    if (el.testNumsBtn) {
      el.testNumsBtn.addEventListener('click', () => {
        state.testNums = !state.testNums;
        syncModeToolbars();
        startNewPassage(false, focusTypingArena);
      });
    }

    // Passage Controls
    if (el.restartPromptBtn) el.restartPromptBtn.addEventListener('click', () => startNewPassage(true, focusTypingArena));
    if (el.nextPassageBtn) el.nextPassageBtn.addEventListener('click', () => advanceOrNewPassage());

    if (el.practiceWeakFromResultBtn) {
      el.practiceWeakFromResultBtn.addEventListener('click', () => {
        state.mode = 'practice';
        state.practiceCat = 'weak';
        syncModeToolbars();
        startNewPassage(false, focusTypingArena);
      });
    }

    // Keyboard Deck View Options
    if (el.fingerLegendToggleBtn) {
      el.fingerLegendToggleBtn.addEventListener('click', () => {
        state.showFingerZones = !state.showFingerZones;
        el.laptopKeyboardWrap.classList.toggle('show-fingers', state.showFingerZones);
        el.fingerLegendBar.classList.toggle('hidden', !state.showFingerZones);
        el.fingerLegendToggleBtn.textContent = `finger zones: ${state.showFingerZones ? 'on' : 'off'}`;
      });
    }

    if (el.heatmapToggleBtn) {
      el.heatmapToggleBtn.addEventListener('click', () => {
        state.showHeatmap = !state.showHeatmap;
        el.heatmapToggleBtn.textContent = `miss heatmap: ${state.showHeatmap ? 'on' : 'off'}`;
        updateKeyboardHighlights(el.activeFingerText, el.nextKeyLarge);
      });
    }

    // Stats Modal
    if (el.statsModalBtn) {
      el.statsModalBtn.addEventListener('click', () => {
        updateGlobalStatsUI();
        el.statsModal.classList.remove('hidden');
      });
    }
    if (el.closeStatsModalBtn) {
      el.closeStatsModalBtn.addEventListener('click', () => {
        el.statsModal.classList.add('hidden');
      });
    }
    if (el.statsModal) {
      el.statsModal.addEventListener('click', e => {
        if (e.target === el.statsModal) el.statsModal.classList.add('hidden');
      });
    }
    if (el.drillWeakFromModalBtn) {
      el.drillWeakFromModalBtn.addEventListener('click', () => {
        el.statsModal.classList.add('hidden');
        state.mode = 'practice';
        state.practiceCat = 'weak';
        syncModeToolbars();
        startNewPassage(false, focusTypingArena);
      });
    }
    if (el.clearHistoryBtn) {
      el.clearHistoryBtn.addEventListener('click', () => {
        state.sessionHistory = [];
        state.keyStats = {};
        savePersistentState();
        updateGlobalStatsUI();
        updateKeyboardHighlights(el.activeFingerText, el.nextKeyLarge);
      });
    }

    // Typing Arena Clicks
    if (el.promptContainer) {
      el.promptContainer.addEventListener('click', () => {
        if (el.hiddenTypingInput) el.hiddenTypingInput.focus();
      });
    }

    window.addEventListener('mousemove', () => {
      if (document.body.classList.contains('is-typing')) {
        document.body.classList.remove('is-typing');
      }
    });

    window.addEventListener('resize', () => {
      if (state.isFinished) drawWpmChart();
    });

    // Global Keydown Handler
    window.addEventListener('keydown', e => {
      if (document.activeElement === el.customTextInput) return;
      if (!el.statsModal.classList.contains('hidden')) {
        if (e.key === 'Escape') el.statsModal.classList.add('hidden');
        return;
      }

      if (e.getModifierState && e.getModifierState('CapsLock')) {
        if (el.capsLockWarning) el.capsLockWarning.classList.remove('hidden');
      } else {
        if (el.capsLockWarning) el.capsLockWarning.classList.add('hidden');
      }

      // Quick restart shortcut: Tab + Enter or Escape
      if (e.key === 'Tab') {
        e.preventDefault();
        state.tabPressedAt = Date.now();
        return;
      }
      if (e.key === 'Enter' && Date.now() - state.tabPressedAt < 900) {
        e.preventDefault();
        startNewPassage(false, focusTypingArena);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        startNewPassage(true, focusTypingArena);
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (state.mode === 'learn') {
        e.preventDefault();
        if (e.key === 'Backspace' || e.key === 'Enter' || e.key.length === 1) {
          inspectSpecificKeyInLearn(e.key);
        }
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        handleCharacterInput(e.key, updateGlobalStatsUI);
      }
    });
  }

  // ==========================================
  // INITIALIZE APP
  // ==========================================
  loadSavedState();
  buildKeyboardDOM(el.keyboardRowsContainer, key => {
    if (state.mode === 'learn') {
      inspectSpecificKeyInLearn(key);
    }
  });
  applyTheme();
  if (el.soundLabel) el.soundLabel.textContent = `click: ${state.soundEnabled ? 'on' : 'off'}`;
  if (el.customTextInput) el.customTextInput.value = state.customText;
  syncModeToolbars();
  updateGlobalStatsUI();
  bindEvents();
  startNewPassage(false, focusTypingArena);

})();
