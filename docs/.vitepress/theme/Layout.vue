<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, onMounted } from 'vue'
import BgCanvas from '../components/BgCanvas.vue'
import LiveCatReaction from '../components/LiveCatReaction.vue'
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

  <div class="main">
    <div
      v-if="$frontmatter.contentBlock !== 'none'"
      class="content-block"
      :class="{ 'tool-block': $frontmatter.contentBlock === 'tool' }"
    >
      <span class="back">
        ↩
        <a v-if="page.filePath.startsWith('things/')" href="/things">::things</a>
        <a v-else-if="page.filePath.startsWith('tools/')" href="/tools">::tools</a>
        <a v-else href="/">::home</a>
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
    <Content v-else />

    <div class="footies" :class="{ hidden: !footiesVisible }">
      <div class="footies-left">
        <div class="footies-left-container">
          <a
            class="nostyle desc-element github-icon"
            href="https://github.com/Tictim/goldwaterrablings"
            role="img"
            aria-label="github icon"
          ></a>
          <div class="desc">
            <span class="coolmask">source code</span>
          </div>
        </div>
        <div class="footies-left-container">
          <a class="nostyle desc-element" href="https://creativecommons.org/licenses/by-sa/4.0/"
            ><img src="/by-sa.png" alt="cc by-sa"
          /></a>
          <div class="desc">
            <span class="coolmask">cc by-sa</span>
          </div>
        </div>
        <div class="footies-left-container">
          <a class="nostyle desc-element" href="https://neocities.org/"
            ><img src="/neocities.png" width="150" alt="hosted by neocities"
          /></a>
          <div class="desc">
            <span class="coolmask">areyou saing that neo hosted these c-</span>
          </div>
        </div>
      </div>
      <LiveCatReaction />
    </div>
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
  overflow: auto;
  flex: 1 1 auto;

  display: flex;
  flex-direction: column;
}

body.miomode .main {
  background-image: url('/thumbnail/xeno3.png');
  background-size: 100% auto;
  background-repeat: repeat;
  background-position: center;
}

body:not(.miomode) .main {
  background-image: url('/b1.svg'), url('/b2.svg');
  background-position:
    center top,
    center top;
  background-repeat: repeat-x, repeat;
}

.content-block {
  width: min(800px, 100vw);
  margin: 200px auto 0 auto;
  // margin-top: 200px;
  padding: 40px;
  background-color: var(--transparent-bg-content);
  backdrop-filter: blur(10px);
  border-radius: 40px;

  display: flex;
  flex-direction: column;

  &.tool-block {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    width: min(max(800px, calc(min(100vw, 1920px) - 40px)), 100vw);
    margin: 20px auto;

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

.back {
  user-select: none;
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

.footies {
  min-height: 1200px;
  flex-grow: 1;

  background-image: url('/b3.svg');
  background-position: center bottom;
  background-repeat: repeat-x;

  user-select: none;

  .github-icon {
    background-image: url('/GitHub_Invertocat_Black.png');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    width: 32px;
    height: 32px;
  }

  .footies-left {
    position: absolute;
    left: 20px;
    bottom: 20px;
    right: 0;

    display: flex;
    flex-direction: column;
    align-items: start;

    gap: 20px;
    overflow-x: hidden;
  }

  .footies-left-container {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: 10px;

    a,
    img {
      display: block;
    }

    .desc {
      z-index: 10;

      background-color: var(--transparent-bg);
      backdrop-filter: blur(10px);

      font-family: var(--font-text-monospace);
      font-size: 0.8em;
      white-space: nowrap;

      > span {
        border: 2px dotted var(--text);
        padding: 0 5px;
      }
    }
  }
}

@media screen and (width < 600px) {
  .footies-neocities-logo {
    transform: scale(0.8);
    transform-origin: bottom left;
  }
}

.footies.hidden {
  min-height: 0;
  max-height: 0;
  visibility: hidden;
}

.desc-container {
  > .desc {
    pointer-events: none;
    user-select: none;
  }

  &:not(:hover) > .desc {
    visibility: hidden;
  }
}

.desc-element {
  ~ .desc {
    pointer-events: none;
    user-select: none;
  }

  &:not(:hover) ~ .desc {
    visibility: hidden;
  }
}
</style>
