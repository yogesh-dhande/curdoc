<template>
    <div>
        <h2 class="text-blue-100 m-0 p-2 text-center">
            <span class="text-blue-300">
                <nuxt-link to="/login">Log in or sign up</nuxt-link></span
            >
            to start creating your own projects for free.
        </h2>
        <code-editor :project="project" v-if="project.id"></code-editor>
    </div>
</template>

<script>
import CodeEditor from '@/components/CodeEditor.vue'
import { mapState } from 'vuex'

export default {
    name: 'project',
    components: { CodeEditor },
    async asyncData(context) {
        let returnData = {
            userName: context.params.userName,
            projectUrl: context.params.projectUrl,
        }
        return returnData
    },
    computed: {
        ...mapState(['project', 'currentUser']),
        showAlert() {
            return this.currentUser.id ? false : true
        },
    },
    beforeRouteEnter(to, from, next) {
        console.log('entering project route')
        console.log(to.params)

        next(async (vm) => {
            let params = to.params
            if (params.userName && params.projectUrl) {
                let payload = {
                    userName: params.userName,
                    projectUrl: params.projectUrl,
                }
                if (
                    vm.project.url != payload.projectUrl ||
                    vm.project.user.name != payload.userName
                ) {
                    await vm.$store.dispatch('setProject', payload)
                    await vm.$store.dispatch('setAppScript', payload)
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