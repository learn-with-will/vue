import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// Route components are lazy-loaded (code-split): each becomes its own chunk,
// fetched on first navigation — the Vue-Router equivalent of React's lazy routes.
const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('../features/home/HomeView.vue') },
  { path: '/roadmap', name: 'roadmap', component: () => import('../features/roadmap/RoadmapView.vue') },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../features/dashboard/DashboardView.vue'),
  },
  {
    path: '/bookmarks',
    name: 'bookmarks',
    component: () => import('../features/bookmarks/BookmarksView.vue'),
  },
  { path: '/search', name: 'search', component: () => import('../features/search/SearchView.vue') },
  {
    path: '/lesson/:slug',
    name: 'lesson',
    component: () => import('../features/lesson/LessonView.vue'),
  },
  {
    path: '/lesson/:slug/quiz',
    name: 'quiz',
    component: () => import('../features/quiz/QuizView.vue'),
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

export const router = createRouter({
  // BASE_URL is "/" in dev and "/<repo>/" on GitHub Pages, so deep links resolve
  // under the sub-path.
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    // Scroll to a hash target (e.g. a table-of-contents link). Lesson markdown is
    // rendered asynchronously and its heading ids only appear after render, so poll
    // briefly for the element before giving up.
    if (to.hash) {
      return new Promise((resolve) => {
        const id = decodeURIComponent(to.hash.slice(1));
        let tries = 0;
        const find = () => {
          const el = document.getElementById(id);
          if (el) {
            resolve({ el, top: 80, behavior: 'smooth' });
            return;
          }
          if (tries++ < 30) window.setTimeout(find, 100);
          else resolve({ top: 0 });
        };
        find();
      });
    }
    if (savedPosition) return savedPosition;
    return { top: 0, left: 0 };
  },
});
