<template>
    <div v-if="correctTestCode">
        <!-- Header -->
        <div>
            <h2>{{ test.title }}</h2>
        </div>

        <div v-if="isName">

            <div v-for="e, eIndex in test.exercises" :key="e + eIndex">

            </div>

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

const BackURL = "http://localhost:2222"

export default {
    components: {
        answers,
    },

    data() {
        return {
            correctTestCode: false,

            isName: false,
            fullName: '',
            error: null,

            test: {}
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
                this.test = res.data;
                this.correctTestCode = true
            } catch (err) {
                this.correctTestCode = false
            }

        }
    }


}

</script>