<template>
    <div
        v-if="visible"
        class="fixed z-10 inset-0 overflow-y-auto text-gray-300"
        @click="$emit('close')"
    >
        <div
            class="
                flex
                items-end
                justify-center
                min-h-screen
                mt-24
                pt-4
                px-4
                pb-20
                text-center
                sm:block sm:p-0
            "
        >
            <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-100 opacity-50"></div>
            </div>

            <!-- This element is to trick the browser into centering the modal contents. -->
            <span
                class="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
                >&#8203;</span
            >
            <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    -->
            <div
                class="
                    inline-block
                    align-bottom
                    rounded-lg
                    text-left
                    overflow-hidden
                    shadow-xl
                    transform
                    transition-all
                    sm:my-8 sm:align-middle
                "
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
                @click.stop=""
            >
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            visible: this.show,
        }
    },
    watch: {
        show(newvalue) {
            this.visible = newvalue
        },
    },
}
</script>

<style>
</style>