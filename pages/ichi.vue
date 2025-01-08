<script lang="ts" setup>
interface Prize {
  number: string
  name: string
}

const prizes: Prize[] = [
  { number: 'A', name: '限定設計師公仔' },
  { number: 'B', name: '精美超可動模型' },
  { number: 'C', name: '限定亞克力大立牌' },
  { number: 'D', name: '經典角色大墊板組' },
  { number: 'E', name: '經典時尚水杯' },
  { number: 'F', name: '經典時尚長巾組' },
  { number: 'G', name: '經典時尚軟膠吊飾' },
]

const currentPrize = ref<Prize>(prizes[0])
const isRevealed = ref(false)

function randomizePrize() {
  currentPrize.value = prizes[Math.floor(Math.random() * prizes.length)]
}

function handleReset() {
  randomizePrize()
  isRevealed.value = false
}
</script>

<template>
  <ClientOnly>
    <div class="flex perspective-1200 items-center justify-center">
      <KujiTicket
        v-model="isRevealed"
        :prize="currentPrize"
        @reset="handleReset"
      />
    </div>
    <!-- 開發用的測試按鈕 -->
    <div class="mt-8 space-x-4">
      <button
        class="rounded bg-gray-500 px-4 py-2 text-white"
        @click="randomizePrize"
      >
        隨機獎品
      </button>
      <button
        class="rounded bg-gray-500 px-4 py-2 text-white"
        @click="isRevealed = false"
      >
        重置狀態
      </button>
    </div>
  </ClientOnly>
</template>

<style scoped>
</style>
