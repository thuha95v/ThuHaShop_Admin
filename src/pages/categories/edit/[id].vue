<script setup>
import {
  requiredValidator,
} from '@validators'

// Store
import { useCategoryStore } from '@/views/categories/useCategoryStore'
const categoryStore = useCategoryStore()

// const invoiceListStore = useInvoiceStore()
const route = useRoute()
const invoiceData = ref()
const form = ref()
const isSnackbarVisible = ref(false)
const categoryData = reactive({
  name: "",
  priority: null
})

// 👉 
categoryStore.fetchCategory((route.params.id)).then(res => {
  console.log(res);
  const { name, priority } = res.data.data
  Object.assign(categoryData, {
    name, 
    priority
  })
}).catch(error => {
  console.log(error)
})

const onSubmit = async() => {
  let { valid } = await form.value?.validate()
  
  if(valid){
    categoryStore.updateCategory(route.params.id, categoryData).then((res) => {
      console.log(res);
      if(res.status == 200){
        isSnackbarVisible.value = true;
      }
    }).catch(err => {
      console.log(err);
    })
  }
}
</script>

<template>
  <VRow>
    <!-- 👉 InvoiceEditable   -->
    <VCol v-if="categoryData" cols="12" md="9">
      <VCard>
        <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
          <h6 class="font-weight-bold text-xl">
            Cập nhật thể loại
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
                  Cập nhật
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
          Cập nhật thành công
        </VAlert>
      </VSnackbar>
    </VCol>

    <!-- 👉 Right Column: Invoice Action -->
    <VCol cols="12" md="3"></VCol>

  </VRow>
</template>

