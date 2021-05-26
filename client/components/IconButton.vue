<template>
    <button
        class="mx-2 p-1.5 rounded text-gray-400 h-8 w-8 hover:text-gray-300"
        @click="$emit('click')"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'icon-button',
    props: ['tooltip'],
}
</script>

<style>
</style>