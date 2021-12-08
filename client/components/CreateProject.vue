<template>
    <card
        class="
            flex
            justify-center
            shadow
            bg-gray-900
            text-blue-100
            px-2
            pt-4
            pb-8
        "
    >
        <h2 class="text-blue-300 my-1">Create New</h2>

        <div class="flex">
            <url-slug-input
                v-model="slug"
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

        <input-errors :errors="slugErrors"></input-errors>
    </card>
</template>

<script>
import URLSlugInput from '@/components/URLSlugInput'
import Card from '@/components/Card'
import { mapState, mapGetters } from 'vuex'

export default {
    components: {
        'url-slug-input': URLSlugInput,
        Card,
    },
    data() {
        return {
            slug: '',
            slugErrors: [],
        }
    },
    computed: {
        ...mapState(['currentUser']),
        ...mapGetters(['userprojectSlugs']),
        allErrors() {
            return this.slugErrors
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
        validateSlug() {
            this.slugErrors = []
            if (!this.slug || this.slug.length === 0) {
                this.slugErrors.push('Please enter a URL slug for the project.')
            } else if (!/^[0-9a-zA-Z_.-]+$/.test(this.slug)) {
                this.slugErrors.push('No spaces allowed in the project slug.')
            } else if (this.userprojectSlugs.includes(this.slug)) {
                this.slugErrors.push(
                    `A project at ${this.baseUrl}${this.slug} already exists.` // TODO add a link to edit the existing project
                )
            }
            return this.slugErrors
        },
        isFormValid() {
            this.validateSlug()
            return !this.disabled
        },
        createProject() {
            this.clearErrors()
            if (this.isFormValid()) {
                try {
                    this.$store.dispatch('createProject', this.slug)
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