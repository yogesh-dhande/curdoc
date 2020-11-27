<template>
    <div></div>
</template>

<script>
    import postscribe from 'postscribe'

    export default {
        name: 'bokeh-app',
        props: {
            script: {
                type: String
            }
        },
        computed: {
        },
        mounted() {
            console.log(this.script)
            postscribe(this.$el, this.script)
        }
    }
</script>