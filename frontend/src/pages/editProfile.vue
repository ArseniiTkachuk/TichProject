<template>
  <section class="profile-settings">
    <!-- Кнопка назад -->
    <button class="btn-back" @click="$router.back()">⬅ Назад</button>

    <header class="profile-header">
      <h1>⚙️ Налаштування профілю</h1>
    </header>

    <div class="profile-content">
      <!-- Аватар -->
      <div class="profile-avatar">
        <div class="avatar-preview" :class="{ 'animate-avatar': preview || user.imageUrl }">
          <img v-if="preview || user.imageUrl" :src="preview || user.imageUrl" alt="Avatar" />
          <span v-else>👤</span>
        </div>
        <button class="btn-upload" @click="triggerFileInput">Вибрати аватар</button>
        <input type="file" accept="image/*" ref="avatarInput" @change="onAvatarChange" hidden />
      </div>

      <!-- Ім'я -->
      <div class="profile-name">
        <h3>Ім’я</h3>
        <input v-model="user.name" placeholder="Введіть ім’я" />
      </div>

      <!-- Кнопка збереження -->
      <div class="profile-actions">
        <button class="btn-save" @click="saveProfile">💾 Зберегти</button>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
const BACK_URL = "http://localhost:2222";

export default {
  name: "ProfileSettings",
  data() {
    return {
      user: { name: "", imageUrl: "" },
      preview: null,
      avatarFile: null,
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const res = await axios.get(`${BACK_URL}/auth`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("tokenAuthTeacher")}` },
        });
        this.user = { name: res.data.name, imageUrl: BACK_URL + res.data.imageUrl };
      } catch (err) {
        console.error(err);
        this.$root.showToast("Не вдалося завантажити профіль", "error");
      }
    },
    triggerFileInput() {
      this.$refs.avatarInput.click();
    },
    onAvatarChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.avatarFile = file;
        this.preview = URL.createObjectURL(file);
      }
    },
    async saveProfile() {
      try {
        const formData = new FormData();
        formData.append("name", this.user.name);
        if (this.avatarFile) formData.append("avatar", this.avatarFile);

        await axios.patch(`${BACK_URL}/auth`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenAuthTeacher")}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (this.avatarFile) {
          this.user.imageUrl = this.preview;
          this.avatarFile = null;
        }

        this.$root.showToast("Профіль успішно оновлено!", "success");
      } catch (err) {
        console.error(err);
        this.$root.showToast("Помилка при збереженні профілю", "error");
      }
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto Slab', serif;
}

.profile-settings {
  max-width: 600px;
  margin: 50px auto;
  padding: 40px 30px 60px;
  background: #fefefe;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  position: relative;
  text-align: center;
}

.btn-back {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #4d0cff, #b000f8);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(77,12,255,0.3);
}

.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(77,12,255,0.5);
}

.profile-header h1 {
  font-size: 30px;
  margin-bottom: 40px;
  color: #4d0cff;
}

.profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;
}

.avatar-preview {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: #e6e0ff;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(0.8);
  animation: fadeInAvatar 0.4s forwards;
}

@keyframes fadeInAvatar {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.btn-upload {
  padding: 12px 20px;
  background: #4d0cff;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-upload:hover {
  background: #6e33ff;
  transform: scale(1.05);
}

.profile-name {
  margin-bottom: 30px;
}

.profile-name input {
  width: 80%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.profile-name input:focus {
  outline: none;
  border-color: #4d0cff;
}

.profile-actions {
  margin-top: 10px;
}

.btn-save {
  padding: 18px 40px;
  font-size: 20px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #4d0cff, #b000f8, #ff00b3);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 20px rgba(77,12,255,0.4);
}

.btn-save:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(77,12,255,0.6);
}
</style>
