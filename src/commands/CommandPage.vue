<template>
  <div class="view-container">
    <PageHeader title="Commands" icon="pi-code" />

    <div class="table-wrapper">
      <DataTable
        :value="records"
        :virtual-scroller-options="{ itemSize: 48 }"
        scrollable
        scroll-height="flex"
        sort-field="name"
        :sort-order="1"
        class="commands-table"
        size="small"
        :loading="loading"
        striped-rows
        removable-sort
        column-resize-mode="fit"
        style="width: 100%"
      >
        <template #empty>
          <div class="empty-state">
            <i class="pi pi-star-fill empty-icon" />
            <p>No commands found.</p>
          </div>
        </template>

        <Column field="name" header="Name" class="col-title" style="width: 200px">
          <template #body="{ data }">
            <span class="command-title">!{{ data.name }}</span>
          </template>
        </Column>

        <Column field="description" header="Description" class="col-title">
          <template #body="{ data }">
            <span class="command-description">{{ data.description }}</span>
            <span class="command-availability" v-if="data.availability"> ({{ data.availability }})</span>
          </template>
        </Column>        
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import PageHeader from '@/components/PageHeader.vue'
import type { CommandRecord } from '@/commands/CommandTypes.ts'

const records = ref<CommandRecord[]>([])
const loading = ref(true)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    const res = await fetch('/data/commands/command-register.json')
    if (!res.ok) throw new Error()
    const json = await res.json()
    records.value = json.records ?? []
  } catch {
    records.value = []
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.view-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--brand-bg);
}

.table-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.commands-table {
  height: 100%;
}

.command-title {
  font-weight: 600;
  font-size: 16px;
}

.command-description {
  font-size: 14px;
}

.command-availability {
  font-size: 15px;
  font-style: italic;
}

.muted {
  color: var(--brand-text-muted);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 60px 0;
  color: var(--brand-text-muted);
}

.empty-icon {
  font-size: 40px;
  color: var(--brand-border);
}

.empty-state code {
  font-family: var(--font-mono);
  background: var(--brand-surface-2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

:deep(.p-datatable-tbody .command-title) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

:deep(.col-title.p-datatable-column-header),
:deep(.p-datatable-tbody > tr > td.col-title) {
  overflow: hidden;
  max-width: 0;
  max-height: 0;
}

</style>
