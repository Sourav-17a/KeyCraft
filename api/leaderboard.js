// Vercel Serverless Function: /api/leaderboard
let leaderboard = [
  { rank: 1, name: 'TypingMaster', wpm: 114, accuracy: 99, mode: 'Speed Test 60s' },
  { rank: 2, name: 'KeyCraftPro', wpm: 98, accuracy: 98, mode: 'Speed Test 30s' },
  { rank: 3, name: 'HomeRowNinja', wpm: 87, accuracy: 100, mode: 'Speed Test 60s' },
  { rank: 4, name: 'SwiftKeys', wpm: 76, accuracy: 97, mode: 'Speed Test 15s' },
  { rank: 5, name: 'ErgoLaptop', wpm: 68, accuracy: 98, mode: 'Practice (Words)' }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      leaderboard: leaderboard.slice(0, 10)
    });
  }

  if (req.method === 'POST') {
    const { name, wpm, accuracy, mode } = req.body || {};

    if (!wpm) {
      return res.status(400).json({ error: 'wpm is required' });
    }

    const newEntry = {
      name: (name || 'Anonymous Typist').trim().slice(0, 20),
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy || 100),
      mode: mode || 'Speed Test'
    };

    leaderboard.push(newEntry);
    leaderboard.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);
    leaderboard = leaderboard.slice(0, 50).map((item, idx) => ({
      rank: idx + 1,
      ...item
    }));

    return res.status(201).json({
      message: 'Score submitted to leaderboard',
      entry: newEntry
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
