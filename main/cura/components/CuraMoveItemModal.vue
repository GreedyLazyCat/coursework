<script setup lang="ts">
const { loggedIn, user } = useUserSession()
const itemStoreName = ref("move-storage-item-modal")
const selectionStoreName = ref("move-storage-selection-modal")
const storageItemStore = useStorageItemStore("move-storage-item-modal")

onMounted(() => {
    if (loggedIn.value && user.value && storageItemStore.currentPath.length === 0) {
        storageItemStore.rootId = user.value.rootItemId
        storageItemStore.openRootFolder()
    }
})

</script>
<template>
    <CuraModal :show-modal="true">
        <CuraFileView :item-store-name="itemStoreName" :selection-store-name="selectionStoreName"></CuraFileView>
        <CuraStoragePath :item-store-name="itemStoreName"></CuraStoragePath>
    </CuraModal>
</template>