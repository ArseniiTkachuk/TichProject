<template>
  <div class="answers">
    <div v-for="(a, idx) in ex.answers.answer" :key="idx" :class="answerClass(idx, a)" class="answer-item">
      <span class="icon">
        <!-- Просто правильна відповідь -->
        <span v-if="a.correct">✔</span>
        <!-- Вибрана неправильна відповідь -->
        <span v-else-if="isChosen(idx)">✖</span>
      </span>

      {{ a.text }}

      <!-- Підпис правильна, якщо учень не вибрав -->
      <span v-if="isChosen(idx)" class="correct-label">(Вибрано)</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "OneMany",
  props: {
    ex: { type: Object, required: true },
  },
  methods: {
    isChosen(idx) {
      // Для many типів userAnswer — масив
      if (Array.isArray(this.ex.userAnswer)) {
        return this.ex.userAnswer.includes(idx);
      } else {
        // Для one типу userAnswer — індекс
        return this.ex.userAnswer === idx;
      }
    },
    answerClass(idx, answer) {
      return {
        answer: true,
        right: answer.correct,
        wrong: this.isChosen(idx) && !answer.correct,
        chosen: this.isChosen(idx),
      };
    },
  },
};
</script>

<style scoped>
.answers {
  margin-top: 12px;
}

.answer-item {
  padding: 8px 12px;
  border-radius: 10px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #949393;
  background: #f7f5f5;

}

/* Правильна відповідь */
.answer-item.right {
  background: #d2efd4;
  color: #2e7d32;
}

.answer-item.right.chosen {
  background: #b0f6b6;

}

/* Вибрана неправильна відповідь */
.answer-item.wrong {
  background: #f5cbc6;
  color: #c62828;
}

/* Вибрана відповідь (кордон) */
.answer-item.chosen {
  border: 1px solid #626161;
}

.correct-label {
  font-size: 12px;
  color: #3b3b3b;
  margin-left: 6px;
  margin-left: auto;
}

.icon {
  width: 22px;
  text-align: center;
}
</style>
