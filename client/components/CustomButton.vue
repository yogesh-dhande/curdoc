<template>
    <button
        class="
            w-full
            inline-flex
            justify-center
            py-2
            px-4
            border border-transparent
            shadow-sm
            text-md
            font-bold
            rounded-md
            text-white
            hover:text-blue-100
            bg-gradient-to-r
            from-blue-500
            to-blue-400
            hover:from-blue-600 hover:to-blue-600
            focus:ring-4 focus:ring-indigo-200 focus:bg-blue-600
            disabled:opacity-50
        "
        @click="(e) => $emit('click', e)"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {}
</script>

<style>
</style>