import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/users',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

//Retrieves the user token associated with the requestedUser based on the client's input
//username and password
export async function fetchUserToken(requestedUser) {
  try {
    const response = await apiClient.post('/token', requestedUser) 
    return response
  } catch (error) {
    throw new Error('There was an error while fetching user information: ' + error.response)
  }
}

//Attempts to create a new user with the given username and password based on the client's input
export async function registerUser(userCredentials) {
  try {
    const response = await apiClient.post('/user', userCredentials) 
    return response
  } catch (error) {
    throw new Error('There was an error while creating user: ' + error.response)
  }
}

//Gets the information associated with the logged in username
export async function fetchUserInfo(username) {
  try {
    const response = await apiClient.get('/' + username)
    return response
  } catch (error) {
    throw new Error(
      'There was an error while fetching user information: ' + error.response.statusText
    )
  }
}
