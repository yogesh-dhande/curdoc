<template>
    <div>
        <nav-bar/>
        <ace-editor :code="code" :key="code"> </ace-editor>
    </div>
</template>

<script>
import AceEditor from "./AceEditor.vue"
import NavBar from './NavBar.vue'
import { mapState } from 'vuex'

    export default {
        name: 'code-editor',
        props: {
            projectId: {
                type: String
            }
        },
        components: {
            'ace-editor': AceEditor,
            'nav-bar': NavBar,
        },
        data () {
            return {
                editor: null
            }
        },
        computed: {
            ...mapState(['code'])
        },
        mounted () {
            console.log(this.projectId)
            this.$store.dispatch('getCodeForProject', this.projectId)
        }
    }
</script>