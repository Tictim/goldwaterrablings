---
title: tools
---

<script setup>
import { data } from '@data/tools.data.mts'
import { NO_TITLE } from '@components/things.ts'
</script>

Tools I self-prescribed myself to alleviate my supercritical hatred toward this wretched poopin' Saha world. Now you can too! Wizard Colonoscopy Beads not included.

Not optimized for low-width displays! Bring yo' monitors.

<div class="deck">
  <Card
    v-for="d of data"
    :href="d.url"
    :title="d.frontmatter['title'] ?? NO_TITLE"
    :thumbnail="d.frontmatter['thumbnail']"
    :description="d.frontmatter['description']"
  />
</div>
