<template>
<div>
    <!-- <h4>{{$store.state.userName}} - {{$store.state.projectName}}</h4> -->
    <bokeh-app :script="appScript" :key="appScript" v-if="appScript"></bokeh-app>
</div>
</template>

<script>
import BokehApp from './BokehApp.vue'
import { mapState } from 'vuex'

export default {
    name: 'app-preview',
    props: {
        userName: {
            type: String
        },
        projectName: {
            type: String
        }
    },
    components: {
        'bokeh-app': BokehApp
    },
    computed: {
        ...mapState(['code', 'appScript'])
    },
    mounted () {
        console.log("mounting app preview")
    },
}
</script>