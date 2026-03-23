# Internal Linking Graph Audit

## Inventory

1. **`/`** (Homepage)
2. **`/batch`** (Batch Check Tool)

## Connectivity Analysis

- **Homepage -> Batch Check**: `index.vue` links out via
  `<UButton to="/batch">`.
- **Batch Check -> Homepage**: `batch.vue` links out via `<NuxtLink to="/">` (on
  the logomark/title).

## Metrics

- **Orphan pages detected**: `0`
- **Maximum click-depth**: `1`
- **Broken internal links**: `0`

## Result

✅ The application meets strict deterministic graph invariants. No dead ends
exist, meaning crawler pathways are complete and bounded properly within 3
interactions.
