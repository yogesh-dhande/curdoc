<template>
    <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand to="terminal">Broccoli</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-item to="bokeh-playground">Playground</b-nav-item>
                <b-nav-item to="profile" v-if="user">{{ user }}</b-nav-item>
                <b-nav-item @click="logout">Logout</b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
    const fb = require('../firebaseConfig.js')
    import {mapState} from 'vuex'

    export default {
        methods: {
            logout() {
                fb.auth.signOut().then(() => {
                    this.$store.dispatch('clearData')
                    this.$router.push('/login')
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        computed: {
            ...mapState(['user'])
        },
    }
</script>
