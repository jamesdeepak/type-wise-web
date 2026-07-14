// Dynamic Themes Controller

const THEMES = ['ocean', 'forest', 'sunset', 'midnight', 'minimal', 'contrast'];

function applyTheme(themeName) {
  if (!THEMES.includes(themeName)) themeName = 'ocean';

  // Apply to HTML element
  const htmlEl = document.documentElement;
  // Clear any theme class
  THEMES.forEach(t => htmlEl.classList.remove(`theme-${t}`));
  htmlEl.classList.add(`theme-${themeName}`);

  // Cache locally for immediate page transition
  localStorage.setItem('typewise_theme', themeName);
}

// Immediately load cached theme on load
(function() {
  const cached = localStorage.getItem('typewise_theme') || 'ocean';
  applyTheme(cached);
})();

// Fetch backend preference on document load if signed in
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('typewise_token');
  if (token && window.API) {
    try {
      const user = await API.getCurrentUser();
      if (user && user.theme_pref) {
        applyTheme(user.theme_pref);
      }
    } catch (e) {
      // User token might be expired, checkAuth will redirect
    }
  }
});
