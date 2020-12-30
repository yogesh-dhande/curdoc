<template>
    <b-container>
        <b-card style="max-width: 40rem" class="mx-auto">
            <!-- <b-card-header>Please Provide Feedback</b-card-header> -->
            <b-container>
                <b-form @submit="onSubmit" v-if="show">
                    <b-form-group
                        id="feedback-group"
                        label="How can I improve your experience while using this website?"
                        label-for="feedback-input"
                    >
                        <b-form-textarea
                            id="feedback-input"
                            v-model="form.feedback"
                            rows="3"
                        >
                        </b-form-textarea>
                    </b-form-group>

                    <hr />

                    <h5>
                        Rate the following features to help shape the feature
                        roadmap
                    </h5>
                    <b-form-group
                        v-for="(feature, i) in form.features"
                        :key="i"
                        :label="feature.text"
                        :label-for="feature.text"
                    >
                        <b-input-group :id="feature.text">
                            <b-input-group-prepend>
                                <b-button @click="feature.value = null"
                                    >Clear</b-button
                                >
                            </b-input-group-prepend>
                            <b-form-rating
                                v-model="feature.value"
                                color="#ff8800"
                            ></b-form-rating>
                            <b-input-group-append>
                                <b-input-group-text
                                    class="justify-content-center"
                                    style="min-width: 3em"
                                >
                                    {{ feature.value }}
                                </b-input-group-text>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                    <hr />
                    <b-form-checkbox
                        id="okTofollowUp-input"
                        v-model="form.okTofollowUp"
                    >
                        Is it ok to follow up with you to learn more about your
                        feedback?
                    </b-form-checkbox>

                    <b-form-group
                        id="email-group"
                        label="Email (optional)"
                        label-for="email-input"
                    >
                        <b-form-input
                            id="email-input"
                            v-model="form.email"
                            type="email"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                        id="name-group"
                        label="Name (optional)"
                        label-for="name-input"
                    >
                        <b-form-input
                            id="name-input"
                            v-model="form.name"
                            type="text"
                        ></b-form-input>
                    </b-form-group>

                    <b-button variant="warning" type="submit">Submit</b-button>
                </b-form>
            </b-container>
        </b-card>
    </b-container>
</template>

<script>
export default {
    name: 'feedback',
    data() {
        return {
            form: {
                email: '',
                name: '',
                feedback: '',
                okTofollowUp: false,
                features: [
                    { text: 'Private projects', value: null },
                    { text: 'Multi-file projects', value: null },
                    { text: 'Intelligent code completion', value: null },
                    {
                        text: 'Secure storage of secrets (e.g. API keys)',
                        value: null,
                    },
                    { text: 'Persistant storage for each user', value: null },
                    {
                        text: 'Persistant storage for each project',
                        value: null,
                    },
                    { text: 'Version control (git)', value: null },
                ],
            },
            show: true,
        }
    },
    methods: {
        onSubmit() {
            // evt.preventDefault()
            console.log(this.form)
            alert(JSON.stringify(this.form))
            this.$router.push('/')
        },
    },
}
</script>

<style>
</style>