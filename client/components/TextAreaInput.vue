<template>
    <div>
        <label for="about" class="block text-sm font-medium">
            {{ label }}
        </label>
        <div class="mt-1">
            <textarea
                rows="3"
                class="p-3 shadow-sm focus:ring-gray-500 focus:border-gray-500 mt-1 block w-full sm:text-sm bg-gray-800 rounded-md"
                :placeholder="localValue"
                :value="localValue"
                @input="handleInput"
                @change="handleChange"
                @blur="$emit('blur')"
                @focus="$emit('focus')"
            ></textarea>
        </div>
    </div>
</template>

<script>
export default {
    name: 'text-area-input',
    props: ['label', 'value'],
    data() {
        return {
            localValue: this.value,
        }
    },
    methods: {
        mixin_autoResize_resize(event) {
            event.target.style.height = 'auto'
            event.target.style.height = `${event.target.scrollHeight}px`
        },
        handleInput(e) {
            this.mixin_autoResize_resize(e)
            this.$emit('input', e.target.value)
        },
        handleChange(e) {
            this.$emit('change', e.target.value)
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.$el.setAttribute(
                'style',
                'height',
                `${this.$el.scrollHeight}px`
            )
        })
    },
    watch: {
        value(newValue) {
            this.localValue = newValue
        },
    },
}
</script>

<style>
</style>