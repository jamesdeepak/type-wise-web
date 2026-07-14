// Arcade Games Logic Controller

let activeGame = '';
let gameScore = 0;
let gameLives = 3;
let gameIntervals = [];
let gameActive = false;

// WORD RAIN STATE
let rainWords = [];
let activeRainTarget = null;
let rainInputBuffer = '';

// KEY NINJA STATE
let ninjaTargetChar = '';

// RACE TRACK STATE
let raceEngine = null;
let raceGhostPct = 0;
let raceInterval = null;

// FACT MATCH STATE
const triviaQuestions = [
  { sentence: 'The blue whale is the largest animal, with a tongue that weighs as much as an adult...', blank: 'elephant', hint: 'starts with e' },
  { sentence: 'Light from the Sun takes approximately... minutes to reach Earth.', blank: 'eight', hint: 'starts with e (spell out the number)' },
  { sentence: 'Venus is the hottest planet in our solar system because of its greenhouse atmosphere of...', blank: 'carbon dioxide', hint: 'greenhouse gas (two words)' },
  { sentence: 'Octopuses have blue blood and... hearts.', blank: 'three', hint: 'starts with t (spell out)' },
  { sentence: 'Bananas are radioactive because they contain high levels of...', blank: 'potassium', hint: 'starts with p' },
  { sentence: 'The Great Pyramid of Giza was built as a tomb for Egyptian Pharaoh...', blank: 'khufu', hint: 'starts with k' },
  { sentence: 'The electric chair was invented in 1881 by a...', blank: 'dentist', hint: 'starts with d' },
  { sentence: 'Wombat feces are...-shaped to stop them from rolling away.', blank: 'cube', hint: 'starts with c' }
];
let currentTriviaIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  loadUserData();
});

async function loadUserData() {
  if (window.API) {
    try {
      const user = await API.getCurrentUser();
      document.getElementById('nav-username').textContent = user.name;
      document.getElementById('nav-xp').textContent = `${user.xp} XP`;
      document.getElementById('nav-avatar').textContent = user.name.charAt(0).toUpperCase();
    } catch (e) {
      // ignore
    }
  }
}

// Global launch game router
async function launchGame(gameId) {
  activeGame = gameId;
  gameScore = 0;
  gameLives = 3;
  gameActive = true;
  gameIntervals = [];

  document.getElementById('menu-section').style.display = 'none';
  document.getElementById('play-section').style.display = 'flex';
  
  // Hide all boards
  document.getElementById('board-word-rain').style.display = 'none';
  document.getElementById('board-key-ninja').style.display = 'none';
  document.getElementById('board-race-track').style.display = 'none';
  document.getElementById('board-fact-match').style.display = 'none';

  // Set title & reset stats bar
  document.getElementById('game-score').textContent = '0';
  document.getElementById('game-lives').textContent = '♥♥♥';
  document.getElementById('game-lives-wrapper').style.display = 'block';

  // Bind key handlers
  window.addEventListener('keydown', handleGameKeys);

  if (gameId === 'word-rain') {
    document.getElementById('game-title').textContent = 'Word Rain';
    document.getElementById('game-subtext').textContent = 'Type falling words before they hit the ground!';
    document.getElementById('board-word-rain').style.display = 'flex';
    await startWordRain();
  } else if (gameId === 'key-ninja') {
    document.getElementById('game-title').textContent = 'Key Ninja';
    document.getElementById('game-subtext').textContent = 'Press the matching key shown on the bubble!';
    document.getElementById('board-key-ninja').style.display = 'flex';
    startKeyNinja();
  } else if (gameId === 'race-track') {
    document.getElementById('game-title').textContent = 'Race Track';
    document.getElementById('game-subtext').textContent = 'Type the passage to accelerate your car! Beat the ghost (40 WPM).';
    document.getElementById('board-race-track').style.display = 'flex';
    document.getElementById('game-lives-wrapper').style.display = 'none'; // no lives in race
    await startRaceTrack();
  } else if (gameId === 'fact-match') {
    document.getElementById('game-title').textContent = 'Fact Match';
    document.getElementById('game-subtext').textContent = 'Recall and type the missing word from the trivia fact!';
    document.getElementById('board-fact-match').style.display = 'flex';
    document.getElementById('game-lives-wrapper').style.display = 'none'; // no lives, speed challenge
    startFactMatch();
  }
}

function exitGame() {
  gameActive = false;
  window.removeEventListener('keydown', handleGameKeys);
  
  // Clear all game timers
  gameIntervals.forEach(clearInterval);
  gameIntervals = [];

  if (raceInterval) {
    clearInterval(raceInterval);
    raceInterval = null;
  }

  // Clear Word Rain elements
  const container = document.getElementById('rain-screen-container');
  if (container) container.innerHTML = '';

  document.getElementById('play-section').style.display = 'none';
  document.getElementById('menu-section').style.display = 'flex';
  
  loadUserData();
}

function handleGameKeys(e) {
  if (!gameActive) return;

  // Prevent browser scrolling with spacebar
  if (e.key === ' ' || e.key === 'Tab') {
    e.preventDefault();
  }

  const char = e.key.toLowerCase();

  if (activeGame === 'word-rain') {
    handleWordRainKey(char);
  } else if (activeGame === 'key-ninja') {
    handleKeyNinjaKey(char);
  }
}

// ----------------------------------------------------
// GAME 1: WORD RAIN
// ----------------------------------------------------
async function startWordRain() {
  // Load rain vocabulary from facts passages
  try {
    const passages = await API.getPassages('all', 'all');
    // Extract unique words, length 4-9 chars
    const words = [];
    passages.forEach(p => {
      p.text.split(/\s+/).forEach(w => {
        const clean = w.replace(/[^a-zA-Z]/g, '').toLowerCase();
        if (clean.length >= 4 && clean.length <= 8 && !words.includes(clean)) {
          words.push(clean);
        }
      });
    });
    rainWords = words.length > 0 ? words : ['apple', 'space', 'history', 'planet', 'ocean', 'turtles'];
  } catch (e) {
    rainWords = ['apple', 'space', 'history', 'planet', 'ocean', 'turtles'];
  }

  const screen = document.getElementById('rain-screen-container');
  screen.innerHTML = '';
  activeRainTarget = null;
  rainInputBuffer = '';

  // Spawner loop: spawn word every 1.8 seconds
  const spawnTimer = setInterval(() => {
    if (!gameActive) return;
    spawnFallingWord();
  }, 1800);
  gameIntervals.push(spawnTimer);

  // Physics loop: move words down every 50ms
  const physicsTimer = setInterval(() => {
    if (!gameActive) return;
    moveFallingWords();
  }, 50);
  gameIntervals.push(physicsTimer);
}

function spawnFallingWord() {
  const container = document.getElementById('rain-screen-container');
  const word = rainWords[Math.floor(Math.random() * rainWords.length)];
  
  const el = document.createElement('div');
  el.className = 'word-rain-bubble';
  el.textContent = word;
  el.style.left = `${Math.floor(Math.random() * 80) + 10}%`; // 10% to 90%
  el.style.top = '0px';
  
  // Custom properties to track Y coordinate
  el.dataset.y = 0;
  el.dataset.word = word;
  el.dataset.typed = 0; // characters completed

  container.appendChild(el);
}

function moveFallingWords() {
  const container = document.getElementById('rain-screen-container');
  const bubbles = container.querySelectorAll('.word-rain-bubble');
  
  bubbles.forEach(el => {
    let y = parseFloat(el.dataset.y);
    // speed multiplier based on score
    const speed = 1.5 + (gameScore / 100); 
    y += speed;
    el.dataset.y = y;
    el.style.top = `${y}px`;

    // Reached bottom (360px limit)
    if (y >= 360) {
      el.remove();
      loseLife();
      
      // Reset active target if this was it
      if (activeRainTarget === el) {
        activeRainTarget = null;
        rainInputBuffer = '';
      }
    }
  });
}

function handleWordRainKey(char) {
  const container = document.getElementById('rain-screen-container');
  const bubbles = Array.from(container.querySelectorAll('.word-rain-bubble'));

  if (!activeRainTarget) {
    // Find a bubble starting with this key
    const match = bubbles.find(el => el.dataset.word.startsWith(char));
    if (match) {
      activeRainTarget = match;
      activeRainTarget.classList.add('active-target');
      rainInputBuffer = char;
      activeRainTarget.dataset.typed = 1;
      // Highlight completed character in HTML
      highlightRainTarget();
    }
  } else {
    // We have an active target, check next character
    const word = activeRainTarget.dataset.word;
    const typedIndex = parseInt(activeRainTarget.dataset.typed);
    const expectedChar = word[typedIndex];

    if (char === expectedChar) {
      rainInputBuffer += char;
      activeRainTarget.dataset.typed = typedIndex + 1;
      highlightRainTarget();

      // Word fully completed
      if (rainInputBuffer === word) {
        activeRainTarget.remove();
        activeRainTarget = null;
        rainInputBuffer = '';
        gameScore += 10;
        document.getElementById('game-score').textContent = gameScore;
      }
    } else {
      // Mismatch error beep
      if (window.TypingEngine) {
        // play simple audio glitch
      }
    }
  }
}

function highlightRainTarget() {
  if (!activeRainTarget) return;
  const word = activeRainTarget.dataset.word;
  const typedCount = parseInt(activeRainTarget.dataset.typed);
  
  // Highlight completed string segment in yellow
  activeRainTarget.innerHTML = `<span style="color: var(--accent);">${word.substring(0, typedCount)}</span>${word.substring(typedCount)}`;
}

// ----------------------------------------------------
// GAME 2: KEY NINJA
// ----------------------------------------------------
function startKeyNinja() {
  spawnNinjaKey();
}

function spawnNinjaKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  ninjaTargetChar = chars[Math.floor(Math.random() * chars.length)];
  
  const bubble = document.getElementById('ninja-bubble');
  bubble.textContent = ninjaTargetChar.toUpperCase();
  
  // Animate with bounce/flash by resetting class
  bubble.style.animation = 'none';
  bubble.offsetHeight; /* trigger reflow */
  bubble.style.animation = null;
}

function handleKeyNinjaKey(char) {
  if (char === ninjaTargetChar) {
    // Sliced! Add score
    gameScore += 5;
    document.getElementById('game-score').textContent = gameScore;
    
    // Spawn next
    spawnNinjaKey();
  } else {
    // Wrong key
    loseLife();
  }
}

// ----------------------------------------------------
// GAME 3: RACE TRACK
// ----------------------------------------------------
async function startRaceTrack() {
  try {
    const passages = await API.getPassages('all', 'all');
    const randomPassage = passages[Math.floor(Math.random() * passages.length)];

    // Reset cars left offsets
    const carPlayer = document.getElementById('car-player');
    const carGhost = document.getElementById('car-ghost');
    carPlayer.style.left = '0%';
    carGhost.style.left = '0%';

    raceGhostPct = 0;

    // Launch typing engine in the race text field
    const box = document.getElementById('race-typing-box');
    raceEngine = new TypingEngine(randomPassage.text, box, {
      soundEnabled: true,
      onUpdate: (state) => {
        // Map typing progress % to car position
        carPlayer.style.left = `${Math.min(90, state.progress)}%`;
      },
      onComplete: (state) => {
        endRace(true);
      }
    });

    box.focus();

    // Start ghost movement interval simulating 40 WPM (moves roughly 1% every 300ms)
    // 40 WPM = 200 CPM. 200 chars / min = 3.3 chars per sec.
    // % movement per second = 3.3 / total_chars * 100
    const textLen = randomPassage.text.length;
    const ghostIncrement = (3.3 / textLen) * 100;

    raceInterval = setInterval(() => {
      if (!gameActive) return;
      
      // Only start ghost moving once player starts typing
      if (raceEngine && raceEngine.isStarted) {
        raceGhostPct += ghostIncrement;
        carGhost.style.left = `${Math.min(90, raceGhostPct)}%`;

        if (raceGhostPct >= 99) {
          endRace(false);
        }
      }
    }, 1000);

  } catch (e) {
    console.error(e);
    API.showToast('Error', 'Failed to configure Race Track.', 'error');
  }
}

function endRace(playerWon) {
  clearInterval(raceInterval);
  raceInterval = null;

  if (playerWon) {
    const finalWpm = raceEngine.getState().wpm;
    API.showToast('You Won!', `You beat the ghost at ${finalWpm} WPM!`, 'success');
    gameScore = 100;
  } else {
    API.showToast('You Lost!', 'The ghost vehicle crossed the finish line first.', 'error');
    gameScore = 10;
  }

  document.getElementById('game-score').textContent = gameScore;
  submitGameSession(gameScore);
}

// ----------------------------------------------------
// GAME 4: FACT MATCH
// ----------------------------------------------------
function startFactMatch() {
  currentTriviaIndex = 0;
  loadTriviaQuestion();
  
  const input = document.getElementById('fact-match-input');
  input.value = '';
  input.focus();

  // Handle Enter key for typing answer
  input.onkeydown = (e) => {
    if (e.key === 'Enter') {
      submitTriviaAnswer();
    }
  };
}

function loadTriviaQuestion() {
  if (currentTriviaIndex >= triviaQuestions.length) {
    // End of questions list, finished!
    API.showToast('Trivia Champion!', `You completed all trivia blanks. Final score: ${gameScore}`, 'success');
    submitGameSession(gameScore);
    return;
  }

  const q = triviaQuestions[currentTriviaIndex];
  
  // Set blank underline
  document.getElementById('fact-match-prompt').innerHTML = q.sentence;
  document.getElementById('fact-match-hint').textContent = `Hint: ${q.hint}`;
  
  const input = document.getElementById('fact-match-input');
  input.value = '';
}

function submitTriviaAnswer() {
  const input = document.getElementById('fact-match-input');
  const answer = input.value.trim().toLowerCase();
  
  const q = triviaQuestions[currentTriviaIndex];
  if (answer === q.blank) {
    // Correct!
    gameScore += 20;
    document.getElementById('game-score').textContent = gameScore;
    API.showToast('Correct!', 'Nice knowledge recall.', 'success');
    
    currentTriviaIndex++;
    loadTriviaQuestion();
  } else {
    // Incorrect
    API.showToast('Wrong answer', 'Try looking closely at the hint.', 'error');
  }
}

// ----------------------------------------------------
// GENERAL LIFELINE / GAME OVER
// ----------------------------------------------------
function loseLife() {
  gameLives--;
  let hearts = '';
  for (let i = 0; i < gameLives; i++) hearts += '♥';
  document.getElementById('game-lives').textContent = hearts || '---';

  if (gameLives <= 0) {
    gameOver();
  }
}

function gameOver() {
  gameActive = false;
  gameIntervals.forEach(clearInterval);
  
  API.showToast('Game Over!', `Final score reached: ${gameScore}`, 'error');
  
  // Submit results as game session
  submitGameSession(gameScore);
}

async function submitGameSession(scoreValue) {
  try {
    // Submit scores as sessions to award XP!
    // WPM is scaled based on score points, duration set to 30s
    await API.submitSession({
      type: 'game',
      referenceId: null,
      wpm: Math.round(scoreValue / 2),
      accuracy: 90,
      duration: 30,
      errors: 3 - gameLives,
      heatmap: {}
    });
    
    setTimeout(() => {
      exitGame();
    }, 1500);
  } catch (err) {
    console.error('Failed to submit game score:', err);
  }
}
