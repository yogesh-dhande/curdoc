<template>
  <div id="app">
    <nav-bar :key="currentUser.name"/>
      <b-overlay :show="loading" no-wrap>
      </b-overlay>
    <router-view/>
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
    loading (newValue) {
      console.log(newValue)
      if (newValue) {
        this.$refs['loading-modal'].show()
      } else {
        this.$refs['loading-modal'].hide()
      } 
    }
  }

}
</script>

<style>
</style>  
