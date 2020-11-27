<template>
  <b-button-group class="mx-1">
      <b-button @click="toCode" variant="info">Code</b-button>
      <b-button @click="toPreview" variant="success">Preview</b-button>
      <!-- <b-button @click="publish" variant="warning">Publish</b-button> -->
  </b-button-group>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'toolbar',
    computed: {
      ...mapState(['userName', 'projectName'])
    },
    methods: {
      toPreview () {
        this.$store.dispatch('getScriptForProject', {
          userName: this.userName,
          projectName: this.projectName
        })
        this.$router.push(`/${this.userName}/${this.projectName}/app`)
      },
      toCode () {
        this.$router.push(`/${this.userName}/${this.projectName}/code`)
      },
      publish () {
        console.log('publish')
      }
    }
};
</script>

<style>
</style>