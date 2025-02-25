import type { User } from '~/types/user'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    loading: false,
  }),

  getters: {
    isLoggedIn: state => !!state.user,
    credits: state => state.user?.credits ?? 0,
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      try {
        // TODO: 實作登入 API
        this.user = {
          id: '1',
          name: 'Test User',
          email,
          credits: 1000,
        }
      }
      finally {
        this.loading = false
      }
    },

    async logout() {
      // TODO: 實作登出 API
      this.user = null
    },

    async updateCredits(amount: number) {
      if (this.user) {
        this.user.credits += amount
      }
    },
  },
})
