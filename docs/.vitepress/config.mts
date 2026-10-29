import { fileURLToPath } from 'node:url'
import { defineConfig, HeadConfig } from 'vitepress'

const EXCLUDED_FILES: string[] = ['test.md', 'test/**']

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'goldwaterramblings',
  description: 'goldwaterramblings',
  lang: 'en-US',

  outDir: '../dist',

  markdown: {
    emoji: false,
    headers: {
      level: [1, 2],
    },
    anchor: {
      level: [1, 2],
      permalink(slug, options, state, index) {
        const h = state.tokens[index]!!
        if (h.attrs) {
          const idIndex = h.attrs.findIndex(([key]) => key === 'id')
          if (idIndex >= 0) h.attrs.splice(idIndex, 1)
        }
        h.attrPush(['data-header-id', slug])

        const a = new state.Token('html_inline', '', 0)
        a.content = `<a class="header-anchor nostyle" href="#${slug}" tabindex="-1"></a>`

        const div = new state.Token('html_inline', '', 0)
        div.content = `<div id="${slug}" class="ifuckinghatewebdev"></div>`

        state.tokens.splice(index + 2, 0, a, div)
      },

      tabIndex: false,
    },
  },

  cleanUrls: true,
  rewrites: {
    'things/:a*': ':a*',
  },
  vite: {
    resolve: {
      alias: {
        '@components': fileURLToPath(new URL('./components', import.meta.url)),
        '@data': fileURLToPath(new URL('./data', import.meta.url)),
      },
    },
  },

  head: [
    ['meta', { property: 'og:site_name', content: 'goldwaterramblings' }],
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

  transformHead(ctx) {
    function canon(relativePath: string) {
      return new URL(relativePath, 'https://goldwaterramblings.neocities.org/').href
    }

    const head: HeadConfig[] = []
    head.push(['meta', { property: 'og:url', content: canon(ctx.pageData.relativePath) }])

    const title = ctx.title.replace(' | goldwaterramblings', '')
    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:description', content: ctx.description }])

    if (ctx.pageData.filePath.startsWith('things/')) {
      head.push(['meta', { property: 'og:type', content: 'article' }])

      const thumbnail = ctx.pageData.frontmatter['thumbnail']
      if (typeof thumbnail === 'string') {
        head.push(['meta', { property: 'og:image', content: canon(thumbnail) }])
      }

      const timestamp = ctx.pageData.frontmatter['timestamp']
      if (timestamp != null) {
        head.push(['meta', { property: 'article:published_time', content: timestamp }])
      }
    }

    return head
  },

  transformHtml(code) {
    return code.replace(
      '<html',
      '<html prefix="og: https://ogp.me/ns#\narticle: https://ogp.me/ns/article#"'
    )
  },

  srcExclude: process.env.NODE_ENV === 'development' ? [] : EXCLUDED_FILES,
})
