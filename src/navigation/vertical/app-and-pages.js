export default [
  { heading: 'Quản lý' },
  {
    title: 'Quản lý thể loại',
    icon: { icon: 'tabler-category' },
    // to: 'apps-email',
    children: [
      { title: 'Danh sách', to: 'categories-list' },
      { title: 'Tạo mới', to: { name: 'categories-create' } },
      // { title: 'Sửa', to: { name: 'categories-edit-id', params: { id: '5036' } } },
    ],
  },
  {
    title: 'Quản lý người dùng',
    icon: { icon: 'tabler-user' },
    children: [
      { title: 'Danh sách', to: 'users-list' },
    ],
  },
  {
    title: 'Quản lý sản phẩm',
    icon: { icon: 'tabler-diamond' },
    children: [
      { title: 'Danh sách', to: 'products-list' },
      { title: 'Chi tiết', to: { name: 'products-detail-id', params: { id: '1' } } },
      { title: 'Tạo mới', to: { name: 'products-create' } },
      { title: 'Sửa', to: { name: 'products-update-id', params: { id: '5036' } } },
    ],
  },
  {
    title: 'Quản lý đơn hàng',
    icon: { icon: 'tabler-shopping-bag' },
    children: [
      { title: 'Danh sách', to: 'orders-list' },
    ],
  },
  {
    title: 'Quản lý bài viết',
    icon: { icon: 'tabler-article' },
    children: [
      { title: 'Danh sách', to: 'posts-list' },
      { title: 'Tạo mới', to: { name: 'posts-create' } },
      // { title: 'Sửa', to: { name: 'posts-update-id', params: { id: '5036' } } },
    ],
  },
  {
    title: 'Quản lý banner',
    icon: { icon: 'tabler-ad-filled' },
    children: [
      { title: 'Danh sách', to: 'banners-list' },
      { title: 'Chi tiết', to: { name: 'banners-detail-id', params: { id: '1' } } },
      { title: 'Tạo mới', to: { name: 'banners-create' } },
      { title: 'Sửa', to: { name: 'banners-update-id', params: { id: '5036' } } },
    ],
  },
  {
    title: 'Quản lý chiến dịch',
    icon: { icon: 'tabler-link' },
    children: [
      { title: 'Danh sách', to: 'apps-invoice-list' },
      { title: 'Tạo mới', to: { name: 'apps-invoice-preview-id', params: { id: '5036' } } },
      { title: 'Sửa', to: { name: 'apps-invoice-edit-id', params: { id: '5036' } } },
      { title: 'Xóa', to: 'apps-invoice-add' },
    ],
  },
  {
    title: 'Quản lý kho',
    icon: { icon: 'tabler-building-warehouse' },
    children: [
      { title: 'Danh sách', to: 'inventories-list' },
      
    ],
  },
]
