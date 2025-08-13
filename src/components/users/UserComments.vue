<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Props
const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})

const route = useRoute()

const isPostOwner = computed(() => props.comment.author.id === route.params.userId)

const formatTime = (dateString: string, referenceTime?: Date): string => {
  const date = new Date(dateString)
  const now = referenceTime || new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 5) return 'now'
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  }
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800)
    return `${weeks}w ago`
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months}mo ago`
  }

  const years = Math.floor(diffInSeconds / 31536000)
  return `${years}y ago`
}

const upvoted = computed(() => props.comment.upvoted)
const downvoted = computed(() => props.comment.downvoted)
const commented = computed(() => props.comment.commented)
const upvotes = computed(() => props.comment.upvotes)
const downvotes = computed(() => props.comment.downvotes)
const comments = computed(() => props.comment.comments)
const replies = computed(() => [...props.comment.replies])
</script>

<template>
  <details open class="comment-section">
    <summary class="comment-summary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="avatar-icon"
      >
        <path
          fill-rule="evenodd"
          d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          clip-rule="evenodd"
        />
      </svg>

      <div class="username-link">
        {{ comment.author.username }}
        <el-tag type="primary" v-if="isPostOwner" size="small">Author</el-tag>
      </div>

      <time class="timestamp">{{ formatTime(comment.created) }}</time>
    </summary>

    <section class="comment-content">
      <div
        class="line-indicator"
        :class="comment.comments && comment.comments > 0 ? 'line' : 'no-line'"
      ></div>
      <article class="comment-article">
        <main class="comment-body">
          {{ comment.body }}
        </main>

        <footer class="comment-footer">
          <button class="action-button upvote-button" :class="{ upvoted: upvoted }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="action-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
              />
            </svg>
            {{ upvotes }}
          </button>

          <button class="action-button downvote-button" :class="{ downvoted: downvoted }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="action-icon"
            >
              <path
                fill-rule="evenodd"
                d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z"
                clip-rule="evenodd"
              />
            </svg>
            {{ downvotes }}
          </button>

          <button class="action-button reply-button" :class="{ commented: commented }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="action-icon"
            >
              <path
                fill-rule="evenodd"
                d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"
                clip-rule="evenodd"
              />
            </svg>
            {{ comments }}
          </button>
        </footer>
      </article>
    </section>

    <template v-if="comment.comments && comment.comments > 0">
      <div class="reply-line"></div>
      <section v-for="(reply, index) in replies" :key="reply.id" class="reply-wrapper wrapper">
        <div class="line-wrapper">
          <section class="curve"></section>
          <div
            class="line-indicator nested-line"
            :class="index < replies.length - 1 ? 'line' : 'no-line'"
          ></div>
        </div>
        <div>
          <UserComments :comment="reply" />
          <div class="reply-spacer"></div>
        </div>
      </section>
    </template>
  </details>
</template>

<style scoped>
/* Comment Summary */
.comment-summary {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  line-height: 1rem;
}

.avatar-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.username-link {
  font-weight: 700;
  text-decoration: none;
  transition-duration: 200ms;
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.timestamp {
  font-size: 0.7rem;
  color: #6b7280;
}

/* Comment Content Layout */
.comment-content {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 0.25rem;
}

.line-indicator {
  grid-column-start: 1;
  grid-column-end: 2;
}

.comment-article {
  grid-column-start: 2;
  grid-column-end: 3;
  display: grid;
  gap: 0.5rem;
}

/* Comment Body */
.comment-body {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

/* Comment Footer */
.comment-footer {
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 700;
}

/* Action Buttons */
.action-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.action-icon {
  width: 1rem;
  height: 1rem;
}

.upvote-button.upvoted {
  color: #f97316;
}

.downvote-button.downvoted {
  color: #f97316;
}

.reply-button.commented {
  color: #3b82f6;
}

/* Reply Lines and Spacing */
.reply-line {
  height: 0.75rem;
  border-left: 2px solid #a8a29e;
  margin-left: 0.75rem;
}

.reply-wrapper {
  display: grid;
  grid-template-columns: 24px 1fr;
}

.reply-spacer {
  height: 0.75rem;
}

/* Line Indicators */
.line {
  position: relative;
}

.line::before {
  content: '';
  top: 0;
  bottom: 0;
  left: 50%;
  position: absolute;
  border: 1px solid #a8a29e;
}

.no-line::before {
  display: none;
}

.curve {
  height: 0.75rem;
  width: 0.75rem;
  float: right;
  border-left: 2px solid #a8a29e;
  border-bottom: 2px solid #a8a29e;
  border-bottom-left-radius: 15px;
  z-index: 10;
}

.wrapper .line-wrapper {
  position: relative;
}

.wrapper .line-wrapper::before {
  content: '';
  top: 0;
  bottom: 0;
  left: 50%;
  position: absolute;
  border: 1px solid #a8a29e;
}

.wrapper:last-child .line-wrapper::before {
  display: none;
}

.nested-line {
  position: absolute;
  top: 0; /* Start after the curve */
  bottom: 0;
  left: 50%;
  width: 1px;
}

.nested-line.line::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  border-left: 1px solid #a8a29e;
}
</style>
