# Robin Dalmy — Clarity from complexity

A static Astro portfolio connecting mobile engineering, full-stack work, production troubleshooting, and agentic development tooling.

## Run locally

Requires Node.js 20 or newer. The existing dependency manifest and lockfile are unchanged.

```sh
npm ci
npm run dev
```

```sh
npm run build     # Astro source/type/content checks and static production build
npm run preview   # Serve dist/ locally
```

For a sandbox without writable home directories:

```sh
npm ci --cache /tmp/portfolio-npm-cache
ASTRO_TELEMETRY_DISABLED=1 XDG_CONFIG_HOME=/tmp/portfolio-config npm run build
```

## Design and structure

The visual idea is a continuous signal: an original three-dimensional surface that can be explored as a mobile loop, a system knot, or an agent waveform. It sits in a typographic identity composition. The work is presented as a numbered engineering index; story pages use conceptual diagrams and a section index.

- `src/pages/index.astro`: homepage and public content structure.
- `src/pages/work/[slug].astro`: three static engineering stories.
- `src/components/SignalForm.astro`: progressively enhanced 3D artwork and controls.
- `src/utils/signal-geometry.ts`: original parametric surface geometry, projection, and shading shared by server SVG and client canvas.
- `src/components/ConceptDiagram.astro`: semantic story diagrams.
- `src/data/portfolio.ts`: public summaries, experience, and toolkit.
- `src/css/portfolio.css`: visual system and responsive composition.
- `public/pdfs/Resume_03-02-2026.pdf`: resume download; email contact details are omitted from the website copies.

There are no new production dependencies, remote font loaders, component services, runtime CDNs, or analytics. Existing fonts are self-hosted. Canvas uses event-driven rendering rather than an idle animation loop; offscreen rendering stops, pixel density is capped, and observers are cleaned up/restored around page lifecycle events. Reduced motion removes entrances and ambient pointer response while deliberate controls remain available.

Without JavaScript or a canvas context, the shared geometry remains visible as a server-rendered SVG. Content, links, and the native mobile menu remain available.
