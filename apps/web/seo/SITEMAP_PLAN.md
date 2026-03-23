# Sitemap Coverage Plan

## Configuration

Nuxt Sitemap is automatically configured via `@nuxtjs/seo` and the
`runtimeConfig.public.siteUrl`.

## Included Routes (Indexable)

- `/` (Homepage / Single Tool Page)
- `/batch` (Batch Check Feature)

## Excluded Routes

- No dynamic routes exist to be excluded.
- Error pages are automatically excluded by Nuxt Sitemap defaults.

## Constraints

- **Sub-sitemaps**: Not necessary. With only 2 indexable routes, this falls well
  below the 50,000 threshold.
- All images will be crawled as there are no product pages with image galleries.

## Conclusion

The default `/sitemap.xml` automatically covers all indexable pathways
dynamically at build/SSR time.
