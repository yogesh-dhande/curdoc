<template>
    <div>
        <label
            for="about"
            class="block text-sm font-medium text-blue-100 mt-2 mb-0"
        >
            {{ label }}
        </label>
        <div class="mt-1">
            <input
                required
                type="password"
                name="password"
                autocomplete="current-password"
                rows="3"
                class="shadow-sm focus:ring-gray-500 focus:border-gray-500 mt-1 p-2 block w-full text-sm bg-gray-800 rounded-md"
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
    name: 'password-input',
    props: ['label', 'value'],
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