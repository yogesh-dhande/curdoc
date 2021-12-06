<template>
    <div class="min-h-screen bg-gray-800">
        <NavBar
            class="z-50"
            :class="[view.atTopOfPage ? '' : 'shadow-2xl bg-gray-800']"
        />
        <toolbar
            :key="project.id"
            :project="project"
            :class="{ 'sticky top-0 z-50': project.id }"
        />
        <Nuxt keep-alive />
        <AppFooter />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import NavBar from '@/components/NavBar'

export default {
    components: {
        NavBar,
    },
    data() {
        return {
            view: {
                atTopOfPage: true,
            },
        }
    },
    computed: {
        ...mapState(['project']),
    },

    // a beforeMount call to add a listener to the window
    mounted() {
        window.addEventListener('scroll', this.handleScroll)
    },

    methods: {
        // the function to call when the user scrolls, added as a method
        handleScroll() {
            // when the user scrolls, check the pageYOffset
            if (window.pageYOffset > 0) {
                // user is scrolled
                if (this.view.atTopOfPage) this.view.atTopOfPage = false
            } else if (!this.view.atTopOfPage) this.view.atTopOfPage = true
        },
    },
}
</script>

<style>
</style>
