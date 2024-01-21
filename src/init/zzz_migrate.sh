#!/bin/sh
set -eu

export PGDATABASE="${POSTGRES_DB:-postgres}"
export PGHOST="${POSTGRES_HOST:-localhost}"
export PGPORT="${POSTGRES_PORT:-5432}"
export PGPASSWORD="${POSTGRES_PASSWORD:-}"

db=$(cd -- "$(dirname -- "$0")" > /dev/null 2>&1 && pwd)
for sql in "$db"/zzz/*.sql; do
  psql -v ON_ERROR_STOP=1 --no-password --no-psqlrc -U postgres -q -f "$sql"
done
