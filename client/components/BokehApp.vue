<template>
    <iframe
        :key="script"
        :src="script"
        class="min-h-screen mx-auto"
        height="100%"
        width="100%"
    ></iframe>
</template>

<script>
export default {
    props: {
        script: {
            type: String,
            default: null,
        },
    },
}
</script>