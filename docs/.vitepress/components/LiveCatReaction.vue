<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const CATS = 3

const variation = ref<string | undefined>()

onMounted(() => {
  const searchParams = new URLSearchParams(window.location.search)
  const carParam = searchParams.get('car')
  variation.value = carParam ?? Math.min(CATS - 1, Math.trunc(Math.random() * CATS)) + ''
})
</script>

<template>
  <div
    class="live-cat-reaction nostyle"
    :class="variation == null ? undefined : 'var-' + variation"
  >
    <!-- href="https://neocities.org/" -->
    <div class="live-cat-reaction-box desc-element">
      <div class="live-cat-reaction-title">
        <span>LIVE </span>
        <div class="live-cat-reaction-img"></div>
        <span> REACTION</span>
      </div>
      <div class="live-cat-reaction-img live-cat-reaction-main-img">
        <!-- <span class="coolmask">#hostedbyneocities</span> -->
      </div>
    </div>
    <div class="live-cat-reaction-credit-box desc">
      <span class="live-cat-reaction-credit coolmask">car id: <br /></span>
    </div>
  </div>
</template>

<style lang="scss">
.live-cat-reaction {
  position: absolute;
  right: 20px;
  bottom: 20px;

  display: flex;
  flex-direction: row-reverse;
  align-items: end;
  gap: 10px;

  user-select: none;

  > .live-cat-reaction-box {
    padding: 3px;

    display: flex;
    flex-direction: column;
    gap: 3px;

    background-color: white;

    > .live-cat-reaction-title {
      display: flex;
      padding: 0 4px;
      gap: 4px;

      color: white;
      background-color: red;

      > span {
        font-size: 1.5em;
        font-weight: bold;
        transform: scaleY(1.5);
      }

      > .live-cat-reaction-img {
        flex-grow: 1;
      }
    }

    > .live-cat-reaction-main-img {
      background-color: black;
      width: 320px;
      aspect-ratio: 320 / 240;

      display: flex;
      flex-direction: column;
      align-items: end;
      justify-content: end;
      padding: 20px;

      > span {
        font-size: 1.1em;
        font-weight: bold;
        text-shadow: -1px 2px var(--text-shadow);
      }
    }
  }

  > .live-cat-reaction-credit-box {
    z-index: 10;
    background-color: var(--transparent-bg);
    backdrop-filter: blur(2px);

    > .live-cat-reaction-credit {
      display: block;

      border: 2px dotted var(--text);
      font-family: var(--font-text-monospace);
      font-weight: bold;
      font-size: 0.8em;
      white-space: nowrap;
      padding: 0 5px;
    }
  }

  .live-cat-reaction-img {
    background-image: url('/cars/longcat.png');
    background-size: 100% 100%;
  }

  .live-cat-reaction-credit::after {
    content: 'shiro the long car';
  }
}

@media screen and (width >= 600px) and (width < 800px) {
  .live-cat-reaction {
    transform: scale(0.75);
    transform-origin: bottom right;
  }

  .live-cat-reaction-credit-box {
    transform: scale(calc(1 / 0.75));
    transform-origin: bottom right;
  }
}

@media screen and (width < 600px) {
  .live-cat-reaction {
    transform: scale(0.5);
    transform-origin: bottom right;

    flex-direction: column-reverse;
  }

  .live-cat-reaction-credit-box {
    transform: scale(2);
    transform-origin: bottom right;
  }
}

.live-cat-reaction.var-1 {
  .live-cat-reaction-img {
    background-image: url('/cars/juniperscat.png');
  }

  .live-cat-reaction-credit::after {
    content: 'junipers hansome hansome car';
  }
}

.live-cat-reaction.var-3 {
  .live-cat-reaction-img {
    background-image: url('/cars/wuh.png');
  }

  .live-cat-reaction-credit::after {
    content: 'this is not car,i dont know whates doing here';
  }
}
</style>
