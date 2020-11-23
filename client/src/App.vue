<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted() {
    console.log(this.$route.params)
    // Create a project id and push to the router
  }
}
</script>

<style>
</style>
