<script setup lang="ts">
import { getInitials } from '@/lib/helpers'
import type { Comment, User } from '@/lib/types/global'
import { useUserStore } from '@/stores/UserStore'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserComments from './UserComments.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const user = ref<User>()
const comments = ref<Comment[]>()

let abortController: AbortController | null = null

onMounted(async () => {
  console.log('Logging in onMounted')

  abortController = new AbortController()

  try {
    const fetchedUser = await userStore.fetchUser(route.params.userId as string, abortController)

    if (fetchedUser) {
      user.value = fetchedUser
    } else {
      ElMessage.error('User not found')
      return
    }

    try {
      const nestedComments = await userStore.generateNestedCommentsForUser(
        route.params.userId as string,
        abortController,
      )

      if (nestedComments) {
        comments.value = nestedComments
      } else {
        comments.value = []
      }
    } catch (commentErr: unknown) {
      console.warn('Failed to load comments:', commentErr)
      comments.value = []
    }
  } catch (err: unknown) {
    console.error('Failed to fetch user:', err)

    if (err instanceof DOMException && err.name === 'AbortError') {
      console.log('Request was aborted')
      return
    }

    ElMessage.error((err as Error).message || 'Failed to load user data')
  }
})

onBeforeUnmount(() => {
  console.log('Log on onBeforeUnmount')

  abortController?.abort()
})
</script>

<template>
  <div class="profile-container">
    <div class="back-button-container">
      <el-button @click="router.go(-1)" type="text" class="back-button">
        <el-icon><ArrowLeft /></el-icon>
        Back
      </el-button>
    </div>

    <div v-if="user">
      <div class="profile-header">
        <el-avatar :size="80" class="profile-avatar">
          {{ getInitials(user.name) }}
        </el-avatar>
        <div class="profile-title">
          <h2 class="user-name">
            {{ user.name }}
          </h2>
          <p class="user-email">{{ user.email }}</p>
        </div>
      </div>

      <div class="profile-content">
        <div class="section">
          <h3 class="section-title">Personal details</h3>
          <div class="detail-grid">
            <div class="detail-row">
              <span class="detail-label">Full name:</span>
              <span class="detail-value">{{ user.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Username:</span>
              <span class="detail-value">{{ user.username }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">{{ user.email }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone Number:</span>
              <span class="detail-value">{{ user.phone }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Website:</span>
              <span class="detail-value">{{ user.website }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Address:</span>
              <span class="detail-value">
                {{ user.address.street }}, {{ user.address.suite }}, {{ user.address.city }},
                {{ user.address.zipcode }}
              </span>
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">Company Details</h3>
          <div class="detail-grid">
            <div class="detail-row">
              <span class="detail-label">Company Name:</span>
              <span class="detail-value">{{ user.company.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Catch Phrase:</span>
              <span class="detail-value">{{ user.company.catchPhrase }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Business:</span>
              <span class="detail-value">{{ user.company.bs }}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">Comments</h3>

          <div v-if="userStore.loading" class="comments-state">
            <el-skeleton :rows="3" animated />
            <div class="loading-text">Loading comments...</div>
          </div>

          <div v-else-if="!comments || comments.length === 0" class="comments-state empty-state">
            <el-icon class="empty-icon" size="64">
              <el-icon-chat-line-square />
            </el-icon>
            <h4 class="empty-title">No Comments Yet</h4>
            <p class="empty-description">
              {{ user.name }} hasn't made any comments yet. Check back later!
            </p>
          </div>

          <template v-else>
            <UserComments
              v-for="comment in comments"
              :key="comment.id"
              :comment="comment"
              class="comment-section"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comments-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.loading-text {
  margin-top: 16px;
  color: #8c8c8c;
  font-size: 0.875rem;
}

.comment-section {
  margin-bottom: 1.25rem;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

.back-button-container {
  margin-bottom: 20px;
}

.back-button {
  padding: 8px 12px;
  color: #1890ff;
  font-size: 0.875rem;
  font-weight: 500;
}

.back-button:hover {
  background-color: #f0f7ff;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
  background: white;
  padding: 40px 20px;
  border-radius: 8px;
}

.profile-avatar {
  margin-bottom: 16px;
  background: #1a1a1a;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
}

.user-name {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #262626;
}

.user-email {
  margin: 0;
  color: #8c8c8c;
  font-size: 0.875rem;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section {
  background: white;
  border-radius: 8px;
  padding: 24px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #262626;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.detail-label {
  font-size: 0.875rem;
  color: #8c8c8c;
  font-weight: 400;
}

.detail-value {
  font-size: 0.875rem;
  color: #262626;
  font-weight: 400;
  word-break: break-word;
}

.empty-state {
  color: #8c8c8c;
}

.empty-icon {
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-title {
  margin: 0 0 8px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #8c8c8c;
}

.empty-description {
  margin: 0;
  font-size: 0.875rem;
  color: #bfbfbf;
  max-width: 300px;
  line-height: 1.4;
}
</style>
