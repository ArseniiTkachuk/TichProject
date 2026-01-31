<template>
    <div class="auth">
        <div class="bg_gradient">
            <div class="background_reg">
                <h2 class="text_reg">Відновлення паролю</h2>

                <p class="subtitle">
                    Введіть новий пароль для вашого акаунта
                </p>

                <div class="password-wrapper">
                    <input class="input" :type="showPassword1 ? 'text' : 'password'" v-model="password"
                        placeholder="Новий пароль">
                    <span class="eye" @click="showPassword1 = !showPassword1">
                        <svg v-if="!showPassword1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
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

                <div class="password-wrapper">
                    <input class="input" :type="showPassword2 ? 'text' : 'password'" v-model="confirmPassword"
                        placeholder="Повторіть пароль">
                    <span class="eye" @click="showPassword2 = !showPassword2">
                        <svg v-if="!showPassword2" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
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

                <button class="btn" @click="submit">
                    Змінити пароль
                </button>

                <p v-if="error" class="error">{{ error }}</p>

                <router-link to="/login" class="login-btn">
                    ← Повернутися до входу
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/services/api';

export default {
    data() {
        return {
            showPassword1: false,
            showPassword2: false,
            password: "",
            confirmPassword: "",
            error: "",
            success: false,
            token: null,
        };
    },

    created() {
        this.token = this.$route.query.token;

        if (!this.token) {
            this.error = "Посилання недійсне або пошкоджене";
        }
    },

    methods: {
        async submit() {
            this.error = "";
            if (!this.password || !this.confirmPassword) {
                this.error = "Заповніть усі поля";
                return;
            }

            if (this.password.length < 6) {
                this.error = "Пароль має містити мінімум 6 символів";
                return;
            }

            if (this.password !== this.confirmPassword) {
                this.error = "Паролі не співпадають";
                return;
            }

            try {

                await api.post("/auth/reset-password", {
                    token: this.token,
                    newPassword: this.password,
                });

                this.$root.showToast("Пароль успішно оновлено")
                this.$router.push('/login')
            } catch (e) {
                this.error =
                    e.response?.data?.message || "Не вдалося змінити пароль";
            }
        },
    },
};
</script>

<style scoped>
/* ==== base font ==== */
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap');

* {
    box-sizing: border-box;
    font-family: 'Roboto Slab', serif;
}

/* === wrapper === */
.auth {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, #51ff0c, #0c00f8, #ff0000);
}

/* === gradient card === */
.bg_gradient {
    border-radius: 22px;
    background: linear-gradient(135deg, #0088ff, #4d0cff, #b000f8);
    background-size: 200% 200%;
    animation: gradientMove 10s ease infinite;
}

/* === glass card === */
.background_reg {
    backdrop-filter: blur(14px);
    padding: 32px 36px;
    border-radius: 22px;
    width: 100%;
    max-width: 380px;
    text-align: center;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.35);
}

/* title */
.text_reg {
    color: white;
    font-size: 24px;
    margin-bottom: 12px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.subtitle {
    font-size: 14px;
    color: #9bb0c9;
    margin-bottom: 20px;
}

/* inputs */
.input {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    font-size: 16px;
    margin-top: 12px;
    background: rgba(255, 255, 255, 0.85);
}

.input:focus {
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


/* primary button */
.btn {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border-radius: 12px;
    cursor: pointer;
    border: none;
    margin-top: 18px;
    background: linear-gradient(135deg, #4d0cff, #b000f8, #ff00b3);
    color: white;
    transition: transform 0.3s, box-shadow 0.3s;
}

.btn:hover {
    transform: scale(1.03);
    box-shadow: 0 0 12px rgba(255, 0, 179, 0.6);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* errors & success */
.error {
    margin-top: 12px;
    color: #ff6b6b;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
    font-size: 14px;
}

.success {
    margin-top: 12px;
    color: #4cd964;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
    font-size: 14px;
}

/* secondary link button */
.login-btn {
    display: block;
    margin-top: 20px;
    text-align: center;
    color: #9bb0c9;
    text-decoration: none;
    font-size: 14px;
}

.login-btn:hover {
    color: #ffffff;
}

/* gradient animation */
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

/* mobile */
@media (max-width: 480px) {
    .background_reg {
        padding: 28px 22px;
    }

    .text_reg {
        font-size: 22px;
    }
}
</style>
