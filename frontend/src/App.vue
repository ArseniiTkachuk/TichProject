<template>
  <!-- Контейнер для сторінки тестів -->
  <div>
    <div>
      <header id="header">
        <h1 class="header_text">Підібрати математичній функції її графік</h1>
      </header>

      <div id="background_test">

        <h3 class="text_func">Математичні функції</h3>

        <p class="text_des">
          Обери функцію зверху, потім графік під нею. Створи 10 пар.
        </p>

        <!-- Секція функцій -->

        <div>

          <ul>
            <!-- Перебираємо доступні функції, які ще не вибрані у парах -->
            <li v-for="func in availableFunctions" :class="{ selected: selectedFuncSlug === func.slug }"
              @click="selectFunction(func.slug)" class="function-item">
              {{ func.label }}
            </li>
          </ul>
        </div>

        <!-- Секція графіків -->
        <div>
          <h3 class='text_func'>Графіки</h3>
          <ul>
            <!-- Перебираємо доступні графіки, які ще не вибрані у парах -->
            <li v-for="graph in availableGraphs" :class="{ selected: selectedGraphSlug === graph.slug }"
              @click="selectGraph(graph.slug)" class="graph-item">
              <!-- Картинка графіка -->
              <img :src="graph.imageUrl" :alt="graph.slug" />
            </li>
          </ul>
        </div>

        <!-- Секція створених пар (відображається, якщо є хоча б одна пара) -->
        <div v-if="pairs.length">
          <h3 class='text_func'>Обрані пари</h3>
          <ul>
            <!-- Перебираємо пари -->
            <li class="block_done" v-for="pair in pairs">
              <!-- Назва функції -->
              <span class="name_func">{{ getFuncLabel(pair.funcSlug) }}</span>
              <!-- Картинка графіка пари -->
              <img class="img_func" :src="getGraphUrl(pair.graphSlug)" />
              <!-- Кнопка видалення пари -->
              <button @click="removePair(pair.funcSlug)" class="remove-btn">
                Видалити пару
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Кнопка перевірки, активна тільки коли є 10 пар -->
      <button class="check-btn" :disabled="pairs.length !== 10" @click="checkResults">
        Перевірити результат
      </button>

      <!-- Відображення результатів перевірки -->
      <section v-if="result">
        <h2>Результат: {{ result.score }}%</h2>
        <ul>
          <li v-for="item in result.details" :class="{ correct: item.correct, incorrect: !item.correct }">
            {{ getFuncLabel(item.funcSlug) }} ↔
            {{ item.correct ? 'Правильно' : 'Неправильно' }}
          </li>
        </ul>
      </section>
    </div>
  </div>
  <!-- Контейнер для результату -->
  <div>
    
  </div>
  <!-- Контейнер для використаної спроби -->
  <div>

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
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&family=Science+Gothic:wght@100..900&display=swap');

* {
  /*Загальні налаштування*/
  margin: 0;
  padding: 0;
}

:global(body) {
  /*Задній фон сайту */
  background: linear-gradient(135deg, rgb(180, 60, 220), rgb(120, 30, 170));
  font-family: "Roboto Slab", serif;

}

#header {
  color: rgb(233, 233, 233);
  margin-bottom: 20px;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 10px;
  text-align: center;
}

.header_text {
  text-shadow: 1px 1px 2px rgb(65, 65, 65);
}

#background_test {
  /*Задній фон тесту*/
  background-color: rgb(245, 246, 248);
  width: 80%;
  margin: 0 auto;
  margin-bottom: 30px;
  height: auto;
  border-radius: 25px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
  padding: 7px 15px 10px 20px;
}

.text_func {
  margin: 15px 0 5px;
}

.text_des {
  font-size: 10px;
}

/* Окремий елемент функції, графіка, пари */
.function-item,
.graph-item {
  padding: 15px 10px;
  margin: 15px 0;
  cursor: pointer;
  border: 1px solid #b9b9b9;
  border-radius: 10px;
  transition: background 0.3s, border-radius 0.3s, transform 0.3s;
  list-style-type: none;
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.function-item:hover,
.graph-item:hover {
  background-color: rgba(168, 219, 145, 0.3);
  border: 1px solid rgb(94, 170, 94);
  transform: rotateY(-5deg);
  box-shadow: 0 0 2px rgb(120, 210, 129);
}

/* Активний (вибраний) елемент */
.function-item.selected,
.graph-item.selected {
  box-shadow: 0 0 2px rgb(75, 151, 232);
  transform: scale(1.02);
  list-style-type: none;
  background-color: rgb(40, 101, 224, 0.3);
  border: 1px solid rgb(27, 72, 221);
}

.block_done {
  padding: 15px 10px;
  margin: 15px 0;
  cursor: pointer;
  border: 1px solid #b9b9b9;
  border-radius: 10px;
  list-style-type: none;
  background-color: rgba(168, 219, 145, 0.3);
  border: 1px solid rgb(94, 170, 94);
  box-shadow: 0 0 2px rgb(120, 210, 129);
  text-align: center;
}

.name_func {
  margin-bottom: 10px;
}

.img_func {
  margin: 10px 10px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.remove-btn {
  width: 130px;
  height: 38px;
  background-color: rgba(227, 90, 90, 0.9);
  border: 1px solid rgb(205, 72, 72);
  border-radius: 10px;
  margin-left: 10px;
  cursor: pointer;
  transition: background 0.3s, border-radius 0.3s, transform 0.3s;
}

.remove-btn:hover {
  background-color: rgba(229, 43, 43, 0.8);
  border: 1px solid rgb(201, 50, 50);
  transform: rotateY(-7deg);
  box-shadow: 0 0 2px rgb(227, 75, 75);
  transform: scale(1.02);
}

/* Кнопка перевірки */
.check-btn {
  width: 95%;
  padding: 12px;
  font-size: 18px;
  border-radius: 10px;
  background-color: rgba(64, 132, 241, 0.9);
  color: white;
  cursor: pointer;
  transition: background 0.3s, border-radius 0.3s, transform 0.3s;
  display: block;
  margin: 0 auto;
}

.check-btn:hover {
  background-color: rgba(43, 119, 241, 0.9);
  border: 1px solid rgb(10, 37, 237);
  transform: rotateY(-7deg);
  box-shadow: 0 0 2px rgb(39, 96, 238);
  transform: scale(1.02);
}

.check-btn:disabled {
  background-color: #999;
  cursor: not-allowed;
}
</style>
