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
        <div v-if="layout == 'code'">
            <code-editor :project="project" :key="project.id"></code-editor>
        </div>
        <b-container v-if="layout == 'app'">
            <app-preview :project="project" :key="project.id"></app-preview>
        </b-container>
    </div>
</template>

<script>
import CodeEditor from '@/components/CodeEditor.vue'
import AppPreview from '@/views/AppPreview.vue'
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
        ...mapState(['project', 'currentUser']),
        showAlert() {
            return this.currentUser.id ? false : true
        },
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