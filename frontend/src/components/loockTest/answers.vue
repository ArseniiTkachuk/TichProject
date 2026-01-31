<template>
  <div class="answers-block">
    <h3 class="question">{{ ex.question }}</h3>

    <div v-for="(a, aIndex) in ex.answers" :key="'-' + aIndex" class="answer-card"
      :class="{ 'is-correct': a.correct }">
      <div class="status-icon">
        <span v-if="a.correct" class="badge correct">✓</span>
        <span v-else class="badge-empty"></span>
      </div>

      <p v-if="!a.isImage" class="answer-text">{{ a.text }}</p>

      <img v-else :src="loadImg(a.imageUrl)" alt="answer image" class="answer-img" />

      <span v-if="a.correct" class="correct-label">Правильна відповідь</span>
    </div>
  </div>
</template>

<script>
const BACK_URL = import.meta.env.VITE_BACK_URL;
  

export default {
  props: {
    ex: { type: Object, required: true },
  },
  methods: {
    loadImg(url) {
      return `${BACK_URL}${url}`;
    }
  }
};
</script>

<style scoped>
.answers-block {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.question {
  font-size: 22px;
  font-weight: 600;
  color: #2a2a2a;
  margin-bottom: 12px;
}

.answer-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 14px 20px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
}

/* Стиль для правильної відповіді */
.answer-card.is-correct {
  background: rgba(76, 175, 80, 0.1);
  /* Світло-зелений фон */
  border: 1px solid #4caf50;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.15);
}

.status-icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge {
  width: 100%;
  height: 100%;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
}

.badge-empty {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 50%;
}

.answer-text {
  flex: 1;
  font-size: 16px;
  color: #222;
  margin: 0;
}

.correct-label {
  font-size: 12px;
  font-weight: 700;
  color: #4caf50;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.answer-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 12px;
}

@media (max-width: 600px) {
  .answer-card {
    padding: 10px 15px;
  }

  .correct-label {
    display: none;
    /* Ховаємо текст на мобільних для економії місця */
  }
}
</style>