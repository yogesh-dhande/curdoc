<template>
    <card
        class="flex justify-center shadow bg-gray-900 bg-opacity-25 text-indigo-100"
    >
        <h2 class="mx-2 text-blue-300">New Project</h2>

        <div class="flex">
            <url-slug-input
                v-model="url"
                :prefix="baseUrl"
                @focus="
                    urlErrors = []
                    errors = []
                "
            ></url-slug-input>

            <button
                class="px-3 py-1 bg-blue-500 rounded shadow hover:bg-blue-600"
                @click="createProject"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 stroke-current stroke-1"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            </button>
        </div>

        <input-errors :errors="urlErrors"></input-errors>
    </card>
</template>

<script>
import URLSlugInput from '@/components/URLSlugInput'

import Card from '@/components/Card'

import { mapState, mapGetters } from 'vuex'

export default {
    name: 'CreateProject',
    components: {
        'url-slug-input': URLSlugInput,
        Card,
    },
    data() {
        return {
            projectRef: this.$projectsCollection.doc(),
            url: '',
            urlErrors: [],
        }
    },
    computed: {
        ...mapState(['currentUser']),
        ...mapGetters(['userProjectUrls']),
        allErrors() {
            return this.urlErrors
        },
        disabled() {
            if (this.allErrors.length > 0) {
                return true
            }
            return false
        },
        baseUrl() {
            return `${process.env.NUXT_ENV_DISPLAY_URL}/${this.currentUser.name}/projects/`
        },
    },
    methods: {
        clearErrors() {
            this.errors = []
        },
        validateUrl() {
            this.urlErrors = []
            if (!this.url || this.url.length === 0) {
                this.urlErrors.push('Please enter a url for the post.')
            } else if (!/^[0-9a-zA-Z_.-]+$/.test(this.url)) {
                this.urlErrors.push('No spaces allowed in the project url.')
            } else if (this.userProjectUrls.includes(this.url)) {
                this.urlErrors.push(
                    `A post at ${this.baseUrl}${this.url} already exists.` // TODO add a link to edit the existing post
                )
            }
        return this.urlErrors
        },
        isFormValid() {
            this.validateUrl()
            return !this.disabled
        },
        createProject() {
            this.clearErrors()
            if (this.isFormValid()) {
                try {
                    this.$store.dispatch('createProject', this.url)
                } catch (error) {
                    console.log(error)
                }
            }
        },
    },
}
</script>

<style scoped>
</style>