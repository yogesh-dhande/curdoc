<template>
    <b-container>
        <code-editor/>
        <bokeh-app/>
    </b-container>
</template>


<script>
import CodeEditor from './CodeEditor.vue'
import BokehApp from './BokehApp.vue'

export default {
    name: 'split-vertical',
    components: {
        'code-editor': CodeEditor,
        'bokeh-app': BokehApp
    }
}
</script>

<style>

</style>