<template>
    <iframe
        :key="url"
        :src="url"
        class="min-h-screen"
        height="100%"
        width="100%"
    ></iframe>
</template>

<script>
export default {
    props: {
        url: {
            type: String,
            default: null,
        },
    },
}
</script>