<template>
    <div class="min-h-screen bg-white">
        <bokeh-app v-if="url" :key="url" :url="url"></bokeh-app>
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
                vm.setAppUrl()
            }, 1000) // let the DOM load
            vm.appUrlWatcher = vm.$watch('appUrl', () => {
                vm.setAppUrl()
                if (vm.appUrlWatcher) {
                    vm.appUrlWatcher()
                    vm.appUrlWatcher = null
                }
            })
        })
    },
    beforeRouteUpdate(to, from, next) {
        next()
    },
    beforeRouteLeave(to, from, next) {
        if (this.appUrlWatcher) {
            this.appUrlWatcher()
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
            await context.store.dispatch('setAppUrl', context.query)
        } else if (context.store.state.codeChanged) {
            await context.store.dispatch('setAppUrl', context.query)
        }
        return returnData
    },
    data() {
        return {
            url: null,
            appUrlWatcher: null,
        }
    },
    computed: {
        ...mapState(['appUrl', 'project', 'codeChanged']),
    },
    watch: {
        codeChanged(newValue) {
            if (newValue) {
                this.url = null
            }
        },
    },
    mounted() {
        this.setAppUrl()
    },
    methods: {
        setAppUrl() {
            if (this.appUrl) {
                this.url = this.appUrl
                this.$store.commit('SET_APP_URL', null)
            }
        },
    },
}
</script>