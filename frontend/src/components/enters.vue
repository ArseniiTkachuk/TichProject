<template>
  <div class="enter-block">
    <p class="question">{{ ex.question }}</p>
    <input
      type="text"
      v-model="userInput"
      @input="onInput()"
      placeholder="Введіть відповідь"
      class="enter-input"
    />
    <p>{{ userInput }}</p>
  </div>
</template>

<script>
export default {
  props: {
    ex: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      userInput: ''
    };
  },
  methods: {
    onInput() {
      // Відправляємо введене значення батьківському компоненту
      this.$emit('answered', {
        value: this.userInput
      });
    }
  }
};
</script>

<style scoped>
.enter-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.question {
  font-weight: bold;
  margin-bottom: 5px;
}

.enter-input {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
</style>
