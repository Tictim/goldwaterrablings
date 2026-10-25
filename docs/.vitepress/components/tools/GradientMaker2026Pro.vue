<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, Ref, ref, useTemplateRef, watch } from 'vue'

type ColorInput = [color: string, wgt: number, flag?: 'auto' | 'invalid']

const GRADIENT_SIZE_LIMIT = 200

const PLACEHOLDER = `
// <css-color> [weight (int, default: 1)]

white 1
red 2
purple  // 1 segment by default
auto 3  // interpolates between purple and orange for 3 segments
orange

// virtually css color defs are available (save for special values like 'initial')

#ffffff
#000
rgba(255, 255, 0, 0.5)
hsl(120, 50%, 50%)

// note:
//  alpha channel noticeably degrades quality of color components on lower values
//  apparently linearRGB sucks mega dick paired with this method, just dont use
//  max. number of gradient segments is ${GRADIENT_SIZE_LIMIT} to save your (me) imbecilian ass from
//  crashing the page with #ffffff 5000000
`.trim()

const BASE_ID = 'gradientmaker2026pro'

const SESSION_STORAGE_TEXT_ID = BASE_ID + '-input'
const SESSION_STORAGE_SRGB_ID = BASE_ID + '-sRGB'
const SESSION_STORAGE_MATERIAL_ID = BASE_ID + '-material'
const SESSION_STORAGE_COLOR_ID = BASE_ID + '-color'
const SESSION_STORAGE_ALPHA_ID = BASE_ID + '-alpha'
const SESSION_STORAGE_DISCRETE_ID = BASE_ID + '-discrete'

const WEIGHT_PATTERN = /\s+([0-9]+)$/
const COLOR_PATTERN = /rgba?\(([0-9]+), ([0-9]+), ([0-9]+)(?:, (.+))?\)$/

const colorListGrid = useTemplateRef('colorListGrid')

const textInput = ref<string>('')
const sRGB = ref<boolean>(true)
const material = ref<boolean>(false)
const colorChannel = ref<boolean>(true)
const alphaChannel = ref<boolean>(false)
const discrete = ref<boolean>(false)

const colorInputs = ref<readonly Readonly<ColorInput>[]>([])
const feFunc = reactive({
  r: '0 1',
  g: '0 1',
  b: '0 1',
  a: '0 1',
})

function restoreSession<T>(ref: Ref<T>, itemId: string, parse: (s: string) => T) {
  const sessionText = sessionStorage.getItem(itemId)
  if (sessionText != null) ref.value = parse(sessionText)
}

onMounted(async () => {
  restoreSession(textInput, SESSION_STORAGE_TEXT_ID, s => s)
  restoreSession(sRGB, SESSION_STORAGE_SRGB_ID, s => s === 'sRGB')
  restoreSession(material, SESSION_STORAGE_MATERIAL_ID, s => s === 'true')
  restoreSession(colorChannel, SESSION_STORAGE_COLOR_ID, s => s === 'true')
  restoreSession(alphaChannel, SESSION_STORAGE_ALPHA_ID, s => s === 'true')
  restoreSession(discrete, SESSION_STORAGE_DISCRETE_ID, s => s === 'true')

  await updateColorInput(textInput.value)
})

function parse(input: string): ColorInput[] {
  return input
    .split('\n')
    .map(s => s.substring(0, s.indexOf('//') >>> 0).trim())
    .filter(s => s.length > 0)
    .map(s => {
      const m = WEIGHT_PATTERN.exec(s)
      if (m == null) return [s, 1] as ColorInput

      const color = s.substring(0, m.index!!).trimEnd()
      const wgt = Number.parseInt(m[1])
      return [color, Math.max(0, wgt)] as ColorInput
    })
    .map(c => {
      if (c[0] === 'auto') c[2] = 'auto'
      else {
        const invalidColor =
          c[0] === 'inherit' ||
          c[0] === 'initial' ||
          c[0] === 'revert' ||
          c[0] === 'revert-layer' ||
          c[0] === 'unset' ||
          !CSS.supports('color', c[0])
        if (invalidColor) c[2] = 'invalid'
      }
      return c
    })
}

let placeholderColors: readonly Readonly<ColorInput>[] | undefined

watch(textInput, async newValue => {
  sessionStorage.setItem(SESSION_STORAGE_TEXT_ID, newValue)
  updateColorInput(newValue)
})

watch(sRGB, newValue => {
  sessionStorage.setItem(SESSION_STORAGE_SRGB_ID, newValue ? 'sRGB' : 'linearRGB')
})

watch(material, newValue => {
  sessionStorage.setItem(SESSION_STORAGE_MATERIAL_ID, newValue + '')
})

watch(colorChannel, newValue => {
  sessionStorage.setItem(SESSION_STORAGE_COLOR_ID, newValue + '')
})

watch(alphaChannel, newValue => {
  sessionStorage.setItem(SESSION_STORAGE_ALPHA_ID, newValue + '')
})

watch(discrete, newValue => {
  sessionStorage.setItem(SESSION_STORAGE_DISCRETE_ID, newValue + '')
})

async function updateColorInput(input: string) {
  colorInputs.value = input !== '' ? parse(input) : (placeholderColors ??= parse(PLACEHOLDER))

  // wait for DOM element update so i can query the actual rgb components off the elements
  // shoutouts to javascripts incapability to directly evaluate css color value of strings
  await nextTick()

  const elems = [...colorListGrid.value!!.children].filter(e =>
    e.classList.contains('color-list-element')
  )

  if (colorInputs.value.length !== elems.length) {
    console.log(`mismatching DOM elements? ${colorInputs.value.length}/${elems.length}`)
    return
  }

  type Color = [r: number, g: number, b: number, a: number]

  function parseColor(backgroundColorText: string): Color | undefined {
    const m = COLOR_PATTERN.exec(backgroundColorText)
    if (!m) return undefined

    return [
      Number.parseInt(m[1]),
      Number.parseInt(m[2]),
      Number.parseInt(m[3]),
      m[4] == null ? 1.0 : Number.parseFloat(m[4]),
    ]
  }

  function lerp(v0: number, v1: number, t: number) {
    return v0 + t * (v1 - v0)
  }

  function pushColor(colors: Color[], color: Color, wgt: number, autoSegmentIndex?: number) {
    const colorRef =
      autoSegmentIndex != null && autoSegmentIndex >= 0 ? colors[autoSegmentIndex] : undefined

    for (let i = 0; i < wgt && colors.length < GRADIENT_SIZE_LIMIT; i++) {
      if (colorRef) {
        colors.push(color.map((c, index) => lerp(colorRef[index], c, (i + 1) / (wgt + 1))) as Color)
      } else {
        colors.push(color)
      }
    }
  }

  const colorSegments: Color[] = []
  let autoSegmentIndex = -1
  let autoSegmentWgt = 0

  for (let i = 0, len = colorInputs.value.length; i < len; i++) {
    const [, wgt, flag] = colorInputs.value[i]
    if (wgt <= 0) continue

    let color: Color | undefined
    if (flag) {
      if (flag === 'auto') {
        if (autoSegmentIndex < 0) autoSegmentIndex = colorSegments.length - 1
        autoSegmentWgt += wgt
        continue
      }
    } else {
      color = parseColor(window.getComputedStyle(elems[i]).backgroundColor)
    }

    color ??= [0, 0, 0, 1]
    if (autoSegmentWgt >= 0) {
      pushColor(colorSegments, color, autoSegmentWgt, autoSegmentIndex)
      autoSegmentIndex = -1
      autoSegmentWgt = 0
    }

    pushColor(colorSegments, color, wgt)
    if (colorSegments.length >= GRADIENT_SIZE_LIMIT) break
  }

  if (autoSegmentWgt >= 0) {
    pushColor(
      colorSegments,
      colorSegments[colorSegments.length - 1],
      autoSegmentWgt,
      autoSegmentIndex
    )
  }

  feFunc.r = colorSegments.map(n => n[0] / 255).join(' ')
  feFunc.g = colorSegments.map(n => n[1] / 255).join(' ')
  feFunc.b = colorSegments.map(n => n[2] / 255).join(' ')
  feFunc.a = colorSegments.map(n => n[3]).join(' ')
}

const previewCode = computed(() => {
  let { r, g, b, a } = feFunc

  const filterValue = sRGB.value ? 'sRGB' : 'linearRGB'
  const materialFilter = material.value
    ? `
  <feTurbulence type="fractalNoise"
                baseFrequency="0.5"
                stitchTiles="stitch"
                numOctaves="5" />

  <feColorMatrix type="matrix"
                 values="1 0 0 0 0
                         1 0 0 0 0
                         1 0 0 0 0
                         0 0 0 1 0" />

  <feComposite in2="SourceGraphic"
               operator="in" />

  <feBlend in2="SourceGraphic"
           mode="soft-light" />
`
    : ''

  const colorFunc = colorChannel.value
    ? `
    <feFuncR type="${discrete.value ? 'discrete' : 'table'}" tableValues="${r}" />
    <feFuncG type="${discrete.value ? 'discrete' : 'table'}" tableValues="${g}" />
    <feFuncB type="${discrete.value ? 'discrete' : 'table'}" tableValues="${b}" />`
    : `
    <feFuncR type="identity" />
    <feFuncG type="identity" />
    <feFuncB type="identity" />`

  const alphaFunc = alphaChannel.value
    ? `
    <feFuncA type="${discrete.value ? 'discrete' : 'table'}" tableValues="${a}" />`
    : `
    <feFuncA type="identity" />`

  return `<filter color-interpolation-filters="${filterValue}">${materialFilter}
  <feComponentTransfer>${colorFunc}${alphaFunc}
  </feComponentTransfer>
</filter>`
})
</script>

<template>
  <div class="gradientmaker2026pro tool">
    <div class="input-column">
      <textarea
        ref="input"
        autocomplete="off"
        autocorrect="off"
        autofocus
        spellcheck="false"
        :placeholder="PLACEHOLDER"
        v-model="textInput"
      ></textarea>
      <div class="toggles">
        <div>
          <input type="checkbox" id="gradientmaker2026pro-toggle-srgb" v-model="sRGB" />
          <label for="gradientmaker2026pro-toggle-srgb"> sRGB</label>
        </div>
        <div>
          <input type="checkbox" id="gradientmaker2026pro-toggle-material" v-model="material" />
          <label for="gradientmaker2026pro-toggle-material"> apply material</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="gradientmaker2026pro-toggle-color-channel"
            v-model="colorChannel"
          />
          <label for="gradientmaker2026pro-toggle-color-channel"> color channel</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="gradientmaker2026pro-toggle-alpha-channel"
            v-model="alphaChannel"
          />
          <label for="gradientmaker2026pro-toggle-alpha-channel"> alpha channel</label>
        </div>
        <div>
          <input type="checkbox" id="gradientmaker2026pro-toggle-discrete" v-model="discrete" />
          <label for="gradientmaker2026pro-toggle-discrete"> discrete</label>
        </div>
      </div>
    </div>
    <div class="color-list">
      <div ref="colorListGrid" class="color-list-grid">
        <div
          v-for="[c, w, f] in colorInputs"
          class="color-list-element"
          :class="{ 'invalid-color': f === 'invalid', 'auto-color': f === 'auto' }"
          :style="{ 'background-color': f ? undefined : c }"
          :title="
            (() => {
              if (f === 'auto') return 'auto (interpolates colors before and after)'
              else if (f == null) return c
              else return `${c} (invalid color)`
            })()
          "
        >
          <span class="coolmask"></span>
          <div class="color-list-element-num">{{ w }}</div>
        </div>
      </div>
    </div>
    <div class="preview-column">
      <div class="preview">
        <svg width="300" height="200" viewBox="0 0 300 200">
          <defs>
            <pattern id="transparencyGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="10" height="10" fill="gray" />
              <rect x="10" y="10" width="10" height="10" fill="gray" />
            </pattern>

            <linearGradient id="gradient">
              <stop
                offset="0%"
                :stop-color="(colorChannel ? '#000000' : '#ffffff') + (alphaChannel ? '00' : '')"
              />
              <stop offset="100%" stop-color="white" />
            </linearGradient>

            <filter
              id="fGradientMap"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              :color-interpolation-filters="sRGB ? 'sRGB' : 'linearRGB'"
            >
              <feTurbulence
                v-if="material"
                type="fractalNoise"
                baseFrequency="0.5"
                stitchTiles="stitch"
                numOctaves="5"
              />

              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0
                        1 0 0 0 0
                        1 0 0 0 0
                        0 0 0 1 0"
              />

              <feComposite v-if="material" in2="SourceGraphic" operator="in" />
              <feBlend v-if="material" in2="SourceGraphic" mode="soft-light" />

              <!-- needs this part to properly update the svg preview -->
              <feComponentTransfer :in="material ? undefined : 'SourceGraphic'">
                <feFuncR
                  :type="colorChannel ? (discrete ? 'discrete' : 'table') : 'identity'"
                  :tableValues="colorChannel ? feFunc.r : undefined"
                />
                <feFuncG
                  :type="colorChannel ? (discrete ? 'discrete' : 'table') : 'identity'"
                  :tableValues="colorChannel ? feFunc.g : undefined"
                />
                <feFuncB
                  :type="colorChannel ? (discrete ? 'discrete' : 'table') : 'identity'"
                  :tableValues="colorChannel ? feFunc.b : undefined"
                />
                <feFuncA
                  :type="alphaChannel ? (discrete ? 'discrete' : 'table') : 'identity'"
                  :tableValues="alphaChannel ? feFunc.a : undefined"
                />
              </feComponentTransfer>
            </filter>
          </defs>

          <rect x="0" y="0" width="300" height="180" fill="url(#transparencyGrid)" />

          <rect
            x="0"
            y="0"
            width="300"
            height="180"
            fill="url(#gradient)"
            filter="url(#fGradientMap)"
          />

          <rect x="0" y="190" width="300" height="10" fill="url(#transparencyGrid)" />

          <rect x="0" y="190" width="300" height="10" fill="url(#gradient)" />
        </svg>
      </div>
      <textarea class="preview-code" readonly>{{ previewCode }}</textarea>
    </div>
  </div>
</template>

<style lang="scss">
.gradientmaker2026pro {
  display: flex;
  flex-direction: row;
  gap: 20px;

  // > * {
  //   min-width: 0;
  //   min-height: 0;
  //   overflow: hidden;
  // }

  > .input-column {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 50%;
    flex-grow: 1;

    textarea {
      flex-grow: 1;
      color: var(--text);
      background: var(--transparent-bg-content);
      padding: 10px;
      border: none;
      border-radius: 10px;
      resize: none;
    }

    .toggles {
      display: flex;
      gap: 10px;

      background: var(--transparent-bg-content);
      padding: 10px;
      border-radius: 10px;

      font-family: var(--font-text-monospace);
    }
  }

  .color-list {
    position: relative;
    background: var(--transparent-bg-content);
    padding: 10px;
    border-radius: 10px;

    width: 100px; // i give up
    height: 100%;
    overflow-y: auto;
  }

  .color-list-grid {
    position: absolute;
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
  }

  .color-list-element {
    position: relative;
    width: 32px;
    height: 32px;

    color: var(--text);
    font-family: var(--font-text-monospace);
    text-align: center;

    > span {
      display: block;
      width: 100%;
      height: 100%;
      border: 2px dotted var(--text);
    }

    &.invalid-color,
    &.auto-color {
      background-color: var(--bg);
    }
    &.invalid-color > span::before {
      content: '?';
    }
    &.auto-color > span::before {
      content: '%';
    }

    .color-list-element-num {
      position: absolute;
      left: 0;
      bottom: 0;

      max-width: calc(100% - 4px);
      text-overflow: clip;
      overflow-x: hidden;

      margin: 2px 2px;
      padding: 0 2px;

      color: var(--text-dim);
      font-family: var(--font-text-monospace);
      font-size: 0.5rem;
      white-space: nowrap;

      pointer-events: none;
      user-select: none;

      background-color: var(--transparent-bg-content);
    }
  }

  .preview-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .preview {
    background: var(--transparent-bg-content);
    padding: 10px;
    border-radius: 10px;

    > svg {
      display: block;
      margin: 0 auto;
    }
  }

  .preview-code {
    position: relative;

    background: var(--transparent-bg-content);
    padding: 10px;
    border: none;
    border-radius: 10px;
    width: 320px;
    flex-grow: 1;

    color: var(--text-dim);
    font-family: var(--font-text-monospace);
    white-space: pre;
    font-size: 0.8em;

    resize: none;
    overflow: auto;
  }
}
</style>
