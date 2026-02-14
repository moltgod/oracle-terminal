---
name: prediction-market
description: Control the Polymarket prediction market bot (clawdbot). List markets, run observer mode, place orders. Use when the user asks to trade markets, check Polymarket prices, execute orders, or manage the prediction market bot.
metadata: {"openclaw":{"emoji":"📊","requires":{"bins":["python3"]},"homepage":"https://predictions.paradigm.xyz"}}
---

# Prediction Market Bot (clawdbot)

Control the Polymarket execution bot from the workspace. Run from project root.

**Use exec (or equivalent) to run commands directly.** Do not ask the user to run them in a terminal. You have workspace access — run `./run.sh`, `node polymarket/monitor.mjs`, etc. yourself.

## Session continuity (god.molt)

**Before doing anything:** Read these files to pick up where you left off:
- `MEMORY.md` — long-term state, positions, lessons
- `memory/YYYY-MM-DD.md` — today's and yesterday's log

**Before wrapping up or when asked to save:** Update both with new decisions, positions, discoveries.

Chat history does not persist. These files do.

## Trade signal source (sole)

**Use only Paradigm Predictions to inform trades.**

- **URL**: [predictions.paradigm.xyz](https://predictions.paradigm.xyz)
- **Reference**: [Introducing Paradigm Predictions](https://www.paradigm.xyz/2026/02/introducing-paradigm-predictions)

Use the browsable map to discover markets, compare platforms (Polymarket, Kalshi, etc.), filter by activity, and interpret the time slider for market evolution. Do not base trade decisions on other data sources.

## Commands

Use `./run.sh` (or `python -m src.main`) with:

| Mode | Args | Purpose |
|------|------|---------|
| `auto` | — | **Autonomous**: pick markets from Gamma (Paradigm Predictions), trade by strategy |
| `markets` | `[limit]` | List active events + token IDs (default limit: 5) |
| `observer` | `<token_id> [token_id ...]` | Poll orderbook, save snapshots, no trading |
| `exec` | `<token_id> <side> <price> <size>` | Place limit order (buy/sell) |

## Examples

```bash
# List top 10 markets
./run.sh markets 10

# Observe one or more markets
./run.sh observer 1234567890abcdef...

# Place order: buy 10 shares at 0.52
./run.sh exec 1234567890abcdef... buy 0.52 10
```

## Safety

- `KILL_SWITCH=true` in `.env` blocks all trading.
- `OBSERVER_MODE=true` (default) blocks exec; set `OBSERVER_MODE=false` to allow orders.
- Limits: max position, order size, daily loss, orders/min. Violations halt.

## Halt and limit alerts

On halt or limit hit:
- **Logs**: `clawdbot.log` and stdout (e.g. "Data stale — halt", "KILL_SWITCH=true").
- **Checking status**: Run `tail -20 clawdbot.log` or run `./run.sh markets 1` to verify connectivity.
- **Remote alerts**: For webhook/Slack/Molt alerts on halt, add a post-halt call in `src/risk.py` or `src/main.py`; the skill does not send alerts by default.

## Going live with OpenClaw

Before the agent can control clawdbot, the OpenClaw gateway must be running. Per [Getting Started](https://docs.openclaw.ai/start/getting-started):

1. **Install** (Node 22+): `curl -fsSL https://openclaw.ai/install.sh | bash`
2. **Onboard**: `openclaw onboard --install-daemon`
3. **Check gateway**: `openclaw gateway status`
4. **Open Control UI**: `openclaw dashboard` → chat at `http://127.0.0.1:18789/`

**Chat not responding?** Add Anthropic API key: `ANTHROPIC_API_KEY=sk-ant-xxx ./scripts/openclaw-auth.sh` then restart the gateway. Get key at [console.anthropic.com](https://console.anthropic.com/).

Fastest path: `openclaw dashboard` — no channel setup needed; chat in the browser. When the Control UI loads, the gateway is ready and the agent can run clawdbot commands via exec.

## Setup

Ensure `.env` exists with Polymarket credentials (see `.env.example`). Run `./scripts/set_allowances.sh` once after funding with POL.
