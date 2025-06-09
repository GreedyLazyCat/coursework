<script setup lang="ts">

const {itemStoreName} = defineProps<{
    itemStoreName: string
}>()

const storageItemStore = useStorageItemStore(itemStoreName)

function isItemLast(item: PathItem) {
    return item === storageItemStore.lastPathItem
}


function itemClicked(item: PathItem) {
    storageItemStore.openFolder(item.parent_id, item.id, item.name)
}


</script>

<template>
    <div class="cura-storage-path">
        <div class="cura-storage-path__item" :class="{
            'cura-storage-path__item_with-arrow': !isItemLast(item),
            'cura-storage-path__item_not-clickable': isItemLast(item)
        }" v-for="item in storageItemStore.currentPath" :key="item.id"
            @click="(!isItemLast(item)) ? itemClicked(item) : null">
            {{ item.name }}
        </div>
    </div>
</template>


<style>
.cura-storage-path {
    display: flex;
    font-size: 24px;
    align-items: center;
    font-weight: 500;
    color: var(--md-sys-color-on-surface);
    margin: 0;
}

.cura-storage-path__item {
    cursor: pointer;
    display: flex;
    align-items: center;
}

.cura-storage-path__item_not-clickable {
    cursor: default;
}

.cura-storage-path__item_with-arrow::after {
    content: '>';
    padding: 0 8px;
    text-align: center;
}
</style>