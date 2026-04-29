# WWII Music Atlas

An interactive Vue 3 atlas exploring World War II-era music, broadcasts, cultural sources, and historical events through a globe interface and curated archival references.

## Development

```sh
npm install
npm run dev
```

## Checks

```sh
npm test
npm run build
```

## GitHub Pages

The repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`. On each push to `main`, it builds the Vite app, prepares the SPA fallback (`404.html`), and deploys `dist` to GitHub Pages.

No API keys or runtime environment variables are required for the static site.
