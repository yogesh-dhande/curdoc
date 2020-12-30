<template>
    <b-navbar toggleable="lg" type="dark" variant="dark" sticky>
        <b-navbar-brand to="/">Broccolini</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
                <!-- <toolbar /> -->
                <b-button-group v-if="project.name" class="mx-l mx-auto">
                    <b-button :to="`/${project.user.name}/${project.name}/code`">
                        <font-awesome-icon icon="code" />
                    </b-button>
                    <b-button :to="`/${project.user.name}/${project.name}/app`">
                        <font-awesome-icon icon="chart-bar" />
                    </b-button>
                </b-button-group>

            <b-navbar-nav :class="{'ml-auto' : !project.name}">
                <!-- <b-nav-item to="/feedback">Feedback</b-nav-item> -->
                <b-nav-item-dropdown right v-if="currentUser.name">
                    <!-- Using 'button-content' slot -->
                    <template #button-content>
                        <em>{{ currentUser.name }}</em>
                    </template>
                    <b-dropdown-item to="profile">Profile</b-dropdown-item>
                    <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item right to="/login" v-else>Login</b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
    const fb = require('../firebaseConfig.js')
    import {mapState} from 'vuex'
    // import Toolbar from "./Toolbar"

    export default {
        name: 'nav-bar',
        components: {
            // 'toolbar': Toolbar
        },
        methods: {
            logout() {
                fb.auth.signOut().then(() => {
                    this.$store.dispatch("setCurrentUser", {})
                    this.$router.push('/login')
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        computed: {
            ...mapState(['project', 'currentUser']),
        },
    }
</script>
