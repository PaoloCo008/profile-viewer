<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import UserForm from './UserForm.vue'
import AppModal from '../app/AppModal.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()

const emit = defineEmits(['close'])

const panelRef = ref(null)

const userId = ref('')

const isDragging = ref(false)
const dragOffset = reactive({ x: 0, y: 0 })
const position = reactive({ x: 20, y: 100 })

const panelStyle = computed(() => ({
  left: `${position.x}px`,
  top: `${position.y}px`,
  cursor: isDragging.value ? 'grabbing' : 'grab',
}))

const closePanel = () => {
  emit('close')
}

async function handleDelete() {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete user ${String(userId.value)}`,
      'Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'info',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = 'Deleting...'

            try {
              await userStore.deleteUser(String(userId.value))
              done()

              ElMessage({
                type: 'success',
                message: 'Delete completed',
              })
            } catch (error) {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = 'Delete'

              ElMessage({
                type: 'error',
                message: error.message || 'Failed to delete user',
              })
            }
          } else {
            done()
          }
        },
      },
    )
  } catch (error) {
    if (error === 'cancel') {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    }
  }
}

const startDrag = (e) => {
  if (!panelRef.value) return

  isDragging.value = true

  const rect = panelRef.value.getBoundingClientRect()
  dragOffset.x = e.clientX - rect.left
  dragOffset.y = e.clientY - rect.top

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)

  document.body.style.userSelect = 'none'
}

const onDrag = (e) => {
  if (!isDragging.value) return

  const newX = e.clientX - dragOffset.x
  const newY = e.clientY - dragOffset.y

  const maxX = window.innerWidth - 220
  const maxY = window.innerHeight - 320

  position.x = Math.max(0, Math.min(newX, maxX))
  position.y = Math.max(0, Math.min(newY, maxY))
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.body.style.userSelect = ''
}

onMounted(() => {
  nextTick(() => {
    const maxX = window.innerWidth - 220
    const maxY = window.innerHeight - 320

    position.x = Math.min(position.x, Math.max(0, maxX))
    position.y = Math.min(position.y, Math.max(0, maxY))
  })
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.body.style.userSelect = ''
})
</script>

<template>
  <div ref="panelRef" class="floating-panel" :style="panelStyle" @mousedown="startDrag">
    <div class="panel-header">
      <div class="header-content">
        <span class="panel-title">User Actions</span>
      </div>
      <button class="close-btn" @click="closePanel" @mousedown.stop>✕</button>
    </div>

    <div class="panel-content" @mousedown.stop>
      <div class="input-group">
        <label for="userId" class="input-label">User ID:</label>
        <AppModal>
          <template #trigger="props">
            <input
              id="userId"
              v-model="userId"
              type="number"
              class="user-id-input"
              placeholder="Enter ID"
              min="1"
              @keyup.enter="props.onTriggerClick"
            />
          </template>

          <template #default="props">
            <UserForm :user-id="String(userId)" @complete="props.closeModal" />
          </template>
        </AppModal>
      </div>

      <div class="action-row">
        <AppModal>
          <template #trigger="props">
            <el-button
              class="action-btn primary"
              @click="props.onTriggerClick"
              :disabled="userStore.loading"
              >Add</el-button
            >
          </template>

          <template #default="props">
            <UserForm @complete="props.closeModal" />
          </template>
        </AppModal>

        <AppModal>
          <template #trigger="props">
            <el-button
              class="action-btn secondary"
              @click="props.onTriggerClick"
              :disabled="!userId || userStore.loading"
            >
              Edit
            </el-button>
          </template>

          <template #default="props">
            <UserForm :user-id="String(userId)" @complete="props.closeModal" />
          </template>
        </AppModal>
      </div>

      <div class="action-row">
        <button
          class="action-btn danger full-width"
          @click="handleDelete"
          :disabled="!userId || userStore.loading"
        >
          Delete
        </button>
      </div>

      <div v-if="userStore.loading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
    </div>
  </div>

  <div class="drag-handle">
    <div class="drag-dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
</template>

<style scoped>
.el-button {
  margin-left: 0;
}

.floating-panel {
  position: fixed;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  user-select: none;
}

/* Header */
.panel-header {
  background: #1a1a1a;
  color: #ffffff;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: grab;
}

.panel-header:active {
  cursor: grabbing;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
  font-size: 14px;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Content */
.panel-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}

/* Input Group */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
}

.user-id-input {
  padding: 8px 10px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.user-id-input:focus {
  outline: none;
  border-color: #667eea;
}

/* Action Buttons */
.action-row {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 32px;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Button Variants */
.action-btn.primary {
  background: #1a1a1a;
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: #1a1a1a;
  color: white;
}

.action-btn.secondary:hover:not(:disabled) {
  transform: translateY(-1px);
}

.action-btn.danger {
  background: #dc2626;
  color: white;
}

.action-btn.danger:hover:not(:disabled) {
  transform: translateY(-1px);
}

.action-btn.full-width {
  width: 100%;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 0 12px 12px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Drag Handle */
.drag-handle {
  background: #f3f4f6;
  padding: 6px;
  display: flex;
  justify-content: center;
  cursor: grab;
  border-top: 1px solid #e5e7eb;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-dots {
  display: flex;
  gap: 3px;
}

.dot {
  width: 4px;
  height: 4px;
  background: #9ca3af;
  border-radius: 50%;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .floating-panel {
    width: 180px;
  }

  .panel-content {
    padding: 12px;
  }

  .action-btn {
    padding: 6px 8px;
    font-size: 11px;
  }
}
</style>
