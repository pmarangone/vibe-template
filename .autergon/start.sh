#!/usr/bin/env bash
# Build and serve the app. Safe to rerun: running services are left alone.
# Used by both the agent and the Start app button. Returns once web answers.
set -euo pipefail
cd "$(dirname "$0")/.."

WEB_PORT="${WEB_PORT:-3000}"
API_PORT="${API_PORT:-4000}"
READY_SECONDS="${READY_SECONDS:-60}"

port_open() { (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null; }

serve() { # name port filter
  if port_open "$2"; then
    echo "$1 already on port $2"
    return
  fi
  pnpm --filter "$3" start > "/tmp/$1.log" 2>&1 < /dev/null &
  echo $! > "/tmp/$1.pid"
}

if port_open "$WEB_PORT" && port_open "$API_PORT"; then
  echo "app already serving"
  exit 0
fi

[ -d node_modules ] || pnpm install --frozen-lockfile
pnpm build
serve vibe-api "$API_PORT" vibe-api
serve vibe-web "$WEB_PORT" vibe-web

for _ in $(seq "$READY_SECONDS"); do
  if port_open "$WEB_PORT" && port_open "$API_PORT"; then
    echo "app ready on port $WEB_PORT"
    exit 0
  fi
  sleep 1
done
echo "app not ready after ${READY_SECONDS}s, see /tmp/vibe-web.log and /tmp/vibe-api.log" >&2
exit 1
