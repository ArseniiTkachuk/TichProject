<template>
  <transition name="fade">
    <div class="loader-overlay">
      <div class="spinner"></div>
      <p>Завантаження...</p>
    </div>
  </transition>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // 1. Отримуємо весь хеш після символу #
  const hash = window.location.hash; 
  
  // 2. Витягуємо частину з параметрами (все, що після ?)
  const queryString = hash.split('?')[1];
  
  if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token');

    if (token) {
      // 3. Записуємо в LocalStorage
      localStorage.setItem( 'tokenAuthTeacher', token);
      
      // 4. Перенаправляємо користувача на головну сторінку або в профіль
      router.push('/home'); 
    } else {
      console.error('Токен не знайдено в URL');
      this.$root.showToast("Помилка", "error")
      router.push('/login');
    }
  } else {
      console.error('Токен не знайдено в URL');
      this.$root.showToast("Помилка", "error")
      router.push('/login');
  }
});
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  color: #fff;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

