import axios from 'axios'
import { BASE_URL } from './url'

// 创建axios示例
const API = axios.create({
  baseURL: BASE_URL
})

export { API }
