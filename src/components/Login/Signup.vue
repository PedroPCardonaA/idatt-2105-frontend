<script setup>
import { RouterLink } from 'vue-router'
import '../../assets/css/login/signup.css'
import { useUserStore } from '@/stores/UserStore.js'
import { ref, computed } from 'vue'

const userStore = useUserStore()

const error = ref('')
const username = ref(null)
const password = ref(null)
const confirmPassword = ref(null)
const firstName = ref(null)
const lastName = ref(null)
const email = ref(null)
const birthDate = ref(null)

const matchingPasswords = computed(() => password.value === confirmPassword.value)

const isEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

const checkInputs = computed(() => {
  const setErrorFor = (input, message) => {
    error.value = message
  }

  if (username.value == '') {
    setErrorFor(username, 'Username cannot be blank')
    return false
  }

  if (password.value == '') {
    setErrorFor(password, 'Password cannot be blank')
    return false
  }

  // Check if password is at least 8 characters
  if (password.value.length < 8) {
    setErrorFor(password, 'Password must be at least 8 characters')
    return false
  }

  if (confirmPassword.value == '') {
    setErrorFor(confirmPassword, 'Confirm password cannot be blank')
    return false
  }

  if (firstName.value == '') {
    setErrorFor(firstName, 'First name cannot be blank')
    return false
  }

  if (lastName.value == '') {
    setErrorFor(lastName, 'Last name cannot be blank')
    return false
  }

  if (email.value == '') {
    setErrorFor(email, 'Email cannot be blank')
    return false
  } else if (!isEmail(email.value)) {
    setErrorFor(email, 'Not a valid email')
    return false
  }

  if (birthDate.value == '') {
    setErrorFor(birthDate, 'Birth date cannot be blank')
    return false
  }

  return true
})

async function handleSubmit() {
  try {
    if (!checkInputs.value) {
      console.log('Something went wrong')
      return
    }
  } catch (error) {
    error.value = 'Please fill in all fields'
    console.log(error)
    return
  }

  if (matchingPasswords.value) {
    try {
      await userStore.createUserProfile(
        username.value,
        password.value,
        firstName.value,
        lastName.value,
        email.value,
        birthDate.value
      )
    } catch (error) {
      error.value = error.message
    }
  } else {
    error.value = 'Passwords do not have matching values'
  }
}

</script>

<template>
  <div class="loginContainer">
    <RouterLink to="/" class="logo-container">
      <img src="@/assets/img/logo.png" alt="logo" />
      <h1>tokenly</h1>
    </RouterLink>
    <div class="login">
      <form @submit.prevent="handleSubmit()">
        <div>
          <input type="text" :placeholder="$t('First Name')" v-model="firstName" />
          <input type="text" :placeholder="$t('Last Name')" v-model="lastName" />
        </div>
        <input
          class="largeInput"
          type="text"
          :placeholder="$t('Username min6chars')"
          v-model="username"
        />
        <input class="largeInput" type="text" placeholder="Email" v-model="email" />
        <div>
          <input type="password" :placeholder="$t('Password')" v-model="password" />
          <input type="password" :placeholder="$t('Confirm Password')" v-model="confirmPassword" />
        </div>
        <div>
          <input type="date" v-model="birthDate" />
        </div>
        <button type="submit">{{ $t('Sign up') }}</button>
        <p class="error" v-if="error">{{ error }}</p>
      </form>
      <p>
        {{ $t('Already registered?') }}
        <RouterLink to="/login"> {{ $t('Login') }} </RouterLink>
      </p>
    </div>
  </div>
</template>
