# Ghost Dev — G Studio Labs

Portfolio site for Ghost Dev, Roblox developer. Static HTML, CSS and JavaScript, hosted on GitHub Pages.

## Structure
- `index.html` — all content (hero, work, services, systems, code, stack, studio, process, FAQ, contact).
- `assets/css/site.css` — styles. The original design is kept at the top; new sections are below it.
- `assets/js/site.js` — code rain, typing, tilt, code tabs (`T` array), video player and filters, copy button.
- `assets/video/` — project videos (H.264, 60 fps, no audio) and `posters/`.
- `assets/img/` — emblem, skin posters and favicon.

## Adding a video
1. Put `name.mp4` in `assets/video/` and a poster `name.webp` in `assets/video/posters/`.
2. Copy one `<button class="card vcard" ...>` block in `index.html` and change `data-v`, `data-cat`,
   `data-cl`, `data-title`, `data-tags`, `data-desc`, the duration and the texts.
3. Files must be under 100 MB each (GitHub limit).

After changing CSS or JS, bump `?v=1` in `index.html` so visitors get the new files.
