import axios from 'axios'

// import { responseCodeMap } from './constant'

axios.defaults.baseURL = 'http://47.101.181.233:8000'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// axios.interceptors.request.use(config => {
//   const token = localStorage.getItem('nike#token')
//   if (token) {
//     config.headers.token = token
//   }
//   return config
// })

// axios.interceptors.response.use(response => {
//   const { data } = response
//   if (data && data.status !== 200) {
//     const error = new Error(data.message)
//     error.response = response
//     return Promise.reject(error)
//   }

//   return response
// })
