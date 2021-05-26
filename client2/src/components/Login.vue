<template>
    <div>
        <b-form class="mt-3">
            <b-form-group>
                <b-form-input
                    v-model.trim="email"
                    @input="clearErrors"
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                />
            </b-form-group>
            <b-form-group class="form-group">
                <b-form-input
                    v-model.trim="password"
                    type="password"
                    password="password"
                    placeholder="Password"
                    required
                />
            </b-form-group>
            <b-button
                variant="info"
                @click.prevent="login"
                type="submit"
                block
                class="rounded-sm"
                :disabled="isLoading"
            >
                {{ isLoading ? 'Please wait...' : 'Submit' }}
            </b-button>

            <b-button class="float-right" @click.prevent="fp" variant="link">
                <span class="text-dark" v-if="!fpform">Forgot password?</span>
                <span class="close" v-else>&times;</span>
            </b-button>
            <br />
            <div class="alert alert-danger" v-if="hasErrors">
                <div v-for="error in errors" :key="error">{{ error }}</div>
            </div>
        </b-form>
        <!-- forgot password form -->
        <div v-if="fpform" class="mt-3">
            <b-button class="float-right" @click.prevent="fp" variant="link">
            </b-button>
            <b-input-group>
                <b-form-input
                    v-model.trim="forgot_password"
                    type="email"
                    name="forgot_password"
                    placeholder="Email to send password reset link"
                />
                <b-input-group-append>
                    <b-button
                        @click.prevent="forgotPassword"
                        variant="warning"
                        class="rounded-sm"
                        v-if="!isLoading"
                    >
                        Submit
                    </b-button>
                    <b-button variant="secondary" v-else disabled>
                        Please wait...
                    </b-button>
                </b-input-group-append>
            </b-input-group>
        </div>
        <b-form>
            <!-- show errors -->
            <div class="alert alert-danger" v-if="hasErrors">
                <div v-for="error in errors" :key="error">{{ error }}</div>
            </div>
        </b-form>
    </div>
</template>
<script>
import { auth, usersCollection } from './../firebaseConfig'

export default {
    name: 'login',
    data() {
        return {
            email: '',
            password: '',
            forgot_password: '',
            fpform: false,
            errors: [],
            loading: false,
            usersRef: usersCollection,
            isLoading: false,
        }
    },
    computed: {
        hasErrors() {
            return this.errors.length > 0
        },
    },
    methods: {
        login() {
            console.log('login')
            this.errors = []
            if (!this.isFormValid()) {
                this.isLoading = true
                auth.signInWithEmailAndPassword(this.email, this.password)
                    .then(() => {
                        this.$router.push('/')
                        this.isLoading = false
                    })
                    .catch((error) => {
                        this.errors.push(error.message)
                        this.isLoading = false
                    })
            }
        },
        isFormValid() {
            if (
                this.email.length > 0 &&
                this.email.length <= 6 &&
                this.password.length > 0 &&
                this.password.length <= 6
            ) {
                return true
            }
            return false
        },
        forgotPassword() {
            console.log('forgot password', this.forgot_password)
            auth.sendPasswordResetEmail(this.forgot_password)
                .then(() => {
                    this.fpform = false
                    alert('Check your email for password reset link')
                    this.$router.push('/')
                })
                .catch((error) => {
                    alert(error.message)
                })
        },
        fp() {
            return (this.fpform = !this.fpform)
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