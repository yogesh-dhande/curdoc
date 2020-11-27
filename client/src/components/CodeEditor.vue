<template>
    <ace-editor :code="code" :key="code"> </ace-editor>
</template>

<script>
import AceEditor from "./AceEditor.vue"
import { mapState } from 'vuex'

    export default {
        name: 'code-editor',
        props: {
            userName: {
                type: String
            },
            projectName: {
                type: String
            }
        },
        components: {
            'ace-editor': AceEditor,
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
            console.log("mounting code editor now")
        },
    }
</script>