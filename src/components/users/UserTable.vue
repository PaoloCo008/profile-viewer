<script setup lang="ts">
import type { DisplayUser } from '@/lib/types/global'
import { useUserStore } from '@/stores/UserStore'
import { useRouter } from 'vue-router'

defineProps<{ users: DisplayUser[] }>()

const router = useRouter()
const userStore = useUserStore()
</script>

<template>
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

  <el-table v-else :data="users" style="width: 100%">
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
</template>

<style scoped>
.table-skeleton {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #ebeef5;
}

.skeleton-table-header {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 8px;
}

.skeleton-table-row {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f7fa;
}

.skeleton-table-row:last-child {
  border-bottom: none;
}

.skeleton-table-header,
.skeleton-table-row {
  gap: 8px;
}
</style>
