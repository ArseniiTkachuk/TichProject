<template>
  <section class="profile-page">
    <!-- HEADER -->
    <header class="profile-header">
      <div class="avatar">
        <img :src="user.imageUrl" alt="Avatar" />
      </div>

      <div class="user-info">
        <h1 class="name">{{ user.name || "Мій профіль" }}</h1>
        <p class="role">Викладач · Автор тестів</p>
      </div>
    </header>

    <!-- ACTION LIST -->
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
import axios from "axios";

const BackURL = "http://localhost:2222";

export default {
  name: "ProfilePage",

  data() {
    return {
      user: {
        name: "",
        imageUrl: ""
      }
    };
  },

  mounted() {
    this.fetchUser();
  },

  methods: {
    async fetchUser() {
      try {
        const res = await axios.get(`${BackURL}/auth`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenAuthTeacher")}`
          }
        });

        this.user = {
          name: res.data.name,
          imageUrl: res.data.imageUrl ? BackURL + res.data.imageUrl : ""
        };
      } catch (err) {
        console.error("fetchUser error:", err);
      }
    },

    logout() {
      localStorage.removeItem("tokenAuthTeacher");
      localStorage.removeItem("userId");
      this.$router.push("/login");
    },

    goToMyTests() {
      this.$router.push("/myTests");
    },

    goToResults() {
      this.$router.push("/results");
    },

    goToSettings() {
      this.$router.push("/settings");
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

.profile-page {
  min-height: 100vh;
  width: 95%;
  max-width: 900px;
  margin: 30px auto;
  background-color: #f5f6f8;
  border-radius: 25px;
  padding: 30px 40px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* HEADER */
.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #ffffff, #e6dfff);
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info .name {
  font-size: 32px;
  font-weight: 700;
}

.user-info .role {
  margin-top: 4px;
  font-size: 14px;
  opacity: 0.85;
}

/* BUTTONS */
.action-btn {
  padding: 14px 20px;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  color: white;
  background: linear-gradient(135deg, #4d0cff, #b000f8, #ff00b3);
  transition: all 0.3s;
  text-align: center;
  width: 100%;
  max-width: 320px;
}

.action-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 0, 179, 0.5);
}

.action-btn.primary {
  font-weight: 700;
}

.action-btn.danger {
  background: linear-gradient(135deg, #ff4d4d, #ff0000);
}

/* ACTION CONTAINER */
.profile-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .profile-page {
    padding: 20px;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .action-btn {
    max-width: 100%;
  }
}
</style>
