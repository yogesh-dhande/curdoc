<template>
    <div class="mt-6 flex items-center">
        <div class="flex-shrink-0">
            <nuxt-link :to="link" custom v-slot="{ navigate }">
                <div @click="navigate" @keypress.enter="navigate" role="link">
                    <span class="sr-only">{{ name }}</span>
                    <thumbnail
                        class="rounded-full h-8 w-8 lg:h-10 lg:w-10"
                        :src="thumbnailUrl"
                    />
                </div>
            </nuxt-link>
        </div>
        <div class="ml-3">
            <div class="text-sm font-medium text-blue-100">
                <nuxt-link :to="link" class="hover:underline">
                    {{ name }}
                </nuxt-link>
            </div>
            <div v-if="date" class="flex space-x-1 text-sm text-indigo-200">
                <time>
                    {{ date }}
                </time>
            </div>
        </div>
    </div>
</template>

<script>
import Thumbnail from '@/components/Thumbnail'

export default {
    name: 'user-date-thumbnail',
    components: {
        Thumbnail,
    },
    props: {
        date: {
            type: String,
        },
        name: {
            type: String,
        },
        link: {
            type: String,
        },
        thumbnailUrl: {
            type: String,
        },
    },
}
</script>

<style>
</style>