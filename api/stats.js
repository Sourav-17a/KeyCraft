// Vercel Serverless Function: /api/stats
let sessionHistory = [];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const totalSessions = sessionHistory.length;
    const bestWpm = totalSessions > 0 ? Math.max(...sessionHistory.map(s => s.wpm || 0)) : 0;
    const avgWpm = totalSessions > 0 ? Math.round(sessionHistory.reduce((acc, s) => acc + (s.wpm || 0), 0) / totalSessions) : 0;
    const avgAcc = totalSessions > 0 ? Math.round(sessionHistory.reduce((acc, s) => acc + (s.acc || 0), 0) / totalSessions) : 100;

    return res.status(200).json({
      summary: {
        totalSessions,
        bestWpm,
        avgWpm,
        avgAcc
      },
      recentSessions: sessionHistory.slice(0, 20)
    });
  }

  if (req.method === 'POST') {
    const { mode, wpm, raw, acc, ts, date } = req.body || {};

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
    if (sessionHistory.length > 100) {
      sessionHistory = sessionHistory.slice(0, 100);
    }

    return res.status(201).json({
      message: 'Session recorded successfully',
      record
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
