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

/* задній фон */
.auth {
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border: white;
  background: #4b4b52;
  background: linear-gradient(
    180deg,
    #1f2423 0%,
    #242d2b 40%,
    #2e3b38 70%,
    #465c57 100% 
  );
  height: 100vh;
}


/* === та сама glass-card що modal-card === */
.background_reg {
  /* background: rgba(255, 255, 255, 0.25); */
  backdrop-filter: blur(14px);
  padding: 12px 36px 32px;
  border-radius: 22px;
  width: 100%;
  max-width: 380px;
  text-align: center;
  background: rgba(200, 200, 200, 0.073);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.35);
}

/* === inputs (як у modal-input) === */
.background_reg input {
  width: 100%;
  padding: 12px;
  margin: auto;
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: 16px;
  margin-top: 12px;
  background: #fafafa;
  transition:
    border 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.background_reg input:focus {
  outline: none;
  border: 1px solid rgba(107, 255, 179, 0.4);
  box-shadow:
    0 0 0 1px rgba(107, 255, 179, 0.4),
    0 8px 20px rgba(93, 255, 154, 0.35);
  transform: scale(1.02);
  
}


/* === title === */
.text_reg {
  color: #fafafa;
  font-size: 32px;
  margin-bottom: 20px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
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
  color: #3daa80de;
}

.forget {
  margin-top: 6px;
  padding-right: 5px;
  font-size: 14px;
  color: #fafafa;
  text-align: right;
  cursor: pointer;
}

.forget:hover {
  text-decoration: underline;
  color: #fafafa;
  text-shadow: 0px 0px 0px#fafafa;
}

/* errors (як modal-error) */
.error {
  margin-top: 6px;
  font-size: 14px;
  color: rgb(255, 200, 200);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}

/* primary button (modal-btn)  */
.btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  margin-top: 18px;
  border: 1px solid rgba(107, 255, 179, 0.4);
  background: linear-gradient(135deg, #34c98a, #1e6f50);
  color: #fafafa;

  transition: transform 0.3s, box-shadow 0.3s;
}

.btn:hover {
  transform: scale(1.02);
 box-shadow:
  0 8px 20px rgba(63, 220, 140, 0.35),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.25s ease;
  background: linear-gradient(135deg, #34c98a, #1e6f50);
}

/* === secondary button === */
.register-btn {
  background: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
  margin-top: 12px;
}

.register-btn:hover {
  background: rgba(236, 235, 235, 0.15) !important;
  box-shadow:
  0 8px 20px rgba(177, 202, 189, 0.35),
  inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
}


.btn-back {
  position: absolute;
  top: 10px;
  left: 20px;
  padding: 10px 16px;
  background: transparent;
  color: #fafafa;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s;
   box-shadow:
  0 1px 9px rgba(177, 202, 189, 0.35),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.btn-back:hover {
  background: #fafafa;
  color: #161817;
  transform: translateY(-1.5px);
/*  background: rgba(224, 224, 224, 0.09);*/
  box-shadow:
  0 6px 17px rgba(206, 224, 215, 0.35),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
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
