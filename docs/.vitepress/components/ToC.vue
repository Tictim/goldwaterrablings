<script lang="ts" setup>
import { useData } from 'vitepress'

const { page } = useData()
</script>

<template>
  <div class="content-headers-block">
    <input type="checkbox" id="content-headers-toggle" style="display: none" />
    <div class="content-headers-title">
      <span class="coolmask">::table of contents</span>
      <label for="content-headers-toggle"></label>
    </div>
    <hr class="content-headers-devider content-headers-toggleable" />
    <nav class="content-headers content-headers-toggleable">
      <div v-for="h in page.headers" class="content-header-1-block">
        <a class="nostyle content-header-1" :href="h.link">
          <span class="coolmask">{{ h.title }}</span>
        </a>

        <div v-if="h.children.length > 0" class="content-header-2-block">
          <a v-for="h2 in h.children" class="nostyle content-header-2" :href="h2.link">
            <span>{{ h2.title }}</span>
          </a>
        </div>
      </div>
    </nav>
  </div>
</template>

<style lang="scss">
.content-headers-block {
  position: sticky;
  top: 10px;

  max-height: calc(100vh - 20px);

  display: flex;
  flex-direction: column;
  padding: 30px 25px;
  width: 320px;

  background-color: var(--transparent-bg-content);
  backdrop-filter: blur(10px);
  border-radius: 40px;

  user-select: none;
}

.main.main-tool .content-headers-block {
  visibility: collapse;
}

.content-headers-title {
  display: flex;
  align-items: start;
  justify-content: space-between;

  > span {
    font-size: 1.3em;
    font-weight: bold;
    line-height: 100%;
    white-space: pre;
  }

  > label {
    color: var(--text-dim);
    font-family: var(--font-text-monospace);
    font-size: 0.9em;
    white-space: pre;

    cursor: pointer;

    &::before {
      content: '[hide]';
    }
  }
}

.content-headers-devider {
  margin: 8px 0 16px 0;
}

#content-headers-toggle:checked {
  ~ .content-headers-title > label::before {
    content: '[show]';
  }

  ~ .content-headers-toggleable {
    visibility: collapse;
  }
}

.content-headers {
  display: flex;
  flex-direction: column;
  gap: 10px;

  overflow-x: hidden;
  overflow-y: scroll;
}

.content-header-1-block {
  display: flex;
  flex-direction: column;
}

.content-header-1 {
  display: inline-block;
  font-size: 1.1em;

  > span {
    font-weight: bold;
    // white-space: pre;
  }
}

.content-header-2-block {
  display: flex;
  flex-direction: column;
}

.content-header-2 {
  display: inline-block;
  padding-left: 8px;

  font-size: 0.9em;

  > span {
    color: var(--text-dim) !important;
    white-space: pre;
  }
}

@media print {
  .content-headers-block {
    display: none;
  }
}

@media screen and (width < 1150px) {
  // TODO fuck
}
</style>
