<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Upload } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import * as z from 'zod'

const props = defineProps<{
  editingId?: string
  initialData?: {
    name: string
    image: string
  }
}>()

const emit = defineEmits<{
  (e: 'submit', data: { name: string, image: string }): void
  (e: 'cancel'): void
}>()

const formSchema = toTypedSchema(z.object({
  name: z
    .string()
    .min(1),
  image: z
    .string()
    .url(),
}))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const formData = reactive({
  name: props.initialData?.name || '',
  image: props.initialData?.image || '',
})

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
      formData.image = result.url
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

function removeImage() {
  formData.image = ''
}

function fileInputClick() {
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) {
    fileInput.click()
  }
}

const onSubmit = handleSubmit((values) => {
  emit('submit', { ...values })
})
</script>

<template>
  <form class="space-y-2" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="prizeName" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <FormLabel>獎品名稱</FormLabel>
        <FormControl>
          <Input v-model="formData.name" type="text" placeholder="輸入獎品名稱" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
      <Button size="icon" type="button" @click="fileInputClick">
        <FormField v-slot="{ componentField }" name="imageUrl" :validate-on-blur="!isFieldDirty">
          <FormItem>
            <FormLabel>圖片</FormLabel>
            <FormControl>
              <div class="flex items-center gap-4">
                <Input v-model="formData.image" type="text" placeholder="輸入圖片網址或上傳圖片" v-bind="componentField" />
                <Button size="icon" type="button" @click="fileInputClick">
                  <Upload />
                  <Input ref="fileInput" type="file" class="hidden" @change="handleFileUpload" />
                </Button>
              </div>
            </FormControl>
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
        <div v-if="formData.image" class="image-preview-container">
          <img
            :src="formData.image"
            class="image-preview"
            alt="預覽圖"
          >
          <button
            type="button"
            class="remove-image"
            @click="removeImage"
          >
            ✕
          </button>
        </div>
        <div>
          <Button type="submit" :disabled="uploading">
            {{ editingId ? '更新獎品' : '新增獎品' }}
          </Button>
          <Button
            v-if="editingId"
            type="button"
            @click="$emit('cancel')"
          >
            取消編輯
          </Button>
        </div>
      </button>
    </formfield>
  </form>
</template>
