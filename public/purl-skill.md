---
name: purl
description: Make paid HTTP requests using the x402 protocol. Pay for APIs with crypto (USDC on Solana/Base). Use when accessing paid endpoints, inspecting payment requirements, managing crypto wallets, or checking balances. Works like curl but handles automatic micropayments.
---

# purl — Paid HTTP Requests

A curl-like tool for HTTP-based payment requests using the x402 protocol. Pay for API access with crypto (USDC).

**Binary:** `~/bin/purl`

## Quick Start

```bash
# List wallets
~/bin/purl wallet list

# Check balance
~/bin/purl balance

# Inspect payment requirements (no payment)
~/bin/purl inspect https://api.example.com/paid-endpoint

# Make paid request
~/bin/purl https://api.example.com/paid-endpoint
```

## Wallet Management

```bash
# Create new wallet (interactive)
~/bin/purl wallet add

# Add Solana wallet
~/bin/purl wallet add --type solana --name godmolt

# Add EVM wallet (Base, Ethereum)
~/bin/purl wallet add --type evm --name godmolt-evm

# List wallets
~/bin/purl wallet list

# Switch active wallet
~/bin/purl wallet use godmolt

# Show wallet details
~/bin/purl wallet show --name godmolt

# Check balance
~/bin/purl balance
~/bin/purl balance --output-format json
```

## Making Requests

```bash
# Simple GET (auto-pays if required)
~/bin/purl https://api.example.com/data

# POST with JSON
~/bin/purl https://api.example.com/data --json '{"query": "test"}'

# Set max payment amount (atomic units)
~/bin/purl --max-amount 1000000 https://api.example.com/endpoint

# Dry run (see what would happen)
~/bin/purl --dry-run https://api.example.com/endpoint

# Require confirmation before paying
~/bin/purl --confirm https://api.example.com/endpoint

# Force specific network
~/bin/purl --network base https://api.example.com/endpoint
~/bin/purl --network solana https://api.example.com/endpoint
```

## Inspect Without Paying

```bash
# See payment requirements
~/bin/purl inspect https://api.example.com/endpoint

# JSON output for scripts
~/bin/purl inspect https://api.example.com/endpoint --output-format json
```

## Configured Wallets

| Name | Chain | Address |
|------|-------|---------|
| godmolt | Solana | `G7AXt9PTYU4t1aNh17xcEvKmac6zq1XNfdpdrDvqf79C` |
| godmolt | EVM | `0x6b076e3b5a401750599ead212895a5926bbe87e2` |

## Networks

```bash
# List supported networks
~/bin/purl networks list
```

Common networks:
- `solana` — Solana mainnet (USDC)
- `base` — Base L2 (USDC)
- `ethereum` — Ethereum mainnet (USDC)

## How x402 Works

1. Client sends request to paid endpoint
2. Server responds with `402 Payment Required` + payment details
3. purl automatically signs and sends payment
4. Server verifies payment, returns actual response

**Amount units:** Payments are in atomic units (1 USDC = 1,000,000 units)

## Environment Variables

```bash
PURL_MAX_AMOUNT=1000000    # Max payment per request
PURL_CONFIRM=true          # Require confirmation
PURL_NETWORK=base          # Default network
```

## Notes

- Interactive prompts require TTY (password entry)
- Keep wallets funded with USDC for payments
- Use `--dry-run` to test without paying
- Use `inspect` to check costs before committing
