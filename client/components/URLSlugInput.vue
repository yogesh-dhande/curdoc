<template>
    <div class="col-span-3 sm:col-span-2 text-sm">
        <label v-if="label" class="block font-medium mt-2 mb-1">
            {{ label }}
        </label>
        <div class="flex rounded-md shadow-sm">
            <span
                class="inline-flex items-center px-3 rounded-l-md bg-gray-900"
            >
                {{ prefix }}
            </span>
            <input
                type="text"
                class="focus:ring-gray-500 focus:border-gray-500 flex-1 block w-full rounded-none rounded-r-md bg-gray-700 bg-opacity-25 p-2"
                :placeholder="value"
                :value="value"
                @input="handleInput"
                @change="handleChange"
                @blur="$emit('blur')"
                @focus="$emit('focus')"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: 'url-slug-input',
    props: ['label', 'value', 'prefix'],
    methods: {
        handleInput(e) {
            this.$emit('input', e.target.value)
        },
        handleChange(e) {
            this.$emit('change', e.target.value)
        },
    },
}
</script>

<style>
</style>