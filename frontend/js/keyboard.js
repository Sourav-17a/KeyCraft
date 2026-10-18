// KeyCraft - Laptop ANSI Keyboard Deck Builder & Interactive Highlights
(function (global) {
  'use strict';

  const { KEYBOARD_ROWS, FINGER_NAMES, FINGER_GUIDE_DETAILS, charToKeyInfo } = global.KeyCraftData;
  const { state } = global.KeyCraftState;

  const keyDomMap = {};

  function buildKeyboardDOM(containerEl, onKeyClick) {
    if (!containerEl) return;
    containerEl.innerHTML = '';
    
    KEYBOARD_ROWS.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'flex items-center gap-1.5 w-full';
      
      row.forEach(k => {
        const btn = document.createElement('div');
        btn.className = `kbd-key finger-${k.finger} ${k.w} h-10 rounded-lg flex flex-col items-center justify-center relative text-xs font-mono`;
        btn.dataset.keyid = k.main;

        if (k.shift) {
          const topSpan = document.createElement('span');
          topSpan.className = 'text-[9px] opacity-60 leading-none mb-0.5';
          topSpan.textContent = k.shift;
          const botSpan = document.createElement('span');
          botSpan.className = 'leading-none';
          botSpan.textContent = k.main.toUpperCase();
          btn.appendChild(topSpan);
          btn.appendChild(botSpan);
        } else {
          const span = document.createElement('span');
          span.className = 'text-[11px]';
          span.textContent = k.label || k.main;
          btn.appendChild(span);
        }

        if (k.bump) {
          const bump = document.createElement('span');
          bump.className = 'w-2.5 h-[2px] bg-current opacity-60 rounded-full absolute bottom-1';
          btn.appendChild(bump);
        }

        btn.addEventListener('click', () => {
          if (typeof onKeyClick === 'function') {
            onKeyClick(k.main);
          }
        });

        rowDiv.appendChild(btn);
        keyDomMap[k.main] = btn;
      });
      containerEl.appendChild(rowDiv);
    });
  }

  function updateKeyboardHighlights(activeFingerEl, nextKeyLargeEl) {
    // Clear previous target highlights
    Object.keys(keyDomMap).forEach(kId => {
      const dom = keyDomMap[kId];
      dom.classList.remove('target-key');
      dom.style.backgroundColor = '';

      // Optional miss heatmap coloring
      if (state.showHeatmap && kId.length === 1) {
        const st = state.keyStats[kId.toLowerCase()];
        if (st && (st.hits + st.misses) >= 3) {
          const missRatio = st.misses / (st.hits + st.misses);
          if (missRatio > 0.15) {
            dom.style.backgroundColor = 'rgba(239, 68, 68, 0.28)';
          } else if (missRatio > 0.05) {
            dom.style.backgroundColor = 'rgba(245, 158, 11, 0.22)';
          } else {
            dom.style.backgroundColor = 'rgba(34, 197, 94, 0.15)';
          }
        }
      }
    });

    if (state.mode === 'learn') {
      const guide = FINGER_GUIDE_DETAILS[state.selectedFingerGuide] || FINGER_GUIDE_DETAILS.all;
      guide.highlightKeys.forEach(kId => {
        if (keyDomMap[kId]) keyDomMap[kId].classList.add('target-key');
      });
      return;
    }

    if (state.isFinished || state.currentIndex >= state.targetText.length) {
      if (activeFingerEl) activeFingerEl.textContent = 'Completed!';
      if (nextKeyLargeEl) nextKeyLargeEl.textContent = '✓';
      return;
    }

    const nextChar = state.targetText[state.currentIndex];
    const info = charToKeyInfo[nextChar] || charToKeyInfo[nextChar.toLowerCase()];

    if (nextKeyLargeEl) {
      nextKeyLargeEl.textContent = nextChar === ' ' ? '␣' : nextChar;
    }

    if (info) {
      const targetDom = keyDomMap[info.keyId];
      if (targetDom) {
        targetDom.classList.add('target-key');
      }
      const fingerTitle = FINGER_NAMES[info.finger] || 'Finger';
      if (activeFingerEl) {
        activeFingerEl.textContent = `${fingerTitle} (${nextChar === ' ' ? 'Space' : nextChar})`;
      }

      // Highlight opposite-hand Shift if uppercase/shifted symbol
      if (info.needsShift) {
        const isLeftHandKey = info.finger.startsWith('l');
        const shiftKeyId = isLeftHandKey ? 'ShiftRight' : 'ShiftLeft';
        if (keyDomMap[shiftKeyId]) {
          keyDomMap[shiftKeyId].classList.add('target-key');
        }
      }
    }
  }

  function flashKeyOnDeck(rawChar, isCorrect) {
    const info = charToKeyInfo[rawChar] || charToKeyInfo[rawChar ? rawChar.toLowerCase() : ''];
    if (!info || !keyDomMap[info.keyId]) return;
    const dom = keyDomMap[info.keyId];
    const cls = isCorrect ? 'pressed-ok' : 'pressed-err';
    dom.classList.add(cls);
    setTimeout(() => {
      dom.classList.remove(cls);
    }, 120);
  }

  global.KeyCraftKeyboard = {
    keyDomMap,
    buildKeyboardDOM,
    updateKeyboardHighlights,
    flashKeyOnDeck
  };
})(typeof window !== 'undefined' ? window : this);
