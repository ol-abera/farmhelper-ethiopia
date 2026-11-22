#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm run prisma:generate
npx --workspace backend prisma db push --accept-data-loss
npm run prisma:seed
