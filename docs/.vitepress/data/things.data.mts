import type { ContentData } from 'vitepress'
import { createContentLoader } from 'vitepress'

declare const data: ContentData[]
export { data }

export default createContentLoader('things/*.md', {
  /* excerpt(f) {
    f.excerpt = f.content
      .split('\n')
      .filter(s => s.length > 0)[0]
      ?.substring(0, 100)
  }, */
  transform(raw) {
    raw.forEach(c => {
      // why is this even a thing
      c.excerpt = c.excerpt?.replaceAll(/<p>|<\/p>|\n/g, '')
      const timestamp = new Date(c.frontmatter['timestamp'])
      c.frontmatter['timestamp'] = isNaN(timestamp.getTime()) ? null : timestamp
    })
    raw.sort((a, b) => {
      const aDate = a.frontmatter['timestamp']
      const bDate = b.frontmatter['timestamp']
      const aTime = aDate instanceof Date ? aDate.getTime() : -Infinity
      const bTime = bDate instanceof Date ? bDate.getTime() : -Infinity
      return aTime > bTime ? -1 : aTime < bTime ? 1 : 0
    })
  },
})
