<script setup lang="ts">
defineProps<{
    lastModified?: string;
}>();
</script>

<template>
    <div class="cura-storage-item">

        <div class="cura-storage-item__name">
            <div class="cura-storage-item__icon">
                <slot name="icon"></slot>
            </div>
            <span>test.txt</span>
        </div>
        <div class="cura-storage-item__modified">
            <span>{{ lastModified || 'Unknown' }}</span>
        </div>
        <div class="cura-storage-item__size">
            <span>100 KB</span>
        </div>
        <div class="cura-storage-item__menu">
            <Icon name="material-symbols:more-vert" />
            <slot name="menu"></slot>
        </div>
    </div>
</template>

<style>
.cura-storage-item {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr;
    border-radius: 8px;
    padding: 16px;
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
.cura-storage-item__name{
    display: flex;
    align-items: center;
    gap: 8px;
}

.cura-storage-item__size{
    display: flex;
    align-items: center;
    gap: 8px;
}


</style>
