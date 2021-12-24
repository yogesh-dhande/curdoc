<template>
    <form-page>
        <h1
            class="
                text-center text-2xl
                tracking-tight
                font-extrabold
                text-blue-100
                sm:text-3xl
                md:text-5xl
            "
        >
            Build and share
            <span class="block text-blue-400"> Bokeh applications </span>
        </h1>
        <form
            class="
                max-w-lg
                m-4
                pt-6
                pb-12
                px-10
                bg-gray-900 bg-opacity-25
                rounded-lg
                shadow-xl
            "
        >
            <div class="mt-3">
                <label class="block text-sm font-medium mt-2 mb-0">
                    Email
                </label>
                <div class="mt-1">
                    <input
                        id="email"
                        v-model="email"
                        name="email"
                        type="email"
                        autocomplete="email"
                        required
                        rows="3"
                        class="
                            shadow-sm
                            focus:ring-gray-500 focus:border-gray-500
                            mt-1
                            p-2
                            block
                            w-full
                            text-sm
                            bg-gray-800
                            rounded-md
                        "
                        @focus="clearErrors"
                    />
                </div>
            </div>
            <div v-if="!fpform">
                <password-input
                    v-if="!fpform"
                    v-model="password"
                    class="mt-3"
                    label="Password"
                    @input="clearErrors"
                ></password-input>
                <submit
                    class="mt-3"
                    :is-loading="isLoading"
                    :errors="errors"
                    label="Sign In"
                    @click="login"
                />
            </div>
            <div v-else>
                <submit
                    class="mt-3"
                    :is-loading="isLoading"
                    :errors="errors"
                    label="Send Password Reset Link"
                    @click="forgotPassword"
                />
            </div>

            <div class="py-1 sm:px-6 text-sm font-medium">
                <span class="float-left">
                    <nuxt-link
                        to="/register"
                        class="
                            p-1
                            inline-flex
                            justify-center
                            rounded
                            hover:underline
                            outline-none
                            focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
                        "
                    >
                        <span>Sign Up</span>
                    </nuxt-link>
                </span>
                <span class="float-right">
                    <button
                        ref="fpButton"
                        type="submit"
                        class="
                            p-1
                            inline-flex
                            justify-center
                            rounded
                            hover:underline
                            outline-none
                            focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
                        "
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
import {
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export default {
    components: {
        submit: Submit,
        FormPage,
        'password-input': PasswordInput,
    },
    beforeRouteLeave(to, from, next) {
        // Reset internal state when leaving the page so avoid confusion
        this.fpform = false
        next()
    },
    middleware: 'guest',
    asyncData(context) {
        return {
            redirect: context.query.redirect
                ? context.query.redirect
                : '/dashboard',
        }
    },
    data() {
        return {
            email: '',
            password: '',
            fpform: false,
            errors: [],
            loading: false,
            isLoading: false,
        }
    },
    head() {
        return this.$createSEOMeta({
            title: 'Sign In to Brocoolini',
        })
    },
    computed: {
        hasErrors() {
            return this.errors.length > 0
        },
    },
    methods: {
        async login() {
            this.errors = []
            this.isLoading = true
            try {
                const userCredential = await signInWithEmailAndPassword(
                    this.$firebase.auth,
                    this.email,
                    this.password
                )
                this.$splitbee.track('Log In')

                console.log(userCredential)
                console.log(userCredential.user)
                console.log(userCredential.user.uid)
                this.$store.commit('SET_AUTH_STATE', userCredential.user)

                const snap = await getDoc(
                    doc(this.$firebase.db, 'users', userCredential.user.uid)
                )
                console.log('setting user data')
                console.log(snap.data())
                this.$store.commit('SET_USER', snap.data() || {})
                this.$router.push(this.redirect)
            } catch (error) {
                this.errors.push(error.message)
                this.$splitbee.track('Error', { errors: this.errors })
            } finally {
                this.isLoading = false
            }
        },

        forgotPassword() {
            this.errors = []
            this.isLoading = true
            sendPasswordResetEmail(this.$firebase.auth, this.email)
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
            this.$refs.fpButton.blur()
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