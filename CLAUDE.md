# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # CRA dev server on :3000 + Express API on :3001 (use this)
npm start        # frontend only - /api/* calls will fail
npm run build    # production build to build/
```

`npm test` runs `react-scripts test`, but **there are no test files** — `@testing-library/*` is installed and unused. There is no linter beyond the `react-app` ESLint config that runs during builds.

Builds are slow here: the repo lives in a OneDrive-synced folder, and webpack reading thousands of unhydrated cloud-placeholder files can take many minutes. A build can also fail outright with `Error: UNKNOWN: unknown error, read` on a random `node_modules` file — that's OneDrive hydration, not a code problem. Re-run it.

Two build warnings are expected and benign: `Critical dependency: require function is used in a way in which dependencies cannot be statically extracted` (×2), from face-api's prebuilt bundle.

## Architecture

A CRA single-page app that boxes faces in an image. **Face detection runs entirely in the browser** via `@vladmandic/face-api`. There is no detection API. (This replaced Clarifai, which shut down.)

### The backend exists only to defeat CORS

To detect faces, the browser reads the image's pixels off a canvas, which it only permits when the image host sends CORS headers. Many hosts don't.

So `netlify/functions/api.js` serves one route, `GET /api/proxy?url=…`, which fetches the image server-side and returns it as a **JSON data URI** — not raw bytes, deliberately, to sidestep binary/`isBase64Encoded` handling in `serverless-http` and to produce the same shape the upload path already yields.

`src/lib/loadImage.js` tries loading the URL directly first with a throwaway `Image` probe and only falls back to the proxy when that fails, so CORS-friendly hosts cost no round trip. **A failed probe logs a CORS/network error to the browser console — that is the fallback working, not a bug.**

The function is dual-mode: `app.listen()` for `npm run dev` (CRA's `proxy` field forwards `/api/*` to :3001) and `exports.handler = serverless(app)` for Netlify, routed by the `/api/*` redirect in `netlify.toml`. Keep both.

Uploaded files never touch the network — `FileReader` produces a data URI directly.

### Detection is triggered by the image's load event

`onSubmit` only resolves a `src` and sets `imageURL`. Detection happens in `App.onImageLoad`, fired by the `<img>`'s own `onLoad`. This is deliberate: box math needs the element's real layout dimensions, and the pre-migration code read them from a network callback that could resolve before layout finished, yielding zero-scaled boxes.

Consequences worth knowing before editing `App.js`:

- `startNewImage()` sets `imageURL` to `''` first. `FaceDetect` returns `null` when empty, so the `<img>` unmounts and remounts — otherwise re-picking the *same* image sets an identical `src`, React never touches the DOM, no `load` event fires, and the busy state hangs forever.
- `onImageError` exists because `onLoad` never fires for an undecodable image, which would also strand the busy state.
- `requestRef` is a monotonic counter captured at the start of every async path; stale results are discarded by comparing it against `requestRef.current`. Anything new that awaits needs the same guard.

### Coordinate system

`detectAllFaces` returns pixel boxes in the image's **natural** dimensions. `toBoxes` in `src/lib/faceDetection.js` rescales them to the **displayed** size via `faceapi.resizeResults`, then converts to `{topRow, rightCol, bottomRow, leftCol}` **insets** — that shape is what the absolutely-positioned `.bounding-box` CSS in `index.css` consumes. (Clarifai returned normalized 0–1 values; nothing in the app uses that convention now.)

Raw detections are kept in `detectionsRef` so a `window.resize` listener can re-run `toBoxes` without re-detecting. This matters because Tailwind preflight's `img { max-width: 100% }` shrinks the nominally 500px image on narrow viewports.

### Model weights

Committed to `public/models/` and served as static files, copied from `node_modules/@vladmandic/face-api/model/`. Nothing copies them at build time, so **a model swap means committing new weight files**, not just changing code.

**Do not "optimize" SSD MobileNet v1 down to TinyFaceDetector.** The 30×-smaller tiny model was measured against the three sample images in `ImageSelection.js` and found **zero faces in all of them**, at input sizes 416/512/608 and score thresholds down to 0.2 — they have small, tilted, hat-shaded faces. SSD finds them at 0.91–0.96 in well under 100ms.

Known model limitation: **full-profile faces are not detected.** The third sample image (a climber in upward profile) never produces a box and reports "No faces found" — that is the model, not broken wiring.

### Error handling

There are no `alert()` calls; user-facing failures set `message` state (`{tone: 'error' | 'info'}`) rendered by `src/Components/Message.js`. "No faces found" is deliberately `info`, not `error`. Note `alert()` would actually throw inside the serverless runtime, so it must not return to the API function either.
