// Firebase project: th-jeopardy
// Loaded as an ES module directly from the CDN: no npm, no build step.
// The apiKey below is a public web client key (safe to ship in a static
// site); access control is enforced by Firestore security rules, not by
// keeping this value secret. See firestore.rules for the rules to publish.
// This project is dedicated to this app: it does not share Firestore
// with student-government-jeopardy.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { initializeFirestore, connectFirestoreEmulator } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAh5N_ADVzGnAQFCoV-8TyOZmpNqwuOwvc',
  authDomain: 'th-jeopardy.firebaseapp.com',
  projectId: 'th-jeopardy',
  storageBucket: 'th-jeopardy.firebasestorage.app',
  messagingSenderId: '979740524804',
  appId: '1:979740524804:web:9fb4f2a6403eaac20f1051',
};

const app = initializeApp(firebaseConfig);

// Long polling instead of WebChannel streaming: campus wifi and school
// network proxies frequently choke on the streaming transport, which
// shows up as a room that never syncs with no obvious error. Long
// polling is slightly chattier but works behind almost any firewall,
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
