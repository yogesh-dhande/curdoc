<template>
    <div
        ref="script-app"
        class="bg-white flex justify-center min-h-screen pt-12"
    ></div>
</template>

<script>
import postscribe from 'postscribe'

export default {
    props: {
        script: {
            type: String,
            default: null,
        },
    },
    mounted() {
        if (this.script) {
            postscribe(this.$refs['script-app'], this.script)
        }
    },
}
</script>