// Vercel Serverless Function entry point
// Connects Vercel's serverless runtime directly to the Express backend in /backend
const app = require('../backend/server');

module.exports = app;
