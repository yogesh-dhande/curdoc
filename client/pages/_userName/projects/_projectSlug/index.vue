<template>
    <div class="min-h-screen bg-white">
        <bokeh-app v-if="script" :key="script" :script="script"></bokeh-app>
    </div>
</template>

<script>
import BokehApp from '@/components/BokehApp.vue'
import { mapState } from 'vuex'

export default {
    key(route) {
        return route.name
    },
    components: {
        'bokeh-app': BokehApp,
    },
    beforeRouteEnter(to, from, next) {
        console.log('entering app preview route')
        next((vm) => {
            setTimeout(() => {
                vm.setScript()
            }, 1000) // let the DOM load
            vm.scriptWatcher = vm.$watch('appScript', () => {
                vm.setScript()
                if (vm.scriptWatcher) {
                    vm.scriptWatcher()
                    vm.scriptWatcher = null
                }
            })
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
    async asyncData(context) {
        const returnData = {
            userName: context.params.userName,
            projectSlug: context.params.projectSlug,
        }
        console.log('async data on app route called')
        if (
            context.store.state.project.slug !== returnData.projectSlug ||
            context.store.state.project.user.name !== returnData.userName
        ) {
            await context.store.dispatch('setProject', returnData)
            await context.store.dispatch('setAppScript', context.query)
        } else if (context.store.state.codeChanged) {
            console.log('code was changed. getting new script tag')
            await context.store.dispatch('setAppScript', context.query)
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
        ...mapState(['appScript', 'project', 'codeChanged']),
    },
    watch: {
        codeChanged(newValue) {
            if (newValue) {
                this.script = null
            }
        },
    },
    mounted() {
        console.log(
            `mounting app preview for ${this.userName} - ${this.projectSlug}`
        )
        this.setScript()
    },
    updated() {
        console.log('updated app route')
    },
    methods: {
        setScript() {
            if (this.appScript) {
                console.log('setting local script from state.appScript')
                this.script = this.appScript
                this.$store.commit('SET_APP_SCRIPT', null)
            }
        },
    },
}
</script>