<template>
  <div class="enter-block">
    <!-- Питання -->
    <p class="question">{{ ex.question }}</p>

    <!-- Поле вводу -->
    <input
      type="text"
      v-model="userInput"
      @input="onInput"
      placeholder="Введіть відповідь"
      class="enter-input"
    />

    <!-- Попередній перегляд введеного (опційно, можна прибрати) -->
    <p class="preview" v-if="userInput">{{ userInput }}</p>
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
      this.$emit('answered', { value: this.userInput });
    }
  }
};
</script>

<style scoped>
.enter-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.question {
  font-weight: 600;
  font-size: 18px;
  color: #333;
}

/* Поле вводу */
.enter-input {
  padding: 12px 15px;
  font-size: 16px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  outline: none;
  transition: 0.3s;
}

.enter-input:focus {
  border-color: #b000f8;
  box-shadow: 0 0 6px rgba(176, 0, 248, 0.3);
}

/* Попередній перегляд */
.preview {
  font-size: 14px;
  color: #555;
  opacity: 0.8;
}

/* Адаптація під мобільні */
@media (max-width: 600px) {
  .question {
    font-size: 16px;
  }

  .enter-input {
    font-size: 14px;
    padding: 10px 12px;
  }

  .preview {
    font-size: 13px;
  }
}
</style>
