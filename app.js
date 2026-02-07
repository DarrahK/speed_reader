// ── DOM Elements ──

const inputScreen = document.getElementById('input-screen');
const readerScreen = document.getElementById('reader-screen');
const textInput = document.getElementById('text-input');

// Settings inputs
const wpmInput = document.getElementById('wpm-input');
const wpmDisplay = document.getElementById('wpm-display');
const fontSizeInput = document.getElementById('font-size-input');
const fontSizeDisplay = document.getElementById('font-size-display');
const bgColorInput = document.getElementById('bg-color');
const textColorInput = document.getElementById('text-color');
const highlightColorInput = document.getElementById('highlight-color');
const startBtn = document.getElementById('start-btn');

// Reader elements
const wordContainer = document.getElementById('word-container');
const wordBefore = document.getElementById('word-before');
const wordPivot = document.getElementById('word-pivot');
const wordAfter = document.getElementById('word-after');
const playPauseBtn = document.getElementById('play-pause-btn');
const restartBtn = document.getElementById('restart-btn');
const backBtn = document.getElementById('back-btn');
const wpmDownBtn = document.getElementById('wpm-down');
const wpmUpBtn = document.getElementById('wpm-up');
const readerWpm = document.getElementById('reader-wpm');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

// ── State ──

let words = [];
let currentIndex = 0;
let wpm = 300;
let isPlaying = false;
let timeoutId = null;
let wasPlayingBeforeSeek = false;

// ── ORP Calculation ──

function getOrpIndex(word) {
  const len = word.length;
  if (len <= 1) return 0;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  if (len <= 13) return 3;
  return 4;
}

// ── Timing ──

function getDelay() {
  return 60000 / wpm;
}

// ── Display a Word ──

function displayWord(word) {
  const pivot = getOrpIndex(word);
  wordBefore.textContent = word.slice(0, pivot);
  wordPivot.textContent = word[pivot] || '';
  wordAfter.textContent = word.slice(pivot + 1);

  // Update progress with smooth constant-speed transition
  progressFill.style.transitionDuration = (60000 / wpm) + 'ms';
  const progress = ((currentIndex + 1) / words.length) * 100;
  progressFill.style.width = progress + '%';
  progressText.textContent = `${currentIndex + 1} / ${words.length}`;
}

// ── RSVP Engine ──

function showNext() {
  if (currentIndex >= words.length) {
    pause();
    playPauseBtn.textContent = 'Done';
    playPauseBtn.disabled = true;
    return;
  }

  const word = words[currentIndex];
  displayWord(word);
  currentIndex++;

  timeoutId = setTimeout(showNext, getDelay(word));
}

function play() {
  if (currentIndex >= words.length) return;
  isPlaying = true;
  playPauseBtn.textContent = 'Pause';
  playPauseBtn.disabled = false;
  showNext();
}

function pause() {
  isPlaying = false;
  playPauseBtn.textContent = 'Play';
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

function restart() {
  pause();
  currentIndex = 0;
  progressFill.style.width = '0%';
  progressText.textContent = `0 / ${words.length}`;
  displayWord(words[0]);
  playPauseBtn.disabled = false;
  playPauseBtn.textContent = 'Play';
}

// ── Apply Settings to Reader ──

function applySettings() {
  const bg = bgColorInput.value;
  const text = textColorInput.value;
  const highlight = highlightColorInput.value;
  const fontSize = fontSizeInput.value + 'px';

  readerScreen.style.background = bg;
  readerScreen.style.color = text;
  readerScreen.style.setProperty('--highlight-color', highlight);
  wordContainer.style.fontSize = fontSize;
  wordPivot.style.color = highlight;
}

// ── Screen Switching ──

function showReader() {
  const raw = textInput.value.trim();
  if (!raw) return;

  words = raw.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return;

  currentIndex = 0;
  wpm = parseInt(wpmInput.value, 10);

  applySettings();
  updateReaderWpm();

  inputScreen.classList.add('hidden');
  readerScreen.classList.remove('hidden');

  progressFill.style.width = '0%';
  progressText.textContent = `0 / ${words.length}`;

  play();
}

function showInput() {
  pause();
  readerScreen.classList.add('hidden');
  inputScreen.classList.remove('hidden');
}

// ── WPM Controls ──

function updateReaderWpm() {
  readerWpm.textContent = wpm + ' WPM';
}

function adjustWpm(delta) {
  wpm = Math.max(100, Math.min(1000, wpm + delta));
  updateReaderWpm();
  // If playing, restart the current timeout with new speed
  if (isPlaying && timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(showNext, getDelay(words[Math.max(0, currentIndex - 1)] || ''));
  }
}

// ── Progress Bar Seeking ──

const progressBar = document.getElementById('progress-bar');

function seekToPosition(e) {
  const rect = progressBar.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  currentIndex = Math.floor(ratio * words.length);
  if (currentIndex >= words.length) currentIndex = words.length - 1;
  displayWord(words[currentIndex]);
  currentIndex++; // advance past displayed word so play continues from next
  playPauseBtn.disabled = false;
  playPauseBtn.textContent = isPlaying ? 'Pause' : 'Play';
}

progressBar.addEventListener('mousedown', (e) => {
  wasPlayingBeforeSeek = isPlaying;
  if (isPlaying) pause();
  seekToPosition(e);

  function onMouseMove(e) {
    seekToPosition(e);
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    if (wasPlayingBeforeSeek) play();
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

// ── Event Listeners ──

// Settings live previews
wpmInput.addEventListener('input', () => {
  wpmDisplay.textContent = wpmInput.value;
});

fontSizeInput.addEventListener('input', () => {
  fontSizeDisplay.textContent = fontSizeInput.value;
});

// Start button
startBtn.addEventListener('click', showReader);

// Reader controls
playPauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    pause();
  } else {
    play();
  }
});

restartBtn.addEventListener('click', restart);
backBtn.addEventListener('click', showInput);
wpmDownBtn.addEventListener('click', () => adjustWpm(-10));
wpmUpBtn.addEventListener('click', () => adjustWpm(10));

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Only handle when reader is visible
  if (readerScreen.classList.contains('hidden')) return;

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      if (isPlaying) pause(); else play();
      break;
    case 'ArrowUp':
    case 'ArrowRight':
      e.preventDefault();
      adjustWpm(10);
      break;
    case 'ArrowDown':
    case 'ArrowLeft':
      e.preventDefault();
      adjustWpm(-10);
      break;
    case 'KeyR':
      e.preventDefault();
      restart();
      break;
    case 'Escape':
      e.preventDefault();
      showInput();
      break;
  }
});
