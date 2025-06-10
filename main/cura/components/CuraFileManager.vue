<script lang="ts" setup>

const { loggedIn, user } = useUserSession()

const itemStoreName = "file-manager-item-store"
const itemSelectionStoreName = "file-manager-item-selection"
const fileViewStoreName = "file-manager-file-view-store"

const storageItemStore = useStorageItemStore(itemStoreName)
const itemSelection = useItemSelectionStore(itemSelectionStoreName)
const fileViewStore = useFileViewStore(fileViewStoreName)

const storageItemNameModel = ref('')

async function filesDropped(files: FileList) {
    console.log(files)
}

const folderName = ref('')


function itemDoubleClicked(event: MouseEvent, storageItem: StorageItem) {
    if (storageItem.type === "FOLDER") {
        storageItemStore.openFolder(storageItem.parentId, storageItem.id, storageItem.name)
        itemSelection.clear()
    }
}

function itemClicked(event: MouseEvent, item: StorageItem, rightBtn: boolean) {
    if (!event.ctrlKey && !itemSelection.hasItem(item)) {
        itemSelection.clear()
    }
    itemSelection.add(item)
}

async function moveConfirmed(pathItem: PathItem) {
    for (const storageItem of itemSelection.selectedItems) {
        if (storageItem.parentId === pathItem.id) {
            continue
        }
        storageItem.parentId = pathItem.id
        await storageItemStore.updateFile(storageItem)
        storageItemStore.deleteItemClientSide(storageItem)
    }
    itemSelection.clear()
    fileViewStore.closeMoveModal()
}

function createFolder() {
    if (folderName.value !== '') {
        storageItemStore.createFolder(folderName.value)
        fileViewStore.closeCreateFolderModal()
    }
}

function renameFile() {
    if (fileViewStore.fileBeingRenamed) {
        fileViewStore.fileBeingRenamed.name = storageItemNameModel.value
        storageItemStore.updateFile(fileViewStore.fileBeingRenamed)
        fileViewStore.closeRenameModal()
    }
}

function openRenameModal(item: StorageItem) {
    if (itemSelection.length > 1) {
        return
    }
    fileViewStore.openRenameModal()
    storageItemNameModel.value = item.name
    fileViewStore.fileBeingRenamed = item
}

function openDeleteModal(item: StorageItem) {
    fileViewStore.simpleModal.action = async () => {
        if (itemSelection.isNotEmpty) {
            for (const selectionItem of itemSelection.selectedItems) {
                await storageItemStore.deleteItem(selectionItem)
            }
            itemSelection.clear()
        }
        else {
            itemSelection.removeById(item.id)
            storageItemStore.deleteItem(item)
        }
        fileViewStore.simpleModal.showModal = false
    }
    fileViewStore.simpleModal.showModal = true
    fileViewStore.simpleModal.actionName = "Удалить"
    fileViewStore.simpleModal.title = "Подверждение"
    fileViewStore.simpleModal.text = "Вы действительно хотите удалить этот файл/папку?"
}

function openMoveModal(item: StorageItem) {
    fileViewStore.openMoveModal()
}

function pageClicked(event: MouseEvent) {
    if (event.target === event.currentTarget) {
        itemSelection.clear()
    }
}

onMounted(() => {
    if (loggedIn.value && user.value && storageItemStore.currentPath.length === 0) {
        storageItemStore.rootId = user.value.rootItemId
        storageItemStore.openRootFolder()
    }
})
</script>
<template>
    <div class="cura-file-manager">
        
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
        <div class="cura-file-manager__file-view">
            <CuraModal modal-title="Создать папку" :show-modal="fileViewStore.showCreateFolderModal"
                @clicked-outside="fileViewStore.closeCreateFolderModal()">
                <form class="create-folder-modal-content" @submit.prevent>
                    <CuraInput placeholder="Название папки" class="create-folder-modal-content__input"
                        v-model="folderName">
                    </CuraInput>
                    <button class="cura-btn create-folder-modal-content__btn" @click="createFolder">Создать</button>
                </form>
            </CuraModal>
            <CuraModal modal-title="Переименовать" :show-modal="fileViewStore.showRenameModal"
                @clicked-outside="fileViewStore.closeRenameModal()">
                <form class="rename-modal-content" @submit.prevent="renameFile">
                    <CuraInput placeholder="Имя файла/папки" class="rename-modal-content__input"
                        v-model="storageItemNameModel">
                    </CuraInput>
                    <button class="cura-btn rename-modal-content__btn" @click="renameFile">Переименовать</button>
                </form>
            </CuraModal>
            <CuraModal :modal-title="fileViewStore.simpleModal.title" :show-modal="fileViewStore.simpleModal.showModal"
                @clicked-outside="fileViewStore.simpleModal.showModal = false">
                <form class="rename-modal-content" @submit.prevent>
                    <p>{{ fileViewStore.simpleModal.text }}</p>
                    <div class="delete-modal-content__btns">
                        <button class="cura-btn rename-modal-content__btn"
                            @click="fileViewStore.simpleModal.action()">{{
                                fileViewStore.simpleModal.actionName }}</button>
                        <button class="cura-btn rename-modal-content__btn"
                            @click="fileViewStore.simpleModal.showModal = false">Отмена</button>
                    </div>
                </form>
            </CuraModal>
            <CuraMoveItemModal :show-modal="fileViewStore.showMoveModal"
                @clicked-outside="fileViewStore.closeMoveModal()" @move-confirmed="moveConfirmed"></CuraMoveItemModal>
            <CuraFileViewCore :item-store-name="itemStoreName" :selection-store-name="itemSelectionStoreName"
                :file-view-store-name="fileViewStoreName" @delete="openDeleteModal" @rename="openRenameModal"
                @item-clicked="itemClicked" @item-double-clicked="itemDoubleClicked" @move="openMoveModal">
            </CuraFileViewCore>
        </div>
    </div>

</template>
<style>
.cura-file-manager {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    height: 100%;
}

.cura-file-manager__file-view {
    height: 100%;
    position: relative;
}

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
</style>