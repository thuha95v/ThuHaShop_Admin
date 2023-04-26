import { defineStore } from 'pinia'
import axios from '@axios'

export const usePostStore = defineStore('PostStore', {
  actions: {
    // 👉 Fetch all Invoices
    fetchPosts(params) {
      return axios.get('/api/admin/v1/posts', { params })
    },

    fetchPost(id) {
      return axios.get(`/api/admin/v1/posts/${id}`)
    },

    createPost(data){
      const form = new FormData();
      for(const key in data){
        if(key == 'thumbnail'){
          form.append(key, data[key][0]);
        } else if(key == 'tags'){
          form.append(key, JSON.stringify(data[key].split(",")));
        }
        else {
          console.log(data[key]);
          form.append(key, data[key]);
        }
      }

      return axios.post("/api/admin/v1/posts", form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },

    updateById(id, data){
      // const form = new FormData();
      // for(const key in data){
      //   if(key == 'thumbnail'){
      //     form.append(key, data[key][0]);
      //   } else {
      //     console.log(data[key]);
      //     form.append(key, data[key]);
      //   }
      // }

      let dataUpdate = Object.assign({}, data)
      if(dataUpdate.thumbnail?.length == 0){
        delete dataUpdate.thumbnail
      }

      dataUpdate.tags = dataUpdate.tags.split(",")
      return axios.put(`/api/admin/v1/posts/${id}`, dataUpdate)
    },
    deleteById(id){
      return axios.delete(`/api/admin/v1/posts/${id}`)
    }
  },
})
