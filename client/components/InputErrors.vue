<template>
    <div>
        <div v-for="error in errors" :key="error">
            <p class="text-pink-600 font-sm mt-1 px-2">
                {{ error }}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'input-errors',
    props: {
        errors: {
            default: () => [],
            type: Array,
        },
    },
}
</script>

<style>
</style>