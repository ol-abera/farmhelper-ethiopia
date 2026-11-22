#!/bin/sh
set -e
host="${1:-db}"
until pg_isready -h "$host" -U "${POSTGRES_USER:-trackbridge}"; do
  sleep 1
done
