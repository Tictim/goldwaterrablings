<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, onMounted } from 'vue'
import BgCanvas from '../components/BgCanvas.vue'
import Footies from '../components/Footies.vue'
import ToC from '../components/ToC.vue'
import { maskTest } from '../components/maskTest.ts'
import SiteMenu from '../components/SiteMenu.vue'
import { NO_TITLE, timestampToText } from '../components/things.ts'
import Wasteland from '../components/Wasteland.vue'

const NOT_FOUND_TITLE = '404 not found'

const { page, frontmatter } = useData()

const timestamp = computed(() => timestampToText(frontmatter.value['timestamp']))

const footiesVisible = computed(
  () => !frontmatter.value['index'] && frontmatter.value['contentBlock'] !== 'tool'
)

const is404 = computed(() => {
  const a = !!page.value.isNotFound,
    b = frontmatter.value['404'] == true
  return a || b
})

const title = computed(() => {
  const titleValue = frontmatter.value['title'] ?? NO_TITLE
  return is404.value ? NOT_FOUND_TITLE : titleValue
})

const backlink = computed<readonly [href: string, title: string]>(() => {
  const p = page.value.filePath
  if (p.startsWith('things/')) return ['/things', '::things']
  if (p.startsWith('tools/')) return ['/tools', '::tools']
  if (p.startsWith('test/')) return ['/test', '::test']
  return ['/', '::home']
})

onMounted(async () => {
  if (page.value.isNotFound) {
    page.value.title = NOT_FOUND_TITLE
  }

  const searchParams = new URLSearchParams(window.location.search)
  const screenjesus = searchParams.get('screenjesus')
  const forceMaskCompatibility = searchParams.get('forceMaskCompatibility')

  if (navigator.userAgent === 'Screenjesus' || screenjesus === 'on')
    document.body.classList.add('screenjesus')

  const maskOnParam =
    forceMaskCompatibility === 'on' ? true : forceMaskCompatibility === 'off' ? false : undefined
  const maskOn = maskOnParam ?? (await maskTest())

  if (!maskOn) {
    if (maskOnParam == null) {
      console.log('detected malfunctioning mask mode (probably safari), removing mask effects')
    }
    document.body.classList.add('no-mask')
  }
})
</script>

<template>
  <!-- <SvgDef /> -->
  <BgCanvas :main-page="!!$frontmatter.index" />

  <div class="header-block" :class="{ index: $frontmatter.index }">
    <!-- prettier-ignore -->
    <a class="header nostyle" href="/">
      <div>goldwaterramblings goldwaterramblings goldwaterramblings goldwaterramblings goldwaterramblings goldwaterramblings goldwaterramblings goldwaterramblings</div>
      <div>goldwaterramblings goldwaterramblings goldwaterramblings goldwaterramblings goldwaterramblings goldwaterramblings goldwaterramblings goldwaterramblings goldwaterramblings</div>
      <div>goldwaterramblings goldwaterramblings goldwaterramblings goldwaterramblings goldwaterramblings goldwaterramblings goldwaterramblings goldwaterramblings</div>
    </a>
  </div>

  <SiteMenu />

  <div
    class="main"
    :class="{
      'no-footies': !footiesVisible,
      'main-tool': $frontmatter.contentBlock === 'tool',
    }"
  >
    <div class="content-and-navbar-block">
      <ToC v-if="page.headers.length > 0" />

      <div v-if="$frontmatter.contentBlock !== 'none'" class="content-block">
        <span class="main-title-backlink">
          ↩ <a :href="backlink[0]">{{ backlink[1] }}</a>
        </span>
        <div class="main-title">
          <div class="main-title-header coolmask">::{{ title }}</div>
          <div v-if="timestamp" class="main-title-timestamp">date of birth {{ timestamp }}</div>
        </div>
        <hr />
        <template v-if="is404">
          <p>the server is confused. i am confused. are you confused yet? here's the west.</p>
          <Wasteland />
        </template>
        <Content v-else />
      </div>
      <div v-else><Content /></div>
    </div>

    <Footies />
  </div>
</template>

<style lang="scss">
@use './main.scss';

.header-block {
  position: relative;
  left: 0;
  right: 0;
  height: 60px;
  overflow-x: hidden;

  > .header {
    position: absolute;
    bottom: 0;
    left: -40px;
    right: -40px;
    margin: 0 auto;

    max-width: 1200px;
    height: 60px;
    padding: 5px 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    color: var(--logo);
    font-family: var(--font-text-monospace);
    font-size: 16px;
    line-height: 16px;
    text-decoration: none;

    transform: skewX(-45deg);

    > div {
      white-space: pre;
      user-select: none;
    }
  }

  &.index {
    height: 500px;

    > .header {
      margin-bottom: 40px;
    }
  }
}

body:not(.no-mask) .header-block > .header {
  mask: var(--logo-mask) center luminance repeat-y;
}

.main {
  position: relative;
  width: 100%;
  // height: 500px;
  // overflow: auto;
  flex: 1 1 auto;

  display: flex;
  flex-direction: column;
}

body:not(.miomode) .main.no-footies {
  background-image: url('/b1.svg'), url('/b2.svg');
  background-position:
    center top,
    center top;
  background-repeat: repeat-x, repeat;
}

.content-and-navbar-block {
  display: flex;
  flex-direction: row-reverse;
  align-items: start;
  gap: 20px;
}

.content-block {
  padding: 40px;
  display: flex;
  flex-direction: column;

  background-color: var(--transparent-bg-content);
  backdrop-filter: blur(10px);
  border-radius: 40px;
}

.main:not(.main-tool) {
  .content-and-navbar-block {
    margin: 200px auto;
  }

  .content-block {
    width: min(800px, 100vw);
    // margin-top: 200px;
  }
}

.main.main-tool {
  .content-and-navbar-block {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    width: min(max(800px, calc(min(100vw, 1920px) - 40px)), 100vw);
    margin: 20px auto;
  }

  .content-block {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    > *:last-child {
      flex-grow: 1;

      > div:first-child {
        height: 100%;

        display: flex;
        flex-direction: column;

        > .tool {
          flex-grow: 1;
        }
      }
    }
  }
}

.main-title-backlink {
  font-size: 0.9em;
  user-select: none;

  a {
    font-family: var(--font-text-monospace);
  }
}

.main-title-header {
  font-size: 2em;
  font-weight: bold;
}

.main-title-timestamp {
  color: var(--text-dim);
  font-family: var(--font-text-monospace);
  font-size: 0.8rem;
  text-shadow: -1px 2px var(--text-shadow);
  text-align: end;

  white-space: nowrap;
}
</style>
