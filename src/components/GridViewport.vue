<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ColDef, GetDataPath } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'

import type { TItem } from '@/store/TreeStore.ts'
import TreeStore from '@/store/TreeStore.ts'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
})

const storage = new TreeStore(props.data as TItem[])

const defaultColDef = ref<ColDef>({ flex: 1 })
const columnDefs = ref<ColDef[]>([

  // In latest version of AgGrid node.rowIndex does not correspond to real row position, so i have to use RowNumbersModule from enterprise lib without changing header text

  // {
  //   headerName: '№ п/п',
  //   lockPosition: "left",
  //   resizable: false,
  //   width: 100,
  //   flex: 0,
  //   cellClass: 'index-cell',
  //   valueGetter: ({ node }) => (node?.rowIndex || 0) + 1
  // },

  { field: 'label', headerName: 'Наименование', flex: 2, cellDataType: 'string' }
])
const autoGroupColumnDef = ref<ColDef>({
  headerName: "Категория",
  sortable: false,
  sort: "asc",
  field: "group",
  valueGetter: ({ data }) => storage.getChildren(data.id).length ? 'Группа' : 'Элемент',
  cellClass: ({ value }) => value == 'Группа' ? 'group': 'element',
  cellRendererParams: {
    suppressCount: true,
  },
});
const groupDefaultExpanded = ref(-1)
const rowData = computed<TItem[]|null>(() => storage.getAll())
const getDataPath = ref<GetDataPath>((data:TItem) => storage.getAllParents(data.id).map(({ id }) => id+'').reverse())

</script>

<template>
  <ag-grid-vue
    class="grid"
    treeData
    :rowData="rowData"
    :getDataPath="getDataPath"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :autoGroupColumnDef="autoGroupColumnDef"
    :groupDefaultExpanded="groupDefaultExpanded"
    rowNumbers
    />
</template>

<style>
.grid {
  height: 100vh;
}

.grid .ag-root-wrapper {
  border-radius: 0 !important;
}

.grid .ag-cell-value {
  padding: 0 8px;
}

.grid .ag-cell-value.index-cell {
  font-weight: bold;
  padding-left: 20px;
}
.grid .ag-cell-value .ag-cell-wrapper {
  padding-left: calc(var(--ag-indentation-level) * var(--ag-row-group-indent-size) / 3);
}
.grid .ag-cell-value.group .ag-group-value {
  font-weight: bold;
}

</style>
