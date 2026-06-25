#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/runtime.sh
source "$SCRIPT_DIR/lib/runtime.sh"

if ! app_path="$(find_desktop_app)"; then
  echo "Desktop app not found. Run: npm run pake:build" >&2
  exit 1
fi

ensure_server_running

echo "Opening $app_path"
open "$app_path"