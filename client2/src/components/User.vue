<template>
<div>
    <h6>{{ user.name }}</h6>
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

    export default {
        name: 'user',
        props: {
            user: {
                type: Object
            }
        },
    }
</script>