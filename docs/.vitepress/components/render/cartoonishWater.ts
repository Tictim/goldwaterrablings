import * as THREE from 'three'
import {
  C,
  DEBUGGING,
  fullscreenBlitCamera,
  fullscreenBlitScene,
  PIDEF,
  SMIN,
  SOFTLIGHT,
  VORONOI,
  WaterRenderer,
} from './shaderThings.ts'

const VERT = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}`

const FRAG = `
varying vec2 vUv;

${PIDEF}
${SMIN}
${VORONOI}
${SOFTLIGHT}
${C}

void main() {
  float vCellDist = voronoi(vUv, vec2(4.0, 5.0), 0.05).x;
  float vCellDist2 = voronoi(vUv + vec2(0.3241, 0.91), vec2(5.0, 6.0), 0.075).x;

  gl_FragColor.rgb = mix(
    c(137, 227, 250),
    mix(
      c(14, 93, 88),
      mix(
        c(48, 180, 203),
        c(38, 155, 160),
        smoothstep(0.0, 0.5, vCellDist)
      ),
      smoothstep(-1.0, 0.25, vCellDist2)
    ),
    smoothstep(0.01, 0.05, vCellDist)
  );
  gl_FragColor.a = 1.0;

  ${DEBUGGING}
}`

export function cartoonishWater(): [render: WaterRenderer, target: THREE.WebGLRenderTarget] {
  let renderedFlag = false

  const renderTarget = new THREE.WebGLRenderTarget(800, 800)
  const camera = fullscreenBlitCamera()
  const scene = fullscreenBlitScene(
    new THREE.ShaderMaterial({
      defines: {
        USE_UV: '',
        // DEBUG: true
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      side: THREE.DoubleSide,
    })
  )

  return [
    (r, _, p) => {
      if (!renderedFlag) {
        r.setRenderTarget(renderTarget)
        r.render(scene, camera)
        renderedFlag = true
      }

      return p
    },
    renderTarget,
  ]
}
