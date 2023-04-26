<script setup>
import {
  requiredValidator,
} from '@validators'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import { usePostStore } from '@/views/post/usePostStore'
const postStore = usePostStore()
const form = ref()
const loading = ref(false)
const isSnackbarVisible = ref(false)
const postData = reactive({
  title: "",
  short_desc: "",
  thumbnail: [],
  content: "",
  tags: ""
})

const onSubmit = async () => {
  let { valid } = await form.value?.validate()

  if (valid) {
    loading.value = true
    postStore.createPost(postData).then((res) => {
      if (res.status == 201) {
        isSnackbarVisible.value = true;
        // Object.assign(postData, {
        //   title: "",
        //   short_desc: "",
        //   thumbnail: [],
        //   content: ""
        // })
        // form.value.reset()
      }
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      loading.value = false
    })
  }
}
</script>

<template>
  <VRow>
    <!-- 👉  -->
    <VCol cols="12" md="9">
      <VCard>
        <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
          <h6 class="font-weight-bold text-xl">
            Tạo mới bài viết
          </h6>
        </VCardText>

        <VDivider />

        <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
          <VForm ref="form" lazy-validation>
            <VRow>
              <VCol cols="12">
                <VTextField v-model="postData.title" prepend-icon="tabler-h-1" :rules="[requiredValidator]" label="Tiêu đề" required />
              </VCol>
              <VCol cols="12">
                <VTextarea v-model="postData.short_desc" :rules="[requiredValidator]" prepend-icon="tabler-alphabet-latin" label="Mô tả ngắn" rows="2" required />
              </VCol>
              <VCol cols="12" style="height: 100%;">
                <QuillEditor theme="snow" toolbar="full" :rules="[requiredValidator]" content-type="html" v-model:content="postData.content"/>
              </VCol>
              <VCol cols="12">
                <VFileInput v-model="postData.thumbnail" prepend-icon="tabler-camera" :rules="[requiredValidator]" placeholder="Upload your documents" label="Ảnh thumnail">
                  <template #selection="{ fileNames }">
                    <template v-for="fileName in fileNames" :key="fileName">
                      <VChip label size="small" variant="outlined" color="primary" class="me-2">
                        {{ fileName }}
                      </VChip>
                    </template>
                  </template>
                </VFileInput>
              </VCol>
              <VCol cols="12">
                <VTextField prepend-icon="tabler-tag" v-model="postData.tags" label="Thẻ" required />
              </VCol>
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn @click="onSubmit" :loading="loading">
                  Tạo mới
                </VBtn>

                <VBtn color="info" @click="form?.reset()">
                  Làm mới
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>

      <VSnackbar v-model="isSnackbarVisible" location="top end">
        <VAlert type="success">
          Tạo thành công
        </VAlert>
      </VSnackbar>
    </VCol>

    <!-- 👉 Right Column: Invoice Action -->
    <VCol cols="12" md="3">
      <VSnackbar
        v-model="isSnackbarVisible"
        location="top end"
      >
        <VAlert type="success">
          Tạo thành công
        </VAlert>
      </VSnackbar>
    </VCol>
  </VRow>
</template>

