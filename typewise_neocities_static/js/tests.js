// Typing Test page logic

let selectedTime = 60; // default 1 min
let isCustom = false;
let countdownInterval = null;
let secondsRemaining = 60;
let testStarted = false;
let testEngine = null;
let currentChart = null;

// Passage metadata used during test
let testPassagesUsed = [];

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
      // Redirect handled by checkAuth in api.js
    }
  }
}

function selectDuration(seconds, buttonEl) {
  selectedTime = seconds;
  isCustom = false;
  
  // Highlight button
  const btns = document.querySelectorAll('.test-config-container .test-time-btn');
  btns.forEach(btn => btn.classList.remove('active'));
  buttonEl.classList.add('active');

  document.getElementById('custom-duration-wrapper').style.display = 'none';
}

function selectCustomDuration(buttonEl) {
  isCustom = true;
  
  const btns = document.querySelectorAll('.test-config-container .test-time-btn');
  btns.forEach(btn => btn.classList.remove('active'));
  buttonEl.classList.add('active');

  document.getElementById('custom-duration-wrapper').style.display = 'flex';
  const sliderVal = document.getElementById('slider-duration').value;
  updateCustomDurationLabel(sliderVal);
}

function updateCustomDurationLabel(value) {
  selectedTime = Number(value);
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  let label = `${minutes}`;
  if (seconds > 0) label += `.${seconds / 30 * 5}`; // e.g. 2.5 minutes
  document.getElementById('custom-minutes-label').textContent = label;
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

async function startTest() {
  try {
    const topic = document.getElementById('select-test-topic').value;
    
    // Fetch multiple passages to ensure they don't run out of text during tests
    const passages = await API.getPassages(topic, 'all');
    if (passages.length === 0) {
      API.showToast('Error', 'No passages available for this topic.', 'error');
      return;
    }

    // Shuffle and pick 4 random passages
    const shuffled = passages.sort(() => 0.5 - Math.random());
    const selectedPassages = shuffled.slice(0, 4);
    testPassagesUsed = selectedPassages;

    // Concatenate passage texts with double spaces
    const textToType = selectedPassages.map(p => p.text).join('  ');

    // Switch screens
    document.getElementById('setup-section').style.display = 'none';
    const testSection = document.getElementById('active-test-section');
    testSection.style.display = 'flex';

    secondsRemaining = selectedTime;
    document.getElementById('test-timer').textContent = formatTime(secondsRemaining);
    document.getElementById('live-test-wpm').textContent = '0';
    document.getElementById('live-test-accuracy').textContent = '100%';

    testStarted = false;

    // Initialize engine
    const box = document.getElementById('test-typing-box');
    testEngine = new TypingEngine(textToType, box, {
      soundEnabled: true,
      readAloudEnabled: false,
      onUpdate: (state) => {
        document.getElementById('live-test-wpm').textContent = state.wpm;
        document.getElementById('live-test-accuracy').textContent = `${state.accuracy}%`;
      },
      onComplete: () => {
        finishTest();
      }
    });

    // Handle keypress to trigger timer
    const initTimerTrigger = (e) => {
      if (!testStarted && testEngine && testEngine.isStarted) {
        testStarted = true;
        startCountdown();
        window.removeEventListener('keypress', initTimerTrigger);
      }
    };
    window.addEventListener('keypress', initTimerTrigger);

    box.focus();

  } catch (err) {
    console.error(err);
    API.showToast('Error', 'Failed to initialize speed test.', 'error');
  }
}

function startCountdown() {
  countdownInterval = setInterval(() => {
    secondsRemaining--;
    document.getElementById('test-timer').textContent = formatTime(secondsRemaining);

    // Update real-time stats while ticking
    if (testEngine) {
      const state = testEngine.getState();
      document.getElementById('live-test-wpm').textContent = state.wpm;
      document.getElementById('live-test-accuracy').textContent = `${state.accuracy}%`;
    }

    if (secondsRemaining <= 0) {
      clearInterval(countdownInterval);
      finishTest();
    }
  }, 1000);
}

function abortTest() {
  clearInterval(countdownInterval);
  if (testEngine) {
    testEngine = null;
  }
  document.getElementById('active-test-section').style.display = 'none';
  document.getElementById('setup-section').style.display = 'flex';
}

async function finishTest() {
  clearInterval(countdownInterval);
  if (!testEngine) return;

  // Mark completion in engine
  testEngine.isFinished = true;
  testEngine.endTime = Date.now();

  const state = testEngine.getState();
  const timeTaken = selectedTime - secondsRemaining; // seconds

  // Final stats
  const finalWpm = testEngine.calculateWpm(timeTaken);
  const finalAccuracy = testEngine.calculateAccuracy();

  try {
    // 1. Submit session metrics
    const stats = {
      type: 'test',
      referenceId: testPassagesUsed[0]?.id || null, // logs first passage as primary ref
      wpm: finalWpm,
      accuracy: finalAccuracy,
      duration: timeTaken,
      errors: state.errors,
      heatmap: state.keyErrors
    };

    const res = await API.submitSession(stats);

    // 2. Map Results fields
    document.getElementById('res-wpm').textContent = `${finalWpm} WPM`;
    document.getElementById('res-accuracy').textContent = `${finalAccuracy}%`;
    document.getElementById('res-errors').textContent = state.errors;
    document.getElementById('res-time').textContent = `${timeTaken}s`;

    // Fact recap - use first passage's fact summary
    if (testPassagesUsed.length > 0) {
      document.getElementById('res-fact-recap').textContent = testPassagesUsed[0].fact_summary;
    } else {
      document.getElementById('res-fact-recap').textContent = 'Typing speed test completed successfully!';
    }

    // Switch screen to results
    document.getElementById('active-test-section').style.display = 'none';
    document.getElementById('results-section').style.display = 'flex';

    // 3. Achievements toasts
    if (res.newlyUnlocked && res.newlyUnlocked.length > 0) {
      res.newlyUnlocked.forEach(code => {
        API.showToast('Achievement Unlocked!', `Earned badge: ${code.replace('_', ' ')}`, 'achievement');
      });
    }

    if (res.levelUp) {
      API.showToast('Level Up!', `Congratulations! You reached Level ${res.currentLevel}!`, 'achievement');
    }

    // 4. Render Chart.js
    await renderHistoryChart();

  } catch (err) {
    console.error(err);
    API.showToast('Submission Error', 'Failed to store speed test details.', 'error');
  }
}

async function renderHistoryChart() {
  try {
    const history = await API.getStatsHistory();
    const ctx = document.getElementById('wpmHistoryChart').getContext('2d');

    // Filter only tests for history graph
    const testsOnly = history.filter(h => h.type === 'test');

    const labels = testsOnly.map(h => h.date);
    const wpmData = testsOnly.map(h => h.wpm);
    const accData = testsOnly.map(h => h.accuracy);

    // Destroy existing chart to prevent garbage overlap
    if (currentChart) {
      currentChart.destroy();
    }

    // Fetch theme primary color
    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue('--primary').trim() || '#2FA8E0';

    currentChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.slice(-10), // last 10 tests
        datasets: [
          {
            label: 'Speed (WPM)',
            data: wpmData.slice(-10),
            borderColor: primaryColor,
            backgroundColor: primaryColor + '1A', // transparent fill
            borderWidth: 3,
            tension: 0.3,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: 'Accuracy (%)',
            data: accData.slice(-10),
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.3,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Inter' }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Words Per Minute',
              font: { weight: 'bold' }
            },
            min: 0
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false // prevent grid line overlap
            },
            title: {
              display: true,
              text: 'Accuracy %',
              font: { weight: 'bold' }
            },
            min: 50,
            max: 100
          }
        }
      }
    });

  } catch (err) {
    console.error('Failed to draw chart:', err);
  }
}

function restartTestConfig() {
  document.getElementById('results-section').style.display = 'none';
  document.getElementById('setup-section').style.display = 'flex';
}

function exitResults() {
  location.href = 'dashboard.html';
}
