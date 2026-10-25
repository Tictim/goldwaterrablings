<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import {
  emitCanvasCapture,
  enableCanvasCapture,
  hasCanvasCaptureListener,
  useMainPageWaterPosition,
} from './globals'
import { fullscreenBlitCamera } from './render/shaderThings'
import { water } from './render/water'

// pixels per second
const WATER_ANIM_SPEED = 25

const MAIN_PAGE_OFFSET = 500
const NORMAL_PAGE_OFFSET = 60

const props = defineProps<{
  mainPage: boolean
}>()

const root = useTemplateRef('root')

let mutationObserver: MutationObserver | undefined

onMounted(() => {
  if (!root.value) return

  let renderer: THREE.WebGLRenderer

  try {
    renderer = new THREE.WebGLRenderer()
  } catch (ex) {
    return
  }

  renderer.setSize(window.innerWidth, window.innerHeight, false)
  root.value.appendChild(renderer.domElement)

  // draw w*ter in secondary render target then wraparound blit to main screen
  const [waterRender, waterRenderTarget] = water()
  waterRenderTarget.texture.wrapS = THREE.RepeatWrapping
  waterRenderTarget.texture.wrapT = THREE.RepeatWrapping

  const uvs = new Float32Array([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0])
  const uvAttrib = new THREE.BufferAttribute(uvs, 2)

  const scene = new THREE.Scene().add(
    new THREE.Mesh(
      new THREE.BufferGeometry()
        .setAttribute(
          'position',
          new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]), 3)
        )
        .setAttribute('uv', uvAttrib)
        .setIndex([0, 1, 2, 0, 2, 3]),
      new THREE.MeshBasicMaterial({
        map: waterRenderTarget.texture,
        side: THREE.DoubleSide,
      })
    )
  )
  const camera = fullscreenBlitCamera()

  let noWater = false
  let noWaterAnim = false

  function updateMode() {
    const classes = document.body.classList
    noWater = classes.contains('no-water') || classes.contains('screenjesus')
    noWaterAnim = classes.contains('no-anims')
  }

  updateMode()

  mutationObserver = new MutationObserver(updateMode)
  mutationObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] })

  function updateUv(yOffset: number) {
    const { clientWidth: cw, clientHeight: ch } = renderer.domElement
    const { width: tw, height: th } = waterRenderTarget.texture

    const hScale = cw / tw
    const vScale = ch / th

    let u = 0.5 * hScale
    let v = vScale
    let vo = (yOffset / th) % 1.0

    let u0 = -u + 0.5
    let u1 = u + 0.5
    let v0 = -v + vo
    let v1 = 0 + vo

    uvs.set([u0, v0, u1, v0, u1, v1, u0, v1])
    uvAttrib.needsUpdate = true
  }

  function render(time: number) {
    if (noWater) return

    resizeRendererToDisplaySize()

    const waterAnimProgress = noWaterAnim ? 0 : time * 0.001 * WATER_ANIM_SPEED
    const offset = waterRender(renderer, time, waterAnimProgress)

    renderer.setRenderTarget(null)

    const pageOffset = useMainPageWaterPosition(props.mainPage)
      ? MAIN_PAGE_OFFSET
      : NORMAL_PAGE_OFFSET

    updateUv(pageOffset + offset - window.scrollY)
    renderer.render(scene, camera)

    if (hasCanvasCaptureListener()) {
      const url = renderer.domElement.toDataURL()
      emitCanvasCapture(url)
    }
  }

  function resizeRendererToDisplaySize() {
    const canvas = renderer.domElement
    const pixelRatio = window.devicePixelRatio
    const width = Math.floor(canvas.clientWidth * pixelRatio)
    const height = Math.floor(canvas.clientHeight * pixelRatio)
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }

  renderer.setAnimationLoop(render)

  root.value.classList.remove('no-canvas')
  enableCanvasCapture()
})

onUnmounted(() => {
  mutationObserver?.disconnect()
  mutationObserver = undefined
})
</script>

<template>
  <div ref="root" class="bg-canvas-container no-canvas"></div>
</template>

<style lang="scss">
.bg-canvas-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 100vh;
  z-index: -10;

  > canvas {
    display: block;
    width: 100%;
    height: 100%;

    pointer-events: none;
    user-select: none;
  }
}

body.no-water .bg-canvas-container,
.bg-canvas-container.no-canvas {
  background-color: #324fad;

  > canvas {
    visibility: hidden;
  }
}

body.screenjesus .bg-canvas-container {
  background-image: url('/takeThisScreenjesus.png');
  background-position: top center;

  > canvas {
    visibility: hidden;
  }
}
</style>
