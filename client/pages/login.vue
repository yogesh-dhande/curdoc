<template>
    <form-page>
        <h1
            class="text-center text-2xl tracking-tight font-extrabold text-blue-100 sm:text-3xl md:text-5xl"
        >
            Build and share
            <span class="block text-blue-400"> Bokeh applications </span>
        </h1>
        <form
            class="max-w-lg m-4 pt-6 pb-12 px-10 bg-gray-900 bg-opacity-25 rounded-lg shadow-xl"
        >
            <div class="mt-3">
                <label class="block text-sm font-medium mt-2 mb-0">
                    Email
                </label>
                <div class="mt-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autocomplete="email"
                        required
                        rows="3"
                        class="shadow-sm focus:ring-gray-500 focus:border-gray-500 mt-1 p-2 block w-full text-sm bg-gray-800 rounded-md"
                        v-model="email"
                        @focus="clearErrors"
                    />
                </div>
            </div>
            <div v-if="!fpform">
                <password-input
                    class="mt-3"
                    v-if="!fpform"
                    label="Password"
                    v-model="password"
                    @input="clearErrors"
                ></password-input>
                <submit
                    class="mt-3"
                    :isLoading="isLoading"
                    :errors="errors"
                    @click="login"
                    label="Sign In"
                />
            </div>
            <div v-else>
                <submit
                    class="mt-3"
                    :isLoading="isLoading"
                    :errors="errors"
                    @click="forgotPassword"
                    label="Send Password Reset Link"
                />
            </div>

            <div class="py-1 sm:px-6 text-sm font-medium">
                <span class="float-left">
                    <nuxt-link
                        to="/register"
                        class="p-1 inline-flex justify-center rounded hover:underline outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                    >
                        <span>Sign Up</span>
                    </nuxt-link>
                </span>
                <span class="float-right">
                    <button
                        ref="fpButton"
                        type="submit"
                        class="p-1 inline-flex justify-center rounded hover:underline outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                        @click.prevent="fp"
                    >
                        <span v-if="!fpform">Forgot password?</span>
                        <span v-else>Login</span>
                    </button>
                </span>
            </div>
        </form>
    </form-page>
</template>
<script>
import Submit from '@/components/Submit'
import FormPage from '@/components/FormPage'
import PasswordInput from '@/components/PasswordInput'

export default {
    name: 'login',
    components: {
        submit: Submit,
        FormPage,
        'password-input': PasswordInput,
    },
    middleware: 'guest',
    head() {
        return this.$createSEOMeta({
            title: 'Sign In to REPL Notes',
        })
    },
    data() {
        return {
            email: '',
            password: '',
            fpform: false,
            errors: [],
            loading: false,
            usersRef: this.$usersCollection,
            isLoading: false,
        }
    },
    asyncData(context) {
        return {
            redirect: context.query.redirect
                ? context.query.redirect
                : '/dashboard',
        }
    },
    computed: {
        hasErrors() {
            return this.errors.length > 0
        },
    },
    beforeRouteLeave(to, from, next) {
        // Reset internal state when leaving the page so avoid confusion
        this.fpform = false
        next()
    },
    methods: {
        login() {
            this.errors = []
            this.isLoading = true
            this.$fire.auth
                .signInWithEmailAndPassword(this.email, this.password)
                .then((userCredential) => {
                    this.$fire.analytics.logEvent(
                        this.$analyticsEvents.LOGIN,
                        userCredential.user.toJSON()
                    )
                    this.$store.commit('SET_AUTH_STATE', userCredential.user)

                    this.$router.push(this.redirect)
                })
                .catch((error) => {
                    this.errors.push(error.message)
                })
                .finally(() => (this.isLoading = false))
        },

        forgotPassword() {
            this.errors = []
            this.isLoading = true
            this.$fire.auth
                .sendPasswordResetEmail(this.email)
                .then(() => {
                    this.fpform = false
                    alert('Check your email for password reset link')
                    this.$router.push('/')
                })
                .catch((error) => {
                    this.errors.push(error.message)
                })
                .finally(() => (this.isLoading = false))
        },
        fp() {
            this.fpform = !this.fpform
            this.errors = []
            this.$refs['fpButton'].blur()
        },
        clearErrors() {
            this.errors = []
        },
    },
}
</script>
<style>
.btn,
.jumbotron {
    border-radius: 0px;
}
</style>