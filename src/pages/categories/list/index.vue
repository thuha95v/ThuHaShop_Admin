<script setup>
import { useCategoryStore } from '@/views/categories/useCategoryStore'

const categoryStore = useCategoryStore()
const searchQuery = ref('')
const isConfirmDialogOpen = ref(false)
const isSnackbarVisible = ref(false)
const deleteId = ref("")
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalInvoices = ref(0)
const categories = ref([])
const selectedRows = ref([])

// 👉 Fetch Invoices
watchEffect(() => {
  categoryStore.fetchCategories({
    q: searchQuery.value,
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }).then(response => {
    categories.value = response.data.data
    totalPage.value = 1
    totalInvoices.value = 10

    // totalPage.value = response.data.totalPage
    // totalInvoices.value = response.data.totalInvoices
  }).catch(error => {
    console.log(error)
  })
})

// 👉 Fetch Invoices
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = categories.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = categories.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalInvoices.value } entries`
})

const loadData = () => {
  categoryStore.fetchCategories({
    q: searchQuery.value,
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }).then(response => {
    categories.value = response.data.data
    totalPage.value = 1
    totalInvoices.value = 10

    // totalPage.value = response.data.totalPage
    // totalInvoices.value = response.data.totalInvoices
  }).catch(error => {
    console.log(error)
  })
}

const openDialog = (id) => {
  isConfirmDialogOpen.value = true
  deleteId.value = id
}

const confirmHandler = (isConfirm) => {
  if(isConfirm){
    categoryStore.deleteCategory(deleteId.value).then((res) => {
      console.log(res);
      if(res.status == 200){
        isSnackbarVisible.value = true
      }

      loadData()
    }).catch((err) => {
      console.log(err);
    })
  }

}
</script>

<template>
  <VCard
    v-if="categories"
    id="invoice-list"
  >
    <VCardText class="d-flex align-center flex-wrap gap-4">
      <!-- 👉 Rows per page -->
      <div
        class="d-flex align-center"
        style="width: 145px;"
      >
        <span class="text-no-wrap me-3">Hiển thị:</span>
        <VSelect
          v-model="rowPerPage"
          density="compact"
          :items="[10, 20, 30, 50]"
        />
      </div>

      <div class="me-3">
        <!-- 👉 Create invoice -->
        <VBtn
          prepend-icon="tabler-plus"
          :to="{ name: 'categories-create' }"
        >
          Tạo mới
        </VBtn>
      </div>

      <VSpacer />

      <div class="d-flex align-center flex-wrap gap-4">
        <!-- 👉 Search  -->
        <div class="invoice-list-filter">
          <VTextField
            v-model="searchQuery"
            placeholder="Tìm kiếm"
            density="compact"
          />
        </div>
      </div>
    </VCardText>

    <VDivider />

    <!-- SECTION Table -->
    <VTable class="text-no-wrap invoice-list-table">
      <!-- 👉 Table head -->
      <thead class="text-uppercase">
        <tr>
          <th scope="col">
            #ID
          </th>
          <th scope="col">
            TÊN
          </th>

          <th
            scope="col"
            class=""
          >
            SLUG
          </th>

          <th scope="col">
            ĐỘ ƯU TIÊN
          </th>

          <th scope="col">
            CHỨC NĂNG
          </th>
        </tr>
      </thead>

      <!-- 👉 Table Body -->
      <tbody>
        <tr
          v-for="category in categories"
          :key="category.id"
          style="height: 3.75rem;"
        >
          <!-- 👉 Id -->
          <td>
            {{ category.id }}
          </td>

          <!-- 👉  -->
          <td class="">
            {{ category.name }}
          </td>

          <!-- 👉  -->
          <td>{{ category.slug }}</td>

          <!-- 👉  -->
          <td class="">{{ category.priority }}</td>

          <!-- 👉 Actions -->
          <td style="width: 8rem;">
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              @click="openDialog(category.id)"
            >
              <VIcon
                icon="tabler-trash"
                :size="22"
              />
            </VBtn>

            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              :to="{ name: 'categories-edit-id', params: { id: category.id } }"
            >
              <VIcon
                icon="tabler-pencil"
                :size="22"
              />
            </VBtn>
          </td>
        </tr>
      </tbody>

      <!-- 👉 table footer  -->
      <tfoot v-show="!categories.length">
        <tr>
          <td
            colspan="8"
            class="text-center text-body-1"
          >
            No data available
          </td>
        </tr>
      </tfoot>
    </VTable>
    <!-- !SECTION -->

    <VDivider />

    <!-- SECTION Pagination -->
    <VCardText class="d-flex align-center flex-wrap gap-4 py-3">
      <!-- 👉 Pagination meta -->
      <span class="text-sm text-disabled">
        {{ paginationData }}
      </span>

      <VSpacer />

      <!-- 👉 Pagination -->
      <VPagination
        v-model="currentPage"
        size="small"
        :total-visible="5"
        :length="totalPage"
        @next="selectedRows = []"
        @prev="selectedRows = []"
      />
    </VCardText>
    <!-- !SECTION -->

    <ConfirmDialog
      v-model:isDialogVisible="isConfirmDialogOpen"
      confirmation-msg="Bạn chắn chắn muốn xóa thể loại này ?"
      @confirm="confirmHandler"
    />

    <VSnackbar
      v-model="isSnackbarVisible"
      location="top end"
    >
      <VAlert type="success">
        Xóa thành công
      </VAlert>
    </VSnackbar>
  </VCard>
</template>

<style lang="scss">
#invoice-list {
  .invoice-list-actions {
    inline-size: 8rem;
  }

  .invoice-list-filter {
    inline-size: 20rem;
  }
}
</style>
