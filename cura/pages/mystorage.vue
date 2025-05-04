<script setup lang="ts">
import '~/assets/css/storage.css'
function filesDropped(files: FileList) {
    console.log(files)
}

function searchItemClicked(item: string) {
    console.log(item)
}
</script>

<template>
    <div class="my-storage-main-container">
        <CuraFileInfo name="test" path="test" />
        <CuraFileSearch class="my-storage-search" @searchItemClicked="searchItemClicked" />
       
        <h1>Мое хранилище</h1>
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
        <DragNDropArea class="my-storage-files-container">
            <CuraStorageItem>
                <template #icon>
                    <Icon name="material-symbols:folder" style="font-size: 20px;"></Icon>
                </template>
            </CuraStorageItem>
            <CuraStorageItem>
                <template #icon>
                    <Icon name="material-symbols:file-present" style="font-size: 20px;"></Icon>
                </template>
            </CuraStorageItem>
        </DragNDropArea>
    </div>
</template>
<style>

</style>
