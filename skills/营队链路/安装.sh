#!/usr/bin/env bash
# 把营队链路三个 skill 安装到 ~/.claude/skills/
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
DEST="$HOME/.claude/skills"
mkdir -p "$DEST"
for s in prd-master design-master tdd-master; do
  echo "安装 $s ..."
  rm -rf "$DEST/$s"
  cp -R "$HERE/$s" "$DEST/$s"
done
echo "完成。三个 skill 已装到 $DEST"
echo "在 Claude Code 里说「做prd」即可触发链路第一步。"
