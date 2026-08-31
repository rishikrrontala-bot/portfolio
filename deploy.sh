#!/usr/bin/env bash
# ---------------------------------------------------------------------------
#  One command: create the GitHub repo, push this project, and turn on Pages.
#
#      ./deploy.sh                  # repo name defaults to "portfolio"
#      ./deploy.sh my-site          # or name it yourself
#
#  Needs the GitHub CLI. If you do not have it:  brew install gh
#  The first run opens a browser to log you in — this script never handles
#  your password or token itself.
# ---------------------------------------------------------------------------
set -euo pipefail

REPO="${1:-portfolio}"
cd "$(dirname "$0")"

step() { printf '\n\033[1m→ %s\033[0m\n' "$1"; }
die()  { printf '\n\033[31m✗ %s\033[0m\n' "$1" >&2; exit 1; }

command -v git >/dev/null || die "git is not installed. Install Xcode command line tools: xcode-select --install"
command -v gh  >/dev/null || die "The GitHub CLI is not installed. Run: brew install gh"

step "Checking your GitHub login"
gh auth status >/dev/null 2>&1 || gh auth login

OWNER="$(gh api user --jq .login)"
echo "  signed in as $OWNER"

step "Preparing the repository"
[ -d .git ] || git init -q
git add -A
git diff --cached --quiet || git commit -q -m "Portfolio site"
git branch -M main

if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  echo "  $OWNER/$REPO already exists — pushing to it"
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$OWNER/$REPO.git"
  git push -u origin main
else
  step "Creating github.com/$OWNER/$REPO"
  gh repo create "$REPO" --public --source=. --remote=origin --push \
    --description "Portfolio — computer science & AI."
fi

step "Turning on GitHub Pages"
# build_type=workflow tells Pages to publish whatever .github/workflows/deploy.yml
# uploads, instead of serving the raw repository.
gh api -X POST "repos/$OWNER/$REPO/pages" -f build_type=workflow >/dev/null 2>&1 \
  || gh api -X PUT "repos/$OWNER/$REPO/pages" -f build_type=workflow >/dev/null 2>&1 \
  || echo "  (Pages may already be on — check Settings → Pages)"

gh api -X PATCH "repos/$OWNER/$REPO" -f homepage="https://$OWNER.github.io/$REPO/" >/dev/null 2>&1 || true

cat <<EOF

────────────────────────────────────────────────────────────
 Pushed.  github.com/$OWNER/$REPO

 The site builds itself now — first deploy takes ~2 minutes.
 Watch it:   gh run watch
 Then open:  https://$OWNER.github.io/$REPO/

 Every future 'git push' redeploys automatically.
────────────────────────────────────────────────────────────
EOF
