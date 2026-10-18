# KeyCraft ⌨️ — Minimal Laptop Typing Studio

> Master touch typing on compact laptop keyboards with ergonomic guides, tactile audio feedback, live analytics, and interactive deck visualization.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSourav-17a%2FKeyCraft)
![Vercel Ready](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-API-grey?logo=express)

---

## 📂 Project Architecture & Clean Folder Structure

The project has been separated into dedicated directories for readability, easy maintenance, and seamless Vercel deployment:

```text
KeyCraft/
├── frontend/                     # Client-side user interface
│   ├── index.html                # Semantic HTML layout
│   ├── css/
│   │   └── style.css             # Theme palettes, key animations, caret styles
│   └── js/
│       ├── data.js               # Lessons, word pools, keyboard rows & finger maps
│       ├── sound.js              # Web Audio synthesizer & laptop key switch sounds
│       ├── state.js              # State manager, LocalStorage & backend API sync
│       ├── keyboard.js           # Laptop ANSI keyboard deck builder & key highlights
│       ├── engine.js             # Typing engine, real-time WPM, accuracy & canvas chart
│       └── app.js                # UI controls, shortcuts, theme toggles & modals
│
├── backend/                      # Node.js & Express REST API server
│   ├── server.js                 # Express server mounting API routes & static files
│   └── routes/
│       ├── stats.js              # /api/stats endpoint (history, average & best WPM)
│       ├── quotes.js             # /api/quotes endpoint (practice passages by category)
│       └── leaderboard.js        # /api/leaderboard endpoint (high score rankings)
│
├── api/                          # Vercel Serverless Function Bridge
│   └── index.js                  # Direct zero-config serverless handler for /api/*
│
├── vercel.json                   # Vercel routing configuration
├── package.json                  # Dependencies & start scripts
├── .gitignore                    # Git ignore file
└── README.md                     # Documentation
```

---

## ✨ Features

### 🎓 1. Learn Mode (Ergonomic Home Row Mastery)
- **Base Anchor Position**: Tactile ridge guides on **F** and **J** keys.
- **Finger Inspector**: Click any finger to view exact reach zones (Home, Top Row, Bottom Row, Numbers).
- **Interactive Hand Visualizer**: Dual SVG hands displaying resting anchors and column spans.
- **Home Row Anchor Check**: Verify finger placement before typing.
- **Opposite-Hand Shift Rules**: Learn correct capitalization mechanics for fast touch typing.

### ⚡ 2. Practice Mode (Targeted Drills)
- **Row Drills**: 8 progressive curriculum lessons (Home Row, Top Row, Bottom Row, Shift & Caps, Punctuation, Numbers, Mastery).
- **Common Words**: Top English frequency words for rhythm training.
- **Sentences & Quotes**: Wisdom and flow passages.
- **Laptop Code**: Real-world JavaScript / TypeScript syntax drills.
- **Numbers & Symbols**: IP addresses, currency, and punctuation flow.
- **Weak Keys Drill**: Analyzes miss rates and automatically generates custom drills targeting error-prone keys.
- **Custom Text Drawer**: Paste any study text, code snippet, or notes to practice.

### ⏱️ 3. Speed Test Mode
- **Timed Tests**: 15s, 30s, 60s, or 120s sprints.
- **Word Count Tests**: 10, 25, 50, or 100 words.
- **Toggles**: Optional punctuation and numbers modes.

### 📊 4. Real-Time HUD & Analytics
- **Live Metrics**: Net WPM, Raw WPM, Accuracy %, and Keystroke Streak.
- **Ghost Pacemaker Caret**: Configurable target WPM pacing (40, 60, 80, 100 WPM) to develop steady cadence.
- **Timeline Canvas Chart**: Displays smooth Net WPM and Raw WPM curves alongside error dots across time.
- **Miss Heatmap**: Visualizes error frequency directly on the laptop keyboard deck.
- **Analytics Modal**: Tracks daily practice goal (5 minutes), all-time best speed, average accuracy, and recent session history.

### 🔊 5. Web Audio Key Switch Profiles
Tactile laptop key audio synthesized in real time via the Web Audio API (no external sound files required):
- **Scissor Switch**: Ultra-low-travel laptop scissor thock.
- **Tactile Switch**: Crisp, responsive keystrokes.
- **Creamy Switch**: Smooth, deep, muted mechanical tone.
- **Typewriter**: Vintage click and impact sound.

### 🎨 6. Minimal Themes & Caret Styles
- **Themes**: Carbon (Dark), Paper (Light), Sage (Emerald), Nord (Arctic Blue).
- **Caret Styles**: Line (`|`), Block (`█`), Underline (`_`).
- **Font Sizes**: M, L, XL.

---

## 🚀 Deploying to Vercel

### Option 1: Automatic 1-Click Deployment (Recommended)
1. Fork or push this repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Click **Add New Project** and select **KeyCraft**.
4. Click **Deploy**. Vercel will automatically read `vercel.json` and deploy both the **Frontend** and the **Serverless Backend API**!

### Option 2: Deploying via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 💻 Local Development Setup

To run KeyCraft locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sourav-17a/KeyCraft.git
   cd KeyCraft
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the full-stack server:**
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Tab</kbd> + <kbd>Enter</kbd> | Instant Restart Session |
| <kbd>Esc</kbd> | Reset current passage |
| <kbd>Click Arena</kbd> | Focus typing cursor |

---

## 📄 License

MIT © [Sourav-17a](https://github.com/Sourav-17a)
