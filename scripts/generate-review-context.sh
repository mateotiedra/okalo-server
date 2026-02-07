#!/bin/bash
# Generate context for AI code review
# Output: markdown file with all changes and relevant context

OUTPUT_FILE="${1:-review-context.md}"

echo "# Code Review Context" > "$OUTPUT_FILE"
echo "Generated: $(date -Iseconds)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Git status
echo "## Changes Summary" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"
git diff --stat HEAD~1 2>/dev/null || git diff --stat origin/main 2>/dev/null || git status --short
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Full diff
echo "## Full Diff" >> "$OUTPUT_FILE"
echo '```diff' >> "$OUTPUT_FILE"
git diff HEAD~1 2>/dev/null || git diff origin/main 2>/dev/null || git diff
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Lint output
echo "## Lint Results" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"
npm run lint 2>&1 || echo "No lint script"
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Recent commits
echo "## Recent Commits" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"
git log --oneline -5
echo '```' >> "$OUTPUT_FILE"

echo "Review context written to $OUTPUT_FILE"
