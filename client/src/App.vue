<template>
  <div id="app">
    <nav-bar :key="currentUser.name"/>
      <b-overlay :show="loading" no-wrap>
      </b-overlay>
      <keep-alive>
        <router-view />
      </keep-alive>

  </div>
</template>

<script>

import { mapState } from 'vuex'
import NavBar from './components/NavBar'

export default {
  name: 'App',
  components: {
      'nav-bar': NavBar,
  },
  methods: {
  },
  computed: {
      ...mapState(['currentUser', 'loading']),
  },
  watch: {
    "$route.params" (params) {
      console.log(params)
      if (params.userName && params.projectName) {
        this.$store.dispatch("setProject", {
          user_name: params.userName,
          project_name: params.projectName
        })
      }
    }
  }
}
</script>

<style>
</style>  
