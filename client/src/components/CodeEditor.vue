<template>
    <div>
        <!-- <ace-editor
            :blob="blob"
            :canEdit="canEdit"
            @updateCode="updateCode"
        ></ace-editor> -->
        <monaco-editor
            :blob="blob"
            :project="project"
            :canEdit="canEdit"
            @updateCode="updateCode"
        ></monaco-editor>
    </div>
</template>

<script>
// import AceEditor from './AceEditor.vue'
import MonacoEditor from './MonacoEditor'
import { mapGetters } from 'vuex'

export default {
    name: 'code-editor',
    props: {
        project: {
            type: Object,
        },
    },
    components: {
        // 'ace-editor': AceEditor,
        'monaco-editor': MonacoEditor,
    },
    data() {
        return {
            editor: null,
            relativePath: 'main.py',
            codeChanged: false,
            codeChangeCallback: null,
        }
    },
    computed: {
        ...mapGetters(['canEdit']),
        blob() {
            let blobList = this.project.blob.filter(
                (blob) => blob.relative_path == this.relativePath
            )
            return blobList.length > 0 ? blobList[0] : null
        },
    },
    methods: {
        updateCode(evt) {
            this.codeChanged = true
            this.blob.text = evt.text
            clearTimeout(this.codeChangeCallback)

            this.codeChangeCallback = setTimeout(() => {
                if (this.codeChanged) {
                    this.$store.dispatch('updateCode', {
                        project: this.project,
                        blob: this.blob,
                    })
                    this.codeChanged = false
                }
            }, 3000)
        },
    },
    mounted() {
        console.log('mounting code editor')
    },
}
</script>