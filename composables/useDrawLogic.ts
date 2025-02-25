import type { DrawResult } from '@/types/drawSet'
import { useDrawSetStore } from '@/stores/drawSet'
import { useUserStore } from '@/stores/user'

export function useDrawLogic() {
  const userStore = useUserStore()
  const drawSetStore = useDrawSetStore()

  const isDrawing = ref(false)
  const error = ref<string | null>(null)

  const validateDraw = (drawSet: any) => {
    if (!userStore.isLoggedIn) {
      error.value = '請先登入'
      return false
    }

    if (userStore.credits < drawSet.price) {
      error.value = '點數不足'
      return false
    }

    const currentDraws = drawSetStore.userDraws[drawSet.id] || 0
    if (currentDraws >= drawSet.maxDraws) {
      error.value = '已達抽獎次數上限'
      return false
    }

    return true
  }

  const draw = async (drawSetId: string): Promise<DrawResult | null> => {
    const drawSet = drawSetStore.drawSets.find(ds => ds.id === drawSetId)
    if (!drawSet) {
      error.value = '找不到抽獎套組'
      return null
    }

    if (!validateDraw(drawSet)) {
      return null
    }

    isDrawing.value = true
    error.value = null

    try {
      // 取得抽獎鎖定
      const lock = await useFetch(`/api/draw-sets/${drawSetId}/lock`, {
        method: 'POST',
      })

      if (!lock.data.value) {
        error.value = '無法取得抽獎鎖定，請稍後再試'
        return null
      }

      // 執行抽獎
      const { data, error: drawError } = await useFetch(`/api/draw-sets/${drawSetId}/draw`, {
        method: 'POST',
      })

      if (drawError.value) {
        error.value = drawError.value.message
        return null
      }

      // 更新使用者點數
      await userStore.updateCredits(-drawSet.price)

      // 更新抽獎次數
      drawSetStore.userDraws[drawSetId] = (drawSetStore.userDraws[drawSetId] || 0) + 1

      return data.value as DrawResult
    }
    catch (e) {
      error.value = '抽獎過程發生錯誤，請稍後再試'
      return null
    }
    finally {
      isDrawing.value = false
    }
  }

  return {
    draw,
    isDrawing,
    error,
  }
}
