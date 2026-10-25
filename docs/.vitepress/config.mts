import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'goldwaterramblings',
  description: 'goldwaterramblings',
  lang: 'en-US',

  outDir: '../dist',

  markdown: {
    emoji: false,
  },

  cleanUrls: true,
  rewrites: {
    'things/:a*': ':a*',
  },
  vite: {
    resolve: {
      alias: {
        '@components': fileURLToPath(new URL('./components', import.meta.url)),
      },
    },
  },

  head: [
    ['meta', { name: 'darkreader-lock' }],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
    ],
    ['manifest', { href: '/site.webmanifest' }],
  ],
})
