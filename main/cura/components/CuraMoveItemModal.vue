<script setup lang="ts">

const props = defineProps<{
    showModal?: boolean;
}>()

const { showModal } = toRefs(props)

const emit = defineEmits<{
    clickedOutside: [],
    moveConfirmed: [pathItem: PathItem]
}>()

const { loggedIn, user } = useUserSession()
const itemStoreName = "move-storage-item-modal"
const selectionStoreName = "move-storage-selection-modal"
const storageItemStore = useStorageItemStore(itemStoreName)
const selectionStore = useItemSelectionStore(selectionStoreName)

const movePlace = computed(() => {
    if (selectionStore.isNotEmpty) {
        return selectionStore.first.name
    }
    return storageItemStore.lastPathItem?.name
})

function clicked() {
    selectionStore.clear()
    emit('clickedOutside')
}

function moveItems() {
    if (selectionStore.isNotEmpty) {
        const pathItem: PathItem = {
            id: selectionStore.first.id,
            parent_id: selectionStore.first.parentId,
            name: selectionStore.first.name
        }
        selectionStore.clear()
        emit('moveConfirmed', pathItem)
        return
    }
    if (storageItemStore.lastPathItem) {
        selectionStore.clear()
        emit('moveConfirmed', storageItemStore.lastPathItem)
    }
}

function itemClicked(event: MouseEvent, item: StorageItem, rightBtn: boolean) {
    if (selectionStore.hasItem(item)) {
        selectionStore.clear()
        return
    }
    else {
        selectionStore.clear()
        selectionStore.add(item)
    }
}

function itemDoubleClicked(event: MouseEvent, storageItem: StorageItem) {
    if (storageItem.type === "FOLDER") {
        storageItemStore.openFolder(storageItem.parentId, storageItem.id, storageItem.name)
    }
}




watch(showModal, (newValue, oldValue) => {
    if (newValue && loggedIn.value && user.value) {
        storageItemStore.rootId = user.value.rootItemId
        storageItemStore.openRootFolder()
    }
})

onMounted(() => {
    if (loggedIn.value && user.value && storageItemStore.currentPath.length === 0) {
        storageItemStore.rootId = user.value.rootItemId
        storageItemStore.openRootFolder()
    }
})

</script>
<template>
    <CuraModal :show-modal="showModal" @clicked-outside="clicked">
        <div class="cura-move-item-modal-container">
            <CuraStoragePath :item-store-name="itemStoreName"></CuraStoragePath>
            <CuraFileViewCore :item-store-name="itemStoreName" :selection-store-name="selectionStoreName"
                @item-double-clicked="itemDoubleClicked" @item-clicked="itemClicked" :context-menu-enabled="false"
                :file-dragging-enabled="false"></CuraFileViewCore>
            <p class="cura-move-item-modal-container__info">
                Файл будет перемещен в {{ `"${movePlace}"` }}
            </p>
            <div class="cura-move-item-modal-container__btns">
                <button class="cura-btn" @click.stop="moveItems">Переместить</button>
            </div>
        </div>
    </CuraModal>
</template>

<style>
.cura-move-item-modal-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 600px;
}

.cura-move-item-modal-container__info {
    padding: 0;
    margin: 0;
}

.cura-move-item-modal-container__btns {
    display: flex;
    justify-content: end;
}
</style>