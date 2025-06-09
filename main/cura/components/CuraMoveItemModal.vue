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
const itemStoreName = ref("move-storage-item-modal")
const selectionStoreName = ref("move-storage-selection-modal")
const storageItemStore = useStorageItemStore(itemStoreName.value)

function clicked() {
    emit('clickedOutside')
}

function moveItems() {
    if (storageItemStore.lastPathItem) {
        emit('moveConfirmed', storageItemStore.lastPathItem)
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
                @item-double-clicked="itemDoubleClicked" :selection-enabled="false" :context-menu-enabled="false"
                :file-dragging-enabled="false"></CuraFileViewCore>
            <p class="cura-move-item-modal-container__info">
                Файл будет перемещен в {{ `"${storageItemStore.lastPathItem?.name}"` }}
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
    gap: 8px;
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