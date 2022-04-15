<template>
    <div>
        <div
            v-if="src"
            class="block rounded-full mx-auto w-full h-full bg-cover bg-center"
            :style="{
                backgroundImage: 'url(' + src + ')',
            }"
        ></div>
        <div v-else class="w-full h-full">
            <svg
                class="block rounded-full mx-auto bg-cover bg-center text-gray-300"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                />
            </svg>
        </div>
    </div>
</template>

<script>
export default {
    name: 'thumbnail',
    props: ['src'],
}
</script>

<style>
</style>