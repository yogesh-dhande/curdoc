<template>
    <monaco-editor
        :blob="blob"
        :can-edit="canEdit"
        @updateCode="updateCode"
    ></monaco-editor>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
    key(route) {
        return route.name
    },
    async asyncData(context) {
        const returnData = {
            userName: context.params.userName,
            projectSlug: context.params.projectSlug,
        }
        if (
            context.store.state.project.slug !== returnData.projectSlug ||
            context.store.state.project.user.name !== returnData.userName
        ) {
            await context.store.dispatch('setProject', returnData)
            context.store.dispatch('setAppUrl', context.query) // No need to wait for script
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
            codeChanged: false,
            codeChangeCallback: null,
        }
    },
    computed: {
        ...mapState(['project']),
        ...mapGetters(['canEdit']),
    },
    watch: {
        project(newValue) {
            this.setBlobFromProject(newValue)
        },
    },
    mounted() {
        this.setBlobFromProject(this.project)
    },
    methods: {
        setBlobFromProject(project) {
            this.blob = project.blob.length > 0 ? project.blob[0] : null
        },
        updateCode(evt) {
            this.$store.dispatch('updateCode', {
                blob: this.blob,
                text: evt.text,
            })
        },
    },
}
</script>

<style>
</style>