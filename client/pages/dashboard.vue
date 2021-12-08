<template>
    <div class="max-w-lg mx-auto">
        <div
            class="
                py-2
                mx-2
                lg:py-4
                text-blue-100
                bg-gray-800
                min-h-screen
                flex flex-col
                space-y-4
            "
        >
            <div class="px-4 py-5 border-b border-blue-200 sm:px-6">
                <h3
                    class="
                        text-xl
                        sm:text-2xl
                        lg:text-4xl
                        leading-6
                        font-bold
                        text-blue-300
                    "
                >
                    Projects
                </h3>
            </div>
            <create-project class="shadow-2xl"></create-project>
            <card
                v-for="(project, projectId) in currentUser.projects"
                :key="projectId"
                class="
                    px-2
                    sm:px-6
                    py-2
                    rounded
                    shadow
                    bg-gray-900
                    text-blue-100
                "
            >
                <div class="flex items-center space-x-8 justify-between">
                    <div>{{ project.slug }}</div>
                    <div class="flex flex-row space-x-2">
                        <nuxt-link
                            class="
                                block
                                text-blue-300
                                hover:text-blue-400
                                bg-gray-800
                                rounded-xl
                                px-3
                                py-2
                            "
                            :to="`/${currentUser.name}/projects/${project.slug}`"
                            >app</nuxt-link
                        >
                        <nuxt-link
                            class="
                                block
                                text-blue-300
                                hover:text-blue-400
                                bg-gray-800
                                rounded-xl
                                px-3
                                py-2
                            "
                            :to="`/${currentUser.name}/projects/${project.slug}/code`"
                            >code</nuxt-link
                        >
                    </div>
                </div>
            </card>
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
    methods: {
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