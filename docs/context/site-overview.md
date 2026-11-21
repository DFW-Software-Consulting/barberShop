# Site overview

The Barber Spot is a demo site for a fictional barbershop, made by DFW Software Consulting to show prospective clients. It has no framework, no build step, no dependencies and no backend. See [README.md](../../README.md) for the pitch and the live-demo note.

## Layout

- `index.html`: the whole site as one page (hero, services, pricing, barbers, gallery, reviews, booking form, contact).
- `assets/css/style.css`: design tokens as CSS custom properties in `:root` (for example `--ink`, `--cream`, `--brass`) plus all styles.
- `assets/css/flaticon.min.css` and `assets/fonts/flaticon.ttf`: the icon font. Treat as vendor files.
- `assets/js/script.js`: all behaviour, one file, no modules.
- `assets/images/`: photos used by the page.

## Behaviour in `assets/js/script.js`

Sections are commented blocks, in order: mobile nav toggle (Escape closes it, and it closes when the viewport grows to desktop width), header and back-to-top on scroll, scroll-reveal on `.reveal` elements, pricing filter (`[data-filter-btn]` / `[data-filter]`), form validation, and an open-now status.

- Hooks are `data-*` attributes (`data-navbar`, `data-nav-toggler`, `data-header`, `data-filter`, `data-open-status`). Renaming one in the HTML means renaming it in the script.
- Form validation is shared via `wireForm`. The booking form (`#booking-form`) and newsletter form (`#newsletter-form`) only validate and show a success message. Nothing is sent anywhere.
- Opening hours live in the `hours` object in the script (day number to `[open, close]`, `null` for closed). The hours table in `index.html` carries matching `data-day` rows. Change both together.
- Motion respects `prefers-reduced-motion`.

## Running and deploying

- Open `index.html` or run a static server from the repo root (`python3 -m http.server 8000`).
- All asset paths are relative so the site also works under a repository sub-path.
- It is published as a static site by GitHub Pages. There is no CI and no lint or test config in the repo.

## Conventions

- All business details, prices and reviews are placeholders. Do not add real personal data.
- Branch work goes through pull requests into `main`.
