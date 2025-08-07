<script setup lang="ts">
import type { DisplayUser, User } from '@/lib/types/global'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ users: DisplayUser[] }>()

const searchValue = ref('')
const router = useRouter()

function handleSearch(queryString: string, callback: (results: DisplayUser[]) => void) {
  if (!queryString.trim()) {
    callback(props.users)
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
  }, props.users)

  callback(results)
}

function handleSelect(user: User) {
  router.push({ name: 'user-profile', params: { userId: user.id } })
}
</script>

<template>
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
        <div
          class="search-item"
          @click="router.push({ name: 'user-profile', params: { userId: item.id } })"
        >
          <div class="search-item-name">{{ item.name }}</div>
          <div class="search-item-details">
            <span class="search-item-email">{{ item.email }}</span>
            <span class="search-item-username">@{{ item.username }}</span>
          </div>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<style scoped>
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
  font-size: 0.75rem;
  color: #6b7280;
}

.search-item-email {
  color: #059669;
}

.search-item-username {
  color: #7c3aed;
}

@media (min-width: 480px) {
  .search-container {
    max-width: 300px;
  }
}

@media (min-width: 768px) {
  .search-container {
    max-width: 350px;
  }
}

@media (min-width: 1024px) {
  .search-container {
    max-width: 400px;
  }
}

:global(.user-search-popper) {
  max-width: 400px;
}

:global(.user-search-popper .el-autocomplete-suggestion__list) {
  max-height: 300px;
  overflow-y: auto;
}
</style>
