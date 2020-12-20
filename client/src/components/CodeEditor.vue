<template>
<div>
    <ace-editor :code="code" :key="code"> </ace-editor>
</div>
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
        methods: {
            getCode (userName, projectName) {
                this.$store.dispatch('getCodeForProject', {
                    userName: userName,
                    projectName: projectName,
                    authUser: this.currentUser
                })
            }
        },
        mounted () {
            console.log("mounting code editor now")
            this.getCode(this.userName, this.projectName)
        },
    }
</script>