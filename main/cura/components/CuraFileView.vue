<script lang="ts" setup>
const { itemStoreName = "storage-item-store", selectionStoreName = "selection-store" } = defineProps<{
    itemStoreName?: string;
    selectionStoreName?: string;
}>()
const { loggedIn, user } = useUserSession()
const storageItemStore = useStorageItemStore(itemStoreName)
const itemSelection = useItemSelectionStore(selectionStoreName)
const showRenameModal = ref(false)
const storageItemNameModel = ref('')
const fileBeingRenamed = ref<StorageItem | null>(null)
const modal = reactive({
    showModal: false,
    action: () => { },
    title: "",
    text: "",
    actionName: ""
})


async function filesDropped(files: FileList) {
    console.log(files)
}

const showModal = ref(false)
const folderName = ref('')


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
        itemSelection.clear()
    }
}

function itemClicked(event: MouseEvent, item: StorageItem) {
    if (!event.ctrlKey) {
        itemSelection.clear()
    }
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
    if (itemSelection.length > 1) {
        return
    }
    showRenameModal.value = true
    storageItemNameModel.value = item.name
    fileBeingRenamed.value = item
}

function openDeleteModal(item: StorageItem) {
    modal.action = async () => {
        if (itemSelection.isNotEmpty) {
            for (const selectionItem of itemSelection.selectedItems) {
                await storageItemStore.deleteItem(selectionItem)
            }
            itemSelection.clear()
        }
        else {
            itemSelection.remove(item)
            storageItemStore.deleteItem(item)

        }
        modal.showModal = false
    }
    modal.showModal = true
    modal.actionName = "Удалить"
    modal.title = "Подверждение"
    modal.text = "Вы действительно хотите удалить этот файл/папку?"
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
    <DragNDropArea class="my-storage-files-container" @files-dropped="filesDropped">
        <CuraModal modal-title="Создать папку" :show-modal="showModal" @clicked-outside="clickedOutsideModal">
            <form class="create-folder-modal-content" @submit.prevent>
                <CuraInput placeholder="Название папки" class="create-folder-modal-content__input" v-model="folderName">
                </CuraInput>
                <button class="cura-btn create-folder-modal-content__btn" @click="createFolder">Создать</button>
            </form>
        </CuraModal>
        <CuraModal modal-title="Переименовать" :show-modal="showRenameModal" @clicked-outside="showRenameModal = false">
            <form class="rename-modal-content" @submit.prevent="renameFile">
                <CuraInput placeholder="Имя файла/папки" class="rename-modal-content__input"
                    v-model="storageItemNameModel">
                </CuraInput>
                <button class="cura-btn rename-modal-content__btn" @click="renameFile">Переименовать</button>
            </form>
        </CuraModal>
        <CuraModal :modal-title="modal.title" :show-modal="modal.showModal" @clicked-outside="modal.showModal = false">
            <form class="rename-modal-content" @submit.prevent>
                <p>{{ modal.text }}</p>
                <div class="delete-modal-content__btns">
                    <button class="cura-btn rename-modal-content__btn" @click="modal.action()">{{
                        modal.actionName }}</button>
                    <button class="cura-btn rename-modal-content__btn" @click="modal.showModal = false">Отмена</button>
                </div>
            </form>
        </CuraModal>
        <CuraContextMenu class="cura-context-menu" @click="pageClicked">
            <div class="cura-context-menu-item cura-context-menu-item--hoverable" @click="showModal = true">
                <Icon name="material-symbols:create-new-folder" />
                <span>Создать папку</span>
            </div>
        </CuraContextMenu>
        <CuraStorageItem v-for="item in storageItemStore.storageItems" :item="item" @dblclick="itemDoubleClicked(item)"
            @click="itemClicked($event, item)" :open-rename-modal="openRenameModal" :open-delete-modal="openDeleteModal"
            :is-selected="itemSelection.hasItem(item)">
            <template #context-menu>
                <CuraContextMenu class="cura-context-menu">
                    <div class="cura-context-menu-item" @click.stop="openRenameModal(item)" :class="{
                        'cura-context-menu-item--disabled': itemSelection.length > 1,
                        'cura-context-menu-item--hoverable': itemSelection.length === 1
                    }">
                        <Icon name="material-symbols:edit" />
                        <span>Переименовать</span>
                    </div>
                    <div class="cura-context-menu-item cura-context-menu-item--hoverable"
                        @click.stop="openDeleteModal(item)">
                        <Icon name="material-symbols:delete" />
                        <span>Удалить</span>
                    </div>
                </CuraContextMenu>
            </template>
            <template #icon>
                <Icon :name="`material-symbols:${getItemIcon(item)}`" style="font-size: 20px;"></Icon>
            </template>
        </CuraStorageItem>

    </DragNDropArea>
</template>