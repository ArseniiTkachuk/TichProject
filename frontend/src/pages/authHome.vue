<template>
  <section class="profile-page">
    <!-- Верх профілю -->
    <header class="profile-header">
      <div class="avatar">👤</div>

      <div class="user-info">
        <h1 class="name">Мій профіль</h1>
        <p class="role">Викладач · Автор тестів</p>
      </div>
    </header>

    <!-- Дії -->
    <main class="profile-actions">
      <button class="action-btn primary" @click="$router.push('/createTest')">
        ➕ Створити тест
      </button>

      <button class="action-btn" @click="goToMyTests">
        📚 Мої тести
      </button>

      <button class="action-btn" @click="goToResults">
        📊 Результати проходжень
      </button>

      <button class="action-btn" @click="goToSettings">
        ⚙️ Налаштування профілю
      </button>

      <button class="action-btn danger" @click="logout">
        🚪 Вийти з акаунту
      </button>
    </main>
  </section>
</template>

<script>
export default {
  name: "ProfilePage",
  methods: {
    goToMyTests() {
      alert("Тут буде список створених тестів")
    },
    goToResults() {
      alert("Тут буде статистика проходжень")
    },
    goToSettings() {
      alert("Тут будуть налаштування профілю")
    },
    logout() {
      localStorage.removeItem("tokenAuthTeacher")
      localStorage.removeItem("userId")
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 60px 80px;
  color: #fff;
}

/* Верх профілю */
.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 50px;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffffff, #e6dfff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  color: #4d0cff;
}

.name {
  margin: 0;
  font-size: 34px;
  font-weight: 700;
}

.role {
  margin-top: 6px;
  font-size: 15px;
  opacity: 0.85;
}

/* Кнопки */
.profile-actions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.action-btn {
  padding: 18px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s;
}

.action-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.28);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

/* Основна дія */
.action-btn.primary {
  background: linear-gradient(135deg, #ffffff, #e6dfff);
  color: #4d0cff;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #ffffff, #d9d2ff);
}

/* Небезпечна */
.action-btn.danger {
  background: rgba(255, 80, 80, 0.25);
}

.action-btn.danger:hover {
  background: rgba(255, 80, 80, 0.4);
}

/* Адаптив */
@media (max-width: 768px) {
  .profile-page {
    padding: 40px 20px;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>
