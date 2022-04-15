<template>
    <div
        class="mx-auto bg-gray-800 min-h-screen flex flex-1 justify-center pt-10 text-gray-300"
    >
        <div class="text-blue-100 w-full h-full leading-loose">
            <div class="max-w-lg mx-auto">
                <slot> </slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'form-page',
}
</script>

<style>
</style>