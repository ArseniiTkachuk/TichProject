<template>
    <div class="test-view-container">
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
                <div class="test-stats" v-if="result">
                    <span class="stat-item"><strong>{{ result.score }}</strong> / 100 балів</span>
                </div>
            </div>
        </header>

        <main v-if="loading" class="loading">Завантаження...</main>
        <main v-else-if="error" class="error">{{ error }}</main>
        <main v-else class="exercises-list">
            <div class="summary">
                <div><strong>Учень:</strong> {{ result.name }}</div>
            </div>

            <div v-for="(ex, idx) in result.results" :key="idx" class="exercise-card">
                <div class="exercise-badge">Завдання №{{ idx + 1 }}</div>
                <div class="exercise-body">
                    <div class="question">{{ ex.question }}</div>

                    <!-- ONE / MANY -->
                    <answers v-if="ex.type === 'one' || ex.type === 'many'" :ex="ex" />

                    <!-- ENTER -->
                    <div v-if="ex.type === 'enter'" class="enter">
                        <div>
                            <strong>Відповідь учня:</strong>
                            <span :class="ex.isCorrect ? 'right' : 'wrong'">{{ ex.userAnswer || '—' }}</span>
                        </div>
                        <div>
                            <strong>Правильна:</strong> {{ ex.answers.correctAnswers.join(', ') }}
                        </div>
                    </div>

                    <!-- PAIR -->
                    <pairs v-if="ex.type === 'pair'" :ex="ex" />


                    <div class="status" :class="ex.isCorrect ? 'right' : 'wrong'">
                        {{ ex.isCorrect ? 'Правильно' : 'Неправильно' }}
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import api from "@/services/api";
import answers from "@/components/lockPassageTest/answers.vue";
import pairs from "@/components/lockPassageTest/pairs.vue";

export default {
    components: {
        answers,
        pairs
    },

    data() {
        return {
            result: null,
            loading: true,
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
            } catch (err) {
                console.error(err);
                this.error = err.response?.data?.message || "Помилка при завантаженні";
            } finally {
                this.loading = false;
            }
        },
        isChosen(ex, index) {
            if (!Array.isArray(ex.userAnswer)) return false;
            return ex.userAnswer.includes(index);
        },
        answerClass(ex, index, answer) {
            return {
                answer: true,
                right: answer.correct,
                wrong: this.isChosen(ex, index) && !answer.correct,
                chosen: this.isChosen(ex, index)
            };
        },
        isPairCorrect(ex, leftSlug) {
            const user = ex.userAnswer?.find(([l]) => l === leftSlug);
            const correctRight = ex.answers.correctMap?.[leftSlug];
            return user && String(user[1]) === String(correctRight);
        },
        getUserPairText(ex, leftSlug) {
            const pair = ex.userAnswer?.find(([l]) => l === leftSlug);
            if (!pair) return "—";
            const right = ex.answers.right.find(r => r.slug === pair[1]);
            return right?.text || "—";
        },
        getCorrectPairText(ex, leftSlug) {
            const rightSlug = ex.answers.correctMap?.[leftSlug];
            const right = ex.answers.right.find(r => r.slug === rightSlug);
            return right?.text || "—";
        }
    }
};
</script>

<style scoped>
.test-view-container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
}

.navigation {
    margin-bottom: 20px;
}

.btn-back {
    padding: 8px 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
}

.test-header {
    background: linear-gradient(135deg, #4d0cff, #b000f8);
    padding: 25px;
    border-radius: 20px;
    color: white;
    margin-bottom: 25px;
}

.exercise-card {
    background: white;
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 20px;
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
    margin-bottom: 15px;
}

.answers {
    list-style: none;
    padding: 0;
}

.answer {
    padding: 8px 12px;
    border-radius: 8px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.answer.right {
    background: #e8f5e9;
    color: #2e7d32;
}

.answer.wrong {
    background: #fdecea;
    color: #c62828;
}

.answer.chosen {
    border: 1px solid #888;
}

.icon {
    width: 22px;
    text-align: center;
}

.enter,
.pairs {
    margin-top: 12px;
}

.pair-row {
    margin-bottom: 8px;
}

.correct-hint {
    color: #666;
    font-size: 13px;
    margin-left: 6px;
}

.status {
    margin-top: 10px;
    font-weight: bold;
}

.right {
    color: #2e7d32;
}

.wrong {
    color: #c62828;
}

.loading {
    text-align: center;
    font-size: 18px;
}

.error {
    color: #c62828;
    font-weight: bold;
    text-align: center;
}

.summary {
    margin-bottom: 15px;
    font-size: 16px;
}
</style>
