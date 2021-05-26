<template>
    <div ref="script-app"></div>
</template>

<script>
// import postscribe from 'postscribe'

export default {
    name: 'bokeh-app',
    props: {
        script: {
            type: String,
        },
    },
    computed: {},
    mounted() {
        if (this.script) {
            postscribe(this.$refs['script-app'], this.script)
        }
    },
}
</script>