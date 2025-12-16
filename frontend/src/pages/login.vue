<template>
  <div class="auth">
    <h2>Login</h2>

    <input type="email" v-model="email" placeholder="Email">
    <p v-if="errors.email" class="error">{{ errors.email }}</p>

    <div class="password-wrapper">
      <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password">
      <span class="eye" @click="showPassword = !showPassword">
        <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
          viewBox="0 0 24 24">
          <path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm0-9a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13c-3.04 0-5.64-1.73-7-4.33 1.36-2.6 3.96-4.33 7-4.33 3.04 0 5.64 1.73 7 4.33-1.36 2.6-3.96 4.33-7 4.33zm0-9a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm0 9a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
        </svg>
      </span>
    </div>

    <p v-if="errors.password" class="error">{{ errors.password }}</p>

    <button @click="login">Login</button>

    <p v-if="result" class="error">{{ result }}</p>

    <!-- Кнопка для переходу на реєстрацію -->
    <button class="register-btn" @click="$router.push('/register')">Немає акаунту? Зареєструватися</button>
  </div>
</template>

<script>
import axios from "axios";

const URL = "http://localhost:2222"


export default {
  data() {
    return {
      showPassword: false,
      email: "",
      password: "",
      result: null, // помилка сервера
      errors: {}    // помилки валідації
    }
  },

  methods: {
    async login() {
      this.result = null;
      this.errors = {};

      try {
        const res = await axios.post(`${URL}/login`, {
          email: this.email,
          password: this.password
        });

        localStorage.setItem("tokenAuthTeacher", res.data.token);
        localStorage.setItem('userId', res.data.userId);

        this.$router.push('/home');

      } catch (err) {
        console.error(err);

        if (Array.isArray(err.response?.data)) {
          err.response.data.forEach(e => {
            this.errors[e.path] = e.msg;
          });
        }

        if (err.response?.data?.message) {
          this.result = err.response.data.message;
        }
      }
    }
  }
}
</script>

<style scoped>
.auth {
  display: flex;
  flex-direction: column;
  width: 360px;
  text-align: center;
  margin: 100px auto;
}
</style>
