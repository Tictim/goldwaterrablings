<script lang="ts" setup>
const props = defineProps<{
  href?: string
  title?: string
  thumbnail?: string
  timestamp?: string
  description?: string
}>()
</script>

<template>
  <a class="card nostyle" :href="props.href">
    <div class="card-layout">
      <span class="card-image-block" :class="{ nothumb: !props.thumbnail }">
        <img class="card-image" :src="props.thumbnail" />
        <span class="card-title-block">
          <span class="card-timestamp">{{ props.timestamp }}</span>
          <span class="card-title coolmask">::{{ props.title ?? '' }}</span>
        </span>
      </span>
      <span class="card-excerpt" v-html="props.description ?? ''"></span>
    </div>
  </a>
</template>

<style lang="scss">
.card {
  position: relative;

  color: var(--text);
  text-decoration: none;

  padding: 15px 15px;
  border-radius: 20px;
  background-color: var(--transparent-bg-content);

  overflow: hidden;
  min-width: 0;

  * {
    vertical-align: baseline;
    align-content: baseline;
    // overflow: hidden;
    user-select: none;
  }
}

.card-layout {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
}

.card-image-block {
  position: relative;
  display: block;
  // width: 320px;
  // height: 180px;
  aspect-ratio: 320 / 180;
  overflow: hidden;

  &.nothumb {
    background-image: var(--nothumb);
    background-size: cover;
    background-repeat: no-repeat;

    .card-image {
      visibility: hidden;
    }
  }
}

.card-image {
  display: block;
  width: 100%;
  height: 100%;
}

.card-title-block {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  align-items: baseline;
  justify-content: space-between;
}

.card-title {
  position: absolute;
  left: 12px;
  right: 12px;
  top: 8px;
  bottom: 8px;

  color: var(--text);
  font-family: var(--font-text-monospace);
  font-weight: bold;
  font-size: 1.2rem;

  text-wrap-style: stable;
}

.card-timestamp {
  position: absolute;
  right: 12px;
  bottom: 2px;
  text-shadow: -1px 2px var(--text-shadow);
}

.card-timestamp,
.card-excerpt {
  color: var(--text-dim);
  font-family: var(--font-text-monospace);
  font-size: 0.8rem;

  white-space: nowrap;
  text-overflow: clip;
  overflow: clip;
}

.card-excerpt {
  mask-image: linear-gradient(to right, black calc(100% - 16px), transparent 100%);
}
</style>
