<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted, useTemplateRef } from 'vue'
import { fullscreenBlitCamera } from '../render/shaderThings'

const root = useTemplateRef('root')

onMounted(() => {
  if (!root.value) return

  let renderer: THREE.WebGLRenderer

  try {
    renderer = new THREE.WebGLRenderer()
  } catch (ex) {
    return
  }

  renderer.setSize(400, 400)
  root.value.appendChild(renderer.domElement)

  let renderFlag = true
  const loader = new THREE.TextureLoader()
  const texture = loader.load(
    '/icon.svg',
    t => {
      t.colorSpace = THREE.SRGBColorSpace
      t.generateMipmaps = false
      renderFlag = true
    },
    undefined,
    () => console.log('texture "/icon.svg" failed to load')
  )

  const scene = new THREE.Scene().add(
    new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      })
    )
  )
  const camera = fullscreenBlitCamera()

  function render(time: number) {
    if (!renderFlag) return
    renderer.render(scene, camera)
    renderFlag = false
  }

  renderer.setAnimationLoop(render)
})
</script>

<template>
  <div ref="root" class="tool" style="margin-top: 2px"></div>
</template>

<style lang="scss"></style>
