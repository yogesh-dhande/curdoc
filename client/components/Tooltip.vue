<template>
    <div class="flex flex-wrap">
        <div class="w-full text-center">
            <div
                ref="btnRef"
                class="ease-linear transition-all duration-150"
                @mouseenter="toggleTooltip()"
                @mouseleave="toggleTooltip()"
            >
                <slot></slot>
            </div>
            <div
                ref="tooltipRef"
                :class="{ hidden: !show, block: show }"
                class="
                    bg-gray-900
                    text-blue-400
                    border-0
                    ml-3
                    block
                    z-50
                    font-normal
                    leading-normal
                    text-sm
                    max-w-xs
                    text-left
                    no-underline
                    break-words
                    rounded-lg
                "
            >
                <div class="font-semibold px-3 py-2 rounded">
                    {{ tooltip }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createPopper } from '@popperjs/core'

export default {
    props: {
        tooltip: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            show: false,
        }
    },
    methods: {
        toggleTooltip() {
            if (this.show) {
                this.show = false
            } else {
                this.show = true
                createPopper(this.$refs.btnRef, this.$refs.tooltipRef, {
                    placement: 'top',
                })
            }
        },
    },
}
</script>