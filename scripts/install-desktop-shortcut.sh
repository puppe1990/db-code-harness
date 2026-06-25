#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/runtime.sh
source "$SCRIPT_DIR/lib/runtime.sh"

DESKTOP_DIR="${AI_CHATS_DESKTOP_DIR:-$HOME/Desktop}"
SHORTCUT_NAME="${AI_CHATS_SHORTCUT_NAME:-AI Chats}"
COMMAND_PATH="$DESKTOP_DIR/${SHORTCUT_NAME}.command"
APP_LINK_PATH="$DESKTOP_DIR/${AI_CHATS_APP_NAME}.app"

mkdir -p "$DESKTOP_DIR"

cat >"$COMMAND_PATH" <<EOF
#!/bin/bash
cd "$ROOT_DIR"
exec bash scripts/launch-desktop.sh
EOF
chmod +x "$COMMAND_PATH"

if [ -d "$ROOT_DIR/$AI_CHATS_APP_NAME.app" ]; then
  ln -sfn "$ROOT_DIR/$AI_CHATS_APP_NAME.app" "$APP_LINK_PATH"
  echo "App shortcut: $APP_LINK_PATH"
else
  echo "App bundle not found yet. Run: npm run pake:build"
fi

echo "Launcher shortcut: $COMMAND_PATH"
echo "Double-click the .command file to start the server and open AI Chats."