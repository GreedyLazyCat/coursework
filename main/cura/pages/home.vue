<script setup lang="ts">
import '~/assets/css/storage.css'

const itemStoreName = "home-item-store"
const fileManagerItemStoreName = "file-manager-item-store"
const itemSelectionStoreName = "home-item-selection"
const fileViewStoreName = "home-file-view-store"

const itemSelection = useItemSelectionStore(itemSelectionStoreName)
const itemStore = useStorageItemStore(itemStoreName)
const fileManagerItemStore = useStorageItemStore(fileManagerItemStoreName)

async function itemDoubleClicked(event: MouseEvent, item: StorageItem) {
    await fileManagerItemStore.openFolder(null, item.parentId, "")
    await navigateTo("/mystorage")
}
onMounted(async () => {
    await itemStore.loadLastModifiedItems()
})


</script>
<template>
    <div class="home-main-container">
        <h1>Рекомендации</h1>
        <div class="home-recommendations-container">
            Здесь возможно будут рекомендации...
        </div>
        <h1>Недавние файлы</h1>
        <div class="my-storage-grid-header">
            <div class="my-storage-grid-header-item">
                <span>Имя</span>
            </div>

            <div class="my-storage-grid-header-item">
                <span>Последнее изменение</span>
            </div>
            <div class="my-storage-grid-header-item">
                <span>Размер</span>
            </div>
            <div class="my-storage-grid-header-item my-storage-grid-header-item-actions">
                <Icon name="material-symbols:more-vert" />
            </div>

        </div>
        <CuraFileViewCore :item-store-name="itemStoreName" :selection-store-name="itemSelectionStoreName"
            :file-view-store-name="fileViewStoreName" @delete="" @rename="" @item-clicked=""
            @item-double-clicked="itemDoubleClicked" @move="" @files-dropped="" :move-enabled="false"
            :file-dragging-enabled="false" :context-menu-enabled="false"></CuraFileViewCore>
    </div>
</template>

<style>
.home-main-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
}

.home-main-container h1 {
    color: var(--md-sys-color-on-surface);
    font-size: 24px;
    font-weight: 600;
    margin: 0;
}

.home-recommendations-container {
    color: var(--md-sys-color-on-surface);
    font-size: 16px;
    font-weight: 400;
    margin: 0;
}


</style>
