<template>
    <div v-if="test.exercises" class="test-view-container">
        <nav class="navigation">
            <button @click="$router.back()" class="btn-back">

                <span class="arrow">←</span>
                <span class="btn-text">Назад</span>
            </button>

            <button class="btn-share" title="Поділитися тестом" @click="showModal = true">

                <span class="icon">🔗</span>
                <span class="btn-text">Поділитися</span>
            </button>


            <!-- меню -->
            <div class="menu-wrapper" ref="menuWrapper">
                <button class="menu-btn" @click.stop="toggleMenu">⋮</button>
                <div v-if="menuOpen" class="mobile-dropdown">
                    <button class="btn-results" title="Результати тесту" @click="showResultsModal = true">
                        <span class="icon">📊</span>
                        <span>Результати</span>
                    </button>

                    <button class="btn-edit" title="Редагувати тест" @click="editTest">
                        <span class="icon">✏️</span>
                        <span>Редагувати</span>
                    </button>

                    <button class="btn-delete" title="Видалити тест" @click="showModalRemote = true">
                        <span class="icon">🗑️</span>
                        <span>Видалити</span>
                    </button>
                </div>
            </div>



        </nav>

        <header class="test-header">
            <div class="header-content">
                <h1>{{ test.title }}</h1>
                <div class="test-stats">
                    <span class="stat-item">
                        <strong>{{ test.childrens.length }}</strong> проходжень
                    </span>
                    <span class="divider">|</span>
                    <span class="stat-item">
                        <strong>{{ test.exercises.length }}</strong> завдань
                    </span>
                </div>
            </div>
        </header>

        <main class="exercises-list">
            <div v-for="(exercise, index) in test.exercises" :key="exercise.slug || index" class="exercise-card">
                <div class="exercise-badge">Завдання №{{ index + 1 }}</div>

                <div class="exercise-body">
                    <answers v-if="exercise.type === 'one' || exercise.type === 'many'" :ex="exercise" />
                    <enters v-if="exercise.type === 'enter'" :ex="exercise" />
                    <pairs v-if="exercise.type === 'pair'" :ex="exercise" />
                </div>
            </div>
        </main>
    </div>

    <!-- Модальне вікно Поділитися -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
        <div class="modal-content animated-modal" @click.stop>
            <h2>🔗 Поділитися тестом!</h2>
            <div class="modal-el">
                <p><strong>Код тесту:</strong> <span class="code-text">{{ testCode }}</span>
                    <button @click="copyToClipboard(testCode)" class="btn-copy">📋</button>
                </p>
            </div>
            <div class="modal-el">
                <strong>Посилання на тест: </strong>
                <p>
                    <a :href="testLink" target="_blank">{{ testLink }}</a>
                    <button @click="copyToClipboard(testLink)" class="btn-copy">📋</button>
                </p>
            </div>
            <button @click="showModal = false" class="btn-close">✖</button>
        </div>
    </div>

    <!-- Модальне вікно Видалити -->
    <div v-if="showModalRemote" class="modal-overlay" @click="showModalRemote = false">
        <div class="modal-content delete-modal animated-modal" @click.stop>
            <h2>🗑️ Видалити тест?</h2>
            <div class="delete-text">
                <p>Ви впевнені, що хочете видалити цей тест?</p>
                <p> Цю дію не можна буде відмінити.</p>
            </div>
            <div class="delete-buttons">
                <button @click="deleteTest" class="btn-confirm">🗑️ Видалити</button>
                <button @click="showModalRemote = false" class="btn-cancel">Скасувати</button>
            </div>
        </div>
    </div>

    <!-- Модальне вікно Результати -->
    <div v-if="showResultsModal" class="modal-overlay" @click="showResultsModal = false">
        <div class="modal-content animated-modal" @click.stop>
            <h2>📊 Результати тесту</h2>
            <div class="results-list" v-if="test.childrens && test.childrens.length">
                <div v-for="(child, idx) in test.childrens" :key="idx" class="result-card">
                    <div class="result-left">
                        <div class="avatar">
                            {{ child.name.charAt(0).toUpperCase() }}
                        </div>

                        <div class="user-info">
                            <strong>{{ child.name }}</strong>
                            <span class="meta">Виходів: {{ child.leaveCount || 0 }}</span>
                        </div>
                    </div>

                    <div class="result-right">
                        <div class="score">{{ child.scor }}%</div>
                        <div class="progress">
                            <div class="progress-bar" :style="{ width: child.scor + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else>
                <p>Ще ніхто не проходив тест.</p>
            </div>
            <button @click="showResultsModal = false" class="btn-close">✖</button>
        </div>
    </div>



</template>

<script>
import api from '@/services/api'
import answers from '@/components/loockTest/answers.vue';
import enters from '@/components/loockTest/enters.vue';
import pairs from '@/components/loockTest/pairs.vue';

export default {
    components: { answers, enters, pairs },
    data() {
        return {
            test: {},
            showModal: false,
            showModalRemote: false,
            showResultsModal: false,
            testCode: "",
            testLink: "",
            menuOpen: false,
        };
    },
    mounted() {
        this.fetchTest();
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        editTest() {
            const testId = this.$route.params.id;
            this.$router.push({ path: `/editTest/${testId}` });
        },

        handleClickOutside(event) {
            const menu = this.$refs.menuWrapper;
            if (menu && !menu.contains(event.target)) {
                this.menuOpen = false;
            }
        },
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        },
        async fetchTest() {
            try {
                const testId = this.$route.params.id;
                const res = await api.get(`/getOneTest/${testId}`);
                this.test = res.data.test;

                this.testCode = testId;
                this.testLink = window.location.origin + window.location.pathname + `#/test/${testId}`;
            } catch (err) {
                console.error(err);
                this.$root.showToast("Помилка при завантаженні тесту", "error");
            }
        },
        copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                this.$root.showToast('Скопійовано');
            }).catch(err => {
                console.error(err);
                this.$root.showToast('Помилка!', 'error');
            });
        },
        async deleteTest() {
            try {
                const testId = this.$route.params.id;
                await api.delete(`/test/${testId}`);
                this.$root.showToast('Тест успішно видалено!');
                this.$router.back();
            } catch (err) {
                console.error(err);
                this.$root.showToast('Помилка при видаленні тесту', 'error');
            }
        }
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

.test-view-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    position: relative;
    z-index: 1;
    /* щоб бути над анімацією body */
}

.navigation {
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    /* Розносить кнопки в різні боки */
    align-items: center;
    gap: 15px;
}


/* стилі для кнопки Видалити */
.btn-delete {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    background: rgba(255, 50, 50, 0.4);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 50, 50, 0.6);
    border-radius: 14px;
    color: #fff;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-delete:hover {
    background: rgba(255, 50, 50, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(255, 50, 50, 0.3);
}

.btn-delete .icon {
    font-size: 18px;
}

/* Базові стилі для обох кнопок (можна згрупувати) */
.btn-back,
.btn-share,
.menu-btn {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 14px;
    color: #ffffff;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

/* Специфічні стилі для кнопки Share */
.btn-share {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
}

.btn-share:hover,
.menu-btn:hover {
    background: rgba(77, 12, 255, 0.3);
    /* Додаємо легкий колір бренду при наведенні */
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(77, 12, 255, 0.2);
}

.icon {
    font-size: 18px;
}

/* Анімація для іконки share при наведенні */
.btn-share:hover .icon {
    transform: rotate(-15deg) scale(1.1);
    transition: transform 0.3s ease;
}


/* MOBILE MENU */
.menu-btn {
    font-size: 22px;
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
}

.menu-wrapper {
    position: relative;
    /* Відліковий контейнер для абсолютного меню */
    display: inline-block;
    /* Щоб меню не займало всю ширину */
}

.mobile-dropdown {
    position: absolute;
    top: 100%;
    /* одразу під кнопкою */
    right: 0;
    /* прижаття праворуч */
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: rgba(0, 0, 0, 0.4);
    padding: 8px;
    border-radius: 8px;
    z-index: 100;
}

/* Редагувати */

.btn-edit {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    background: rgba(255, 200, 0, 0.4);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 200, 0, 0.6);
    border-radius: 14px;
    color: #fff;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-edit:hover {
    background: rgba(255, 200, 0, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(255, 200, 0, 0.3);
}


.btn-back:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.5);
}

.btn-back:active {
    transform: translateY(0);
}

.arrow {
    font-size: 20px;
    transition: transform 0.3s ease;
}

.btn-back:hover .arrow {
    transform: translateX(-5px);
    /* Стрілочка рухається вліво при наведенні */
}



/* Шапка */
.test-header {
    background: linear-gradient(135deg, #4d0cff 0%, #b000f8 100%);
    color: white;
    padding: 35px;
    border-radius: 24px;
    margin-bottom: 30px;
    box-shadow: 0 10px 25px rgba(176, 0, 248, 0.2);
}

.test-header h1 {
    margin: 0 0 10px 0;
    font-size: 26px;
}

.test-stats {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 15px;
    opacity: 0.9;
}

.divider {
    opacity: 0.5;
}


/* Картки завдань */
.exercise-card {
    background: white;
    border-radius: 20px;
    padding: 25px;
    margin-bottom: 25px;
    border: 1px solid #eaeaea;
}

.exercise-badge {
    display: inline-block;
    padding: 4px 12px;
    background: #f3e5f5;
    color: #b000f8;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 20px;
}

/* Тип Enter */
.question {
    font-size: 20px;
    margin-bottom: 20px;
}

.answer-info {
    background: #f1f8e9;
    border: 1px solid #c5e1a5;
    padding: 15px;
    border-radius: 12px;
}

.label {
    display: block;
    font-size: 13px;
    color: #558b2f;
    margin-bottom: 8px;
    font-weight: 600;
}

.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.ans-chip {
    background: #fff;
    padding: 4px 12px;
    border-radius: 6px;
    color: #2e7d32;
    font-weight: 700;
    border: 1px solid #c5e1a5;
}

.placeholder-box {
    padding: 30px;
    border: 2px dashed #ddd;
    border-radius: 15px;
    text-align: center;
    color: #999;
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

/* ===== RESULTS MODAL ===== */
.results-list {
    max-height: 360px;
    overflow-y: auto;
    padding: 10px;
    padding-bottom: 0;
}

.results-list::-webkit-scrollbar {
    width: 6px;
}

.results-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 10px;
}

/* RESULT CARD */
.result-card {
    display: flex;
    cursor: pointer;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.18);
    border-radius: 18px;
    padding: 14px 18px;
    margin-bottom: 12px;
    transition: .3s;
}

.result-card:hover {
    background: rgba(255, 255, 255, 0.28);
    transform: translateY(-2px);
}

/* LEFT */
.result-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ffcc00, #ff9900);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: #000;
}

.user-info strong {
    font-size: 15px;
    display: block;
}

.meta {
    font-size: 12px;
    opacity: 0.85;
}

/* RIGHT */
.result-right {
    text-align: right;
}

.score {
    font-size: 17px;
    font-weight: 800;
    margin-bottom: 4px;
}

.progress {
    width: 90px;
    height: 7px;
    background: rgba(255, 255, 255, 0.35);
    border-radius: 10px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #00ffcc, #00ccff);
    transition: width .4s ease;
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

.btn-results {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    background: rgba(0, 150, 255, 0.4);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 150, 255, 0.6);
    border-radius: 14px;
    color: #fff;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-results:hover {
    background: rgba(0, 150, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 150, 255, 0.3);
}

/* ================= MOBILE ================= */
@media (max-width: 480px) {
    .btn-text {
        display: none;
    }

    .modal-content {
        padding: 30px 22px;
    }

    .result-right {
        min-width: 80px;
    }

    .btn-text {
        display: none;
    }

    .btn-back,
    .btn-share,
    .menu-btn {
        padding: 10px 15px;
    }

    .avatar {
        display: none;
    }

}
</style>
