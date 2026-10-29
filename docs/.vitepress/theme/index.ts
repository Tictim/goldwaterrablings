import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import Card from './Card.vue'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    app.component('Card', Card)
  },
} satisfies Theme
