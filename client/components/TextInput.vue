<template>
    <div>
        <label class="block text-sm font-medium mt-2 mb-0">
            {{ label }}
        </label>
        <div class="mt-1">
            <input
                rows="3"
                class="shadow-sm focus:ring-gray-500 focus:border-gray-500 mt-1 p-2 block w-full text-sm bg-gray-800 rounded-md"
                :value="value"
                :placeholder="placeholder"
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
    name: 'text-input',
    props: ['label', 'value', 'placeholder'],
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