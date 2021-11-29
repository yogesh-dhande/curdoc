<template>
    <div>
        <monaco-editor
            v-if="blob"
            :blob="blob"
            :can-edit="canEdit"
            @updateCode="updateCode"
        ></monaco-editor>
    </div>
</template>

<script>
import MonacoEditor from '@/components/MonacoEditor'
import { mapGetters } from 'vuex'

export default {
    components: {
        'monaco-editor': MonacoEditor,
    },
    props: {
        project: {
            type: Object,
            default: () => {
                return {
                    id: null,
                    blob: [],
                }
            },
        },
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
            return null
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
}
</script>