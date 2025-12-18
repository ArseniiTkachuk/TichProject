<template>
    <div v-if="correctTestCode">
        <!-- Header -->
        <div>
            <h2>{{ test.title }}</h2>
        </div>

        <div v-if="isName && test.exercises.length > 0">
            <answers v-if="['one', 'many'].includes(test.exercises[currentIndex].type)"
                :ex="test.exercises[currentIndex]" :currentId="currentIndex" @answered="saveAnswer" />

            <pairs v-else-if="test.exercises[currentIndex].type === 'pair'" :ex="test.exercises[currentIndex]" />

            <enters v-else-if="currentEx.type === 'enter'" :ex="currentEx" @answered="saveAnswer" :key="currentIndex" />

            <button v-if="currentIndex === test.exercises.length - 1" :disabled="!userAnswers[currentIndex]">
                Завершити тест
            </button>
            <button v-else @click="currentIndex++" :disabled="!userAnswers[currentIndex]">
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
            currentIndex: 0,
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
                const testId = this.$route.params.id;
                const res = await axios.get(`${BackURL}/test/${testId}`);
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
                type: this.currentEx.type,
                value: payload.value
            };
        },

    }


}

</script>