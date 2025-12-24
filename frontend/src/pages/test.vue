<template>
    <div v-if="correctTestCode" class="test-wrapper">

        <!-- HEADER -->
        <header class="test-header">
            <h1 class="test-title">{{ test.title }}</h1>
            <div class="test-progress">
                Питання {{ currentIndex + 1 }} / {{ test.exercises.length }}
            </div>
        </header>

        <!-- PROGRESS BAR -->
        <div class="progress-wrapper">
            <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
        </div>

        <div v-if="isName && test.exercises.length > 0">
            <answers v-if="['one', 'many'].includes(currentEx.type)" :key="currentEx" :ex="currentEx"
                :currentId="currentIndex" @answered="saveAnswer" />

            <pairs v-else-if="currentEx.type === 'pair'" :ex="currentEx" @answered="saveAnswer"
                @ISAnswer="isanswer = $event" :key="currentEx.slug" />

            <enters v-else-if="currentEx.type === 'enter'" :ex="currentEx" @answered="saveAnswer" :key="currentIndex" />

            <div class="answer-buttons">
                <button v-if="currentIndex === test.exercises.length - 1" :disabled="!isAnswer" @click="finishTest">
                    Завершити тест
                </button>
                <button v-else @click="currentIndex++" :disabled="!isAnswer">
                    Далі
                </button>
            </div>


        </div>



        <!-- MODAL: ENTER NAME -->
        <div v-if="!isName" class="modal-overlay">
            <div class="modal-card">
                <h2 class="modal-title">Введіть ваше імʼя</h2>

                <input v-model="fullName" placeholder="Ваше імʼя" class="modal-input" />

                <p v-if="error" class="modal-error">{{ error }}</p>

                <button class="modal-btn" @click="StartTest">
                    Почати тест
                </button>
            </div>
        </div>

    </div>
    <!-- MODAL: WRONG CODE -->
    <div v-if="!correctTestCode" class="modal-overlay">
        <div class="modal-card">
            <h2 class="modal-title">❌ Невірний код тесту</h2>

            <p class="modal-text">
                Тест з таким кодом не знайдено або він недоступний
            </p>

            <button class="modal-btn" @click="goBack">
                ⬅ Повернутися назад
            </button>
        </div>
    </div>

</template>
<script>
import axios from 'axios';

import answers from '@/components/answers.vue';
import pairs from '@/components/pairs.vue';
import enters from '@/components/enters.vue';

const BackURL = "http://localhost:2222"

export default {
    components: {
        answers,
        pairs,
        enters
    },

    data() {
        return {
            testId: null,
            isanswer: true,
            currentIndex: 0,
            // відповіді користувача
            userAnswers: {},


            correctTestCode: false,

            isName: false,
            fullName: '',
            error: null,

            test: {}

        }

    },

    computed: {
        currentEx() {
            return this.test.exercises[this.currentIndex];
        },

        isAnswer() {
            return (
                !!this.userAnswers[this.currentIndex] &&
                this.isanswer === true
            );
        },

        progressPercent() {
            if (!this.test.exercises?.length) return 0;
            return ((this.currentIndex + 1) / this.test.exercises.length) * 100;
        }


    },

    mounted() {
        this.fetchTest();
    },

    methods: {

        goBack() {
            this.$router.back();
            // або: this.$router.push('/')
        },
        StartTest() {
            this.error = null

            if (this.fullName.length <= 3) {
                this.error = 'Імя має складатися мінімум з 3 символів'
            } else {
                this.isName = true
            }

        },

        async fetchTest() {
            try {
                this.testId = this.$route.params.id;
                const res = await axios.get(`${BackURL}/test/${this.testId}`);
                console.log(res.data); // <-- перевір, що реально повертає бекенд
                this.test = res.data;
                this.correctTestCode = true;
            } catch (err) {
                console.error(err);
                this.correctTestCode = false;
            }
        },


        saveAnswer(payload) {
            this.userAnswers[this.currentIndex] = {
                value: payload.value,
                slug: this.currentEx.slug
            };
        },

        async finishTest() {
            try {
                const answersArray = Object.values(this.userAnswers);

                const res = await axios.post(
                    `${BackURL}/test/${this.testId}/result`,
                    {
                        userAnswers: answersArray,
                        name: this.fullName
                    }
                );

                alert(`Ваш результат: ${res.data.score} / ${res.data.max}`);
                console.log(res.data);

            } catch (err) {
                console.error(err);
                alert('Помилка при перевірці тесту');
            }
        }


    }


}

</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:global(body) {
    background: linear-gradient(135deg, #4d0cff, #b000f8, #ff00b3);
    background-size: 200% 200%;
    animation: gradientMove 10s ease infinite;
    font-family: "Roboto Slab", serif;
    height: 90vh;
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

/*  Загальний контейнер тесту  */
.test-wrapper {
    background-color: rgb(245, 246, 248);
    width: 85%;
    margin: 30px auto;
    border-radius: 25px;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
    padding: 20px 25px 30px;
}



.answer-buttons {
    display: flex;
    justify-content: center;
    /* Центруємо кнопки */
    gap: 10px;
    /* Відстань між кнопками */
    margin-top: 20px;
    /* Відступ від нижнього блоку */
}


/* ===== MODAL OVERLAY ===== */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}


.modal-text {
    color: white;
    font-size: 15px;
    margin-bottom: 20px;
    opacity: 0.9;
}


/* ===== MODAL CARD ===== */
.modal-card {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(14px);
    padding: 30px 35px;
    border-radius: 22px;
    width: 90%;
    max-width: 360px;
    text-align: center;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.35);
}

/* ===== TITLE ===== */
.modal-title {
    color: white;
    font-size: 22px;
    margin-bottom: 18px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* ===== INPUT ===== */
.modal-input {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    font-size: 16px;
    margin-bottom: 10px;
}

.modal-input:focus {
    outline: none;
    border: 1px solid #ff00b3;
    box-shadow: 0 0 6px rgba(255, 0, 179, 0.8);
}

/* ===== ERROR ===== */
.modal-error {
    color: rgb(255, 200, 200);
    font-size: 14px;
    margin-bottom: 10px;
}

/* ===== BUTTON ===== */
.modal-btn {
    width: 100%;
    padding: 12px;
    font-size: 17px;
    border-radius: 12px;
    cursor: pointer;
    border: none;
    background: linear-gradient(135deg,
            #4d0cff,
            #b000f8,
            #ff00b3);
    color: white;
    transition: transform 0.3s, box-shadow 0.3s;
}

.modal-btn:hover {
    transform: scale(1.03);
    box-shadow: 0 0 12px rgba(255, 0, 179, 0.6);
}


/*  HEADER  */
.test-header {
    margin-bottom: 25px;
    padding: 15px 20px;
    border-radius: 20px;
    background: linear-gradient(135deg,
            rgba(77, 12, 255, 0.85),
            rgba(176, 0, 248, 0.85),
            rgba(255, 0, 179, 0.85));
    color: rgb(245, 245, 245);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
    text-align: center;
}

/* Назва тесту */
.test-title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 8px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
}

/* Прогрес */
.test-progress {
    font-size: 14px;
    opacity: 0.9;
}

/* На мобілках */
@media (min-width: 768px) {
    .test-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;
    }

    .test-title {
        margin-bottom: 0;
        font-size: 24px;
    }

    .test-progress {
        font-size: 16px;
    }
}




/* ===== PROGRESS BAR ===== */
.progress-wrapper {
    width: 100%;
    height: 10px;
    background-color: rgba(255, 255, 255, 0.35);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 25px;
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.25);
}

.progress-bar {
    height: 100%;
    width: 0%;
    border-radius: 10px;
    background: linear-gradient(90deg,
            #4d0cff,
            #b000f8,
            #ff00b3);
    transition: width 0.4s ease;
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
}



/*  Блок питання  */
.answers,
.pairs,
.enters {
    margin-top: 20px;
}

/*  Input імені  */
input {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #b9b9b9;
    margin-top: 10px;
    font-size: 16px;
}

input:focus {
    outline: none;
    border: 1px solid rgb(27, 72, 221);
    box-shadow: 0 0 4px rgb(75, 151, 232);
}

/*  Помилка  */
p {
    margin-top: 6px;
    color: rgb(220, 40, 40);
    font-size: 14px;
}

/*  Кнопки  */
button {
    padding: 12px;
    font-size: 16px;
    border-radius: 10px;
    cursor: pointer;
    border: 1px solid rgb(27, 72, 221);
    background-color: rgba(64, 132, 241, 0.9);
    color: white;
    transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
    margin-top: 20px;
}

button:hover:not(:disabled) {
    background-color: rgba(43, 119, 241, 0.95);
    transform: rotateY(-6deg) scale(1.02);
    box-shadow: 0 0 4px rgb(39, 96, 238);
}

button:disabled {
    background-color: #999;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}

/*  Кнопки "Далі / Завершити"  */
button+button {
    margin-left: 10px;
}

/*  Невірний код  */
.code-error {
    text-align: center;
    margin-top: 80px;
    color: rgb(240, 240, 240);
    text-shadow: 1px 1px 2px black;
}
</style>
