const express = require('express');
const router = express.Router();

const QUOTES_DATABASE = {
  sentences: [
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
  ],
  code: [
    'const sum = items.reduce((acc, item) => acc + item.price, 0);',
    'function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }',
    'export default async function fetchUser(id) { return await api.get(`/users/${id}`); }',
    'const [query, setQuery] = useState(""); const filtered = list.filter(x => x.active);',
    'for (let i = 0; i < matrix.length; i++) { total += matrix[i][i]; }',
    'if (!response.ok) { throw new Error(`HTTP status ${response.status}`); }',
    'document.querySelectorAll(".card").forEach(el => el.classList.toggle("open"));'
  ],
  numbers: [
    '192.168.1.1:8080 #404 $1,250.00 (85.4%) [2026-10-18] v3.14.159',
    'Order #9042: 16 units @ $49.95 = $799.20 (Tax: 8.25% | Total: $865.13)',
    'CPU: 3.80GHz | RAM: 16,384MB | Latency: 12.4ms | Uptime: 99.98%',
    'Tel: +1 (555) 234-5678 | Ref: XK-7749-B | Ratio: 16:9 @ 120Hz'
  ]
};

// GET /api/quotes - Fetch random quotes or by category
router.get('/', (req, res) => {
  const category = (req.query.category || 'all').toLowerCase();
  let pool = [];

  if (category === 'code') {
    pool = QUOTES_DATABASE.code;
  } else if (category === 'numbers') {
    pool = QUOTES_DATABASE.numbers;
  } else if (category === 'sentences') {
    pool = QUOTES_DATABASE.sentences;
  } else {
    pool = [
      ...QUOTES_DATABASE.sentences,
      ...QUOTES_DATABASE.code,
      ...QUOTES_DATABASE.numbers
    ];
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  res.json({
    category,
    quote: pool[randomIndex],
    totalAvailable: pool.length
  });
});

module.exports = router;
