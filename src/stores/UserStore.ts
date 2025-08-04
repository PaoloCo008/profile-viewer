import { BASE_ENDPOINT } from '@/lib/constants'
import type { User } from '@/lib/types/global'
import { ElLoading } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const loading = ref<boolean>(false)

  // Actions
  async function fetchUsers() {
    const loading = ElLoading.service({
      lock: true,
      text: 'Processing your order...',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    try {
      loading.setText('Fetching users')

      const res = await fetch(`${BASE_ENDPOINT}/users`)

      if (!res.ok) throw new Error('Opps! Something went wrong fetching users.')

      const fetchedUsers = await res.json()

      users.value = fetchedUsers
    } catch (error: unknown) {
      if (error instanceof Error) return error.message

      return String(error)
    } finally {
      loading.close()
    }
  }

  return {
    users,
    loading,
    fetchUsers,
  }
})
