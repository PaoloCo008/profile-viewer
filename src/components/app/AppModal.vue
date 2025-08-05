<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'

const modalVisible = ref(false)

function onTriggerClick() {
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

function handleBeforeClose(done: () => void) {
  ElMessageBox.confirm('Are you sure to cancel your action').then(() => {
    done()
  })
}
</script>

<template>
  <slot name="trigger" :onTriggerClick></slot>

  <Teleport to="body">
    <el-dialog destroy-on-close v-model="modalVisible" center :before-close="handleBeforeClose">
      <slot name="default" :closeModal></slot>
    </el-dialog>
  </Teleport>
</template>

<style>
.el-dialog {
  width: 100%;
  max-width: 800px;
}
</style>
