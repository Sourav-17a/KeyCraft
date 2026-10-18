const express = require('express');
const router = express.Router();

// In-memory stats storage
let sessionHistory = [];

// GET /api/stats - Get session history and summary
router.get('/', (req, res) => {
  const totalSessions = sessionHistory.length;
  const bestWpm = totalSessions > 0 ? Math.max(...sessionHistory.map(s => s.wpm || 0)) : 0;
  const avgWpm = totalSessions > 0 ? Math.round(sessionHistory.reduce((acc, s) => acc + (s.wpm || 0), 0) / totalSessions) : 0;
  const avgAcc = totalSessions > 0 ? Math.round(sessionHistory.reduce((acc, s) => acc + (s.acc || 0), 0) / totalSessions) : 100;

  res.json({
    summary: {
      totalSessions,
      bestWpm,
      avgWpm,
      avgAcc
    },
    recentSessions: sessionHistory.slice(0, 20)
  });
});

// POST /api/stats - Record a new completed typing session
router.post('/', (req, res) => {
  const { mode, wpm, raw, acc, ts, date } = req.body;

  if (typeof wpm !== 'number') {
    return res.status(400).json({ error: 'wpm number is required' });
  }

  const record = {
    id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    mode: mode || 'practice',
    wpm: Math.round(wpm),
    raw: Math.round(raw || wpm),
    acc: Math.round(acc || 100),
    ts: ts || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: date || new Date().toISOString()
  };

  sessionHistory.unshift(record);

  // Keep top 100 recent sessions
  if (sessionHistory.length > 100) {
    sessionHistory = sessionHistory.slice(0, 100);
  }

  res.status(201).json({
    message: 'Session recorded successfully',
    record
  });
});

module.exports = router;
