<template>
    <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand to="terminal">Broccoli</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
                <b-button-group class="mx-1">
                    <b-button to="code" variant="info">Code</b-button>
                    <b-button to="app" variant="success">Preview</b-button>
                </b-button-group>
                <b-nav-item-dropdown right>
                    <!-- Using 'button-content' slot -->
                    <template #button-content>
                        <em>{{ user }}</em>
                    </template>
                    <b-dropdown-item to="profile">Profile</b-dropdown-item>
                    <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
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
