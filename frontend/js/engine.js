// KeyCraft - Core Typing Engine, Keystroke Analysis & Results Chart
(function (global) {
  'use strict';

  const { LESSONS, COMMON_WORDS, SENTENCES_POOL, CODE_POOL, NUMBERS_POOL } = global.KeyCraftData;
  const { state, savePersistentState, syncSessionToBackend } = global.KeyCraftState;
  const { playKeySound } = global.KeyCraftSound;
  const { updateKeyboardHighlights, flashKeyOnDeck } = global.KeyCraftKeyboard;

  let dom = null;
  let charSpanNodes = [];

  function setDOMElements(elements) {
    dom = elements;
  }

  function getWeakestKeys(limit) {
    const entries = Object.entries(state.keyStats)
      .filter(([k, v]) => k !== ' ' && (v.hits + v.misses) >= 2 && v.misses > 0)
      .map(([k, v]) => ({
        key: k,
        rate: v.misses / (v.hits + v.misses),
        misses: v.misses
      }))
      .sort((a, b) => b.rate - a.rate || b.misses - a.misses);
    return entries.slice(0, limit || 5).map(e => e.key);
  }

  function generateRandomWords(count, includePunct, includeNums, filterLetters) {
    let pool = COMMON_WORDS;
    if (filterLetters && filterLetters.length > 0) {
      const filtered = COMMON_WORDS.filter(w => filterLetters.some(ch => w.includes(ch)));
      if (filtered.length >= 6) pool = filtered;
    }
    const out = [];
    for (let i = 0; i < count; i++) {
      let w = pool[Math.floor(Math.random() * pool.length)];
      if (includePunct && Math.random() < 0.18) {
        w = w.charAt(0).toUpperCase() + w.slice(1);
      }
      if (includeNums && Math.random() < 0.12) {
        w = String(Math.floor(Math.random() * 900) + 10);
      }
      if (includePunct && Math.random() < 0.2) {
        const marks = [',', '.', ';', '!', '?'];
        w += marks[Math.floor(Math.random() * marks.length)];
      }
      out.push(w);
    }
    return out.join(' ');
  }

  function generateTargetText() {
    if (state.mode === 'learn') {
      const lesson = LESSONS.find(l => l.id === state.lessonId) || LESSONS[0];
      const stepIdx = Math.min(state.lessonStep, lesson.steps.length - 1);
      return lesson.steps[stepIdx];
    }

    if (state.mode === 'practice') {
      if (state.practiceCat === 'drills') {
        const lesson = LESSONS.find(l => l.id === state.lessonId) || LESSONS[0];
        const stepIdx = Math.min(state.lessonStep, lesson.steps.length - 1);
        return lesson.steps[stepIdx];
      }
      if (state.practiceCat === 'words') {
        return generateRandomWords(30, state.practicePunct, false, null);
      }
      if (state.practiceCat === 'quotes') {
        const s1 = SENTENCES_POOL[Math.floor(Math.random() * SENTENCES_POOL.length)];
        let s2 = SENTENCES_POOL[Math.floor(Math.random() * SENTENCES_POOL.length)];
        if (s2 === s1) s2 = SENTENCES_POOL[(SENTENCES_POOL.indexOf(s1) + 1) % SENTENCES_POOL.length];
        return `${s1} ${s2}`;
      }
      if (state.practiceCat === 'code') {
        const c1 = CODE_POOL[Math.floor(Math.random() * CODE_POOL.length)];
        const c2 = CODE_POOL[(CODE_POOL.indexOf(c1) + 1) % CODE_POOL.length];
        return `${c1} ${c2}`;
      }
      if (state.practiceCat === 'numbers') {
        return NUMBERS_POOL[Math.floor(Math.random() * NUMBERS_POOL.length)];
      }
      if (state.practiceCat === 'weak') {
        const weakKeys = getWeakestKeys(4);
        const focusKeys = weakKeys.length > 0 ? weakKeys : ['q', 'z', 'p', 'x'];
        return generateRandomWords(28, state.practicePunct, false, focusKeys);
      }
      if (state.practiceCat === 'custom') {
        const cleaned = (state.customText || '').trim().replace(/\s+/g, ' ');
        return cleaned.length > 0 ? cleaned : 'Type or paste custom text above to practice.';
      }
    }

    if (state.mode === 'test') {
      const count = state.testType === 'words' ? state.testWordCount : 75;
      return generateRandomWords(count, state.testPunct, state.testNums, null);
    }

    return generateRandomWords(25, false, false, null);
  }

  function renderPromptCharacters() {
    if (!dom || !dom.wordsWrapper) return;
    dom.wordsWrapper.innerHTML = '';
    dom.wordsWrapper.style.transform = 'translateY(0px)';
    charSpanNodes = [];

    const frag = document.createDocumentFragment();
    for (let i = 0; i < state.targetText.length; i++) {
      const span = document.createElement('span');
      span.className = 'char' + (i === 0 ? ' current' : '');
      span.textContent = state.targetText[i];
      charSpanNodes.push(span);
      frag.appendChild(span);
    }
    dom.wordsWrapper.appendChild(frag);
  }

  function scrollPromptToCurrentChar() {
    if (!dom || !dom.wordsWrapper) return;
    const activeSpan = charSpanNodes[state.currentIndex];
    if (!activeSpan) return;
    const topOffset = activeSpan.offsetTop;
    const lineHeight = 40;
    if (topOffset > lineHeight * 1.4) {
      const shift = Math.floor(topOffset / lineHeight) - 1;
      dom.wordsWrapper.style.transform = `translateY(-${shift * lineHeight}px)`;
    } else {
      dom.wordsWrapper.style.transform = 'translateY(0px)';
    }
  }

  function clearTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
    if (state.ghostInterval) {
      clearInterval(state.ghostInterval);
      state.ghostInterval = null;
    }
  }

  function computeCurrentMetrics() {
    const elapsedMin = state.startTime
      ? Math.max((performance.now() - state.startTime) / 60000, 1 / 120)
      : 0;

    let correctChars = 0;
    let incorrectChars = 0;
    for (let i = 0; i < state.currentIndex; i++) {
      if (state.typedChars[i] === state.targetText[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }

    const rawWpm = elapsedMin > 0 ? Math.round((state.currentIndex / 5) / elapsedMin) : 0;
    const netWpm = elapsedMin > 0 ? Math.max(0, Math.round(((correctChars) / 5) / elapsedMin)) : 0;
    const acc = state.totalKeystrokes > 0
      ? Math.max(0, Math.round(((state.totalKeystrokes - state.errorKeystrokes) / state.totalKeystrokes) * 100))
      : 100;

    return { netWpm, rawWpm, acc, correctChars, incorrectChars };
  }

  function updateLiveHUD() {
    if (!dom) return;
    const metrics = computeCurrentMetrics();
    if (dom.liveWpmMetric) dom.liveWpmMetric.textContent = String(metrics.netWpm);
    if (dom.liveAccMetric) dom.liveAccMetric.textContent = `${metrics.acc}%`;
    if (dom.liveStreakMetric) dom.liveStreakMetric.textContent = String(state.currentStreak);

    if (state.mode === 'test' && state.testType === 'time') {
      if (dom.primaryTimerLabel) dom.primaryTimerLabel.textContent = 'Time Left';
      const rem = Math.max(0, Math.ceil(state.testDuration - state.elapsedSeconds));
      if (dom.liveProgressMetric) dom.liveProgressMetric.textContent = `${rem}s`;
    } else {
      if (dom.primaryTimerLabel) dom.primaryTimerLabel.textContent = 'Progress';
      const pct = state.targetText.length > 0
        ? Math.round((state.currentIndex / state.targetText.length) * 100)
        : 0;
      if (dom.liveProgressMetric) dom.liveProgressMetric.textContent = `${pct}%`;
    }
  }

  function beginTimerIfNeeded() {
    if (state.isRunning || state.isFinished) return;
    state.isRunning = true;
    state.startTime = performance.now();
    document.body.classList.add('is-typing');

    if (state.paceWpm > 0 && state.targetText.length > 0) {
      const charsPerSec = (state.paceWpm * 5) / 60;
      const intervalMs = Math.max(40, Math.round(1000 / charsPerSec));
      state.ghostIndex = 0;
      state.ghostInterval = setInterval(() => {
        if (!state.isRunning || state.isFinished) return;
        if (charSpanNodes[state.ghostIndex]) {
          charSpanNodes[state.ghostIndex].classList.remove('ghost-caret');
        }
        state.ghostIndex++;
        if (state.ghostIndex < charSpanNodes.length) {
          charSpanNodes[state.ghostIndex].classList.add('ghost-caret');
        } else {
          clearInterval(state.ghostInterval);
          state.ghostInterval = null;
        }
      }, intervalMs);
    }

    state.timerInterval = setInterval(() => {
      const now = performance.now();
      state.elapsedSeconds = (now - state.startTime) / 1000;

      const secInt = Math.max(1, Math.round(state.elapsedSeconds));
      const stats = computeCurrentMetrics();
      state.wpmHistoryBySecond.push({
        sec: secInt,
        wpm: stats.netWpm,
        raw: stats.rawWpm,
        errors: state.errorsThisSecond
      });
      state.errorsThisSecond = 0;

      // Check timed speed test completion
      if (state.mode === 'test' && state.testType === 'time') {
        if (state.elapsedSeconds >= state.testDuration) {
          completeSession();
          return;
        }
      }

      updateLiveHUD();
    }, 1000);
  }

  function startNewPassage(keepSameText, onSessionInit) {
    clearTimer();
    state.isRunning = false;
    state.isFinished = false;
    state.startTime = null;
    state.elapsedSeconds = 0;
    state.typedChars = [];
    state.currentIndex = 0;
    state.totalKeystrokes = 0;
    state.errorKeystrokes = 0;
    state.currentStreak = 0;
    state.wpmHistoryBySecond = [];
    state.errorsThisSecond = 0;
    document.body.classList.remove('is-typing');

    if (!keepSameText || !state.targetText) {
      state.targetText = generateTargetText();
    }

    if (dom && dom.resultsPanel) dom.resultsPanel.classList.add('hidden');
    const isLearn = state.mode === 'learn';
    if (dom && dom.typingArenaSection) dom.typingArenaSection.classList.toggle('hidden', isLearn);
    const liveMetricsSec = document.getElementById('liveMetricsSection');
    if (liveMetricsSec) liveMetricsSec.classList.toggle('hidden', isLearn);

    renderPromptCharacters();
    updateLiveHUD();
    updateKeyboardHighlights(dom ? dom.activeFingerText : null, dom ? dom.nextKeyLarge : null);
    if (typeof onSessionInit === 'function') onSessionInit();
  }

  function handleCharacterInput(char, onKeySuccess) {
    if (state.isFinished) return;
    if (state.currentIndex >= state.targetText.length) return;

    beginTimerIfNeeded();

    const expected = state.targetText[state.currentIndex];
    const isCorrect = char === expected;

    state.totalKeystrokes++;
    const statKey = expected.toLowerCase();
    if (!state.keyStats[statKey]) {
      state.keyStats[statKey] = { hits: 0, misses: 0 };
    }

    if (isCorrect) {
      state.keyStats[statKey].hits++;
      state.currentStreak++;
      playKeySound(false, state.soundProfile, state.soundEnabled);
      flashKeyOnDeck(expected, true);
    } else {
      state.errorKeystrokes++;
      state.errorsThisSecond++;
      state.keyStats[statKey].misses++;
      state.currentStreak = 0;
      playKeySound(true, state.soundProfile, state.soundEnabled);
      flashKeyOnDeck(char, false);

      // In Learn mode or Strict Practice mode, require pressing the right key to advance
      if (state.mode === 'learn' || (state.mode === 'practice' && state.strictMode)) {
        const curSpan = charSpanNodes[state.currentIndex];
        if (curSpan) {
          curSpan.classList.add('incorrect');
        }
        updateLiveHUD();
        return;
      }
    }

    // Advance cursor
    state.typedChars[state.currentIndex] = char;
    const curSpan = charSpanNodes[state.currentIndex];
    if (curSpan) {
      curSpan.classList.remove('current', 'incorrect');
      curSpan.classList.add(isCorrect ? 'correct' : 'incorrect');
    }

    state.currentIndex++;

    if (state.currentIndex < state.targetText.length) {
      charSpanNodes[state.currentIndex].classList.add('current');
      scrollPromptToCurrentChar();
      updateKeyboardHighlights(dom ? dom.activeFingerText : null, dom ? dom.nextKeyLarge : null);
      updateLiveHUD();
      if (typeof onKeySuccess === 'function') onKeySuccess();
    } else {
      updateKeyboardHighlights(dom ? dom.activeFingerText : null, dom ? dom.nextKeyLarge : null);
      updateLiveHUD();
      completeSession();
    }
  }

  function handleBackspace() {
    if (state.isFinished || state.currentIndex <= 0) return;

    const curSpan = charSpanNodes[state.currentIndex];
    if (curSpan) curSpan.classList.remove('current', 'incorrect');

    state.currentIndex--;
    state.typedChars[state.currentIndex] = undefined;

    const prevSpan = charSpanNodes[state.currentIndex];
    if (prevSpan) {
      prevSpan.classList.remove('correct', 'incorrect');
      prevSpan.classList.add('current');
    }

    playKeySound(false, state.soundProfile, state.soundEnabled);
    scrollPromptToCurrentChar();
    updateKeyboardHighlights(dom ? dom.activeFingerText : null, dom ? dom.nextKeyLarge : null);
    updateLiveHUD();
  }

  function completeSession(onCompleteCallback) {
    clearTimer();
    state.isRunning = false;
    state.isFinished = true;
    document.body.classList.remove('is-typing');

    const finalMetrics = computeCurrentMetrics();
    if (state.wpmHistoryBySecond.length === 0) {
      state.wpmHistoryBySecond.push({
        sec: 1,
        wpm: finalMetrics.netWpm,
        raw: finalMetrics.rawWpm,
        errors: state.errorKeystrokes
      });
    }

    if (state.mode === 'learn') {
      const key = `${state.lessonId}-${state.lessonStep}`;
      state.completedLessons[key] = true;
    }

    state.totalPracticeSeconds += Math.max(2, Math.round(state.elapsedSeconds || 5));

    const sessionRecord = {
      mode: state.mode === 'test'
        ? `test (${state.testType === 'time' ? state.testDuration + 's' : state.testWordCount + 'w'})`
        : state.mode === 'learn'
          ? `lesson ${state.lessonId}.${state.lessonStep + 1}`
          : `practice (${state.practiceCat})`,
      wpm: finalMetrics.netWpm,
      raw: finalMetrics.rawWpm,
      acc: finalMetrics.acc,
      ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString()
    };

    state.sessionHistory.unshift(sessionRecord);
    savePersistentState();
    syncSessionToBackend(sessionRecord);

    // Populate Results View
    if (dom) {
      if (dom.resNetWpm) dom.resNetWpm.textContent = String(finalMetrics.netWpm);
      if (dom.resAccuracy) dom.resAccuracy.textContent = `${finalMetrics.acc}%`;
      if (dom.resCharBreakdown) dom.resCharBreakdown.textContent = `${finalMetrics.correctChars} ok / ${state.errorKeystrokes} miss`;
      if (dom.resRawWpm) dom.resRawWpm.textContent = `${finalMetrics.rawWpm} wpm`;

      const wpmSamples = state.wpmHistoryBySecond.map(x => x.wpm);
      let consistency = 96;
      if (wpmSamples.length > 1) {
        const mean = wpmSamples.reduce((a, b) => a + b, 0) / wpmSamples.length;
        if (mean > 0) {
          const variance = wpmSamples.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpmSamples.length;
          const sd = Math.sqrt(variance);
          consistency = Math.max(40, Math.min(100, Math.round(100 - (sd / mean) * 50)));
        }
      }
      if (dom.resConsistency) dom.resConsistency.textContent = `${consistency}%`;

      if (state.mode === 'learn') {
        if (dom.resultModeSubtitle) dom.resultModeSubtitle.textContent = `Lesson ${state.lessonId} · Step ${state.lessonStep + 1} Complete`;
        if (dom.resultHeadline) dom.resultHeadline.textContent = finalMetrics.acc >= 96
          ? 'Clean finger placement! Ready for the next drill.'
          : 'Good effort — try repeating once more for 96%+ accuracy.';
      } else if (state.mode === 'practice') {
        if (dom.resultModeSubtitle) dom.resultModeSubtitle.textContent = `Practice (${state.practiceCat}) Complete`;
        if (dom.resultHeadline) dom.resultHeadline.textContent = `${finalMetrics.netWpm} WPM at ${finalMetrics.acc}% accuracy.`;
      } else {
        if (dom.resultModeSubtitle) dom.resultModeSubtitle.textContent = `Speed Test (${state.testType === 'time' ? state.testDuration + 's' : state.testWordCount + ' words'})`;
        if (dom.resultHeadline) dom.resultHeadline.textContent = `${finalMetrics.netWpm} WPM · ${finalMetrics.acc}% Accuracy`;
      }

      const weakList = getWeakestKeys(4);
      if (dom.resMissedKeysSummary) {
        dom.resMissedKeysSummary.textContent = weakList.length > 0
          ? `Focus keys: ${weakList.map(k => k.toUpperCase()).join(', ')}`
          : 'Zero weak keys detected';
      }

      if (dom.resultsPanel) dom.resultsPanel.classList.remove('hidden');
    }

    requestAnimationFrame(() => {
      drawWpmChart();
    });

    if (typeof onCompleteCallback === 'function') onCompleteCallback(finalMetrics);
  }

  function drawWpmChart() {
    if (!dom || !dom.wpmChartCanvas) return;
    const canvas = dom.wpmChartCanvas;
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(260, rect.width - 24);
    const height = Math.max(110, rect.height - 24);
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const data = state.wpmHistoryBySecond;
    if (!data || data.length === 0) return;

    const styles = getComputedStyle(document.documentElement);
    const accentColor = styles.getPropertyValue('--accent').trim() || '#e5a93b';
    const mutedColor = styles.getPropertyValue('--text-muted').trim() || '#7c7a72';
    const errColor = styles.getPropertyValue('--err').trim() || '#ef4444';

    const padLeft = 32;
    const padRight = 14;
    const padTop = 12;
    const padBottom = 22;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const maxWpm = Math.max(60, ...data.map(d => Math.max(d.wpm, d.raw))) + 10;

    // Horizontal grid lines
    ctx.strokeStyle = 'rgba(125, 125, 125, 0.16)';
    ctx.lineWidth = 1;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = mutedColor;

    [0, 0.5, 1].forEach(frac => {
      const y = padTop + plotH - frac * plotH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + plotW, y);
      ctx.stroke();
      const val = Math.round(frac * maxWpm);
      ctx.fillText(String(val), 4, y + 3);
    });

    const getX = idx => data.length === 1
      ? padLeft + plotW / 2
      : padLeft + (idx / (data.length - 1)) * plotW;
    const getY = val => padTop + plotH - (val / maxWpm) * plotH;

    // Draw Raw WPM dashed curve
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = mutedColor;
    ctx.lineWidth = 1.5;
    data.forEach((pt, idx) => {
      const x = getX(idx);
      const y = getY(pt.raw);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Net WPM solid curve
    ctx.beginPath();
    data.forEach((pt, idx) => {
      const x = getX(idx);
      const y = getY(pt.wpm);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Data points and error dots
    data.forEach((pt, idx) => {
      const x = getX(idx);
      const y = getY(pt.wpm);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.fill();

      if (pt.errors > 0) {
        ctx.beginPath();
        ctx.arc(x, padTop + plotH - 4, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = errColor;
        ctx.fill();
      }
    });
  }

  global.KeyCraftEngine = {
    setDOMElements,
    getWeakestKeys,
    generateTargetText,
    startNewPassage,
    handleCharacterInput,
    handleBackspace,
    computeCurrentMetrics,
    updateLiveHUD,
    completeSession,
    drawWpmChart
  };
})(typeof window !== 'undefined' ? window : this);
