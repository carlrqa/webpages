# InlineVideo

A tiny, **dependency-free** JavaScript plugin for playing video **inline** on
sales / landing pages. Visitors can:

- watch a video play inline (muted autoplay loop, like modern landing pages),
- **click to unmute** and get full controls,
- **browse more videos** via a clickable thumbnail rail,
- **click a call-to-action** that takes them to another webpage.

No build step, no framework, no dependencies. One JS file, one `<div>`.

---

## Quick start

### Option A — programmatic

```html
<div id="hero-video"></div>
<script src="inline-video-plugin.js"></script>
<script>
  InlineVideo.mount('#hero-video', {
    accent: '#2563eb',
    playlist: [
      {
        title: 'Meet the product in 90 seconds',
        description: 'Tap to unmute.',
        src: 'https://cdn.example.com/intro.mp4',
        poster: 'https://cdn.example.com/intro.jpg',
        badge: '1:30 • Overview',
        cta: [
          { label: 'Start free trial', url: 'https://example.com/signup' },
          { label: 'Read the docs',   url: 'https://example.com/docs' }
        ]
      }
    ]
  });
</script>
```

### Option B — declarative (no JS to write)

Put the config straight on the element as JSON. The plugin auto-mounts every
element with a `data-inline-video` attribute on page load.

```html
<div data-inline-video='{
  "playlist": [
    { "title": "Demo", "src": "https://cdn.example.com/demo.mp4",
      "cta": { "label": "Buy now", "url": "https://example.com/buy" } }
  ]
}'></div>
<script src="inline-video-plugin.js"></script>
```

For large playlists, keep the JSON out of the attribute:

```html
<div data-inline-video='{ "configRef": "hero" }'></div>
<script>
  window.InlineVideoConfig = { hero: { playlist: [ /* ... */ ] } };
</script>
<script src="inline-video-plugin.js"></script>
```

---

## Configuration

### Instance options

| Option         | Type    | Default | Description                                              |
| -------------- | ------- | ------- | -------------------------------------------------------- |
| `playlist`     | array   | `[]`    | The videos to show (see below). **Required.**            |
| `autoplay`     | boolean | `true`  | Start the first video automatically (muted).             |
| `muted`        | boolean | `true`  | Inline preview is muted. Browsers require this to autoplay. |
| `loop`         | boolean | `true`  | Loop the inline preview.                                 |
| `showPlaylist` | boolean | `true`  | Show the "more videos" thumbnail rail (if >1 video).     |
| `accent`       | string  | `null`  | Accent colour for buttons/highlights (any CSS colour).   |
| `startIndex`   | number  | `0`     | Which playlist item to load first.                       |

### Playlist item

| Field         | Type             | Description                                                        |
| ------------- | ---------------- | ------------------------------------------------------------------ |
| `src`         | string           | Video URL — MP4/WebM, YouTube, or Vimeo. Auto-detected.            |
| `type`        | string           | Optional explicit type: `"file"`, `"youtube"`, or `"vimeo"`.      |
| `videoId`     | string           | Optional explicit provider ID (instead of a full `src` URL).      |
| `title`       | string           | Shown on the overlay and thumbnail.                                |
| `description` | string           | Short line shown on the overlay.                                   |
| `poster`      | string           | Thumbnail / poster image URL.                                      |
| `badge`       | string           | Small label on the thumbnail (e.g. duration, "Webinar").          |
| `mime`        | string           | Optional MIME type for self-hosted files (e.g. `video/webm`).     |
| `cta`         | object \| array  | Call-to-action button(s) — see below.                              |

### CTA object

```js
{ label: 'Buy now', url: 'https://example.com/buy', newTab: true }
```

| Field    | Type    | Default | Description                                  |
| -------- | ------- | ------- | -------------------------------------------- |
| `label`  | string  | —       | Button text.                                 |
| `url`    | string  | —       | Where the button links to.                   |
| `newTab` | boolean | `true`  | Open in a new tab. Set `false` for same tab. |

You can pass a single CTA object or an array (first renders solid, the rest as
secondary "ghost" buttons).

---

## Supported video sources

- **Self-hosted** `.mp4` / `.webm` — true inline playback with a mute toggle.
- **YouTube** — any `watch?v=`, `youtu.be/`, or `embed/` URL.
- **Vimeo** — any `vimeo.com/<id>` URL.

> For YouTube/Vimeo, clicking play reloads the embed with sound + controls,
> since those players can't be unmuted programmatically once started. The
> dedicated mute button only appears for self-hosted `<video>`.

---

## Notes

- Autoplay only works **muted** — this is a browser policy, not a plugin limit.
- Styles are injected once and namespaced under `.ivp-` to avoid clashing with
  your page. Theme via the `accent` option or by overriding the
  `--ivp-accent` / `--ivp-bg` / `--ivp-radius` CSS variables.
- Mount as many instances on a page as you like.

See `index.html` for a complete working sales-page example.
