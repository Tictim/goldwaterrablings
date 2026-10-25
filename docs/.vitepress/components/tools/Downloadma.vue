<script lang="ts" setup>
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { requestCanvasCapture, setWaterPositionOverride } from '../globals'

const img = useTemplateRef('img')
const output = ref<string>('')
const windowWidth = ref<number>()
const windowHeight = ref<number>()

const offsetToggle = ref<boolean>(false)

onMounted(() => {
  updateWindowDim()
  window.addEventListener('resize', updateWindowDim)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowDim)
  setWaterPositionOverride(undefined)
})

function updateWindowDim() {
  const { innerWidth, innerHeight } = window
  windowWidth.value = innerWidth
  windowHeight.value = innerHeight
}

function takeSnapshot() {
  if (!img.value) return

  if (document.body.classList.contains('no-water')) {
    output.value = 'you turned the water off so idk what you are expecting, heres a candy ig 🍭'
    return
  }

  if (!requestCanvasCapture(snapshotCallback)) {
    output.value = 'background canvas unavailable'
    return
  }

  output.value = 'processing... this should not take more than a frame'
}

function snapshotCallback(url: string) {
  if (!img.value) return

  img.value.src = url
  img.value.classList.remove('noimage')

  output.value = 'done done done.dingdingdingding right click the image i guess'
}

watch(offsetToggle, val => setWaterPositionOverride(val ? 'mainPage' : 'normal'))
</script>

<template>
  <input
    type="button"
    id="downloadma-snapshot-btn"
    style="visibility: collapse"
    @click="takeSnapshot"
  />
  <input
    type="checkbox"
    id="downloadma-offset-toggle"
    style="visibility: collapse"
    v-model="offsetToggle"
  />

  <div class="downloadma tool">
    <img ref="img" class="downloadma-image noimage" />

    <div class="downloadma-menu">
      <label class="downloadma-button downloadma-border" for="downloadma-snapshot-btn">📸</label>
      <div class="downloadma-output-container downloadma-border">
        <div class="downloadma-output" :class="{ 'no-output': output === '' }">{{ output }}</div>
      </div>
    </div>

    <label class="downloadma-offset-toggle downloadma-border" for="downloadma-offset-toggle">
      offset: <b>{{ offsetToggle ? 'main page' : 'normal page' }}</b> (click to toggle toggle)
    </label>

    <div class="downloadma-window-size-help downloadma-border">
      the capture produces image with size equal to the window<br />
      as of now, your window seems to be <b>{{ windowWidth ?? '???' }}</b> by
      <b>{{ windowHeight ?? '???' }}</b
      ><br />
      <br />
      capture uses the water at the moment you 📸d
      <br />
      (might break on stipid big resolution!!)
    </div>
  </div>
</template>

<style lang="scss">
.downloadma {
  position: relative;

  padding: 10px;
  background-color: var(--transparent-bg);
  border-radius: 10px;
  overflow: hidden;

  .downloadma-image {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;

    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;

    &.noimage {
      visibility: hidden;
    }
  }

  .downloadma-menu {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 10px;

    display: flex;
    align-items: center;
    gap: 10px;
  }

  .downloadma-button {
    user-select: none;
    cursor: pointer;
  }

  .downloadma-output-container {
    flex-grow: 1;

    overflow-x: auto;
  }

  .downloadma-output {
    white-space: nowrap;

    &.no-output {
      color: var(--text-dim);
      &::before {
        content: '<-- click the 📸 to 📸';
      }
    }
  }

  .downloadma-offset-toggle {
    position: absolute;
    left: 10px;
    top: 10px;

    user-select: none;
    cursor: pointer;
  }

  .downloadma-window-size-help {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .downloadma-border {
    padding: 10px;
    background-color: var(--transparent-bg);
    border-radius: 10px;
  }
}
</style>
