import { subscribeRoom, subscribePlayers, joinRoom, buzzIn, isHostActive, MAX_BUZZ_ORDER } from './room.js';

const NAME_KEY = 'julyJeopardyName';
const PLAYER_ID_KEY = 'julyJeopardyPlayerId';
const HOST_SESSION_KEY = 'julyJeopardyHostSession';

const statusName = document.getElementById('statusName');
const statusScore = document.getElementById('statusScore');

const hostGoneScreen = document.getElementById('hostGoneScreen');
const joinScreen = document.getElementById('joinScreen');
const nameInput = document.getElementById('nameInput');
const joinButton = document.getElementById('joinButton');

const gameScreen = document.getElementById('gameScreen');
const valueDisplay = document.getElementById('valueDisplay');
const waitingDisplay = document.getElementById('waitingDisplay');
const buzzButton = document.getElementById('buzzButton');
const buzzStatus = document.getElementById('buzzStatus');
const leaderboardList = document.getElementById('leaderboardList');

function fmt(n) {
  const v = n ?? 0;
  return v >= 0 ? `$${v}` : `-$${Math.abs(v)}`;
}

function generatePlayerId() {
  // crypto.randomUUID() needs a secure context (HTTPS/localhost) and
  // throws on plain-HTTP LAN testing, so fall back to a Math.random id:
  // this only needs to be unique per device, not cryptographically strong.
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

// Persistent per-device identity, survives refresh/tab close so a
// player's score stays theirs even if their phone browser gets killed.
let playerId = localStorage.getItem(PLAYER_ID_KEY);
if (!playerId) {
  playerId = generatePlayerId();
  localStorage.setItem(PLAYER_ID_KEY, playerId);
}

let playerName = localStorage.getItem(NAME_KEY) || '';
// Which host game session this device last joined/knows about: used to
// detect "the host started a new game" vs. "my own page just refreshed
// mid-game", which need different treatment (rejoin from scratch vs.
// silently resume).
let knownHostSessionId = localStorage.getItem(HOST_SESSION_KEY) || null;
let hasJoinedThisSession = false;
let latestRoom = null;
let latestPlayers = {};

function showScreenForState(hostActive) {
  const hasName = !!playerName;
  hostGoneScreen.hidden = hostActive;
  joinScreen.hidden = !hostActive || hasName;
  gameScreen.hidden = !hostActive || !hasName;
}

async function doJoin() {
  const n = nameInput.value.trim();
  if (!n || !latestRoom) return;
  playerName = n;
  localStorage.setItem(NAME_KEY, n);
  knownHostSessionId = latestRoom.hostSessionId;
  localStorage.setItem(HOST_SESSION_KEY, knownHostSessionId || '');
  await joinRoom(playerId, playerName);
  hasJoinedThisSession = true;
  showScreenForState(isHostActive(latestRoom));
}

joinButton.addEventListener('click', doJoin);
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doJoin();
});

buzzButton.addEventListener('click', () => {
  if (!latestRoom) return;
  const tile = latestRoom.currentTile;
  const order = latestRoom.buzzOrder || [];
  if (!tile || tile.phase !== 'question' || order.length >= MAX_BUZZ_ORDER || order.includes(playerId)) return;
  buzzIn(playerId, latestRoom.buzzToken);
});

function render() {
  if (!latestRoom) return;
  const room = latestRoom;
  const players = latestPlayers;

  // The host board wiped everyone and started fresh: anyone who was
  // playing under the old session gets bounced back to name entry.
  if (room.hostSessionId !== knownHostSessionId) {
    knownHostSessionId = room.hostSessionId;
    localStorage.setItem(HOST_SESSION_KEY, knownHostSessionId || '');
    playerName = '';
    hasJoinedThisSession = false;
    localStorage.removeItem(NAME_KEY);
  }

  const hostActive = isHostActive(room);
  showScreenForState(hostActive);
  if (!hostActive) return;

  // Re-establish our player doc once per session (covers this device's
  // own page refresh while the same game is still running).
  if (playerName && !hasJoinedThisSession) {
    hasJoinedThisSession = true;
    joinRoom(playerId, playerName);
  }

  const me = players[playerId];

  statusName.textContent = playerName;
  statusScore.textContent = fmt(me && me.score);

  const tile = room.currentTile;
  const hasActiveQ = !!tile;
  if (hasActiveQ) {
    const value = (tile.rowIdx + 1) * 100;
    valueDisplay.textContent = `$${value}`;
    valueDisplay.hidden = false;
    waitingDisplay.hidden = true;
  } else {
    valueDisplay.hidden = true;
    waitingDisplay.hidden = false;
  }

  const order = room.buzzOrder || [];
  const myRank = order.indexOf(playerId);
  const buzzedFirst = myRank === 0;
  const buzzedLater = myRank > 0;
  const buzzedOther = order.length > 0 && myRank === -1;
  const buzzerActive = !!tile && tile.phase === 'question' && myRank === -1 && order.length < MAX_BUZZ_ORDER;
  const winnerName = buzzedOther && players[order[0]] ? players[order[0]].name : 'Someone';

  buzzButton.classList.remove('buzz-button--active', 'buzz-button--won', 'buzz-button--lost', 'buzz-button--queued');
  if (buzzedFirst) {
    buzzButton.classList.add('buzz-button--won');
  } else if (buzzedLater) {
    buzzButton.classList.add('buzz-button--queued');
  } else if (buzzedOther) {
    buzzButton.classList.add('buzz-button--lost');
  } else if (buzzerActive) {
    buzzButton.classList.add('buzz-button--active');
  }
  buzzButton.style.cursor = buzzerActive ? 'pointer' : 'default';

  buzzStatus.classList.remove('buzz-status--won', 'buzz-status--lost', 'buzz-status--active', 'buzz-status--queued');
  if (buzzedFirst) {
    buzzStatus.classList.add('buzz-status--won');
    buzzStatus.textContent = '🎉 You buzzed first!';
  } else if (buzzedLater) {
    buzzStatus.classList.add('buzz-status--queued');
    buzzStatus.textContent = `You buzzed in #${myRank + 1}`;
  } else if (buzzedOther) {
    buzzStatus.classList.add('buzz-status--lost');
    buzzStatus.textContent = `${winnerName} got there first`;
  } else if (buzzerActive) {
    buzzStatus.classList.add('buzz-status--active');
    buzzStatus.textContent = 'Tap to buzz in!';
  } else if (hasActiveQ) {
    buzzStatus.textContent = 'Get ready...';
  } else {
    buzzStatus.textContent = 'Waiting for host...';
  }

  leaderboardList.innerHTML = '';
  Object.values(players)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .forEach(({ name, score }) => {
      const row = document.createElement('div');
      row.className = 'leaderboard__row';
      const nameEl = document.createElement('span');
      nameEl.className = 'leaderboard__name';
      nameEl.textContent = name;
      const scoreEl = document.createElement('span');
      scoreEl.className = 'leaderboard__score';
      scoreEl.textContent = fmt(score);
      row.appendChild(nameEl);
      row.appendChild(scoreEl);
      leaderboardList.appendChild(row);
    });
}

showScreenForState(false);
subscribeRoom((room) => {
  latestRoom = room;
  render();
});
subscribePlayers((players) => {
  latestPlayers = players;
  render();
});

// isHostActive() compares Date.now() to the room's last heartbeat, but
// render() otherwise only runs inside the subscribe callbacks above,
// which only fire when the room document actually changes. Once the host
// stops heartbeating (tab closed/crashed), the document stops changing,
// so those callbacks never fire again and the staleness check never gets
// re-evaluated against the current clock: the buzzer would silently stay
// on the last screen it saw, forever, instead of noticing the host is
// gone. Re-rendering on a plain timer forces that check to run regardless
// of whether Firestore has anything new to say.
setInterval(() => {
  if (latestRoom) render();
}, 2000);
