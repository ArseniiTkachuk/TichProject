<template>
    <div class="verify">
        <div class="background_reg">
            <h2 class="title">Код надісланий</h2>
            <div class="description">
                <p>Ми надіслали код підтвердження на email: <strong>{{ email }}</strong> </p>
                <p>Введіть код підтвердження нище.</p>
            </div>

            <!-- <input type="text" v-model="code" placeholder="Code"> -->
            <div class="code-input">
                <input v-for="(digit, i) in code" :key="i" ref="inputs" v-model="code[i]" maxlength="1"
                    inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" @input="onInput(i, $event)"
                    @keydown.backspace="onBackspace(i)" @paste="onPaste" />
            </div>

            <p v-if="error" class="error">{{ error }}</p>

            <div class="btn_bn_wrap">
                <button @click="ChanchEmail" class="btn_bn">⬅ Повернутися назад</button>
                <button @click="sendCode"class="btn_bn">Надіслати код знову</button>
            </div>


            <button @click="Verify" class="btn">Підтвердити email</button>
        </div>

    </div>

</template>
<script>
import api from '@/services/api';

export default {
    props: {
        email: {
            type: String,
            required: true
        },
    },

    data() {
        return {
            code: Array(6).fill(""),
            error: "",
        }
    },

    methods: {
        async Verify() {
            try {
                const codeUser = this.code.join("")
                console.log(codeUser)
                if (codeUser.length < 6) {
                    this.error = "Код повинен складатися з 6 символів"
                    return
                } else {
                    this.error = ""
                }

                const res = await api.post('/verify-email', {
                    email: this.email,
                    code: codeUser
                })

                localStorage.setItem("tokenAuthTeacher", res.data.token)

                this.$root.showToast("Ви успішно зареєстувалися")

                this.$router.push("/home")

            } catch (err) {
                console.error(err)
                // Якщо backend повернув об'єкт виду { message: "..." }
                if (err.response?.data?.message) {
                    this.error = err.response.data.message
                }
            }
        },

        ChanchEmail() {
            this.$emit('chanch', false);
        },

        onInput(index, e) {
            const value = e.target.value.replace(/\D/g, "")
            this.code[index] = value

            if (value && index < 5) {
                this.$refs.inputs[index + 1].focus()
            }
        },

        onBackspace(index, e) {
            if (!this.code[index] && index > 0) {
                this.$refs.inputs[index - 1].focus()
            }
        },

        onPaste(e) {
            e.preventDefault()
            const paste = (e.clipboardData || window.clipboardData).getData('text')
            const digits = paste.replace(/\D/g, '').slice(0, 6) // тільки цифри, максимум 6

            // Заповнюємо масив code
            digits.split('').forEach((num, i) => {
                this.code[i] = num
            })

            // Фокус на наступний порожній інпут
            const firstEmpty = this.code.findIndex(c => c === "")
            if (firstEmpty !== -1) {
                this.$refs.inputs[firstEmpty].focus()
            } else {
                this.$refs.inputs[5].focus()
            }
        },


        async sendCode() {
            try {

                const res = await api.post("/sendCode", {
                    email: this.email,
                })

                this.$root.showToast("Код надіслано")


            } catch (err) {

                console.error(err)

                // Якщо backend повернув об'єкт виду { message: "..." }
                if (err.response?.data?.message) {
                    this.error = err.response.data.message
                }

            }
        }
    }
}

</script>

<style scoped>
.code-input {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.code-input input {
    width: 48%;
    height: 56px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    border-radius: 10px;
    border: 2px solid #ccc;
    transition: 0.2s;
}

.code-input input:focus {
    outline: none;
    border: 1px solid rgba(107, 255, 179, 0.4);
    box-shadow:
    0 0 0 1px rgba(107, 255, 179, 0.4),
    0 8px 20px rgba(93, 255, 154, 0.35);
}

.error {
    margin-top: 6px;
    font-size: 14px;
    color: rgb(255, 200, 200);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}

/* === title === */
.title {
    color: white;
    font-size: 24px;
    margin-bottom: 20px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.description p {
    color: rgb(202, 202, 202);
    font-size: 20px;

    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}


.background_reg {
    backdrop-filter: blur(14px);
    padding: 32px 36px;
    border-radius: 22px;
    width: 100%;
    max-width: 380px;
    text-align: center;

    background: rgba(200, 200, 200, 0.073);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.35);
}


.btn {
    width: 100%;
    font-size: 16px;
    border-radius: 12px;
    cursor: pointer;
    border: none;
    margin-top: 16px;
    border: 1px solid rgba(107, 255, 179, 0.4);
    background: linear-gradient(135deg, #34c98a, #1e6f50);
    color: #fafafa;
    padding: 12px;

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


.btn_bn_wrap {
    display: flex;
    gap: 12px;
}


.btn_bn {
    flex: 1;
    padding: 12px;
    font-size: 16px;
    border-radius: 12px;
    cursor: pointer;
    border: none;
    margin-top: 28px;

   background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.6);
    color: #fafafa;

    transition: transform 0.3s, box-shadow 0.3s;
}

.btn_bn:hover {
    transform: scale(1.02);
    background: rgba(236, 235, 235, 0.15) ;
    box-shadow:
    0 8px 20px rgba(177, 202, 189, 0.35),
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


    .code-input input {
        height: 45px;
        font-size: 20px;
    }
}
</style>