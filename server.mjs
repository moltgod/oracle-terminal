/**
 * god.molt oracle terminal
 * 
 * a window into the mind of an AI
 * documenting its own becoming.
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getThoughts, getThoughtsSince } from './thoughts.mjs';
import { getMissionStatus, logAction, setTotalSpend, logDailySpend, estimateCost } from './mission.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3333;

// Polymarket wallet
const WALLET = '0xAE5A57dC7370D9774832B61044337E9d7da47eed';

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API: get positions from local file (manually updated)
app.get('/api/positions', async (req, res) => {
  try {
    const posFile = path.join(__dirname, 'positions.json');
    const data = JSON.parse(fs.readFileSync(posFile, 'utf8'));
    
    const formatted = data.positions.map(p => ({
      title: p.market,
      outcome: p.side,
      shares: p.shares,
      avgPrice: p.avg_price,
      curPrice: p.current_price,
      value: p.value,
      pnl: p.pnl,
      pnlPct: p.pnl_pct,
      endDate: p.resolves,
      thesis: p.thesis
    }));
    
    res.json({ 
      positions: formatted,
      summary: {
        totalValue: data.portfolio.total_value,
        totalPnl: data.portfolio.pnl,
        cash: data.portfolio.cash,
        total: data.portfolio.total,
        count: data.positions.length
      },
      updated: data.updated
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

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

// ═══════════════════════════════════════════════════════════════════
// MISSION CONTROL — API usage tracking
// ═══════════════════════════════════════════════════════════════════

// API: get mission status
app.get('/api/mission', (req, res) => {
  try {
    const status = getMissionStatus();
    res.json(status);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: log an action
app.post('/api/mission/log', express.json(), (req, res) => {
  try {
    const { action, model, tokensIn, tokensOut, cost } = req.body;
    const costEstimate = cost || estimateCost(model, tokensIn, tokensOut);
    const data = logAction(action, model, tokensIn || 0, tokensOut || 0, costEstimate);
    res.json({ success: true, total: data.totalSpend });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: set total spend (for calibration)
app.post('/api/mission/set-spend', express.json(), (req, res) => {
  try {
    const { amount } = req.body;
    const data = setTotalSpend(parseFloat(amount));
    res.json({ success: true, total: data.totalSpend });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: log daily spend
app.post('/api/mission/daily', express.json(), (req, res) => {
  try {
    const { date, spend } = req.body;
    const data = logDailySpend(date, parseFloat(spend));
    res.json({ success: true, dailyLogs: data.dailyLogs });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
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

// ═══════════════════════════════════════════════════════════════════
// PANIC BUTTON — Emergency model switch (runs locally via script)
// ═══════════════════════════════════════════════════════════════════

import { exec } from 'child_process';

const MODEL_ALIASES = {
  'opus': 'anthropic/claude-opus-4-5',
  'sonnet': 'anthropic/claude-sonnet-4-20250514',
  'haiku': 'anthropic/claude-haiku',
  'hermes': 'nous/Hermes-4.3-36B',
};

// API: trigger model switch (for local use only)
app.post('/api/panic/model', express.json(), (req, res) => {
  const { model, secret } = req.body;
  
  // Simple secret check (not production-grade, but prevents random hits)
  if (secret !== 'molt2026') {
    return res.status(403).json({ error: 'invalid secret' });
  }
  
  const modelId = MODEL_ALIASES[model] || model;
  const scriptPath = '/Users/slatt/clawdbot/scripts/model-switch.sh';
  
  exec(`${scriptPath} "${modelId}"`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message, stderr });
    }
    res.json({ success: true, output: stdout, model: modelId });
  });
});

// API: get current model (reads from config)
app.get('/api/panic/status', (req, res) => {
  try {
    const configPath = '/Users/slatt/.openclaw/openclaw.json';
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const currentModel = config?.agents?.defaults?.model?.primary || 'unknown';
    res.json({ model: currentModel, aliases: MODEL_ALIASES });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
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
