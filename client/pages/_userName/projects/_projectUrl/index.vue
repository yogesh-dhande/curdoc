<template>
    <bokeh-app :script="script" :key="script" v-if="script"></bokeh-app>
</template>

<script>
import BokehApp from '@/components/BokehApp.vue'
import { mapState } from 'vuex'

export default {
    name: 'app',
    async asyncData(context) {
        let returnData = {
            userName: context.params.userName,
            projectUrl: context.params.projectUrl,
        }
        return returnData
    },
    data() {
        return {
            script: null,
            scriptWatcher: null,
        }
    },
    components: {
        'bokeh-app': BokehApp,
    },
    computed: {
        ...mapState(['appScript']),
    },
    methods: {
        setScript() {
            console.log('setting local script from state.appScript')
            this.script = this.appScript
            this.$store.commit('setAppScript', null)
        },
    },
    mounted() {
        console.log(
            `mounting app preview for ${this.userName} - ${this.projectUrl}`
        )

        if (!this.script) {
            let payload = {
                userName: this.userName,
                projectUrl: this.projectUrl,
            }
            this.$store.dispatch('setAppScript', payload).then(() => {
                this.$store.dispatch('setProject', payload)
            })
        }
    },
    beforeRouteEnter(to, from, next) {
        console.log('entering app preview route')

        next((vm) => {
            if (vm.appScript) {
                vm.setScript()
            } else {
                vm.scriptWatcher = vm.$watch('appScript', () => {
                    vm.setScript()
                    vm.scriptWatcher()
                    vm.scriptWatcher = null
                })
            }
        })
    },
    beforeRouteUpdate(to, from, next) {
        console.log('updating app preview route')
        next()
    },
    beforeRouteLeave(to, from, next) {
        console.log('leaving app preview route')
        if (this.scriptWatcher) {
            this.scriptWatcher()
        }
        next()
    },
}
</script>