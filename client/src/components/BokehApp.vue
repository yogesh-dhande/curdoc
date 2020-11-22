<template>
    <div>
        <nav-bar/>
        <div id="id"></div>
    </div>
</template>

<script>
    import postscribe from 'postscribe'
    import axios from 'axios'
    import NavBar from './NavBar.vue'

    export default {
        name: 'bokeh-app',
        components: {
            'nav-bar': NavBar
        },
        props: {
            id: {
                type: String
            },
            script: {
                type: String
            }
        },
        mounted() {
            axios.get('http://localhost:8000/code/default')
            .then(
                res => {
                    console.log(res)
                    postscribe('#id', res.data.script)
                }
            )

        }
    }
</script>