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
        <!-- <CuraFileInfo name="test" path="test" /> -->
        <div class="cura-selection-toolbar">
            <div class="cura-selection-toolbar-left-items">
                <div class="cura-icon-button">
                    <Icon name="material-symbols:close" class="icon" />
                </div>
                <span>Выбрано элементов: 1</span>
                <div class="cura-icon-button">
                    <Icon name="material-symbols:more-vert" class="icon" />
                </div>
            </div>
            <div class="cura-selection-toolbar-right-items">
            </div>
        </div>
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
                <Icon name="material-symbols:more-vert" class="icon" />
            </div>
        </div>
        <DragNDropArea class="my-storage-files-container">
            <CuraStorageItem isSelected>
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
.cura-selection-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    box-sizing: border-box;
    background-color: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-surface);
    border-top: 1px solid var(--md-sys-color-outline-variant);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    width: 100%;
}

.cura-selection-toolbar-left-items {
    display: flex;
    align-items: center;
    gap: 10px;
}

.cura-selection-toolbar-left-items .icon {
    font-size: 20px;
}

.cura-selection-toolbar-right-items {
    display: flex;
    align-items: center;
    gap: 10px;
}
.cura-icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
}
.cura-icon-button:hover {
    background-color: var(--md-sys-color-surface-container-highest);
    cursor: pointer;
}
.cura-icon-button .icon {
    font-size: 20px;
}
</style>
