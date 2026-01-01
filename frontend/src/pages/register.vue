<template>
    <div class="auth">
        <VerifyEmail v-if="verify" />
        <div v-else class="bg_gradient">
            <div class="background_reg">
                <h2 class="text_reg">Register</h2>

                <input type="text" v-model="name" placeholder="Full name">
                <p v-if="errors.name" class="error">{{ errors.name }}</p>

                <input type="email" v-model="email" placeholder="Email" class="email">
                <p v-if="errors.email" class="error">{{ errors.email }}</p>

                <div class="password-wrapper">
                    <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password">
                    <span class="eye" @click="showPassword = !showPassword">
                        <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            fill="currentColor" viewBox="0 0 24 24">
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


                <p v-if="errors.password" class="error">{{ errors.password }}</p>
                <p v-if="result" class="error">{{ result }}</p>


                <button @click="register">Зареєструватися</button>

                <!-- Кнопка для переходу на логін -->
                <button class="login-btn" @click="$router.push('/login')">Вже є акаунт? Увійти</button>
            </div>
        </div>

    </div>
</template>

<script>
import api from '@/services/api'
import VerifyEmail from '@/components/VerifyEmail.vue';

export default {
    components: {
        VerifyEmail,
    },
    data() {
        return {
            showPassword: false,
            name: "",
            email: "",
            password: "",
            avatar: null,
            avatarPreview: null,
            result: null,       // помилка сервера типу message
            errors: {},          // помилки валідації 

            verify: false,
            code: "",
        }
    },

    methods: {

        async register() {
            this.result = null
            this.errors = {}

            try {

                const res = await api.post(`/register`, {
                    name: this.name,
                    email: this.email,
                    password: this.password
                })



                this.verify = true

            } catch (err) {
                console.error(err)
                this.$root.showToast("Помилка!", "error")


                // Якщо backend повернув масив помилок валідації
                if (Array.isArray(err.response?.data)) {
                    err.response.data.forEach(e => {
                        this.errors[e.path] = e.msg
                    })
                }

                // Якщо backend повернув об'єкт виду { message: "..." }
                if (err.response?.data?.message) {
                    this.result = err.response.data.message
                }
            }
        },

        async Verify() {
            try {

                const res = api.post('/verify-email', {
                    email: this.email,
                    code: this.code
                })

                localStorage.setItem("tokenAuthTeacher", res.data.token)

                this.$router.push("/home")

            } catch (err) {
                console.error(err)

                this.$root.showToast("Помилка!", "error")

                // Якщо backend повернув об'єкт виду { message: "..." }
                if (err.response?.data?.message) {
                    this.result = err.response.data.message
                }
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

/* === errors (як modal-error) === */
.error {
    margin-top: 6px;
    font-size: 14px;
    color: rgb(255, 200, 200);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}

/* === primary button (modal-btn) === */
.background_reg button {
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

.background_reg button:hover {
    transform: scale(1.03);
    box-shadow: 0 0 12px rgba(255, 0, 179, 0.6);
}

/* === secondary button === */
.login-btn {
    background: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.6) !important;
    margin-top: 12px;
}

.login-btn:hover {
    background: rgba(255, 255, 255, 0.15) !important;
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
