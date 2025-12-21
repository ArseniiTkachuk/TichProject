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
          <div v-if="a.isImage">
            <label class="upload-label">
              <span>Select image</span>
              <input type="file" accept="image/*" @change="onAnswerImageChange($event, qIndex, aIndex)">
            </label>

            <img v-if="a.preview" :src="a.preview" class="preview-img" />

          </div>


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
            <div v-for="(left, lIndex) in q.pairs.left" :key="'left-' + qIndex + '-' + lIndex" class="pair-row">
              <input v-if="!left.isImage" v-model="left.text" placeholder="Лівий елемент" class="pair-input" />
              <div v-if="left.isImage">
                <label class="upload-label">
                  <span>Select image</span>
                  <input type="file" accept="image/*" @change="onPairLeftImageChange($event, qIndex, lIndex)">
                </label>
                <img v-if="left.preview" :src="left.preview" class="preview-img" />
              </div>

              <label>
                <input type="checkbox" v-model="left.isImage" /> Картинка
              </label>
              <select v-model="q.pairs.correctMap[lIndex]">
                <option v-for="(right, rIndex) in q.pairs.right" :key="rIndex" :value="rIndex">
                  {{ rIndex + 1 }}
                </option>
              </select>

              <button @click="removeLeft(qIndex, lIndex)" class="btn-small">Видалити лівий</button>
            </div>
            <button @click="addLeft(qIndex)" class="btn-small btn-add">Додати лівий</button>
          </div>

          <!-- Права колонка -->
          <div>
            <h6>Права колонка</h6>
            <div v-for="(right, rIndex) in q.pairs.right" :key="'right-' + qIndex + '-' + rIndex" class="pair-row">
              <p>{{ rIndex + 1 }}</p>
              <input v-if="!right.isImage" v-model="right.text" placeholder="Правий елемент" class="pair-input" />

              <div v-if="right.isImage">
                <label class="upload-label">
                  <span>Select image</span>
                  <input type="file" accept="image/*" @change="onPairRightImageChange($event, qIndex, rIndex)">
                </label>
                <img v-if="right.preview" :src="right.preview" class="preview-img" />
              </div>



              <label>
                <input type="checkbox" v-model="right.isImage" />
                Картинка
              </label>

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
const BackURL = "http://localhost:2222";

export default {
  data() {
    return {
      title: "",
      exercises: [
        {
          type: "one",
          question: "",
          answers: [],
          pairs: {
            left: [],
            right: [],
            correctMap: {}
          },
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
        pairs: {
          left: [],
          right: [],
          correctMap: {}
        },
        correctAnswers: [],
        correctAnswerIndex: null
      });
    },

    /* Answers */
    addAnswer(qIndex) {
      this.exercises[qIndex].answers.push({
        text: "",
        correct: false,
        isImage: false,
        file: null,
        preview: null // додали прев’ю
      });
    },
    removeAnswer(qIndex, aIndex) {
      this.exercises[qIndex].answers.splice(aIndex, 1);
    },
    onAnswerImageChange(event, qIndex, aIndex) {
      const file = event.target.files[0];
      const answer = this.exercises[qIndex].answers[aIndex];
      if (file) {
        answer.file = file;
        answer.preview = URL.createObjectURL(file); // миттєве прев’ю
      } else {
        answer.file = null;
        answer.preview = null;
      }
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

      q.pairs.left.push({
        text: "",
        isImage: false,
        file: null,
      });

      q.pairs.correctMap[q.pairs.left.length - 1] = 0;

      if (q.pairs.right.length < q.pairs.left.length) {
        q.pairs.right.push({
          text: "",
          isImage: false,
          file: null,

        });
      }
    },
    addRight(qIndex) {
      this.exercises[qIndex].pairs.right.push({
        text: "",
        isImage: false,
        file: null,

      });
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

      for (const key in q.pairs.correctMap) {
        if (q.pairs.correctMap[key] === rIndex) {
          q.pairs.correctMap[key] = 0;
        } else if (q.pairs.correctMap[key] > rIndex) {
          q.pairs.correctMap[key]--;
        }
      }
    },
    onPairLeftImageChange(event, qIndex, lIndex) {
      const file = event.target.files[0];
      const left = this.exercises[qIndex].pairs.left[lIndex];
      if (file) {
        left.file = file;
        left.preview = URL.createObjectURL(file);
      } else {
        left.file = null;
        left.preview = null;
      }
    },

    onPairRightImageChange(event, qIndex, rIndex) {
      const file = event.target.files[0];
      const right = this.exercises[qIndex].pairs.right[rIndex];
      if (file) {
        right.file = file;
        right.preview = URL.createObjectURL(file);
      } else {
        right.file = null;
        right.preview = null;
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
        this.exercises.forEach((q, qIndex) => {
          // Для answers
          (q.answers || []).forEach((a, aIndex) => {
            if (a.isImage && a.file) {
              formData.append(`images[q${qIndex}][a${aIndex}]`, a.file);
            }
          });

          // Для pairs
          if (q.type === "pair") {
            (q.pairs.right || []).forEach((r, rIndex) => {
              if (r.isImage && r.file) {
                formData.append(`pairImages[q${qIndex}][r${rIndex}]`, r.file);
              }
            });

            (q.pairs.left || []).forEach((l, lIndex) => {
              if (l.isImage && l.file) {
                formData.append(`pairImages[q${qIndex}][l${lIndex}]`, l.file);
              }
            });
          }
        });


        const res = await axios.post(`${BackURL}/test`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenAuthTeacher")}`,
            "Content-Type": "multipart/form-data"
          }
        });

        this.message = `Тест створено! Надішліть код учням, Code:${res.data.id}`;
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

.upload-label {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  background: #2f2f33;
  border-radius: 8px;
  border: 1px dashed #555;
  cursor: pointer;
  color: #ccc;
}

.upload-label:hover {
  background: #282f4a;
  color: #acbaed;
}

.upload-label input {
  display: none;
}

.preview-img {
  max-width: 240px;
  max-height: 240px;
  margin-left: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
