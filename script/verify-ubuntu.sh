#!/usr/bin/env bash
set -euo pipefail

cd ~/mashaohu/icscode

echo "==> Cleaning dist and cache"
rm -rf packages/opencode/dist node_modules/.cache

echo "==> Building icscode for Linux x64"
cd packages/opencode
export ICSCODE_VERSION="1.0.0"
export ICSCODE_CHANNEL="dev"
bun run build --single

echo "==> Running icscode"
./dist/icscode-linux-x64/bin/icscode "$@"
