<template>
    <div class="flex flex-col">
        <h2 v-if="!loggedIn" class="text-blue-100 m-0 p-2 text-center">
            <span class="text-blue-300">
                <nuxt-link to="/login">Log in or sign up</nuxt-link></span
            >
            to start creating your own projects for free.
        </h2>
        <code-editor :blob="blob" :can-edit="canEdit"></code-editor>
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
            if (params.userName && params.projectSlug) {
                const payload = {
                    userName: params.userName,
                    projectSlug: params.projectSlug,
                }
                if (
                    vm.project.slug !== payload.projectSlug ||
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
            projectSlug: context.params.projectSlug,
        }
        return returnData
    },
    data() {
        return {
            blob: {
                fullPath: 'initialPath',
                relativePath: 'app/main.py',
                text: '',
            },
        }
    },
    computed: {
        ...mapState(['project']),
        ...mapGetters(['canEdit', 'loggedIn']),
    },
    watch: {
        project(newValue) {
            this.setBlogFromProject(newValue)
        },
    },
    mounted() {
        this.setBlogFromProject(this.project)
    },
    methods: {
        setBlogFromProject(project) {
            this.blob = project.blob.length > 0 ? project.blob[0] : null
        },
    },
}
</script>

<style>
</style>