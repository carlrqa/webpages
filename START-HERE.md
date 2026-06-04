# RQA Interactive Video — Start Here

A small, dependency-free toolkit for putting interactive video (inline playback,
branching "choose-your-path" flows, lead capture, CTAs, analytics) onto RQA pages.

## What's in this folder

| File | What it is |
|------|------------|
| **editor.html** | Open this in your browser. Visual builder for your video flows. No login, no server. |
| **video.html** | A ready-made interactive demo (also the page you embed via iframe). |
| **inline-video-standalone.html** | The same player as one all-in-one file (alternative to video.html). |
| **inline-video-plugin.js** | The underlying plugin (only needed if you embed via raw `<script>`). |
| **index.html** | A simple landing page linking to the demo + editor. |
| **public/** | The exact folder to drag onto Netlify to publish (contains index/editor/video/plugin). |
| **netlify.toml** | Tells Netlify to publish the `public/` folder. |
| **README.md** | Full configuration reference. |

## The 3 stages

### 1. Build  →  open `editor.html`
- Add **Video** steps; for each, pick a **Video source**:
  - **Hosted** — paste a YouTube / Vimeo / MP4 link (best for long videos).
  - **Local file** — upload the video alongside the page.
  - **Embedded** — bundle a short clip *inside* the page (one file, no separate upload).
- Add **branching choices** to send viewers to other steps or webpages.
- Add a **Lead form** step to capture details.
- Watch the live preview; set the accent colour to RQA blue `#004990`.

### 2. Publish  →  Netlify
- A site is already created: **rqa-interactive-video**.
- Go to https://app.netlify.com/projects/rqa-interactive-video/deploys
- **Drag the `public/` folder** onto the drop zone.
- Live URLs:
  - Editor: `https://rqa-interactive-video.netlify.app/editor.html`
  - Demo / iframe target: `https://rqa-interactive-video.netlify.app/video.html`

> Tip: in the editor, put `https://rqa-interactive-video.netlify.app/video.html`
> in the **Hosted page URL** field so it generates the correct embed snippet.

### 3. Embed  →  RQA CMS (django CMS)
Paste this one line into a Text / Custom-HTML block on your page:

```html
<iframe src="https://rqa-interactive-video.netlify.app/video.html"
  width="100%" height="700" frameborder="0" loading="lazy"
  title="RQA video" style="border:0;display:block"></iframe>
```

This is the same iframe pattern RQA already uses for `rqa-events.netlify.app`.

## To change a video later
Edit in `editor.html` → **Download standalone page** → re-drag onto Netlify.
The iframe on the RQA page never needs to change.

---
Source of truth: GitHub `carlrqa/webpages`, branch `claude/web-plugin-inline-video-Ufo0G`.
