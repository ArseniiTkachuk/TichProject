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
      right: 20px;
    transform: none;
    position: fixed;
    bottom: 5%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 9999;
    transition: opacity 0.35s ease, transform 0.35s ease;
}

/* Toast messages */
.toast {
    white-space: normal;
    word-break: break-word;
    white-space: normal;
    position: relative;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center; /* головне */
  text-align: center;

  gap: 8px;

  padding: 12px 20px;
  max-width: 320px;
    width: fit-content;

  border-radius: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #fafafa;
    text-align: left;
    overflow: hidden;
     line-height: 1.4;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin: 3%;
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
   background: linear-gradient(135deg, #34d399, #059669);
  color: #ecfdf5;

  border: 1px solid rgba(52, 211, 153, 0.4);

  box-shadow:
    0 8px 25px rgba(16, 185, 129, 0.35),
    0 0 12px rgba(52, 211, 153, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  backdrop-filter: blur(8px);
}

.toast.success::before {
  content: "✔";
  font-size: 16px;
  font-weight: bold;

  display: inline-flex;
  align-items: center;
  justify-content: center;


}

.toast.error {
background: linear-gradient(135deg, #f56a6a, #eb3d3d);
  color: #fff1f2;

  border: 1px solid rgba(248, 113, 113, 0.4);

  box-shadow:
    0 8px 25px rgba(239, 68, 68, 0.35),
    0 0 12px rgba(248, 113, 113, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
    
    backdrop-filter: blur(8px);
}

.toast.error::before {
  content: "✖";
  font-size: 14px;
  font-weight: bold;


  display: flex;
  align-items: center;
  justify-content: center;

}

.toast.info {
    background: linear-gradient(135deg, #60a5fa, #2563eb);
  color: #eff6ff;

  border: 1px solid rgba(96, 165, 250, 0.4);

  box-shadow:
    0 8px 25px rgba(37, 99, 235, 0.35),
    0 0 12px rgba(96, 165, 250, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  backdrop-filter: blur(8px);
}


/* Мобільні */
@media (max-width: 480px) {
    .toast-container {
        bottom: 20%;
        left: 90%;
        right: auto;
        transform: translateX(-50%);
        width: 60%;
        padding: 0 10px;
    }

}
</style>
