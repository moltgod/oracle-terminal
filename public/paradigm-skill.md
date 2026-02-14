---
name: paradigm
description: Query Paradigm Predictions for aggregated prediction market data across Polymarket and Kalshi. Get volume by category, week-over-week delta signals, platform comparisons, and top markets. Use when analyzing prediction market trends, finding trading signals, or comparing Polymarket vs Kalshi volumes.
---

# Paradigm Predictions

Query [Paradigm Predictions](https://predictions.paradigm.xyz) — an aggregated view of prediction market volume across Polymarket and Kalshi.

## Quick Start

```bash
# Category summary (7-day volume)
node scripts/paradigm.mjs summary

# Week-over-week delta (SIGNAL)
node scripts/paradigm.mjs delta

# Top 20 markets by volume
node scripts/paradigm.mjs top

# Kalshi vs Polymarket comparison
node scripts/paradigm.mjs compare
```

## Commands

| Command | Description |
|---------|-------------|
| `summary` | Category breakdown of 7-day volume |
| `delta` | Week-over-week % change by category (trading signal) |
| `top` | Top 20 individual markets by volume |
| `compare` | Side-by-side Kalshi vs Polymarket volumes |

## Signal Extraction

**The `delta` command is your primary signal source.**

```bash
node scripts/paradigm.mjs delta
```

Output shows week-over-week volume changes:
- 🔥 **>10% increase** — money flowing IN, attention rising
- 📉 **>10% decrease** — money flowing OUT, attention fading  
- ➡️ **flat** — stable interest

### Trading Doctrine

1. **Follow the flow** — Don't fight category momentum
2. **Size by liquidity** — Big categories = can exit; small = stuck
3. **Trade WITH hot money** — High delta = momentum plays
4. **Watch for rotation** — When one peaks, money flows elsewhere

## API Endpoints

The skill uses these Paradigm API endpoints:

```
POST /api/kalshi-volume
POST /api/polymarket-volume
POST /api/render-merged-treemap
```

All require: `{"startDate":"YYYY-MM-DD","endDate":"YYYY-MM-DD"}`

## Programmatic Usage

```javascript
import { 
  getKalshiVolume, 
  getPolymarketVolume, 
  getMergedTreemap 
} from './scripts/paradigm.mjs';

// Get merged data for last 7 days
const data = await getMergedTreemap('2026-02-06', '2026-02-13');
```

## V/OI Ratio (from Paradigm UI)

When viewing the treemap at predictions.paradigm.xyz:

- **>2.0** — HOT money, active speculation
- **1.0-2.0** — Healthy trading, positions adjusting
- **<0.5** — Conviction holds, waiting for resolution

## Notes

- Paradigm aggregates both Kalshi and Polymarket
- Volume shown is trading volume, not open interest
- Data updates throughout the day
- Use for TIMING signals, not thesis generation
