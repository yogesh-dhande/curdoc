<template>
    <div class="editor"></div>
</template>

<script>
import * as monaco from 'monaco-editor'
export default {
    name: 'monaco',
    data() {
        return {
            editor: Object,
            editorSessions: {},
        }
    },
    props: {
        blob: {
            type: Object,
        },
        canEdit: {
            type: Boolean,
            default: true,
        },
    },
    mounted() {
        this.editor = monaco.editor.create(this.$el, {
            value: this.blob.text,
            language: 'python',
            theme: 'vs-dark',
            minimap: false,
            fontSize: 14,
            readOnly: !this.canEdit,
            automaticLayout: true,
        })
        this.editor.onDidChangeModelContent(() => {
            this.updateCode()
        })
        console.log(this.editor)
    },
    methods: {
        updateCode() {
            this.$emit('updateCode', {
                text: this.editor.getValue(),
            })
        },
    },
}
</script>

<style>
.editor {
    height: 100vh;
}
</style>