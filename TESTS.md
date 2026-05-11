# Tests

## Running tests

```bash
cd apps/api
pnpm test
```

## Test coverage

### `apps/api/src/services/audit.service.test.ts`

| Test | What it covers |
|------|----------------|
| ChatGPT Team overspend | Detects Team plan overkill for ≤2 users |
| Cursor Business overspend | Detects Business plan expensive for small teams |
| Zero savings for appropriate plans | Enterprise for 50 users returns 0 savings |
| Total spend calculation | Correctly sums multiple subscriptions |
| Unknown tool handling | Gracefully handles tools not in engine |
| Multiple tools | Correctly processes 3+ tools |

All 6 tests pass. CI runs them on every push to main.
