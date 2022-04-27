<template>
    <div v-if="project.id">
        <div class="flex flex-col bg-gray-900">
            <div class="flex justify-center rounded shadow-2xl">
                <Tooltip tooltip="Code">
                    <nuxt-link
                        class="
                            block
                            px-3
                            py-2
                            rounded-lg
                            hover:bg-gray-700
                            text-blue-100
                            hover:text-blue-300
                        "
                        :to="codeUrl"
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
                            />
                        </svg> </nuxt-link
                ></Tooltip>
                <Tooltip tooltip="App">
                    <nuxt-link
                        class="
                            block
                            px-3
                            py-2
                            rounded-lg
                            hover:bg-gray-700
                            text-blue-100
                            hover:text-blue-300
                        "
                        :to="appUrl"
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
                            />
                        </svg>
                    </nuxt-link>
                </Tooltip>
                <Tooltip v-if="logs" tooltip="Log">
                    <nuxt-link
                        class="
                            block
                            px-3
                            py-2
                            rounded-lg
                            hover:bg-gray-700
                            text-blue-100
                            hover:text-blue-300
                        "
                        :to="logUrl"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </nuxt-link>
                </Tooltip>
                <Tooltip tooltip="Conda Environment">
                    <nuxt-link
                        class="
                            block
                            px-3
                            py-2
                            rounded-lg
                            hover:bg-gray-700
                            text-blue-100
                            hover:text-blue-300
                        "
                        :to="envUrl"
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
                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </nuxt-link>
                </Tooltip>
            </div>
            <h3 v-if="!loggedIn" class="text-blue-100 m-0 p-2 text-center">
                <span class="text-blue-300">
                    <nuxt-link to="/login">Log in or sign up</nuxt-link></span
                >
                to start creating your own projects.
            </h3>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
    props: {
        project: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        ...mapState(['logs']),
        ...mapGetters(['loggedIn']),
        codeUrl() {
            return `/${this.project.user.name}/projects/${this.project.slug}/code`
        },
        appUrl() {
            return `/${this.project.user.name}/projects/${this.project.slug}`
        },
        envUrl() {
            return `/${this.project.user.name}/projects/${this.project.slug}/environment`
        },
        logUrl() {
            return `/${this.project.user.name}/projects/${this.project.slug}/log`
        },
    },
}
</script>

<style>
</style>