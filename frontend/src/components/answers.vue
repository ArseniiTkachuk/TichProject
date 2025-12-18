<template>
    <div class="answers-block">
        <h3>{{ ex.question }}</h3>
        <div v-for="(a, aIndex) in ex.answers" :key="currentId + '-' + aIndex" class="answer-row">
            <input v-if="!a.isImage" type="text" :value="a.text" disabled class="answer-input" />
            <img v-else :src="loadImg(a.imageUrl)" alt="answer image" class="answer-img" />

            <label v-if="ex.type === 'one'">
                <input type="radio" :name="'one-' + currentId" :value="aIndex" @change="selectAnswer(aIndex)"
                    :checked="userSelection === aIndex" /> Вибрати
            </label>

            <label v-else-if="ex.type === 'many'">
                <input type="checkbox" :value="aIndex" @change="toggleAnswer(aIndex)"
                    :checked="userSelection.includes(aIndex)" /> Вибрати
            </label>
        </div>
    </div>
</template>

<script>
const BackURL = "http://localhost:2222";

export default {
    props: {
        ex: { type: Object, required: true },
        currentId: { type: [Number, String], required: true }
    },
    data() {
        return {
            userSelection: null
        };
    },
    watch: {
        ex: {
            immediate: true,
            handler(newEx) {
                this.userSelection = newEx.type === 'many' ? [] : null;
            }
        }
    },
    methods: {
        selectAnswer(index) {
            this.userSelection = index;
            this.emitAnswer();
        },
        toggleAnswer(index) {
            const pos = this.userSelection.indexOf(index);
            if (pos === -1) this.userSelection.push(index);
            else this.userSelection.splice(pos, 1);
            this.emitAnswer();
        },
        emitAnswer() {
            this.$emit('answered', { value: this.userSelection });
        },
        loadImg(url) {
            return `${BackURL}${url}`;
        }
    }
};
</script>

<style scoped>
.answers-block {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.answer-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.answer-input {
    flex: 1;
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.answer-img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>
