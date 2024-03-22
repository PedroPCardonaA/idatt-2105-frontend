import axios from 'axios'
import { useUserStore } from '@/stores/UserStore.js'

const userStore = useUserStore()

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/source',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export async function getSource() {
  const response = await apiClient.get('', {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + useUserStore().userToken
    }
})
  return response
}
export async function postFile(file) {
  const response = await apiClient.post('post', file, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${userStore.userToken}`
    }
  })
  return response
}
