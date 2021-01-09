<template>
  <b-jumbotron>
      <template #header>{{ error.response.status }}</template>
      <hr class="my-4">
      <p>{{ error.response.data.message }}</p>
  </b-jumbotron>
</template>

<script>
import {mapState} from "vuex"

export default {
    name: "error",
    computed: {
        ...mapState(['error'])
    }

}
</script>

<style>

</style>