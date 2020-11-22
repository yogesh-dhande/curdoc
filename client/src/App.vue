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
    console.log(window)
  }
}
</script>

<style>
</style>
