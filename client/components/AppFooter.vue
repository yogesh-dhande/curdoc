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
                    to="/blog"
                    class="text-blue-100 hover:text-blue-400 px-3 py-2 text-lg font-bold border-transparent"
                    @click.native="scrollToTop"
                    >About</nuxt-link
                >
                <nuxt-link
                    to="/blog/posts"
                    class="text-blue-100 hover:text-blue-400 px-3 py-2 text-lg font-bold border-transparent"
                    @click.native="scrollToTop"
                    >Blog</nuxt-link
                >
                <nuxt-link
                    to="/demo"
                    class="text-blue-100 hover:text-blue-400 px-3 py-2 text-lg font-bold border-transparent"
                    @click.native="scrollToTop"
                    >Demo</nuxt-link
                >
                <nuxt-link
                    to="/discover"
                    class="text-blue-100 hover:text-blue-400 px-3 py-2 text-lg font-bold border-transparent"
                    @click.native="scrollToTop"
                    >Discover</nuxt-link
                >
                <nuxt-link
                    to="/feedback"
                    class="text-blue-100 hover:text-blue-400 px-3 py-2 text-lg font-bold border-transparent"
                    @click.native="scrollToTop"
                    >Feedback</nuxt-link
                >
                <nuxt-link
                    v-if="!currentUser.id"
                    to="/login"
                    class="text-blue-100 hover:text-blue-400 px-3 py-2 text-lg font-bold border-transparent"
                    @click.native="scrollToTop"
                    >Sign In</nuxt-link
                >
                <nuxt-link
                    v-if="!currentUser.id"
                    to="/register"
                    class="text-blue-100 hover:text-blue-400 px-3 py-2 text-lg font-bold border-transparent"
                    @click.native="scrollToTop"
                    >Sign Up</nuxt-link
                >
                <!-- <nuxt-link
                    to="#"
                    class="text-blue-100 hover:text-blue-400 px-3 py-2 text-lg font-bold border-transparent"
                    >FAQs</nuxt-link
                > -->
            </nav>

            <p class="mt-8 text-center text-base text-gray-400">
                &copy; 2021 Broccolini, All rights reserved.
            </p>
        </div>
    </footer>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'app-footer',
    methods: {
        scrollToTop() {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth',
            })
        },
    },
    computed: {
        ...mapState(['currentUser']),
    },
}
</script>

<style>
</style>