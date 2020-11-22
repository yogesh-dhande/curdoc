<template>
    <div>
        <nav-bar/>
        <ace-editor> </ace-editor>
    </div>
</template>

<script>
import AceEditor from "./AceEditor.vue"
import NavBar from './NavBar.vue'

    export default {
        name: 'code-editor',
        components: {
            'ace-editor': AceEditor,
            'nav-bar': NavBar,
        },
        data () {
            return {
                editor: null
            }
        },
        props: {

        },
    }
</script>