---
title: things
---

<script setup>
import { data } from '@data/things.data.mts'
import { NO_TITLE, timestampToText, UNKNOWN_DATE } from '@components/things.ts'
</script>

An assemblage of things I made and things I made. If it is good then it is good. If it is not good then you should try to enjoy more ithink

Incorrect opinions. Hurty languages. Viewer discregtion advised.

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
