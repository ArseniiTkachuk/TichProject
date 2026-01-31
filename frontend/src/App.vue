<template>
  <AppLoader />
  <router-view />
  <Toast ref="toast" />
</template>

<script>
import Toast from "@/components/Toast.vue";
import AppLoader from '@/components/AppLoader.vue'
import { showToast as toast } from '@/services/toastService'

export default {
  name: "App",

  components: {
    Toast,
    AppLoader
  },

  watch: {
    $route: {
      immediate: true,
      handler(route) {
        document.body.classList.remove('gradient-bg');

        if (route.meta.gradientBg !== false) {
          document.body.classList.add('gradient-bg');
        }
      }
    }
  },

  methods: {
    showToast(message, type = "success", duration = 3000) {
      toast(message, type, duration);
    }
  }

}
</script>
