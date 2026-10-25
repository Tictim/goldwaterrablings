<script lang="ts" setup>
import { data } from '../../data/tools.data.mts'
import Card from './Card.vue'
import { NO_TITLE } from '../things.ts'
</script>

<template>
  <div class="deck">
    <Card
      v-for="d of data"
      :href="d.url"
      :title="d.frontmatter['title'] ?? NO_TITLE"
      :thumbnail="d.frontmatter['thumbnail']"
      :description="d.frontmatter['description']"
    />
  </div>
</template>
