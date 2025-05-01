<script setup lang="ts">
function filesDropped(files: FileList) {
    console.log(files)
}

function searchItemClicked(item: string) {
    console.log(item)
}
</script>

<template>
    <div class="my-storage-main-container">
        <CuraFileSearch class="my-storage-search" @searchItemClicked="searchItemClicked" />
        <div class="my-storage-text">
            <span>Мое хранилище</span>
        </div>
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
.my-storage-main-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    justify-content: stretch;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
}

.my-storage-search {
    box-sizing: border-box;
}

.my-storage-files-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    flex-grow: 999;
    box-sizing: border-box;
}


.my-storage-text {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface);
}

.my-storage-grid-header {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr;
    gap: 16px;
    color: var(--md-sys-color-on-surface-variant);
    padding: 0 16px;
}

.my-storage-grid-header-item {
    display: flex;
    align-items: center;
}

.my-storage-grid-header-item-actions {
    justify-content: flex-end;
}
</style>
