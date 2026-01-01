<template>
    <div class="verify">
        <div class="background_reg">
            <h2 class="title">Код надіслани</h2>
            <div class="description">
                <p>Ми надіслали код підтвердження на email: <strong>{{ email }}</strong>. </p>
                <p>Введіть код підтвердження нище.</p>
            </div>

            <input type="text" v-model="code" placeholder="Code">
            <p v-if="error" class="error">{{ error }}</p>

            <button @click="Verify">Підтвердити</button>
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
            code: "",
            error: "",
        }
    },

    methods: {
        async Verify() {
            try {
                if (this.code.length < 6) {
                    this.error = "Код повинен складатися з 6 символів"
                } else {
                    this.error = ""
                }

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