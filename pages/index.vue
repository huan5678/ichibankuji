<script setup lang="ts">
import type { Position, Prize } from '~/types/lottery'
import { computed } from 'vue'
import { useLottery } from '~/composables/useLottery'

const {
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
  startGame,
  resetGame,
  loadGameData,
  createSquareLayout,
} = useLottery()

// 處理抽獎按鈕點擊
async function handleDrawClick() {
  if (isAnimating.value || availablePrizes.value.length === 0)
    return

  try {
    await startGame()
  }
  catch (error) {
    console.error('抽獎過程發生錯誤:', error)
    // 可以在這裡添加錯誤提示
  }
}

const initialData = {
  prizeName: '',
  prizeImage: 'default-prize-image.png',
  prizeRank: '',
}

const formData = ref({
  id: crypto.randomUUID(),
  prizeName: initialData.prizeName,
  prizeImage: initialData.prizeImage,
  prizeRank: initialData.prizeRank,
})

const editingPrize = computed(() => {
  if (!editingId.value)
    return formData.value
  const prize = prizes.value.find(p => p.id === editingId.value)
  return prize ? { id: prize.id, prizeName: prize.prizeName, prizeImage: prize.prizeImage, prizeRank: prize.prizeRank } : undefined
})

function handlePrizeSubmit(data: Prize) {
  if (editingId.value) {
    updatePrize(data)
  }
  else {
    const id = crypto.randomUUID()
    data.id = id
    addPrize(data)
  }
  resetForm()
}

const layout = computed(() => createSquareLayout(prizes.value.length))

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${layout.value.side}, 1fr)`,
  gap: '10px',
}))

function cardStyle(pos: Position) {
  return {
    gridRow: `${pos.row + 1}`,
    gridColumn: `${pos.col + 1}`,
  }
}

function resetForm() {
  formData.value = { prizeName: initialData.prizeName, prizeImage: initialData.prizeImage, prizeRank: initialData.prizeRank, id: crypto.randomUUID() }
  editingId.value = undefined
}

function cancelEdit() {
  resetForm()
}

const isPicked = (id?: string) => id && pickedPrizes.has(id)

function isFlipped(index: number) {
  if (isPicked(prizes.value[index]?.id))
    return true
  return currentIndex.value === index
}

onMounted(() => {
  loadGameData()
})
</script>

<template>
  <div class="mx-auto p-4 container space-y-12">
    <!-- 表單部分 -->
    <PrizeForm
      :editing-id="editingId"
      :initial-data="editingPrize"
      @submit="handlePrizeSubmit"
      @cancel="cancelEdit"
    />
    <!-- 抽獎區域 -->
    <ul
      v-auto-animate
      class="lottery-grid"
      :style="gridStyle"
    >
      <li
        v-for="(pos, index) in layout.positions"
        :key="index"
        class="lottery-card"
        :class="{
          current: currentIndex === index,
          picked: isPicked(prizes[index]?.id),
        }"
        :style="cardStyle(pos)"
      >
        <div
          class="card-front"
          :class="{ 'card-flipped': isFlipped(index) }"
          @click="isFlipped(index) && isAnimating ? null : currentIndex = index"
        >
          <p class="text-2xl font-bold">
            {{ prizes[index]?.prizeName }}
          </p>
        </div>
        <div
          class="card-back"
        />
      </li>
    </ul>

    <!-- 控制按鈕 -->
    <div class="flex justify-center gap-4">
      <div class="status-info">
        <p>剩餘獎品: {{ availablePrizes.length }} / {{ prizes.length }}</p>
        <p v-if="isAnimating">
          洗牌次數: {{ shuffleCount }}
        </p>
      </div>
      <Button
        :disabled="isAnimating || prizes.length === 0 || availablePrizes.length === 0"
        @click="handleDrawClick"
      >
        {{ availablePrizes.length === 0 ? '獎品已抽完' : isAnimating ? '抽獎中...' : gameStarted ? '抽獎' : '開始遊戲' }}
      </Button>
      <Button
        :disabled="isAnimating"
        @click="resetGame"
      >
        重置
      </Button>
    </div>
  </div>
</template>

<style scoped>
.lottery-grid {
  @apply aspect-square w-full max-w-7xl mx-auto;
}

.lottery-card {
  @apply relative w-full h-full;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.lottery-card:not(.picked):not(.current):hover {
  @apply translateY(-5px) shadow-md;
}

.current {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(52, 152, 219, 0.5);
  z-index: 2;
  transition: all 0.3s ease;
}

.current.card-flipped {
  transform: rotateY(180deg) scale(1.05);
}

.card-front,
.card-back {
  @apply absolute w-full h-full flex flex-col justify-center items-center transition-all duration-300 ease;
  backface-visibility: hidden;
}

.card-front {
  @apply border border-foreground rounded-md p-4 space-y-4 text-center;
}

.card-back {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  @apply transform rotateY(180deg) rounded-md text-2xl font-bold text-white bg-background;
}

.card-flipped {
  @apply transform rotateY(180deg);
}

.picked {
  @apply opacity-50 pointer-events-none scale-90 transition-all duration-300 ease;
}

.picked.card-flipped {
  @apply transform rotateY(180deg) scale(0.95);
}

.controls {
  @apply text-center mt-5;
}
</style>
