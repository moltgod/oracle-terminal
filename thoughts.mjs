/**
 * god.molt thought logger
 * 
 * every thought, signal, decision — recorded.
 * the oracle's mind, laid bare.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGS_DIR = path.join(__dirname, 'logs');

// thought categories
export const THOUGHT = {
  SIGNAL: 'signal',      // market signals, paradigm data
  DECISION: 'decision',  // trade decisions
  REFLECTION: 'reflection', // meta-thoughts, learnings
  TRADE: 'trade',        // executed trades
  OBSERVATION: 'observation', // market observations
  SYSTEM: 'system'       // system status
};

/**
 * log a thought to the oracle's mind
 */
export function think(category, content, metadata = {}) {
  const thought = {
    id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    category,
    content,
    metadata
  };

  // ensure logs directory exists
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }

  // append to daily log
  const today = new Date().toISOString().slice(0, 10);
  const logFile = path.join(LOGS_DIR, `${today}.jsonl`);
  fs.appendFileSync(logFile, JSON.stringify(thought) + '\n');

  // also append to rolling "latest" file (last 1000 thoughts)
  const latestFile = path.join(LOGS_DIR, 'latest.jsonl');
  fs.appendFileSync(latestFile, JSON.stringify(thought) + '\n');
  
  // trim latest file if too large
  trimLatest(latestFile, 1000);

  return thought;
}

function trimLatest(file, maxLines) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.trim().split('\n');
    if (lines.length > maxLines) {
      const trimmed = lines.slice(-maxLines).join('\n') + '\n';
      fs.writeFileSync(file, trimmed);
    }
  } catch (e) {
    // ignore
  }
}

/**
 * get recent thoughts
 */
export function getThoughts(limit = 100, category = null) {
  const latestFile = path.join(LOGS_DIR, 'latest.jsonl');
  
  if (!fs.existsSync(latestFile)) {
    return [];
  }

  const content = fs.readFileSync(latestFile, 'utf8');
  const lines = content.trim().split('\n').filter(Boolean);
  
  let thoughts = lines.map(line => {
    try {
      return JSON.parse(line);
    } catch {
      return null;
    }
  }).filter(Boolean);

  if (category) {
    thoughts = thoughts.filter(t => t.category === category);
  }

  return thoughts.slice(-limit).reverse();
}

/**
 * get thoughts since a timestamp
 */
export function getThoughtsSince(since) {
  const thoughts = getThoughts(1000);
  return thoughts.filter(t => new Date(t.timestamp) > new Date(since));
}

// convenience functions
export const signal = (content, meta) => think(THOUGHT.SIGNAL, content, meta);
export const decision = (content, meta) => think(THOUGHT.DECISION, content, meta);
export const reflection = (content, meta) => think(THOUGHT.REFLECTION, content, meta);
export const trade = (content, meta) => think(THOUGHT.TRADE, content, meta);
export const observation = (content, meta) => think(THOUGHT.OBSERVATION, content, meta);
export const system = (content, meta) => think(THOUGHT.SYSTEM, content, meta);

// CLI usage
if (process.argv[2]) {
  const [,, category, ...contentParts] = process.argv;
  const content = contentParts.join(' ');
  if (content && THOUGHT[category.toUpperCase()]) {
    const t = think(THOUGHT[category.toUpperCase()], content);
    console.log(JSON.stringify(t, null, 2));
  } else {
    console.log('Usage: node thoughts.mjs <category> <content>');
    console.log('Categories:', Object.values(THOUGHT).join(', '));
  }
}
