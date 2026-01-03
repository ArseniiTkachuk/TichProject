<template>
  <div class="auth">
    <div class="bg_gradient">

      <!-- MODAL: FORGOT PASSWORD -->
      <div v-if="isForgot" class="background_reg">
        <button class="btn-back" @click="isForgot = false">⬅ Назад</button>

        <h2 class="text_reg">Відновлення паролю</h2>

        <div class="description">
          <p>Введіть email</p>
        </div>

        <input type="email" v-model="email" placeholder="Email">
        <p v-if="errors.email" class="error">{{ errors.email }}</p>

        <button class="btn" @click="sendLink">Продовжити</button>

      </div>

      <div v-else class="background_reg">
        <h2 class="text_reg">Login</h2>

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
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
              viewBox="0 0 24 24">
              <path
                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm0-9a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
              <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="2" />
            </svg>
          </span>
        </div>
        <p @click="isForgot = true" class="forget">Забули пароль?</p>

        <p v-if="errors.password" class="error">{{ errors.password }}</p>
        <p v-if="result" class="error">{{ result }}</p>

        <button class="btn" @click="login">Login</button>


        <!-- Кнопка для переходу на реєстрацію -->
        <button class=" btn register-btn" @click="$router.push('/register')">Немає акаунту? Зареєструватися</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'




export default {
  data() {
    return {
      showPassword: false,
      email: "",
      password: "",
      result: null, // помилка сервера
      errors: {},    // помилки валідації

      isForgot: false
    }
  },

  methods: {
    async login() {
      this.result = null;
      this.errors = {};

      try {
        const res = await api.post(`/login`, {
          email: this.email,
          password: this.password
        });

        localStorage.setItem("tokenAuthTeacher", res.data.token);

        this.$root.showToast("Ви успішно ввійшли")

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
    },

    async sendLink() {
      try {

        const link = window.location.origin + window.location.pathname + "#/reset-password"

        const res = await api.post("/sendLink", {
          email: this.email,
          link
        })


        this.$root.showToast("Посилання надіслано")


      } catch (err) {
        console.error(err);
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap');




* {
  box-sizing: border-box;
  font-family: 'Roboto Slab', serif;
}



.description p {
  color: rgb(202, 202, 202);
  font-size: 20px;

  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* === wrapper === */
.auth {
  min-height: calc(100vh - 60px);
  /* не ламає header */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border: white;
  background: linear-gradient(135deg, #51ff0c, #0c00f8, #ff0000);
  height: 100vh;
}


/* === та сама glass-card що modal-card === */
.background_reg {
  /* background: rgba(255, 255, 255, 0.25); */
  backdrop-filter: blur(14px);
  padding: 32px 36px;
  border-radius: 22px;
  width: 100%;
  max-width: 380px;
  text-align: center;

  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.bg_gradient {
  border-radius: 22px;

  background: linear-gradient(135deg,
      #0088ff,
      #4d0cff,
      #b000f8);
  background-size: 200% 200%;
  animation: gradientMove 10s ease infinite;
  font-family: "Roboto Slab", serif;
}

/* Анімація градієнта */
@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/* === title === */
.text_reg {
  color: white;
  font-size: 24px;
  margin-bottom: 20px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* === inputs (як у modal-input) === */
.background_reg input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  font-size: 16px;
  margin-top: 12px;
  background: rgba(255, 255, 255, 0.85);
}

.background_reg input:focus {
  outline: none;
  border: 1px solid #ff00b3;
  box-shadow: 0 0 6px rgba(255, 0, 179, 0.8);
}

/* === password === */
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  margin-top: 12px;
  position: relative;
}


.password-wrapper input {
  width: 100%;
  padding-right: 46px;
  margin-top: 0;
}


.eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.eye svg {
  display: block;
}


.eye:hover {
  color: #ff00b3;
}

.forget {
  margin-top: 6px;
  padding-right: 5px;
  font-size: 14px;
  color: #fff;
  text-align: right;
  cursor: pointer;
}

.forget:hover {
  text-decoration: underline;
  color: #ff00b3;
}

/* === errors (як modal-error) === */
.error {
  margin-top: 6px;
  font-size: 14px;
  color: rgb(255, 200, 200);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}

/* === primary button (modal-btn) === */
.btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  margin-top: 18px;

  background: linear-gradient(135deg,
      #4d0cff,
      #b000f8,
      #ff00b3);
  color: white;

  transition: transform 0.3s, box-shadow 0.3s;
}

.btn:hover {
  transform: scale(1.03);
  box-shadow: 0 0 12px rgba(255, 0, 179, 0.6);
}

/* === secondary button === */
.register-btn {
  background: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
  margin-top: 12px;
}

.register-btn:hover {
  background: rgba(255, 255, 255, 0.15) !important;
}


.btn-back {
  position: absolute;
  top: 10px;
  left: 20px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #4d0cff, #b000f8);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(77, 12, 255, 0.3);
}

.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(77, 12, 255, 0.5);
}


/* === mobile === */
@media (max-width: 480px) {
  .background_reg {
    padding: 28px 22px;
  }

  .text_reg {
    font-size: 22px;
  }
}
</style>
