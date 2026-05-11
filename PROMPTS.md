# Prompts

## AI summary generation

### Production prompt
Write a 2-3 sentence personalized audit summary for {companyName} with {teamSize} members spending ${totalMonthlySpend}/month on {toolCount} AI tools. They could save ${estimatedSavings}/month. Be specific, concise, and actionable. No bullet points.

### Why this works
Short and constrained. The model has all the numbers it needs and a clear output format. No bullet points prevents defaulting to list format which reads poorly inline.

### What didn't work
First version asked for a comprehensive analysis — model returned 400+ words with headers. Too long for the UI. Constraining to 2-3 sentences fixed this.

Second version didn't include actual numbers in the prompt — model hallucinated savings figures. Passing exact numbers from the audit engine solved this.

### Fallback template
When the API is unavailable the app falls back to a deterministic template built from the audit data. Zero latency, zero API cost, works offline.

### Model choice
claude-haiku-4-5-20251001 — fastest and cheapest Anthropic model. Summary generation doesn't need reasoning, just coherent prose from structured inputs. Haiku costs ~$0.0004 per summary vs ~$0.015 for Opus — 37x cheaper for equivalent output on this task.
