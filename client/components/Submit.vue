<template>
    <div>
        <errors v-if="errors.length > 0" :errors="errors" />
        <errors
            v-else-if="disabled"
            :errors="['Please correct all errors before proceeding.']"
        />
        <div v-if="!isLoading">
            <custom-button
                :disabled="errors.length > 0 || disabled"
                @click="() => $emit('click')"
                >{{ label }}</custom-button
            >
        </div>
        <div v-else>
            <custom-button disabled> Please wait... </custom-button>
        </div>
    </div>
</template>

<script>
import Errors from '@/components/Errors'
import CustomButton from '@/components/CustomButton'

export default {
    name: 'Submit',
    components: {
        errors: Errors,
        'custom-button': CustomButton,
    },
    props: {
        isLoading: {
            type: Boolean,
            default: false,
        },
        errors: {
            type: Array,
            default: () => [],
        },
        label: {
            type: String,
            default: 'Submit',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style>
</style>