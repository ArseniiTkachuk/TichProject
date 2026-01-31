<template>
  <div class="answers-block">

    <!-- Питання -->
    <h3 class="question">{{ ex.question }}</h3>

    <!-- Варіанти відповідей -->
    <div v-for="(a, aIndex) in ex.answers" :key="currentId + '-' + aIndex" class="answer-card"
      :class="{ selected: isSelected(aIndex) }" @click="handleClick(aIndex)">
      <!-- RADIO / CHECKBOX ліворуч -->
      <span v-if="ex.type === 'one'" class="check-wrapper">
        <input type="radio" :name="'one-' + currentId" :checked="userSelection === aIndex" />
        <span class="custom-radio"></span>
      </span>

      <span v-else-if="ex.type === 'many'" class="check-wrapper">
        <input type="checkbox" :checked="userSelection.includes(aIndex)" />
        <span class="custom-checkbox"></span>
      </span>

      <!-- Текстова відповідь -->
      <p v-if="!a.isImage" class="answer-text">{{ a.text }}</p>

      <!-- Відповідь з картинкою -->
      <img v-else :src="loadImg(a.imageUrl)" alt="answer image" class="answer-img" />

    </div>
  </div>
</template>

<script>
const BACK_URL = import.meta.env.VITE_BACK_URL;

export default {
  props: {
    ex: { type: Object, required: true },
    currentId: { type: [Number, String], required: true }
  },

  data() {
    return {
      userSelection: this.ex.type === 'many' ? [] : null
    };
  },

  watch: {
    ex: {
      immediate: true,
      handler(newEx) {
        this.userSelection = newEx.type === 'many' ? [] : null;
      }
    }
  },

  methods: {
    handleClick(index) {
      if (this.ex.type === 'one') this.selectAnswer(index);
      else this.toggleAnswer(index);
    },

    selectAnswer(index) {
      this.userSelection = index;
      this.emitAnswer();
    },

    toggleAnswer(index) {
      const pos = this.userSelection.indexOf(index);
      if (pos === -1) this.userSelection.push(index);
      else this.userSelection.splice(pos, 1);
      this.emitAnswer();
    },

    emitAnswer() {
      this.$emit('answered', { value: this.userSelection });
    },

    isSelected(index) {
      return this.ex.type === 'one'
        ? this.userSelection === index
        : this.userSelection.includes(index);
    },

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
  gap: 20px;
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
  padding: 16px 20px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(176, 0, 248, 0.25);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.answer-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 20px rgba(176, 0, 248, 0.35);
}

.answer-card.selected {
  background: linear-gradient(135deg, rgba(77, 12, 255, 0.25), rgba(176, 0, 248, 0.25), rgba(255, 0, 179, 0.25));
  border-color: rgba(176, 0, 248, 0.6);
}

.answer-text {
  flex: 1;
  font-size: 16px;
  color: #222;
  margin: 0;
}

.answer-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.15);
}


.check-wrapper {
  position: relative;
  flex-shrink: 0;
}

/* ховаємо стандартні інпути */
.check-wrapper input {
  display: none;
}

.custom-radio,
.custom-checkbox {
  width: 22px;
  height: 22px;
  display: inline-block;
  position: relative;
  border: 2px solid #b000f8;
}

.custom-radio {
  border-radius: 50%;
}

.custom-checkbox {
  border-radius: 6px;
}

.answer-card.selected .custom-radio::after,
.answer-card.selected .custom-checkbox::after {
  content: '';
  position: absolute;
  inset: 4px;
  background: linear-gradient(135deg, #4d0cff, #b000f8, #ff00b3);
  border-radius: inherit;
}

@media (max-width: 600px) {
  .answer-img {
    width: 100px;
    height: 100px;
  }

  .question {
    font-size: 18px;
  }
}
</style>
