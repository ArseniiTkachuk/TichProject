<template>
    <div class="pairs-block">
        <h3 class="question">{{ ex.question }}</h3>

        <div class="columns">
            <!-- Ліва колонка -->
            <ul class="column">
                <li v-for="l in availableLeft" :key="l.slug" class="item left-item"
                    :class="{ selected: selectedLeftSlug === l.slug }" @click="selectLeft(l)">
                    <div class="item-content">
                        <img v-if="l.isImage" :src="`${BackURL}${l.imageUrl}`" />
                        <span v-else>{{ l.text }}</span>
                    </div>
                </li>
            </ul>

            <!-- Права колонка -->
            <ul class="column">
                <li v-for="r in availableRight" :key="r.slug" class="item right-item" @click="selectRight(r)">
                    <div class="item-content">
                        <img v-if="r.isImage" :src="`${BackURL}${r.imageUrl}`" />
                        <span v-else>{{ r.text }}</span>
                    </div>
                </li>
            </ul>
        </div>

        <!-- Вибрані пари -->
        <div v-if="pairs.length" class="selected-pairs">
            <h4>Обрані пари</h4>
            <ul>
                <li v-for="pair in pairs" :key="pair[0]" class="pair-card">
                    <div class="pair-items">
                        <div class="pair-item left">
                            <img v-if="findObjLeft(pair[0]).isImage"
                                :src="`${BackURL}${findObjLeft(pair[0]).imageUrl}`" />
                            <span v-else>{{ findObjLeft(pair[0]).text }}</span>
                        </div>

                        <div class="divider"></div>

                        <div class="pair-item right">
                            <img v-if="findObjRight(pair[1]).isImage"
                                :src="`${BackURL}${findObjRight(pair[1]).imageUrl}`" />
                            <span v-else>{{ findObjRight(pair[1]).text }}</span>
                        </div>
                    </div>

                    <button class="remove-btn" @click="removePair(pair)">Видалити пару</button>
                </li>
            </ul>
        </div>
    </div>
</template>


<script>
export default {
    props: { ex: { type: Object, required: true } },
    data() {
        return {
            BackURL: "http://localhost:2222",
            left: this.ex.pairs.left,
            right: this.ex.pairs.right,
            selectedLeftSlug: null,
            pairs: [],
        };
    },
    computed: {
        availableLeft() { return this.left.filter(l => !this.pairs.some(p => p[0] === l.slug)); },
        availableRight() { return this.right.filter(r => !this.pairs.some(p => p[1] === r.slug)); },
    },
    methods: {
        selectLeft(obj) { this.selectedLeftSlug = obj.slug; },
        selectRight(obj) {
            if (!this.selectedLeftSlug) { this.$emit('msg', 'Спочатку оберіть елемент з лівої колонки!'); return; }
            this.pairs.push([this.selectedLeftSlug, obj.slug]);
            this.selectedLeftSlug = null;
            if (this.pairs.length === this.left.length) {
                this.$emit('answered', { value: this.pairs });
                this.$emit('ISAnswer', true);
            }
        },
        removePair(obj) {
            this.pairs = this.pairs.filter(p => p[0] !== obj[0]);
            this.$emit('answered', { value: this.pairs });
            this.$emit('ISAnswer', false);
        },
        findObjLeft(slug) { return this.left.find(x => x.slug === slug); },
        findObjRight(slug) { return this.right.find(x => x.slug === slug); },
    }
};
</script>


<style scoped>
.pairs-block {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.question {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 15px;
}

/* Колонки */
.columns {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.column {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}


/* Елементи */
.item {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(8px);
    padding: 12px;
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.1);
    transition: transform 0.25s, box-shadow 0.25s, background 0.25s;
}

.item:hover {
    transform: scale(1.02);
    box-shadow: 0 0 12px rgba(176, 0, 248, 0.35);
}

.selected {
    background: linear-gradient(135deg, rgba(77, 12, 255, 0.25), rgba(176, 0, 248, 0.25), rgba(255, 0, 179, 0.25));
    border: 1px solid rgba(176, 0, 248, 0.6);
}

.item-content {
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    padding: 8px;
    display: inline-block;
}

.item img {
    width: 100%;
    max-width: 150px;
    height: auto;
    border-radius: 6px;
}

/* Вибрані пари */
.selected-pairs {
    margin-top: 20px;
}

.selected-pairs ul {
    list-style: none;
    /* прибираємо маркери списку */
    padding: 0;
    margin: 0;
}


.pair-card {
    display: flex;
    flex-direction: column;
    /* вертикально */
    align-items: center;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(8px);
    padding: 12px;
    border-radius: 12px;
    margin-bottom: 15px;
}

.pair-items {
    display: flex;
    gap: 15px;
    margin-bottom: 10px;
    /* відступ до кнопки */
}

.pair-item {
    flex: 1;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    padding: 8px;
}

.divider {
    width: 1px;
    background-color: rgba(0, 0, 0, 0.2);
    height: auto;
}

/* Кнопка видалення */
.remove-btn {
    padding: 6px 12px;
    border-radius: 8px;
    background-color: rgba(255, 50, 50, 0.6);
    border: 1px solid rgb(220, 20, 20);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.remove-btn:hover {
    background-color: rgba(255, 50, 50, 0.9);
    transform: scale(1.05);
    box-shadow: 0 0 6px rgb(220, 20, 20);
}

/* Адаптивність */
@media (min-width: 1024px) {
    .columns {
        flex-direction: row;
        justify-content: space-between;
    }

    .column {
        flex: 1 1 48%;
    }

    .pair-items {
        gap: 15px;
    }
}

@media (max-width: 1023px) {
    .pair-items {
        justify-content: center;
        /* Центруємо пару по горизонталі */
    }
}
</style>
