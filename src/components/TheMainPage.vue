<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore'
import { computed, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import UserForm from './users/UserForm.vue'

const userStore = useUserStore()

const users = computed(() =>
  userStore.users.map((user) => ({
    name: user.name,
    email: user.email,
    address: `${user.address.street}, ${user.address.city}`,
  })),
)

const handleClick = () => {
  console.log('click')
}

onBeforeMount(async () => {
  console.log('On onBeforeMount: Fetching users')
  await userStore.fetchUsers()
})
</script>

<template>
  <el-table :data="users" style="width: 100%">
    <el-table-column prop="name" label="Name" width="270" />
    <el-table-column prop="email" label="Email" width="270" />
    <el-table-column prop="address" label="Address" min-width="600" />
    <el-table-column fixed="right" label="Operations" width="200">
      <template #default>
        <el-button link type="primary" size="small" @click="handleClick"> Detail </el-button>
        <el-button link type="primary" size="small">Edit</el-button>
        <el-button link type="primary" size="small">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>

  <UserForm />
</template>

<style scoped></style>
