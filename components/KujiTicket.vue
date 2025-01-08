<script setup lang="ts">
import Flipbook from 'flipbook-vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'

// 定義 Prize 類型
interface Prize {
  number: string
  name: string
}

// 定義組件的 props
const props = defineProps<{
  prize: Prize
  modelValue?: boolean // v-model 用於控制是否已撕開
}>()

// 定義組件的 emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean] // v-model 的更新事件
  'reset': [] // 重置事件
}>()

const flipbook = ref()
const currentPage = ref(0)
const isDragging = ref(false)
const isFullyRevealed = ref(false)

// 監聽外部 modelValue 的變化
watch(() => props.modelValue, (newValue) => {
  if (newValue === false) {
    resetFlipbook()
  }
})

// 監聽外部 modelValue 的變化
watch(() => props.modelValue, (newValue) => {
  if (newValue === false) {
    resetFlipbook()
  }
})

// 初始化完成
function handleInit() {
  // 可以在這裡添加初始化後的邏輯
}

// 頁面變化處理
function handlePageChange() {
  setTimeout(() => {
    isFullyRevealed.value = true
    emit('update:modelValue', true)
  }, 500)
}

// 開始拖動
function startDrag(e: MouseEvent | TouchEvent) {
  if (isFullyRevealed.value)
    return

  e.preventDefault()
  isDragging.value = true

  // 觸發翻頁
  if (flipbook.value) {
    flipbook.value.flipLeft()
  }
}

// 重置狀態
function resetFlipbook() {
  if (flipbook.value) {
    flipbook.value.goToPage(1)
  }
  isFullyRevealed.value = false
  isDragging.value = false
  emit('update:modelValue', false)
}

// 組件掛載
onMounted(() => {
  // 初始化相關邏輯
})
</script>

<template>
  <div class="transform-style-3d relative h-50 w-150 select-none border border-foreground rounded-2 shadow-md">
    <!-- 基礎票面 -->
    <div class="absolute h-full w-full">
      <div class="h-full flex items-center rounded-2">
        <div class="text-foreground-700 flex flex-[2] flex-col items-center justify-center gap-2">
          <h2 class="text-5xl font-bold">
            一番賞
          </h2>
          <div class="pointer-events-none flex items-center whitespace-nowrap text-base text-gray-600">
            <span class="hidden md:inline">由左向右撕開</span>
            <span class="md:hidden">向右滑動撕開</span>
            <div class="ml-2 text-xl">
              →
            </div>
          </div>
        </div>
        <div class="relative h-full flex flex-[3] items-end justify-between border-l-2 border-gray-300 border-l-dashed py-4 pl-5 pr-2 text-gray-5">
          <div class="absolute left-5 top-0 font-black -translate-y-20">
            <span class="text-[15rem]">
              {{ prize.number }}
            </span>
            <span class="text-xl">賞</span>
          </div>
          <div class="ml-auto max-w-[10ch] pb-4 text-2xl font-bold">
            {{ prize.name }}
          </div>
        </div>
      </div>
      <!-- 內容遮罩 -->
    </div>

    <!-- 撕開層 -->
    <!-- Flipbook 撕開效果 -->
    <div class="absolute h-full w-[65%]">
      <Flipbook
        ref="flipbook"
        v-model:page="currentPage"
        class="h-full w-full translate-x-[13rem]"
        :single-page="true"
        :pages="[
          'ichiban-ticket.png', null]"
        :click-to-zoom="false"
        forward-direction="left"
        @init="handleInit"
        @flip-left-start="handlePageChange"
      />
    </div>
    <!-- 重置按鈕 -->
    <Button
      v-if="isFullyRevealed"
      class="absolute left-1/2 top-1/2 translate-y-1/4 translate-y-1/4 transform -translate-x-1/2"
      @click="$emit('reset')"
    >
      重新抽籤
    </Button>
  </div>
</template>

<style>
/* 3D 相關樣式 */
.transform-style-3d {
  transform-style: preserve-3d;
}

/* 刮刮樂紋理背景 */
.bg-scratch {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.1) 75%,
    transparent 75%,
    transparent
  );
  background-size: 4px 4px;
}
/* Flipbook 容器樣式 */
.flipbook {
  font-size: 0; /* 移除圖片間的空隙 */
}

/* 防止文字選擇 */
.flipbook * {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 確保頁面填滿容器 */
.flipbook img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.click-to-flip {
  display: none;
}
</style>
