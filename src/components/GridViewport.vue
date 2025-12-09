<script setup lang="ts">
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
})

const columns = ref([
  { field: 'id', cellDataType: 'string' },
  { field: 'parent', cellDataType: 'string', rowGroup: true },
  { field: 'label', flex: 2, cellDataType: 'string' }
])
</script>

<template>
  <ag-grid-vue
    class="grid"
    :rowData="data"
    :columnDefs="columns"
    />
</template>

<style>
.grid {
  height: 100vh;
}

.grid .ag-root-wrapper {
  border-radius: 0 !important;
}

</style>
