<template>
  <div id="app">
    <nav-bar :key="currentUser"/>
    <keep-alive>
      <router-view/>
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
    getCode (userName, projectName) {
      this.$store.dispatch('getCodeForProject', {
          userName: userName,
          projectName: projectName,
          authUser: this.currentUser
      })
    }
  },
  computed: {
      ...mapState(['userName', 'projectName', 'currentUser'])
  },
  watch: {
    '$route.params': {
      handler(newValue, oldValue) {
        console.log(oldValue)
        if (newValue) {
          if (newValue.userName && newValue.projectName) {
              if (newValue.userName != this.userName && newValue.projectName != this.projectName) {
                  console.log("values don't match")
                  this.getCode(newValue.userName, newValue.projectName)
              } 
          }
        }
      },
      immediate: true,
    }
  }
}
</script>

<style>
</style>  
