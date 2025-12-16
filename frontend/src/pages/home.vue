<template>

    <div v-if="enterCode">
        <button @click="enterCode = false"> Back </button>
        <enterTestCode />
    </div>
    <div v-else>
        <button @click="enterCode = true">Я студент</button>
        <button @click="$router.push('/profile')">Я викладач</button>
    </div>
</template>
<script>

import enterTestCode from '@/components/enterTestCode.vue';

export default {
    components: {
        enterTestCode,
    },
    data() {
        return {
            enterCode: false
        }
    },

    methods: {

    }
}

</script>