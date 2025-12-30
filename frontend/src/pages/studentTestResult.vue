<template>
    <main v-if="error" class="error">{{ error }}</main>
    <div v-else-if="result" class="test-view-container">
        <!-- HEADER -->
        <nav class="navigation">
            <button @click="$router.back()" class="btn-back">
                <span class="arrow">←</span>
                <span class="btn-text">Назад</span>
            </button>
        </nav>

        <header class="test-header">
            <div class="header-content">
                <h1>Результат учня</h1>
                <div class="test-stats">
                    <span class="stat-item">
                        Учень: <strong>{{ result.name }}</strong>
                    </span>
                    <span class="divider">|</span>
                    <span class="stat-item"><strong>{{ result.score }}</strong> / 100 балів</span>
                    <span class="divider">|</span>
                    <span class="stat-item">Виходів з тесту: <strong>{{ result.leaveCount }}</strong></span>
                </div>
            </div>
        </header>
        <main class="exercises-list">
            <div v-for="(exercise, index) in result.results" :key="exercise.slug || index" :class="isCorrect(exercise.isCorrect)" class="exercise-card">
                <div class="exercise-badge">Завдання №{{ index + 1 }}</div>

                <div class="exercise-body">
                    <answers v-if="exercise.type === 'one' || exercise.type === 'many'" :ex="exercise" />
                    <enters v-if="exercise.type === 'enter'" :ex="exercise" />
                    <pairs v-if="exercise.type === 'pair'" :ex="exercise" />
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import api from "@/services/api";
import answers from "@/components/lockPassageTest/answers.vue";
import pairs from "@/components/lockPassageTest/pairs.vue";
import enters from "@/components/lockPassageTest/enters.vue";

export default {
    components: {
        answers,
        pairs,
        enters
    },

    data() {
        return {
            result: null,
            error: null
        };
    },
    mounted() {
        this.fetchResult();
    },
    methods: {
        async fetchResult() {
            try {
                const { id, slug } = this.$route.params;
                const { data } = await api.get(`/test/${id}/result/${slug}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("tokenAuthTeacher")}` }
                });
                this.result = data;
                console.log(data)
            } catch (err) {
                console.error(err);
                this.error = err.response?.data?.message || "Помилка при завантаженні";
            }
        },
        isCorrect(crct){
            return {
                correct: crct,
                noCorrect: !crct
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
    border-radius: 20px;
    padding: 25px;
    margin-bottom: 25px;
}

.exercise-card.correct {
    background: rgb(225, 245, 226);

    border: 3px solid #8bfa6c;
}
.exercise-card.noCorrect {
    background: rgb(244, 221, 221);

    border: 3px solid #fc6767;
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
