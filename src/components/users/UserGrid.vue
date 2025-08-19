<script lang="ts" setup>
import { Message, Location } from '@element-plus/icons-vue'
import type { DisplayUser } from '@/lib/types/global'
import { getInitials } from '@/lib/helpers'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'
import { computed } from 'vue'
import useSearchParams from '@/composables/useSearchParams'

const props = defineProps<{
  users: DisplayUser[]
  currentPage: string
  handleCurrentChange: (page: number) => void
}>()

const router = useRouter()
const userStore = useUserStore()

const pageSize = useSearchParams('size', '12', 'home')

const currentPageNum = computed(() => Number(props.currentPage) || 1)
const pageSizeNum = computed(() => Number(pageSize.value) || 12)

const paginatedUsers = computed(() => {
  return userStore.getPaginatedUsers(currentPageNum.value, pageSizeNum.value, props.users)
})

const totalUsers = computed(() => userStore.totalUsers)

const handleSizeChange = (size: number) => {
  pageSize.value = String(size)
}
</script>

<template>
  <div class="user-container">
    <div class="content-area">
      <div v-if="userStore.loading" class="user-grid">
        <div v-for="n in 12" :key="n" class="skeleton-card">
          <el-skeleton animated>
            <template #template>
              <div class="skeleton-card-header">
                <div class="skeleton-user-info">
                  <el-skeleton-item variant="circle" class="skeleton-avatar" />
                  <div class="skeleton-user-details">
                    <el-skeleton-item variant="h3" class="skeleton-name" />
                    <el-skeleton-item variant="text" class="skeleton-id" />
                  </div>
                </div>
              </div>

              <div class="skeleton-card-content">
                <div class="skeleton-info-item">
                  <el-skeleton-item variant="circle" class="skeleton-icon" />
                  <el-skeleton-item variant="text" class="skeleton-email" />
                </div>
                <div class="skeleton-info-item">
                  <el-skeleton-item variant="circle" class="skeleton-icon" />
                  <el-skeleton-item variant="text" class="skeleton-address" />
                </div>
              </div>
            </template>
          </el-skeleton>
        </div>
      </div>

      <div v-else>
        <div class="user-grid">
          <div
            v-for="user in paginatedUsers"
            :key="user.id"
            class="user-card"
            @click="router.push({ name: 'user-profile', params: { userId: user.id } })"
          >
            <div class="card-header">
              <div class="user-info">
                <div class="user-avatar">
                  {{ getInitials(user.name) }}
                </div>
                <div class="user-details">
                  <h3 class="user-name">{{ user.name }}</h3>
                  <span class="user-id">ID: {{ user.id }}</span>
                </div>
              </div>
            </div>

            <div class="card-content">
              <div class="info-item">
                <el-icon class="info-icon">
                  <Message />
                </el-icon>
                <span class="info-text">{{ user.email }}</span>
              </div>

              <div class="info-item">
                <el-icon class="info-icon">
                  <Location />
                </el-icon>
                <span class="info-text">{{ user.address }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-fixed">
      <el-pagination
        :current-page="currentPageNum"
        :page-size="pageSizeNum"
        :page-sizes="[12, 24, 36, 48]"
        :total="totalUsers"
        layout="total, sizes, prev, pager, next, jumper"
        small
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
      />
    </div>
  </div>
</template>

<style scoped>
.user-container {
  height: calc(100vh - 230px);
  display: flex;
  flex-direction: column;
  padding: 12px;
  max-width: 1900px;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

/* Bottom Pagination */
.pagination-fixed {
  margin-top: auto;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
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

.pagination-fixed :deep(.el-pagination .el-pagination__sizes) {
  margin: 0 4px;
}

.pagination-fixed :deep(.el-pagination .el-pagination__jump) {
  margin-left: 4px;
}

.user-details {
  flex: 1;
}

.skeleton-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e1e5e9;
  height: 206px;
}

.skeleton-card-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.skeleton-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-user-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-name {
  width: 140px;
  height: 16px;
}

.skeleton-id {
  width: 60px;
  height: 12px;
}

.skeleton-card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.skeleton-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-email {
  width: 200px;
  height: 14px;
}

.skeleton-address {
  width: 250px;
  height: 14px;
}

/* Mobile first - base styles for mobile */
.user-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  max-width: 1900px;
  margin: 0 auto;
}

.user-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.2s ease;
  border: 1px solid #e1e5e9;
  cursor: pointer;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.card-header {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  background: #1a1a1a;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
  color: white;
  border: 2px solid #333;
  flex-shrink: 0;
}

.user-name {
  margin: 0 0 2px 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  line-height: 1.2;
}

.user-id {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.card-content {
  padding: 12px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  padding: 4px 0;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-icon {
  margin-right: 8px;
  margin-top: 2px;
  color: #1a1a1a;
  font-size: 1rem;
  flex-shrink: 0;
}

.info-text {
  font-size: 0.8rem;
  color: #333;
  line-height: 1.4;
  word-break: break-word;
  flex: 1;
}

@media (min-width: 375px) {
  .user-avatar {
    width: 38px;
    height: 38px;
    font-size: 0.85rem;
  }

  .user-name {
    font-size: 0.95rem;
  }

  .info-text {
    font-size: 0.82rem;
  }
}

@media (min-width: 450px) {
  .pagination {
    padding: 0 2rem;
  }
}

@media (min-width: 480px) {
  .user-container {
    height: calc(100vh - 245px);
    padding: 16px;
  }

  .user-grid {
    gap: 16px;
  }

  .pagination-fixed {
    padding: 24px 0;
  }

  .user-card {
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  .user-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }

  .card-header {
    padding: 14px;
  }

  .user-info {
    gap: 12px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    font-size: 0.875rem;
  }

  .user-name {
    font-size: 1rem;
    margin: 0 0 4px 0;
  }

  .user-id {
    font-size: 0.75rem;
  }

  .card-content {
    padding: 14px;
  }

  .info-item {
    margin-bottom: 14px;
    padding: 6px 0;
  }

  .info-icon {
    margin-right: 10px;
    font-size: 1.1rem;
  }

  .info-text {
    font-size: 0.85rem;
  }
}

@media (min-width: 768px) {
  .user-container {
    height: calc(100vh - 155px);
    padding: 20px;
  }

  .user-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
  }

  .pagination-fixed {
    padding: 28px 0;
  }

  .user-card {
    border-radius: 12px;
  }

  .user-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .card-content {
    padding: 16px;
  }

  .info-item {
    margin-bottom: 16px;
    padding: 8px 0;
  }

  .info-icon {
    margin-right: 12px;
    font-size: 1.125rem;
  }

  .info-text {
    font-size: 0.875rem;
  }
}

@media (min-width: 1024px) {
  .user-container {
    height: calc(100vh - 195px);
    padding: 24px;
  }

  .user-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }

  .pagination-fixed {
    padding: 32px 0;
  }
}

@media (min-width: 1280px) {
  .user-grid {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
  }
}
</style>
