<template>
  <section v-if="isEditPassword" class="profile-settings">
    <button class="btn-back" @click="isEditPassword = false">⬅ Назад</button>

    <header class="profile-header">
      <h2>🔐 Зміна паролю</h2>
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
      <h2>⚙️ Налаштування профілю</h2>
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
        <h3 class="name_text">Ім’я</h3>
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
  max-width: 420px;
  margin: 50px auto;
  position: relative;
  text-align: center;
  backdrop-filter: blur(14px);
  padding: 40px 10px;
  border-radius: 22px;
  width: 100%;
  background: rgba(200, 200, 200, 0.073);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  border: 1.2px solid rgba(255, 255, 255, 0.35);
}

.btn-back {
  position: absolute;
  top: 17px;
  left: 17px;
  padding: 10px 16px;
  background: transparent;
  color: #fafafa;
  font-weight: 700;
  font-size: 13px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s;
   box-shadow:
  0 1px 9px rgba(177, 202, 189, 0.35),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.btn-back:hover {
  background: #fafafa;
  color: #161817;
  transform: translateY(-1.5px);
/*  background: rgba(224, 224, 224, 0.09);*/
  box-shadow:
  0 6px 17px rgba(206, 224, 215, 0.35),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.profile-header h2 {
  color: #fafafa;
  font-size: 32px;
  margin: 40px auto 17px;
  text-shadow: 1px 1px 2px rgba(243, 242, 242, 0.5);
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
   box-shadow: 0 6px 26px rgba(31, 30, 30, 0.3);
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
  background: rgba(183, 183, 183, 0.125);
  box-shadow: 0 6px 26px rgba(31, 30, 30, 0.3);
  border: 0.2px solid #fafafa;
  color: #eeedede7;
  font-weight: 500;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-upload:hover {
  background: #f7f7f7;
  box-shadow:
    0 6px 17px rgba(206, 224, 215, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  color: rgba(31, 31, 31, 0.919);
  transform: scale(1.02);
}

.name_text {
  color: #fafafa;
  padding-bottom: 5px;

}

.profile-name {
  margin-bottom: 15px;
}

.profile-name input {
  width: 80%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #ccc;
  font-size: 16px;
    transition:
    border 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease
  }

.profile-name input:focus {
  outline: none;
  border: 1px solid rgba(107, 255, 179, 0.4);
  box-shadow:
    0 0 0 1px rgba(107, 255, 179, 0.4),
    0 8px 20px rgba(93, 255, 154, 0.35);
  transform: scale(1.02);
}

.profile-actions {
  margin-top: 12px;
}

.btn-save {
  padding: 18px 40px;
  margin-top: 5px;
  font-size: 20px;
  border-radius: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(107, 255, 179, 0.4);
  background: linear-gradient(135deg, #34c98a, #1e6f50);
  color: #fafafa;

  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-save:hover {
    transform: scale(1.02);
 box-shadow:
  0 8px 20px rgba(63, 220, 140, 0.35),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.25s ease;
  background: linear-gradient(135deg, #34c98a, #1e6f50);
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
  width: 340px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: 16px;
  margin: 0px auto;
  background: #ffffffef;
  text-align: left;
    transition:
    border 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.password-wrapper input:focus {
  outline: none;
  border: 1px solid rgba(107, 255, 179, 0.4);
  box-shadow:
    0 0 0 1px rgba(107, 255, 179, 0.4),
    0 8px 20px rgba(93, 255, 154, 0.35);
  transform: scale(1.02);
}

.h3-newPasswerd {
  margin-top: 20px;
  color: #ffffffef;
}


.eye {
  position: absolute;
  right: 37px;
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
  color: #3daa80de;
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
  width: 340px;
  padding: 12px;
  font-size: 16px;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 30px;
  border: 1px solid rgba(107, 255, 179, 0.4);
  background: linear-gradient(135deg, #34c98a, #1e6f50);
  color: #fafafa;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn:hover {
  transform: scale(1.02);
  box-shadow:
  0 8px 20px rgba(63, 220, 140, 0.35),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.25s ease;
  background: linear-gradient(135deg, #34c98a, #1e6f50);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


.error {
  margin: 15px auto 0;
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
  width: 340px;

  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.25),
    0 0 12px rgba(255, 80, 80, 0.2);

  animation: fadeSlide 0.3s ease;
}

@media (max-width: 480px) {

  .profile-settings {
    margin: 15% auto;
    padding: 30px 15px;
    max-width: 95%; /* Залишаємо невеликі відступи по боках */
    border-radius: 18px;
  }

  .profile-header h2 {
    font-size: 24px; /* Менший заголовок для вузьких екранів */
    margin: 35px auto 15px;
  }

  .avatar-preview {
    width: 110px;
    height: 110px;
  }

  /* Поля вводу робимо на всю доступну ширину */
  .profile-name input,
  .password-wrapper input,
  .btn {
    width: 100%;
    max-width: 100%;
    font-size: 15px;
  }

  .password-wrapper {
    width: 100%;
    padding: 0 5px;
  }

  /* Коригуємо позицію ока в інпуті */
  .eye {
    right: 20px;
  }

  .btn-save {
    width: 100%;
    padding: 15px;
    font-size: 18px;
  }

  .btn-back {
    padding: 8px 12px;
    font-size: 12px;
    top: 12px;
    left: 12px;
  }

  .h3-newPasswerd {
    font-size: 18px;
    margin-top: 15px;
  }

  .profile-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .profile-name, .profile-actions {
    width: 100%;
  }
}

</style>
