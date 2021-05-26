<template>
    <div>
        {{ userName }}
    </div>
</template>

<script>
export default {
    async asyncData(context) {
        let returnData = {
            userName: context.params.userName,
            user: null,
        }

        let querySnapshot = await context.app.$usersCollection
            .where('name', '==', returnData.userName)
            .get()

        if (!querySnapshot.empty) {
            returnData.user = querySnapshot.docs[0].data()
        }

        return returnData
    },
}
</script>

<style>
</style>