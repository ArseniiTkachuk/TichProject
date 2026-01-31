<template>
  <section v-if="isEditPassword" class="profile-settings">
    <button class="btn-back" @click="isEditPassword = false">⬅ Назад</button>

    <header class="profile-header">
      <h1>🔐 Зміна паролю</h1>
    </header>


    <h3 class="h3-newPasswerd">Старий пароль</h3>

    <div class="password-wrapper">
      <input class="input" :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Старий пароль">
      <span class="eye" @click="showPassword = !showPassword">
        <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
          viewBox="0 0 24 24">
          <path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm0-9a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm0-9a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
          <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="2" />
        </svg>
      </span>
    </div>

    <h3 class="h3-newPasswerd">Новий пароль</h3>


    <div class="password-wrapper">
      <input class="input" :type="showPassword1 ? 'text' : 'password'" v-model="newPassword" placeholder="Новий пароль">
      <span class="eye" @click="showPassword1 = !showPassword1">
        <svg v-if="!showPassword1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
          viewBox="0 0 24 24">
          <path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm0-9a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm0-9a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
          <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="2" />
        </svg>
      </span>
    </div>


    <div class="password-wrapper">
      <input class="input" :type="showPassword2 ? 'text' : 'password'" v-model="confirmPassword"
        placeholder="Повторіть новий пароль">
      <span class="eye" @click="showPassword2 = !showPassword2">
        <svg v-if="!showPassword2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
          viewBox="0 0 24 24">
          <path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm0-9a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm0-9a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
          <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="2" />
        </svg>
      </span>
    </div>


    <p v-if="error" class="error">{{ error }}</p>


    <button class="btn" @click="submit" :disabled="false">
      Змінити пароль
    </button>


  </section>
  <section v-else class="profile-settings">
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

      <button class="btn-upload" @click="isEditPassword = true">Змінити пароль</button>


      <!-- Кнопка збереження -->
      <div class="profile-actions">
        <button class="btn-save" @click="saveProfile">💾 Зберегти</button>
      </div>
    </div>
  </section>
</template>

<script>
import api from '@/services/api'

const BACK_URL = import.meta.env.VITE_BACK_URL

export default {
  name: "ProfileSettings",
  data() {
    return {
      showPassword: false,
      showPassword1: false,
      showPassword2: false,

      error: "",


      password: '',
      newPassword: '',
      confirmPassword: "",


      user: { name: "", imageUrl: "" },
      preview: null,
      avatarFile: null,
      isEditPassword: false,
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const res = await api.get(`/auth`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("tokenAuthTeacher")}` },
        });
        this.user = { name: res.data.name, imageUrl: BACK_URL + res.data.imageUrl };
      } catch (err) {
        console.error(err);
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

        await api.patch(`/auth`, formData, {
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
      }
    },

    async submit() {
      this.error = "";
      if (!this.newPassword || !this.confirmPassword || !this.password) {
        this.error = "Заповніть усі поля";
        return;
      }

      if (this.newPassword.length < 6) {
        this.error = "Пароль має містити мінімум 6 символів";
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.error = "Паролі не співпадають";
        return;
      }

      try {

        await api.patch("/editPassword", {
          password: this.password,
          newPassword: this.newPassword,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("tokenAuthTeacher")}` }
        });

        this.$root.showToast("Пароль успішно оновлено")
        this.isEditPassword = false
      } catch (e) {
        this.error = e.response?.data?.message || "Не вдалося змінити пароль";
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
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
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
  box-shadow: 0 4px 15px rgba(77, 12, 255, 0.3);
}

.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(77, 12, 255, 0.5);
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
  box-shadow: 0 6px 20px rgba(77, 12, 255, 0.4);
}

.btn-save:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(77, 12, 255, 0.6);
}



/* === password === */
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  margin-top: 12px;
  position: relative;
}


.password-wrapper input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(246, 186, 212, 0.6);
  font-size: 16px;
  margin-top: 0;
  background: rgba(255, 255, 255, 0.85);
  padding-right: 46px;
}

.password-wrapper input:focus {
  outline: none;
  border: 1px solid #ff00b3;
  box-shadow: 0 0 6px rgba(255, 0, 179, 0.8);
}

.h3-newPasswerd {
  margin-top: 20px;
}


.eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.eye svg {
  display: block;
}


.eye:hover {
  color: #ff00b3;
}

.forget {
  margin-top: 6px;
  padding-right: 5px;
  font-size: 14px;
  color: #fff;
  text-align: right;
  cursor: pointer;
}

.forget:hover {
  text-decoration: underline;
  color: #ff00b3;
}


/* primary button */
.btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  margin-top: 30px;
  background: linear-gradient(135deg, #4d0cff, #b000f8, #ff00b3);
  color: white;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn:hover {
  transform: scale(1.03);
  box-shadow: 0 0 12px rgba(255, 0, 179, 0.6);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


.error {
  margin-top: 12px;
  color: #ff6b6b;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  font-size: 14px;
}
</style>
