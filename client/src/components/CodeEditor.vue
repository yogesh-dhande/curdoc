<template>
<div>
    <ace-editor 
        :code="code"
        @codeChanged="codeChanged"
    > </ace-editor>
</div>
</template>

<script>
import AceEditor from "./AceEditor.vue"

    export default {
        name: 'code-editor',
        props: {
            project: {
                type: Object
            }
        },
        components: {
            'ace-editor': AceEditor,
        },
        data () {
            return {
                editor: null,
                relativePath: "main.py"
            }
        },
        computed: {
            blob () {
                let blobList = this.project.blob.filter(
                    blob => blob.relative_path == this.relativePath
                )
                return blobList.length > 0? blobList[0]: null
            },
            code () {
                return this.blob? this.blob.text: ""
            }
        },
        methods: {
            codeChanged(evt) {
                console.log(evt)
                this.blob.text = evt.text
                this.$store.dispatch('updateCode', {
                    project: this.project,
                    blob: this.blob
                })
            }
        },
        mounted () {
        },
    }
</script>