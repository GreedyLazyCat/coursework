<script lang="ts" setup>
import { render } from 'vue';
import { errorMessages } from 'vue/compiler-sfc';

const {
    itemStoreName = "storage-item-store",
    selectionStoreName = "selection-store",
    fileViewStoreName = "filew-view-store",
    fileDraggingEnabled = true,
    moveEnabled = true,
    contextMenuEnabled = true,
} = defineProps<{
    itemStoreName?: string;
    selectionStoreName?: string;
    fileViewStoreName?: string;
    fileDraggingEnabled?: boolean;
    moveEnabled?: boolean;
    contextMenuEnabled?: boolean;
    selectionEnabled?: boolean;
}>()
const emit = defineEmits<{
    (e: "itemClicked", event: MouseEvent, item: StorageItem): void;
    (e: "itemDoubleClicked", event: MouseEvent, item: StorageItem): void;
    (e: "rename", item: StorageItem): void;
    (e: "delete", item: StorageItem): void;
    (e: 'filesDropped', files: FileList): void;
}>()
const storageItemStore = useStorageItemStore(itemStoreName)
const itemSelection = useItemSelectionStore(selectionStoreName)
const fileViewStore = useFileViewStore(fileViewStoreName)

function getItemIcon(storageItem: StorageItem) {
    return (storageItem.type === "FOLDER") ?
        "folder" :
        "file-present"
}

function itemDoubleClicked(event: MouseEvent, item: StorageItem) {
    emit("itemDoubleClicked", event, item)
}

function itemClicked(event: MouseEvent, item: StorageItem) {
    emit('itemClicked', event, item)
}

function filesDropped(files: FileList) {
    emit('filesDropped', files)
}
function pageClicked(event: MouseEvent) {
    if (event.target === event.currentTarget) {
        itemSelection.clear()
    }
}

function openRenameModal(item: StorageItem) {
    emit("rename", item)
}

function openDeleteModal(item: StorageItem) {
    emit("delete", item)
}
</script>
<template>

    <DragNDropArea class="my-storage-files-container" @files-dropped="filesDropped"
        :file-dragging-enabled="fileDraggingEnabled">
        <CuraContextMenu class="cura-context-menu" @click="pageClicked">
            <div class="cura-context-menu-item cura-context-menu-item--hoverable"
                @click="fileViewStore.openCreateFolderModal()">
                <Icon name="material-symbols:create-new-folder" />
                <span>Создать папку</span>
            </div>
        </CuraContextMenu>
        <CuraStorageItem v-for="item in storageItemStore.storageItems" :item="item"
            @dblclick="itemDoubleClicked($event, item)" @click="itemClicked($event, item)"
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
                        @click.stop="(moveEnabled) ? fileViewStore.openMoveModal() : null" v-if="moveEnabled">
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