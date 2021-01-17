<template>
    <div id="app">
        <nav-bar :key="currentUser.name" />
        <div>
            <!-- <b-overlay :show="loading" no-wrap> </b-overlay> -->
            <keep-alive>
                <router-view />
            </keep-alive>
        </div>
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
    methods: {},
    computed: {
        ...mapState(['currentUser', 'loading', 'project']),
    },
    watch: {
        '$route.params'(params) {
            console.log(params)
        },
    },
}
</script>

<style>
</style>  
