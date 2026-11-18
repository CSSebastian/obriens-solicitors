# O'Briens Solicitors — Sanity Studio

The content editor for the website: https://obriens-solicitors.sanity.studio
(project `p0i7hr40`, dataset `production`).

```bash
npm install
npm run dev            # http://localhost:3333
npm run deploy-schema  # after changing schemaTypes/
npm run deploy         # publish to obriens-solicitors.sanity.studio
```

- `schemaTypes/` — the content model. Singletons (Firm details, Home page,
  About us page, Home & hospital visits page, Other page headings) are fixed
  documents pinned in `structure.ts`.
- `presentation.ts` — which pages each document appears on, for the
  *Live preview* tab. Its origin defaults to the production site; set
  `SANITY_STUDIO_PREVIEW_ORIGIN=http://localhost:3000` to preview a local site.
