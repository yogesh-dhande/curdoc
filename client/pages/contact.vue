<template>
    <form-page>
        <form
            class="
                max-w-lg
                m-4
                py-6
                px-10
                bg-gray-900 bg-opacity-50
                rounded-lg
                shadow-xl
            "
        >
            <text-input
                v-if="!currentUser.email"
                v-model="feedback.email"
                label="Email"
            ></text-input>
            <text-area-input
                v-model="feedback.message"
                class="mt-3"
                label="Message"
            />
            <custom-button class="my-3" type="button" @click="saveFeedback"
                >Send Feedback</custom-button
            >
        </form>
    </form-page>
</template>

<script>
import { mapState } from 'vuex'
import TextInput from '@/components/TextInput'
import TextAreaInput from '@/components/TextAreaInput'
import FormPage from '@/components/FormPage'
import { doc, setDoc } from 'firebase/firestore'
import CustomButton from '../components/CustomButton.vue'

export default {
    components: {
        TextInput,
        TextAreaInput,
        FormPage,
        CustomButton,
    },
    data() {
        return {
            feedback: {
                email: '',
                message: '',
            },
        }
    },
    head() {
        return this.$createSEOMeta({
            title: 'Provide Feedback on Broccolini',
        })
    },
    computed: {
        ...mapState(['currentUser']),
    },
    methods: {
        async saveFeedback() {
            const feedback = {
                email: this.currentUser.email
                    ? this.currentUser.email
                    : this.feedback.email,
                message: this.feedback.message,
            }
            await setDoc(doc(this.$firebase.db, 'feedback'), feedback)

            this.feedback.message = ''
            this.$splitbee.track('Feedback', feedback)
            this.$router.push('/dashboard')
        },
    },
}
</script>

<style>
</style>