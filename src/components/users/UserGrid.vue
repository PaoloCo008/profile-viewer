<script lang="ts" setup>
import { Message, Location } from '@element-plus/icons-vue'
import type { DisplayUser } from '@/lib/types/global'

defineProps<{ users: DisplayUser[] }>()

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <div class="user-container">
    <div class="user-grid">
      <div v-for="user in users" :key="user.id" class="user-card">
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

.user-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e1e5e9;
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
}

@media (min-width: 768px) {
  .user-container {
    padding: 20px;
  }

  .user-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 18px;
  }

  .card-header {
    padding: 18px;
  }

  .card-content {
    padding: 18px;
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

  .card-header {
    padding: 20px;
  }

  .card-content {
    padding: 20px;
  }

  .user-info {
    gap: 16px;
  }

  .user-avatar {
    width: 48px;
    height: 48px;
    font-size: 16px;
  }

  .user-name {
    font-size: 18px;
  }
}
</style>
