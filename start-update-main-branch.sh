#!/bin/bash

SOURCE_PATH='/workspaces/gemini-cli'
TARGET_PATH='/workspaces/main'

cd $SOURCE_PATH

if [ ! -d "$TARGET_PATH" ]; then
    git worktree add -f $TARGET_PATH origin/main
fi

cd $TARGET_PATH

git reset --hard
git clean -fdx

git pull upstream main
git push origin

cd $SOURCE_PATH

if [ -d "$TARGET_PATH" ]; then
    git worktree remove -f $TARGET_PATH
fi
