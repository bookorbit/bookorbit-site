import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'
import './style.css'
import CustomLayout from './CustomLayout.vue'

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
