<template>
    <div>
        <div class="px-4 py-3 sm:px-6">
            <errors :errors="errors" v-if="errors.length > 0" />
            <errors
                :errors="['Please correct all errors before proceeding.']"
                v-else-if="disabled"
            />
            <div class="sm:flex sm:flex-row-reverse" v-if="!isLoading">
                <button
                    type="button"
                    @click="$emit('save')"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:hover:bg-blue-500"
                    :disabled="errors.length > 0 || disabled"
                >
                    Save
                </button>

                <button
                    type="button"
                    @click="$emit('cancel')"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-100 text-base font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                    Cancel
                </button>
            </div>
            <div class="h-8 w-full rounded boder boder-indigo-300" v-else>
                <div
                    class="bar p-1 flex justify-end bg-gradient-to-r from-blue-400 to-blue-600 rounded"
                    :style="{ width: progress + '%' }"
                >
                    <span class="text-sm">{{ progress }}%</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Errors from '@/components/Errors'

export default {
    name: 'save-cancel',
    props: {
        isLoading: {
            default: false,
        },
        progress: {
            default: 0,
        },
        errors: {
            default: () => [],
        },
        disabled: {
            default: false,
        },
    },
    components: {
        Errors,
    },
}
</script>

<style scoped>
</style>