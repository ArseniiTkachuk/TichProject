<template>
    <div v-if="show" class="copied-toast">{{ text }}</div>
</template>
<script>
export default {
    props: {

    },
    data() {
        return {
            text: '',
            show: false,
        }
    },
    methods: {
        showMsg(txt) {
            this.text = txt
                .then(() => {
                    this.show = true;
                    setTimeout(() => (this.show = false), 1500)
                })
        }
    }
}

</script>
<style scoped>
.copied-toast {
    position: fixed;
    bottom: 10%;
    right: 0%;
    transform: translateX(-50%);
    background: #4caf50;
    color: white;
    padding: 15px 40px;
    /* Збільшуємо розмір блоку */
    border-radius: 20px;
    /* Більші закруглення */
    font-size: 20px;
    /* Збільшуємо текст */
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    animation: slideInOut 1.5s forwards;
    z-index: 500;
}
</style>