<script setup lang="ts">
import '~/assets/css/storage.css'

const itemSelection = useItemSelectionStore("home")

onMounted(()=>{
})


</script>
<template>
    <div class="home-main-container">
        <h1>Рекомендации</h1>
        <div class="home-recommendations-container">
            Здесь возможно будут рекомендации...
        </div>
        <h1>Недавние файлы</h1>
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
                <Icon name="material-symbols:more-vert" />
            </div>
        </div>
        <DragNDropArea class="my-storage-files-container">
            <CuraStorageItem>
                <template #icon>
                    <Icon name="material-symbols:folder" style="font-size: 20px;"></Icon>
                </template>
            </CuraStorageItem>
            <CuraStorageItem>
                <template #icon>
                    <Icon name="material-symbols:file-present" style="font-size: 20px;"></Icon>
                </template>
            </CuraStorageItem>
        </DragNDropArea>
    </div>
</template>

<style> 
.home-main-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
}

.home-main-container h1 {
    color: var(--md-sys-color-on-surface);
    font-size: 24px;
    font-weight: 600;
    margin: 0;
}

.home-recommendations-container {
    color: var(--md-sys-color-on-surface);
    font-size: 16px;
    font-weight: 400;
    margin: 0;
}
</style>
