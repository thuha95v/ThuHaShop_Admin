import { defineStore } from 'pinia'
import axios from '@axios'

export const useCategoryStore = defineStore('CategoryStore', {
  actions: {
    // 👉 Fetch all Invoices
    fetchCategories(params) {
      return axios.get('/api/v1/categories', { params })
    },

    fetchCategory(id) {
      return axios.get(`/api/admin/v1/categories/${id}`)
    },
    
    createCategory(data){
      return axios.post('/api/admin/v1/categories', data)
    },

    // 👉 
    updateCategory(id, data) {
      return axios.put(`/api/admin/v1/categories/${id}`, data)
    },

    deleteCategory(id){
      return axios.delete(`/api/admin/v1/categories/${id}`)
    }
  },
})
