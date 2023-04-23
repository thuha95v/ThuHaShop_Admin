import { defineStore } from 'pinia'
import axios from '@axios'

export const useOrderStore = defineStore('OrderStore', {
  actions: {
    // 👉
    fetchOrders(params) {
      return axios.get('/api/admin/v1/orders', { params })
    },

    updateOrder(id, data){
      return axios.put(`/api/admin/v1/orders/${id}`, data)
    },

    fetchOrder(id){
      return axios.get(`/api/admin/v1/orders/${id}`)
    }
    // fetchCategory(id) {
    //   return axios.get(`/api/admin/v1/categories/${id}`)
    // },
    
    // createCategory(data){
    //   return axios.post('/api/admin/v1/categories', data)
    // },

    // // 👉 
    // updateCategory(id, data) {
    //   return axios.put(`/api/admin/v1/categories/${id}`, data)
    // },

    // deleteCategory(id){
    //   return axios.delete(`/api/admin/v1/categories/${id}`)
    // }
  },
})
