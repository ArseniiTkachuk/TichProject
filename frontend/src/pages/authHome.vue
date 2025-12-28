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
          <button class="action-btn" @click="goToSettings">⚙️ Налаштування</button>
          <button class="action-btn danger" @click="showModalRemote = true">🚪 Вийти</button>
        </div>

        <!-- Mobile menu -->
        <div class="menu-mobile" @click.stop>
          <button class="menu-btn" @click.stop="toggleMobileMenu">⋮</button>
          <div v-if="mobileMenuOpen" class="mobile-dropdown">
            <button class="action-btn primary" @click="$router.push('/createTest')">➕ Створити тест</button>
            <button class="action-btn" @click="goToSettings">⚙️ Налаштування</button>
            <button class="action-btn danger" @click="showModalRemote = true">🚪 Вийти</button>
          </div>
        </div>
      </div>
    </header>

    <!-- TEST CARDS -->
    <main class="profile-content">
      <div class="tests-grid">
        <div class="test-card" v-for="test in userTests" :key="test.id"
          @click="$router.push(`/checkTest/${test.id}`)">
          <h3 class="test-title">{{ test.title }}</h3>
          <transition name="slide-task" mode="out-in">
            <div class="test-task-window" :key="test.currentTaskIndex">
              {{ test.tasks[test.currentTaskIndex] }}
            </div>
          </transition>
        </div>
        <div v-if="userTests.length < 1">
          <h3 class="test-title">Тут з'являться ваші тести</h3>
        </div>
      </div>
    </main>
  </section>

  <!-- Модальне вікно вийти з профілю -->
  <div v-if="showModalRemote" class="modal-overlay" @click="showModalRemote = false">
    <div class="modal-content delete-modal animated-modal" @click.stop>
      <h2>🚪 Вийти з профілю?</h2>
      <div class="delete-text">
        <p>Ви впевнені, що хочете залишити цей профіль?</p>
      </div>
      <div class="delete-buttons">
        <button @click="logout" class="btn-confirm">🚪 Вийти</button>
        <button @click="showModalRemote = false" class="btn-cancel">Скасувати</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const BACK_URL = import.meta.env.VITE_BACK_URL;

export default {
  name: "ProfilePage",
  data() {
    return {
      user: { name: "", imageUrl: "" },
      mobileMenuOpen: false,
      userTests: [],
      showModalRemote: false,
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
        const res = await axios.get(`${BACK_URL}/auth`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("tokenAuthTeacher")}` }
        });
        this.user = {
          name: res.data.name,
          imageUrl: res.data.imageUrl ? BACK_URL + res.data.imageUrl : ""
        };
        this.userTests = res.data.tests;
      } catch (err) {
        console.error(err);
        this.$root.showToast("Помилка при завантаженні даних користувача", "error")
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
    goToSettings() { this.$router.push("/editProfile"); },
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
  cursor: pointer;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
}

.test-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

.test-title {
  font-size: 18px;
  font-weight: 700;
}

.test-task-window {
  border: 2px solid rgba(255, 255, 255, 0.5);
  /* рамка */
  border-radius: 8px;
  /* округлі кути */
  padding: 10px;
  min-height: 50px;
  /* мінімальна висота */
  background: rgba(255, 255, 255, 0.1);
  /* напівпрозорий фон */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  opacity: 0.9;
  transition: all 0.2s;
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
    background: linear-gradient(135deg, #4d0cff, #b000f8, #ff00b3);
    color: white;
    padding: 50px 40px;
    border-radius: 25px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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

/* Модальне вікно Видалити тест */
.delete-modal {
    background: linear-gradient(135deg, #ff4d4d, #b00000);
    padding: 40px 30px;
    border-radius: 25px;
    color: #fff;
    max-width: 450px;
    width: 90%;
    text-align: center;
    position: relative;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    transform: scale(0.8);
    animation: popIn 0.3s forwards;
}

.delete-modal h2 {
    font-size: 24px;
    margin-bottom: 15px;
}

.delete-text {
    font-size: 16px;
    margin-bottom: 25px;
    opacity: 0.9;
    line-height: 1.4;
}

/* Кнопки */
.delete-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
}

.btn-confirm {
    background: #ff1a1a;
    border: none;
    padding: 10px 25px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    color: #fff;
    transition: all 0.3s;
    box-shadow: 0 5px 15px rgba(255, 26, 26, 0.4);
}

.btn-confirm:hover {
    background: #e60000;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(230, 0, 0, 0.5);
}

.btn-cancel {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    padding: 10px 25px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    color: #fff;
    transition: all 0.3s;
}

.btn-cancel:hover {
    background: rgba(255, 255, 255, 0.35);
    transform: translateY(-2px);
}

/* Закрити модалку */
.delete-modal .btn-close {
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

.delete-modal .btn-close:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.2);
}

/* Анімація */
@keyframes popIn {
    to {
        transform: scale(1);
    }
}
</style>
