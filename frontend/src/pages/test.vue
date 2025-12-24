<template>
    <div v-if="correctTestCode">
        <!-- Header -->
        <div>
            <h2>{{ test.title }}</h2>
        </div>

        <div v-if="isName && test.exercises.length > 0">
            <answers v-if="['one', 'many'].includes(currentEx.type)" :key="currentEx" :ex="currentEx"
                :currentId="currentIndex" @answered="saveAnswer" />

            <pairs v-else-if="currentEx.type === 'pair'" :ex="currentEx" @answered="saveAnswer"
                @ISAnswer="isanswer = $event" :key="currentEx.slug" />

            <enters v-else-if="currentEx.type === 'enter'" :ex="currentEx" @answered="saveAnswer" :key="currentIndex" />

            <button v-if="currentIndex === test.exercises.length - 1" :disabled="!isAnswer" @click="finishTest">
                Завершити тест
            </button>
            <button v-else @click="currentIndex++" :disabled="!isAnswer">
                Далі
            </button>

        </div>



        <div v-else>

            <h3> Enter your name</h3>
            <input v-model="fullName" placeholder="Full name">
            <p v-if="error">{{ error }}</p>
            <button @click="StartTest()"> Start </button>

        </div>
    </div>
    <div v-else>
        <h1>Code is not correct</h1>
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
            return this.userAnswers[this.currentIndex] && this.isanswer;
        }
    },

    mounted() {
        this.fetchTest();
    },

    methods: {
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