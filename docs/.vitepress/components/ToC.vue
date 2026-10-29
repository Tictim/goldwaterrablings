<script lang="ts" setup>
import { useData } from 'vitepress'

const { page } = useData()
</script>

<template>
  <input type="checkbox" id="content-headers-toggle" style="display: none" />
  <div class="content-headers-block">
    <div class="content-headers-border coolmask"></div>
    <div class="content-headers-title">
      <span class="coolmask"></span>
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
  padding: 20px;
  width: 320px;

  background-color: var(--transparent-bg-content);
  backdrop-filter: blur(10px);
  // border-radius: 40px;

  user-select: none;
}

.main.main-tool .content-headers-block {
  visibility: collapse;
}

.content-headers-border {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border: 2px dotted var(--text);

  pointer-events: none;
}

.content-headers-title {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  > * {
    display: block;
  }

  > span::before {
    content: '::table of contents';
    font-size: 1.3em;
    font-weight: bold;
    line-height: 100%;
    white-space: pre;
  }

  > label {
    color: var(--text-dim);
    font-family: var(--font-text-monospace);
    font-size: 0.8em;
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

.content-headers {
  display: flex;
  flex-direction: column;
  gap: 10px;

  overflow-x: hidden;
  overflow-y: auto;
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

@media screen and (width >= 1150px) {
  #content-headers-toggle:checked + .content-headers-block {
    .content-headers-title > label::before {
      content: '[show]';
    }

    .content-headers-toggleable {
      display: none;
    }
  }
}

@media screen and (width < 1150px) {
  .content-headers-block {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 15;

    background-color: var(--transparent-bg);
    backdrop-filter: blur(2px);
  }

  #content-headers-toggle:not(:checked) + .content-headers-block {
    padding: 10px;
    width: auto;

    .content-headers-title {
      > span::before {
        content: '::table of contents';
        font-size: 1.1em;
      }

      > label {
        &::before {
          content: '[show]';
        }
      }
    }

    .content-headers-toggleable {
      display: none;
    }
  }
}
</style>
