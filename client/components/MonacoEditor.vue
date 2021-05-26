<template>
    <div class="min-h-screen"></div>
</template>

<script>
export default {
    name: 'monaco',
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
        this.$editor.initialize(this.$el)
        this.$editor.setModel(this.blob.fullPath, this.blob.text, !this.canEdit)
        this.$editor.setCallback(this.updateCode)
    },
    watch: {
        'blob.fullPath'() {
            this.$editor.setModel(this.blob.fullPath, this.blob.text)
        },
        canEdit() {
            this.$editor.setReadOnly(!this.canEdit)
        },
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