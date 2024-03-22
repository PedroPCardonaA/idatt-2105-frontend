import { defineStore } from 'pinia'
import { fetchUserToken, registerUser } from '../services/UserService'
import router from '@/router/index.js'

export const useUserStore = defineStore({
  id: 'UserStore',
  state: () => ({
    userToken: null,
    username: null
  }),
  persist: {
    //sessionStorage is used to store the userToken and username in the browser's session storage
    storage: sessionStorage
  },
  actions: {
    //Sends an api call to backend via post call which validates the user credentials (username, password)
    async logUserIn(username, password) {
      try {
        //Tries to store the response of the call to the constant 'response'
        const response = await fetchUserToken({
          username: username,
          password: password
        })
        //Occurs if the response is returned with a status code 200 (OK)
        if (response.status === 200) {
          this.userToken = response.data
          this.username = username
          router.push({ name: 'home' })
        } else {
          throw new Error(
            'The username and/or password did not match any registered users, please try again.'
          )
        }
        //Console logs errors
      } catch (error) {
        console.error(error)
        throw new Error('There was an error while creating user')
      }
    },

    //Sends an api call to backend via post call which creates a new user as well as a new user profile
    async createUserProfile(username, password, firstname, lastname, email, birthdate) {
      try {
        //Tries to store the response of the call to the constant 'response'
        const response = await registerUser({
          username: username,
          password: password,
          firstname: firstname,
          lastname: lastname,
          email: email,
          birthdate: birthdate
        })
        //Occurs if the response is returned with a status code 200 (OK)
        if (response.status === 201) {
          this.logUserIn(username, password)
        } else {
          throw new Error(
            'The username and/or password did not match any registered users, please try again.'
          )
        }
        //Console logs errors
      } catch (error) {
        console.error(error)
        throw new Error('There was an error while creating the user')
      }
    },
    //Logs the current user out, and resets state to default
    logUserOut() {
      this.userToken = null
      this.username = null
    },
    getUsername() {
      return this.username
    }
  },
  getters: {
    isLoggedIn() {
      return this.userToken != null
    }
  }
})
