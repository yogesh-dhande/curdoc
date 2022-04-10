<template>
    <div
        ref="script-app"
        class="bg-white flex lg:justify-center min-h-screen pt-4"
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
        postscribe(this.$refs['script-app'], this.script)
    },
}
</script>