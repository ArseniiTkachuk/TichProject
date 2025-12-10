<template>
  <div>
    <h1>Math Graph Matcher</h1>

    <p>
      Обери функцію зверху, потім графік під нею. Створи 10 пар.
    </p>

      <!-- Секція функцій -->
      <div>
        <h2>Функції</h2>
        <ul>
          <!-- Перебираємо доступні функції, які ще не вибрані у парах -->
          <li
            v-for="func in availableFunctions"
            :class="{ selected: selectedFuncSlug === func.slug }"
            @click="selectFunction(func.slug)"
            class="function-item"
          >
            {{ func.label }}
          </li>
        </ul>
      </div>

      <!-- Секція графіків -->
      <div>
        <h2>Графіки</h2>
        <ul>
          <!-- Перебираємо доступні графіки, які ще не вибрані у парах -->
          <li
            v-for="graph in availableGraphs"
            :class="{ selected: selectedGraphSlug === graph.slug }"
            @click="selectGraph(graph.slug)"
            class="graph-item"
          >
            <!-- Картинка графіка -->
            <img :src="graph.imageUrl" :alt="graph.slug" />
          </li>
        </ul>
      </div>

      <!-- Секція створених пар (відображається, якщо є хоча б одна пара) -->
      <div
        v-if="pairs.length">
        <h2>Обрані пари</h2>
        <ul>
          <!-- Перебираємо пари -->
          <li
            v-for="pair in pairs">
            <!-- Назва функції -->
            <span>{{ getFuncLabel(pair.funcSlug) }}</span>
            <!-- Картинка графіка пари -->
            <img
              :src="getGraphUrl(pair.graphSlug)"/>
            <!-- Кнопка видалення пари -->
            <button @click="removePair(pair.funcSlug)" class="remove-btn">
              &times;
            </button>
          </li>
        </ul>
      </div>

    <!-- Кнопка перевірки, активна тільки коли є 10 пар -->
    <button
      class="check-btn"
      :disabled="pairs.length !== 10"
      @click="checkResults"
    >
      Перевірити результат
    </button>

    <!-- Відображення результатів перевірки -->
    <section v-if="result">
      <h2>Результат: {{ result.score }}%</h2>
      <ul>
        <li
          v-for="item in result.details"
          :class="{ correct: item.correct, incorrect: !item.correct }"
        >
          {{ getFuncLabel(item.funcSlug) }} ↔
          {{ item.correct ? 'Правильно' : 'Неправильно' }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import axios from "axios";

const BASE_URL = "http://localhost:1111"; // Адрес бекенду

export default {
  data() {
    return {
      // Масив з усіма функціями (отриманий з бекенду)
      functions: [],
      // Масив з усіма графіками (отриманий з бекенду)
      graphs: [],
      // Слуг вибраної функції (активної)
      selectedFuncSlug: null,
      // Слуг вибраного графіка (активного)
      selectedGraphSlug: null,
      // Масив створених користувачем пар {funcSlug, graphSlug}
      pairs: [],
      // Об’єкт результату після перевірки пар
      result: null,
    };
  },
  computed: {
    // Функції, які ще не обрані у жодній парі
    availableFunctions() {
      return this.functions.filter(
        (f) => !this.pairs.some((p) => p.funcSlug === f.slug)
      );
    },
    // Графіки, які ще не обрані у жодній парі
    availableGraphs() {
      return this.graphs.filter(
        (g) => !this.pairs.some((p) => p.graphSlug === g.slug)
      );
    },
  },
  methods: {
    // Вибір функції: просто зберігаємо її slug як активний
    selectFunction(slug) {
      this.selectedFuncSlug = slug;
    },
    // Вибір графіка: якщо є вибрана функція, створюємо пару і скидаємо вибір
    selectGraph(slug) {
      if (!this.selectedFuncSlug) {
        alert("Спочатку оберіть функцію!");
        return;
      }
      this.pairs.push({ funcSlug: this.selectedFuncSlug, graphSlug: slug });
      this.selectedFuncSlug = null;
      this.selectedGraphSlug = null;
      this.result = null; // очищаємо результат, бо змінилось
    },
    // Видалення пари за slug функції
    removePair(funcSlug) {
      this.pairs = this.pairs.filter((p) => p.funcSlug !== funcSlug);
      this.result = null; // очищаємо результат при зміні пар
    },
    // Допоміжна функція: повертає лейбл функції за її slug
    getFuncLabel(slug) {
      const f = this.functions.find((x) => x.slug === slug);
      return f ? f.label : slug;
    },
    // Допоміжна функція: повертає url картинки графіка за slug
    getGraphUrl(slug) {
      const g = this.graphs.find((x) => x.slug === slug);
      return g ? g.imageUrl : "";
    },
    // Відправка пар на бекенд для перевірки
    async checkResults() {
      try {
        const res = await axios.post(`${BASE_URL}/checkPars`, { pairs: this.pairs });
        this.result = res.data; // очікуємо { score, details }
      } catch (error) {
        alert("Помилка при перевірці результату");
        console.error(error);
      }
    },
    // Завантаження даних з бекенду
    async fetchData() {
      try {
        const res = await axios.get(`${BASE_URL}/getPars`);
        // додаємо повний URL до картинки, бо бекенд віддає відносний шлях
        this.functions = res.data.functions
        this.graphs = res.data.graphs.map((g) => ({
          ...g,
          imageUrl: BASE_URL + g.imageUrl,
        }));
      } catch (error) {
        alert("Не вдалося завантажити дані");
        console.error(error);
      }
    },
  },
  created() {
    // При створенні компонента автоматично завантажуємо дані
    this.fetchData();
  },
};
</script>

<style scoped>

/* Окремий елемент функції, графіка, пари */
.function-item,
.graph-item,
.remove-btn {
  padding: 12px 15px;
  cursor: pointer;
}

/* Активний (вибраний) елемент */
.function-item.selected,
.graph-item.selected {
  box-shadow: 0 0 8px #3b82f6;
  transform: scale(1.05);
}


/* Кнопка перевірки */
.check-btn {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  border-radius: 10px;
  background-color: #3b82f6;
  color: white;
}
.check-btn:disabled {
  background-color: #999;
  cursor: not-allowed;
}

</style>
