<script lang="ts" setup>

const {
    itemStoreName = "storage-item-store",
    selectionStoreName = "selection-store",
    fileDraggingEnabled = true,
    moveEnabled = true,
    contextMenuEnabled = true,
    selectionEnabled = true
} = defineProps<{
    itemStoreName?: string;
    selectionStoreName?: string;
    fileDraggingEnabled?: boolean;
    moveEnabled?: boolean;
    contextMenuEnabled?: boolean;
    selectionEnabled?: boolean;
}>()
const { loggedIn, user } = useUserSession()
const storageItemStore = useStorageItemStore(itemStoreName)
const itemSelection = useItemSelectionStore(selectionStoreName)
const showRenameModal = ref(false)
const showMoveModal = ref(false)
const storageItemNameModel = ref('')
const fileBeingRenamed = ref<StorageItem | null>(null)
const simpleModal = reactive({
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
    if(!selectionEnabled){
        return
    }
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
    simpleModal.action = async () => {
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
        simpleModal.showModal = false
    }
    simpleModal.showModal = true
    simpleModal.actionName = "Удалить"
    simpleModal.title = "Подверждение"
    simpleModal.text = "Вы действительно хотите удалить этот файл/папку?"
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
    <DragNDropArea class="my-storage-files-container" @files-dropped="filesDropped"
        :file-dragging-enabled="fileDraggingEnabled">
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
        <CuraModal :modal-title="simpleModal.title" :show-modal="simpleModal.showModal"
            @clicked-outside="simpleModal.showModal = false">
            <form class="rename-modal-content" @submit.prevent>
                <p>{{ simpleModal.text }}</p>
                <div class="delete-modal-content__btns">
                    <button class="cura-btn rename-modal-content__btn" @click="simpleModal.action()">{{
                        simpleModal.actionName }}</button>
                    <button class="cura-btn rename-modal-content__btn"
                        @click="simpleModal.showModal = false">Отмена</button>
                </div>
            </form>
        </CuraModal>
        <CuraMoveItemModal :show-modal="showMoveModal" @clicked-outside="showMoveModal = false"></CuraMoveItemModal>
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
                <CuraContextMenu class="cura-context-menu" v-if="contextMenuEnabled">
                    <div class="cura-context-menu-item" @click.stop="openRenameModal(item)" :class="{
                        'cura-context-menu-item--disabled': itemSelection.length > 1,
                        'cura-context-menu-item--hoverable': itemSelection.length <= 1
                    }">
                        <Icon name="material-symbols:edit" />
                        <span>Переименовать</span>
                    </div>
                    <div class="cura-context-menu-item cura-context-menu-item--hoverable"
                        @click.stop="openDeleteModal(item)">
                        <Icon name="material-symbols:delete" />
                        <span>Удалить</span>
                    </div>
                    <div class="cura-context-menu-item cura-context-menu-item--hoverable"
                        @click.stop="showMoveModal = true && moveEnabled" v-if="moveEnabled">
                        <Icon name="material-symbols:drive-file-move" />
                        <span>Переместить</span>
                    </div>
                </CuraContextMenu>
            </template>
            <template #icon>
                <Icon :name="`material-symbols:${getItemIcon(item)}`" style="font-size: 20px;"></Icon>
            </template>
        </CuraStorageItem>

    </DragNDropArea>
</template>