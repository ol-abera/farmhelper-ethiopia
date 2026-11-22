#!/bin/sh
set -e
url="${1:-http://ai:8000/health}"
until wget -qO- "$url" >/dev/null 2>&1; do
  sleep 1
done
