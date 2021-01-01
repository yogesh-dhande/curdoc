<template>
    <b-container style="max-width: 25rem">
        <b-card class="mt-5">
            <b-card-body>
                <section id="firebaseui-auth-container"></section>
            </b-card-body>
        </b-card>
    </b-container>
</template>

<script>
import * as firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export default {
    name: 'login',
    data() {
        return {}
    },
    mounted() {
        let ui = firebaseui.auth.AuthUI.getInstance()
        if (!ui) {
            ui = new firebaseui.auth.AuthUI(firebase.auth())
        }
        let uiConfig = {
            signInSuccessUrl: this.$route.query.redirect || '/',
            signInFlow: 'popup',
            signInOptions: [
                {
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    requireDisplayName: true,
                },
                {
                    provider: firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
                    requireDisplayName: true,
                },
            ],
        }
        ui.start('#firebaseui-auth-container', uiConfig)
    },
}
</script>

<style>
@font-face {
    font-family: 'Roboto Light';
    src: url('../assets/Roboto-Light.ttf');
}
</style>
