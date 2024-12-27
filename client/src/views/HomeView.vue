<template>
  <div class="auth-test">
    <h1>Authentication Test</h1>

    <div class="auth-forms">
      <div class="form-container">
        <h2>Sign Up</h2>
        <form @submit.prevent="signup">
          <input v-model="signupForm.username" placeholder="Username" required />
          <input v-model="signupForm.email" type="email" placeholder="Email" required />
          <input v-model="signupForm.password" type="password" placeholder="Password" required />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div class="form-container">
        <h2>Sign In</h2>
        <form @submit.prevent="signin">
          <input v-model="signinForm.username" placeholder="Username" required />
          <input v-model="signinForm.password" type="password" placeholder="Password" required />
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>

    <div v-if="user" class="user-info">
      <h2>User Info</h2>
      <p><strong>Username:</strong> {{ user.username }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Roles:</strong> {{ user.roles.join(', ') }}</p>
      <button @click="refreshToken">Refresh Token</button>
      <button @click="testUserAccess">Test User Access</button>
      <button @click="testAdminAccess">Test Admin Access</button>
      <button @click="testReadPermission">Test Read Permission</button>
      <button @click="testWritePermission">Test Write Permission</button>
    </div>

    <div class="message" :class="{ error: isError }">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

const signupForm = reactive({
  username: '',
  email: '',
  password: '',
})

const signinForm = reactive({
  username: '',
  password: '',
})

const user = ref(null)
const message = ref('')
const isError = ref(false)

const setMessage = (msg, error = false) => {
  message.value = msg
  isError.value = error
}

const signup = async () => {
  try {
    await axios.post(`${API_URL}/auth/signup`, signupForm)
    setMessage('User registered successfully!')
  } catch (error) {
    setMessage(error.response.data.message, true)
  }
}

const signin = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/signin`, signinForm)
    user.value = response.data
    localStorage.setItem('accessToken', response.data.accessToken)
    localStorage.setItem('refreshToken', response.data.refreshToken)
    setMessage('User signed in successfully!')
  } catch (error) {
    setMessage(error.response.data.message, true)
  }
}

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    const response = await axios.post(`${API_URL}/auth/refreshtoken`, { refreshToken })
    localStorage.setItem('accessToken', response.data.accessToken)
    setMessage('Token refreshed successfully!')
  } catch (error) {
    setMessage(error.response.data.message, true)
  }
}

const testUserAccess = async () => {
  try {
    const response = await axios.get(`${API_URL}/test/user`, {
      headers: { 'x-access-token': localStorage.getItem('accessToken') },
    })
    setMessage(response.data.message)
  } catch (error) {
    setMessage(error.response.data.message, true)
  }
}

const testAdminAccess = async () => {
  try {
    const response = await axios.get(`${API_URL}/test/admin`, {
      headers: { 'x-access-token': localStorage.getItem('accessToken') },
    })
    setMessage(response.data.message)
  } catch (error) {
    setMessage(error.response.data.message, true)
  }
}

const testWritePermission = async () => {
  try {
    const response = await axios.get(`${API_URL}/test/write`, {
      headers: { 'x-access-token': localStorage.getItem('accessToken') },
    })
    setMessage(response.data.message)
  } catch (error) {
    setMessage(error.response.data.message, true)
  }
}
const testReadPermission = async () => {
  try {
    const response = await axios.get(`${API_URL}/test/read`, {
      headers: { 'x-access-token': localStorage.getItem('accessToken') },
    })
    setMessage(response.data.message)
  } catch (error) {
    setMessage(error.response.data.message, true)
  }
}
</script>

<style scoped>
.auth-test {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.auth-forms {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.form-container {
  width: 45%;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  margin-bottom: 10px;
  padding: 8px;
  font-size: 16px;
}

button {
  padding: 10px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.user-info {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.message {
  padding: 10px;
  background-color: #dff0d8;
  border: 1px solid #d6e9c6;
  color: #3c763d;
  border-radius: 4px;
}

.message.error {
  background-color: #f2dede;
  border-color: #ebccd1;
  color: #a94442;
}
</style>
