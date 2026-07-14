// Dashboard Rendering Logic

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardData();
});

// SVG Mascot Dictionary based on stage
const MascotSVGs = {
  'seedling': `
    <svg viewBox="0 0 100 100" class="mascot-svg">
      <!-- Pot -->
      <path d="M35 70 L40 90 L60 90 L65 70 Z" fill="#b45309" stroke="#78350f" stroke-width="2" />
      <rect x="30" y="65" width="40" height="6" rx="2" fill="#d97706" stroke="#78350f" stroke-width="2" />
      <!-- Soil -->
      <ellipse cx="50" cy="67" rx="16" ry="3" fill="#451a03" />
      <!-- Seedling -->
      <path d="M50 66 Q50 55 46 50 Q50 55 50 66" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" />
      <path d="M46 50 Q40 46 45 42 Q48 45 46 50" fill="#22c55e" stroke="#15803d" stroke-width="1.5" />
    </svg>
  `,
  'sprout': `
    <svg viewBox="0 0 100 100" class="mascot-svg">
      <!-- Pot -->
      <path d="M35 70 L40 90 L60 90 L65 70 Z" fill="#b45309" stroke="#78350f" stroke-width="2" />
      <rect x="30" y="65" width="40" height="6" rx="2" fill="#d97706" stroke="#78350f" stroke-width="2" />
      <!-- Soil -->
      <ellipse cx="50" cy="67" rx="16" ry="3" fill="#451a03" />
      <!-- Sprout Stem -->
      <path d="M50 66 Q50 48 52 38" fill="none" stroke="#22c55e" stroke-width="3.5" stroke-linecap="round" />
      <!-- Left Leaf -->
      <path d="M50 52 Q38 48 40 40 Q46 44 50 52" fill="#22c55e" stroke="#15803d" stroke-width="1.5" />
      <!-- Right Leaf -->
      <path d="M52 38 Q62 30 60 25 Q54 30 52 38" fill="#4ade80" stroke="#16a34a" stroke-width="1.5" />
    </svg>
  `,
  'sapling': `
    <svg viewBox="0 0 100 100" class="mascot-svg">
      <!-- Pot -->
      <path d="M35 70 L40 90 L60 90 L65 70 Z" fill="#b45309" stroke="#78350f" stroke-width="2" />
      <rect x="30" y="65" width="40" height="6" rx="2" fill="#d97706" stroke="#78350f" stroke-width="2" />
      <!-- Soil -->
      <ellipse cx="50" cy="67" rx="16" ry="3" fill="#451a03" />
      <!-- Stem/Trunk -->
      <path d="M50 66 Q48 40 50 25" fill="none" stroke="#78350f" stroke-width="4.5" stroke-linecap="round" />
      <!-- Branches & Leaves -->
      <path d="M49 48 Q35 44 32 38" fill="none" stroke="#78350f" stroke-width="3" />
      <path d="M32 38 Q25 28 35 30 Q38 36 32 38" fill="#15803d" />
      <path d="M50 36 Q64 32 68 24" fill="none" stroke="#78350f" stroke-width="3" />
      <path d="M68 24 Q75 16 68 18 Q62 22 68 24" fill="#22c55e" />
      <path d="M50 25 Q42 12 50 8 Q56 12 50 25" fill="#4ade80" />
    </svg>
  `,
  'budding-plant': `
    <svg viewBox="0 0 100 100" class="mascot-svg">
      <!-- Pot -->
      <path d="M35 70 L40 90 L60 90 L65 70 Z" fill="#b45309" stroke="#78350f" stroke-width="2" />
      <rect x="30" y="65" width="40" height="6" rx="2" fill="#d97706" stroke="#78350f" stroke-width="2" />
      <!-- Soil -->
      <ellipse cx="50" cy="67" rx="16" ry="3" fill="#451a03" />
      <!-- Stem -->
      <path d="M50 66 Q46 35 50 20" fill="none" stroke="#78350f" stroke-width="5" stroke-linecap="round" />
      <!-- Leaves -->
      <path d="M48 44 C35 44 30 30 40 32" fill="#15803d" stroke="#14532d" />
      <path d="M51 32 C65 32 70 20 60 22" fill="#22c55e" stroke="#16a34a" />
      <!-- Flower Bud -->
      <circle cx="50" cy="20" r="8" fill="#f43f5e" />
      <path d="M46 16 C48 10 52 10 54 16 Z" fill="#fb7185" />
      <path d="M50 20 C42 18 42 22 50 20 Z" fill="#f43f5e" />
    </svg>
  `,
  'young-tree': `
    <svg viewBox="0 0 100 100" class="mascot-svg">
      <!-- Soil -->
      <ellipse cx="50" cy="85" rx="30" ry="6" fill="#451a03" />
      <!-- Trunk -->
      <path d="M50 85 L46 50 L54 50 Z" fill="#78350f" />
      <path d="M48 55 Q35 45 28 42" fill="none" stroke="#78350f" stroke-width="4.5" />
      <path d="M52 50 Q65 42 72 38" fill="none" stroke="#78350f" stroke-width="4.5" />
      <!-- Foliage Spheres -->
      <circle cx="48" cy="36" r="18" fill="#15803d" opacity="0.9" />
      <circle cx="30" cy="40" r="14" fill="#166534" opacity="0.85" />
      <circle cx="68" cy="36" r="15" fill="#22c55e" opacity="0.9" />
      <circle cx="50" cy="22" r="12" fill="#4ade80" opacity="0.9" />
    </svg>
  `,
  'flowering-tree': `
    <svg viewBox="0 0 100 100" class="mascot-svg">
      <!-- Soil -->
      <ellipse cx="50" cy="85" rx="30" ry="6" fill="#451a03" />
      <!-- Trunk -->
      <path d="M50 85 L45 45 L55 45 Z" fill="#78350f" />
      <!-- Foliage -->
      <circle cx="50" cy="38" r="22" fill="#166534" />
      <circle cx="34" cy="38" r="16" fill="#15803d" />
      <circle cx="66" cy="36" r="16" fill="#22c55e" />
      <!-- Flowers (pink blossoms) -->
      <circle cx="50" cy="32" r="4" fill="#fda4af" />
      <circle cx="48" cy="32" r="2" fill="#f43f5e" />
      <circle cx="38" cy="30" r="4" fill="#fda4af" />
      <circle cx="36" cy="30" r="2" fill="#f43f5e" />
      <circle cx="60" cy="40" r="4" fill="#fda4af" />
      <circle cx="58" cy="40" r="2" fill="#f43f5e" />
      <circle cx="64" cy="28" r="4" fill="#fda4af" />
      <circle cx="62" cy="28" r="2" fill="#f43f5e" />
    </svg>
  `,
  'forest-guardian': `
    <svg viewBox="0 0 100 100" class="mascot-svg">
      <!-- Soil/Grass -->
      <ellipse cx="50" cy="85" rx="36" ry="8" fill="#15803d" />
      <!-- Trunk -->
      <path d="M50 85 L44 40 L56 40 Z" fill="#451a03" stroke="#1c1917" stroke-width="1.5" />
      <!-- Heavy Canopy -->
      <circle cx="50" cy="36" r="26" fill="#14532d" />
      <circle cx="28" cy="42" r="20" fill="#15803d" />
      <circle cx="72" cy="42" r="20" fill="#166534" />
      <circle cx="50" cy="18" r="16" fill="#22c55e" />
      <!-- Glowing stars/lights -->
      <polygon points="50,8 52,13 57,13 53,16 55,21 50,18 45,21 47,16 43,13 48,13" fill="#f59e0b" />
      <circle cx="32" cy="36" r="2" fill="#ffffff" />
      <circle cx="64" cy="30" r="2" fill="#ffffff" />
      <circle cx="48" cy="48" r="2.5" fill="#f59e0b" />
    </svg>
  `
};

async function loadDashboardData() {
  try {
    const data = await API.getDashboardStats();

    // 1. Sidebar profile details
    document.getElementById('nav-username').textContent = data.user.name;
    document.getElementById('nav-xp').textContent = `${data.mascot.xp} XP`;
    document.getElementById('nav-avatar').textContent = data.user.name.charAt(0).toUpperCase();

    // 2. Greeting Header
    document.getElementById('welcome-message').textContent = `Hello, ${data.user.name}!`;

    // 3. Stat pills
    document.getElementById('stat-wpm').textContent = data.stats.avgWpm;
    document.getElementById('stat-accuracy').textContent = `${data.stats.avgAccuracy}%`;
    
    // Format lifetime typing time
    const timeMins = Math.round(data.stats.totalTime / 60);
    document.getElementById('stat-time').textContent = `${timeMins}m`;

    document.getElementById('stat-goal-pct').textContent = `${data.stats.goalProgress}%`;

    // 4. Mascot
    document.getElementById('mascot-stage').textContent = data.mascot.stage;
    document.getElementById('mascot-level').textContent = `Level ${data.mascot.level}`;
    document.getElementById('mascot-xp-fill').style.width = `${data.mascot.percent}%`;
    document.getElementById('mascot-xp-label').textContent = `${data.mascot.xp - data.mascot.xpForCurrent} / ${data.mascot.xpNeededForNext} XP`;
    
    // Inject mascot SVG
    const svgCode = MascotSVGs[data.mascot.mascotSvg] || MascotSVGs['seedling'];
    document.getElementById('mascot-svg-wrapper').innerHTML = svgCode;

    // 5. Daily Goal circular progress
    document.getElementById('goal-minutes').textContent = data.stats.todayMinutes;
    document.getElementById('goal-target').textContent = `/ ${data.user.daily_goal_minutes}m`;
    
    // Speedometer offset: stroke-dasharray = 314 (approx 2 * PI * r)
    // offset = 314 - (314 * progress_pct / 100)
    const goalCircle = document.getElementById('goal-circle');
    const offset = 314 - (314 * data.stats.goalProgress / 100);
    goalCircle.style.strokeDashoffset = offset;

    // 6. Achievements strip
    const strip = document.getElementById('achievements-strip');
    if (data.achievements && data.achievements.length > 0) {
      strip.innerHTML = '';
      data.achievements.forEach(ach => {
        const item = document.createElement('div');
        item.className = 'stat-pill';
        item.style.padding = '12px 16px';
        item.style.backgroundColor = 'var(--bg-app)';
        item.innerHTML = `
          <div class="stat-icon" style="width: 36px; height: 36px; font-size: 16px; background-color: var(--bg-card); color: var(--accent);">
            <i data-lucide="${ach.icon}"></i>
          </div>
          <div>
            <h5 style="font-size: 13px; font-weight: 700;">${ach.title}</h5>
            <p style="font-size: 11px; color: var(--text-muted);">${ach.description}</p>
          </div>
        `;
        strip.appendChild(item);
      });
    }

    // 7. Find next lesson to practice
    const lessons = await API.getLessons();
    // Find first lesson with complete < 100
    let continueLesson = lessons.find(l => l.percent_complete < 100);
    if (!continueLesson && lessons.length > 0) {
      continueLesson = lessons[0]; // defaults back to first if all completed
    }

    if (continueLesson) {
      document.getElementById('continue-lesson-title').textContent = continueLesson.title;
      // Get brief summary of category
      let catText = 'Learn the keys';
      if (continueLesson.category === 'speed') catText = 'Speed building drill';
      if (continueLesson.category === 'coding') catText = 'Developer syntax drill';

      document.getElementById('continue-lesson-desc').textContent = `${catText} • ${continueLesson.percent_complete}% completed`;

      // Set launch link
      document.getElementById('btn-continue-lesson').onclick = () => {
        location.href = `lessons.html?id=${continueLesson.id}`;
      };
    } else {
      document.getElementById('continue-lesson-title').textContent = 'No Lessons Seeded';
    }

    // Trigger icon generation
    if (window.lucide) {
      window.lucide.createIcons();
    }

  } catch (err) {
    console.error('Failed to load dashboard data:', err);
    API.showToast('Error', 'Failed to retrieve dashboard metrics.', 'error');
  }
}
