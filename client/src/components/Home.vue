<template>
<div>
    <b-card
        style="max-width: 20rem;"
        class="mx-auto">
        <b-form inline>
            <b-form-input v-model="projectName"></b-form-input>
            <b-button @click="createProject">New</b-button>
        </b-form>
        <user :user="currentUser"></user>
    </b-card>
</div>
</template>

<script>
import { mapState } from 'vuex'
import User from './User.vue'

export default {
    name: 'home',
    components: {
        'user': User
    },
    data () {
        return {
            projectName: ''
        }
    },
    computed: {
        ...mapState(['currentUser'])
    },
    methods: {
        createProject () {
            this.projectName = ""
            this.$store.dispatch("createProject", this.projectName)
        },
    }

}
</script>

<style>

</style>