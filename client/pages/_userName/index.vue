<template>
    <div>
        {{ userName }}
    </div>
</template>

<script>
import { collection, getDocs, query, where } from 'firebase/firestore'

export default {
    async asyncData(context) {
        const returnData = {
            userName: context.params.userName,
            user: null,
        }
        const querySnapshot = await getDocs(
            query(
                collection(context.app.$firebase.db, 'users'),
                where('name', '==', returnData.userName)
            )
        )
        if (!querySnapshot.empty) {
            returnData.user = querySnapshot.docs[0].data()
        }

        return returnData
    },
}
</script>

<style>
</style>