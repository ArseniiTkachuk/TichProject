<template>
  <section class="profile-page" @click="closeMobileMenu">
    <!-- HEADER -->
    <header class="profile-header">
      <div class="profile-left">
        <div class="avatar">
          <img :src="user.imageUrl" alt="Avatar" />
        </div>
        <h1 class="name">{{ user.name || "Мій профіль" }}</h1>
      </div>

      <div class="profile-right">
        <!-- Desktop кнопки -->
        <div class="buttons-desktop">
          <button class="action-btn primary" @click="$router.push('/createTest')">➕ Створити тест</button>
          <button class="action-btn" @click="goToMyTests">📚 Мої тести</button>
          <button class="action-btn" @click="goToResults">📊 Результати</button>
          <button class="action-btn" @click="goToSettings">⚙️ Налаштування</button>
          <button class="action-btn danger" @click="logout">🚪 Вийти</button>
        </div>

        <!-- Mobile menu -->
        <div class="menu-mobile" @click.stop>
          <button class="menu-btn" @click.stop="toggleMobileMenu">⋮</button>
          <div v-if="mobileMenuOpen" class="mobile-dropdown">
            <button class="action-btn primary" @click="$router.push('/createTest')">➕ Створити тест</button>
            <button class="action-btn" @click="goToMyTests">📚 Мої тести</button>
            <button class="action-btn" @click="goToResults">📊 Результати</button>
            <button class="action-btn" @click="goToSettings">⚙️ Налаштування</button>
            <button class="action-btn danger" @click="logout">🚪 Вийти</button>
          </div>
        </div>
      </div>
    </header>

    <!-- TEST CARDS -->
    <main class="profile-content">
      <div class="tests-grid">
        <div class="test-card" v-for="test in userTests" :key="test.id">
          <h3 class="test-title">{{ test.title }}</h3>
          <transition name="slide-task" mode="out-in">
            <div class="test-task-window" :key="test.currentTaskIndex">
              {{ test.tasks[test.currentTaskIndex] }}
            </div>
          </transition>
        </div>
      </div>
    </main>
  </section>
</template>

<script>
import axios from "axios";
const BackURL = "http://localhost:2222";

export default {
  name: "ProfilePage",
  data() {
    return {
      user: { name: "", imageUrl: "" },
      mobileMenuOpen: false,
      userTests: [
        { id: 1, title: "Тест 1", tasks: ["В якому році було зруйновано Річ посполину", "Встановіть відповідність", "Скільки речень у ньому"], currentTaskIndex: 0 },
        { id: 2, title: "Тест 2", tasks: ["Завдання A", "Завдання B"], currentTaskIndex: 0 },
        { id: 3, title: "Тест 3", tasks: ["Завдання X", "Завдання Y", "Завдання Z"], currentTaskIndex: 0 },
        { id: 4, title: "Тест 4", tasks: ["Завдання M", "Завдання N"], currentTaskIndex: 0 }
      ]
    };
  },
  mounted() {
    this.fetchUser();
    // оновлюємо завдання кожні 5 секунд
    setInterval(this.updateTasks, 5000);
  },
  methods: {
    async fetchUser() {
      try {
        const res = await axios.get(`${BackURL}/auth`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("tokenAuthTeacher")}` }
        });
        this.user = {
          name: res.data.name,
          imageUrl: res.data.imageUrl ? BackURL + res.data.imageUrl : ""
        };
      } catch (err) {
        console.error(err);
      }
    },
    updateTasks() {
      this.userTests = this.userTests.map(test => {
        if (!test.tasks || test.tasks.length === 0) return test;
        const nextIndex = (test.currentTaskIndex + 1) % test.tasks.length;
        return { ...test, currentTaskIndex: nextIndex };
      });
    },
    logout() { localStorage.removeItem("tokenAuthTeacher"); localStorage.removeItem("userId"); this.$router.push("/login"); },
    goToMyTests() { this.$router.push("/myTests"); },
    goToResults() { this.$router.push("/results"); },
    goToSettings() { this.$router.push("/settings"); },
    toggleMobileMenu() { this.mobileMenuOpen = !this.mobileMenuOpen; },
    closeMobileMenu() { this.mobileMenuOpen = false; }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto Slab', serif;
}

.profile-page {
  min-height: 100vh;
  width: 100%;
  padding-top: 80px;
  color: #fff;
}

/* HEADER */
.profile-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 100;
  backdrop-filter: blur(6px);
}

.profile-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #fff, #e6dfff);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

/* DESKTOP BUTTONS */
.profile-right .buttons-desktop {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.6);
  cursor: pointer;
  color: white;
  background: linear-gradient(135deg, #4d0cff, #b000f8, #ff00b3);
  transition: all 0.2s;
}

.action-btn:hover {
  transform: scale(1.05);
  border-color: #fff;
  box-shadow: 0 4px 12px rgba(255, 0, 179, 0.4);
}

.action-btn.primary {
  font-weight: 700;
}

.action-btn.danger {
  background: linear-gradient(135deg, #ff4d4d, #ff0000);
  border-color: rgba(255, 77, 77, 0.6);
}

/* MOBILE MENU */
.menu-mobile {
  display: none;
  position: relative;
}

.menu-btn {
  font-size: 22px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
}

.mobile-dropdown {
  position: absolute;
  top: 35px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(0, 0, 0, 0.4);
  padding: 8px;
  border-radius: 8px;
  z-index: 100;
}

/* TEST CARDS GRID */
.tests-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  width: 100%;
  padding: 0 10px;
}

.test-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
}

.test-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

.test-title {
  font-size: 18px;
  font-weight: 700;
}

.test-task-window {
  border: 2px solid rgba(255, 255, 255, 0.5); /* рамка */
  border-radius: 8px; /* округлі кути */
  padding: 10px;
  min-height: 50px; /* мінімальна висота */
  background: rgba(255, 255, 255, 0.1); /* напівпрозорий фон */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  opacity: 0.9;
  transition: all 0.2s;
}

/* ховер-ефект всередині картки (необов'язково) */
.test-task-window:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #fff;
}


/* Анімація перелистування завдань */
.slide-task-enter-active,
.slide-task-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-task-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-task-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-task-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.slide-task-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* RESPONSIVE */
@media(max-width:768px) {
  .profile-right .buttons-desktop {
    display: none;
  }

  .menu-mobile {
    display: block;
  }

  .profile-header {
    padding: 10px 15px;
  }
}




</style>
