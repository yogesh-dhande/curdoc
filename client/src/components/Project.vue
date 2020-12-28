<template>
    <div>
        <div v-if="layout == 'code'">
            <code-editor :project="project" :key="project.id"></code-editor>
        </div>
        <b-container v-if="layout == 'app'">
            <app-preview :project="project" :key="project.id"></app-preview>
        </b-container>
        <!-- <b-container v-if="layout == 'vertical'" class="m-0 p-0">
            <b-row>
                <b-col>
                    <app-preview :project="project" :key="project.id"></app-preview>
                </b-col>
                <b-col>
                    <code-editor :project="project" :key="project.id"></code-editor>
                </b-col>
            </b-row>
        </b-container> -->

    </div>
</template>

<script>
import CodeEditor from "./CodeEditor.vue"
import AppPreview from "./AppPreview.vue"
import { mapState } from 'vuex'
import axios from "axios"

export default {
    name: "project",
    components: {CodeEditor, AppPreview},
    props: {
        userName: {
            type: String
        },
        projectName: {
            type: String
        },
        layout: {
            type: String,
            default: "code"
        }       
    },
    data () {
        return {}
    },
    computed: {
        ...mapState(['project'])
    },
    methods: {
        setProject () {
            this.$store.commit('setLoading', true)
            this.$store.commit("setProject", {});
            if (this.userName != this.projectName || this.project.user_name != this.userName) {
                console.log(`getting project for ${this.userName} - ${this.projectName}`)
                axios.get(`${process.env.VUE_APP_BACKEND_URL}/project`, 
                    { params: {
                    user_name: this.userName,
                    project_name: this.projectName
                } })
                .then((res) => {
                    this.$store.commit('setLoading', false)
                    this.$store.commit("setProject", res.data);
                });
            }
        }
    },
    mounted() {
        this.setProject()
    }
}
</script>

<style>

</style>