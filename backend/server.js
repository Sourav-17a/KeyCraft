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

// Mount API Routes (supports both /api/* and /* for Vercel Serverless & local hosting)
app.use('/api/stats', statsRouter);
app.use('/stats', statsRouter);

app.use('/api/quotes', quotesRouter);
app.use('/quotes', quotesRouter);

app.use('/api/leaderboard', leaderboardRouter);
app.use('/leaderboard', leaderboardRouter);

// Health check endpoint
const healthHandler = (req, res) => {
  res.json({
    status: 'ok',
    app: 'KeyCraft Typing Studio API',
    timestamp: new Date().toISOString()
  });
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Serve static frontend assets for local/standalone hosting
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Fallback to frontend/index.html for any remaining routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start Server when run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`KeyCraft full-stack server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
