<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

type AnimMode = 'full' | 'limited' | 'none'

const BASE_ID = 'site-option'

const STORAGE_ANIM_MODE_ID = BASE_ID + '-anim-mode'
const STORAGE_DARK_MODE_ID = BASE_ID + '-dark-mode'
const STORAGE_WATER_ID = BASE_ID + '-water'

const animMode = ref<AnimMode>('full')
const darkMode = ref<boolean>(false)
const noWater = ref<boolean>(false)

function readFromStorage<T>(
  id: string,
  parser: (value: string) => T | undefined,
  defaultValue: () => NonNullable<T>
): NonNullable<T> {
  const value = localStorage.getItem(id)
  if (value != null) {
    const parsedValue = parser(value)
    if (parsedValue != null) return parsedValue
  }
  return defaultValue()
}

onMounted(() => {
  animMode.value = readFromStorage(
    STORAGE_ANIM_MODE_ID,
    s => (s === 'full' || s === 'limited' || s === 'none' ? s : undefined),
    () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'limited' : 'full')
  )

  darkMode.value = readFromStorage(
    STORAGE_DARK_MODE_ID,
    s => (s === 'dark' ? true : s === 'light' ? false : undefined),
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  noWater.value = readFromStorage(
    STORAGE_WATER_ID,
    s => (s === 'on' ? false : s === 'off' ? true : undefined),
    () => false
  )
})

function setDocumentBodyClass(className: string, on: boolean) {
  document.body.classList[on ? 'add' : 'remove'](className)
}

watch(animMode, val => {
  localStorage.setItem(STORAGE_ANIM_MODE_ID, val)
  setDocumentBodyClass('less-anims', val === 'limited' || val === 'none')
  setDocumentBodyClass('no-anims', val === 'none')
})
watch(darkMode, val => {
  localStorage.setItem(STORAGE_DARK_MODE_ID, val ? 'dark' : 'light')
  return setDocumentBodyClass('dark-mode', val)
})
watch(noWater, val => {
  localStorage.setItem(STORAGE_WATER_ID, val ? 'off' : 'on')
  return setDocumentBodyClass('no-water', val)
})

function cycleAnimMode() {
  switch (animMode.value) {
    case 'full':
      animMode.value = 'limited'
      break
    case 'limited':
      animMode.value = 'none'
      break
    default:
      animMode.value = 'full'
      break
  }
}
</script>

<template>
  <div class="sitemenu">
    <input type="checkbox" id="sitemenu-toggle" style="display: none" />
    <label class="sitemenu-button" for="sitemenu-toggle">
      <span class="sitemenu-button-text coolmask">sitemenu</span>
    </label>

    <div class="sitemenu-list">
      <div class="sitemenu-links">
        <a class="coolmask" href="/">home</a>
        <a class="coolmask" href="/things">things</a>
        <a class="coolmask" href="/tools">tools</a>
        <a class="coolmask" href="/me">me</a>
        <a class="coolmask" href="/contacts">contacts</a>
      </div>

      <div class="site-options">
        <input type="button" id="header-anim-toggle" style="display: none" @click="cycleAnimMode" />
        <label id="header-anim-button" class="site-option desc-container" for="header-anim-toggle">
          <div class="symbol"><span class="coolmask"></span></div>
          <div class="desc"><span class="coolmask"></span></div>
        </label>

        <input type="checkbox" id="dark-mode-toggle" style="display: none" v-model="darkMode" />
        <label id="dark-mode-button" class="site-option desc-container" for="dark-mode-toggle">
          <div class="symbol"><span class="coolmask"></span></div>
          <div class="desc"><span class="coolmask"></span></div>
        </label>

        <input type="checkbox" id="no-water-toggle" style="display: none" v-model="noWater" />
        <label id="no-water-button" class="site-option desc-container" for="no-water-toggle">
          <div class="symbol"><span class="coolmask"></span></div>
          <div class="desc"><span class="coolmask"></span></div>
        </label>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.sitemenu {
  position: fixed;
  z-index: 10;
  left: 10px;
  top: 10px;
  display: flex;
  flex-direction: column;
  align-items: start;

  pointer-events: none;
}

body.screenjesus .sitemenu {
  visibility: hidden;
}

.sitemenu-button {
  pointer-events: all;
  user-select: none;
  cursor: pointer;

  background-color: var(--transparent-bg);
  backdrop-filter: blur(2px);

  & > .sitemenu-button-text {
    border-color: var(--text);
  }
}

.sitemenu-button-text {
  display: inline-block;
  height: 40px;
  padding: 0 5px;
  align-content: center;

  font-family: var(--font-text-monospace);
  font-weight: bold;
  border: 2px dotted transparent;
}

.sitemenu-list {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 30px;

  font-family: var(--font-text-monospace);

  user-select: none;

  a {
    color: var(--text);
    font-weight: bold;
    text-decoration: none;
    border-bottom: 2px dotted var(--text);
    padding: 0 5px;

    pointer-events: all;

    &::before {
      content: '::';
    }
  }
}

.sitemenu-links {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-top: 10px;
  padding: 5px;

  backdrop-filter: blur(2px);
  background-color: var(--transparent-bg-sitemenu);
  border-radius: 10px;
}

#sitemenu-toggle {
  &:checked {
    & ~ .sitemenu-button > .sitemenu-button-text {
      border-color: var(--text);

      &::before,
      &::after {
        content: ' ▼ ';
      }
    }
  }
  &:not(:checked) {
    & ~ .sitemenu-list {
      visibility: collapse;
    }

    & ~ .sitemenu-button > .sitemenu-button-text {
      &::before,
      &::after {
        content: ' ▲ ';
      }
    }
  }
}

.site-options {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}

.site-option {
  position: relative;
  display: block;

  pointer-events: all;
  cursor: pointer;

  > .symbol {
    background-color: var(--transparent-bg);
    backdrop-filter: blur(2px);

    > span {
      display: block;
      text-align: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border: 2px dotted var(--text);
    }
  }

  > .desc {
    position: absolute;
    top: 100%;
    left: 0;
    display: block;

    background-color: var(--transparent-bg);
    backdrop-filter: blur(2px);
    margin-top: 5px;

    font-size: 0.8em;
    white-space: nowrap;

    > span {
      border: 2px dotted var(--text);
      padding: 0 5px;
    }
  }
}

body.no-anims {
  #header-anim-button > .symbol > span::before {
    content: '⏸';
  }

  #header-anim-button > .desc > span::before {
    content: 'no animation';
  }
}

body:not(.no-anims).less-anims {
  #header-anim-button > .symbol > span::before {
    content: '⏯';
  }

  #header-anim-button > .desc > span::before {
    content: 'limited animation';
  }
}

body:not(.no-anims):not(.less-anims) {
  #header-anim-button > .symbol > span::before {
    content: '⏩︎';
  }

  #header-anim-button > .desc > span::before {
    content: 'full animation';
  }
}

body.dark-mode {
  #dark-mode-button > .symbol > span::before {
    content: '☾';
  }

  #dark-mode-button > .desc > span::before {
    content: 'dark mode';
  }
}

body:not(.dark-mode) {
  #dark-mode-button > .symbol > span::before {
    content: '☼';
  }

  #dark-mode-button > .desc > span::before {
    content: 'light mode';
  }
}

body.no-water {
  #no-water-button > .symbol > span::before {
    content: '≠';
  }

  #no-water-button > .desc > span::before {
    content: 'no water';
  }
}

body:not(.no-water) {
  #no-water-button > .symbol > span::before {
    content: '≈';
  }

  #no-water-button > .desc > span::before {
    content: 'water';
  }
}

@media screen and (width < 800px) {
  .sitemenu-list {
    flex-direction: row;
    // gap: 5px;
  }

  .site-options {
    flex-direction: column;
  }

  .site-option {
    display: flex;
    align-items: center;

    > .desc {
      position: static;

      margin-top: 0;
      margin-left: 5px;

      pointer-events: all;
      visibility: unset !important;
    }
  }
}
</style>
