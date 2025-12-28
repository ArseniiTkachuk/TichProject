<template>
    <section class="settings-page">
        <header class="settings-header">
            <h1>⚙️ Налаштування профілю</h1>
        </header>

        <div class="settings-content">
            <!-- Аватар -->
            <div class="avatar-section">
                <h3>Аватар</h3>
                <div class="avatar-preview">
                    <img v-if="preview || user.imageUrl" :src="preview || user.imageUrl" alt="Avatar" />
                    <span v-else>👤</span>
                </div>
                <input type="file" accept="image/*" @change="onAvatarChange" />
            </div>

            <!-- Ім'я -->
            <div class="name-section">
                <h3>Ім’я</h3>
                <input v-model="user.name" placeholder="Введіть ім’я" class="name-input" />
            </div>

            <div class="buttons">
                <button class="btn-save" @click="saveProfile">💾 Зберегти зміни</button>
                <button class="btn-cancel" @click="$router.back()">↩ Відміна</button>
            </div>

            <!-- Кнопки для тестових toast -->
            <div class="toast-buttons">
                <button class="btn-success"
                    @click="$root.showToast('Це успішне повідомлення!', 'success')">Success</button>
                <button class="btn-error" @click="$root.showToast('Це помилка!', 'error')">Error</button>
                <button class="btn-info" @click="$root.showToast('Це інформаційне повідомлення!', 'info')">Info</button>

            </div>
        </div>
    </section>
</template>

<script>
import axios from "axios";
const BackURL = "http://localhost:2222";

export default {
    name: "ProfileSettings",
    data() {
        return {
            user: { name: "", imageUrl: "" },
            preview: null,
            avatarFile: null,
            toasts: [],
            toastIdCounter: 0,
        };
    },
    mounted() {
        this.fetchUser();
    },
    methods: {
        async fetchUser() {
            try {
                const res = await axios.get(`${BackURL}/auth`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("tokenAuthTeacher")}` }
                });
                this.user = { name: res.data.name, imageUrl: BackURL + res.data.imageUrl };
            } catch (err) {
                console.error(err);
                this.showToast("Помилка завантаження профілю", "error");
            }
        },
        onAvatarChange(event) {
            const file = event.target.files[0];
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

                await axios.put(`${BackURL}/auth/update`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("tokenAuthTeacher")}`,
                        "Content-Type": "multipart/form-data"
                    }
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

.settings-page {
    min-height: 100vh;
    width: 95%;
    max-width: 600px;
    margin: 40px auto;
    background: #f5f6f8;
    border-radius: 20px;
    padding: 30px 25px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.settings-header h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 30px;
    text-align: center;
}

.avatar-preview {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fff, #e6dfff);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
}

.avatar-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

input[type="file"],
input[name="name"] {
    width: 100%;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid #ccc;
    font-size: 15px;
    margin-top: 8px;
}

input:focus {
    outline: none;
    border: 2px solid #b000f8;
}

.buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 20px;
}

.btn-save,
.btn-cancel {
    padding: 12px 18px;
    border-radius: 12px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    color: white;
    transition: all 0.3s;
}

.btn-save {
    background: linear-gradient(135deg, #4d0cff, #b000f8, #ff00b3);
}

.btn-cancel {
    background: linear-gradient(135deg, #ff4d4d, #ff0000);
}

.btn-save:hover,
.btn-cancel:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(255, 0, 179, 0.5);
}


/* Toast buttons */
.toast-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
}

.toast-buttons button {
    padding: 10px 15px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-success {
    background: #28a745;
}

.btn-error {
    background: #dc3545;
}

.btn-info {
    background: #17a2b8;
}

.toast-buttons button:hover {
    opacity: 0.85;
}

</style>
