import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    loadingCount: 0
  }),

  getters: {
    loading: (state) => state.loadingCount > 0
  },

  actions: {
    start() {
      this.loadingCount++
    },
    stop() {
      if (this.loadingCount > 0) {
        this.loadingCount--
      }
    }
  }
})
