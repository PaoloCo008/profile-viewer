<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore'
import { computed, onBeforeMount, ref } from 'vue'
import UserGrid from './users/UserGrid.vue'
import UserTable from './users/UserTable.vue'
import UserDraggableActions from './users/UserDraggableActions.vue'
import { Grid3x3, Plus, Table, Search } from 'lucide-vue-next'

const userStore = useUserStore()

// View mode state
const viewMode = ref<'table' | 'grid'>('table')

// Modal state
const modalVisible = ref(false)
const modalMode = ref<'add' | 'edit' | 'delete'>('add')
const selectedUser = ref(null)

// Floating panel state
const floatingPanelVisible = ref(false)

// Search state
const searchValue = ref('')

const users = computed(() =>
  userStore.users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    address: `${user.address.street}, ${user.address.city}`,
    fullAddress: user.address,
  })),
)

// Autocomplete search handler using your array method logic
const handleSearch = (queryString: string, callback: Function) => {
  if (!queryString.trim()) {
    callback(users.value)
    return
  }

  const queries = queryString.toLowerCase().split(/\s+/)

  const results = queries.reduce((acc, query) => {
    const regex = new RegExp(`^${query}|${query}`, 'gim')
    const filterFields = ['name', 'email', 'username']

    return acc.filter((user) => {
      return filterFields.some((field) =>
        regex.test((user[field as keyof typeof user] as string) || ''),
      )
    })
  }, users.value)

  callback(results)
}

const handleSelect = (item: any) => {
  console.log('Selected user:', item)
  // Optionally focus on the selected user or perform other actions
}

const clearSearch = () => {
  searchValue.value = ''
}

const toggleView = (mode: 'table' | 'grid') => {
  viewMode.value = mode
}

const isTableView = computed(() => viewMode.value === 'table')
const isGridView = computed(() => viewMode.value === 'grid')

// Modal methods
const openAddModal = () => {
  modalMode.value = 'add'
  selectedUser.value = null
  modalVisible.value = true
}

const openEditModal = (user: any) => {
  modalMode.value = 'edit'
  selectedUser.value = {
    ...user,
    address: user.fullAddress || { street: '', city: '' },
  }
  modalVisible.value = true
}

const openDeleteModal = (user: any) => {
  modalMode.value = 'delete'
  selectedUser.value = {
    ...user,
    address: user.fullAddress || { street: '', city: '' },
  }
  modalVisible.value = true
}

const closeModal = () => {
  modalVisible.value = false
  selectedUser.value = null
}

// Floating panel methods
const toggleFloatingPanel = () => {
  floatingPanelVisible.value = !floatingPanelVisible.value
}

const closeFloatingPanel = () => {
  floatingPanelVisible.value = false
}

const handleFloatingPanelAction = (mode: 'add' | 'edit' | 'delete', user?: any) => {
  modalMode.value = mode
  selectedUser.value = user || null
  modalVisible.value = true
  // Optionally close the floating panel after opening modal
  // floatingPanelVisible.value = false
}

onBeforeMount(async () => {
  console.log('On onBeforeMount: Fetching users')
  await userStore.fetchUsers()
})
</script>

<template>
  <div class="user-view-container">
    <!-- Header with controls -->
    <div class="view-header">
      <div class="header-content">
        <h2 class="page-title">Users</h2>

        <!-- Search Bar -->
        <div class="search-container">
          <el-autocomplete
            v-model="searchValue"
            :fetch-suggestions="handleSearch"
            placeholder="Search users by name, email, or username"
            @select="handleSelect"
            class="search-input"
            clearable
            :popper-class="'user-search-popper'"
          >
            <template #prefix>
              <Search class="search-icon" />
            </template>
            <template #default="{ item }">
              <div class="search-item">
                <div class="search-item-name">{{ item.name }}</div>
                <div class="search-item-details">
                  <span class="search-item-email">{{ item.email }}</span>
                  <span class="search-item-username">@{{ item.username }}</span>
                </div>
              </div>
            </template>
          </el-autocomplete>
        </div>
        <div class="header-actions">
          <div class="view-controls">
            <span class="control-label">View:</span>
            <div class="toggle-group">
              <button :class="['toggle-btn', { active: isTableView }]" @click="toggleView('table')">
                <Table /> Table
              </button>
              <button :class="['toggle-btn', { active: isGridView }]" @click="toggleView('grid')">
                <Grid3x3 />Grid
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content area -->
    <div class="view-content">
      <UserTable
        v-if="isTableView"
        :users="users"
        key="table"
        @edit="openEditModal"
        @delete="openDeleteModal"
      />
      <UserGrid v-else :users="users" key="grid" @edit="openEditModal" @delete="openDeleteModal" />
    </div>

    <!-- Floating Action Button -->
    <button
      class="floating-action-btn"
      :class="{ active: floatingPanelVisible }"
      @click="toggleFloatingPanel"
      title="Quick Actions"
    >
      <span class="fab-icon"> <Plus /> </span>
    </button>

    <!-- Draggable User Actions Panel -->
    <UserDraggableActions v-if="floatingPanelVisible" :users="users" @close="closeFloatingPanel" />
  </div>
</template>

<style scoped>
/* Mobile-first base styles */
.user-view-container {
  padding: 12px;
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
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
}

.header-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

/* Search styles */
.search-container {
  width: 100%;
  max-width: 400px;
}

.search-input {
  width: 100%;
}

.search-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

.search-item {
  padding: 8px 0;
}

.search-item-name {
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.search-item-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
}

.search-item-email {
  color: #059669;
}

.search-item-username {
  color: #7c3aed;
}

.view-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.control-label {
  font-size: 13px;
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
  max-width: 200px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: 5px;
  font-size: 13px;
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

/* Floating Action Button */
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
  font-size: 24px;
  transition: all 0.3s ease;
}

/* Small mobile phones */
@media (min-width: 375px) {
  .add-text {
    display: inline;
  }

  .toggle-btn {
    font-size: 14px;
    gap: 6px;
  }
}

/* Large mobile phones */
@media (min-width: 480px) {
  .user-view-container {
    padding: 16px;
  }

  .view-header {
    padding: 18px;
    margin-bottom: 20px;
  }

  .page-title {
    font-size: 22px;
  }

  .header-actions {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    align-items: flex-end;
  }

  .search-container {
    max-width: 300px;
  }

  .view-controls {
    flex-direction: row;
    justify-content: center;
    gap: 12px;
    width: auto;
  }

  .toggle-group {
    max-width: 180px;
  }

  .toggle-btn {
    font-size: 14px;
    padding: 8px 14px;
  }

  .floating-action-btn {
    bottom: 32px;
    right: 32px;
  }
}

/* Tablets */
@media (min-width: 768px) {
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
    font-size: 26px;
    text-align: left;
  }

  .header-actions {
    flex-direction: row;
    gap: 24px;
    width: auto;
    align-items: center;
  }

  .search-container {
    max-width: 350px;
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

/* Desktop */
@media (min-width: 1024px) {
  .user-view-container {
    padding: 24px;
  }

  .view-header {
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }

  .page-title {
    font-size: 28px;
  }

  .search-container {
    max-width: 400px;
  }

  .control-label {
    font-size: 14px;
  }

  .toggle-group {
    border-radius: 10px;
  }

  .toggle-btn {
    min-width: 80px;
    font-size: 14px;
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
    font-size: 28px;
  }
}

/* Large desktop */
@media (min-width: 1440px) {
  .user-view-container {
    padding: 32px;
  }

  .view-header {
    padding: 28px;
  }

  .page-title {
    font-size: 32px;
  }
}

/* Global styles for autocomplete dropdown */
:global(.user-search-popper) {
  max-width: 400px !important;
}

:global(.user-search-popper .el-autocomplete-suggestion__list) {
  max-height: 300px;
  overflow-y: auto;
}
</style>
