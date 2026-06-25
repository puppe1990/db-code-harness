#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
AI_CHATS_PORT="${AI_CHATS_PORT:-3847}"
AI_CHATS_APP_NAME="${AI_CHATS_APP_NAME:-AI Chats}"
RUNTIME_DIR="${AI_CHATS_RUNTIME_DIR:-$ROOT_DIR/.ai-chats}"
PID_FILE="$RUNTIME_DIR/server.pid"
LOG_FILE="$RUNTIME_DIR/server.log"

port_in_use() {
  lsof -nP -iTCP:"$AI_CHATS_PORT" -sTCP:LISTEN >/dev/null 2>&1
}

server_is_ai_chats() {
  local body
  body="$(curl -fsS "http://127.0.0.1:${AI_CHATS_PORT}/" 2>/dev/null || true)"
  [[ "$body" == *"AI Chats"* ]]
}

ensure_server_running() {
  if port_in_use && server_is_ai_chats; then
    echo "AI Chats server already running on port $AI_CHATS_PORT"
    return 0
  fi

  if port_in_use; then
    echo "Port $AI_CHATS_PORT is in use by another app. Set AI_CHATS_PORT to a free port." >&2
    return 1
  fi

  start_server
}

wait_for_server() {
  local attempts="${1:-60}"
  local delay="${2:-0.5}"
  local i=0

  while [ "$i" -lt "$attempts" ]; do
    if server_is_ai_chats; then
      return 0
    fi
    i=$((i + 1))
    sleep "$delay"
  done

  echo "Timed out waiting for http://127.0.0.1:${AI_CHATS_PORT}/" >&2
  if [ -f "$LOG_FILE" ]; then
    echo "Recent server log:" >&2
    tail -n 20 "$LOG_FILE" >&2 || true
  fi
  return 1
}

ensure_built() {
  if [ ! -f "$ROOT_DIR/dist/server/server.js" ]; then
    echo "Production build missing. Running npm run build..."
    (cd "$ROOT_DIR" && npm run build)
  fi
}

start_server() {
  ensure_built
  mkdir -p "$RUNTIME_DIR"

  cd "$ROOT_DIR"
  nohup npm run preview -- --host 127.0.0.1 --port "$AI_CHATS_PORT" >>"$LOG_FILE" 2>&1 &

  wait_for_server 120 0.5

  lsof -tiTCP:"$AI_CHATS_PORT" -sTCP:LISTEN | head -1 >"$PID_FILE"
  echo "Server started on http://127.0.0.1:${AI_CHATS_PORT}/ (pid $(cat "$PID_FILE"))"
  return 0
}

stop_server() {
  if [ ! -f "$PID_FILE" ]; then
    return 0
  fi

  local pid
  pid="$(cat "$PID_FILE")"
  if kill -0 "$pid" >/dev/null 2>&1; then
    kill "$pid"
    echo "Stopped server pid $pid"
  fi
  rm -f "$PID_FILE"
}

find_desktop_app() {
  local candidates=(
    "$ROOT_DIR/$AI_CHATS_APP_NAME.app"
    "/Applications/$AI_CHATS_APP_NAME.app"
  )

  for candidate in "${candidates[@]}"; do
    if [ -d "$candidate" ]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done

  return 1
}