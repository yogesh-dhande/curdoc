<template>
  <div>
    <b-button-toolbar key-nav aria-label="Toolbar with button groups">
      <b-button-group class="mx-1">
        <b-button @click="$router.push('app')">Preview</b-button>
      </b-button-group>
    </b-button-toolbar>
  </div>
</template>

<script>
export default {
    name: 'toolbar',
};
</script>

<style>
</style>