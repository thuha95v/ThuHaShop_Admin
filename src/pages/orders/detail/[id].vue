<script setup>
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

// Components
import InvoiceAddPaymentDrawer from '@/views/apps/invoice/InvoiceAddPaymentDrawer.vue'
import InvoiceSendInvoiceDrawer from '@/views/apps/invoice/InvoiceSendInvoiceDrawer.vue'

// Store
import { useOrderStore } from '@/views/order/useOrderStore'

const orderStore = useOrderStore()
const route = useRoute()
const orderData = ref()
const priceTotal = ref(0)
const isAddPaymentSidebarVisible = ref(false)
const isSendPaymentSidebarVisible = ref(false)

// 👉 fetchInvoice
orderStore.fetchOrder((route.params.id)).then(res => {

  console.log(res.data.data);
  orderData.value = res.data.data
  let total = 0;
  for (const p of res.data.data.products) {
    total += p.quantity * p.product.price;
  }

  priceTotal.value = total
  // invoiceData.value = response.data.invoice
  // paymentDetails.value = response.data.paymentDetails
}).catch(error => {
  console.log(error)
})

// ℹ️ Your real data will contain this information
const purchasedProducts = [
  {
    name: 'Premium Branding Package',
    description: 'Branding & Promotion',
    qty: 1,
    hours: 15,
    price: 32,
  },
  {
    name: 'SMM',
    description: 'Social media templates',
    qty: 1,
    hours: 14,
    price: 28,
  },
  {
    name: 'Web Design',
    description: 'Web designing package',
    qty: 1,
    hours: 12,
    price: 24,
  },
  {
    name: 'SEO',
    description: 'Search engine optimization',
    qty: 1,
    hours: 5,
    price: 22,
  },
]

const enumPayMethod = {
  "cash": "Tiền mặt",
  "bank": "Ngân hàng"
}

// 👉 Print Invoice
const printInvoice = () => {
  window.print()
}
</script>

<template>
  <section v-if="orderData">
    <VRow>
      <VCol
        cols="12"
        md="9"
      >
        <VCard>
          <!-- SECTION Header -->
          <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row print-row">
            <!-- 👉 Left Content -->
            <div class="ma-sm-4">
              <div class="d-flex align-center mb-6">
                <!-- 👉 Logo -->
                <VNodeRenderer
                  :nodes="themeConfig.app.logo"
                  class="me-3"
                />

                <!-- 👉 Title -->
                <h6 class="font-weight-bold text-xl">
                  {{ themeConfig.app.title }}
                </h6>
              </div>

              <!-- 👉 Address -->
              <p class="mb-0">
                Trường ĐHCN Hà Nội, Nhổn - Từ Liêm
              </p>
              <p class="mb-0">
                ThuHa Shop
              </p>
              <p class="mb-0">
                0989999999
              </p>
            </div>

            <!-- 👉 Right Content -->
            <div class="mt-4 ma-sm-4">
              <!-- 👉 Invoice ID -->
              <h6 class="font-weight-medium text-xl mb-6">
                Hóa đơn số #{{ orderData.id.slice(0,8) }}
              </h6>

              <!-- 👉 Issue Date -->
              <p class="mb-2">
                <span>Ngày tạo: </span>
                <span class="font-weight-semibold">{{ orderData.updatedAt }}</span>
              </p>

              
            </div>
          </VCardText>
          <!-- !SECTION -->

          <VDivider />

          <!-- 👉 Payment Details -->
          <VCardText class="d-flex justify-space-between flex-wrap flex-column flex-sm-row print-row">
            <div class="ma-sm-4">
              <h6 class="text-sm font-weight-semibold mb-3">
                Khách hàng:
              </h6>
              <p class="mb-1">
                {{ orderData.fullname }}
              </p>
              <p class="mb-1">
                {{ orderData.address }}
              </p>
              <p class="mb-1">
                {{ orderData.email }}
              </p>
              <p class="mb-1">
                {{ orderData.phone }}
              </p>
            </div>

            <div class="mt-4 ma-sm-4">
              <h6 class="text-sm font-weight-semibold mb-3">
                Thông tin thanh toán:
              </h6>
              <table>
                <tr>
                  <td class="pe-6">
                    Phương thức:
                  </td>
                  <td>
                    {{ enumPayMethod[orderData.pay_method] }}
                  </td>
                </tr>
                <tr v-if="orderData.pay_method == 'bank'">
                  <td class="pe-6">
                    Ngân hàng:
                  </td>
                  <td>
                    NCB
                  </td>
                </tr>
              </table>
            </div>
          </VCardText>

          <!-- 👉 Table -->
          <VDivider />

          <VTable>
            <thead>
              <tr>
                <th scope="col">
                  SẢN PHẨM
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  SỐ LƯỢNG
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  TỔNG TIỀN
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="item in orderData.products"
                :key="item.name"
              >
                <td class="text-no-wrap">
                  {{ item.product.name }}
                </td>
                <td class="text-center">
                  {{ item.quantity }}
                </td>
                <td class="text-center">
                  {{ (item.product.price * item.quantity).toLocaleString('it-IT', {style : 'currency', currency : 'VND'}) }}
                </td>
              </tr>
            </tbody>
          </VTable>

          <VDivider class="my-2" />

          <!-- Total -->
          <VCardText class="d-flex justify-space-between flex-column flex-sm-row print-row">
            <div class="my-2 mx-sm-4">
              <div class="d-flex align-center mb-1">
                <h6 class="text-sm font-weight-semibold me-1">
                  
                </h6>
                <span></span>
              </div>
              <p></p>
            </div>

            <div class="my-2 mx-sm-4">
              <table>
                <tr>
                  <td class="text-end">
                    <div class="me-5">
                      <p class="mb-2">
                        Tạm tính:
                      </p>
                      <p class="mb-2">
                        Giảm giá:
                      </p>
                      <p class="mb-2">
                        Thuế VAT:
                      </p>
                      <p class="mb-2">
                        Tổng tiền:
                      </p>
                    </div>
                  </td>

                  <td class="font-weight-semibold">
                    <p class="mb-2">
                      {{ priceTotal.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}) }}
                    </p>
                    <p class="mb-2">
                      0 VND
                    </p>
                    <p class="mb-2">
                      0 VND
                    </p>
                    <p class="mb-2">
                      {{ priceTotal.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}) }}
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          </VCardText>

          <VDivider />

          <VCardText>
            <div class="d-flex mx-sm-4">
              <h6 class="text-sm font-weight-semibold me-1">
                Ghi chú:
              </h6>
              <span>{{ orderData.note }}</span>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="3"
        class="d-print-none"
      >
        <VCard>
          <VCardText>
            <VBtn
              block
              variant="tonal"
              color="secondary"
              class="mb-2"
            >
              Tải xuống
            </VBtn>

            <VBtn
              block
              variant="tonal"
              color="secondary"
              class="mb-2"
              @click="printInvoice"
            >
              In hóa đơn
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 👉 Add Payment Sidebar -->
    <InvoiceAddPaymentDrawer v-model:isDrawerOpen="isAddPaymentSidebarVisible" />

    <!-- 👉 Send Invoice Sidebar -->
    <InvoiceSendInvoiceDrawer v-model:isDrawerOpen="isSendPaymentSidebarVisible" />
  </section>
</template>

<style lang="scss">
@media print {
  .v-application {
    background: none !important;
  }

  @page { margin: 0; size: auto; }

  .layout-page-content,
  .v-row,
  .v-col-md-9 {
    padding: 0;
    margin: 0;
  }

  .product-buy-now {
    display: none;
  }

  .v-navigation-drawer,
  .layout-vertical-nav,
  .app-customizer-toggler,
  .layout-footer,
  .layout-navbar,
  .layout-navbar-and-nav-container {
    display: none;
  }

  .v-card {
    box-shadow: none !important;

    .print-row {
      flex-direction: row !important;
    }
  }

  .layout-content-wrapper {
    padding-inline-start: 0 !important;
  }
}
</style>
