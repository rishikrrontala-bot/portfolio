#!/usr/bin/env bash
# ---------------------------------------------------------------------------
#  Puts this site on GitHub and turns on GitHub Pages.
#
#      ./deploy.sh                                  # easiest — uses the GitHub CLI
#      ./deploy.sh https://github.com/you/portfolio # if you made the repo yourself
#
#  This script never asks you for a password or a token. GitHub's own login
#  flow does that, in your browser.
# ---------------------------------------------------------------------------
set -euo pipefail

cd "$(dirname "$0")"

bold() { printf '\n\033[1m→ %s\033[0m\n' "$1"; }
warn() { printf '\033[33m   %s\033[0m\n' "$1"; }
die()  { printf '\n\033[31m✗ %s\033[0m\n\n' "$1" >&2; exit 1; }

command -v git >/dev/null || die "git is missing. Install it with: xcode-select --install"

bold "Preparing the repository"
[ -d .git ] || git init -q
git add -A
git diff --cached --quiet 2>/dev/null || git commit -q -m "Portfolio site"
git branch -M main
echo "   ready"

ARG="${1:-}"

# ---------------------------------------------------------------------------
#  Path A — the GitHub CLI is installed: create the repo, push, enable Pages.
# ---------------------------------------------------------------------------
if command -v gh >/dev/null && [[ "$ARG" != http* ]]; then
  REPO="${ARG:-portfolio}"

  bold "Checking your GitHub login"
  gh auth status >/dev/null 2>&1 || gh auth login
  OWNER="$(gh api user --jq .login)"
  echo "   signed in as $OWNER"

  if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
    bold "Pushing to the existing $OWNER/$REPO"
    git remote get-url origin >/dev/null 2>&1 \
      || git remote add origin "https://github.com/$OWNER/$REPO.git"
    git push -u origin main
  else
    bold "Creating github.com/$OWNER/$REPO"
    gh repo create "$REPO" --public --source=. --remote=origin --push \
      --description "Portfolio — computer science & AI."
  fi

  bold "Turning on GitHub Pages"
  # build_type=workflow publishes what .github/workflows/deploy.yml uploads,
  # rather than serving the raw repository files.
  gh api -X POST "repos/$OWNER/$REPO/pages" -f build_type=workflow >/dev/null 2>&1 \
    || gh api -X PUT "repos/$OWNER/$REPO/pages" -f build_type=workflow >/dev/null 2>&1 \
    || warn "Could not switch Pages on automatically — do it under Settings → Pages → Source: GitHub Actions."
  gh api -X PATCH "repos/$OWNER/$REPO" \
    -f homepage="https://$OWNER.github.io/$REPO/" >/dev/null 2>&1 || true

  cat <<EOF

────────────────────────────────────────────────────────────
 Pushed to github.com/$OWNER/$REPO

 It is building itself now — the first deploy takes ~2 min.
   watch it:  gh run watch
   then open: https://$OWNER.github.io/$REPO/

 Every future 'git push' redeploys it automatically.
────────────────────────────────────────────────────────────

EOF
  exit 0
fi

# ---------------------------------------------------------------------------
#  Path B — no GitHub CLI: push to a repo you create in the browser.
# ---------------------------------------------------------------------------
if [[ "$ARG" != http* ]]; then
  cat <<'EOF'

The GitHub CLI is not installed, so do this instead:

  1. Open  https://github.com/new
  2. Name it  portfolio, set it to Public, and create it
     — do NOT tick "Add a README"; the repo must start empty.
  3. Copy the URL of the new repo and run:

       ./deploy.sh https://github.com/<you>/portfolio

(Or install the CLI once — brew install gh — and just run ./deploy.sh.)

EOF
  exit 1
fi

REMOTE="${ARG%.git}.git"
bold "Pushing to $REMOTE"
warn "GitHub will ask you to sign in — that happens in your browser, not here."
git remote get-url origin >/dev/null 2>&1 && git remote set-url origin "$REMOTE" \
  || git remote add origin "$REMOTE"
git push -u origin main

SLUG="$(printf '%s' "$ARG" | sed -E 's#^https?://github.com/##; s#\.git$##')"
OWNER="${SLUG%%/*}"
REPO="${SLUG##*/}"

cat <<EOF

────────────────────────────────────────────────────────────
 Pushed to github.com/$SLUG

 One manual step left — turn Pages on:
   $ARG/settings/pages  →  Source: "GitHub Actions"  →  Save

 The workflow then builds it (~2 min) and the site is at
   https://$OWNER.github.io/$REPO/

 Every future 'git push' redeploys it automatically.
────────────────────────────────────────────────────────────

EOF
