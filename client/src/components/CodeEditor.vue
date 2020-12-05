<template>
<div>
    <h4>{{$store.state.userName}} - {{$store.state.projectName}}</h4>
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
        mounted () {
            console.log("mounting code editor now")
        },
        watch: {
            '$route': (to, from) => {
                console.log(to, from)
            }
        }
    }
</script>