<template>
    <div>
        <nav-bar/>
        <bokeh-app :script="appScript" :key="appScript" lazy></bokeh-app>
    </div>
</template>

<script>
import NavBar from './NavBar.vue'
import BokehApp from './BokehApp.vue'
import { mapState } from 'vuex'

export default {
    name: 'app-preview',
    props: {
        projectId: {
            type: String
        }
    },
    components: {
        'nav-bar': NavBar,
        'bokeh-app': BokehApp
    },
    computed: {
        ...mapState(['code', 'appScript'])
    },
    mounted () {
        console.log(this.projectId)
    }
}
</script>