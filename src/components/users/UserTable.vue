<script setup lang="ts">
import type { DisplayUser } from '@/lib/types/global'
import { useUserStore } from '@/stores/UserStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import useSearchParams from '@/composables/useSearchParams'

const props = defineProps<{ users: DisplayUser[] }>()

const router = useRouter()
const userStore = useUserStore()

const currentPage = useSearchParams('page', '1', 'home')
const pageSize = useSearchParams('size', '10', 'home')

const currentPageNum = computed(() => Number(currentPage.value) || 1)
const pageSizeNum = computed(() => Number(pageSize.value) || 10)

const paginatedUsers = computed(() => {
  return userStore.getPaginatedUsers(currentPageNum.value, pageSizeNum.value, props.users)
})

const totalUsers = computed(() => userStore.totalUsers)

const handleCurrentChange = (page: number) => {
  currentPage.value = String(page)
}

const handleSizeChange = (size: number) => {
  pageSize.value = String(size)
  currentPage.value = '1'
}
</script>

<template>
  <div class="table-container">
    <div class="content-area">
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
      </div>
    </div>

    <div class="pagination-fixed">
      <el-pagination
        :current-page="currentPageNum"
        :page-size="pageSizeNum"
        :page-sizes="[10, 20, 50, 100]"
        :total="totalUsers"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped>
/* Container Layout */
.table-container {
  height: calc(100vh - 230px);
  display: flex;
  flex-direction: column;
  padding: 8px;
  max-width: 1900px;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  min-height: 0;
}

/* Bottom Pagination */
.pagination-fixed {
  margin-top: auto;
  padding: 16px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
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

.pagination-fixed :deep(.el-pagination) {
  flex-wrap: wrap;
  justify-content: center;
}

.pagination-fixed :deep(.el-pagination .btn-prev),
.pagination-fixed :deep(.el-pagination .btn-next),
.pagination-fixed :deep(.el-pagination .el-pager li) {
  min-width: 32px;
  height: 32px;
}

.pagination-fixed :deep(.el-pagination .el-pagination__total),
.pagination-fixed :deep(.el-pagination .el-pagination__sizes),
.pagination-fixed :deep(.el-pagination .el-pagination__jump) {
  margin: 2px 4px;
  font-size: 12px;
}

@media (max-width: 360px) {
  .pagination-fixed :deep(.el-pagination .el-pagination__jump) {
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

  .pagination-fixed :deep(.el-pagination .el-pagination__total),
  .pagination-fixed :deep(.el-pagination .el-pagination__sizes),
  .pagination-fixed :deep(.el-pagination .el-pagination__jump) {
    font-size: 13px;
  }
}

@media (min-width: 450px) {
  .pagination-fixed :deep(.el-pagination) {
    padding: 0 2rem;
  }
}

@media (min-width: 480px) {
  .table-container {
    height: calc(100vh - 245px);
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

  .pagination-fixed {
    padding: 20px 12px;
  }

  .pagination-fixed :deep(.el-pagination .btn-prev),
  .pagination-fixed :deep(.el-pagination .btn-next),
  .pagination-fixed :deep(.el-pagination .el-pager li) {
    min-width: 36px;
    height: 36px;
  }

  .pagination-fixed :deep(.el-pagination .el-pagination__total),
  .pagination-fixed :deep(.el-pagination .el-pagination__sizes),
  .pagination-fixed :deep(.el-pagination .el-pagination__jump) {
    font-size: 14px;
  }
}

@media (min-width: 768px) {
  .table-container {
    height: calc(100vh - 155px);
    padding: 16px;
  }

  .content-area {
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

  .pagination-fixed {
    padding: 24px 0;
  }

  .pagination-fixed :deep(.el-pagination) {
    flex-wrap: nowrap;
  }

  .pagination-fixed :deep(.el-pagination .el-pagination__total),
  .pagination-fixed :deep(.el-pagination .el-pagination__sizes),
  .pagination-fixed :deep(.el-pagination .el-pagination__jump) {
    margin: 0 8px;
  }
}

@media (min-width: 1024px) {
  .table-container {
    height: calc(100vh - 195px);
    padding: 20px;
  }

  .pagination-fixed {
    padding: 28px 0;
  }
}

@media (min-width: 1280px) {
  .table-container {
    padding: 24px;
  }
}
</style>
