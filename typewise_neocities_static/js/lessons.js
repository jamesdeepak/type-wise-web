// Lessons page controller & workspace integrator

let allLessons = [];
let allPassages = [];
let activeCategory = 'all';
let activeDifficulty = 'all';

let activeEngine = null;
let activeSessionType = 'lesson'; // 'lesson' or 'passage' or 'custom'
let activeReferenceId = null;
let activePassageFact = '';

// Preferences cached locally
let soundEnabled = true;
let readAloudEnabled = false;
let userLayout = 'QWERTY';

document.addEventListener('DOMContentLoaded', async () => {
  await loadUserData();
  await loadCatalogData();
  setupWorkspaceKeyboard();
  checkUrlParams();
});

async function loadUserData() {
  if (window.API) {
    try {
      const user = await API.getCurrentUser();
      document.getElementById('nav-username').textContent = user.name;
      document.getElementById('nav-xp').textContent = `${user.xp} XP`;
      document.getElementById('nav-avatar').textContent = user.name.charAt(0).toUpperCase();
      userLayout = user.layout_pref || 'QWERTY';
    } catch (e) {
      // Redirect handled by checkAuth in api.js
    }
  }
}

async function loadCatalogData() {
  try {
    allLessons = await API.getLessons();
    allPassages = await API.getPassages('all', 'all');
    renderCatalog();
  } catch (err) {
    console.error(err);
    API.showToast('Error', 'Failed to retrieve lessons catalog.', 'error');
  }
}

function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const lessonId = params.get('id');
  if (lessonId) {
    setTimeout(() => {
      startLesson(Number(lessonId));
    }, 400);
  }
}

// Render lessons and facts catalog cards
function renderCatalog() {
  const container = document.getElementById('lessons-grid-container');
  container.innerHTML = '';

  // 1. Render Predefined Lessons (Keys, Speed, Coding)
  if (activeCategory === 'all' || ['keys', 'speed', 'coding'].includes(activeCategory)) {
    const filteredLessons = allLessons.filter(l => activeCategory === 'all' || l.category === activeCategory);
    
    filteredLessons.forEach(les => {
      const card = document.createElement('div');
      card.className = 'card lesson-card';
      
      let catName = 'Keys';
      if (les.category === 'speed') catName = 'Speed';
      if (les.category === 'coding') catName = 'Code';

      card.innerHTML = `
        <div>
          <div class="lesson-card-header">
            <span class="lesson-type-badge">${catName} Drill</span>
            <span style="font-size: 12px; color: var(--text-muted); font-weight: 600;">Lesson ${les.ord}</span>
          </div>
          <h3 class="lesson-title">${les.title}</h3>
          <div class="lesson-progress-bar-bg">
            <div class="lesson-progress-bar-fill" style="width: ${les.percent_complete}%"></div>
          </div>
          <span style="font-size: 12px; color: var(--text-muted);">${les.percent_complete}% Complete</span>
        </div>
        <div style="margin-top: 14px;">
          <button class="btn btn-accent" style="width: 100%; justify-content: center; padding: 8px;" onclick="startLesson(${les.id})">
            Start <i data-lucide="play" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // 2. Render Fact Passages (Real-World Facts)
  if (activeCategory === 'all' || activeCategory === 'real-world') {
    // Filter passages by category & difficulty
    const filteredPassages = allPassages.filter(p => {
      const matchDiff = activeDifficulty === 'all' || p.difficulty === activeDifficulty;
      return matchDiff;
    });

    filteredPassages.forEach(pas => {
      const card = document.createElement('div');
      card.className = 'card lesson-card';
      
      let diffColor = 'var(--success)';
      if (pas.difficulty === 'medium') diffColor = 'var(--accent)';
      if (pas.difficulty === 'hard') diffColor = 'var(--error)';

      card.innerHTML = `
        <div>
          <div class="lesson-card-header">
            <span class="lesson-type-badge">${pas.category} fact</span>
            <span style="font-size: 11px; background: rgba(0,0,0,0.05); padding: 2px 6px; border-radius: 4px; color: ${diffColor}; font-weight: 700; text-transform: uppercase;">
              ${pas.difficulty}
            </span>
          </div>
          <h3 class="lesson-title" style="font-size: 15px; line-height: 1.4; height: 64px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
            ${pas.text.substring(0, 60)}...
          </h3>
          <span style="font-size: 12px; color: var(--text-muted); display: block; margin-top: 8px;">${pas.word_count} Words</span>
        </div>
        <div style="margin-top: 14px;">
          <button class="btn btn-primary" style="width: 100%; justify-content: center; padding: 8px; background: var(--primary-gradient);" onclick="startPassage(${pas.id})">
            Start Fact <i data-lucide="book-open" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Re-generate icons inside injected elements
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Category filter
function filterCatalog(category, buttonEl) {
  activeCategory = category;
  
  // Highlight active button
  const btns = document.querySelectorAll('.lesson-categories .lesson-category-btn');
  btns.forEach(btn => btn.classList.remove('active'));
  buttonEl.classList.add('active');

  renderCatalog();
}

// Difficulty dropdown filter
function handleDiffFilter() {
  activeDifficulty = document.getElementById('select-difficulty-filter').value;
  renderCatalog();
}

// Custom practice modal controls
function openCustomPracticeDialog() {
  document.getElementById('custom-practice-modal').style.display = 'flex';
}

function closeCustomPracticeDialog() {
  document.getElementById('custom-practice-modal').style.display = 'none';
}

function startCustomPractice() {
  const text = document.getElementById('custom-text-input').value.trim();
  if (!text) {
    API.showToast('Input Required', 'Please paste some text to practice typing.', 'error');
    return;
  }
  
  closeCustomPracticeDialog();
  activeSessionType = 'custom';
  activeReferenceId = null;
  activePassageFact = 'Custom user-pasted practice text.';
  
  launchWorkspace(text, 'Custom Practice');
}

// Surprise me trigger
async function loadSurpriseMe() {
  try {
    const passage = await API.getRandomPassage('all', 'all');
    activeSessionType = 'passage';
    activeReferenceId = passage.id;
    activePassageFact = passage.fact_summary;
    launchWorkspace(passage.text, `${passage.category.toUpperCase()} Fact: Did You Know?`);
  } catch (e) {
    API.showToast('Error', 'Failed to shuffle surprise fact.', 'error');
  }
}

// Launch workspace engine
function launchWorkspace(text, title) {
  document.getElementById('catalog-section').style.display = 'none';
  const workspace = document.getElementById('workspace-section');
  workspace.style.display = 'flex';
  document.getElementById('workspace-title').textContent = title;

  // Reset live metrics UI
  document.getElementById('live-wpm').textContent = '0 WPM';
  document.getElementById('live-accuracy').textContent = '100%';

  // Instantiate engine
  const box = document.getElementById('typing-box');
  activeEngine = new TypingEngine(text, box, {
    soundEnabled,
    readAloudEnabled,
    keyboardLayout: userLayout,
    onUpdate: (state) => {
      document.getElementById('live-wpm').textContent = `${state.wpm} WPM`;
      document.getElementById('live-accuracy').textContent = `${state.accuracy}%`;
      highlightOverlay(state.nextChar);
    },
    onComplete: (state) => {
      finishPractice(state);
    }
  });

  // Highlight initial character
  highlightOverlay(text.charAt(0));

  // Focus the input area
  box.focus();
}

function startLesson(id) {
  const les = allLessons.find(l => l.id === id);
  if (!les) return;
  activeSessionType = 'lesson';
  activeReferenceId = les.id;
  activePassageFact = `Successfully completed Touch Typing Lesson ${les.ord}: ${les.title}!`;
  launchWorkspace(les.text, les.title);
}

function startPassage(id) {
  const pas = allPassages.find(p => p.id === id);
  if (!pas) return;
  activeSessionType = 'passage';
  activeReferenceId = pas.id;
  activePassageFact = pas.fact_summary;
  launchWorkspace(pas.text, `${pas.category.toUpperCase()} Fact: Did You Know?`);
}

function restartLesson() {
  document.getElementById('recap-modal-element').style.display = 'none';
  if (activeEngine) {
    activeEngine.reset(activeEngine.text);
    document.getElementById('live-wpm').textContent = '0 WPM';
    document.getElementById('live-accuracy').textContent = '100%';
    highlightOverlay(activeEngine.text.charAt(0));
    document.getElementById('typing-box').focus();
  }
}

function exitWorkspace() {
  document.getElementById('recap-modal-element').style.display = 'none';
  document.getElementById('workspace-section').style.display = 'none';
  document.getElementById('catalog-section').style.display = 'flex';
  
  if (activeEngine) {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    activeEngine = null;
  }
  
  loadCatalogData();
  loadUserData();
}

// Capture Keyboard keydown
function setupWorkspaceKeyboard() {
  const box = document.getElementById('typing-box');
  
  // Intercept normal browser key events
  box.addEventListener('keydown', (e) => {
    if (!activeEngine || activeEngine.isFinished) return;

    // Prevent scrolling with Space, arrow keys, Tab etc inside editor
    if (e.key === ' ' || e.key === 'Tab' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }

    let char = e.key;

    // Translate special keys
    if (char === 'Enter') char = '\n';
    if (char === 'Spacebar') char = ' ';

    // Ignore commands like Control, Shift, Alt, Meta, CapsLock, F1-F12
    if (e.ctrlKey || e.altKey || e.metaKey || char.length > 1) {
      if (char !== '\n') return; // let Enter slide through
    }

    activeEngine.handleInput(char);
  });
}

// Highlight keyboard and fingers overlay
function highlightOverlay(nextChar) {
  // 1. Clear previous highlights
  document.querySelectorAll('#visual-keyboard .key').forEach(k => k.classList.remove('active'));
  document.querySelectorAll('.finger-dot').forEach(dot => dot.setAttribute('fill', 'none'));

  if (!nextChar) return;

  // Translate lowercase target for on-screen keyboard selector
  let charKey = nextChar.toLowerCase();
  
  // Spaces, enter translations
  if (charKey === '\n') charKey = 'enter';
  if (charKey === ' ') charKey = 'space';

  // Highlight Key
  let keyEl = document.getElementById(`key-${charKey}`);
  if (!keyEl && charKey.length === 1) {
    // try fallback direct matching e.g. symbols
    keyEl = Array.from(document.querySelectorAll('#visual-keyboard .key')).find(el => el.textContent.toLowerCase() === charKey);
  }
  
  if (keyEl) {
    keyEl.classList.add('active');
  }

  // 2. Highlight correct finger
  const finger = TypingEngine.getFingerForChar(nextChar, userLayout);
  if (finger) {
    // Translate "Left Pinky" -> "dot-left-pinky"
    const dotId = `dot-${finger.toLowerCase().replace(' ', '-')}`;
    const dotEl = document.getElementById(dotId);
    if (dotEl) {
      dotEl.setAttribute('fill', 'var(--primary)');
    }
  }
}

// Sound preferences toggles
function toggleSound(btn) {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    btn.innerHTML = '<i data-lucide="volume-2"></i> Sound On';
    btn.classList.remove('active');
  } else {
    btn.innerHTML = '<i data-lucide="volume-x"></i> Sound Off';
    btn.classList.add('active');
  }
  if (activeEngine) activeEngine.options.soundEnabled = soundEnabled;
  if (window.lucide) window.lucide.createIcons();
}

function toggleReadAloud(btn) {
  readAloudEnabled = !readAloudEnabled;
  if (readAloudEnabled) {
    btn.innerHTML = '<i data-lucide="audio-lines"></i> Read Aloud On';
    btn.classList.add('active');
    
    // Immediately read if workspace active
    if (activeEngine && activeEngine.isStarted && !activeEngine.isFinished) {
      activeEngine.speakText(activeEngine.text);
    }
  } else {
    btn.innerHTML = '<i data-lucide="audio-lines"></i> Read Aloud Off';
    btn.classList.remove('active');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
  if (activeEngine) activeEngine.options.readAloudEnabled = readAloudEnabled;
  if (window.lucide) window.lucide.createIcons();
}

// Log results & render complete recap card
async function finishPractice(state) {
  try {
    // 1. Submit session metrics
    const stats = {
      type: activeSessionType,
      referenceId: activeReferenceId,
      wpm: state.wpm,
      accuracy: state.accuracy,
      duration: state.elapsed,
      errors: state.errors,
      heatmap: state.keyErrors
    };

    const res = await API.submitSession(stats);

    // 2. Submit lesson progress if session is a lesson
    if (activeSessionType === 'lesson') {
      await API.submitLessonProgress(activeReferenceId, 100);
    }

    // 3. Render complete recap modal
    document.getElementById('recap-fact-text').textContent = activePassageFact;
    document.getElementById('recap-wpm').textContent = `${state.wpm} WPM`;
    document.getElementById('recap-accuracy').textContent = `${state.accuracy}%`;

    document.getElementById('recap-modal-element').style.display = 'flex';

    // 4. Achievement Toast Notifications
    if (res.newlyUnlocked && res.newlyUnlocked.length > 0) {
      res.newlyUnlocked.forEach(code => {
        // Show customized toasts
        API.showToast('Achievement Unlocked!', `Earned badge: ${code.replace('_', ' ')}`, 'achievement');
      });
    }

    if (res.levelUp) {
      API.showToast('Level Up!', `Congratulations! You reached Level ${res.currentLevel}! Mascot stage: ${res.mascotStage}`, 'achievement');
    }

  } catch (err) {
    console.error(err);
    API.showToast('Submission Error', 'Failed to store practice metrics.', 'error');
  }
}
