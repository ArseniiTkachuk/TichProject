<template>

  <div class="home">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-content">
        <h1>Створюй тести. Проходь. Розвивайся.</h1>
        <p>Платформа для навчання та перевірки знань</p>
        <div v-if="enterCode">
          <button @click="enterCode = false"> Back </button>
          <enterTestCode />
        </div>
        <div v-else class="actions">
          <button class="primary" @click="enterCode = true">Я студент</button>
          <button class="secondary" @click="$router.push('/home')">Я викладач</button>
        </div>
      </div>
    </section>

    <!-- SVG WAVE -->
    <svg class="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
      <path d="M0,80 C240,140 480,20 720,40 960,60 1200,120 1440,80 L1440,0 L0,0 Z" fill="#f6f4ff" />
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
</template>

<script>

import enterTestCode from '@/components/enterTestCode.vue';

export default {
  components: {
    enterTestCode,
  },
  data() {
    return {
      enterCode: false
    }
  },

  methods: {

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

:global(body) {
  margin: 0;
}

/*  GLOBAL  */
.home {
  background: #f6f4ff;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

/* HERO */
.hero {
  min-height: 85vh;
  background: linear-gradient(135deg, #6a00ff, #ff5fd7);
  display: flex;
  align-items: center;
  padding: 80px;
  color: white;

  border-bottom-left-radius: 60px;
  border-bottom-right-radius: 60px;
  position: relative;
  overflow: hidden;
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
}

.hero p {
  font-size: 18px;
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
  display: block;
  width: 100%;
  height: 120px;
  margin-top: -1px;
}

/* WHITE SECTION  */
.white {
  background: white;
  margin: -60px auto 80px;
  max-width: 1200px;
  padding: 60px;
  border-radius: 40px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, .1);
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
    box-shadow: 1px  (#b982f1, #f56abd);

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
