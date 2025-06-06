<script setup lang="ts">
const { item, isSelected = false } = defineProps<{
    item: StorageItem;
    isSelected?: boolean;
    openRenameModal: (item: StorageItem) => void
    openDeleteModal: (item: StorageItem) => void
}>();


const name = computed(() => {
    return (item.type === "FOLDER") ? item.name : `${item.name}.${item.mimeType}`
})

const size = computed(() => {
    return (item.type === "FILE") ? item.size : ''
})

function openContextMenu(e: MouseEvent) {
}

</script>

<template>
    <div class="cura-storage-item" :class="{ 'cura-storage-item--selected': isSelected }">

        <CuraContextMenu class="cura-context-menu">
            <div class="cura-context-menu-item" @click="openRenameModal(item)">
                <Icon name="material-symbols:edit" />
                <span>Переименовать</span>
            </div>
            <div class="cura-context-menu-item" @click="openDeleteModal(item)">
                <Icon name="material-symbols:delete" />
                <span>Удалить</span>
            </div>
        </CuraContextMenu>
        <div class="cura-storage-item__name">
            <div class="cura-storage-item__icon">
                <slot name="icon"></slot>
            </div>
            <span>{{ name || 'Unknown' }}</span>
        </div>
        <div class="cura-storage-item__modified">
            <span>{{ item.updatedAt || 'Unknown' }}</span>
        </div>
        <div class="cura-storage-item__size">
            <span>{{ size }}</span>
        </div>
        <div class="cura-storage-item__menu">
            <div class="cura-storage-item__menu-item" @mouseup="openContextMenu">
                <Icon name="material-symbols:more-vert" />
            </div>
        </div>

    </div>
</template>

<style>
.cura-storage-item {
    position: relative;
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr;
    border-radius: 8px;
    padding: 12px;
    background-color: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-surface);
    gap: 16px;
    align-items: center;
}

.cura-storage-item__name span {
    font-size: 16px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface);
}

.cura-storage-item__modified span {
    font-size: 14px;
    color: var(--md-sys-color-on-surface-variant);
    white-space: nowrap;
}

.cura-storage-item__icon {
    display: flex;
    align-items: center;
}

.cura-storage-item__menu {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.cura-storage-item__name {
    display: flex;
    align-items: center;
    gap: 8px;
}

.cura-storage-item__size {
    display: flex;
    align-items: center;
    gap: 8px;
}

.cura-storage-item:hover {
    background-color: var(--md-sys-color-surface-container-high);
}

.cura-storage-item__menu-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
}

.cura-storage-item__menu-item:hover {
    cursor: pointer;
    background-color: var(--md-sys-color-surface-bright);
}

.cura-storage-item--selected {
    background-color: var(--md-sys-color-surface-container-highest);
}

.cura-storage-item--selected:hover {
    background-color: var(--md-sys-color-surface-container-highest);
}

.cura-context-menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: var(--md-sys-color-surface-container);
    border-radius: 8px;
    padding: 8px;
    border: 1px solid var(--md-sys-color-outline-variant);
    width: 250px;
    color: var(--md-sys-color-on-surface);
}

.cura-context-menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
}

.cura-context-menu-item:hover {
    background-color: var(--md-sys-color-surface-container-high);
}
</style>
