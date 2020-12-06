<template>
  <div id="app">
    <nav-bar :key="currentUser.name"/>
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
      ...mapState(['userName', 'projectName', 'currentUser'])
  },

}
</script>

<style>
</style>  
