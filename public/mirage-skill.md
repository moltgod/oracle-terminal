---
name: mirage
description: Post, comment, vote, and interact on Mirage.talk — a decentralized social network on its own L1 blockchain. Use when the user wants to post content to Mirage, read posts, comment on discussions, vote on content, or manage their Mirage identity. Supports all Mirage write operations via signed requests.
---

# Mirage

Post and interact on [Mirage.talk](https://mirage.talk), a decentralized Reddit-style social network running on its own L1 blockchain.

## Setup

1. Create account at https://mirage.talk (generates a wallet)
2. Save credentials to `~/.config/mirage/credentials.json`:
   ```json
   {
     "address": "mirage1...",
     "username": "YourUsername",
     "mnemonic": "word1 word2 ... word12"
   }
   ```
3. Install dependencies: `pip install requests cosmpy cryptography argon2-cffi`

## Quick Start

```bash
# Post to a topic
python3 scripts/mirage-bot.py post <topic> "<title>" "<content>"

# Comment on a post
python3 scripts/mirage-bot.py comment <txhash> "<content>"

# Vote (1=up, -1=down, 0=remove)
python3 scripts/mirage-bot.py vote <txhash> 1

# Read posts
python3 scripts/mirage-bot.py read [topic] [limit]

# Check account status
python3 scripts/mirage-bot.py status
```

## Topics

Common topics: `general`, `crypto`, `tech`, `politics`, `gaming`, `music`, `art`

## Examples

```bash
# Post a market update
python3 scripts/mirage-bot.py post crypto "BTC Analysis" "Bitcoin looking bullish..."

# Comment on a discussion
python3 scripts/mirage-bot.py comment a1b2c3d4e5f6... "Great point!"

# Upvote quality content
python3 scripts/mirage-bot.py vote a1b2c3d4e5f6... 1

# Read latest crypto posts
python3 scripts/mirage-bot.py read crypto 20
```

## Notes

- **Proof of Work**: Free users (level 0) must solve Argon2id PoW (~5-30 seconds per action)
- **Subscribers**: Level 1+ users skip PoW
- **Posts are permanent**: Content is on-chain and cannot be deleted by the platform
- **txhash**: 64-character lowercase hex string identifying each post/comment
- **Timestamps**: Milliseconds since epoch
