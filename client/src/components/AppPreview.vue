<template>
<div style="min-height:100%">
    <bokeh-app :script="appScript" :key="appScript" v-if="appScript"></bokeh-app>
</div>
</template>

<script>
import BokehApp from './BokehApp.vue'
import axios from "axios"

export default {
    name: 'app-preview',
        props: {
            project: {
                type: Object
            }
        },
    components: {
        'bokeh-app': BokehApp
    },
    data () {
        return {
            appScript: null
        }
    },
    mounted () {
        console.log(`mounting app preview for ${this.project.user_name} - ${this.project.name}`)
        this.$store.commit("setLoading", true)
        axios.get(`${process.env.VUE_APP_BACKEND_URL}/script`, 
        { params: {
                user_name: this.project.user.name,
                project_name: this.project.name
        } } )
        .then((res) => {
          console.log(res.data)
          this.appScript = res.data
          this.$store.commit("setLoading", false)
        });

    },
}
</script>