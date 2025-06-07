<script setup lang="ts">
import '~/assets/css/storage.css'
import ChecksumService from '~/lib/hashingService'
const hashingService = new ChecksumService()
const { loggedIn, user } = useUserSession()
const storageItemStore = useStorageItemStore()
const itemSelection = useItemSelectionStore("mystorage-item-selection")
const showDeleteModal = ref(false)
const showRenameModal = ref(false)
const storageItemNameModel = ref('')
const fileBeingRenamed = ref<StorageItem | null>(null)

const modalAction = ref<() => void>(() => { })

async function filesDropped(files: FileList) {
    console.log(files)
}

const showModal = ref(false)
const folderName = ref('')

function searchItemClicked(item: string) {
    console.log(item)
    showModal.value = true
}
function clickedOutsideModal() {
    showModal.value = false
}

function getItemIcon(storageItem: StorageItem) {
    return (storageItem.type === "FOLDER") ?
        "folder" :
        "file-present"
}

function itemDoubleClicked(storageItem: StorageItem) {
    if (storageItem.type === "FOLDER") {
        storageItemStore.openFolder(storageItem.parentId, storageItem.id, storageItem.name)
    }
}

function itemClicked(item: StorageItem) {
    itemSelection.add(item)
}

function createFolder() {
    if (folderName.value !== '') {
        storageItemStore.createFolder(folderName.value)
        showModal.value = false
    }
}

function renameFile() {
    if (fileBeingRenamed.value) {
        fileBeingRenamed.value.name = storageItemNameModel.value
        storageItemStore.updateFile(fileBeingRenamed.value)
        showRenameModal.value = false
    }
}

function openRenameModal(item: StorageItem) {
    showRenameModal.value = true
    storageItemNameModel.value = item.name
    fileBeingRenamed.value = item
}

function openDeleteModal(item: StorageItem) {
    modalAction.value = () => {
        storageItemStore.deleteItem(item)
        showDeleteModal.value = false
    }
    showDeleteModal.value = true
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
        <CuraModal modal-title="Создать папку" :show-modal="showModal" @clicked-outside="clickedOutsideModal"
            class="create-folder-modal-content">
            <CuraInput placeholder="Название папки" class="create-folder-modal-content__input" v-model="folderName">
            </CuraInput>
            <button class="cura-btn create-folder-modal-content__btn" @click="createFolder">Создать</button>
        </CuraModal>
        <CuraModal modal-title="Переименовать" :show-modal="showRenameModal" @clicked-outside="showRenameModal = false">
            <form class="rename-modal-content" @submit.prevent="renameFile">
                <CuraInput placeholder="Имя файла/папки" class="rename-modal-content__input"
                    v-model="storageItemNameModel">
                </CuraInput>
                <button class="cura-btn rename-modal-content__btn" @click="renameFile">Переименовать</button>
            </form>
        </CuraModal>
        <CuraModal modal-title="Подтверждение" :show-modal="showDeleteModal" @clicked-outside="showDeleteModal = false">
            <form class="rename-modal-content" @submit.prevent="renameFile">
                <p>Вы действительно хотите удалить файл/папку?</p>
                <div class="delete-modal-content__btns">
                    <button class="cura-btn rename-modal-content__btn" @click="modalAction()">Удалить</button>
                    <button class="cura-btn rename-modal-content__btn" @click="showDeleteModal = false">Отмена</button>
                </div>
            </form>
        </CuraModal>
        <CuraFileInfo name="test" path="test" v-if="false" />
        <div class="cura-selection-toolbar" v-if="false">
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
        <CuraStoragePath></CuraStoragePath>
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
        <DragNDropArea class="my-storage-files-container" @files-dropped="filesDropped">
            <CuraContextMenu class="cura-context-menu">
                <div class="cura-context-menu-item" @click="showModal = true">
                    <Icon name="material-symbols:create-new-folder" />
                    <span>Создать папку</span>
                </div>
            </CuraContextMenu>
            <CuraStorageItem v-for="item in storageItemStore.storageItems" :item="item"
                @dblclick="itemDoubleClicked(item)" @click="itemClicked(item)" :open-rename-modal="openRenameModal"
                :open-delete-modal="openDeleteModal">
                <template #icon>
                    <Icon :name="`material-symbols:${getItemIcon(item)}`" style="font-size: 20px;"></Icon>
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
