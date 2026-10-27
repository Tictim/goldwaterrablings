<script lang="ts" setup>
import LiveCatReaction from './LiveCatReaction.vue'

const props = defineProps<{
  visible: boolean
}>()
</script>

<template>
  <div class="footies" :class="{ hidden: !props.visible }">
    <div class="footies-left">
      <div class="footies-left-entry">
        <a
          class="footies-github-icon nostyle desc-element"
          href="https://github.com/Tictim/goldwaterrablings"
          role="img"
          aria-label="github icon"
        ></a>
        <div class="desc">
          <span class="coolmask">source code</span>
        </div>
      </div>
      <div class="footies-left-entry">
        <a class="nostyle desc-element" href="https://creativecommons.org/licenses/by-sa/4.0/"
          ><img src="/by-sa.png" alt="cc by-sa"
        /></a>
        <div class="desc">
          <span class="coolmask">cc by-sa</span>
        </div>
      </div>
      <div class="footies-left-entry">
        <a class="nostyle desc-element" href="https://neocities.org/"
          ><img src="/neocities.png" width="150" alt="hosted by neocities"
        /></a>
        <div class="desc">
          <span class="coolmask">areyou saing that neo hosted these c-</span>
        </div>
      </div>
    </div>
    <LiveCatReaction />
  </div>
</template>

<style lang="scss">
.footies {
  min-height: 1200px;
  flex-grow: 1;

  background-image: url('/b3.svg');
  background-position: center bottom;
  background-repeat: repeat-x;

  user-select: none;

  .footies-github-icon {
    background-image: url('/GitHub_Invertocat_Black.png');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    width: 32px;
    height: 32px;
  }

  .footies-left {
    position: absolute;
    left: 20px;
    bottom: 20px;
    right: 0;

    height: 800px;

    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: flex-end;

    gap: 20px;
    overflow-x: hidden;
  }

  .footies-left-entry {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: 10px;

    a,
    img {
      display: block;
    }

    .desc {
      z-index: 10;

      background-color: var(--transparent-bg);
      backdrop-filter: blur(10px);

      font-family: var(--font-text-monospace);
      font-size: 0.8em;
      white-space: nowrap;

      > span {
        border: 2px dotted var(--text);
        padding: 0 5px;
      }
    }
  }
}

@media screen and (width < 600px) {
  .footies-neocities-logo {
    transform: scale(0.8);
    transform-origin: bottom left;
  }

  .footies-left-entry .desc {
    position: absolute;
    top: 0;
    transform: translateY(-100%) translateY(-10px);
  }
}

.footies.hidden {
  min-height: 0;
  max-height: 0;
  visibility: hidden;
}
</style>
