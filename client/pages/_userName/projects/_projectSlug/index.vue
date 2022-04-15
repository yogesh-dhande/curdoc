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
        next()
    },
    beforeRouteLeave(to, from, next) {
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
        if (
            context.store.state.project.slug !== returnData.projectSlug ||
            context.store.state.project.user.name !== returnData.userName
        ) {
            await context.store.dispatch('setProject', returnData)
            await context.store.dispatch('setAppScript', context.query)
        } else if (context.store.state.codeChanged) {
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
        this.setScript()
    },
    methods: {
        setScript() {
            if (this.appScript) {
                this.script = this.appScript
                this.$store.commit('SET_APP_SCRIPT', null)
            }
        },
    },
}
</script>