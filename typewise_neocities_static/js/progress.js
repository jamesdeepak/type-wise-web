// Progress and Analytics Page Integration

document.addEventListener('DOMContentLoaded', () => {
  loadProgressData();
});

async function loadProgressData() {
  try {
    // 1. Fetch Dashboard, History, and Heatmap metrics
    const dash = await API.getDashboardStats();
    const history = await API.getStatsHistory();
    const heatmaps = await API.getStatsHeatmap();

    // 2. Set profile navigation headers
    document.getElementById('nav-username').textContent = dash.user.name;
    document.getElementById('nav-xp').textContent = `${dash.mascot.xp} XP`;
    document.getElementById('nav-avatar').textContent = dash.user.name.charAt(0).toUpperCase();

    // 3. Set summary pills
    document.getElementById('stats-level').textContent = `Lvl ${dash.mascot.level} (${dash.mascot.stage})`;
    document.getElementById('stats-accuracy').textContent = `${dash.stats.avgAccuracy}%`;
    
    // Find peak speed from history
    const testRuns = history.filter(h => h.type === 'test');
    const peakWpm = testRuns.length > 0 ? Math.max(...testRuns.map(t => t.wpm)) : 0;
    document.getElementById('stats-max-wpm').textContent = `${peakWpm} WPM`;

    // Fetch achievements to count earned
    const achs = await API.getAchievements();
    const earnedCount = achs.filter(a => a.earned).length;
    document.getElementById('stats-badges').textContent = `${earnedCount} / ${achs.length}`;

    // 4. Render WPM and Accuracy line charts
    renderProgressCharts(history);

    // 5. Render activity calendar heatmap
    renderActivityCalendar(heatmaps.calendar);

    // 6. Color-code Key Error Heatmap
    colorKeyErrorHeatmap(heatmaps.keyErrors);

    // 7. Configure Certificate preview fields
    document.getElementById('cert-username').textContent = dash.user.name;
    document.getElementById('cert-wpm').textContent = `${dash.stats.avgWpm} WPM`;
    document.getElementById('cert-accuracy').textContent = `${dash.stats.avgAccuracy}%`;
    document.getElementById('cert-level').textContent = `Level ${dash.mascot.level}`;
    document.getElementById('cert-date').textContent = `Date: ${new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}`;

    // Refresh icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

  } catch (err) {
    console.error('Failed to load progress analytics:', err);
    API.showToast('Error', 'Failed to retrieve progress records.', 'error');
  }
}

function renderProgressCharts(history) {
  // Extract lists, oldest to newest
  const dataPoints = history.slice(-20); // last 20
  const labels = dataPoints.map(d => d.date);
  const wpmData = dataPoints.map(d => d.wpm);
  const accData = dataPoints.map(d => d.accuracy);

  // Color theme variables
  const style = getComputedStyle(document.documentElement);
  const primaryColor = style.getPropertyValue('--primary').trim() || '#2FA8E0';

  // Draw WPM chart
  const ctxWpm = document.getElementById('chart-wpm').getContext('2d');
  new Chart(ctxWpm, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Speed (WPM)',
        data: wpmData,
        borderColor: primaryColor,
        backgroundColor: primaryColor + '1A',
        borderWidth: 3,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { min: 0 }
      }
    }
  });

  // Draw Accuracy chart
  const ctxAcc = document.getElementById('chart-accuracy').getContext('2d');
  new Chart(ctxAcc, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Accuracy Rate (%)',
        data: accData,
        borderColor: '#10b981',
        backgroundColor: '#10b9811A',
        borderWidth: 3,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { min: 60, max: 100 }
      }
    }
  });
}

function renderActivityCalendar(calendarMap = {}) {
  const container = document.getElementById('heatmap-container');
  container.innerHTML = '';

  // Generate boxes for past 90 days
  const today = new Date();
  const dateList = [];
  
  for (let i = 90; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    dateList.push(d);
  }

  dateList.forEach(date => {
    // Format to YYYY-MM-DD matching API keys
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    const count = calendarMap[dateKey] || 0;

    const box = document.createElement('div');
    box.className = 'heatmap-day';
    
    // Set shade based on count
    if (count > 0 && count <= 2) box.classList.add('lvl-1');
    else if (count > 2 && count <= 5) box.classList.add('lvl-2');
    else if (count > 5 && count <= 8) box.classList.add('lvl-3');
    else if (count > 8) box.classList.add('lvl-4');

    // Add tooltip text
    const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    box.title = `${dateStr}: ${count} sessions completed`;

    container.appendChild(box);
  });
}

function colorKeyErrorHeatmap(keyErrors = {}) {
  // Find highest key count error value
  const values = Object.values(keyErrors);
  const maxErrors = values.length > 0 ? Math.max(...values) : 0;

  if (maxErrors === 0) return;

  // Shade keys from white to light orange to deep red depending on ratio
  for (const [key, count] of Object.entries(keyErrors)) {
    const keyEl = document.getElementById(`key-${key}`);
    if (keyEl) {
      const ratio = count / maxErrors;
      // RGBA mapping: blends soft orange to solid crimson red
      // background-color: rgba(239, 68, 68, ratio * 0.85)
      keyEl.style.backgroundColor = `rgba(239, 68, 68, ${Math.max(0.1, ratio * 0.85)})`;
      keyEl.style.color = '#ffffff';
      keyEl.style.borderColor = 'rgba(239, 68, 68, 0.9)';
      
      // tooltip showing count
      keyEl.title = `Mistyped ${count} times`;
    }
  }
}
