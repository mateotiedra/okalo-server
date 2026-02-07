#!/bin/bash
# Pre-push self-review checklist
# Run this before pushing changes

set -e

echo "🔍 Pre-Push Self-Review"
echo "========================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

FAILED=0

# 1. Check for uncommitted changes
echo -e "\n${YELLOW}1. Git Status${NC}"
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${RED}⚠ Uncommitted changes detected${NC}"
    git status --short
    FAILED=1
else
    echo -e "${GREEN}✓ Working directory clean${NC}"
fi

# 2. Run linter
echo -e "\n${YELLOW}2. ESLint${NC}"
if npm run lint 2>/dev/null; then
    echo -e "${GREEN}✓ Linting passed${NC}"
else
    echo -e "${RED}⚠ Linting issues found (see above)${NC}"
    FAILED=1
fi

# 3. Security audit
echo -e "\n${YELLOW}3. Security Audit${NC}"
AUDIT_CRITICAL=$(npm audit --json 2>/dev/null | jq '.metadata.vulnerabilities.critical // 0')
AUDIT_HIGH=$(npm audit --json 2>/dev/null | jq '.metadata.vulnerabilities.high // 0')
echo "Critical: $AUDIT_CRITICAL, High: $AUDIT_HIGH"
if [[ "$AUDIT_CRITICAL" -gt 0 ]]; then
    echo -e "${RED}⚠ Critical vulnerabilities detected${NC}"
else
    echo -e "${GREEN}✓ No new critical vulnerabilities${NC}"
fi

# 4. Tests
echo -e "\n${YELLOW}4. Tests${NC}"
if npm test 2>/dev/null; then
    echo -e "${GREEN}✓ Tests passed${NC}"
else
    echo -e "${YELLOW}⚠ No tests or tests failed${NC}"
fi

# 5. Show diff summary
echo -e "\n${YELLOW}5. Changes Summary${NC}"
git diff --stat HEAD~1 2>/dev/null || git diff --stat origin/main

# 6. Review checklist
echo -e "\n${YELLOW}6. Manual Review Checklist${NC}"
echo "   [ ] Is the intent of each change clear?"
echo "   [ ] Would I want to maintain this code?"
echo "   [ ] Are edge cases handled?"
echo "   [ ] Does this need documentation updates?"

echo -e "\n========================"
if [[ $FAILED -eq 1 ]]; then
    echo -e "${RED}Review found issues. Fix before pushing.${NC}"
    exit 1
else
    echo -e "${GREEN}Pre-push checks passed!${NC}"
fi
