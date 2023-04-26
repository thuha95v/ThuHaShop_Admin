<script setup>
import AddNewUserDrawer from '@/views/apps/user/list/AddNewUserDrawer.vue'
import { usePostStore } from '@/views/post/usePostStore'
import { avatarText } from '@core/utils/formatters'

const HOST_CLIENT = import.meta.env.VITE_CLIENT

const postStore = usePostStore()
const searchQuery = ref('')
const isConfirmDialogOpen = ref(false)
const isSnackbarVisible = ref(false)
const deleteId = ref("")
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalUsers = ref(0)
const posts = ref([])

// 👉 Fetching users
const fetchPosts = () => {
  postStore.fetchPosts({
    q: searchQuery.value,
    status: selectedStatus.value,
    plan: selectedPlan.value,
    role: selectedRole.value,
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }).then(res => {
    // console.log(res.data.data);
    posts.value = res.data.data
    totalPage.value = 1
    totalUsers.value = 10
    // totalPage.value = res.data.totalPage
    // totalUsers.value = res.data.totalUsers
  }).catch(error => {
    console.error(error)
  })
}

watchEffect(fetchPosts)

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

const status = [
  {
    title: 'Không hoạt động',
    value: 'pending',
  },
  {
    title: 'Hoạt động',
    value: 'active',
  },
  {
    title: 'Bị khóa',
    value: 'lock',
  },
]

const isAddNewUserDrawerVisible = ref(false)

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = posts.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = posts.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `Hiển thị ${ firstIndex } đến ${ lastIndex } của ${ totalUsers.value } mục`
})

const addNewUser = userData => {
  userListStore.addUser(userData)

  // refetch User
  fetchUsers()
}

const getLink = (slug) => {
  return `${HOST_CLIENT}/tin-tuc/${slug}`
}

const openDialog = (id) => {
  isConfirmDialogOpen.value = true
  deleteId.value = id
}

const confirmHandler = (isConfirm) => {
  if(isConfirm){
    postStore.deleteById(deleteId.value).then((res) => {
      if(res.status == 200){
        isSnackbarVisible.value = true
      }

      fetchPosts()
    }).catch((err) => {
      console.log(err);
    })
  }

}
</script>

<template>
  <section>
    <VRow>

      <VCol cols="12">
        <VCard title="Quản lý bài viết">
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
              <!-- 👉 Select Role -->
              <!-- <VCol
                cols="12"
                sm="4"
              >
                <VSelect
                  v-model="selectedRole"
                  label="Chọn quyền"
                  :items="roles"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol> -->
              <!-- 👉 Select Status -->
              <!-- <VCol
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
              </VCol> -->
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
              <VBtn
                prepend-icon="tabler-plus"
                :to="{ name: 'posts-create' }"
              >
                Tạo mới
              </VBtn>
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
                  Ảnh thumnail
                </th>
                <th scope="col">
                  Tiêu đề
                </th>
                <th scope="col">
                  Tác giả
                </th>
                <!-- <th scope="col">
                  TRẠNG THÁI
                </th> -->
                <th scope="col">
                  CHỨC NĂNG
                </th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="post, index in posts"
                :key="post.id"
                style="height: 3.75rem;"
              >
                <!-- 👉 User -->
                <td>
                  <div class="d-flex align-center">
                    <!-- <VAvatar
                      variant="tonal"
                      :color="resolveUserRoleVariant(user.role).color"
                      class="me-3"
                      size="38"
                    >
                      <VImg
                        v-if="user.avatar"
                        :src="user.avatar"
                      />
                      <span v-else>{{ post.id }}</span>
                    </VAvatar> -->

                    <div class="d-flex flex-column">
                      <h6 class="text-base">
                        <RouterLink
                          :to="{ name: 'apps-user-view-id', params: { id: post.id } }"
                          class="font-weight-medium user-list-name"
                        >
                          {{ index }}
                        </RouterLink>
                      </h6>
                    </div>
                  </div>
                </td>

                <td>
                  <VAvatar
                    variant="tonal"
                    size="50"
                    class="me-4"
                  >
                    <VImg
                      v-if="post.thumbnail"
                      :src="post.thumbnail"
                    />
                  </VAvatar>
                </td>

                <!-- 👉 Role -->
                <td>
                  <span class="text-capitalize text-base">{{ post.title }}</span>
                </td>

                <!-- 👉 Plan -->
                <td>
                  <span class="text-base">{{ post.user.first_name }} {{ post.user.last_name }}</span>
                </td>

                <!-- 👉 Billing -->
                

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
                    :href="getLink(post.slug)"
                    target="_blank"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-eye"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    :to="{ name: 'posts-update-id', params: { id: post.id} }"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-edit"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="openDialog(post.id)"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-trash"
                    />
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!posts.length">
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

      <ConfirmDialog
        v-model:isDialogVisible="isConfirmDialogOpen"
        confirmation-msg="Bạn chắn chắn muốn xóa bài viết này ?"
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
