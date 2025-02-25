import type { DrawResult, DrawSet } from '~/types/drawSet'
import { defineStore } from 'pinia'

export const useDrawSetStore = defineStore('drawSet', {
  state: () => ({
    drawSets: [] as DrawSet[],
    userDraws: {} as Record<string, number>,
    loading: false,
  }),

  getters: {
    availableDrawSets: state =>
      state.drawSets.filter(ds => ds.enabled),
  },

  actions: {
    async fetchDrawSets() {
      this.loading = true
      try {
        // TODO: 實作獲取抽獎套組 API
        this.drawSets = [
          {
            id: '1',
            name: '測試套組',
            description: '這是一個測試用的抽獎套組',
            image: '/placeholder.png',
            maxDraws: 10,
            price: 100,
            enabled: true,
          },
        ]
      }
      finally {
        this.loading = false
      }
    },

    async draw(drawSetId: string): Promise<DrawResult> {
      // TODO: 實作抽獎 API
      await new Promise(resolve => setTimeout(resolve, 2000))

      this.userDraws[drawSetId] = (this.userDraws[drawSetId] || 0) + 1

      return {
        prizeId: '1',
        prizeName: '測試獎品',
        prizeImage: '/placeholder.png',
      }
    },
  },
})
