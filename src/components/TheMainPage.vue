<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import UserGrid from './users/UserGrid.vue'
import UserTable from './users/UserTable.vue'
import UserDraggableActions from './users/UserDraggableActions.vue'
import { Grid3x3, Plus, Table } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import AppSearch from './app/AppSearch.vue'

let abortController: AbortController | null = null

const userStore = useUserStore()

const isRefreshing = ref(false)
const viewMode = ref<'table' | 'grid'>('table')
const floatingPanelVisible = ref(false)

const users = computed(() =>
  userStore.users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    address: `${user.address.street}, ${user.address.city}`,
  })),
)

const isTableView = computed(() => viewMode.value === 'table')
const isGridView = computed(() => viewMode.value === 'grid')

function toggleView(mode: 'table' | 'grid') {
  viewMode.value = mode
}

function toggleFloatingPanel() {
  floatingPanelVisible.value = !floatingPanelVisible.value
}

function closeFloatingPanel() {
  floatingPanelVisible.value = false
}

async function refreshUsers() {
  if (isRefreshing.value) return

  isRefreshing.value = true

  abortController = new AbortController()

  try {
    const fetchedUsers = await userStore.fetchUsers(abortController)

    if (fetchedUsers) {
      ElMessage.success('Users refreshed successfully')
    } else {
      ElMessage.error('Failed to refresh users')
    }
  } catch (err) {
    console.error('Failed to refresh users:', err)
    ElMessage.error((err as Error)?.message || 'Failed to refresh user data')
  } finally {
    setTimeout(() => {
      isRefreshing.value = false
    }, 500)
  }
}

onMounted(async () => {
  abortController = new AbortController()

  try {
    const fetchedUsers = await userStore.fetchUsers(abortController)

    if (!fetchedUsers) {
      ElMessage.error('User not found')
    }
  } catch (err) {
    console.error('Failed to fetch user:', err)
    ElMessage.error((err as Error).message || 'Failed to load user data')
  }
})

onBeforeUnmount(() => {
  console.log('Log on onBeforeUnmount')

  abortController?.abort()
})
</script>

<template>
  <div class="user-view-container">
    <div class="view-header">
      <div class="header-content">
        <div class="header-title">
          <h2 class="page-title">Users</h2>
          <el-icon class="refresh-icon" :class="{ refreshing: isRefreshing }" @click="refreshUsers"
            ><Refresh
          /></el-icon>
        </div>

        <AppSearch :users />

        <div class="header-actions">
          <span class="control-label">View:</span>
          <div class="toggle-group">
            <button :class="['toggle-btn', { active: isTableView }]" @click="toggleView('table')">
              <Table /> Table
            </button>
            <button :class="['toggle-btn', { active: isGridView }]" @click="toggleView('grid')">
              <Grid3x3 /> Grid
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="view-content">
      <UserTable v-if="isTableView" :users="users" />
      <UserGrid v-else :users="users" />
    </div>

    <button
      class="floating-action-btn"
      :class="{ active: floatingPanelVisible }"
      @click="toggleFloatingPanel"
      title="Quick Actions"
    >
      <span class="fab-icon"> <Plus /> </span>
    </button>

    <UserDraggableActions v-if="floatingPanelVisible" :users="users" @close="closeFloatingPanel" />
  </div>
</template>

<style scoped>
.refresh-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
}

.refresh-icon.refreshing {
  animation: spin 1s linear infinite;
  color: #3b82f6;
  cursor: not-allowed;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.user-view-container {
  padding: 1rem;
  background-color: #f5f7fa;
  min-height: 100vh;
  position: relative;
}

.view-header {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  padding: 16px;
  position: relative;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.page-title {
  margin: 0;
  font-size: 1.375rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
}

.header-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.control-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;
}

.toggle-group {
  display: flex;
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 3px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 180px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  background: transparent;
  border-radius: 5px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-height: 40px;
}

.toggle-btn:hover {
  color: #000000;
}

.toggle-btn.active {
  background: #000000;
  color: #ffffff;
}

.view-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.floating-action-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 998;
}

.floating-action-btn:hover {
  box-shadow: 0 6px 20px hsla(0, 0%, 10%, 0.35);
}

.floating-action-btn.active {
  background: #dc2626;
  transform: rotate(135deg);
}

.floating-action-btn.active:hover {
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.35);
}

.fab-icon {
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

@media (min-width: 480px) {
  .view-header {
    padding: 18px;
    margin-bottom: 20px;
  }

  .page-title {
    font-size: 1.875rem;
  }

  .view-header-actions {
    gap: 12px;
  }

  .floating-action-btn {
    bottom: 32px;
    right: 32px;
  }
}

@media (min-width: 768px) {
  .refresh-icon {
    position: static;
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-view-container {
    padding: 20px;
  }

  .view-header {
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .header-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .page-title {
    font-size: 1.625rem;
    text-align: left;
  }

  .header-actions {
    flex-direction: row;
    gap: 24px;
    width: auto;
    align-items: center;
  }

  .view-controls {
    flex-direction: row;
    width: auto;
  }

  .toggle-group {
    border-radius: 9px;
    padding: 4px;
    max-width: none;
  }

  .toggle-btn {
    min-width: 75px;
    padding: 8px 16px;
  }

  .view-content {
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

@media (min-width: 1024px) {
  .user-view-container {
    padding: 32px;
  }

  .view-header {
    padding: 28px;
  }

  .page-title {
    font-size: 2rem;
  }

  .control-label {
    font-size: 0.875rem;
  }

  .toggle-group {
    border-radius: 10px;
  }

  .toggle-btn {
    min-width: 80px;
    font-size: 0.875rem;
    gap: 6px;
  }

  .view-content {
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }

  .floating-action-btn {
    width: 64px;
    height: 64px;
    bottom: 40px;
    right: 40px;
  }

  .fab-icon {
    font-size: 1.75rem;
  }
}
</style>
