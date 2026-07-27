#!/usr/bin/env bash
set -e
cd /mnt/d/confidential-supply-chain

git config user.name "tulippp2004"
git config user.email "shreyaadas777@gmail.com"

export FILTER_BRANCH_SQUELCH_WARNING=1

git filter-branch --force --env-filter '
GIT_AUTHOR_NAME="tulippp2004"
GIT_AUTHOR_EMAIL="shreyaadas777@gmail.com"
GIT_COMMITTER_NAME="tulippp2004"
GIT_COMMITTER_EMAIL="shreyaadas777@gmail.com"
' HEAD

echo "Re-authoring completed."
