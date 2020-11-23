<template>
    <div class="container-fluid" style="padding-left: 0; padding-right: 0">
        <nav-bar></nav-bar>
        <div class="container-fluid">
            <div class="row row-no-gutters" style="margin-top: 100px">
                <div id="col-start" class="col-xs-6 col-md-4 align-self-center"></div>
                <div id="col-info" class="col-xs-6 col-md-4 align-self-center">
                    <div class="card">
                        <h5 class="card-header">Log in</h5>
                        <div class="card-body">
                            <section id="firebaseui-auth-container"></section>
                        </div>
                    </div>
                </div>
                <div id="col-end" class="col-xs-6 col-md-4 align-self-center"></div>
            </div>
        </div>

    </div>
</template>

<script>
    import firebase from "firebase";
    import * as firebaseui from "firebaseui";
    import "firebaseui/dist/firebaseui.css";
    import NavBar from './NavBar.vue'

    export default {
        name: "login",
        components: {
            'nav-bar': NavBar,
        },
        data() {
            return {};
        },
        mounted() {
            let ui = firebaseui.auth.AuthUI.getInstance();
            if (!ui) {
                ui = new firebaseui.auth.AuthUI(firebase.auth());
            }
            let uiConfig = {
                signInSuccessUrl: "/profile",
                signInFlow: "popup",
                signInOptions: [
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
                ]
            };
            ui.start("#firebaseui-auth-container", uiConfig);
        }
    };
</script>

<style>
    @font-face {
        font-family: "Roboto Light";
        src: url("../assets/Roboto-Light.ttf");
    }
</style>
