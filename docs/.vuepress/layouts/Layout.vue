<template>
  <Layout>
    <template #page-bottom>
      <GlobalFooter />
    </template>
  </Layout>
</template>

<script setup>
import { Layout } from '@vuepress/theme-default'
import GlobalFooter from '../components/GlobalFooter.vue'
</script>
