<template>
    <div class="toast-container">
        <transition-group name="toast-fade" tag="div">
            <div v-for="toast in toasts" :key="toast.id" :class="['toast', toast.type]">
                {{ toast.text }}
            </div>
        </transition-group>
    </div>
</template>
<script>
import { subscribe, unsubscribe } from '@/services/toastService'

export default {
    name: "Toast",
    data() {
        return {
            toasts: [],
            toastIdCounter: 0,
        }
    },
    methods: {
        showToast(text, type = "success", duration = 3000) {
            const id = this.toastIdCounter++
            this.toasts.push({ id, text, type })

            setTimeout(() => {
                const index = this.toasts.findIndex(t => t.id === id)
                if (index !== -1) this.toasts.splice(index, 1)
            }, duration)
        },

        handleServiceToast({ text, type, duration }) {
            this.showToast(text, type, duration)
        }
    },
    mounted() {
        subscribe(this.handleServiceToast)
    },
    beforeUnmount() {
        unsubscribe(this.handleServiceToast)
    }
}
</script>

<style scoped>
/* Toast container */
.toast-container {
    position: fixed;
    bottom: 5%;
    right: 0%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 9999;
    transition: opacity 0.35s ease, transform 0.35s ease;
}

/* Toast messages */
.toast {
    padding: 12px 20px;
    margin: 3%;
    width: 35vh;
    border-radius: 12px;
    font-size: 20px;
    font-weight: 600;
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: space-between;
    align-items: center;
    opacity: 1;
    animation: slideInOut 3s forwards;
}


@keyframes slideInOut {
    0% {
        opacity: 0.5;
        transform: translateX(-50%) translateY(20px);
    }

    5%,
    90% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateX(-50%) translateX(200px);
    }
}


.toast.success {
    background: #28a745;
}

.toast.error {
    background: #dc3545;
}

.toast.info {
    background: #17a2b8;
}


/* Мобільні */
@media (max-width: 480px) {
    .toast-container {
        bottom: 10%;
        left: 100%;
        right: auto;
        transform: translateX(-50%);
        width: 50%;
        padding: 0 10px;
    }

    .toast {
        width: 100%;
        font-size: 14px;
        padding: 10px 12px;
    }
}
</style>
