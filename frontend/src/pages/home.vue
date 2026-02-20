<template>
  <div class="home">
    <!-- HERO -->
    <section class="hero">
      <div class="hero-content">
        <h1>
          {{ displayText[0] }}
          <span v-if="textIndex === 0" class="cursor">|</span>
        </h1>

        <p>
          {{ displayText[1] }}
          <span v-if="textIndex === 1" class="cursor">|</span>
        </p>

        <div class="actions">
          <button class="primary" @click="enterCode = true">
            <span>Я студент</span>
          </button>
          <button class="secondary" @click="$router.push('/home')">
            <span>Я викладач</span>
          </button>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="white">
      <h2>Як це працює?</h2>
      <div class="steps">
        <div class="step1">✍️ Створи тест</div>
        <div class="step2">🎯 Поділись посиланням</div>
        <div class="step3">🏆 Отримай результат</div>
      </div>
    </section>
  </div>

  <div v-if="enterCode" class="modal-overlay" @click="enterCode = false">
    <div class="modal-card" @click.stop>
      <h2 class="modal-title">Введіть код тесту</h2>

      <form @submit.prevent="$router.push(`/test/${testCode}`)">
        <input
          v-model="testCode"
          placeholder="Enter code"
          class="modal-input"
          required
        />

        <button type="submit" class="modal-btn">
          <span>Go</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      enterCode: false,
      testCode: "",

      texts: [
        "Створюй тести. Проходь. Розвивайся.",
        "Платформа для навчання та перевірки знань",
      ],
      displayText: ["", ""], // окремо для h1 і p
      textIndex: 0,
      charIndex: 0,
      typeSpeed: 55,
    };
  },

  mounted() {
    this.type();
  },

  methods: {
    type() {
      if (this.textIndex >= this.texts.length) return;

      this.displayText[this.textIndex] +=
        this.texts[this.textIndex][this.charIndex];

      this.charIndex++;

      if (this.charIndex < this.texts[this.textIndex].length) {
        setTimeout(this.type, this.typeSpeed);
      } else {
        // переходимо до наступного тексту
        this.textIndex++;
        this.charIndex = 0;
        setTimeout(this.type, 400);
      }
    },
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Quicksand:wght@300..700&display=swap");

* {
  margin: 0;
  padding: 0;
  font-family: "Playfair Display", serif;
}

.cursor {
  display: inline-block;
  margin-left: 2px;
  font-weight: 400;
  animation: blink 1.5s steps(2, start) infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* ===== MODAL OVERLAY ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-text {
  color: white;
  font-size: 15px;
  margin-bottom: 20px;
  opacity: 0.9;
}

/* ===== MODAL CARD ===== */
.modal-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(14px);
  padding: 30px 35px 25px;
  border-radius: 22px;
  width: 90%;
  max-width: 360px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.35);
  margin: 10px;
}

/* ===== TITLE ===== */
.modal-title {
  color: white;
  font-size: 22px;
  margin-bottom: 18px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* ===== INPUT ===== */
.modal-input {
  width: 90%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  font-size: 16px;
  margin-bottom: 10px;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.modal-input:focus {
  outline: none;
  border: 1px solid rgba(107, 255, 179, 0.4);
  box-shadow: 0 8px 20px rgba(93, 255, 154, 0.35);
  transform: scale(1.02);
}

/* ===== ERROR ===== */
.modal-error {
  color: rgb(255, 200, 200);
  font-size: 14px;
  margin-bottom: 10px;
}

/* ===== BUTTON ===== */
.modal-btn {
  margin-top: 10px;
  width: 100%;
  padding: 12px;
  font-size: 17px;
  border-radius: 12px;
  cursor: pointer;
  border: solid 1px #fafafa;
  background: none;
  color: #fafafa;
  position: relative;
  overflow: hidden;
  transition:
    color 0.4s ease,
    transform 0.3s ease;
}

.modal-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #5fe6a0, #34c987);
  opacity: 0;
  transition: opacity 0.8s ease; /* <- повільніше і плавніше */
  z-index: 0;
  border-radius: 12px;
}

.modal-btn span {
  position: relative;
  z-index: 1;
}

.modal-btn:hover {
  border: none;
  transform: scale(1.03) translateY(-1px);
  color: #000;
  box-shadow: 0 8px 20px rgba(93, 255, 154, 0.35);
}

.modal-btn:hover::before {
  opacity: 1; /* фон плавно з’являється */
}

:global(body) {
  margin: 0;
}

/*  GLOBAL  */
.home {
  background: #f4f2f2;
  font-family: "Inter", sans-serif;
  overflow-x: hidden;
}

/* HERO */
.hero {
  min-height: 85vh;
  background: #4b4b52;
  background: linear-gradient(
    180deg,
    #1f2423 0%,
    #242d2b 40%,
    #2e3b38 70%,
    #465c57 100% /* <-- світліше і тепліше */
  );
  display: flex;
  align-items: center;
  padding: 80px;
  color: white;

  border-bottom-left-radius: 60px;
  border-bottom-right-radius: 60px;
  position: relative;
  overflow: hidden;
  box-shadow: 3px 5px 6px rgba(69, 68, 68, 0.5);
}

.hero::before {
  content: "";
  position: absolute;
  inset: -20%;
  background: radial-gradient(
    circle at 30% 20%,
    rgba(107, 255, 179, 0.08),
    transparent 60%
  );
  z-index: 0;
}

/* Content above blobs */
.hero-content {
  max-width: 600px;
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: 52px;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(243, 242, 242, 0.5);
  min-height: 130px;
}

.hero p {
  font-size: 18px;
  min-height: 26px;
  text-shadow: 1px 1px 2px rgba(243, 242, 242, 0.5);
}

/* Buttons */
.actions {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.primary {
  width: 250px;
  position: relative;
  overflow: hidden;
  color: black;
  border: 1px solid rgba(107, 255, 179, 0.4);
  background: white;
  padding: 14px 32px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(93, 255, 154, 0.35);
}

.primary::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #6bffb3, #3fdc8c);
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 0;
}

.primary:hover::before {
  opacity: 1;
}

.primary span {
  position: relative;
  z-index: 1;
}

.secondary {
  width: 250px;
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 14px 32px;
  border-radius: 30px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  color: rgb(240, 238, 238);
  font-weight: 600;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.secondary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(93, 255, 154, 0.35);
  border: 1px solid rgba(107, 255, 179, 0.4);
  color: #222223;
}

.secondary::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #6bffb3, #3fdc8c);
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 0;
}

.secondary:hover::before {
  opacity: 1;
}

.secondary span {
  position: relative;
  z-index: 1;
}

/*  SVG WAVE  */
.hero-wave {
  background-color: #f4f2f2;
  display: block;
  width: 100%;
  height: 120px;
}

/* WHITE SECTION  */
.white {
  background: #fafafa;
  margin: 60px auto 60px;
  max-width: 1300px;
  padding: 60px;
  border-radius: 40px;
  box-shadow:
    0 -20px 40px rgba(0, 0, 0, 0.08),
    0 8px 20px rgba(0, 0, 0, 0.12);
  position: relative;
  z-index: 2;
}

.steps {
  display: flex;
  gap: 30px;
  margin-top: 40px;
}

.step1 {
  flex: 1;
  background: linear-gradient(135deg, #fff7c9, #ffe49e);
  color: #4f3a00;

  padding: 30px;
  border-radius: 25px;
  font-size: 20px;

  position: relative;
  overflow: hidden;
  color: #000;
  background-clip: padding-box;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.step1:hover {
  background: linear-gradient(135deg, #ffe08a, #ffc857);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(189, 140, 5, 0.25);
}

.step2 {
  flex: 1;
  background: linear-gradient(135deg, #ffd6d6, #ffbcbc);
  color: #5a1f1f;

  padding: 30px;
  border-radius: 25px;
  font-size: 20px;

  position: relative;
  overflow: hidden;
  color: #000;
  background-clip: padding-box;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.step2:hover {
  background: linear-gradient(135deg, #ff9a9a, #ff8080);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(189, 26, 5, 0.25);
}

.step3 {
  flex: 1;
  background: linear-gradient(135deg, #f9e0ad, #f5cb83);
  color: #6b4720;
  padding: 30px;
  border-radius: 25px;
  font-size: 20px;

  position: relative;
  overflow: hidden;
  color: #000;
  background-clip: padding-box;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.step3:hover {
  background: linear-gradient(135deg, #f7d88c, #eeb55f);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(166, 117, 18, 0.35);
}

.step {
  flex: 1;
  background: linear-gradient(135deg, #f3e7ff, #ffe6f5);
  padding: 30px;
  border-radius: 25px;
  font-size: 20px;

  position: relative;
  overflow: hidden;
  color: #000;
  background-clip: padding-box;
}

.step:hover {
  background: linear-gradient(135deg, #b982f1, #f56abd);
  box-shadow: 1px (#b982f1, #f56abd);
}

@media (max-width: 768px) {
  .hero {
    padding: 40px 20px;
    min-height: 70vh;
    border-bottom-left-radius: 40px;
    border-bottom-right-radius: 40px;
  }

  .hero h1 {
    font-size: 36px;
  }

  .hero p {
    font-size: 16px;
  }

  .actions {
    flex-direction: column;
    gap: 15px;
  }

  .white {
    padding: 30px 20px;
    margin: -40px 15px 40px;
    border-radius: 30px;
  }

  .steps {
    flex-direction: column;
    gap: 20px;
  }

  .step {
    padding: 20px;
    font-size: 18px;
  }
}
</style>
