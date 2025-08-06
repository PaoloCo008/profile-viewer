<script lang="ts" setup>
import { Message, Location } from '@element-plus/icons-vue'
import type { DisplayUser } from '@/lib/types/global'
import { getInitials } from '@/lib/helpers'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'

defineProps<{ users: DisplayUser[] }>()

const router = useRouter()
const userStore = useUserStore()
</script>

<template>
  <div class="user-container">
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

    <div v-else class="user-grid">
      <div
        v-for="user in users"
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
</template>

<style scoped>
.user-container {
  padding: 12px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.user-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  max-width: 1900px;
  margin: 0 auto;
}

/* Skeleton Styles */
.skeleton-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e1e5e9;
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
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important;
  flex-shrink: 0;
}

.skeleton-user-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-name {
  width: 140px !important;
  height: 16px !important;
}

.skeleton-id {
  width: 60px !important;
  height: 12px !important;
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
  width: 18px !important;
  height: 18px !important;
  border-radius: 50% !important;
  flex-shrink: 0;
}

.skeleton-email {
  width: 200px !important;
  height: 14px !important;
}

.skeleton-address {
  width: 250px !important;
  height: 14px !important;
}

/* Original Card Styles */
.user-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e1e5e9;
  cursor: pointer;
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #1a1a1a;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: white;
  border: 2px solid #333;
}

.user-details {
  flex: 1;
}

.user-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.user-id {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.card-content {
  padding: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px 0;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-icon {
  margin-right: 12px;
  color: #1a1a1a;
  font-size: 18px;
}

.info-text {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  word-break: break-word;
}

/* Mobile-first responsive design */
@media (min-width: 480px) {
  .user-container {
    padding: 16px;
  }

  .user-grid {
    gap: 16px;
  }

  .skeleton-card-header,
  .card-header {
    padding: 16px;
  }

  .skeleton-card-content,
  .card-content {
    padding: 16px;
  }
}

@media (min-width: 768px) {
  .user-container {
    padding: 20px;
  }

  .user-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 18px;
  }

  .skeleton-card-header,
  .card-header {
    padding: 18px;
  }

  .skeleton-card-content,
  .card-content {
    padding: 18px;
  }

  /* Adjust skeleton sizes for larger screens */
  .skeleton-name {
    width: 160px !important;
  }

  .skeleton-email {
    width: 220px !important;
  }

  .skeleton-address {
    width: 280px !important;
  }
}

@media (min-width: 1024px) {
  .user-container {
    padding: 24px;
  }

  .user-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }

  .skeleton-card-header,
  .card-header {
    padding: 20px;
  }

  .skeleton-card-content,
  .card-content {
    padding: 20px;
  }

  .skeleton-user-info,
  .user-info {
    gap: 16px;
  }

  .skeleton-avatar {
    width: 48px !important;
    height: 48px !important;
  }

  .user-avatar {
    width: 48px;
    height: 48px;
    font-size: 16px;
  }

  .user-name {
    font-size: 18px;
  }

  /* Larger skeleton text for desktop */
  .skeleton-name {
    width: 180px !important;
    height: 18px !important;
  }

  .skeleton-email {
    width: 240px !important;
  }

  .skeleton-address {
    width: 300px !important;
  }
}

/* Additional skeleton animation styling */
.skeleton-card .el-skeleton__item {
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
