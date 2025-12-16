<template>

    <h3>Enter code for test</h3>

    <input v-model="testCode" placeholder="Enter code" >

    <button @click="$router.push(`/test/${testCode}`)" > Go </button>

</template>
<script>

    export default {
        data() {
            return{
                testCode: '',
            }
        }
    }

</script>