<script setup lang="ts">
const { showModal = false, modalTitle = '', class: contentClass = '' } = defineProps<{
    showModal?: boolean,
    modalTitle?: string,
    class?: string
}>()



const emit = defineEmits<{
    clickedOutside: []
}>()
const overlayRef = useTemplateRef('overlayRef')

function clicked(e: MouseEvent) {
    if (e.target === overlayRef.value) {
        emit('clickedOutside')
    }
}

onMounted(() => {
    document.addEventListener('mousedown', clicked)
})
onUnmounted(() => {
    document.removeEventListener('mousedown', clicked)
})


</script>
<template>
    <ClientOnly>
        <Teleport to="#modal-teleports">
            <Transition name="modal">
                <div ref="overlayRef" class="cura-modal-overlay" v-if="showModal">
                    <div class="cura-modal">
                        <div class="cura-modal__header">
                            <h3 class="cura-modal__title">{{ modalTitle }}</h3>
                            <span class="cura-modal__close-btn" @click="emit('clickedOutside')">
                                <Icon name="material-symbols:close"></Icon>
                            </span>
                        </div>
                        <div class="cura-modal__content" :class="contentClass">
                            <slot></slot>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </ClientOnly>
</template>

<style>
.cura-modal-overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.441);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
}

.cura-modal {
    display: flex;
    flex-direction: column;
    width: 300px;
    border: 1px solid var(--md-sys-color-outline-variant);
    background-color: var(--md-sys-color-surface-container);
    z-index: 250;
    border-radius: 8px;
    color: var(--md-sys-color-on-surface);
    padding: 8px;
}

.modal-leave-to,
.modal-enter-from {
    scale: 1.2;
    opacity: 0;
}

.modal-leave-active,
.modal-enter-active {
    transition: all 0.1s ease;
}

.cura-modal__header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
}

.cura-modal__title {
    font-size: 20px;
    color: var(--md-sys-color-on-surface);
    margin: 0;
}

.cura-modal__content {
    padding: 8px;
}

.cura-modal__close-btn {
    color: var(--md-sys-color-on-surface);
    cursor: pointer;
}
</style>