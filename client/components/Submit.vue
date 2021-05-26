<template>
    <div>
        <errors :errors="errors" v-if="errors.length > 0" />
        <errors
            :errors="['Please correct all errors before proceeding.']"
            v-else-if="disabled"
        />
        <div v-if="!isLoading">
            <custom-button
                @click="() => $emit('click')"
                :disabled="errors.length > 0 || disabled"
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
    name: 'submit',
    props: {
        isLoading: {
            default: false,
        },
        errors: {
            default: () => [],
        },
        label: {
            default: 'Submit',
        },
        disabled: {
            default: false,
        },
    },
    components: {
        errors: Errors,
        'custom-button': CustomButton,
    },
}
</script>

<style>
</style>