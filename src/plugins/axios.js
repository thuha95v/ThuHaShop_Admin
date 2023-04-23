import axios from 'axios'

const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

axiosIns.interceptors.request.use(function (config) {
  const token = `Bearer ${localStorage.getItem("accessToken")}`
  config.headers.Authorization =  token;
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


export default axiosIns
