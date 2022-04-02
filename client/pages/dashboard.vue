<template>
    <div class="max-w-lg mx-auto">
        <verify-email v-if="loggedIn && !isEmailVerified" />
        <div
            v-else
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
                    <div class="flex flex-row space-x-2 items-center">
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
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                /></svg
                        ></nuxt-link>
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
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                /></svg
                        ></nuxt-link>
                        <confirmed-delete
                            class="
                                text-blue-300
                                hover:text-blue-400
                                bg-gray-800
                                rounded-xl
                                px-3
                                py-1
                            "
                            :errors="errors"
                            @click="() => deleteProject(projectId)"
                            @clear="() => (errors = [])"
                        >
                            <template #message>
                                <div class="mx-4">
                                    <p class="text-sm text-gray-600">
                                        Are you sure you want to delete this
                                        project? This action cannot be be
                                        undone.
                                    </p>
                                </div>
                            </template>
                        </confirmed-delete>
                    </div>
                </div>
            </card>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { deleteDoc, doc } from 'firebase/firestore'

export default {
    middleware: 'auth',
    data() {
        return {
            posts: [],
            listeners: [],
            errors: [],
        }
    },
    head() {
        return this.$createSEOMeta({
            title: 'Dashboard. Curdoc',
            noIndex: true,
        })
    },
    computed: {
        ...mapState(['currentUser', 'readonly', 'isEmailVerified']),
        ...mapGetters(['loggedIn']),
        storageUsed() {
            if (this.readonly) {
                return this.formatBytes(this.readonly.totalStorageUsed, 1)
            }
            return this.formatBytes(0, 1)
        },
    },
    methods: {
        async deleteProject(projectId) {
            try {
                await deleteDoc(doc(this.$firebase.db, 'projects', projectId))
            } catch (error) {
                this.errors.push(error.message)
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