---
title: test
---

<script setup>
import { data } from '@data/test.data.mts'
import { NO_TITLE, timestampToText } from '@components/things.ts'
</script>

doyou like tests?i fucking hate tests

<div class="deck">
  <Card
    v-for="d of data"
    :href="d.url"
    :title="d.frontmatter['title'] ?? NO_TITLE"
    :thumbnail="d.frontmatter['thumbnail']"
    :timestamp="timestampToText(d.frontmatter['timestamp'])"
    :description="d.frontmatter['description']"
  />
</div>
