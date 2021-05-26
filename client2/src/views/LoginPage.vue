<template>
    <div>
        <b-card
            class="col-md-4 offset-md-4"
            bg-variant="dark"
            text-variant="white"
        >
            <b-tabs
                fill
                active-nav-item-class="bg-info"
                nav-class="bg-dark rounded-sm"
            >
                <b-tab
                    title="Log In"
                    active
                    title-link-class="text-white rounded-sm"
                >
                    <login> </login>
                </b-tab>
                <b-tab title="Sign Up" title-link-class="text-white rounded-sm">
                    <sign-up></sign-up>
                </b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>

<script>
import SignUp from '@/components/SignUp'
import Login from '@/components/Login'

export default {
    name: 'login-page',
    components: {
        SignUp,
        Login,
    },
}
</script>

<style>
</style>