<template>

    <div v-if="isName">

        <h1> hear will tests </h1>

    </div>
    <div v-else>

        <h3> Enter your name</h3>
        <input v-model="fullName" placeholder="Full name" >
        <p v-if="error">{{ error }}</p>
        <button @click="StartTest()"> Start </button>

    </div>

</template>
<script>

export default {

    data() {
        return {
            isName: false,
            fullName: '',
            error: null,
        }

    },

    methods: {
        StartTest(){
            this.error = null

            if (this.fullName.length <= 3){
                this.error = 'Імя має складатися мінімум з 3 символів'
            } else {
                this.isName = true
            }

        }
    }


}

</script>