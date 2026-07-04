# 4th of July Jeopardy

Two-screen Jeopardy trivia for a 4th of July gathering. Vanilla HTML/CSS/JS,
no build step, Firebase Firestore for real-time sync. Structurally cloned
from `student-government-jeopardy` (same host/buzzer architecture and
Firestore sync logic), retextured with a red/white/blue theme and new
question content.

- `index.html` — host board (projector). Only entry point for the host.
- `buzzer.html` — player buzzer, reached by scanning the QR code on the
  host board. Name entry → buzz button, no separate join menu.

## Question content

`data/questions.js` holds 6 categories, 5 clues each: General American
History, Americana, Revolutionary War, Michigan, Red White & Boom, and
Presidents & the 4th.

## Firebase setup

This app has its own dedicated Firebase project (`th-jeopardy`) — it does
not share Firestore with `student-government-jeopardy`. `js/firebase-config.js`
is already wired up with that project's config.

1. **Publish `firestore.rules`** before relying on this for a real event
   (Firestore → Rules tab, or `firebase deploy --only firestore:rules`
   with the Firebase CLI). The project was created "in test mode," which
   only opens read/write for 30 days and then locks everyone out with no
   warning — `firestore.rules` in this repo replaces that with a
   permanent (still fully open, no-auth) rule scoped to `rooms/main` and
   its `players` subcollection, matching what test mode already allows.
2. No Auth, no other products needed. `rooms/main` holds the board state
   (`currentTile`, `buzzLock`, answered tiles) and a `players`
   subcollection (one doc per device, keyed by a random id generated on
   first visit to `buzzer.html`). Deleting `rooms/main` and its `players`
   subcollection resets the game.

## Running locally

Any static file server works — e.g.:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html`.

For local Firestore testing without touching the production project, run
the emulator and the app will auto-connect to it (see the `localhost`
check in `js/firebase-config.js`):

```
firebase emulators:start --only firestore
```

## Deploying

Push to GitHub and enable Pages (Settings → Pages → Source: Deploy from a
branch → pick this branch → `/` root). GitHub Pages serves `index.html`
at the repo root automatically.

## Notes

- The "AC Compacta" font file bundled in `assets/fonts/` is actually a
  freeware lookalike ("Aka-AcidGR-Compacta" by Cybertronical Design,
  explicitly marked free by its foundry), carried over from the source
  repo.
- The source repo's peacock logo image is gone — the footer logo and the
  tile-reveal animation now use the 🎆 emoji directly (as text, not an
  image asset), and the favicon is an inline SVG wrapping the same emoji.
- Firestore is initialized with `experimentalForceLongPolling` since
  guest wifi and proxies often choke on the default streaming transport —
  worth the extra chattiness for reliability.
