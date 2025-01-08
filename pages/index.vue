<script setup lang="ts">
import type { Position } from '~/types/lottery'
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

const editingPrize = computed(() => {
  if (!editingId.value)
    return undefined
  const prize = prizes.value.find(p => p.id === editingId.value)
  return prize ? { name: prize.name, image: prize.image } : undefined
})

function handlePrizeSubmit(data: { name: string, image: string }) {
  if (editingId.value) {
    updatePrize(editingId.value, data.name, data.image)
  }
  else {
    addPrize(data.name, data.image)
  }
  resetForm()
}

const formData = ref({
  name: '',
  image: '',
})

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
  formData.value = { name: '', image: '' }
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
          <img :src="prizes[index]?.image" :alt="prizes[index]?.name">
          <div class="prize-name">
            {{ prizes[index]?.name }}
          </div>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
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
