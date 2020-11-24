<template>
    <div id="id"></div>
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
            console.log('Mouting bokeh app')
            postscribe('#id', this.script)
        }
    }
</script>