<template>
    <div
        class="
            max-w-2xl
            mx-auto
            px-2
            lg:px-12
            py-2
            lg:py-12
            text-blue-100
            bg-gray-800
            min-h-screen
        "
    >
        <create-project class="shadow-2xl p-2"></create-project>
        <div class="flex flex-col space-y-4 px-12 py-8 rounded">
            <div
                v-for="(project, projectId) in currentUser.projects"
                :key="projectId"
                class="flex space-x-4"
            >
                <nuxt-link
                    class="text-blue-500 underline hover:text-blue-600"
                    :to="`/${currentUser.name}/projects/${project.slug}`"
                    >{{ project.slug }}/app</nuxt-link
                >
                <nuxt-link
                    class="text-blue-500 underline hover:text-blue-600"
                    :to="`/${currentUser.name}/projects/${project.slug}/code`"
                    >{{ project.slug }}/code</nuxt-link
                >
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import CreateProject from '@/components/CreateProject'

export default {
    name: 'Dashboard',
    middleware: 'auth',
    componets: {
        CreateProject,
    },
    data() {
        return {
            posts: [],
            listeners: [],
        }
    },
    head() {
        return this.$createSEOMeta({
            title: 'Dashboard. Broccolini',
            noIndex: true,
        })
    },
    computed: {
        ...mapState(['currentUser', 'readonly']),
        storageUsed() {
            if (this.readonly) {
                return this.formatBytes(this.readonly.totalStorageUsed, 1)
            }
            return this.formatBytes(0, 1)
        },
    },
    watch: {
        currentUser() {
            this.detachListeners()
            this.attachListerners()
        },
    },
    mounted() {
        this.attachListerners()
    },
    beforeDestroy() {
        this.detachListeners()
    },
    methods: {
        attachListerners() {
            if (this.currentUser.id) {
                const listener = this.$projectsCollection
                    .where('user.id', '==', this.currentUser.id)
                    .onSnapshot((querySnapshot) => {
                        this.posts = []
                        querySnapshot.forEach((doc) => {
                            this.posts.push(doc.data())
                        })
                    })
                this.listeners.push(listener)
            }
        },
        detachListeners() {
            if (this.listeners) {
                this.listeners.forEach((listener) => listener())
            }
        },
        formatBytes(bytes, decimals = 2) {
            const k = 1024
            const dm = decimals < 0 ? 0 : decimals
            const sizes = [
                'Bytes',
                'KB',
                'MB',
                'GB',
                'TB',
                'PB',
                'EB',
                'ZB',
                'YB',
            ]

            if (bytes === 0)
                return {
                    size: 0,
                    units: sizes[0],
                }

            const i = Math.floor(Math.log(bytes) / Math.log(k))

            return {
                size: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
                units: sizes[i],
            }
        },
    },
}
</script>

<style>
</style>