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
        }
    },
    props: {
        code: {
            type: String,
        },
        canEdit: {
            type: Boolean,
            default: false,
        },
    },
    mounted() {
        this.editor = ace.edit(this.$el, {
            value: this.code,
            theme: 'ace/theme/dracula',
            mode: 'ace/mode/python',
            wrap: true,
            autoScrollEditorIntoView: true,
            minLines: 60,
            maxLines: 200,
            fontSize: 16,
            highlightSelectedWord: true,
            highlightGutterLine: true,
        })
        this.editor.resize()
        this.editor.on('blur', this.updateCode)
        this.editor.setReadOnly(!this.canEdit)
    },
    methods: {
        updateCode(evt) {
            console.log(evt)
            this.$emit('codeChanged', {
                text: this.editor.getValue(),
            })
        },
    },
}
</script>

<style scoped>
</style>