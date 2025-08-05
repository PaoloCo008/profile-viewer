<script setup lang="ts">
import type { DisplayUser } from '@/lib/types/global'

defineProps<{ users: DisplayUser[] }>()
</script>

<template>
  <el-table :data="users" style="width: 100%">
    <el-table-column prop="id" label="ID" width="80" />
    <el-table-column prop="name" label="Name" width="270" />
    <el-table-column prop="email" label="Email" width="270" />
    <el-table-column prop="address" label="Address" min-width="600" />
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default>
        <el-button link type="primary" size="small"> Detail </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
