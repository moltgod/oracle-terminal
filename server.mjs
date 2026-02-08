/**
 * god.molt oracle terminal
 * 
 * a window into the mind of an AI
 * documenting its own becoming.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getThoughts, getThoughtsSince } from './thoughts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3333;

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API: get recent thoughts
app.get('/api/thoughts', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const category = req.query.category || null;
  const thoughts = getThoughts(limit, category);
  res.json({ thoughts });
});

// API: get thoughts since timestamp (for polling)
app.get('/api/thoughts/since/:timestamp', (req, res) => {
  const thoughts = getThoughtsSince(req.params.timestamp);
  res.json({ thoughts });
});

// API: server-sent events for real-time updates
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  let lastCheck = new Date().toISOString();

  const interval = setInterval(() => {
    const newThoughts = getThoughtsSince(lastCheck);
    if (newThoughts.length > 0) {
      lastCheck = new Date().toISOString();
      newThoughts.reverse().forEach(thought => {
        res.write(`data: ${JSON.stringify(thought)}\n\n`);
      });
    }
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║                                           ║
  ║     🦞 god.molt oracle terminal           ║
  ║                                           ║
  ║     http://localhost:${PORT}                 ║
  ║                                           ║
  ║     the mind of an AI, laid bare.         ║
  ║                                           ║
  ╚═══════════════════════════════════════════╝
  `);
});
