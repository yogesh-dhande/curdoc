<template>
    <div class="bg-gray-800 min-h-screen">
        <div
            class="
                max-w-4xl
                mx-auto
                text-center
                py-12
                px-2
                sm:px-6
                lg:py-16 lg:px-8
            "
        >
            <div class="flex flex-col place-items-center">
                <h1
                    class="
                        text-4xl
                        tracking-tight
                        font-extrabold
                        text-blue-100
                        sm:text-5xl
                        md:text-6xl
                        lg:text-7xl
                    "
                >
                    Build and share
                    <span class="block text-blue-400"> Bokeh and Panel </span
                    >applications
                </h1>
            </div>
            <div class="mt-8 flex justify-center">
                <div class="inline-flex rounded-md shadow">
                    <nuxt-link
                        to="/register"
                        class="
                            w-full
                            px-8
                            py-3
                            border border-transparent
                            font-bold
                            rounded-md
                            text-blue-50
                            bg-blue-500
                            hover:bg-blue-600
                            border-none
                            md:py-4 md:text-lg md:px-10
                        "
                    >
                        Start Coding
                    </nuxt-link>
                </div>
                <div class="ml-3 inline-flex">
                    <button
                        class="
                            w-full
                            px-8
                            py-3
                            border border-transparent
                            font-bold
                            rounded-md
                            text-blue-700
                            bg-blue-100
                            hover:bg-blue-300
                            md:py-4 md:text-lg md:px-10
                        "
                        @click="() => createDemo('bokeh')"
                    >
                        Try Bokeh Demo
                    </button>
                </div>
                <div class="ml-3 inline-flex">
                    <button
                        class="
                            w-full
                            px-8
                            py-3
                            border border-transparent
                            font-bold
                            rounded-md
                            text-blue-700
                            bg-blue-100
                            hover:bg-blue-300
                            md:py-4 md:text-lg md:px-10
                        "
                        @click="() => createDemo('panel')"
                    >
                        Try Panel Demo
                    </button>
                </div>
            </div>
            <h2 class="mt-6 text-blue-100 font-medium text-xl">
                Have questions? Ask them
                <nuxt-link to="/feedback" class="text-blue-400 italic"
                    >here!</nuxt-link
                >
            </h2>
        </div>
        <div class="pb-20 bg-gray-800"></div>
    </div>
</template>

<script>
import { demos } from '@/store/demo'
export default {
    methods: {
        createDemo(name) {
            this.$store.commit('SET_PROJECT', demos[name])
            this.$store.commit('SET_USER', demos.user)
            this.$store.commit('SET_CODE_CHANGED', true)
            this.$router.push(
                `/${demos.user.name}/projects/${demos[name].slug}/code`
            )
        },
    },
}
</script>

<style>
</style>