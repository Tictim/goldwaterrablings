<template>
  <svg class="svg-test" width="0" height="0" style="visibility: collapse">
    <defs>
      <linearGradient id="cHighlight">
        <stop offset="0%" stop-color="#fff0" />
        <stop offset="40%" stop-color="#fffc" />
        <stop offset="50%" stop-color="#fffc" />
        <stop offset="100%" stop-color="#fff0" />
      </linearGradient>

      <linearGradient id="cShade">
        <stop offset="0%" stop-color="black" />
        <stop offset="100%" stop-color="transparent" />
      </linearGradient>

      <filter id="f" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.5" stitchTiles="stitch" numOctaves="5" />

        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0
                  1 0 0 0 0
                  1 0 0 0 0
                  0 0 0 1 0"
        />

        <feComposite in2="SourceGraphic" operator="in" />
        <feBlend in2="SourceGraphic" mode="soft-light" />
      </filter>

      <g id="card" filter="url(#f)">
        <rect width="100%" height="100%" fill="gray" />
        <rect x="100" width="200" height="100%" fill="url(#cHighlight)" transform="skewX(-30)" />

        <rect width="30" height="100%" fill="url(#cShade)" />
        <rect
          x="100%"
          width="30"
          height="100%"
          fill="url(#cShade)"
          transform="scale(-1 1)"
          transform-origin="right"
        />
      </g>
    </defs>

    <!-- <rect width="100%" height="100%" fill="url(#cThing)" /> -->
    <!-- <use href="#gCard" /> -->
  </svg>
</template>
