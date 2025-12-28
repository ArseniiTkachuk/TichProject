<template>
  <router-view />
  <Toast ref="toast" />
</template>

<script>
import Toast from "@/components/Toast.vue";
export default {
  name: "App",

  components: {
    Toast
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
      this.$refs.toast.showToast(message, type, duration);
    }
  }

}
</script>
