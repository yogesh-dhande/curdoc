<template>
    <div v-if="project.id" class="text-center">
        <div class="inline-flex bg-gray-900 rounded shadow-2xl">
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
                </svg>
            </nuxt-link>
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
        </div>
    </div>
</template>

<script>
export default {
    props: {
        project: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        codeUrl() {
            return `/${this.project.user.name}/projects/${this.project.slug}/code`
        },
        appUrl() {
            return `/${this.project.user.name}/projects/${this.project.slug}`
        },
    },
}
</script>

<style>
</style>