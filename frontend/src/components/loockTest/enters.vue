<template>
  <div class="enter-preview-block">
    <h3 class="question">{{ ex.question }}</h3>

    <div class="correct-answers-container">
      <div class="info-header">
        <span class="status-icon">i</span>
        <span class="label">Правильна відповідь:</span>
      </div>
      
      <div class="answers-list">
        <div 
          v-for="(answer, index) in ex.correctAnswers" 
          :key="index" 
          class="answer-chip"
        >
          {{ answer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ex: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.enter-preview-block {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.question {
  font-size: 22px;
  font-weight: 600;
  color: #2a2a2a;
  margin: 0;
}

/* Контейнер для правильних відповідей */
.correct-answers-container {
  background: rgba(76, 175, 80, 0.1); /* Світло-зелений фон для "правильності" */
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 18px;
  padding: 16px 20px;
  backdrop-filter: blur(5px);
}

.info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.status-icon {
  width: 20px;
  height: 20px;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  font-style: italic;
}

.label {
  font-size: 14px;
  font-weight: 700;
  color: #2e7d32;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Список відповідей у вигляді "чіпсів" */
.answers-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.answer-chip {
  background: #ffffff;
  color: #1b5e20;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid rgba(76, 175, 80, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

@media (max-width: 600px) {
  .question {
    font-size: 18px;
  }
  .answer-chip {
    font-size: 14px;
    padding: 6px 12px;
  }
}
</style>