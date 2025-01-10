<script setup lang="ts">
</script>

<template>
  <header class="sticky top-0 z-10 h-53px flex items-center gap-4 border-b bg-background px-4 md:px-6">
    <div class="w-full flex items-center gap-4">
      <h2 class="text-lg font-bold">
        抽獎系統
      </h2>
    </div>
    <div class="ml-auto">
      <slot />
    </div>
  </header>
</template>

<style scoped>

</style>
