<template>
    <div>
        <b-alert
            v-model="showAlert"
            variant="info"
            class="m-0 p-2 text-center"
            dismissible
        >
            <span class="lead">
                <b-badge variant="warning" to="/login"
                    >Log in or sign up</b-badge
                ></span
            >
            to start creating your own projects for free.
        </b-alert>
        <code-editor :project="project" v-if="project.id"></code-editor>
    </div>
</template>

<script>
import CodeEditor from '@/components/CodeEditor.vue'
import { mapState } from 'vuex'

export default {
    name: 'project',
    components: { CodeEditor },
    props: {
        userName: {
            type: String,
        },
        projectName: {
            type: String,
        },
        layout: {
            type: String,
            default: 'code',
        },
    },
    data() {
        return {}
    },
    computed: {
        ...mapState(['project', 'currentUser']),
        showAlert() {
            return this.currentUser.id ? false : true
        },
    },
    mounted() {
        // let payload = {
        //     user_name: this.userName,
        //     project_name: this.projectName,
        // }
        // if (
        //     this.project.name != payload.project_name ||
        //     this.project.user.name != payload.user_name
        // ) {
        //     this.$store.dispatch('setProject', payload)
        // }
    },
    beforeRouteEnter(to, from, next) {
        console.log('entering project route')
        console.log(to.params)

        next((vm) => {
            let params = to.params
            if (params.userName && params.projectName) {
                let payload = {
                    user_name: params.userName,
                    project_name: params.projectName,
                }
                if (
                    vm.project.name != payload.project_name ||
                    vm.project.user.name != payload.user_name
                ) {
                    vm.$store.dispatch('setProject', payload)
                    vm.$store.dispatch('setAppScript', payload)
                }
            }
        })
    },
    beforeRouteUpdate(to, from, next) {
        console.log('updating project route')
        next()
    },
    beforeRouteLeave(to, from, next) {
        console.log('leaving project route')
        next()
    },
}
</script>

<style>
</style>