<script setup lang="ts">
import type { DisplayUser } from '@/lib/types/global'
import { useUserStore } from '@/stores/UserStore'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const props = defineProps<{ users: DisplayUser[] }>()

const router = useRouter()
const userStore = useUserStore()

const currentPage = ref(1)
const pageSize = ref(10)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return props.users.slice(start, end)
})

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1 // Reset to first page when changing page size
}
</script>

<template>
  <div class="table-container">
    <div v-if="userStore.loading" class="table-skeleton">
      <el-skeleton animated>
        <template #template>
          <div class="skeleton-table-header">
            <el-skeleton-item variant="text" style="width: 80px; height: 20px" />
            <el-skeleton-item variant="text" style="width: 270px; height: 20px" />
            <el-skeleton-item variant="text" style="width: 270px; height: 20px" />
            <el-skeleton-item variant="text" style="width: 600px; height: 20px" />
            <el-skeleton-item variant="text" style="width: 120px; height: 20px" />
          </div>

          <div v-for="n in 8" :key="n" class="skeleton-table-row">
            <el-skeleton-item variant="text" style="width: 60px; height: 16px" />
            <el-skeleton-item variant="text" style="width: 200px; height: 16px" />
            <el-skeleton-item variant="text" style="width: 220px; height: 16px" />
            <el-skeleton-item variant="text" style="width: 400px; height: 16px" />
            <el-skeleton-item variant="button" style="width: 60px; height: 24px" />
          </div>
        </template>
      </el-skeleton>
    </div>

    <div v-else>
      <el-table :data="paginatedUsers" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="Name" width="270" />
        <el-table-column prop="email" label="Email" width="270" />
        <el-table-column prop="address" label="Address" min-width="600" />
        <el-table-column fixed="right" label="Operations" width="120">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="router.push({ name: 'user-profile', params: { userId: scope.row.id } })"
            >
              Detail
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="users.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  padding: 8px;
  overflow-x: auto;
}

.table-skeleton {
  background: white;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #ebeef5;
  min-width: 600px;
}

.skeleton-table-header {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 6px;
  gap: 8px;
}

.skeleton-table-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f7fa;
  gap: 8px;
}

.skeleton-table-row:last-child {
  border-bottom: none;
}

.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
  padding: 12px 8px;
  gap: 12px;
}

.pagination-container :deep(.el-pagination) {
  flex-wrap: wrap;
  justify-content: center;
}

.pagination-container :deep(.el-pagination .btn-prev),
.pagination-container :deep(.el-pagination .btn-next),
.pagination-container :deep(.el-pagination .el-pager li) {
  min-width: 32px;
  height: 32px;
}

.pagination-container :deep(.el-pagination .el-pagination__total),
.pagination-container :deep(.el-pagination .el-pagination__sizes),
.pagination-container :deep(.el-pagination .el-pagination__jump) {
  margin: 2px 4px;
  font-size: 12px;
}

@media (max-width: 360px) {
  .pagination-container :deep(.el-pagination .el-pagination__jump) {
    display: none;
  }
}

@media (min-width: 375px) {
  .table-container {
    padding: 10px;
  }

  .table-skeleton {
    padding: 14px;
  }

  .pagination-container :deep(.el-pagination .el-pagination__total),
  .pagination-container :deep(.el-pagination .el-pagination__sizes),
  .pagination-container :deep(.el-pagination .el-pagination__jump) {
    font-size: 13px;
  }
}

@media (min-width: 480px) {
  .table-container {
    padding: 12px;
  }

  .table-skeleton {
    border-radius: 8px;
    padding: 16px;
  }

  .skeleton-table-header {
    padding: 10px 0;
    margin-bottom: 8px;
  }

  .skeleton-table-row {
    padding: 10px 0;
  }

  .pagination-container {
    margin-top: 20px;
    padding: 14px 12px;
  }

  .pagination-container :deep(.el-pagination .btn-prev),
  .pagination-container :deep(.el-pagination .btn-next),
  .pagination-container :deep(.el-pagination .el-pager li) {
    min-width: 36px;
    height: 36px;
  }

  .pagination-container :deep(.el-pagination .el-pagination__total),
  .pagination-container :deep(.el-pagination .el-pagination__sizes),
  .pagination-container :deep(.el-pagination .el-pagination__jump) {
    font-size: 14px;
  }
}

@media (min-width: 768px) {
  .table-container {
    padding: 16px;
    overflow-x: visible;
  }

  .table-skeleton {
    min-width: auto;
  }

  .skeleton-table-header {
    padding: 12px 0;
  }

  .skeleton-table-row {
    padding: 12px 0;
    gap: 16px;
  }

  .pagination-container {
    flex-direction: row;
    margin-top: 24px;
    padding: 16px 0;
    gap: 0;
  }

  .pagination-container :deep(.el-pagination) {
    flex-wrap: nowrap;
  }

  .pagination-container :deep(.el-pagination .el-pagination__total),
  .pagination-container :deep(.el-pagination .el-pagination__sizes),
  .pagination-container :deep(.el-pagination .el-pagination__jump) {
    margin: 0 8px;
  }
}

@media (min-width: 1024px) {
  .table-container {
    padding: 20px;
  }
}

@media (min-width: 1280px) {
  .table-container {
    padding: 24px;
  }
}
</style>
