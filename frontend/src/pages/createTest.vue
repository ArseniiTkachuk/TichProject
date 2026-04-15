<template>
  <div class="test-wrapper">
    <!-- HEADER -->
    <header class="test-header">
      <button @click="$router.back()" class="back-btn">⬅ Назад</button>
      <h1 class="test-title">Створити тест</h1>
      <h3>Кількість питань: {{ qCount }}</h3>
    </header>

    <!-- Назва тесту -->
    <input v-model="title" placeholder="Назва тесту" class="title-input" />

    <div v-for="(q, qIndex) in exercises" :key="qIndex" class="question-block">
    <div class="question-header"><h4>Питання:&nbsp; {{qIndex + 1 }}</h4>
      <button @click="removeQuestion(qIndex)" class="btn-small btn-remove-question">Видалити питання</button>
    </div>
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
            <label v-if="a.preview">
              <img :src="a.preview" class="preview-img" title="Натисніть, щоб змінити" />
              <input class="upload-label-input" type="file" accept="image/*"
                @change="onAnswerImageChange($event, qIndex, aIndex)" :ref="'fileInput-' + qIndex + '-' + aIndex">
            </label>
            <label v-else class="upload-label">
              <span>Вибрати зображення</span>
              <input class="upload-label-input" type="file" accept="image/*"
                @change="onAnswerImageChange($event, qIndex, aIndex)" :ref="'fileInput-' + qIndex + '-' + aIndex">
            </label>
          </div>
          
          <label>
            <template v-if="q.type === 'many'">
              <input class="input_type" type="checkbox" v-model="a.correct" /><p class="number_test">Правильна</p>
            </template>
            <template v-else>
              <input class="input_type" type="radio" :name="'one-' + qIndex" :value="aIndex" v-model="q.correctAnswerIndex" /><p class="number_test"> Правильна </p>
            </template>
          </label>

          <label>
            <input class="input_type" type="checkbox" v-model="a.isImage" /><p class="number_test"> Картинка</p>
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
            <h4 class="colon">Ліва колонка</h4>
            <div v-for="(left, lIndex) in q.pairs.left" :key="'left-' + qIndex + '-' + lIndex" class="pair-row">
              <input v-if="!left.isImage" v-model="left.text" placeholder="Лівий елемент" class="pair-input" />

              <div v-if="left.isImage">
                <label v-if="left.preview">
                  <img :src="left.preview" class="preview-img" title="Натисніть, щоб змінити" />
                  <input class="upload-label-input" type="file" accept="image/*"
                    @change="onPairLeftImageChange($event, qIndex, lIndex)" :ref="'leftFile-' + qIndex + '-' + lIndex">
                </label>
                <label v-else class="upload-label">
                  <span>Вибрати зображення</span>
                  <input class="upload-label-input" type="file" accept="image/*"
                    @change="onPairLeftImageChange($event, qIndex, lIndex)" :ref="'leftFile-' + qIndex + '-' + lIndex">
                </label>
              </div>

              <label>
                <input type="checkbox" v-model="left.isImage" /> Картинка
              </label>

              <select v-model="q.pairs.correctMap[lIndex]" class="lis">
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
            <h4 class="colon">Права колонка</h4>
            <div v-for="(right, rIndex) in q.pairs.right" :key="'right-' + qIndex + '-' + rIndex" class="pair-row">
              <p class="number_test">{{ rIndex + 1 }}</p>
              <input v-if="!right.isImage" v-model="right.text" placeholder="Правий елемент" class="pair-input" />

              <div v-if="right.isImage">
                <label v-if="right.preview">
                  <img :src="right.preview" class="preview-img" title="Натисніть, щоб змінити" />
                  <input class="upload-label-input" type="file" accept="image/*"
                    @change="onPairRightImageChange($event, qIndex, rIndex)"
                    :ref="'rightFile-' + qIndex + '-' + rIndex">
                </label>
                <label v-else class="upload-label">
                  <span>Вибрати зображення</span>
                  <input class="upload-label-input" type="file" accept="image/*"
                    @change="onPairRightImageChange($event, qIndex, rIndex)"
                    :ref="'rightFile-' + qIndex + '-' + rIndex">
                </label>
              </div>

              <label>
                <input class="input_type" type="checkbox" v-model="right.isImage" /> Картинка
              </label>

              <button @click="removeRight(qIndex, rIndex)" class="btn-small">Видалити правий</button>
            </div>
            <button @click="addRight(qIndex)" class="btn-small btn-add">Додати зайвий правий</button>
          </div>
        </div>
      </div>
    </div>
     <p v-if="message" class="message">{{ message }}</p>
    <div class="btn-down">
      <button @click="addQuestion" class="btn-add-question">Додати питання</button>
      <button @click="createTest" class="btn-create-test">Створити тест</button>
    </div>
   </div>

  <!-- Модальне вікно створеного тесту -->
  <div v-if="showModal" class="modal-overlay" @click="showModal = false">
    <div class="modal-content animated-modal" @click.stop>
      <h2>🎉 Тест створено!</h2>
      <div class="modal-el">
        <p><strong>Код тесту:</strong> <span class="code-text">{{ testCode }}</span>
          <button @click="copyToClipboard(testCode)" class="btn-copy">📋</button>
        </p>
      </div>
      <div class="modal-el">
        <strong>Посилання на тест: </strong>
        <p>
          <a :href="testLink" target="_blank">{{ testLink }}</a>
          <button @click="copyToClipboard(testLink)" class="btn-copy">📋</button>
        </p>
      </div>
      <button @click="showModal = false" class="btn-close">✖</button>
    </div>
  </div>

</template>

<script>
import api from '@/services/api'
  

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
      message: "",
      showModal: false,
      testCode: "",
      testLink: "",
    };
  },
  computed: {
    qCount() {
      return this.exercises.length;
    }
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        this.$root.showToast('Скопійовано');
        
      }).catch(err => console.error(err));
    },
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

    removeQuestion(qIndex) {
      this.exercises.splice(qIndex, 1);
    },

    addAnswer(qIndex) {
      this.exercises[qIndex].answers.push({ text: "", correct: false, isImage: false, file: null, preview: null });
    },
    removeAnswer(qIndex, aIndex) { this.exercises[qIndex].answers.splice(aIndex, 1); },
    onAnswerImageChange(event, qIndex, aIndex) {
      const file = event.target.files[0];
      const answer = this.exercises[qIndex].answers[aIndex];
      answer.file = file || null;
      answer.preview = file ? URL.createObjectURL(file) : null;
    },
    addCorrectAnswer(qIndex) { this.exercises[qIndex].correctAnswers.push(""); },
    removeCorrectAnswer(qIndex, rIndex) { this.exercises[qIndex].correctAnswers.splice(rIndex, 1); },
    addLeft(qIndex) {
      const q = this.exercises[qIndex];
      q.pairs.left.push({ text: "", isImage: false, file: null });
      q.pairs.correctMap[q.pairs.left.length - 1] = 0;
      if (q.pairs.right.length < q.pairs.left.length) q.pairs.right.push({ text: "", isImage: false, file: null });
    },
    addRight(qIndex) { this.exercises[qIndex].pairs.right.push({ text: "", isImage: false, file: null }); },
    removeLeft(qIndex, lIndex) {
      const q = this.exercises[qIndex];
      q.pairs.left.splice(lIndex, 1);
      delete q.pairs.correctMap[lIndex];
      const newMap = {};
      q.pairs.left.forEach((_, index) => { newMap[index] = q.pairs.correctMap[index] ?? 0; });
      q.pairs.correctMap = newMap;
    },
    removeRight(qIndex, rIndex) {
      const q = this.exercises[qIndex];
      q.pairs.right.splice(rIndex, 1);
      for (const key in q.pairs.correctMap) {
        if (q.pairs.correctMap[key] === rIndex) q.pairs.correctMap[key] = 0;
        else if (q.pairs.correctMap[key] > rIndex) q.pairs.correctMap[key]--;
      }
    },
    onPairLeftImageChange(event, qIndex, lIndex) {
      const file = event.target.files[0];
      const left = this.exercises[qIndex].pairs.left[lIndex];
      left.file = file || null;
      left.preview = file ? URL.createObjectURL(file) : null;
    },
    onPairRightImageChange(event, qIndex, rIndex) {
      const file = event.target.files[0];
      const right = this.exercises[qIndex].pairs.right[rIndex];
      right.file = file || null;
      right.preview = file ? URL.createObjectURL(file) : null;
    },
    async createTest() {
      if (!this.title || this.exercises.length === 0) { this.message = "Тест має містити назву та хоча б одне питання!"; return; }

      try {
        const formData = new FormData();
        formData.append("title", this.title);

        const exercisesData = this.exercises.map(q => {
          const answers = (q.answers || []).map((a, i) => ({
            text: a.isImage ? undefined : a.text || "",
            correct: q.type === "one" ? i === q.correctAnswerIndex : !!a.correct,
            isImage: !!a.isImage
          }));
          const pairs = q.type === "pair" ? { left: q.pairs.left || [], right: q.pairs.right || [], correctMap: q.pairs.correctMap || {} } : null;
          return { type: q.type, question: q.question || "", answers, correctAnswers: q.correctAnswers || [], pairs };
        });
        formData.append("exercises", JSON.stringify(exercisesData));

        this.exercises.forEach((q, qIndex) => {
          (q.answers || []).forEach((a, aIndex) => { if (a.isImage && a.file) formData.append(`images[q${qIndex}][a${aIndex}]`, a.file); });
          if (q.type === "pair") {
            (q.pairs.right || []).forEach((r, rIndex) => { if (r.isImage && r.file) formData.append(`pairImages[q${qIndex}][r${rIndex}]`, r.file); });
            (q.pairs.left || []).forEach((l, lIndex) => { if (l.isImage && l.file) formData.append(`pairImages[q${qIndex}][l${lIndex}]`, l.file); });
          }
        });

        const res = await api.post(`/test`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("tokenAuthTeacher")}`, "Content-Type": "multipart/form-data" }
        });

        this.$root.showToast('Тест створено');
        this.message = '';
        // Зберігаємо код та посилання
        this.testCode = res.data.id;
        this.testLink = window.location.origin + window.location.pathname + `#/test/${res.data.id}`
        this.showModal = true;
        
      } catch (err) {
        console.error("AxiosError", err);
        this.message = "Помилка при створенні тесту: " + (err.response?.data?.message || err.message);
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto Slab', serif;
}

.test-wrapper {
  backdrop-filter: blur(14px);
  width: 95%;
  max-width: 1000px;
  margin: 15px auto;
  border-radius: 20px;
  padding: 15px;

  background: rgba(200, 200, 200, 0.073);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  border: 1.2px solid rgba(255, 255, 255, 0.35);
}

/* HEADER */
.test-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 15px 20px;
  border-radius: 20px;
  background: rgba(115, 115, 115, 0.684);
  box-shadow: 0 6px 26px rgba(31, 30, 30, 0.3);
  border: 0.1px solid #b1b1b1f8;
  color: #eeedede5;

  /* Додаємо закріплення */
  position: sticky;
  top: 0;
  z-index: 100;
  /* щоб хедер був поверх всього */
}

.test-title {
  font-size: 24px;
  font-weight: 700;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
  flex: 1;
  text-align: center;
}

.back-btn {
  border: none;
  cursor: pointer;
  padding: 8px 18px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.3);
  color: #fafafa;
  font-weight: 600;
  transition: 0.3s;
}

.back-btn:hover {
  background: #fafafaf3;
  color: #161817;
  transform: translateY(-1.2px);
/*  background: rgba(224, 224, 224, 0.09);*/
  box-shadow:
  0 6px 17px rgba(206, 224, 215, 0.35),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
}


h4 {
  color: #eeedede5;
}

.colon {
  margin-top: 12px;
  text-align: center;
}

.p{
  margin-right: 3px;
}

.number_test {
  color: #eeedede5;
}

.title-input {
  width: 500px;
  display: block;
  margin: 20px auto 25px;
  justify-content: center;
  align-items: center;

  font-weight: 500;
}


.lis {
  border-radius: 7px;
}
.input_type:focus {
    box-shadow: none !important;
    border: none !important;
}

/* INPUT / SELECT */
input {
  width: 100%;
  padding: 12px 14px;
  margin-top: 12px;
  border-radius: 12px;
  border: 1px solid #ccc;
  font-size: 16px;
  transition: all 0.3s;
  background-color: #fff;
}

input:focus,
select:focus {
  outline: none;
  border: 1px solid rgba(107, 255, 179, 0.4);
  box-shadow:
    0 0 0 1px rgba(107, 255, 179, 0.4),
    0 8px 20px rgba(93, 255, 154, 0.35);
  transform: scale(1.02);
}

/* BUTTONS */
.btn-remove-question {
  background: linear-gradient(135deg, #ff0000, #ff4d4d);
  margin-top: 10px;
}

.btn-remove-question:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(255, 0, 0, 0.5);
}

.type-select {
   width: 55%;
  padding: 12px 14px;
  margin-top: 12px;
  border-radius: 12px;
  border: 1px solid #ccc;
  font-size: 16px;
  transition: all 0.3s;
  background-color: #fff;

}

.question-header {
  display: flex;
  align-items: center; /* Центрування по вертикалі */
  justify-content: space-between; /* Заголовок зліва, кнопка справа */
}

.btn-small,
.btn-create-test {
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  background: rgba(194, 193, 193, 0.221);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid transparent;
   color: #fafafa;
  
}

.btn-add-question{
    background: transparent ;
  border: 1px solid rgba(255, 255, 255, 0.6);
  width: 165px;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  color: #fafafa;
}

.btn-create-test {
  border: 1px solid rgba(107, 255, 179, 0.4);
  background: linear-gradient(135deg, #34c98a, #1e6f50);
  color: #fafafa;
  width: 165px;

  transition: transform 0.3s, box-shadow 0.3s;

}

.btn-create-test:hover {
  transform: scale(1.02);
  box-shadow:
  0 8px 20px rgba(63, 220, 140, 0.35),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.25s ease;
  background: linear-gradient(135deg, #2eb27b, #1e6f50);
}

.btn-small:hover,
.btn-add-question:hover {
  transform: scale(1.02);
  background: #f7f7f7;
  box-shadow:
    0 3px 5px rgba(206, 224, 215, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.25s ease;
  color: #151515;
}


.btn-add {
  margin-top: 10px;
}


.btn-down {
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}


/* ANSWERS / PAIRS / ENTER */
.answer-row,
.pair-row,
.enter-row {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 13px;
}

.pair-row {
  margin-top: 5px !important;
}

.pairs-block .pair-columns {
  display: flex;
  gap: 20px;
  /* відстань між колонками */
  flex-wrap: wrap;
  /* щоб адаптивно переносило на маленьких екранах */
}

.pairs-block .pair-columns>div {
  flex: 1;
  /* кожна колонка займає половину ширини */
  min-width: 250px;
  /* мінімальна ширина для адаптивності */
}


/* IMAGE PREVIEW */
.preview-img {
  max-width: 120px;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
  margin-top: 5px;
  border: 1px solid #fafafaf3;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.preview-img:hover {
  transform: scale(1.03);
  box-shadow:
  0 6px 17px rgba(206, 224, 215, 0.35),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* UPLOAD BUTTON */
.upload-label {
  display: inline-block;
  padding: 10px 14px;
  border-radius: 12px;
   border: 1px solid rgba(107, 255, 179, 0.4);
  background: linear-gradient(135deg, #34c98a, #1e6f50);
  color: #fafafa;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  margin-top: 5px;
}

.upload-label:hover {
  transform: scale(1.02);
  box-shadow:
  0 8px 20px rgba(63, 220, 140, 0.35),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.25s ease;
  background: linear-gradient(135deg, #2eb27b, #1e6f50);
}

.upload-label-input[type="file"] {
  display: none;
}

/* MESSAGES */
.message {
  margin-top: 15px;
  padding: 14px 18px;
  border-radius: 14px;

  display: flex;
  align-items: center;
  gap: 10px;

  /*  м’який червоний tint + glass */
  background: linear-gradient(
    135deg,
    rgba(255, 80, 80, 0.12),
    rgba(63, 46, 46, 0.45)
  );
  backdrop-filter: blur(8px);

  border: 1px solid rgba(255, 80, 80, 0.3);
  border-left: 4px solid #ff4d4f;

  color: #fce5e5;
  font-weight: 500;
  font-size: 15px;

  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.25),
    0 0 12px rgba(255, 80, 80, 0.2);

  animation: fadeSlide 0.3s ease;
}

/* іконка */
.message::before {
  content: "⚠";
  font-size: 16px;
  color: #ff6b6b;

  /* трохи glow */
  filter: drop-shadow(0 0 6px rgba(255, 80, 80, 0.5));
}

@keyframes fadeSlide {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ADAPTIVE */
@media (max-width: 768px) {

  .answer-row,
  .pair-row,
  .enter-row {
    flex-direction: column;
    gap: 8px;
  }

  .test-title {
    font-size: 20px;
  }

  .btn-small,
  .btn-add-question,
  .btn-create-test {
    width: 100%;
  }

  .preview-img {
    max-width: 100%;
  }
}

/*  MODAL WINDOW */
/* Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 300;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease forwards;
}

/* Modal Box */
.modal-content {
  background: rgba(255, 255, 255, 0.262);
  backdrop-filter: blur(14px);
  color: #fafafa;
  padding: 50px 40px;
  border-radius: 25px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.35);
  max-width: 600px;
  width: 90%;
  text-align: center;
  position: relative;
  transform: scale(0.8);
  animation: popIn 0.3s forwards;
}

/* Animations */
@keyframes popIn {
  to {
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Modal text styles */
.modal-el {
  margin-bottom: 20px;

}

.modal-content h2 {
  margin-bottom: 15px;
  font-size: 26px;
}

.modal-content a {
  color: #fff;
  text-decoration: underline;
  word-break: break-all;
}

.code-text {
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 8px;
  font-family: monospace;
}

/* Copy Button */
.btn-copy {
  margin-left: 10px;
  padding: 5px 12px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transition: all 0.3s;
}

.btn-copy:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
}

/* Close Button */
.btn-close {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 18px;
  cursor: pointer;
  border-radius: 50%;
  padding: 5px 10px;
  transition: all 0.3s;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.2);
}

@media (max-width: 768px) {

    .test-header {
    position: sticky; /* Залишаємо його прикріпленим зверху */
    top: 0;
    z-index: 100;
    display: flex;
    flex-direction: column; /* Елементи (верхній ряд і лічильник) один під одним */
    align-items: center; /* Центруємо все по горизонталі */
    padding: 10px 15px; /* Зменшуємо відступи */
    gap: 0; /* Прибираємо автоматичний відступ між елементами */
  }

  /* Створюємо віртуальний контейнер для верхнього ряду */
  .test-header > .top-row-emulator {
    width: 100%;
    display: flex;
    justify-content: center; /* Головний заголовок ідеально по центру */
    align-items: center;
    position: relative; /* Для позиціонування кнопки відносно цього ряду */
    min-height: 40px; /* Задаємо мінімальну висоту, щоб кнопка влізла */
  }

  /* Кнопка "Назад" - позиціонуємо абсолютно всередині верхнього ряду */
  .back-btn {
    position: absolute;
    left: 10px; /* Притискаємо до лівого краю */
    top: 50%; /* Центруємо вертикально */
    transform: translateY(-50%); /* Корекція для ідеального вертикального центру */
    padding: 6px 10px; /* Компактна кнопка для мобілок */
    font-size: 13px;
    margin: 0; /* Прибираємо зовнішні відступи */
    white-space: nowrap;
    width: auto; /* Щоб кнопка не розтягувалася */
  }

  /* Заголовок "Створити тест" */
  .test-title {
    font-size: 18px; /* Оптимальний розмір для мобілок */
    margin: 0; /* Прибираємо відступи */
    text-align: center;
    width: auto; /* Заголовок займає тільки необхідне місце */
    max-width: 70%; /* Залишаємо місце для кнопки "Назад", щоб не наповзали */
    order: 1; /* Перший елемент у колонці (візуально) */
  }

  /* Кількість питань (h3) */
  .test-header h3 {
    width: 100%; /* Займає всю ширину */
    text-align: center; /* Центруємо текст */
    margin: 8px 0 0 0; /* Відступ ТІЛЬКИ зверху, 8px */
    font-size: 16px; /* Менший шрифт для лічильника */
    color: #e0e0e0;
    order: 2; /* Другий елемент у колонці */
  }

  .title-input {
    width: 100%;
    margin: 15px 0;
  }

  .type-select {
    width: 75%;
  }

  /* питання */
  .question-header {
    margin-top: 10px;
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }


  /* всі рядки стають колонками */
  .answer-row,
  .pair-row,
  .enter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  /* кнопки */
  .btn-small,
  .btn-add-question,
  .btn-create-test {
    width: 100%;
  }


  .btn-small {
    border-radius: 9px;
  }

  /* зображення */
  .preview-img {
    max-width: 100%;
  }

  /* пари */
  .pairs-block .pair-columns {
    flex-direction: column;
  }

  /* модалка */
  .modal-content {
    padding: 25px 15px;
  }

  .answer-row {
    flex-direction: column;
    align-items: stretch;
  }

  /* А ОТ ЧЕКБОКСИ фіксимо */
  .answer-row label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    width: auto; /* важливо */
  }

  .input_type {
    width: auto;
    margin: 0;
  }

  .question-header {
    flex-direction: row; /* В ОДИН РЯД */
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .question-header h4 {
    font-size: 16px;
    margin: 0;
  }

  .btn-remove-question {
    width: auto; /* щоб кнопка не розтягувалась */
   padding: 20px 32px;
    font-size: 19px;
    white-space: nowrap; /* щоб текст не переносився */
  }

  .btn-down {
    margin-top: 25px;
  }
}

@media (max-width: 480px) {

  .test-title {
    font-size: 18px;
  }

  input {
    font-size: 14px;
    padding: 10px;
  }

  .btn-small {
    font-size: 14px;
    padding: 8px;
    margin-top: 5px
  }

  .btn-create-test {
    font-size: 15px;
  }

  .modal-content h2 {
    font-size: 20px;
  }

  input, select, textarea {
  font-size: 16px;
  }

.btn-remove-question {
    font-size: 12px;
    padding: 5px 8px;
  }
}

@media (min-width: 1200px) {
  .test-wrapper {
    width: 60%;
  }

  input, select, textarea {
  font-size: 16px;
 }
}

</style>
