import { ref, computed, watch } from 'vue';

type Theme = 'light' | 'dark';
const THEME_KEY = 'vue-learning-theme';

function initial(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* ignore */
  }
  const prefersDark =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

/** Toggles `.dark` on <html> and persists the choice. */
function apply(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
}

// Module-scoped state → a single shared theme for the whole app (a composable
// "store"). Applied once at load (before the app mounts) so there is no flash,
// then re-applied whenever it changes.
const theme = ref<Theme>(initial());
apply(theme.value);
watch(theme, apply);

const isDark = computed(() => theme.value === 'dark');

function toggle(): void {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
}

export function useTheme() {
  return { theme, isDark, toggle };
}
