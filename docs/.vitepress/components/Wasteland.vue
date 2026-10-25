<script lang="ts" setup>
import { onMounted, useTemplateRef } from 'vue'

const INITIAL_SPECIAL_CACTU_CHANCE = 0.05

const CACTI = [
  'actualfuckingcactus',
  'cactish',
  'cactrol',
  'cactucool',
  'cactuflip',
  'cactukyu',
  'cactulenny',
  'cactune',
  'cactunotfound',
  'cactushiny',
  'cactushock',
  'cactwhateverthisis',
  'cactwuh',
  'cacute',
  'camogus',
]

const cactu = useTemplateRef('cactu')

onMounted(() => {
  if (navigator.userAgent !== 'Screenjesus' && Math.random() <= INITIAL_SPECIAL_CACTU_CHANCE)
    switchCactu()
})

function switchCactu() {
  if (!cactu.value) return

  const prevCactu = cactu.value.src
  let newCactu = prevCactu

  do {
    const randomCactu = CACTI[Math.min(CACTI.length - 1, Math.trunc(Math.random() * CACTI.length))]
    newCactu = `/404/${randomCactu}.png`
  } while (prevCactu.endsWith(newCactu))
  cactu.value.src = newCactu

  if (newCactu.endsWith('actualfuckingcactus.png')) {
    cactu.value.classList.remove('too-dark')
  } else {
    cactu.value.classList.add('too-dark')
  }
}
</script>

<template>
  <div class="wasteland">
    <div class="wasteland-frame">
      <img ref="cactu" class="cactu too-dark" src="/404/cactu.png" @click="switchCactu" />
      <img class="cactie-1 too-dark" src="/404/cactie1.png" />
      <img class="cactie-2 too-dark" src="/404/cactie2.png" />
      <div class="tumbly-anchor">
        <div class="tumbly-anchor-2">
          <img class="tumbly" src="/404/tumbly.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.wasteland {
  position: relative;
  height: 400px;

  img {
    user-select: none;
  }

  img:not(.cactu) {
    pointer-events: none;
  }

  .wasteland-frame {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    overflow: hidden;
  }

  .cactu {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;

    cursor: pointer;
  }

  .cactie-1,
  .cactie-2 {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: -2;

    transform-origin: bottom center;
  }

  .cactie-2 {
    opacity: 0;
  }

  .tumbly-anchor {
    position: absolute;
    top: 75%;
    left: 100px;

    width: 0;
    height: 0;
  }

  .tumbly-anchor-2 {
    width: 0;
    height: 0;
  }

  .tumbly {
    position: absolute;
    top: -50px;
    left: -50px;

    display: block;
    width: 100px;
    height: 100px;
  }
}

body:not(.dark-mode) .wasteland .too-dark {
  filter: brightness(0.65);
}

body:not(.no-anims) .wasteland {
  .cactie-1 {
    animation:
      wasteland-cactie-control-1 10s 1.25s step-start infinite,
      wasteland-cactie-boing 5s 1.25s infinite;
  }

  .cactie-2 {
    animation:
      wasteland-cactie-control-2 10s 1.25s step-start infinite,
      wasteland-cactie-boing 5s 1.25s infinite;
  }

  .tumbly-anchor {
    animation: wasteland-tumbly-moving 10s linear infinite;
  }

  .tumbly-anchor-2 {
    animation: wasteland-tumbly-bobbing 0.4s ease-out infinite alternate;
  }

  .tumbly {
    animation: wasteland-tumbly-rotating 1s linear infinite;
  }
}

@keyframes wasteland-cactie-boing {
  0% {
    transform: scale(1, 1);
  }

  2% {
    transform: scale(1.2, 0.8);
  }

  4% {
    transform: scale(1, 1);
  }
}

@keyframes wasteland-cactie-control-1 {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes wasteland-cactie-control-2 {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes wasteland-tumbly-moving {
  0% {
    top: 75%;
    left: -100px;
    transform: scale(1, 1);
  }

  25% {
    top: 75%;
    left: calc(100% + 100px);
    transform: scale(1, 1);
  }

  50% {
    top: 25%;
    left: calc(100% + 100px);
    transform: scale(-0.8, 0.8);
    z-index: -1;
  }

  75% {
    top: 25%;
    left: -100px;
    transform: scale(-0.8, 0.8);
    z-index: -1;
  }

  100% {
    top: 75%;
    left: -100px;
    transform: scale(1, 1);
  }
}

@keyframes wasteland-tumbly-rotating {
  0% {
    transform: rotate(0turn);
  }

  100% {
    transform: rotate(1turn);
  }
}

@keyframes wasteland-tumbly-bobbing {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-50px);
  }
}
</style>
