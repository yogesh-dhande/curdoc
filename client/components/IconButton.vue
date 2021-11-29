<template>
    <button class="text-blue-100 hover:text-blue-400" @click="$emit('click')">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'IconButton',
    props: {
        tooltip: {
            type: String,
            default: '',
        },
    },
}
</script>

<style>
</style>