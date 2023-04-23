<script setup>
import AddNewUserDrawer from '@/views/apps/user/list/AddNewUserDrawer.vue'
import { useOrderStore } from '@/views/order/useOrderStore'

const orderStore = useOrderStore()
const isSnackbarVisible = ref(false)
const snackMessage = ref("")
const searchQuery = ref('')
const selectedPayMethod = ref()
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalOrder = ref(0)
const orders = ref([])

// 👉 Fetching orders
const fetchOrders = () => {
  orderStore.fetchOrders({
    q: searchQuery.value,
    status: selectedStatus.value,
    pay_method: selectedPayMethod.value,
    limit: rowPerPage.value,
    page: currentPage.value,
  }).then(res => {
    console.log(res.data);
    orders.value = res.data.data.rows
    totalPage.value = Math.round(res.data.data.count / rowPerPage.value)
    totalOrder.value = res.data.data.count
    // totalPage.value = response.data.totalPage
    // totalUsers.value = response.data.totalUsers
  }).catch(error => {
    console.error(error)
  })
}

watchEffect(fetchOrders)

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})


const updateOrder = (id, status) => {
  orderStore.updateOrder(id, {
    status: status == "waiting" ? "success" : "fail",
    note: `Duyệt đơn hàng #${id}`
  }).then(res => {
    if(res.status == 200){
      fetchOrders()
      snackMessage.value = "Đơn hàng đã được duyệt"
      isSnackbarVisible.value = true
    }
  }).catch(err => {
    console.log(err);
  })
}
// 👉 search filters
const payMethods = [
  {
    title: 'Tiền mặt',
    value: 'cash',
  },
  {
    title: 'Ngân hàng',
    value: 'bank',
  }
]

const status = [
  {
    title: 'Đang chờ duyệt',
    value: 'waiting',
  },
  {
    title: 'Thành công',
    value: 'success',
  },
  {
    title: 'Thất bại',
    value: 'fail',
  },
]

const resolveStatusVariant = stat => {
  if (stat === 'waiting')
    return 'warning'
  if (stat === 'success')
    return 'success'
  return 'primary'
}

const enumPayMethod = {
  "cash": "Tiền mặt",
  "bank": "Ngân hàng"
}


// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = orders.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = orders.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `Hiển thị ${ firstIndex } đến ${ lastIndex } của ${ totalOrder.value } mục`
})

// 👉 List
const userListMeta = [
  {
    icon: 'tabler-user',
    color: 'primary',
    title: 'Tổng số lượng',
    stats: '21,459',
    percentage: +29,
    subtitle: '',
  },
  {
    icon: 'tabler-user-plus',
    color: 'error',
    title: 'Đơn hàng đang chờ',
    stats: '4,567',
    percentage: +18,
    subtitle: '',
  },
  {
    icon: 'tabler-user-check',
    color: 'success',
    title: 'Đơn hàng thành công',
    stats: '19,860',
    percentage: -14,
    subtitle: '',
  },
  {
    icon: 'tabler-user-exclamation',
    color: 'warning',
    title: 'Đơn hàng thất bại',
    stats: '2',
    percentage: +0,
    subtitle: '',
  },
]
</script>

<template>
  <section>
    <VRow>
      <VCol
        v-for="meta in userListMeta"
        :key="meta.title"
        cols="12"
        sm="6"
        lg="3"
      >
        <VCard>
          <VCardText class="d-flex justify-space-between">
            <div>
              <span>{{ meta.title }}</span>
              <div class="d-flex align-center gap-2 my-1">
                <h6 class="text-h6">
                  {{ meta.stats }}
                </h6>
                <span :class="meta.percentage > 0 ? 'text-success' : 'text-error'">({{ meta.percentage }}%)</span>
              </div>
              <span>{{ meta.subtitle }}</span>
            </div>

            <VAvatar
              rounded
              variant="tonal"
              :color="meta.color"
              :icon="meta.icon"
            />
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard title="Bộ lọc">
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
              <!-- 👉 Select Role -->
              <VCol
                cols="12"
                sm="4"
              >
                <VSelect
                  v-model="selectedPayMethod"
                  label="Chọn phương thức thanh toán"
                  :items="payMethods"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>
              <!-- 👉 Select Status -->
              <VCol
                cols="12"
                sm="4"
              >
                <VSelect
                  v-model="selectedStatus"
                  label="Chọn trạng thái"
                  :items="status"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div
              class="me-3"
              style="width: 80px;"
            >
              <VSelect
                v-model="rowPerPage"
                density="compact"
                variant="outlined"
                :items="[10, 20, 30, 50]"
              />
            </div>

            <VSpacer />

            <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
              <!-- 👉 Search  -->
              <div style="width: 10rem;">
                <VTextField
                  v-model="searchQuery"
                  placeholder="Tìm kiếm"
                  density="compact"
                />
              </div>

              <!-- 👉 Export button -->
              <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-screen-share"
              >
                Xuất dữ liệu
              </VBtn>

              <!-- 👉 Add user button -->
              <!-- <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewUserDrawerVisible = true"
              >
                Tạo mới
              </VBtn> -->
            </div>
          </VCardText>

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">
                  #
                </th>
                <th scope="col">
                  KHÁCH HÀNG
                </th>
                <th scope="col">
                  EMAIL
                </th>
                <th scope="col">
                  SĐT
                </th>
                <th scope="col">
                  PHƯƠNG THỨC THANH TOÁN
                </th>
                <th scope="col">
                  TRẠNG THÁI
                </th>
                <th scope="col">
                  CHỨC NĂNG
                </th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="order in orders"
                :key="order.id"
                style="height: 3.75rem;"
              >
                <!-- 👉 User -->
                <td>
                  <span>{{ order.id }}</span>
                </td>

                <!-- 👉 Role -->
                <td>
                  <span>{{ order.fullname }}</span>
                </td>

                <!-- 👉 Plan -->
                <td>
                  <span class="text-base ">{{ order.email }}</span>
                </td>

                <!-- 👉 Billing -->
                <td>
                  <span class="text-base ">{{ order.phone }}</span>
                </td>

                <td>
                  <span class="text-base text-center">{{ enumPayMethod[order.pay_method] }}</span>
                </td>


                <!-- 👉 Status -->
                <td>
                  <VChip
                    label
                    :color="resolveStatusVariant(order.status)"
                    size="small"
                    class="text-capitalize"
                  >
                    {{ order.status }}
                  </VChip>
                </td>

                <!-- 👉 Actions -->
                <td
                  class="text-center"
                  style="width: 5rem;"
                >
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    :to="{name: 'orders-detail-id', params: { id: order.id }}"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-eye"
                    />
                  </VBtn>

                  <VBtn
                    v-if="order.status == 'waiting'" 
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="updateOrder(order.id, order.status)"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-circle-check"
                    />
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!orders.length">
              <tr>
                <td
                  colspan="7"
                  class="text-center"
                >
                  Không có dữ liệu
                </td>
              </tr>
            </tfoot>
          </VTable>

          <VDivider />

          <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5">
            <span class="text-sm text-disabled">
              {{ paginationData }}
            </span>

            <VPagination
              v-model="currentPage"
              size="small"
              :total-visible="5"
              :length="totalPage"
            />
          </VCardText>
        </VCard>
      </VCol>

      <VSnackbar
          v-model="isSnackbarVisible"
          location="top end"
      >
        <VAlert type="success">
          {{ snackMessage  }}
        </VAlert>
      </VSnackbar>
    </VRow>
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
