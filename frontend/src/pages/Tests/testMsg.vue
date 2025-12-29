<template>
  <div class="toast-test-container">
    <h1>Тестування повідомлень</h1>
    
    <div class="buttons-group">
      <h3>Короткі повідомлення</h3>
      <button @click="show('success', 'Операція успішна!')">Success</button>
      <button @click="show('error', 'Сталася помилка!')">Error</button>
      <button @click="show('info', 'Інформаційне повідомлення')">Info</button>
    </div>

    <div class="buttons-group">
      <h3>Довгі повідомлення</h3>
      <button @click="show('success', longMsg)">Success</button>
      <button @click="show('error', longMsg)">Error</button>
      <button @click="show('info', longMsg)">Info</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      longMsg: 'Це дуже довге повідомлення для тестування того, як воно відображається на екрані. Можна вставити багато тексту, щоб перевірити адаптивність та перенесення рядків у сповіщеннях.'
    }
  },
  methods: {
    show(type, message) {
      // Викликаємо глобальний метод для сповіщень
      this.$root.showToast(message, type);
    }
  }
}
</script>

<style scoped>
.toast-test-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
  font-family: 'Roboto', sans-serif;
}

h1 {
  margin-bottom: 30px;
}

.buttons-group {
  margin-bottom: 30px;
}

button {
  margin: 10px;
  padding: 10px 25px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover {
  transform: translateY(-2px);
}

button:nth-child(1) {
  background: #4caf50;
  color: white;
}

button:nth-child(2) {
  background: #f44336;
  color: white;
}

button:nth-child(3) {
  background: #2196f3;
  color: white;
}
</style>
