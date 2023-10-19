import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://10.30.30.21:8080/api/tasks',
})
