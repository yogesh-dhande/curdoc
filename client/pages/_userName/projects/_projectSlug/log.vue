<template>
    <FormPage>
        <h1
            class="
                text-center text-2xl
                tracking-tight
                font-extrabold
                text-blue-100
                sm:text-3xl
                md:text-5xl
                my-4
                sm:my-8
            "
        >
            Log
        </h1>
        <card class="bg-gray-900 whitespace-pre-wrap max-w-lg mx-auto">
            {{ logs }}
        </card></FormPage
    >
</template>

<script>
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState(['logs']),
    },
}
</script>

<style>
</style>