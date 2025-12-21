<template>
    <div id="background_test">

        <h2>{{ ex.question }}</h2>
        <div class="left-right">
            <div>
                <ul>
                    <!-- Перебираємо доступні ліві елементи, які ще не вибрані у парах -->
                    <li v-for="(l) in availableLeft" :class="{ selected: selectedLeftSlug === l.slug }"
                        @click="selectLeft(l)" class="left-item">
                        <img v-if="l.isImage" :src="`${BackURL}${l.imageUrl}`">
                        <h3 v-else>{{ l.text }}</h3>
                    </li>
                </ul>
            </div>
            <div>
                <ul>
                    <!-- Перебираємо доступні праві елементи, які ще не вибрані у парах -->
                    <li v-for="(r) in availableRight" @click="selectRight(r)" class="right-item">
                        <img v-if="r.isImage" :src="`${BackURL}${r.imageUrl}`">
                        <h3 v-else>{{ r.text }}</h3>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Секція створених пар (відображається, якщо є хоча б одна пара) -->
        <div v-if="pairs.length">
            <h3 class='text_pairs'>Обрані пари</h3>
            <ul>
                <!-- Перебираємо пари -->
                <li class="block_done" v-for="pair in pairs">
                    <img v-if="findObjLeft(pair[0]).isImage" :src="`${BackURL}${findObjLeft(pair[0]).imageUrl}`">
                    <h3 v-else>{{ findObjLeft(pair[0]).text }}</h3>

                    <img v-if="findObjRight(pair[1]).isImage" :src="`${BackURL}${findObjRight(pair[1]).imageUrl}`">
                    <h3 v-else>{{ findObjRight(pair[1]).text }}</h3>
                    <!-- Кнопка видалення пари -->
                    <button @click="removePair(pair)" class="remove-btn">
                        Видалити пару
                    </button>
                </li>
            </ul>
        </div>
    </div>


</template>
<script>



export default {
    props: {
        ex: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            BackURL: "http://localhost:2222",
            // Масив з усіма лівими елементами (отриманий з бекенду)
            left: this.ex.pairs.left,
            // Масив з усіма правими елементами (отриманий з бекенду)
            right: this.ex.pairs.right,
            // Index вибраного елемента з лівої колонки 
            selectedLeftSlug: null,
            // Масив створених користувачем пар {Left index, Right index}
            pairs: [],

        }
    },

    computed: {
        // ліві елементи, які ще не обрані у жодній парі
        availableLeft() {
            return this.left.filter(
                (l) => !this.pairs.some((p) => p[0] === l.slug)
            );
        },

        // Праві елементи, які ще не обрані у жодній парі
        availableRight() {
            return this.right.filter(
                (r) => !this.pairs.some((p) => p[1] === r.slug)
            );
        },
    },

    methods: {
        // Вибір лівого елемента: просто зберігаємо його індекс як активний
        selectLeft(obj) {
            this.selectedLeftSlug = obj.slug;
        },
        // Вибір правого елемента: якщо є вибраний лівий, створюємо пару і скидаємо вибір
        selectRight(obj) {
            if (this.selectedLeftSlug === null) {
                alert("Спочатку оберіть елемент з іншої колонки!");
                return;
            }
            this.pairs.push([this.selectedLeftSlug, obj.slug]);
            this.selectedLeftSlug = null;
            if (this.pairs.length == this.left.length) {
                // Відправляємо введене значення батьківському компоненту якщо всі пари обрані
                this.$emit('answered', {
                    value: this.pairs
                });
                this.$emit('ISAnswer', true);
            }
        },
        // Видалення пари за індексом функції
        removePair(obj) {
            this.pairs = this.pairs.filter((p) => p[0] !== obj[0]);

            this.$emit('answered', {
                value: this.pairs
            });

            this.$emit('ISAnswer', false);

        },

        findObjLeft(slug) {
            return this.left.find((x) => x.slug === slug);
        },

        findObjRight(slug) {
            return this.right.find((x) => x.slug === slug);
        }

    }
}

</script>
<style scoped>
/* Активний (вибраний) елемент */
.left-item.selected {
    box-shadow: 0 0 2px rgb(75, 151, 232);
    transform: scale(1.02);
    list-style-type: none;
    background-color: rgb(40, 101, 224, 0.3);
    border: 1px solid rgb(27, 72, 221);
}

/* Окремий елемент ліві, праві, пари */
.left-item,
.right-item {
    padding: 15px 10px;
    margin: 15px 0;
    cursor: pointer;
    border: 1px solid #b9b9b9;
    border-radius: 10px;
    transition: background 0.3s, border-radius 0.3s, transform 0.3s;
    list-style-type: none;
    display: block;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
}

.left-item:hover,
.right-item:hover {
    background-color: rgba(168, 219, 145, 0.3);
    border: 1px solid rgb(94, 170, 94);
    transform: rotateY(-5deg);
    box-shadow: 0 0 2px rgb(120, 210, 129);
}

.left-item img,
.right-item img {
    width: 50vh;
    margin: 0vh;
}




.block_done img {
    width: 50vh;

}




.remove-btn {
    width: 130px;
    height: 38px;

    border-radius: 10px;
    margin-left: 10px;
    cursor: pointer;

    background-color: rgba(255, 50, 50, 0.5);
    border: 1px solid rgb(220, 20, 20);
    transform: rotateY(-5deg);
    box-shadow: 0 0 4px rgb(255, 40, 40);
    transition: background 0.3s, border-radius 0.3s, transform 0.3s;
}

.remove-btn:hover {
    background-color: rgba(229, 43, 43, 0.8);
    border: 1px solid rgb(201, 50, 50);
    transform: rotateY(-7deg);
    box-shadow: 0 0 2px rgb(227, 75, 75);
    transform: scale(1.02);
}




#background_test .left-right {
    display: flex;
    flex-direction: column;
    /* на малих екранах одна колонка */
    gap: 30px;
    /* відстань між секціями */
}

@media (min-width: 1024px) {

    /*Для екранів пк */
    #background_test .left-right {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
    }

    #background_test .left-right>div {
        flex: 1 1 48%;
        /* кожна секція ~половина ширини */
        margin: 0;
    }

    #background_test {
        width: 90%;
    }

}
</style>