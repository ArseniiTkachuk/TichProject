<template>
  <router-view />
</template>

<script>
export default {
  name: "App",
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
  }
}
</script>
