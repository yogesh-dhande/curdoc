<template>
    <div>
        <monaco-editor
            v-if="blob"
            :blob="blob"
            :canEdit="canEdit"
            @updateCode="updateCode"
        ></monaco-editor>
    </div>
</template>

<script>
import MonacoEditor from '@/components/MonacoEditor'
import { mapGetters } from 'vuex'

export default {
    name: 'code-editor',
    props: {
        project: {
            type: Object,
        },
    },
    components: {
        'monaco-editor': MonacoEditor,
    },
    data() {
        return {
            editor: null,
            codeChanged: false,
            codeChangeCallback: null,
        }
    },
    computed: {
        ...mapGetters(['canEdit']),
        blob() {
            if (this.project.blob.length > 0) {
                return this.project.blob[0]
            }
        },
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
    mounted() {
        console.log('mounting code editor')
    },
}
</script>