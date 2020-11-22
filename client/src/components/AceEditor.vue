<template>
    <div id="editor" style="height:100%; width:100%"></div>
</template>

<script>

const ace = require("ace-builds")
require("ace-builds/webpack-resolver")

export default {
    name: 'ace-editor',
    data () {
        return {
            editor: Object
        }
    },
    props: {

    },
    mounted() {
        this.editor = ace.edit("editor", {
            theme: "ace/theme/dracula",
            mode: "ace/mode/python",
            wrap: true,
            autoScrollEditorIntoView: true,
            minLines: 60,
            maxLines: 200,
            fontSize: 16,
            highlightSelectedWord: true,
            highlightGutterLines: true

        });
        this.editor.resize()
    }

}
</script>

<style scoped>
</style>