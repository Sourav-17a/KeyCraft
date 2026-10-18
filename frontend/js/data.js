// KeyCraft - Curriculum, Word Banks & Keyboard Data
(function (global) {
  'use strict';

  const LESSONS = [
    {
      id: 1,
      short: '1. F & J',
      title: 'Home Row Anchors (F, J, D, K)',
      desc: 'Find the tactile ridges on F and J with your index fingers. Keep your thumbs resting lightly on the laptop spacebar.',
      steps: [
        'fff jjj fff jjj fjf jfj fff jjj ddd kkk dkd kdk fjd kjf dfjk kjfd',
        'fed jed kid didjk fjdk dfjk jfkd fff jjj ddd kkk fjdk dkfj jfkd',
        'dj df jk kd fjd kjf djk fkd jfk dkf fjdk dfjk kjfd fjdk dfjk'
      ]
    },
    {
      id: 2,
      short: '2. Home Row',
      title: 'Full Home Row (A S D F G H J K L ;)',
      desc: 'Curve all eight fingers along the middle row. Reach G with your left index and H with your right index.',
      steps: [
        'aaa sss ddd fff ggg hhh jjj kkk lll ;;; asdf ghjk l; asdf jkl;',
        'fall glad half ask dash flask salad hall flag glass shall flash',
        'a glad lad had a half flask; dad asks all fall halls; dash fast'
      ]
    },
    {
      id: 3,
      short: '3. Top Row',
      title: 'Top Row Extension (Q W E R T Y U I O P)',
      desc: 'Extend fingers smoothly upward from the home row, then return immediately to your resting home keys.',
      steps: [
        'eee iii rrr uuu www ooo qqq ppp ttt yyy erui woqp ty erui qwop',
        'write power quiet route outerquote tower poet waterripe proud',
        'quiet power writes true words; our top team typed every report'
      ]
    },
    {
      id: 4,
      short: '4. Bottom Row',
      title: 'Bottom Row Curl (Z X C V B N M , . /)',
      desc: 'Keep wrists elevated slightly above the laptop palm rest as fingers curl down to the bottom row.',
      steps: [
        'ccc mmm vvv nnn xxx ,,, zzz ... bbb /// cvbnm zxcv ,./ bnm,',
        'calmivan zoom next cave bank mind voice blank curvezone mix',
        'seven calm men moved next to a vibrant modern cabin near town'
      ]
    },
    {
      id: 5,
      short: '5. Shift & Caps',
      title: 'Opposite-Hand Shift Coordination',
      desc: 'Hold Left Shift with your right-hand letters, and Right Shift with your left-hand letters for effortless capitalization.',
      steps: [
        'F J D K A L S ; Free June Desk Kind Apple Lake Star Fast Jump',
        'Monday Tuesday Wednesday Thursday Friday Saturday Sunday April',
        'Elena and Marcus traveled from Tokyo to Berlin in late October.'
      ]
    },
    {
      id: 6,
      short: '6. Punctuation',
      title: 'Laptop Symbols & Punctuation Flow',
      desc: 'Practice right-pinky accuracy for hyphens, quotes, brackets, colons, and question marks.',
      steps: [
        'a-b c-d "hello" \'world\' [item] (note) yes, no; wait: why? ok!',
        'well-known, state-of-the-art; "focus: 100%" — [ready] (steady)!',
        'Can you check the "status-report" (v2.4) before 5:30 p.m., please?'
      ]
    },
    {
      id: 7,
      short: '7. Numbers',
      title: 'Number Row Reach (1 2 3 4 5 6 7 8 9 0)',
      desc: 'Reach diagonally up from the home row to hit laptop number keys without glancing at the keyboard.',
      steps: [
        '111 000 222 999 333 888 444 777 555 666 12345 67890 1029 3847',
        '2026 1998 450 8080 365 24 7 100 512 1024 99 42 73 88 640',
        'Flight 408 departs Gate 19 at 07:45 with 182 passengers aboard.'
      ]
    },
    {
      id: 8,
      short: '8. Mastery',
      title: 'Full Laptop Rhythm & Ergonomic Speed',
      desc: 'Combine all rows with smooth, even tempo. Aim for 98%+ accuracy rather than rushing bursts.',
      steps: [
        'pack my box with five dozen liquor jugs; the quick brown fox jumps',
        'minimal design removes friction so your thoughts flow onto the screen',
        'Touch typing on a compact laptop keyboard rewards light, rhythmic keystrokes and steady posture.'
      ]
    }
  ];

  const COMMON_WORDS = [
    'the','be','to','of','and','a','in','that','have','it','for','not','on','with','he','as','you','do','at','this',
    'but','his','by','from','they','we','say','her','she','or','an','will','my','one','all','would','there','their','what','so',
    'up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people',
    'into','year','your','good','some','could','them','see','other','than','then','now','look','only','come','its','over','think','also','back',
    'after','use','two','how','our','work','first','well','way','even','new','want','because','any','these','give','day','most','us','system',
    'program','question','work','number','night','point','home','water','room','mother','area','money','story','fact','month','lot','right','study','book','eye',
    'job','word','business','issue','side','kind','head','house','service','friend','father','power','hour','game','line','end','member','law','car','city',
    'community','name','president','team','minute','idea','kid','body','information','nothing','ago','lead','social','understand','whether','watch','together','follow','around','parent',
    'focus','minimal','keyboard','screen','rhythm','practice','steady','motion','clarity','balance','simple','craft','habit','smooth','precise','finger','posture','modern','quiet','design'
  ];

  const SENTENCES_POOL = [
    'Simplicity is about subtracting the obvious and adding the meaningful.',
    'Smooth, accurate keystrokes always beat frantic bursts followed by backspaces.',
    'Keep your shoulders relaxed and let your fingers glide lightly across the home row.',
    'Good design is as little design as possible, leaving only what truly matters.',
    'A steady rhythm turns conscious effort into effortless muscle memory over time.',
    'Focus on accuracy first; speed is simply a natural byproduct of precision.',
    'Every expert typist started by learning where each finger rests without looking down.',
    'Quiet tools let you think clearly and write without visual clutter or distraction.',
    'When your eyes stay on the screen, your mind stays connected to your ideas.',
    'Small daily practice sessions build lasting fluency much faster than rare marathons.'
  ];

  const CODE_POOL = [
    'const sum = items.reduce((acc, item) => acc + item.price, 0);',
    'function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }',
    'export default async function fetchUser(id) { return await api.get(`/users/${id}`); }',
    'const [query, setQuery] = useState(""); const filtered = list.filter(x => x.active);',
    'for (let i = 0; i < matrix.length; i++) { total += matrix[i][i]; }',
    'if (!response.ok) { throw new Error(`HTTP status ${response.status}`); }',
    'document.querySelectorAll(".card").forEach(el => el.classList.toggle("open"));'
  ];

  const NUMBERS_POOL = [
    '192.168.1.1:8080 #404 $1,250.00 (85.4%) [2026-10-18] v3.14.159',
    'Order #9042: 16 units @ $49.95 = $799.20 (Tax: 8.25% | Total: $865.13)',
    'CPU: 3.80GHz | RAM: 16,384MB | Latency: 12.4ms | Uptime: 99.98%',
    'Tel: +1 (555) 234-5678 | Ref: XK-7749-B | Ratio: 16:9 @ 120Hz'
  ];

  // Laptop ANSI Keyboard Layout
  // Finger codes: lp (Left Pinky), lr (Left Ring), lm (Left Middle), li (Left Index), th (Thumb),
  // ri (Right Index), rm (Right Middle), rr (Right Ring), rp (Right Pinky)
  const KEYBOARD_ROWS = [
    [
      { main: '`', shift: '~', finger: 'lp', w: 'w-9' },
      { main: '1', shift: '!', finger: 'lp', w: 'w-9' },
      { main: '2', shift: '@', finger: 'lr', w: 'w-9' },
      { main: '3', shift: '#', finger: 'lm', w: 'w-9' },
      { main: '4', shift: '$', finger: 'li', w: 'w-9' },
      { main: '5', shift: '%', finger: 'li', w: 'w-9' },
      { main: '6', shift: '^', finger: 'ri', w: 'w-9' },
      { main: '7', shift: '&', finger: 'ri', w: 'w-9' },
      { main: '8', shift: '*', finger: 'rm', w: 'w-9' },
      { main: '9', shift: '(', finger: 'rr', w: 'w-9' },
      { main: '0', shift: ')', finger: 'rp', w: 'w-9' },
      { main: '-', shift: '_', finger: 'rp', w: 'w-9' },
      { main: '=', shift: '+', finger: 'rp', w: 'w-9' },
      { main: 'Backspace', label: '⌫', finger: 'rp', w: 'flex-1 min-w-[64px]' }
    ],
    [
      { main: 'Tab', label: 'tab', finger: 'lp', w: 'w-14' },
      { main: 'q', shift: 'Q', finger: 'lp', w: 'w-9' },
      { main: 'w', shift: 'W', finger: 'lr', w: 'w-9' },
      { main: 'e', shift: 'E', finger: 'lm', w: 'w-9' },
      { main: 'r', shift: 'R', finger: 'li', w: 'w-9' },
      { main: 't', shift: 'T', finger: 'li', w: 'w-9' },
      { main: 'y', shift: 'Y', finger: 'ri', w: 'w-9' },
      { main: 'u', shift: 'U', finger: 'ri', w: 'w-9' },
      { main: 'i', shift: 'I', finger: 'rm', w: 'w-9' },
      { main: 'o', shift: 'O', finger: 'rr', w: 'w-9' },
      { main: 'p', shift: 'P', finger: 'rp', w: 'w-9' },
      { main: '[', shift: '{', finger: 'rp', w: 'w-9' },
      { main: ']', shift: '}', finger: 'rp', w: 'w-9' },
      { main: '\\', shift: '|', finger: 'rp', w: 'flex-1 min-w-[44px]' }
    ],
    [
      { main: 'CapsLock', label: 'caps', finger: 'lp', w: 'w-16' },
      { main: 'a', shift: 'A', finger: 'lp', w: 'w-9' },
      { main: 's', shift: 'S', finger: 'lr', w: 'w-9' },
      { main: 'd', shift: 'D', finger: 'lm', w: 'w-9' },
      { main: 'f', shift: 'F', finger: 'li', w: 'w-9', bump: true },
      { main: 'g', shift: 'G', finger: 'li', w: 'w-9' },
      { main: 'h', shift: 'H', finger: 'ri', w: 'w-9' },
      { main: 'j', shift: 'J', finger: 'ri', w: 'w-9', bump: true },
      { main: 'k', shift: 'K', finger: 'rm', w: 'w-9' },
      { main: 'l', shift: 'L', finger: 'rr', w: 'w-9' },
      { main: ';', shift: ':', finger: 'rp', w: 'w-9' },
      { main: '\'', shift: '"', finger: 'rp', w: 'w-9' },
      { main: 'Enter', label: '↵', finger: 'rp', w: 'flex-1 min-w-[68px]' }
    ],
    [
      { main: 'ShiftLeft', label: 'shift', finger: 'lp', w: 'w-20' },
      { main: 'z', shift: 'Z', finger: 'lp', w: 'w-9' },
      { main: 'x', shift: 'X', finger: 'lr', w: 'w-9' },
      { main: 'c', shift: 'C', finger: 'lm', w: 'w-9' },
      { main: 'v', shift: 'V', finger: 'li', w: 'w-9' },
      { main: 'b', shift: 'B', finger: 'li', w: 'w-9' },
      { main: 'n', shift: 'N', finger: 'ri', w: 'w-9' },
      { main: 'm', shift: 'M', finger: 'ri', w: 'w-9' },
      { main: ',', shift: '<', finger: 'rm', w: 'w-9' },
      { main: '.', shift: '>', finger: 'rr', w: 'w-9' },
      { main: '/', shift: '?', finger: 'rp', w: 'w-9' },
      { main: 'ShiftRight', label: 'shift', finger: 'rp', w: 'flex-1 min-w-[82px]' }
    ],
    [
      { main: 'Fn', label: 'fn', finger: 'lp', w: 'w-10' },
      { main: 'Control', label: 'ctrl', finger: 'lp', w: 'w-12' },
      { main: 'Alt', label: 'opt', finger: 'lp', w: 'w-12' },
      { main: 'Meta', label: 'cmd', finger: 'th', w: 'w-14' },
      { main: ' ', label: 'space', finger: 'th', w: 'flex-1 min-w-[210px]' },
      { main: 'MetaRight', label: 'cmd', finger: 'th', w: 'w-14' },
      { main: 'AltRight', label: 'opt', finger: 'rp', w: 'w-12' }
    ]
  ];

  const FINGER_NAMES = {
    lp: 'Left Pinky',
    lr: 'Left Ring',
    lm: 'Left Middle',
    li: 'Left Index',
    th: 'Thumbs (Space)',
    ri: 'Right Index',
    rm: 'Right Middle',
    rr: 'Right Ring',
    rp: 'Right Pinky'
  };

  const FINGER_GUIDE_DETAILS = {
    all: {
      badge: 'Home Row Base Position',
      title: 'All 8 Fingers on Home Row (A S D F · J K L ;)',
      anchor: 'F & J',
      fingerLabel: 'All 8 Fingers + Thumbs',
      desc: 'Place your Left Index on F and Right Index on J — feel the small raised bumps on both keys without looking down. Rest your remaining fingers on A S D (left) and K L ; (right), with both thumbs on the Spacebar.',
      home: 'A S D F · J K L ;',
      top: 'Q W E R T · Y U I O P',
      bottom: 'Z X C V B · N M , . /',
      num: '1–0 · Shift · Space',
      highlightKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', ' ']
    },
    lp: {
      badge: 'Left Hand · Outer Column',
      title: 'Left Pinky Finger — Rests on A',
      anchor: 'A',
      fingerLabel: 'Left Pinky (Pink Zone)',
      desc: 'Your Left Pinky anchors on A. It reaches up to Q and 1, curls down to Z, and controls left-side modifiers (Tab, Caps Lock, and Left Shift when typing right-hand capitals).',
      home: 'A · CapsLock',
      top: 'Q · Tab',
      bottom: 'Z · Left Shift',
      num: '` ~ · 1 !',
      highlightKeys: ['`', '1', 'Tab', 'q', 'CapsLock', 'a', 'ShiftLeft', 'z']
    },
    lr: {
      badge: 'Left Hand · Ring Column',
      title: 'Left Ring Finger — Rests on S',
      anchor: 'S',
      fingerLabel: 'Left Ring (Orange Zone)',
      desc: 'Your Left Ring finger rests lightly on S. Extend straight up-left to press W and 2, or curl down to press X, then return immediately to S.',
      home: 'S',
      top: 'W',
      bottom: 'X',
      num: '2 @',
      highlightKeys: ['2', 'w', 's', 'x']
    },
    lm: {
      badge: 'Left Hand · Middle Column',
      title: 'Left Middle Finger — Rests on D',
      anchor: 'D',
      fingerLabel: 'Left Middle (Yellow Zone)',
      desc: 'Your Left Middle finger rests on D. It reaches up to E (the most frequent vowel in English) and 3, and curls down to C.',
      home: 'D',
      top: 'E',
      bottom: 'C',
      num: '3 #',
      highlightKeys: ['3', 'e', 'd', 'c']
    },
    li: {
      badge: 'Left Hand · Dual Inner Column (Tactile Bump)',
      title: 'Left Index Finger — Rests on F (Covers F & G columns)',
      anchor: 'F •',
      fingerLabel: 'Left Index (Green Zone)',
      desc: 'Feel the tactile ridge on F! Your Left Index is strong and agile—it covers both the F column (R, F, V, 4) and reaches one key inward to the G column (T, G, B, 5) before snapping back to F.',
      home: 'F (bump) · G',
      top: 'R · T',
      bottom: 'V · B',
      num: '4 $ · 5 %',
      highlightKeys: ['4', '5', 'r', 't', 'f', 'g', 'v', 'b']
    },
    th: {
      badge: 'Both Hands · Spacebar',
      title: 'Thumbs — Rest Lightly on the Spacebar',
      anchor: 'Space',
      fingerLabel: 'Thumbs (Spacebar)',
      desc: 'Both thumbs hover directly over the laptop Spacebar. Use whichever thumb feels most natural (most fast typists use their right thumb or alternate) without lifting your index fingers off F and J.',
      home: 'Spacebar',
      top: '—',
      bottom: 'Cmd / Alt (adjacent)',
      num: 'Space between words',
      highlightKeys: [' ', 'Meta', 'MetaRight']
    },
    ri: {
      badge: 'Right Hand · Dual Inner Column (Tactile Bump)',
      title: 'Right Index Finger — Rests on J (Covers J & H columns)',
      anchor: 'J •',
      fingerLabel: 'Right Index (Sky Blue Zone)',
      desc: 'Feel the tactile ridge on J! Like your left index, your Right Index covers two columns: the J column (U, J, M, 7) and one key left to the H column (Y, H, N, 6), always returning to J.',
      home: 'J (bump) · H',
      top: 'U · Y',
      bottom: 'M · N',
      num: '6 ^ · 7 &',
      highlightKeys: ['6', '7', 'y', 'u', 'h', 'j', 'n', 'm']
    },
    rm: {
      badge: 'Right Hand · Middle Column',
      title: 'Right Middle Finger — Rests on K',
      anchor: 'K',
      fingerLabel: 'Right Middle (Indigo Zone)',
      desc: 'Your Right Middle finger rests on K. Extend upward to type I and 8, or curl downward to type the comma (,) and < symbol.',
      home: 'K',
      top: 'I',
      bottom: ', <',
      num: '8 *',
      highlightKeys: ['8', 'i', 'k', ',']
    },
    rr: {
      badge: 'Right Hand · Ring Column',
      title: 'Right Ring Finger — Rests on L',
      anchor: 'L',
      fingerLabel: 'Right Ring (Purple Zone)',
      desc: 'Your Right Ring finger rests on L. Reach upward for O and 9, and curl downward for the period (.) and > symbol.',
      home: 'L',
      top: 'O',
      bottom: '. >',
      num: '9 (',
      highlightKeys: ['9', 'o', 'l', '.']
    },
    rp: {
      badge: 'Right Hand · Outer & Punctuation Columns',
      title: 'Right Pinky Finger — Rests on ; (Covers Punctuation & Enter)',
      anchor: ';',
      fingerLabel: 'Right Pinky (Rose Zone)',
      desc: 'Your Right Pinky rests on semicolon (;) and handles right-edge keys: P, brackets [ ], quotes, slash /, Enter, Backspace, and Right Shift (when capitalizing left-hand letters).',
      home: '; : · quotes · Enter',
      top: 'P · [ { · ] } · |',
      bottom: '/ ? · Right Shift',
      num: '0 ) · - _ · = + · ⌫',
      highlightKeys: ['0', '-', '=', 'Backspace', 'p', '[', ']', '\\', ';', "'", 'Enter', '/', 'ShiftRight']
    }
  };

  // Build char to key info lookup map
  const charToKeyInfo = {};
  KEYBOARD_ROWS.forEach(row => {
    row.forEach(k => {
      charToKeyInfo[k.main] = { keyId: k.main, finger: k.finger, needsShift: false };
      if (k.shift) {
        charToKeyInfo[k.shift] = { keyId: k.main, finger: k.finger, needsShift: true };
      }
    });
  });

  // Export to global window
  global.KeyCraftData = {
    LESSONS,
    COMMON_WORDS,
    SENTENCES_POOL,
    CODE_POOL,
    NUMBERS_POOL,
    KEYBOARD_ROWS,
    FINGER_NAMES,
    FINGER_GUIDE_DETAILS,
    charToKeyInfo
  };
})(typeof window !== 'undefined' ? window : this);
