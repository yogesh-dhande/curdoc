<template>
    <div>
        <div v-if="layout == 'code'">
            <code-editor :project="project" :key="project.id"></code-editor>
        </div>
        <b-container v-if="layout == 'app'">
            <app-preview :project="project" :key="project.id"></app-preview>
        </b-container>
    </div>
</template>

<script>
import CodeEditor from './CodeEditor.vue'
import AppPreview from './AppPreview.vue'
import { mapState } from 'vuex'

export default {
    name: 'project',
    components: { CodeEditor, AppPreview },
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
        ...mapState(['project']),
    },
    mounted() {
        this.$store.dispatch('setProject', {
            user_name: this.userName,
            project_name: this.projectName,
        })
    },
}
</script>

<style>
</style>