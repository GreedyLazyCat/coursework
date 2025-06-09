<script setup lang="ts">
import '~/assets/css/storage.css'
const { loggedIn, user } = useUserSession()

const itemSelectionStoreName = "file-manager-item-selection"
const itemSelection = useItemSelectionStore(itemSelectionStoreName)

const showModal = ref(false)

function searchItemClicked(item: string) {
    console.log(item)
    showModal.value = true
}



</script>

<template>
    <div class="page-main-container">
        <div class="cura-selection-toolbar" v-if="itemSelection.isNotEmpty">
            <div class="cura-selection-toolbar-left-items">
                <div class="cura-icon-button" @click="itemSelection.clear()">
                    <Icon name="material-symbols:close" class="icon" />
                </div>
                <span>Выбрано элементов: {{ itemSelection.length }}</span>
            </div>
            <div class="cura-selection-toolbar-right-items">
            </div>
        </div>
        <CuraFileInfo name="test" path="test" v-if="false" />

        <CuraFileSearch class="my-storage-search" @searchItemClicked="searchItemClicked" />

        <CuraFileManager></CuraFileManager>
    </div>
</template>
<style>
.cura-icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
}

.cura-icon-button:hover {
    background-color: var(--md-sys-color-surface-container-highest);
    cursor: pointer;
}

.cura-icon-button .icon {
    font-size: 20px;
}

.create-folder-modal-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: end;
}

.create-folder-modal-content__btn {
    width: fit-content;
}

.create-folder-modal-content__input {
    width: 100%;
}


.rename-modal-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: end;
}

.rename-modal-content__btn {
    width: fit-content;
}

.rename-modal-content__input {
    width: 100%;
}

.delete-modal-content__btns {
    display: flex;
    gap: 8px;
}
</style>
