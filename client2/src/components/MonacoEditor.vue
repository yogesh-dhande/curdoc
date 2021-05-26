<template>
    <div class="editor"></div>
</template>

<script>
import { editorService } from '@/languageClient'

export default {
    name: 'monaco',
    data() {
        return {
            editor: Object,
            editorSessions: {},
        }
    },
    props: {
        project: {
            type: Object,
        },
        blob: {
            type: Object,
        },
        canEdit: {
            type: Boolean,
            default: true,
        },
    },
    mounted() {
        editorService.initialize(this.$el)
        editorService.setModel(this.project.id, this.blob.text, !this.canEdit)
        editorService.setCallback(this.updateCode)
    },
    watch: {
        'blob.text'() {
            editorService.setModel(this.project.id, this.blob.text)
        },
    },
    methods: {
        updateCode() {
            this.$emit('updateCode', {
                text: editorService.getValue(),
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