<template>
    <div class="block">
        <slot name="button">
            <button
                class="text-pink-500 hover:text-pink-700"
                @click="modalVisible = true"
            >
                <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                </svg>
            </button>
        </slot>
        <modal :show="modalVisible" @close="modalVisible = false">
            <div
                class="
                    sm:max-w-lg sm:w-full
                    bg-white
                    px-4
                    pt-5
                    pb-4
                    sm:p-6 sm:pb-4
                "
            >
                <div class="sm:flex sm:items-start">
                    <div
                        class="
                            mx-auto
                            flex-shrink-0 flex
                            items-center
                            justify-center
                            h-12
                            w-12
                            rounded-full
                            bg-red-100
                            sm:mx-0 sm:h-10 sm:w-10
                        "
                    >
                        <!-- Heroicon name: outline/exclamation -->
                        <svg
                            class="h-6 w-6 text-red-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <slot name="message"></slot>
                </div>
            </div>
            <div
                class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
            >
                <button
                    type="button"
                    class="
                        w-full
                        inline-flex
                        justify-center
                        rounded-md
                        border border-transparent
                        shadow-sm
                        px-4
                        py-2
                        bg-red-600
                        text-base
                        font-medium
                        text-white
                        hover:bg-red-700
                        focus:outline-none
                        focus:ring-2
                        focus:ring-offset-2
                        focus:ring-red-500
                        sm:ml-3 sm:w-auto sm:text-sm
                    "
                    @click="clicked"
                >
                    Delete
                </button>
                <button
                    type="button"
                    class="
                        mt-3
                        w-full
                        inline-flex
                        justify-center
                        rounded-md
                        border border-gray-300
                        shadow-sm
                        px-4
                        py-2
                        bg-white
                        text-base
                        font-medium
                        text-gray-700
                        hover:bg-gray-50
                        focus:outline-none
                        focus:ring-2
                        focus:ring-offset-2
                        focus:ring-indigo-500
                        sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
                    "
                    @click="cancel"
                >
                    Cancel
                </button>
            </div>
            <errors :errors="errors" />
        </modal>
    </div>
</template>

<script>
import Modal from '@/components/Modal'
import Errors from '@/components/Errors'
export default {
    components: {
        Modal,
        Errors,
    },
    props: {
        errors: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            modalVisible: false,
        }
    },
    methods: {
        cancel() {
            this.modalVisible = false
            this.$emit('clear')
        },
        clicked() {
            this.$emit('click')
        },
        modalClick(e) {
            e.preventDefault()
            e.stopPropagation()
        },
    },
}
</script>

<style>
</style>