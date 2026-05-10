<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import SpaceHome from './SpaceHome.vue'
import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'

const { frontmatter } = useData()
</script>

<template>
  <SpaceHome v-if="frontmatter.layout === 'space-home'" />
  <DefaultTheme.Layout v-else>
    <template #nav-bar-content-after>
      <NolebaseEnhancedReadabilitiesMenu />
    </template>
    <template #nav-screen-content-after>
      <NolebaseEnhancedReadabilitiesScreenMenu />
    </template>
  </DefaultTheme.Layout>
</template>
