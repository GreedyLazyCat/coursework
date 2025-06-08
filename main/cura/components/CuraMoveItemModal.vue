<script setup lang="ts">
const { loggedIn, user } = useUserSession()
const storageItemStore = useStorageItemStore("move-storage-item-modal")

onMounted(() => {
    if (loggedIn.value && user.value && storageItemStore.currentPath.length === 0) {
        storageItemStore.rootId = user.value.rootItemId
        storageItemStore.openRootFolder()
    }
})

</script>
<template>
    
</template>