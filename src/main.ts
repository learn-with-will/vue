import { createApp } from 'vue';
import './index.css';
import App from './App.vue';
import { router } from './router';
// Import the theme store so its module-load side effect (apply saved theme to
// <html>) runs as the app boots.
import './core/stores/theme';

createApp(App).use(router).mount('#app');
