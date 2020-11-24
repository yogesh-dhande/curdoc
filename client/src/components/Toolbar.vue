<template>
  <b-button-group class="mx-1">
      <b-button to="code" variant="info">Code</b-button>
      <b-button @click="preview" variant="success">Preview</b-button>
      <!-- <b-button @click="publish" variant="warning">Publish</b-button> -->
  </b-button-group>
</template>

<script>
export default {
    name: 'toolbar',
    methods: {
      preview () {
        this.$store.dispatch('getScriptForProject', this.projectId)
        this.$router.push('app')
      },
      publish () {
        console.log('publish')
      }
    }
};
</script>

<style>
</style>