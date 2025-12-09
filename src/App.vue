<script setup lang="ts">
import GridViewport from '@/components/GridViewport.vue'

const items = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cee', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 7, label: 'Айтем 3' },
  { id: 4, parent: '91064cee', label: 'Айтем 4' },
  { id: 5, parent: '91064cee', label: 'Айтем 5' },
  { id: 6, parent: '91064cee', label: 'Айтем 6' },
  { id: 7, parent: 1, label: 'Айтем 7' },
  { id: 8, parent: 5, label: 'Айтем 8' }
]

</script>

<template>
  <GridViewport :data="items" />
</template>

<style scoped></style>
