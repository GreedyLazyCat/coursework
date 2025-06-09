<script setup lang="ts">
import '~/assets/css/storage.css'
const { loggedIn, user } = useUserSession()
const itemStoreName = ref("mystorage-item-store")
const storageItemStore = useStorageItemStore(itemStoreName.value)
const itemSelection = useItemSelectionStore("mystorage-item-selection")

const showModal = ref(false)

function searchItemClicked(item: string) {
    console.log(item)
    showModal.value = true
}
onMounted(() => {
    if (loggedIn.value && user.value && storageItemStore.currentPath.length === 0) {
        storageItemStore.rootId = user.value.rootItemId
        storageItemStore.openRootFolder()
    }
})

</script>

<template>
    <div class="page-main-container">
        <CuraFileInfo name="test" path="test" v-if="false" />
        <div class="cura-selection-toolbar" v-if="itemSelection.isNotEmpty">
            <div class="cura-selection-toolbar-left-items">
                <div class="cura-icon-button" @click="itemSelection.clear()">
                    <Icon name="material-symbols:close" class="icon" />
                </div>
                <span>Выбрано элементов: {{ itemSelection.length }}</span>
                <!-- <div class="cura-icon-button">
                    <Icon name="material-symbols:more-vert" class="icon" />
                </div> -->
            </div>
            <div class="cura-selection-toolbar-right-items">
            </div>
        </div>
        <CuraFileSearch class="my-storage-search" @searchItemClicked="searchItemClicked" />
        <CuraStoragePath :item-store-name="itemStoreName"></CuraStoragePath>
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
        <CuraFileView :item-store-name="itemStoreName" selection-store-name="mystorage-item-selection"></CuraFileView>
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

.create-folder-modal-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: end;
}

.create-folder-modal-content__btn {
    width: fit-content;
}

.create-folder-modal-content__input {
    width: 100%;
}


.rename-modal-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: end;
}

.rename-modal-content__btn {
    width: fit-content;
}

.rename-modal-content__input {
    width: 100%;
}

.delete-modal-content__btns {
    display: flex;
    gap: 8px;
}
</style>
