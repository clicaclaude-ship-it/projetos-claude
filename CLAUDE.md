# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This workspace contains the **Clica AI** website project — a static HTML5 marketing site for an AI automation agency targeting Brazilian SMBs.

## Development Server

No build tools. Serve the `clica-ai/` directory over HTTP (required because the site uses `fetch()` for partials):

```bash
npx serve clica-ai/
# or
python3 -m http.server 8080 --directory clica-ai/
```

Do **not** open HTML files via `file://` — dynamic partials will fail silently.

## Architecture

### Dynamic Partials
Header and footer live in `clica-ai/assets/partials/` and are injected via `fetch() + innerHTML` in `main.js`. Every page loads them at runtime — edit partials, not individual page headers/footers.

### Blog System
Blog is entirely client-side. `clica-ai/blog/data/posts.json` is the index; each post is a JSON file in `clica-ai/blog/data/posts/`. `post.html` reads the `?slug=` query param and fetches the matching JSON. To add a post: create a JSON file and register it in `posts.json`.

### WhatsApp Integration
All contact flows route to WhatsApp (`https://wa.me/553531959999`). The floating button is in `footer.html`. The contact form on `contato.html` builds a pre-filled WhatsApp URL — there is no backend form submission.

## Skills

### Brainstorming (`slills/brainstorming/`)
A mandatory design-first workflow. Before implementing any significant new feature or page:
1. Run through `SKILL.md` — explore context, ask clarifying questions, propose 2–3 approaches
2. Create a visual mockup using `visual-companion.md` (starts a local HTTP server to render HTML mockups)
3. Write a spec doc to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
4. Get user approval before coding

**Hard rule:** No implementation until the spec is reviewed and approved.

## Key Files

- `clica-ai/assets/css/global.css` — design tokens (CSS variables), base styles
- `clica-ai/assets/css/components.css` — reusable component styles
- `clica-ai/assets/js/main.js` — partial loading, WhatsApp button, shared UI
- `clica-ai/assets/js/blog.js` — blog list and post rendering
- `docs/superpowers/specs/2026-03-27-clica-ai-site-design.md` — approved design spec (source of truth for visual/UX decisions)

## Design Constraints

- **Colors:** Dark background (`#0a0a0a`), gold accent (`#d4af37`), purple secondary (`#7c3aed`)
- **No frameworks** — vanilla JS only; no React, Vue, jQuery, or CSS frameworks
- **Language:** All user-facing content in Brazilian Portuguese (pt-BR)
- **Images:** AI-generated SVGs only; stored in `clica-ai/assets/images/`
