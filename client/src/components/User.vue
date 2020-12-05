<template>
<div>
    <h1>{{currentUser}}</h1>
    <h3 v-for="project in projects" :key="project.refKey"> {{project.name}} </h3>
</div>
</template>

<script>
import { mapState } from 'vuex'

    export default {
        name: 'user',
        props: {
            userName: {
                type: String
            }
        },
        computed: {
            ...mapState(['currentUser', 'projects'])
        },
        watch: {
            '$route': (to, from) => {
                console.log(to, from)
            }
        }
    }
</script>