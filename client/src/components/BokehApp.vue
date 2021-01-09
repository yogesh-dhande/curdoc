<template>
    <div ref="script-app"></div>
</template>

<script>
import postscribe from 'postscribe'

export default {
    name: 'bokeh-app',
    props: {
        script: {
            type: String,
        },
    },
    computed: {},
    mounted() {
        console.log('mounting bokeh app')
        postscribe(this.$refs['script-app'], this.script)
    },
}
</script>