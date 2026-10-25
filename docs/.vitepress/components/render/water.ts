import * as THREE from 'three'
import {
  DEBUGGING,
  fullscreenBlitCamera,
  fullscreenBlitScene,
  PCG,
  PERLIN_NOISE,
  VORONOI,
  WaterRenderer,
} from './shaderThings'

const DISPLACEMENT = 'vec2(0.4, 0.15)'

const VERT = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}`

const FRAG = `
varying vec2 vUv;

uniform float offset;
uniform sampler2D cells;
uniform sampler2D palette;
uniform sampler2D noise;
uniform sampler2D water;

void main() {
  vec2 colorUv = vUv + vec2(0.0, offset);
  vec2 waterColors = texture(water, colorUv).rg;

  vec2 shadowUv = vUv * 2.0 + (texture(cells, colorUv).rg - 0.5) * DISPLACEMENT;
  float pShadowCoord = mod(shadowUv.x - shadowUv.y, 2.0);
  float pShadow = smoothstep(0.0, 1.25, pShadowCoord) * (1.0 - smoothstep(0.75, 2.0, pShadowCoord));

  float shadowNoise = texture(noise, vUv * 2.0 + colorUv).r;
  float shadowVal = step(0.5, smoothstep(0.45, 0.55, pShadow + (shadowNoise - 0.5) * 0.2));
  shadowVal *= 0.5;

  gl_FragColor = texture(palette, vec2(shadowVal + 0.251, waterColors.x));
  vec4 highlightSample = texture(palette, vec2(shadowVal + 0.001, min(waterColors.y, 0.999)));

  gl_FragColor.rgb += mix(
    vec3(0.0),
    highlightSample.rgb,
    highlightSample.a
  );

  ${DEBUGGING}
}`

const FRAG_WATER = `
varying vec2 vUv;

uniform sampler2D cells;
uniform sampler2D noise;

void main() {
  vec4 vo = texture(cells, vUv);

  vec2 displacement = (vo.rg - 0.5) * vec2(0.4, 0.15);
  float colorNoise = texture(noise, vUv * 2.0).r - 0.5;

  float colorVal = vUv.y + displacement.y + colorNoise * 0.05;

  float hBasis = gl_FragColor.r = mod(colorVal, 1.0);
  float hVal;
  hVal = max(1.0 - smoothstep(0.0, 0.2, hBasis), log(32.0 * (hBasis - 0.11) + 1.0) * 0.75);
  hVal += colorNoise * 0.7;

  gl_FragColor.g = hVal;
  gl_FragColor.b = 0.0;
  gl_FragColor.a = 1.0;

  ${DEBUGGING}
}`

const FRAG_NOISE = `
varying vec2 vUv;

${PCG}
${PERLIN_NOISE}

void main() {
  gl_FragColor.rgb = vec3(perlinNoise(vUv, vec2(1600.0, 1600.0)));
  gl_FragColor.a = 1.0;
  ${DEBUGGING}
}`

const FRAG_CELLS = `
varying vec2 vUv;

#define W 6.0
#define H 24.0

${VORONOI}

void main() {
  vec3 v = voronoi(vUv, vec2(W, H), 0.0);
  gl_FragColor.rg = 0.5 - v.yz * v.x * 1.2;
  gl_FragColor.b = 1.0;
  gl_FragColor.a = 1.0;
  ${DEBUGGING}
}`

export function water(): [render: WaterRenderer, target: THREE.WebGLRenderTarget] {
  const waterPalette = new THREE.TextureLoader().load(
    '/waterPalette.svg',
    t => {
      t.colorSpace = THREE.SRGBColorSpace
      t.magFilter = t.minFilter = THREE.NearestFilter
      t.wrapT = THREE.RepeatWrapping
      // t.wrapS = THREE.ClampToEdgeWrapping
      t.generateMipmaps = false
    },
    undefined,
    () => console.log('texture "/waterPalette.svg" failed to load')
  )

  const camera = fullscreenBlitCamera()

  let cellsRendered = false
  let noiseRendered = false
  let waterRendered = false

  const cellsRenderTarget = new THREE.WebGLRenderTarget(800 * 2, 800 * 2, {
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
  })
  const cellsScene = fullscreenBlitScene(
    new THREE.ShaderMaterial({
      defines: {
        USE_UV: '',
        // DEBUG: true,
      },
      vertexShader: VERT,
      fragmentShader: FRAG_CELLS,
      side: THREE.DoubleSide,
      precision: 'highp',
    })
  )

  const noiseRenderTarget = new THREE.WebGLRenderTarget(800, 800, {
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
  })
  const noiseScene = fullscreenBlitScene(
    new THREE.ShaderMaterial({
      defines: {
        USE_UV: '',
        // DEBUG: true,
      },
      vertexShader: VERT,
      fragmentShader: FRAG_NOISE,
      side: THREE.DoubleSide,
      precision: 'highp',
    })
  )

  const waterRenderTarget = new THREE.WebGLRenderTarget(800 * 2, 800 * 2, {
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
  })
  const waterScene = fullscreenBlitScene(
    new THREE.ShaderMaterial({
      defines: {
        USE_UV: '',
        DISPLACEMENT: DISPLACEMENT,
        // DEBUG: true,
      },
      uniforms: {
        cells: { value: cellsRenderTarget.texture },
        noise: { value: noiseRenderTarget.texture },
      },
      vertexShader: VERT,
      fragmentShader: FRAG_WATER,
      side: THREE.DoubleSide,
      precision: 'highp',
    })
  )

  const offset = { value: 0.0 }
  const renderTarget = new THREE.WebGLRenderTarget(800 * 2, 800 * 2)
  const scene = fullscreenBlitScene(
    new THREE.ShaderMaterial({
      defines: {
        USE_UV: '',
        DISPLACEMENT: DISPLACEMENT,
        // DEBUG: true,
      },
      uniforms: {
        offset,
        cells: { value: cellsRenderTarget.texture },
        palette: { value: waterPalette },
        noise: { value: noiseRenderTarget.texture },
        water: { value: waterRenderTarget.texture },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      side: THREE.DoubleSide,
    })
  )

  return [
    (r, t, p) => {
      if (!cellsRendered) {
        r.setRenderTarget(cellsRenderTarget)
        r.render(cellsScene, camera)
        cellsRendered = true
      }
      if (!noiseRendered) {
        r.setRenderTarget(noiseRenderTarget)
        r.render(noiseScene, camera)
        noiseRendered = true
      }
      if (!waterRendered) {
        r.setRenderTarget(waterRenderTarget)
        r.render(waterScene, camera)
        waterRendered = true
      }

      r.setRenderTarget(renderTarget)
      offset.value = (Math.round(p) / renderTarget.height) % 1.0
      r.render(scene, camera)

      return 0
    },
    renderTarget,
  ]
}
