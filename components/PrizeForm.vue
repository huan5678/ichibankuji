<script setup lang="ts">
import type { Prize } from '~/types/lottery'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import * as z from 'zod'

const props = defineProps<{
  editingId?: string
  initialData?: Prize
}>()

const emit = defineEmits<{
  (e: 'submit', data: Prize): void
  (e: 'cancel'): void
}>()

const formSchema = toTypedSchema(z.object({
  prizeRank: z
    .string()
    .min(1),
  prizeName: z
    .string()
    .trim()
    .min(1, '獎品名稱不能為空')
    .max(50),
  prizeImage: z
    .string()
    .optional(),
}))

const { isFieldDirty, handleSubmit, values, setFieldValue } = useForm({
  validationSchema: formSchema,
})

const formData = ref({ ...props.initialData })

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadProgress = ref(0)

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file)
    return

  // 檢查文件類型
  if (!file.type.startsWith('image/')) {
    toast('請上傳圖片文件')
    return
  }

  // 檢查文件大小 (例如限制為 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast('檔案大小不能超過 5MB')
    return
  }

  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result)
        setFieldValue('prizeImage', e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  try {
    uploading.value = true
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: uploadFormData,
    })

    const result = await response.json()

    if (result.success) {
      setFieldValue('prizeImage', result.url)
      toast('上傳成功')
    }
    else {
      throw new Error(result.error)
    }
  }
  catch (error) {
    toast(`上傳失敗：${(error as Error).message}`)
  }
  finally {
    uploading.value = false
    uploadProgress.value = 0
    // 清除檔案輸入
    input.value = ''
  }
}

function updatePrizeImage(event: Event) {
  const target = event.target as HTMLInputElement
  setFieldValue('prizeImage', target.value)
}

function removeImage() {
  setFieldValue('prizeImage', 'default-prize-image.png')
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleCancel() {
  emit('cancel')
}

const onSubmit = handleSubmit((values) => {
  emit('submit', { ...values, prizeImage: values.prizeImage || 'default-prize-image.png' } as Prize)
})

onMounted(() => {
  if (props.initialData) {
    formData.value = props.initialData
  }
})
</script>

<template>
  <form class="mx-auto max-w-2xl space-y-4" @submit="onSubmit">
    <h2 class="text-2xl font-bold">
      {{ editingId ? '編輯獎品' : '新增獎品' }}
    </h2>
    <div class="grid gap-4 md:grid-cols-2">
      <FormField v-slot="{ componentField }" name="prizeName" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <FormLabel>獎品名稱</FormLabel>
          <FormControl>
            <Input type="text" placeholder="輸入獎品名稱" v-bind="componentField" />
          </FormControl>
          <FormDescription v-if="!isFieldDirty('prizeName')">
            請輸入獎品名稱
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="prizeRank" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <FormLabel>獎品等級</FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="選擇獎品等級" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="rank in CONFIG.PRIZE.RANK" :key="rank" :value="rank">
                  {{ rank }} 賞
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormDescription v-if="!isFieldDirty('prizeRank')">
            請選擇獎品等級
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
    <FormField v-slot="{ componentField }" name="prizeImage" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <FormLabel>獎品圖片</FormLabel>
        <div class="grid grid-cols-5 gap-4">
          <FormControl class="col-span-4">
            <Input type="text" placeholder="輸入圖片網址或上傳圖片" v-bind="componentField" @input="updatePrizeImage" />
          </FormControl>
          <div class="">
            <Button type="button" size="icon" @click="triggerFileInput">
              <Icon name="i-lucide-file-up" />
            </Button>
            <Input ref="fileInput" type="file" class="hidden" @change="handleFileUpload" />
          </div>
        </div>
        <FormDescription v-if="!isFieldDirty('prizeImage')">
          請輸入圖片網址或是上傳圖片
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <!-- 上傳進度 -->
    <div v-if="uploading" class="upload-progress">
      上傳中... {{ uploadProgress }}%
      <div class="progress-bar">
        <div
          class="progress-bar-fill"
          :style="{ width: `${uploadProgress}%` }"
        />
      </div>
    </div>

    <!-- 圖片預覽 -->
    <div v-if="values.prizeImage" class="relative mt-6 inline-block">
      <img
        :src="values.prizeImage"
        class="aspect-video h-48 max-w-lg w-full rounded-md object-cover shadow-md"
        alt="預覽圖"
      >
      <Button
        v-if="values.prizeImage !== 'default-prize-image.png'"
        type="button"
        size="icon"
        variant="destructive"
        class="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2"
        @click="removeImage"
      >
        <Icon name="i-lucide-x" />
      </Button>
    </div>
    <Separator />
    <div class="flex justify-between gap-4">
      <Button class="ml-auto w-full" type="submit" :disabled="uploading">
        {{ editingId ? '更新獎品' : '新增獎品' }}
      </Button>
      <Button
        v-if="editingId"
        class="w-full"
        type="button"
        @click="handleCancel"
      >
        取消編輯
      </Button>
    </div>
  </form>
</template>
