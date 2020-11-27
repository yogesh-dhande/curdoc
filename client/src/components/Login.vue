<template>
    <div class="container-fluid" style="padding-left: 0; padding-right: 0">
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

    export default {
        name: "login",
        data() {
            return {};
        },
        mounted() {
            let ui = firebaseui.auth.AuthUI.getInstance();
            if (!ui) {
                ui = new firebaseui.auth.AuthUI(firebase.auth());
            }
            let uiConfig = {
                signInSuccessUrl: "/",
                signInFlow: "popup",
                signInOptions: [
                    {
                        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                        requireDisplayName: true,
                    }, {
                        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                        requireDisplayName: true,
                    }, {
                        provider: firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
                        requireDisplayName: true,
                    }
                ],  
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
