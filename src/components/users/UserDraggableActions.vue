<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import UserForm from './UserForm.vue'
import AppModal from '../app/AppModal.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/UserStore'

const emit = defineEmits(['close'])

const userStore = useUserStore()

const panelRef = ref<HTMLElement | null>(null)
const userId = ref('')

const isDragging = ref(false)
const dragOffset = reactive({ x: 0, y: 0 })
const position = reactive({ x: 20, y: 100 })

const panelStyle = computed(() => ({
  left: `${position.x}px`,
  top: `${position.y}px`,
  cursor: isDragging.value ? 'grabbing' : 'grab',
}))

function closePanel() {
  emit('close')
}

async function handleDelete() {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete user ${String(userId.value)}?`,
      'Delete User',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )

    const loadingMessage = ElMessage({
      type: 'info',
      message: 'Deleting user...',
      duration: 0,
    })

    try {
      await userStore.deleteUser(String(userId.value))

      loadingMessage.close()
      ElMessage({
        type: 'success',
        message: 'User deleted successfully',
      })
    } catch (error) {
      loadingMessage.close()
      ElMessage({
        type: 'error',
        message: (error as Error).message || 'Failed to delete user',
      })
    }
  } catch (error) {
    if (error === 'cancel') {
      console.log('Delete operation cancelled by user')
    }
  }
}

function startDrag(e: MouseEvent) {
  if (!panelRef.value) return

  isDragging.value = true

  const rect = panelRef.value.getBoundingClientRect()
  dragOffset.x = e.clientX - rect.left
  dragOffset.y = e.clientY - rect.top

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)

  document.body.style.userSelect = 'none'
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value) return

  const newX = e.clientX - dragOffset.x
  const newY = e.clientY - dragOffset.y

  const maxX = window.innerWidth - 220
  const maxY = window.innerHeight - 320

  position.x = Math.max(0, Math.min(newX, maxX))
  position.y = Math.max(0, Math.min(newY, maxY))
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.body.style.userSelect = ''
}

onMounted(() => {
  console.log('Logging from onMounted')

  nextTick(() => {
    const maxX = window.innerWidth - 220
    const maxY = window.innerHeight - 320

    position.x = Math.min(position.x, Math.max(0, maxX))
    position.y = Math.min(position.y, Math.max(0, maxY))
  })
})

onUnmounted(() => {
  console.log('Logging from onUnmounted')

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
              @keyup.enter="props.onTrigger"
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
              @click="props.onTrigger"
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
              @click="props.onTrigger"
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
  font-size: 0.875rem;
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
  font-size: 0.875rem;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.panel-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
}

.user-id-input {
  padding: 8px 10px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.8125rem;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.user-id-input:focus {
  outline: none;
  border-color: #667eea;
}

.action-row {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
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

@media (max-width: 640px) {
  .floating-panel {
    width: 180px;
  }

  .panel-content {
    padding: 12px;
  }

  .action-btn {
    padding: 6px 8px;
    font-size: 0.6875rem;
  }
}
</style>
