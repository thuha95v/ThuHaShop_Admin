<script setup>
import {
  requiredValidator,
} from '@validators'

import { useCategoryStore } from '@/views/categories/useCategoryStore'
const categoryStore = useCategoryStore()
const form = ref()
const isSnackbarVisible = ref(false)
const categoryData = reactive({
  name: "",
  priority: null
})

const onSubmit = async() => {
  let { valid } = await form.value?.validate()
  
  if(valid){
    categoryStore.createCategory(categoryData).then((res) => {
      console.log(res);
      if(res.status == 201){
        isSnackbarVisible.value = true;
        form.value.reset()
      }
    }).catch(err => {
      console.log(err);
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
            Tạo mới thể loại
          </h6>
        </VCardText>

        <VDivider />

        <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
          <VForm ref="form" lazy-validation>
            <VRow>
              <VCol cols="12">
                <VTextField v-model="categoryData.name" :rules="[requiredValidator]" label="Tên thể lại" required />
              </VCol>

              <VCol cols="12">
                <VTextField v-model="categoryData.priority" :rules="[requiredValidator]" label="Độ ưu tiên" type="number" required />
              </VCol>
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn @click="onSubmit">
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

      <VSnackbar
        v-model="isSnackbarVisible"
        location="top end"
      >
        <VAlert type="success">
          Tạo thành công
        </VAlert>
      </VSnackbar>
    </VCol>

    <!-- 👉 Right Column: Invoice Action -->
    <VCol cols="12" md="3">
    </VCol>
  </VRow>
</template>

