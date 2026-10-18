const express = require('express');
const cors = require('cors');
const path = require('path');

const statsRouter = require('./routes/stats');
const quotesRouter = require('./routes/quotes');
const leaderboardRouter = require('./routes/leaderboard');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/stats', statsRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/leaderboard', leaderboardRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'KeyCraft Typing Studio API',
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend assets
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Fallback to frontend/index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`KeyCraft full-stack server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
