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
        <slot name="context-menu"></slot>
        
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


</style>
