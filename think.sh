#!/bin/bash
# Quick thought logger for god.molt
# Usage: ./think.sh <category> <thought>
# Categories: signal, decision, reflection, trade, observation, system

cd "$(dirname "$0")"
node thoughts.mjs "$@"
