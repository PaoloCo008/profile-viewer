import { BASE_ENDPOINT, JSON_PLACEHOLDER_ENDPOINT } from '@/lib/constants'
import {
  createNameFromEmail,
  fetchWithErrorHandling,
  handleApiError,
  toSingleDecimal,
} from '@/lib/helpers'
import type { UserForm } from '@/lib/types/forms'
import type { Comment, User, UserData } from '@/lib/types/global'
import { dayjs, ElLoading } from 'element-plus'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const initialized = ref(false)
  const loading = ref(false)

  // Computed
  const getUserById = computed(() => (userId: string) => {
    const user = users.value.find((user) => user.id === userId)
    if (!user) return
    return user
  })

  const isUserInUsers = computed(() => (userId: string) => {
    return users.value.findIndex((user) => user.id === userId) !== -1
  })

  // Actions
  async function fetchUsers(controller?: AbortController) {
    let loadingInstance

    if (initialized.value) {
      loading.value = true
    } else {
      loadingInstance = ElLoading.service({
        lock: true,
        text: 'Fetching users...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }

    try {
      const fetchedUsers = await fetchWithErrorHandling(
        `${BASE_ENDPOINT}/users`,
        'Fetch users',
        controller as AbortController,
      )

      users.value = fetchedUsers.map((user: User) => ({ ...user }))

      if (!initialized.value) {
        initialized.value = true
        loadingInstance?.close()
      }

      return fetchedUsers
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error')
      }

      if (error instanceof Error) {
        throw error
      }

      throw new Error('Unknown error occurred')
    } finally {
      loading.value = false
    }
  }

  async function fetchUser(userId: string, controller?: AbortController) {
    const loadingInstance = ElLoading.service({
      lock: true,
      text: 'Fetching user...',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    try {
      const user = await fetchWithErrorHandling(
        `${BASE_ENDPOINT}/users/${userId}`,
        'Fetch user',
        controller as AbortController,
      )

      return user
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error')
      }

      if (error instanceof Error) {
        throw error
      }

      throw new Error('Unknown error occurred')
    } finally {
      loadingInstance.close()
    }
  }

  async function createUser(user: UserForm, controller?: AbortController) {
    try {
      loading.value = true

      const lastUserId =
        users.value.length > 0 ? Math.max(...users.value.map((user) => Number(user.id))) : 0

      const newUser = {
        id: String(lastUserId + 1),
        name: user.name,
        username: user.username,
        email: user.email,
        address: {
          street: user.street,
          suite: user.suite,
          city: user.city,
          zipcode: user.zipcode,
          geo: {
            lat: '-37.3159',
            long: '81.1496',
          },
        },
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        phone: user.phone,
        website: user.website,
        company: {
          name: user.companyName,
          catchPhrase: user.catchPhrase,
          bs: user.bs,
        },
      }

      const res = await fetch(`${BASE_ENDPOINT}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
        signal: controller?.signal,
      })

      if (!res.ok) {
        handleApiError(res, 'Create user')
      }

      const createdUser = await res.json()
      users.value.push(createdUser)

      return createdUser
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error')
      }

      if (error instanceof Error) {
        throw error
      }

      throw new Error('Unknown error occurred')
    } finally {
      loading.value = false
    }
  }

  async function updateUser(userId: string, user: UserForm, controller?: AbortController) {
    try {
      loading.value = true

      const updatedUser = {
        id: userId,
        name: user.name,
        username: user.username,
        email: user.email,
        address: {
          street: user.street,
          suite: user.suite,
          city: user.city,
          zipcode: user.zipcode,
          geo: {
            lat: '-37.3159',
            long: '81.1496',
          },
        },
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        phone: user.phone,
        website: user.website,
        company: {
          name: user.companyName,
          catchPhrase: user.catchPhrase,
          bs: user.bs,
        },
      }

      const res = await fetch(`${BASE_ENDPOINT}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
        signal: controller?.signal,
      })

      if (!res.ok) {
        handleApiError(res, 'Update user')
      }

      const responseUser = await res.json()
      users.value = users.value.map((user) => (user.id === userId ? { ...responseUser } : user))

      return responseUser
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error')
      }

      if (error instanceof Error) {
        throw error
      }

      throw new Error('Unknown error occurred')
    } finally {
      loading.value = false
    }
  }

  async function deleteUser(userId: string, controller?: AbortController) {
    try {
      loading.value = true

      const res = await fetch(`${BASE_ENDPOINT}/users/${userId}`, {
        method: 'DELETE',
        signal: controller?.signal,
      })

      if (!res.ok) {
        handleApiError(res, 'Delete user')
      }

      users.value = users.value.filter((user) => user.id !== userId)
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error')
      }

      if (error instanceof Error) {
        throw error
      }

      throw new Error('Unknown error occurred')
    } finally {
      loading.value = false
    }
  }

  async function generateNestedCommentsForUser(
    userId: string,
    controller?: AbortController,
  ): Promise<Comment[] | null> {
    try {
      loading.value = true

      const [userPosts, user, allUsers, allComments] = await Promise.all([
        fetchWithErrorHandling(
          `${JSON_PLACEHOLDER_ENDPOINT}/posts?userId=${userId}`,
          'Fetch user posts',
          controller as AbortController,
        ),
        fetchWithErrorHandling(
          `${JSON_PLACEHOLDER_ENDPOINT}/users/${userId}`,
          'Fetch user',
          controller as AbortController,
        ),
        fetchWithErrorHandling(
          `${JSON_PLACEHOLDER_ENDPOINT}/users`,
          'Fetch all users',
          controller as AbortController,
        ),
        fetchWithErrorHandling(
          `${JSON_PLACEHOLDER_ENDPOINT}/comments`,
          'Fetch all comments',
          controller as AbortController,
        ),
      ])

      if (!userPosts || !user || !allUsers || !allComments) {
        return null
      }

      const realUsers: UserData[] = allUsers.map((user: User) => ({
        id: user.id,
        name: user.name,
      }))

      const commentUsers: UserData[] = allComments.map(
        (comment: JSONPlaceholderComment, i: number) => ({
          id: `comment-user-${i + 1}`,
          name: createNameFromEmail(comment.email),
        }),
      )

      const allUserPool: UserData[] = [...realUsers, ...commentUsers]

      const uniqueUsers = allUserPool.filter(
        (user, i, self) => i === self.findIndex((u) => u.name === user.name),
      )

      const otherUsers = uniqueUsers.filter((u) => String(u.id) !== userId)

      const postCommentsPromises = userPosts.map(async (post: JSONPlaceholderPost) => {
        try {
          const res = await fetch(`${JSON_PLACEHOLDER_ENDPOINT}/comments?postId=${post.id}`, {
            signal: controller?.signal,
          })
          if (!res.ok) {
            handleApiError(res, `Fetch comments for post ${post.id}`)
            return []
          }
          return res.json() as Promise<JSONPlaceholderComment[]>
        } catch (error: unknown) {
          console.warn(`Failed to fetch comments for post ${post.id}:`, error)
          return []
        }
      })

      const postCommentsArrays = await Promise.all(postCommentsPromises)
      const userPostComments = postCommentsArrays.flat()

      function getRandomCommentText(): string {
        const randomComment = allComments[Math.floor(Math.random() * allComments.length)]
        return randomComment.body
      }

      function createNestedReplies(
        parentId: number,
        depth: number,
        parentDate: Date,
        maxDepth: number = 4,
      ): Comment[] {
        if (depth >= maxDepth) return []

        const shouldHaveReplies = Math.random() < toSingleDecimal(maxDepth) - depth * 0.1
        if (!shouldHaveReplies) return []

        const numReplies = Math.floor(Math.random() * (maxDepth - depth)) + 1
        const replies: Comment[] = []

        for (let i = 0; i < numReplies; i++) {
          const replyId = parentId + allComments.length + userPostComments.length + 1
          const replyAuthor: UserData =
            Math.random() < toSingleDecimal(maxDepth)
              ? { id: userId, name: user.name }
              : otherUsers[Math.floor(Math.random() * otherUsers.length)]

          const minutesAfterParent = Math.random() * 60 * (i + 1)
          const replyDate = new Date(parentDate.getTime() + minutesAfterParent * 60 * 1000)

          const reply: Comment = {
            id: replyId,
            body: getRandomCommentText(),
            author: {
              id: replyAuthor.id,
              username: replyAuthor.name,
              avatar: 'https://thispersondoesnotexist.com/',
            },
            created: replyDate.toISOString(),
            upvoted: false,
            downvoted: false,
            commented: false,
            upvotes: Math.floor(Math.random() * (10 - depth * 2)),
            downvotes: Math.floor(Math.random() * 2),
            comments: 0,
            replies: [],
          }

          reply.replies = createNestedReplies(replyId, depth + 1, replyDate, maxDepth)
          reply.comments = reply.replies.length

          replies.push(reply)
        }

        return replies
      }

      const nestedComments: Comment[] = userPosts.map((post: JSONPlaceholderPost) => {
        const postComments = userPostComments.filter((comment) => comment.postId === post.id)

        const shuffledComments = postComments.sort(() => Math.random() - postComments.length / 10)
        const randomCount = Math.max(1, Math.floor(Math.random() * (postComments.length + 1)))
        const selectedComments = shuffledComments.slice(0, randomCount)

        const daysAgo = Math.floor(Math.random() * 30) + 1
        const baseDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

        const replies: Comment[] = selectedComments.map((comment, i) => {
          const commentAuthor: UserData =
            Math.random() < 0.3
              ? { id: userId, name: user.name }
              : otherUsers[i % otherUsers.length]

          const hoursAfterPost = Math.random() * 24 * (i + 1)
          const commentDate = new Date(baseDate.getTime() + hoursAfterPost * 60 * 60 * 1000)

          const nestedReplies = createNestedReplies(comment.id, 1, commentDate, 4)

          return {
            id: comment.id,
            body: comment.body,
            author: {
              id: commentAuthor.id,
              username: commentAuthor.name,
              avatar: 'https://thispersondoesnotexist.com/',
            },
            created: commentDate.toISOString(),
            upvoted: false,
            downvoted: false,
            commented: false,
            upvotes: Math.floor(Math.random() * 15),
            downvotes: Math.floor(Math.random() * 5),
            comments: nestedReplies.length,
            replies: nestedReplies,
          }
        })

        return {
          id: post.id,
          body: post.body,
          author: {
            id: userId,
            username: user.name,
            avatar: 'https://thispersondoesnotexist.com/',
          },
          created: baseDate.toISOString(),
          upvoted: false,
          downvoted: false,
          commented: false,
          upvotes: Math.floor(Math.random() * 25) + 5,
          downvotes: Math.floor(Math.random() * 8),
          comments: replies.length,
          replies: replies,
        }
      })

      return nestedComments
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error')
      }

      if (error instanceof Error) {
        throw error
      }

      throw new Error('Unknown error occurred')
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    getUserById,
    isUserInUsers,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    generateNestedCommentsForUser,
  }
})
