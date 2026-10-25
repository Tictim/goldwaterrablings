<script lang="ts" setup>
import { data } from '../../data/things.data.mts'
import Card from './Card.vue'
import { NO_TITLE, timestampToText, UNKNOWN_DATE } from '../things.ts'
</script>

<template>
  <div class="deck">
    <Card
      v-for="d of data"
      :href="d.url"
      :title="d.frontmatter['title'] ?? NO_TITLE"
      :thumbnail="d.frontmatter['thumbnail']"
      :timestamp="timestampToText(d.frontmatter['timestamp']) ?? UNKNOWN_DATE"
      :description="d.frontmatter['description']"
    />
  </div>
</template>
