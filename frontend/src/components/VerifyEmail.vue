<template>
    <div class="verify">
        <div class="background_reg">
            <h2 class="title">Код надіслани</h2>
            <div class="description">
                <p>Ми надіслали код підтвердження на email: <strong>{{ email }}</strong>. </p>
                <p>Введіть код підтвердження нище.</p>
            </div>

            <!-- <input type="text" v-model="code" placeholder="Code"> -->
            <div class="code-input">
                <input v-for="(digit, i) in code" :key="i" ref="inputs" v-model="code[i]" maxlength="1"
                    inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" @input="onInput(i, $event)"
                    @keydown.backspace="onBackspace(i)" />
            </div>

            <p v-if="error" class="error">{{ error }}</p>

            <div class="btn">
                <button @click="ChanchEmail">Змінити email</button>
                <button>Надіслати код знову</button>
            </div>


            <button @click="Verify">Підтвердити email</button>
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
                if (this.code.join("").length < 6) {
                    this.error = "Код повинен складатися з 6 символів"
                    return
                } else {
                    this.error = ""
                }

                const res = await api.post('/verify-email', {
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
                    this.error = err.response.data.message
                }
            }
        },

        ChanchEmail() {
            this.$emit('chanch', false );
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

        getCode() {
            return this.code.join("")
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
    border-color: #ff00b3;
    box-shadow: 0 0 8px rgba(255, 0, 179, 0.6);
    outline: none;
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

    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.35);
}



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

.btn {
    padding: 2px;
    display: flex;
    gap: 10px;
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