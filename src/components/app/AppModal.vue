<script lang="ts" setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { ref, inject, type InjectionKey } from 'vue'

const OperationState: InjectionKey<{
  isOperationInProgress: () => boolean
}> = Symbol('OperationState')

const modalVisible = ref(false)

function onTrigger() {
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

async function handleBeforeClose(done: () => void) {
  const operationState = inject(OperationState)
  const isOperationInProgress = operationState?.isOperationInProgress() || false

  if (isOperationInProgress) {
    ElMessage({
      type: 'warning',
      message: 'Please wait for the current operation to complete',
    })
    return
  }

  try {
    await ElMessageBox.confirm(
      'Are you sure you want to cancel? Any unsaved changes will be lost.',
      'Confirm Cancel',
      {
        confirmButtonText: 'Yes, Cancel',
        cancelButtonText: 'Continue Action',
        type: 'warning',
      },
    )
    done()
  } catch {}
}
</script>

<template>
  <slot name="trigger" :onTrigger></slot>

  <Teleport to="body">
    <el-dialog
      destroy-on-close
      v-model="modalVisible"
      center
      :before-close="handleBeforeClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <slot name="default" :closeModal></slot>
    </el-dialog>
  </Teleport>
</template>

<style>
.el-dialog {
  width: 100%;
  max-width: 800px;
  margin: 0;
}

.el-overlay-dialog {
  display: grid;
  place-items: center;
}
</style>
