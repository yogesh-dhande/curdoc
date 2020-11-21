<template>
    <div class="container-fluid" style="padding-left: 0; padding-right: 0">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mx-auto">
                    <li class="nav-item active">
                        <a class="nav-link"><font-awesome-icon icon="seedling" size="lg" /> PySheets</a>
                    </li>
                </ul>
            </div>
        </nav>
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
        name: "Login",
        data() {
            return {};
        },
        components: {
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
