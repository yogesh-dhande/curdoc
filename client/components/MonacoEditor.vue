<template>
    <div class="min-h-screen"></div>
</template>

<script>
export default {
    props: {
        blob: {
            type: Object,
            default: () => {
                return {
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
    watch: {
        'blob.fullPath'() {
            console.log('watching to update')
            this.$editor.setModel(
                this.blob.fullPath,
                this.blob.text,
                !this.canEdit
            )
        },
        canEdit() {
            this.$editor.setReadOnly(!this.canEdit)
        },
    },
    mounted() {
        console.log('mounting monaco editor')
        this.$editor.initialize(this.$el)
        this.$editor.setModel(this.blob.fullPath, this.blob.text, !this.canEdit)
        this.$editor.setCallback(this.updateCode)
    },
    methods: {
        updateCode() {
            this.$emit('updateCode', {
                text: this.$editor.getValue(),
            })
        },
    },
}
</script>

<style>
</style>