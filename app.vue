<script setup lang="ts">
import { Sonner } from '@/components/ui/sonner'
import { ConfigProvider } from 'radix-vue'

const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#09090b' : '#ffffff')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

const { theme, radius } = useCustomize()

useServerHead({
  bodyAttrs: {
    class: `theme-${theme.value}`,
    style: `--radius: ${radius.value}rem;`,
  },
})

const title = '抽起來抽就對了'
const description = '這是一個抽獎系統的網頁應用，有各種類型的抽獎系統'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: 'https://dashboard.dianprata.com',
  ogImage: 'https://nuxt-shadcn-dashboard.vercel.app/social-card.png',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: 'https://nuxt-shadcn-dashboard.vercel.app/social-card.png',
  twitterCard: 'summary_large_image',
})

const router = useRouter()

defineShortcuts({
  'G-H': () => router.push('/'),
})

const useIdFunction = () => useId()
</script>

<template>
  <ConfigProvider :use-id="useIdFunction">
    <div vaul-drawer-wrapper>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>

    <Toaster />
    <Sonner class="pointer-events-auto" />
  </ConfigProvider>
</template>
