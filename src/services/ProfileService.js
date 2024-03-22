import axios from 'axios'
import { useUserStore } from '@/stores/UserStore.js'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/profiles',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

//Gets the information associated with the logged in username
export async function fetchUserProfile(username) {
    try {
      const response = await apiClient.get('/profile/username/' + username)
      return response
    } catch (error) {
      throw new Error(
        "Insufficinet funds"
      )
  }
}

//Changes the balance of the user
export async function addBalance(userId, balance) {
  try {
    const response = await apiClient.put('/profile/' + userId + '/addBalance?balance=' + balance, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + useUserStore().userToken
      }
  })
    return response
  } catch (error) {
    throw new Error(
      'There was an error while changing the balance: ' + error.response.statusText
    )
  }
}

export async function changeUserPassword(oldPassword, newPassword) {
  try {
    console.log(useUserStore().username)
    const response = await apiClient.put('/profile/' + useUserStore().username + '/password?oldPassword=' + oldPassword + '&newPassword=' + newPassword, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + useUserStore().userToken
      }
  })
    return response
  } catch (error) {
    throw new Error(
      'There was an error while changing the password: ' + error.response.statusText
    )
  }
}

export async function checkIfAdmin() {
  try {
    const response = await apiClient.get('/profile/isAdmin/' + useUserStore().username, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + useUserStore().userToken
      }
  })
    return response
  } catch (error) {
    throw new Error(
      'There was an error while checking if the user is an admin: ' + error.response.statusText
    )
  }
}
