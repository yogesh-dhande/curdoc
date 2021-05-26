<template>
    <nav>
        <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div
                class="relative flex whitespace-nowrap items-center justify-between h-16"
            >
                <div
                    class="absolute inset-y-0 left-0 flex items-center lg:hidden"
                >
                    <!-- Mobile menu button-->
                    <button
                        class="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-100"
                        aria-expanded="false"
                        @click="showMobileMenu = !showMobileMenu"
                    >
                        <span class="sr-only">Open main menu</span>
                        <!-- Icon when menu is closed. -->
                        <!--
            Heroicon name: outline/menu

            Menu open: "hidden", Menu closed: "block"
          -->
                        <svg
                            class="block h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                        <!-- Icon when menu is open. -->
                        <!--
            Heroicon name: outline/x

            Menu open: "block", Menu closed: "hidden"
          -->
                        <svg
                            class="hidden h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div
                    class="flex-1 flex items-center justify-center lg:items-stretch lg:justify-start"
                >
                    <div
                        class="flex-shrink-0 text-blue-100 hover:text-blue-400 font-bold text-2xl flex items-center border-transparent"
                    >
                        <nuxt-link to="/" class="italic">
                            Broccolini
                            <!-- <img
                class="inline h-8 md:h-10 lg:h-12 bg-gray-800"
                src="./../static/logo.png"
                alt="REPL Notes Logo"
            /> -->
                        </nuxt-link>
                    </div>
                </div>
                <div
                    class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
                >
                    <div class="hidden lg:block md:ml-6">
                        <div class="flex space-x-4">
                            <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                            <nuxt-link
                                to="/feedback"
                                class="text-blue-100 hover:text-blue-400 px-3 py-2 text-lg font-bold border-transparent"
                                >Feedback</nuxt-link
                            >
                            <nuxt-link
                                to="/dashboard"
                                class="text-blue-100 hover:text-blue-400 px-3 py-2 text-lg font-bold border-transparent"
                                >Dashboard</nuxt-link
                            >

                            <div v-if="!currentUser.id" class="self-center">
                                <nuxt-link
                                    to="/login"
                                    class="text-blue-100 hover:text-blue-400 px-3 py-2 text-lg font-bold border-transparent"
                                    >Sign In</nuxt-link
                                >
                                <nuxt-link
                                    to="/register"
                                    class="text-blue-100 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-md font-bold mx-4"
                                    >Sign Up</nuxt-link
                                >
                            </div>
                            <div v-else>
                                <button
                                    class="text-blue-100 hover:text-blue-400 px-3 py-2 text-lg font-bold border-transparent"
                                    id="user-menu"
                                    aria-haspopup="true"
                                    @click="logout"
                                >
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--
    Mobile menu, toggle classes based on menu state.

    Menu open: "block", Menu closed: "hidden"
  -->
        <div class="lg:hidden" :class="{ hidden: !showMobileMenu }">
            <div class="px-2 pt-2 pb-3 space-y-1">
                <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                <nuxt-link
                    to="/feedback"
                    class="block text-blue-100 hover:text-blue-400 px-3 py-2 text-lg font-bold"
                    >Feedback</nuxt-link
                >
                <nuxt-link
                    to="/dashboard"
                    class="block text-blue-100 hover:text-blue-400 px-3 py-2 text-lg font-bold"
                    >Dashboard</nuxt-link
                >
                <div v-if="!currentUser.id">
                    <nuxt-link
                        to="/login"
                        class="block text-blue-100 hover:text-blue-400 px-3 py-2 text-lg font-bold"
                        >Sign In</nuxt-link
                    >
                    <nuxt-link
                        to="/register"
                        class="block text-blue-100 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-md font-bold"
                        >Sign Up</nuxt-link
                    >
                </div>
                <div v-else>
                    <button
                        class="block text-blue-100 hover:text-blue-400 px-3 py-2 text-lg font-bold"
                        id="user-menu"
                        aria-haspopup="true"
                        @click="logout"
                    >
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'nav-bar',
    data() {
        return {
            showProfileMenu: false,
            showMobileMenu: false,
        }
    },
    methods: {
        logout() {
            this.$fire.auth.signOut().finally(() => {
                this.$store.commit('SET_USER', {})
                this.$router.go()
            })
        },
    },
    computed: {
        ...mapState(['currentUser']),
    },
}
</script>
