<template>
    <div>
        <b-card style="max-width: 20rem" class="mx-auto">
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
import User from '@/components/User.vue'
import { starterCode } from './../projects.js'

export default {
    name: 'home',
    components: {
        user: User,
    },
    data() {
        return {
            projectName: '',
        }
    },
    computed: {
        ...mapState(['currentUser']),
    },
    methods: {
        createProject() {
            this.$store.dispatch('createProject', {
                name: this.projectName,
                user: {
                    id: this.currentUser.id,
                    name: this.currentUser.name,
                },
                blob: [
                    {
                        relative_path: 'main.py',
                        text: starterCode,
                    },
                ],
            })
            this.projectName = ''
        },
    },
}
</script>

<style>
</style>