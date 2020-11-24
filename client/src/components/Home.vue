<template>
<b-container>
    <b-card
        style="max-width: 20rem;"
        class="mb-2">
        <b-form inline>
            <b-form-input v-model="projectName"></b-form-input>
            <b-button @click="createProject">New</b-button>
        </b-form>
    </b-card>
</b-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'home',
    data () {
        return {
            projectName: ''
        }
    },
    computed: {
        ...mapState(['user'])
    },
    methods: {
        createProject () {
            this.$router.push(`${this.user}/${this.projectName}/code`)
        },

        dec2hex (dec) {
        return dec < 10
            ? '0' + String(dec)
            : dec.toString(16)
        },
        // generateId :: Integer -> String
        generateId (len) {
            var arr = new Uint8Array((len || 40) / 2)
            window.crypto.getRandomValues(arr)
            return Array.from(arr, this.dec2hex).join('')
        }
    }

}
</script>

<style>

</style>