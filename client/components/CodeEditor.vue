<template>
    <div>
        <monaco-editor
            :blob="blob"
            :can-edit="canEdit"
            @updateCode="updateCode"
        ></monaco-editor>
    </div>
</template>

<script>
import MonacoEditor from '@/components/MonacoEditor'

export default {
    components: {
        'monaco-editor': MonacoEditor,
    },
    props: {
        blob: {
            type: Object,
            default: () => {
                return {
                    fullPath: 'initialPath',
                    relativePath: 'app/main.py',
                    text: '',
                }
            },
        },
        canEdit: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            codeChanged: false,
            codeChangeCallback: null,
        }
    },
    methods: {
        updateCode(evt) {
            this.codeChanged = true
            clearTimeout(this.codeChangeCallback)

            this.codeChangeCallback = setTimeout(() => {
                if (this.codeChanged) {
                    this.$store.dispatch('updateCode', {
                        blob: this.blob,
                        text: evt.text,
                    })
                    this.codeChanged = false
                }
            }, 3000)
        },
    },
}
</script>