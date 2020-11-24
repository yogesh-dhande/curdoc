<template>
  <b-button-group class="mx-1">
      <b-button to="code" variant="info">Code</b-button>
      <b-button @click="preview" variant="success">Preview</b-button>
      <!-- <b-button @click="publish" variant="warning">Publish</b-button> -->
  </b-button-group>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'toolbar',
    computed: {
      ...mapState(['userId', 'projectId'])
    },
    methods: {
      preview () {
        this.$store.dispatch('getScriptForProject', {
                userId: this.userId,
                projectId: this.projectId
            })
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