<template>
  <b-button-group class="mx-l">
      <!-- <b-button variant="info">
        <font-awesome-icon icon="save" />
      </b-button>
      <b-button variant="success">
        <font-awesome-icon icon="sync" />
      </b-button> -->
      <b-button @click="toCode" variant="info">
        <font-awesome-icon icon="code" />
      </b-button>
      <b-button @click="toPreview" variant="success">
        <font-awesome-icon icon="chart-bar" />
      </b-button>
      <!-- <b-button @click="toVertical" variant="info">
        <font-awesome-icon icon="columns" />
      </b-button>
      <b-button @click="toHorizontal" variant="success">
        <font-awesome-icon icon="columns" rotation="270" />
      </b-button> -->
        <b-button variant="info">
        <font-awesome-icon icon="cogs" />
      </b-button>
      <!-- <b-button @click="publish" variant="warning">Publish</b-button> -->
  </b-button-group>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'toolbar',
    computed: {
      ...mapState(['project'])
    },
    methods: {
      toPreview () {
        this.$router.push(`/${this.project.user.name}/${this.project.name}/app`)
      },
      toCode () {
        this.$router.push(`/${this.project.user.name}/${this.project.name}/code`)
      },
      toVertical () {
        this.$router.push(`/${this.project.user.name}/${this.project.name}?layout=vertical`)
      },
      toHorizontal () {
        this.$router.push(`/${this.project.user.name}/${this.project.name}?layout=horizontal`)
      },
      publish () {
        console.log('publish')
      }
    }
};
</script>

<style>
</style>