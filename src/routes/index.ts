import TheMainPage from '@/components/TheMainPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TheMainPage,
    },
    {
      path: '/profile/:userId',
      name: 'user-profile',
      component: TheMainPage,
    },
  ],
})

export default router
