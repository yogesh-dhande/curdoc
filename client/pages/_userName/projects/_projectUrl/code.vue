<template>
    <div class="flex flex-col">
        <h2 v-if="!loggedIn" class="text-blue-100 m-0 p-2 text-center">
            <span class="text-blue-300">
                <nuxt-link to="/login">Log in or sign up</nuxt-link></span
            >
            to start creating your own projects for free.
        </h2>
        <code-editor :project="project"></code-editor>
    </div>
</template>

<script>
import CodeEditor from '@/components/CodeEditor.vue'
import { mapState, mapGetters } from 'vuex'

export default {
    components: { CodeEditor },
    beforeRouteEnter(to, from, next) {
        console.log('entering project route')
        console.log(to.params)

        next(async (vm) => {
            const params = to.params
            if (params.userName && params.projectUrl) {
                const payload = {
                    userName: params.userName,
                    projectUrl: params.projectUrl,
                }
                if (
                    vm.project.url !== payload.projectUrl ||
                    vm.project.user.name !== payload.userName
                ) {
                    await vm.$store.dispatch('setProject', payload)
                    await vm.$store.dispatch('setAppScript')
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
    asyncData(context) {
        const returnData = {
            userName: context.params.userName,
            projectUrl: context.params.projectUrl,
        }
        return returnData
    },
    computed: {
        ...mapState(['project']),
        ...mapGetters(['canEdit', 'loggedIn']),
    },
    mounted() {
        console.log('mounting code editor')
    },
}
</script>

<style>
</style>