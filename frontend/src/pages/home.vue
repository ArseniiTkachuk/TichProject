<template>

  <div class="home">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-content">
        <h1>{{ displayText[0] }}
          <span v-if="textIndex === 0" class="cursor">|</span>
        </h1>
        

        <p>{{ displayText[1] }}
          <span v-if="textIndex === 1" class="cursor">|</span>
        </p>
        

        <div class="actions">
          <button class="primary" @click="enterCode = true">Я студент</button>
          <button class="secondary" @click="$router.push('/home')">Я викладач</button>
        </div>
      </div>
    </section>

    <!-- SVG WAVE -->
    <svg class="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
      <path d="M0,80 C240,140 480,20 720,40 960,60 1200,120 1440,80 L1440,0 L0,0 Z" fill="#f4f2f2" />
    </svg>

    <!-- HOW IT WORKS -->
    <section class="white">
      <h2>Як це працює?</h2>
      <div class="steps">
        <div class="step">✍️ Створи тест</div>
        <div class="step">🎯 Поділись посиланням</div>
        <div class="step">🏆 Отримай результат</div>
      </div>
    </section>


  </div>

  <div v-if="enterCode" class="modal-overlay" @click="enterCode = false">
    <div class="modal-card" @click.stop>

      <h2 class="modal-title">Введіть код тесту</h2>

      <input v-model="testCode" placeholder="Enter code" class="modal-input">

      <button class="modal-btn" @click="$router.push(`/test/${testCode}`)"> Go </button>

    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      enterCode: false,
      testCode: '',

      texts: [
        "Створюй тести. Проходь. Розвивайся.",
        "Платформа для навчання та перевірки знань"
      ],
      displayText: ["", ""], // окремо для h1 і p
      textIndex: 0,
      charIndex: 0,
      typeSpeed: 55
    }
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
    }
  }
}

</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Quicksand:wght@300..700&display=swap');

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
  0%   { opacity: 1; }
  50%  { opacity: 0; }
  100% { opacity: 1; }
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
  padding: 30px 35px;
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
}

.modal-input:focus {
  outline: none;
  border: 1px solid #ff00b3;
  box-shadow: 0 0 6px rgba(255, 0, 179, 0.8);
}

/* ===== ERROR ===== */
.modal-error {
  color: rgb(255, 200, 200);
  font-size: 14px;
  margin-bottom: 10px;
}

/* ===== BUTTON ===== */
.modal-btn {
  width: 100%;
  padding: 12px;
  font-size: 17px;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  background: linear-gradient(135deg,
      #4d0cff,
      #b000f8,
      #ff00b3);
  color: white;
  transition: transform 0.3s, box-shadow 0.3s;
}

.modal-btn:hover {
  transform: scale(1.03);
  box-shadow: 0 0 12px rgba(255, 0, 179, 0.6);
}



:global(body) {
  margin: 0;
}

/*  GLOBAL  */
.home {
  background: #f4f2f2;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

/* HERO */
.hero {
  min-height: 85vh;
  background: #222223;
background: linear-gradient(
  160deg, 
  rgba(34, 34, 35, 1) 8%, 
  rgba(44, 44, 48, 1) 35%, 
  rgba(56, 56, 61, 1) 76%, 
  rgba(75, 75, 82, 1) 100%
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
}

.hero p {
  font-size: 18px;
  text-shadow: 1px 1px 2px rgba(243, 242, 242, 0.5);
}

/* Buttons */
.actions {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.primary {
  background: white;
  color: #6a00ff;
  padding: 14px 32px;
  border-radius: 30px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.secondary {
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 14px 32px;
  border-radius: 30px;
  cursor: pointer;
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
  background: white;
  margin: -60px auto 80px;
  max-width: 1200px;
  padding: 60px;
  border-radius: 40px;
  box-shadow: 1px 3px 7px rgba(151, 149, 149, 0.5);
  position: relative;
  z-index: 2;
  
}

.steps {
  display: flex;
  gap: 30px;
  margin-top: 40px;
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
