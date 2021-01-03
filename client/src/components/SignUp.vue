<template>
    <div>
        <form class="mt-3">
            <b-form-group>
                <b-form-input
                    v-model.trim="name"
                    @input="clearErrors"
                    type="text"
                    name="name"
                    placeholder="Username"
                    required
                ></b-form-input>
            </b-form-group>

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

            <b-form-group>
                <b-form-input
                    v-model.trim="password"
                    type="password"
                    password="password"
                    placeholder="Password"
                    required
                />
            </b-form-group>

            <b-form-group>
                <b-form-input
                    v-model.trim="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm password"
                    required
                />
            </b-form-group>

            <b-button
                variant="info"
                @click.prevent="register"
                type="submit"
                v-if="!isLoading"
                block
                class="rounded-sm"
            >
                Submit
            </b-button>
            <b-button variant="info" block disabled v-else>
                Please wait...
            </b-button>

            <br />

            <div class="alert alert-danger" v-if="hasErrors">
                <div v-for="error in errors" :key="error">
                    {{ error }}
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { auth, usersCollection } from './../firebaseConfig'
// import axios from 'axios'

export default {
    name: 'sign-up',
    data() {
        return {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            errors: [],
            isLoading: false,
        }
    },
    computed: {
        hasErrors() {
            return this.errors.length > 0
        },
    },
    methods: {
        register() {
            // on each new attempt clear the old errors
            this.errors = []
            if (this.isFormValid()) {
                // set loading class to true
                this.isLoading = true

                usersCollection
                    .where('name', '==', this.name)
                    .get()
                    .then((snap) => {
                        if (snap.size > 0) {
                            this.errors.push(
                                `Username ${this.name} is already taken.`
                            )
                            this.isLoading = false
                        } else {
                            auth.createUserWithEmailAndPassword(
                                this.email,
                                this.password
                            )
                                .then((response) => {
                                    console.log(response)
                                    // set the user's name and display name
                                    let user = response.user
                                    let userDoc = {
                                        name: this.name,
                                        id: user.uid,
                                        email: user.email,
                                    }
                                    usersCollection
                                        .doc(user.uid)
                                        .set(userDoc)
                                        .then(() => {
                                            //  create store and save user
                                            this.$store.commit(
                                                'setCurrentUser',
                                                userDoc
                                            )
                                            this.$router.push('/')
                                            this.isLoading = false
                                        })
                                        .catch((error) => {
                                            this.errors.push(error.message)
                                            // set loading class to true
                                            this.isLoading = false
                                        })
                                })
                                .catch((error) => {
                                    this.errors.push(error.message)
                                    // set loading class to true
                                    this.isLoading = false
                                })
                        }
                    })
                    .catch((error) => {
                        this.errors.push(error.message)
                    })
            }
        },
        isEmpty() {
            if (
                this.name.length == 0 ||
                this.email.length == 0 ||
                this.password.length == 0 ||
                this.password_confirmation.length == 0
            ) {
                return true
            }
            return false
        },
        passwordValid() {
            if (this.password !== this.password_confirmation) {
                return false
            }
            return true
        },
        isFormValid() {
            if (!/^[0-9a-zA-Z_.-]+$/.test(this.name)) {
                this.errors.push('No spaces allowed in the username.')
            }
            if (this.isEmpty()) {
                this.errors.push('Please complete all fields.')
                return false
            }
            if (!this.passwordValid()) {
                this.errors.push('Passwords do not match.')
                return false
            }
            return true
        },
        clearErrors() {
            this.errors = []
        },
    },
}
</script>