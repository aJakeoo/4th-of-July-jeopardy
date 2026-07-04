// Firebase project: THIS APP NEEDS ITS OWN FIRESTORE PROJECT.
// Loaded as an ES module directly from the CDN — no npm, no build step.
// The apiKey below is a public web client key (safe to ship in a static
// site); access control is enforced by Firestore security rules, not by
// keeping this value secret. See firestore.rules for the rules to publish.
//
// This is a copy of the sync logic from student-government-jeopardy, but
// deliberately NOT pointed at that project's live Firestore — sharing one
// `rooms/main` doc between two unrelated games (same GitHub Pages account,
// same origin) would let them stomp on each other's board/score state.
// Create a new Firebase project (Firestore, native mode), register a web
// app in it, and paste its config values in below before deploying.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { initializeFirestore, connectFirestoreEmulator } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'REPLACE_WITH_YOUR_FIREBASE_API_KEY',
  authDomain: 'REPLACE_WITH_YOUR_PROJECT.firebaseapp.com',
  projectId: 'REPLACE_WITH_YOUR_PROJECT_ID',
  storageBucket: 'REPLACE_WITH_YOUR_PROJECT.firebasestorage.app',
  messagingSenderId: 'REPLACE_WITH_YOUR_SENDER_ID',
  appId: 'REPLACE_WITH_YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);

// Long polling instead of WebChannel streaming: campus wifi and school
// network proxies frequently choke on the streaming transport, which
// shows up as a room that never syncs with no obvious error. Long
// polling is slightly chattier but works behind almost any firewall —
// worth the tradeoff for a room full of phones on guest wifi.
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

// Point at the local Firestore emulator when serving from localhost, e.g.
// `firebase emulators:start --only firestore` during development. Never
// triggers on the deployed GitHub Pages origin.
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  connectFirestoreEmulator(db, window.location.hostname, 8081);
}
