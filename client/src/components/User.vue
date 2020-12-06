<template>
<div>
    <b-list-group>    
        <b-list-group-item 
            v-for="project in user.projects" 
            :key="project.id"
            :to="`/${user.name}/${project.name}/code`"
        >    
        {{project.name}}
        </b-list-group-item>
    </b-list-group>
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
            ...mapState(['user'])
        },
        methods: {
            setUser(userName) {
                console.log("setting user")
                this.$store.dispatch("setUser", userName)
            }
        },
        mounted () {
            this.setUser(this.userName)
        },
    }
</script>