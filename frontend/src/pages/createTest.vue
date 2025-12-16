<template>
  <div class="container">
    <button @click="$router.back()"> Back </button>
    <h2>Створити тест</h2>
    <input v-model="title" placeholder="Назва тесту" class="title-input" />

    <div v-for="(q, qIndex) in exercises" :key="qIndex" class="question-block">
      <h4>Питання {{ qIndex + 1 }}</h4>
      <input v-model="q.question" placeholder="Текст питання" class="question-input" />

      <select v-model="q.type" class="type-select">
        <option value="one">Одне правильне</option>
        <option value="many">Багато правильних</option>
        <option value="pair">Пари</option>
        <option value="enter">Введення</option>
      </select>

      <!-- ANSWERS one/many -->
      <div v-if="q.type === 'one' || q.type === 'many'" class="answers-block">
        <div v-for="(a, aIndex) in q.answers" :key="aIndex" class="answer-row">
          <input v-if="!a.isImage" v-model="a.text" placeholder="Введіть текст" class="answer-input" />
          <input v-if="a.isImage" type="file" @change="onAnswerImageChange($event, qIndex, aIndex)" class="answer-file" />

          <label>
            <template v-if="q.type === 'many'">
              <input type="checkbox" v-model="a.correct" /> Правильна
            </template>
            <template v-else>
              <input type="radio" :name="'one-' + qIndex" :value="aIndex" v-model="q.correctAnswerIndex" /> Правильна
            </template>
          </label>

          <label>
            <input type="checkbox" v-model="a.isImage" /> Картинка
          </label>

          <button @click="removeAnswer(qIndex, aIndex)" class="btn-small">Видалити</button>
        </div>
        <button @click="addAnswer(qIndex)" class="btn-small btn-add">Додати варіант</button>
      </div>

      <!-- ENTER -->
      <div v-if="q.type === 'enter'" class="enter-block">
        <div v-for="(r, rIndex) in q.correctAnswers" :key="rIndex" class="enter-row">
          <input v-model="q.correctAnswers[rIndex]" placeholder="Правильна відповідь" class="enter-input" />
          <button @click="removeCorrectAnswer(qIndex, rIndex)" class="btn-small">Видалити</button>
        </div>
        <button @click="addCorrectAnswer(qIndex)" class="btn-small btn-add">Додати відповідь</button>
      </div>

      <!-- PAIRS -->
      <div v-if="q.type === 'pair'" class="pairs-block">
        <div class="pair-columns">
          <!-- Ліва колонка -->
          <div>
            <h6>Ліва колонка</h6>
            <div v-for="(left, lIndex) in q.pairs.left" :key="'left-'+qIndex+'-'+lIndex" class="pair-row">
              <input v-model="q.pairs.left[lIndex]" placeholder="Лівий елемент" class="pair-input" />
              <select v-model="q.pairs.correctMap[lIndex]">
                <option v-for="(right, rIndex) in q.pairs.right" :key="'right-option-'+qIndex+'-'+rIndex" :value="rIndex">
                  {{ right }}
                </option>
              </select>
              <button @click="removeLeft(qIndex, lIndex)" class="btn-small">Видалити лівий</button>
            </div>
            <button @click="addLeft(qIndex)" class="btn-small btn-add">Додати лівий</button>
          </div>

          <!-- Права колонка -->
          <div>
            <h6>Права колонка</h6>
            <div v-for="(right, rIndex) in q.pairs.right" :key="'right-'+qIndex+'-'+rIndex" class="pair-row">
              <input v-model="q.pairs.right[rIndex]" placeholder="Правий елемент" class="pair-input" />
              <button @click="removeRight(qIndex, rIndex)" class="btn-small">Видалити правий</button>
            </div>
            <button @click="addRight(qIndex)" class="btn-small btn-add">Додати зайвий правий</button>
          </div>
        </div>
      </div>

    </div>

    <button @click="addQuestion" class="btn-add-question">Додати питання</button>
    <button @click="createTest" class="btn-create-test">Створити тест</button>
    <p class="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from "axios";
const URL = "http://localhost:2222";

export default {
  data() {
    return {
      title: "",
      exercises: [
        {
          type: "one",
          question: "",
          answers: [],
          pairs: { left: [], right: [], correctMap: {} },
          correctAnswers: [],
          correctAnswerIndex: null
        }
      ],
      message: ""
    };
  },
  methods: {
    addQuestion() {
      this.exercises.push({
        type: "one",
        question: "",
        answers: [],
        pairs: { left: [], right: [], correctMap: {} },
        correctAnswers: [],
        correctAnswerIndex: null
      });
    },

    /* Answers */
    addAnswer(qIndex) {
      this.exercises[qIndex].answers.push({ text: "", correct: false, isImage: false, file: null });
    },
    removeAnswer(qIndex, aIndex) {
      this.exercises[qIndex].answers.splice(aIndex, 1);
    },
    onAnswerImageChange(event, qIndex, aIndex) {
      this.exercises[qIndex].answers[aIndex].file = event.target.files[0];
    },

    /* Enter */
    addCorrectAnswer(qIndex) {
      this.exercises[qIndex].correctAnswers.push("");
    },
    removeCorrectAnswer(qIndex, rIndex) {
      this.exercises[qIndex].correctAnswers.splice(rIndex, 1);
    },

    /* Pairs */
    addLeft(qIndex) {
      const q = this.exercises[qIndex];
      q.pairs.left.push("");
      q.pairs.correctMap[q.pairs.left.length - 1] = 0;
      if (q.pairs.right.length < q.pairs.left.length) q.pairs.right.push("");
    },
    addRight(qIndex) {
      const q = this.exercises[qIndex];
      q.pairs.right.push("");
    },
    removeLeft(qIndex, lIndex) {
      const q = this.exercises[qIndex];
      q.pairs.left.splice(lIndex, 1);
      delete q.pairs.correctMap[lIndex];

      // Перенумеровуємо correctMap
      const newMap = {};
      q.pairs.left.forEach((_, index) => {
        newMap[index] = q.pairs.correctMap[index] !== undefined ? q.pairs.correctMap[index] : 0;
      });
      q.pairs.correctMap = newMap;
    },
    removeRight(qIndex, rIndex) {
      const q = this.exercises[qIndex];
      q.pairs.right.splice(rIndex, 1);

      // Оновлюємо correctMap
      for (const key in q.pairs.correctMap) {
        if (q.pairs.correctMap[key] === rIndex) {
          q.pairs.correctMap[key] = 0;
        } else if (q.pairs.correctMap[key] > rIndex) {
          q.pairs.correctMap[key]--;
        }
      }
    },

    /* Create Test */
    async createTest() {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        this.message = "Невалідний ID вчителя. Зробіть повторний логін.";
        return;
      }
      if (!this.title || this.exercises.length === 0) {
        this.message = "Тест має містити назву та хоча б одне питання!";
        return;
      }

      try {
        const formData = new FormData();
        formData.append("title", this.title);
        formData.append("author", userId);

        const exercisesData = this.exercises.map((q) => {
          const answers = (q.answers || []).map((a, i) => ({
            text: a.isImage ? undefined : a.text || "",
            correct: q.type === "one" ? i === q.correctAnswerIndex : !!a.correct,
            isImage: !!a.isImage
          }));

          const pairs = q.type === "pair" ? {
            left: q.pairs.left || [],
            right: q.pairs.right || [],
            correctMap: q.pairs.correctMap || {}
          } : null;

          return {
            type: q.type,
            question: q.question || "",
            answers,
            correctAnswers: q.correctAnswers || [],
            pairs
          };
        });

        formData.append("exercises", JSON.stringify(exercisesData));

        // Додаємо картинки
        this.exercises.forEach((q) => {
          (q.answers || []).forEach((a) => {
            if (a.isImage && a.file) formData.append("images", a.file);
          });
        });

        const res = await axios.post(`${URL}/test`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenAuthTeacher")}`,
            "Content-Type": "multipart/form-data"
          }
        });

        this.message = "Тест створено!";
        console.log(res.data);

      } catch (err) {
        console.error("AxiosError", err);
        this.message = "Помилка при створенні тесту: " + (err.response?.data?.message || err.message);
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
}

.title-input,
.question-input,
.answer-input,
.pair-input,
.enter-input {
  width: 100%;
  padding: 6px;
  margin: 5px 0;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.type-select {
  padding: 5px;
  margin: 5px 0;
}

.question-block {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.answers-block,
.pairs-block,
.enter-block {
  margin-top: 10px;
}

.answer-row,
.pair-row,
.enter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.answer-file {
  margin-right: 10px;
}

.btn-small {
  padding: 3px 8px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  background: #eee;
  border: 1px solid #ccc;
}

.btn-small:hover {
  background: #ddd;
}

.btn-add {
  background: #cce5ff;
  border-color: #99ccff;
}

.btn-add:hover {
  background: #99ccff;
}

.btn-add-question,
.btn-create-test {
  padding: 8px 15px;
  margin-top: 15px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  color: #fff;
}

.btn-add-question {
  background: #4caf50;
}

.btn-create-test {
  background: #2196f3;
  margin-left: 10px;
}

.btn-add-question:hover {
  background: #45a049;
}

.btn-create-test:hover {
  background: #1e88e5;
}

.message {
  margin-top: 10px;
  font-weight: bold;
}

.pair-columns {
  display: flex;
  gap: 20px;
}

.pair-columns h6 {
  margin-bottom: 5px;
}
</style>
