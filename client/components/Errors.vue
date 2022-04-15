<template>
    <div
        class="text-pink-600 font-medium rounded mt-1 px-2"
        v-if="errors.length > 0"
    >
        <div v-for="error in errors" :key="error">
            {{ error }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'errors',
    props: ['errors'],
}
</script>

<style>
</style>