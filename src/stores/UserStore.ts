import { BASE_ENDPOINT } from '@/lib/constants'
import { handleApiError } from '@/lib/helpers'
import type { UserForm } from '@/lib/types/forms'
import type { User } from '@/lib/types/global'
import { dayjs, ElLoading } from 'element-plus'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const initialized = ref(false)
  const loading = ref(false)

  // Computed
  const getUserById = computed(() => (id: string) => {
    const user = users.value.find((user) => user.id === id)
    if (!user) return
    return user
  })

  const isUserInUsers = computed(() => (userId: string) => {
    return users.value.findIndex((user) => user.id === userId) !== -1
  })

  // Actions
  async function fetchUsers(controller: AbortController) {
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
      const res = await fetch(`${BASE_ENDPOINT}/users`, {
        signal: controller.signal,
      })

      if (!res.ok) {
        handleApiError(res, 'Fetch users')
        return null
      }

      const fetchedUsers = await res.json()

      users.value = fetchedUsers.map((user: User) => ({ ...user }))

      if (!initialized.value) {
        initialized.value = true
        loadingInstance?.close()
      }

      return fetchedUsers
    } catch (error: unknown) {
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

  async function fetchUser(userId: string, controller: AbortController) {
    const loadingInstance = ElLoading.service({
      lock: true,
      text: 'Fetching user...',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    try {
      const res = await fetch(`${BASE_ENDPOINT}/users/${userId}`, {
        signal: controller.signal,
      })

      if (!res.ok) {
        handleApiError(res, 'Fetch user')
        return null
      }

      const user = await res.json()

      return user
    } catch (error: unknown) {
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

  async function createUser(user: UserForm) {
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
      })

      if (!res.ok) {
        handleApiError(res, 'Create user')
      }

      const createdUser = await res.json()
      users.value.push(createdUser)

      return createdUser
    } catch (error: unknown) {
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

  async function updateUser(userId: string, user: UserForm) {
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
      })

      if (!res.ok) {
        handleApiError(res, 'Update user')
      }

      const responseUser = await res.json()
      users.value = users.value.map((user) => (user.id === userId ? { ...responseUser } : user))

      return responseUser
    } catch (error: unknown) {
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

  async function deleteUser(userId: string) {
    try {
      loading.value = true

      const res = await fetch(`${BASE_ENDPOINT}/users/${userId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        handleApiError(res, 'Delete user')
      }

      users.value = users.value.filter((user) => user.id !== userId)
    } catch (error: unknown) {
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
  }
})
