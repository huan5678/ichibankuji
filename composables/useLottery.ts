import type { LayoutResult, Position, Prize } from '~/types/lottery'
// composables/useLottery.ts
import { computed, reactive, ref } from 'vue'
import { CONFIG } from '~/constants/lottery'

export function useLottery() {
  const prizes = ref<Prize[]>([])
  const pickedPrizes = reactive(new Set<string>())
  const isAnimating = ref(false)
  const gameStarted = ref(false)
  const editingId = ref<string | undefined>(undefined)
  const currentIndex = ref(-1)
  const shuffleCount = ref(0)
  const { ANIMATION } = CONFIG

  // 洗牌函數
  const shuffle = <T>(array: T[]): T[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // 獲取可用獎品
  const availablePrizes = computed(() => {
    return prizes.value.filter(prize => !pickedPrizes.has(prize.id))
  })

  // 延遲函數
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  // 計算最小邊長
  const calculateMinimumSide = (totalPrizes: number): number => {
    let side = 2
    while (4 * (side - 1) < totalPrizes) {
      side++
    }
    return side
  }

  // 創建方形佈局
  const createSquareLayout = (totalPrizes: number): LayoutResult => {
    const side = calculateMinimumSide(totalPrizes)
    const positions: Position[] = []
    let prizeIndex = 0

    const directions = [
      { move: (i: number) => ({ row: 0, col: i }), limit: side - 1 },
      { move: (i: number) => ({ row: i, col: side - 1 }), limit: side - 1 },
      { move: (i: number) => ({ row: side - 1, col: side - 1 - i }), limit: side - 1 },
      { move: (i: number) => ({ row: side - 1 - i, col: 0 }), limit: side - 2 },
    ]

    for (const direction of directions) {
      for (let i = 0; i < direction.limit && prizeIndex < totalPrizes; i++) {
        const pos = direction.move(i)
        positions.push({
          ...pos,
          index: prizeIndex++,
          order: positions.length,
        })
      }
    }

    return { positions, side }
  }

  // 保存遊戲數據
  const saveGameData = () => {
    if (import.meta.client) {
      localStorage.setItem('lotteryPrizes', JSON.stringify(prizes.value))
      localStorage.setItem('pickedPrizes', JSON.stringify(Array.from(pickedPrizes)))
    }
  }

  // 添加獎品
  const addPrize = (name: string, image: string) => {
    const newPrize: Prize = {
      id: Date.now().toString(),
      name,
      image,
    }
    prizes.value.push(newPrize)
    saveGameData()
  }

  // 更新獎品
  const updatePrize = (id: string, name: string, image: string) => {
    const index = prizes.value.findIndex(p => p.id === id)
    if (index !== -1) {
      prizes.value[index] = { ...prizes.value[index], name, image }
      saveGameData()
    }
  }

  // 刪除獎品
  const deletePrize = (id: string) => {
    prizes.value = prizes.value.filter(p => p.id !== id)
    pickedPrizes.delete(id)
    saveGameData()
  }

  // 載入遊戲數據
  const loadGameData = () => {
    if (import.meta.client) {
      const savedPrizes = localStorage.getItem('lotteryPrizes')
      const savedPickedPrizes = localStorage.getItem('pickedPrizes')

      if (savedPrizes) {
        prizes.value = JSON.parse(savedPrizes)
      }
      if (savedPickedPrizes) {
        const pickedArray = JSON.parse(savedPickedPrizes)
        pickedArray.forEach((id: string) => pickedPrizes.add(id))
      }
    }
  }

  // 動畫邏輯
  const animate = async () => {
    if (isAnimating.value || availablePrizes.value.length === 0)
      return

    isAnimating.value = true
    shuffleCount.value = 0
    let delay_time: number = ANIMATION.INITIAL_DELAY

    try {
      // 初始化洗牌
      const positions = createSquareLayout(prizes.value.length).positions
      const availableIndices = positions
        .map((_, index) => index)
        .filter(index => !pickedPrizes.has(prizes.value[index].id))

      // 執行動畫循環
      for (let round = 0; round < ANIMATION.ROUNDS; round++) {
        // 每輪重新洗牌
        const shuffledIndices = shuffle(availableIndices)

        for (const index of shuffledIndices) {
          currentIndex.value = index
          await delay(delay_time)

          // 逐漸減少延遲時間
          delay_time = Math.max(
            ANIMATION.MIN_DELAY,
            delay_time - ANIMATION.DELAY_DECREMENT,
          )
        }

        shuffleCount.value++
      }

      // 最終選擇
      const finalIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
      currentIndex.value = finalIndex

      // 標記為已抽取
      if (prizes.value[finalIndex]) {
        pickedPrizes.add(prizes.value[finalIndex].id)
      }

      // 保存結果
      saveGameData()

      // 最終停留時間
      await delay(1000)
    }
    finally {
      isAnimating.value = false
      currentIndex.value = -1
    }
  }

  // 開始遊戲
  const startGame = async () => {
    if (!gameStarted.value) {
      gameStarted.value = true
      await saveGameData()
    }
    // 開始動畫
    animate()
  }

  // 重置遊戲
  const resetGame = () => {
    pickedPrizes.clear()
    gameStarted.value = false
    saveGameData()
  }

  return {
    prizes,
    pickedPrizes,
    isAnimating,
    gameStarted,
    editingId,
    currentIndex,
    shuffleCount,
    availablePrizes,
    addPrize,
    updatePrize,
    deletePrize,
    startGame,
    resetGame,
    animate,
    shuffle,
    createSquareLayout,
    loadGameData,
    saveGameData,
  }
}
