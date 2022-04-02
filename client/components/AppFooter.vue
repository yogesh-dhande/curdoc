<template>
    <footer class="bg-gray-900">
        <div
            class="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8"
        >
            <nav
                class="-mx-5 -my-2 flex flex-wrap justify-center"
                aria-label="Footer"
            >
                <nuxt-link
                    to="/"
                    class="
                        text-blue-100
                        hover:text-blue-400
                        px-3
                        py-2
                        text-lg
                        font-bold
                        border-transparent
                    "
                    @click.native="scrollToTop"
                    >Curdoc</nuxt-link
                >
                <nuxt-link
                    to="/dashboard"
                    class="
                        text-blue-100
                        hover:text-blue-400
                        px-3
                        py-2
                        text-lg
                        font-bold
                        border-transparent
                    "
                    @click.native="scrollToTop"
                    >Dashboard</nuxt-link
                >
                <nuxt-link
                    to="/contact"
                    class="
                        text-blue-100
                        hover:text-blue-400
                        px-3
                        py-2
                        text-lg
                        font-bold
                        border-transparent
                    "
                    @click.native="scrollToTop"
                    >Feedback</nuxt-link
                >
                <nuxt-link
                    v-if="!loggedIn"
                    to="/login"
                    class="
                        text-blue-100
                        hover:text-blue-400
                        px-3
                        py-2
                        text-lg
                        font-bold
                        border-transparent
                    "
                    @click.native="scrollToTop"
                    >Sign In</nuxt-link
                >
                <nuxt-link
                    v-if="!loggedIn"
                    to="/register"
                    class="
                        text-blue-100
                        hover:text-blue-400
                        px-3
                        py-2
                        text-lg
                        font-bold
                        border-transparent
                    "
                    @click.native="scrollToTop"
                    >Sign Up</nuxt-link
                >
            </nav>

            <p class="mt-8 text-center text-base text-gray-400">
                &copy; {{ new Date().getFullYear() }} Curdoc. All rights
                reserved.
            </p>
        </div>
    </footer>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters(['loggedIn']),
    },
    methods: {
        scrollToTop() {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth',
            })
        },
    },
}
</script>

<style>
</style>