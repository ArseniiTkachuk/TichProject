<template>
  <div class="pairs" v-if="ex.type === 'pair' && ex.userAnswer">
    <div v-for="l in ex.answers.pairs.left" :key="l.slug" class="pair-row">
      <span class="left">{{ l.text }}</span> →
      <span :class="isPairCorrect(l.slug) ? 'right' : 'wrong'">
        {{ getUserPairText(l.slug) }}
      </span>
      <span class="correct-hint">(правильно: {{ getCorrectPairText(l.slug) }})</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ex: { type: Object, required: true }
  },
  methods: {
    isPairCorrect(leftSlug) {
      const pair = this.ex.userAnswer?.find(([l]) => l === leftSlug);
      const correctRight = this.ex.answers.correctMap?.[leftSlug];
      return pair && String(pair[1]) === String(correctRight); // slug порівнюємо як рядки
    },

    getUserPairText(leftSlug) {
      const pair = this.ex.userAnswer?.find(([l]) => l === leftSlug);
      if (!pair) return '—';
      const right = this.ex.answers.pairs.right.find(r => r.slug === String(pair[1]));
      return right?.text || '—';
    },
    getCorrectPairText(leftSlug) {
      const rightSlug = this.ex.answers.pairs.correctMap?.[leftSlug];
      const right = this.ex.answers.pairs.right.find(r => r.slug === String(rightSlug));
      return right?.text || '—';
    }
  }
};
</script>

<style scoped>
.pairs {
  margin-top: 12px;
}

.pair-row {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.left {
  font-weight: 500;
}

.correct-hint {
  color: #666;
  font-size: 13px;
}

.right {
  color: #2e7d32;
  font-weight: bold;
}

.wrong {
  color: #c62828;
  font-weight: bold;
}
</style>
