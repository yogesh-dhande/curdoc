<template>
    <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand to="/">Broccolini</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
                <toolbar v-if="projectName"/>
                <!-- <b-nav-item to="/feedback">Feedback</b-nav-item> -->
                <b-nav-item-dropdown right v-if="currentUser != 'guest'">
                    <!-- Using 'button-content' slot -->
                    <template #button-content>
                        <em>{{ currentUser }}</em>
                    </template>
                    <b-dropdown-item to="profile">Profile</b-dropdown-item>
                    <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item to="/login" v-else>Login</b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
    const fb = require('../firebaseConfig.js')
    import {mapState} from 'vuex'
    import Toolbar from "./Toolbar"

    export default {
        name: 'nav-bar',
        components: {
            'toolbar': Toolbar
        },
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
            ...mapState(['currentUser', 'projectName'])
        },
    }
</script>
