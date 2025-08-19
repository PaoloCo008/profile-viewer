<template>
  <div class="catch-all-container">
    <div class="content-area">
      <div class="empty-state">
        <div class="empty-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 12L11 14L15 10"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
        </div>
        <h2 class="empty-title">{{ emptyTitle }}</h2>
        <p class="empty-description">{{ emptyDescription }}</p>
        <button class="primary-button" @click="handlePrimaryAction">
          {{ primaryActionText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  emptyStateTitle: {
    type: String,
    default: 'Nothing to see here',
  },
  emptyStateDescription: {
    type: String,
    default: "The page you're looking for doesn't exist or has been moved.",
  },
  primaryActionText: {
    type: String,
    default: 'Go Home',
  },
})

const router = useRouter()

const emptyTitle = computed(() => props.emptyStateTitle)
const emptyDescription = computed(() => props.emptyStateDescription)

const handlePrimaryAction = () => {
  router.push('/')
}
</script>

<style scoped>
.catch-all-container {
  height: 100vh;
  display: grid;
  place-items: center;
}

.content-area {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.empty-state {
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  color: #9ca3af;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 32px 0;
}

.primary-button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.primary-button:hover {
  background: #1d4ed8;
}

.primary-button:active {
  background: #1e40af;
}
</style>
