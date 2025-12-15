<template>
    <nav>
        <button @click="current = 'Register'">Реєстрація</button>
        <button @click="current = 'Login'">Вхід</button>
    </nav>
    <div class="auth">
        <component :is="currentComponent"></component>
    </div>

</template>
<script>
import Register from '@/components/register.vue';
import Login from '@/components/login.vue';

export default {
    components: {
        Register,
        Login
    },

    data() {
        return {
            current: 'Register' // початковий компонент
        }
    },
    computed: {
        currentComponent() {
            return this.current
        }
    }
}

</script>
<style scoped>
.auth {
    display: flex;
    flex-direction: column;
    width: 360px;
    text-align: center;
    margin: 100px auto;
}
</style>