# Duplicate Content & Canonicalization Audit

## Detected Patterns

- **Trailing Slashes**: Enforced effectively by Nuxt defaults (no trailing
  slash).
- **Query Parameters**: Not dynamically generating canonical variation. The
  canonical tag consistently references the main route.
- **Pagination**: None used.
- **Dynamic Routes**: None used.
- **HTTP vs HTTPS & WWW vs Root**: Canonical URL strictly set using absolute
  `siteUrl` (`https://favicon-checker.nard.uk`).

## Normalization Implementation

The `useAppSeo` composable handles this:

```typescript
const path = route.path === '/' ? '' : route.path
const absoluteCanonical = options.canonical || `${siteUrl}${path}`
```

## Conclusion

No duplicate canonical URLs remain. All canonical tags point to their absolute
standardized variants.
