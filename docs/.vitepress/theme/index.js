import DefaultTheme from 'vitepress/dist/client/theme-default'
import './custom.css'

import Badge from './components/Badge.vue';
import NotFound from './NotFound.vue';

export default {
  ...DefaultTheme,
  NotFound: NotFound,
  enhanceApp({ app }) {
    // register global components
    app.component('Badge', Badge);
  }
}