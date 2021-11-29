<template>
    <bokeh-app v-if="script" :key="script" :script="script"></bokeh-app>
</template>

<script>
import BokehApp from '@/components/BokehApp.vue'
import { mapState } from 'vuex'

export default {
    name: 'App',
    components: {
        'bokeh-app': BokehApp,
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
    asyncData(context) {
        const returnData = {
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
    computed: {
        ...mapState(['appScript']),
    },
    async mounted() {
        console.log(
            `mounting app preview for ${this.userName} - ${this.projectUrl}`
        )

        if (!this.script) {
            const payload = {
                userName: this.userName,
                projectUrl: this.projectUrl,
            }
            await this.$store.dispatch('setProject', payload)
            await this.$store.dispatch('setAppScript')
        }
    },
    methods: {
        setScript() {
            console.log('setting local script from state.appScript')
            this.script = this.appScript
            this.$store.commit('SET_APP_SCRIPT', null)
        },
    },
}
</script>