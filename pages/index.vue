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
  shuffle,
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
  <div class="lottery-container">
    <!-- 表單部分 -->
    <PrizeForm
      :editing-id="editingId"
      :initial-data="editingPrize"
      @submit="handlePrizeSubmit"
      @cancel="cancelEdit"
    />
    <!-- 抽獎區域 -->
    <div
      class="lottery-grid"
      :style="gridStyle"
    >
      <div
        v-for="(pos, index) in layout.positions"
        :key="index"
        class="lottery-card"
        :class="{
          'card-flipped': isFlipped(index),
          'picked': isPicked(prizes[index]?.id),
        }"
        :style="cardStyle(pos)"
      >
        <div class="card-front">
          <h2 class="text-2xl font-bold">
            {{ prizes[index]?.prizeRank }} <span class="text-base">賞</span>
          </h2>
          <img :src="prizes[index]?.prizeImage" :alt="prizes[index]?.prizeName">
          <h3 class="text-lg">
            {{ prizes[index]?.prizeName }}
          </h3>
        </div>
        <div class="card-back" />
      </div>
    </div>

    <!-- 控制按鈕 -->
    <div class="flex justify-center gap-4">
      <div class="status-info">
        <p>剩餘獎品: {{ availablePrizes.length }} / {{ prizes.length }}</p>
        <p v-if="isAnimating">
          洗牌次數: {{ shuffleCount }}
        </p>
      </div>
      <Button
        :disabled="isAnimating || prizes.length === 0"
        @click="shuffle"
      >
        洗牌
      </Button>
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
.lottery-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.prize-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.image-preview {
  max-width: 100px;
  margin-top: 10px;
}

.lottery-grid {
  width: 100%;
  aspect-ratio: 1;
  max-width: 800px;
  margin: 0 auto;
}

.lottery-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-front {
  @apply border border-foreground rounded-md p-4 space-y-4 text-center;
}

.card-back {
  background: #2c3e50;
  transform: rotateY(180deg);
  border-radius: 8px;
}

.card-flipped {
  transform: rotateY(180deg);
}

.picked {
  opacity: 0.5;
  pointer-events: none;
}

.controls {
  margin-top: 20px;
  text-align: center;
}
</style>
