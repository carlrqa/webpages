# InlineVideo

A tiny, **dependency-free** JavaScript plugin for **interactive video** on
sales / landing pages. Visitors can:

- watch a video play **inline** (muted autoplay, like modern landing pages),
- **click to unmute** and get full controls,
- **browse more videos** via a clickable thumbnail rail,
- follow **branching "choose-your-path" flows** — when a clip ends, choice
  buttons route the viewer to a different next video (a decision tree),
- be asked for their details via a **lead-capture form** that gates a clip,
- **click a call-to-action** that takes them to another webpage,
- and you get **analytics events** for every play, choice, CTA, and lead.

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

### Option C — build it visually (no code at all)

Open **`editor.html`** in your browser (or host it on your site). It's a
self-contained visual flow builder:

- add video and lead-form steps, set titles / URLs / posters / CTAs,
- wire up branching choices with dropdowns (step → step),
- tweak accent colour and analytics,
- **see a live preview** as you edit,
- then **Copy embed snippet** (to paste on a page), **Download standalone page**
  (a single ready-to-host HTML file), or **Download project** (a `.json` you can
  re-open later to keep editing).

No login, no server, no database — your work is saved in the browser and as
downloadable files, so it hosts on Netlify as-is.

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
| `onEvent`      | function| `null`  | Analytics callback `fn(eventName, detail)` — see below.  |
| `gtm`          | boolean | `false` | Also push events to `window.dataLayer` for Google Tag Manager. |

### Playlist item

| Field           | Type             | Description                                                       |
| --------------- | ---------------- | ----------------------------------------------------------------- |
| `id`            | string           | Stable identifier. **Required if other nodes branch to it.**      |
| `src`           | string           | Video URL — MP4/WebM, YouTube, or Vimeo. Auto-detected.           |
| `type`          | string           | Optional explicit type: `"file"`, `"youtube"`, or `"vimeo"`.     |
| `videoId`       | string           | Optional explicit provider ID (instead of a full `src` URL).     |
| `title`         | string           | Shown on the overlay and thumbnail.                               |
| `description`   | string           | Short line shown on the overlay.                                  |
| `poster`        | string           | Thumbnail / poster image URL.                                     |
| `badge`         | string           | Small label on the thumbnail (e.g. duration, "Webinar").         |
| `mime`          | string           | Optional MIME type for self-hosted files (e.g. `video/webm`).    |
| `cta`           | object \| array  | Call-to-action button(s) — see below.                             |
| `choices`       | array            | Branching choices shown when the clip ends — see below.           |
| `choicesPrompt` | string           | Heading on the branching end-screen.                              |
| `form`          | object           | Lead-capture form. Gates this node's video (or branches) — below. |

### Choice object (branching flows)

When a clip with `choices` **ends**, the player shows a "choose your path"
screen. Each choice either jumps to another node or links out.

```js
{ label: "I'm in Sales", goto: "sales" }            // jump to node id "sales"
{ label: "Book a demo",  url: "https://x.com/demo" } // open a webpage
```

| Field    | Type    | Description                                              |
| -------- | ------- | -------------------------------------------------------- |
| `label`  | string  | Button text.                                             |
| `goto`   | string  | `id` (or index) of the node to play next.                |
| `url`    | string  | Link out instead of branching.                           |
| `newTab` | boolean | For `url` choices — open in a new tab (default `true`).  |

> A clip with `choices` never loops, so it can reach its end and reveal them.
> On YouTube/Vimeo, end-detection uses the providers' JS APIs (auto-loaded).

### Form object (lead capture)

Attach a `form` to a node to gate it. The form shows **before** the video; on
submit the flow continues. With no `src` and a `goto`, the node becomes a
standalone form step between two clips.

```js
{
  id: 'gate',
  form: {
    title: 'Unlock the full demo',
    fields: [
      { name: 'email', label: 'Work email', type: 'email', required: true }
    ],
    submitLabel: 'Watch now',
    action: 'https://your-endpoint/leads', // optional POST (JSON) of the fields
    goto: 'fulldemo'                        // optional next node; omit to play own src
  }
}
```

| Field         | Type   | Description                                                          |
| ------------- | ------ | ------------------------------------------------------------------- |
| `title`       | string | Heading above the form.                                             |
| `description` | string | Sub-text under the heading.                                         |
| `fields`      | array  | `{ name, label, type, placeholder, required, options }`. `type` can be `text`, `email`, `tel`, `textarea`, `select`, etc. |
| `submitLabel` | string | Submit button text (default `Continue`).                            |
| `note`        | string | Fine print under the button.                                        |
| `action`      | string | Optional URL to `POST` the collected fields to (as JSON).           |
| `method`      | string | HTTP method for `action` (default `POST`).                          |
| `goto`        | string | Node to play after submit. Omit to play this node's own `src`.      |

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

## Analytics

Every interaction fires an event three ways, so you can use whichever you like:

1. your `onEvent(name, detail)` callback,
2. a push to `window.dataLayer` (when `gtm: true`) as `inlinevideo_<name>`,
3. a DOM `CustomEvent` named `inlinevideo:<name>` dispatched on the mount element.

| Event    | Fired when…                          | `detail` includes                  |
| -------- | ------------------------------------ | ---------------------------------- |
| `play`   | a clip starts playing (user-driven)  | `video`, `title`                   |
| `ended`  | a clip finishes                      | `video`, `title`                   |
| `choice` | a branching choice is picked         | `label`, plus `goto` or `url`      |
| `cta`    | a CTA (or link-out choice) is clicked| `label`, `url`                     |
| `lead`   | a lead-capture form is submitted     | `fields` (the submitted values)    |

```js
InlineVideo.mount('#hero', {
  onEvent: function (name, detail) {
    // e.g. forward to Google Analytics 4
    if (window.gtag) gtag('event', 'inlinevideo_' + name, detail);
  },
  playlist: [ /* ... */ ]
});
```

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
