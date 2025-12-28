<template>
  <div class="pairs-preview-block">
    <h3 class="question">{{ ex.question }}</h3>

    <div class="pairs-list">
      <div class="info-label">Правильні відповідності:</div>

      <div v-for="leftItem in ex.pairs.left" :key="leftItem.slug" class="pair-row">
        <div class="pair-card left">
          <img v-if="leftItem.isImage" :src="`${BackURL}${leftItem.imageUrl}`" class="preview-img" />
          <span v-else>{{ leftItem.text }}</span>
        </div>

        <div class="connector">
          <div class="line"></div>
          <span class="arrow">→</span>
        </div>

        <div class="pair-card right">
          <template v-if="getRightItem(leftItem.slug)">
            <img v-if="getRightItem(leftItem.slug).isImage" :src="`${BackURL}${getRightItem(leftItem.slug).imageUrl}`"
              class="preview-img" />
            <span v-else>{{ getRightItem(leftItem.slug).text }}</span>
          </template>
        </div>
      </div>

      <div v-if="unusedRightItems.length > 0" class="unused-section">
        <div class="info-label unused-label">Зайві елементи (не мають пари):</div>
        <div class="unused-list">
          <div v-for="rItem in unusedRightItems" :key="rItem.slug" class="pair-card right unused">
            <img v-if="rItem.isImage" :src="`${BackURL}${rItem.imageUrl}`" class="preview-img" />
            <span v-else>{{ rItem.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ex: { type: Object, required: true }
  },
  data() {
    return {
      BackURL: import.meta.env.VITE_BACK_URL,
    };
  },
  computed: {
    // Знаходимо всі індекси правих елементів, які задіяні в correctMap
    usedRightIndices() {
      if (!this.ex.pairs || !this.ex.pairs.correctMap) return [];
      return Object.values(this.ex.pairs.correctMap);
    },
    // Фільтруємо праву колонку, щоб знайти ті, чиїх індексів немає в correctMap
    unusedRightItems() {
      if (!this.ex.pairs || !this.ex.pairs.right) return [];
      return this.ex.pairs.right.filter((item, index) => {
        return !this.usedRightIndices.includes(index);
      });
    }
  },
  methods: {
    getRightItem(leftSlug) {
      // Отримуємо індекс з correctMap (наприклад, для slug "0" отримаємо 2)
      const rightIndex = this.ex.pairs.correctMap[leftSlug];
      // Повертаємо об'єкт за цим індексом
      return this.ex.pairs.right[rightIndex];
    }
  }
};
</script>

<style scoped>
.pairs-preview-block {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.question {
  font-size: 22px;
  font-weight: 600;
  color: #2a2a2a;
}

.info-label {
  font-size: 13px;
  font-weight: 800;
  color: #4caf50;
  text-transform: uppercase;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.pair-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.pair-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 12px;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 55px;
  transition: all 0.3s ease;
}

.pair-card.left {
  border-left: 5px solid #4d0cff;
}

.pair-card.right {
  border-right: 5px solid #ff00b3;
}

/* Стиль для зайвих елементів */
.unused-section {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

.unused-label {
  color: #888;
}

.unused-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pair-card.unused {
  flex: none;
  width: calc(50% - 5px);
  background: rgba(0, 0, 0, 0.03);
  border: 1px dashed rgba(0, 0, 0, 0.2);
  border-right: none;
  color: #777;
}

.connector {
  display: flex;
  align-items: center;
  color: #4caf50;
}

.line {
  width: 30px;
  height: 2px;
  background: currentColor;
  opacity: 0.3;
}

.preview-img {
  max-width: 100px;
  max-height: 60px;
  border-radius: 8px;
}

@media (max-width: 600px) {
  .pair-row {
    flex-direction: column;
  }

  .connector {
    transform: rotate(90deg);
    margin: 10px 0;
  }

  .pair-card.unused {
    width: 100%;
  }
}
</style>