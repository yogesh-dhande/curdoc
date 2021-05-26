<template>
    <div id="editor" style="height: 100%; width: 100%"></div>
</template>

<script>
const ace = require('ace-builds')
require('ace-builds/webpack-resolver')

export default {
    name: 'ace-editor',
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
        this.editor = ace.edit(this.$el, {
            wrap: true,
            autoScrollEditorIntoView: true,
            minLines: 60,
            maxLines: 200,
            fontSize: 14,
            highlightSelectedWord: true,
            highlightGutterLine: true,
        })
        this.editor.resize()
        this.editor.on('change', this.updateCode)
        this.editor.setReadOnly(!this.canEdit)

        this.$watch(
            'blob',
            (newValue) => {
                let relativePath = newValue.relative_path
                let text = newValue.text
                if (!this.editorSessions[relativePath]) {
                    this.editorSessions[relativePath] = new ace.EditSession(
                        text
                    )
                }
                this.editor.setSession(this.editorSessions[relativePath])
                this.editor.setOptions({
                    theme: 'ace/theme/dracula',
                    mode: 'ace/mode/python',
                    enableBasicAutocompletion: true,
                })
            },
            { immediate: true }
        )
    },
    computed: {
        code() {
            return this.blob ? this.blob.text : ''
        },
    },
    methods: {
        updateCode(evt) {
            console.log(evt)
            this.$emit('updateCode', {
                text: this.editor.getValue(),
            })
        },
    },
}
</script>

<style scoped>
</style>